import Image from "next/image";
import { Clock, ShieldCheck, UserRound } from "lucide-react";

const fields = [
  ["Business Name", "Enter Business Name", "text"],
  ["Mobile Number", "Enter Mobile Number", "tel"],
  ["Business Type", "Select Business Type", "select"],
  ["GST Requirement", "Select GST Requirement", "select"],
  ["State", "Select State", "select"],
];

const trustBadges = [
  { label: "Expert CA Support", icon: UserRound },
  { label: "100% Compliant", icon: ShieldCheck },
  { label: "Timely Filing", icon: Clock },
];

export function GstHero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-0 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/*Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>

        {/* LEFT — heading + image */}
        <div className="flex flex-col">
          <h1 className="max-w-xl text-[38px] font-black leading-[1.15] tracking-[-0.02em] text-[#005ca8] md:text-[52px]">
            GST Registration &amp;{" "}
            <span className="block">GST Filing</span>
          </h1>
          <p className="mt-4 text-[17px] font-medium text-[#111827]">
            File your Income Tax Return easily and stay 100% compliant
          </p>

          {/* Hero illustration */}
          <div className="relative mt-6 min-h-[420px] w-full">
            <Image
              src="/assets/services/gst-hero.png"
              alt="GST services"
              fill
              unoptimized
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* RIGHT — form card */}
        <div className="relative mx-auto w-full max-w-[560px]">
          {/* Blue shadow offset */}
          <div className="absolute -right-4 -top-4 h-full w-[460px] rounded-xl bg-[#005ca8]" />

          {/* White card */}
          <div className="relative rounded-xl bg-white p-7 shadow-[0_18px_45px_rgba(16,24,40,0.12)]">
            <h2 className="text-[20px] font-black text-[#2a2f36]">
              Get Started with GST Services
            </h2>
            <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#8b95a3]">
              Fill in your Business details and our expert will get in touch
              with you.
            </p>

            <div className="mt-5 grid gap-4">
              {fields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-1.5">
                  <span className="text-[12px] font-black text-[#2a2f36]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-10 rounded-lg border border-[#d9dfe8] bg-white px-3 text-[12px] font-semibold text-[#8b95a3] outline-none focus:border-[#005ca8]">
                      <option value="">{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                    />
                  )}
                </label>
              ))}

              <button
                type="button"
                className="mx-auto mt-1 h-11 w-full rounded-lg bg-[#13a653] text-[13px] font-black text-white transition hover:bg-[#0f8f45]"
              >
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-[#a0a7b2]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your information is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges row */}
{/* Trust badges row */}
<div className="mx-auto mt-2 max-w-[1200px]">
  <div className="grid grid-cols-3 border-t border-[#E6EEF8] ">
    {trustBadges.map(({ label, icon: Icon }) => (
      <div
        key={label}
        className="flex items-left justify-left gap-2 py-4 border-r border-[#E6EEF8] last:border-r-0"
      >
        <Icon className="h-[30px] w-[30px] text-[#005CA8]" />

        <span className="text-[15px] font-semibold text-[#005CA8]">
          {label}
        </span>
      </div>
    ))}
  </div>
</div>
    </section>
  );
}