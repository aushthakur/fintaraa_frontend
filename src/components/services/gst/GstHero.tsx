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
          <h1 className="max-w-xl text-[28px] font-black leading-[1.15] tracking-[-0.02em] text-[#005ca8] sm:text-[34px] md:text-[38px] lg:text-[46px] xl:text-[52px]">
            GST Registration &{" "}
            <span className="block">GST Filing</span>
          </h1>
          <p className="mt-4 text-[15px] font-medium text-[#111827] sm:text-base md:text-[17px] lg:text-[19px]">
            File your Income Tax Return easily and stay 100% compliant
          </p>

          {/* Hero illustration */}
          <div className="relative mt-6 min-h-50 w-full sm:min-h-65 md:min-h-80 lg:min-h-95 xl:min-h-105">
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
        <div className="relative mx-auto w-full max-w-140">
          {/* Blue shadow offset */}
          <div className="absolute -right-4 -top-4 h-full w-85 rounded-xl bg-[#005ca8] sm:w-95 md:w-105 lg:w-115" />

          {/* White card */}
          <div className="relative rounded-xl bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.12)] sm:p-6 md:p-7">
            <h2 className="text-base font-black text-[#2a2f36] sm:text-lg md:text-[20px] lg:text-[22px]">
              Get Started with GST Services
            </h2>
            <p className="mt-1.5 text-[11px] font-semibold leading-5 text-[#8b95a3] sm:text-xs md:text-[13px]">
              Fill in your Business details and our expert will get in touch
              with you.
            </p>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
              {fields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-1 sm:gap-1.5">
                  <span className="text-[11px] font-black text-[#2a2f36] sm:text-xs md:text-[13px]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-9 rounded-lg border border-[#d9dfe8] bg-white px-2.5 text-[11px] font-semibold text-[#8b95a3] outline-none focus:border-[#005ca8] sm:h-10 sm:text-xs md:text-[13px]">
                      <option value="">{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-9 rounded-lg border border-[#d9dfe8] px-2.5 text-[11px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-10 sm:text-xs md:text-[13px]"
                    />
                  )}
                </label>
              ))}

              <button
                type="button"
                className="mx-auto mt-1 h-10 w-full rounded-lg bg-[#13a653] text-xs font-black text-white transition hover:bg-[#0f8f45] sm:h-11 sm:text-sm md:text-[14px]"
              >
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-[#a0a7b2] sm:text-[11px] md:text-xs">
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Your information is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges row */}
<div className="mx-auto mt-2 max-w-300">
  <div className="grid grid-cols-3 border-t border-[#E6EEF8] ">
    {trustBadges.map(({ label, icon: Icon }) => (
      <div
        key={label}
        className="flex items-left justify-left gap-2 py-4 border-r border-[#E6EEF8] last:border-r-0"
      >
        <Icon className="h-5 w-5 text-[#005CA8] sm:h-6 sm:w-6 md:h-7.5 md:w-7.5" />

        <span className="text-xs font-semibold text-[#005CA8] sm:text-sm md:text-[15px]">
          {label}
        </span>
      </div>
    ))}
  </div>
</div>
    </section>
  );
}