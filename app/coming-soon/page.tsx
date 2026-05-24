export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#003087] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kaytanot_logo.webp"
          alt="קייטנות"
          style={{ height: "120px", width: "auto" }}
        />
      </div>

      {/* Text */}
      <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-4">
        האתר בבנייה
      </h1>
      <p className="text-blue-200 text-lg md:text-xl text-center">
        חוזרים בקרוב עם משהו מיוחד
      </p>
    </div>
  );
}
