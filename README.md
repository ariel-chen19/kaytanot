# 🏕️ קייטנות – פלטפורמת הקייטנות המובילה בישראל

פלטפורמה מלאה לחיבור בין הורים לקייטנות ברחבי ישראל. ההורים יכולים לחפש, להשוות ולפנות לקייטנות; בעלי קייטנות יכולים לפרסם ולנהל פניות.

---

## 🛠️ טכנולוגיות

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth + PostgreSQL)
- **React Hook Form** + **Zod**
- **Resend** (שליחת מיילים)
- **Vercel** (פריסה)

---

## 🚀 התקנה מקומית

### 1. שכפול הפרויקט

```bash
git clone <repo-url>
cd kaytanot
npm install
```

### 2. הגדרת משתני סביבה

צרו קובץ `.env.local` בתיקיית הבסיס:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. הפעלת שרת פיתוח

```bash
npm run dev
```

הפרויקט יהיה זמין בכתובת: http://localhost:3000

---

## 🗄️ הגדרת Supabase

### יצירת פרויקט

1. היכנסו לאתר [supabase.com](https://supabase.com) וצרו חשבון
2. לחצו "New Project" וצרו פרויקט חדש
3. העתיקו את **Project URL** ו-**Anon Key** מ-Settings → API

### הרצת ה-Migration

1. בממשק Supabase, לכו ל-**SQL Editor**
2. פתחו את הקובץ `supabase/migrations/001_initial.sql`
3. העתיקו את תוכנו והדביקו ב-SQL Editor
4. לחצו **Run** להרצת המיגרציה

התוצאה: יווצרו טבלאות `camps`, `leads`, ו-`payments` עם פוליטיקות RLS מוגדרות.

### הפעלת Email Auth

ב-Supabase Dashboard:
1. Authentication → Providers
2. וודאו ש-Email/Password מופעל

---

## 📧 הגדרת Resend

1. היכנסו ל-[resend.com](https://resend.com) וצרו חשבון חינמי
2. לכו ל-API Keys וצרו מפתח חדש
3. הכניסו את המפתח ל-`.env.local` תחת `RESEND_API_KEY`

**חשוב:** בסביבת פיתוח, Resend יאפשר שליחה רק לאימייל המאומת שלכם. לפרסום, יש לאמת את הדומיין `kaytanot.co.il`.

---

## 💳 אינטגרציית Cardcom (Placeholder – עתידי)

מערכת התשלומים באמצעות **Cardcom** תיושם בשלב הבא.

המיקום לאינטגרציה: `app/api/camps/create/route.ts`

כשייושם:
1. לאחר יצירת הקייטנה, יש להפנות ל-Cardcom עם סכום ופרטי עסקה
2. Cardcom יחזיר callback לנקודת קצה `/api/payments/cardcom-callback`
3. ה-callback יעדכן את `payments.status = 'paid'` ו-`camps.is_active = true`

פרטים נוספים: [מדריך API של Cardcom](https://kb.cardcom.solutions/)

---

## 📁 מבנה הפרויקט

```
kaytanot/
├── app/
│   ├── page.tsx                  # דף הבית
│   ├── search/page.tsx           # תוצאות חיפוש
│   ├── camps/[slug]/page.tsx     # דף קייטנה
│   ├── publish/page.tsx          # פרסום קייטנה
│   ├── dashboard/page.tsx        # לוח בקרה לבעלים
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── leads/route.ts
│       └── camps/create/route.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CampCard.tsx
│   ├── ContactForm.tsx
│   ├── PublishForm.tsx
│   └── HeroSearch.tsx
├── lib/supabase/
│   ├── client.ts
│   └── server.ts
├── supabase/migrations/
│   └── 001_initial.sql
└── middleware.ts
```

---

## 🚢 פריסה ל-Vercel

1. הוסיפו את הפרויקט ל-GitHub
2. חברו את ה-repo ב-[vercel.com](https://vercel.com)
3. הוסיפו את כל משתני הסביבה ב-Vercel Dashboard → Settings → Environment Variables
4. עדכנו `NEXT_PUBLIC_SITE_URL` לדומיין הסופי

---

## 📞 יצירת קשר

info@kaytanot.co.il
