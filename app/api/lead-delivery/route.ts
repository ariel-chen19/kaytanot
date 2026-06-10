import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;

type DeliveryChannel = "google_sheets" | "whatsapp_digest" | "external_webhook" | "admin_email";

interface DeliveryJob {
  id: string;
  lead_id: string;
  camp_id: string | null;
  channel: DeliveryChannel;
  status: string;
  payload: Record<string, unknown>;
  attempts: number;
}

interface DeliveryResult {
  ok: boolean;
  skipped?: boolean;
  message?: string;
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.LEAD_DELIVERY_SECRET || process.env.CRON_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-cron-secret");

  return authHeader === `Bearer ${secret}` || headerSecret === secret;
}

function getNestedValue(payload: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, payload);
}

function getText(payload: Record<string, unknown>, path: string): string {
  const value = getNestedValue(payload, path);
  return typeof value === "string" ? value : "";
}

function buildLeadRow(payload: Record<string, unknown>): Record<string, string> {
  return {
    created_at: new Date().toISOString(),
    lead_id: getText(payload, "lead.id"),
    camp_name: getText(payload, "lead.camp_name"),
    parent_name: getText(payload, "lead.parent_name"),
    parent_email: getText(payload, "lead.parent_email"),
    parent_phone: getText(payload, "lead.parent_phone"),
    message: getText(payload, "lead.message"),
    source_page: getText(payload, "lead.source_page"),
    utm_source: getText(payload, "lead.utm_source"),
    utm_medium: getText(payload, "lead.utm_medium"),
    utm_campaign: getText(payload, "lead.utm_campaign"),
  };
}

async function postJson(url: string, body: unknown): Promise<DeliveryResult> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return {
      ok: false,
      message: `HTTP ${response.status}${text ? `: ${text.slice(0, 300)}` : ""}`,
    };
  }

  return { ok: true };
}

async function deliverGoogleSheets(payload: Record<string, unknown>): Promise<DeliveryResult> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const sheetId = getText(payload, "sheet_id");
  const tabName = getText(payload, "tab_name") || "Leads";

  if (!webhookUrl) {
    return { ok: false, message: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" };
  }

  if (!sheetId) {
    return { ok: false, message: "Missing Google Sheet ID" };
  }

  return postJson(webhookUrl, {
    sheet_id: sheetId,
    tab_name: tabName,
    row: buildLeadRow(payload),
  });
}

async function deliverExternalWebhook(payload: Record<string, unknown>): Promise<DeliveryResult> {
  const webhookUrl = getText(payload, "webhook_url");

  if (!webhookUrl) {
    return { ok: false, message: "Missing external webhook URL" };
  }

  return postJson(webhookUrl, payload);
}

async function deliverWhatsapp(payload: Record<string, unknown>): Promise<DeliveryResult> {
  const webhookUrl = process.env.WHATSAPP_DELIVERY_WEBHOOK_URL;
  const ownerWhatsapp = getText(payload, "owner_whatsapp");
  const frequency = getText(payload, "frequency");

  if (!ownerWhatsapp) {
    return { ok: false, message: "Missing owner WhatsApp number" };
  }

  if (frequency !== "immediate") {
    return { ok: true, skipped: true, message: `Waiting for ${frequency || "digest"} delivery` };
  }

  if (!webhookUrl) {
    return { ok: false, message: "WHATSAPP_DELIVERY_WEBHOOK_URL is not configured" };
  }

  return postJson(webhookUrl, {
    to: ownerWhatsapp,
    lead: getNestedValue(payload, "lead"),
  });
}

async function deliverJob(job: DeliveryJob): Promise<DeliveryResult> {
  switch (job.channel) {
    case "google_sheets":
      return deliverGoogleSheets(job.payload);
    case "external_webhook":
      return deliverExternalWebhook(job.payload);
    case "whatsapp_digest":
      return deliverWhatsapp(job.payload);
    default:
      return { ok: true, skipped: true, message: `Unsupported delivery channel: ${job.channel}` };
  }
}

async function updateJobResult(job: DeliveryJob, result: DeliveryResult) {
  const supabase = createAdminClient();
  const attempts = job.attempts + 1;

  if (result.ok) {
    await supabase
      .from("lead_delivery_jobs")
      .update({
        status: result.skipped ? "skipped" : "sent",
        attempts,
        sent_at: result.skipped ? null : new Date().toISOString(),
        error: result.message ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    return;
  }

  const exhausted = attempts >= MAX_ATTEMPTS;
  const nextAttempt = new Date(Date.now() + Math.min(60, 2 ** attempts) * 60 * 1000);

  await supabase
    .from("lead_delivery_jobs")
    .update({
      status: exhausted ? "failed" : "retrying",
      attempts,
      error: result.message ?? "Delivery failed",
      next_attempt_at: exhausted ? new Date().toISOString() : nextAttempt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id);
}

async function processLeadDelivery(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { searchParams } = req.nextUrl;
  const limit = Math.min(Number(searchParams.get("limit") ?? 25), 100);

  const { data: jobs, error } = await supabase
    .from("lead_delivery_jobs")
    .select("id, lead_id, camp_id, channel, status, payload, attempts")
    .in("status", ["pending", "retrying"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const job of (jobs ?? []) as DeliveryJob[]) {
    await supabase
      .from("lead_delivery_jobs")
      .update({ status: "retrying", updated_at: new Date().toISOString() })
      .eq("id", job.id);

    const result = await deliverJob(job);
    await updateJobResult(job, result);

    results.push({
      id: job.id,
      channel: job.channel,
      ok: result.ok,
      skipped: result.skipped ?? false,
      message: result.message ?? null,
    });
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}

export async function GET(req: NextRequest) {
  return processLeadDelivery(req);
}

export async function POST(req: NextRequest) {
  return processLeadDelivery(req);
}
