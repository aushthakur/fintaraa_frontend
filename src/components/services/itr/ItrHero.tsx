import Image from "next/image";
import { Clock, LockKeyhole, ShieldCheck } from "lucide-react";

const fields = [
  ["Name", "Enter Full Name", "text"],
  ["Mobile Number", "Enter Mobile Number", "tel"],
  ["Employment Type", "Select Employment Type", "select"],
  ["Annual Income", "Select Annual Income", "select"],
];

const features = [
  {
    title: "Expert Assistance",
    text: "File your ITR with experienced CA partners",
    icon: ShieldCheck,
  },
  {
    title: "100% Secure",
    text: "Your data is encrypted and completely safe",
    icon: LockKeyhole,
  },
  {
    title: "Accurate & Timely",
    text: "Accurate filing with on-time submission guarantee",
    icon: Clock,
  },
];

export function ItrHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
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

      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#1a6bc6] sm:text-[34px] md:text-[40px] lg:text-[48px] xl:text-[54px]">
            ITR Filling
          </h1>
          <p className="mt-3 text-[15px] font-medium text-[#1f2937] sm:text-base md:text-[17px] lg:text-[19px]">
            File your Income Tax Return easily and stay 100% compliant
          </p>
          <div className="relative mt-6 min-h-[200px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[340px] xl:min-h-[380px]">
            <Image
              src="/assets/services/itr-hero.png"
              alt="ITR filing"
              fill
              unoptimized
              className="object-contain object-center"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-7 -top-7 h-full w-[340px] rounded-2xl bg-[#005ca8] sm:w-[380px] md:w-[420px] lg:w-[460px]" />
          <div className="relative rounded-2xl bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.14)] sm:p-6 md:p-8">
            <h2 className="text-lg font-bold text-[#1f2937] sm:text-xl md:text-[22px] lg:text-[24px]">
              Get Started with ITR Filling
            </h2>
            <p className="mt-2 text-xs font-medium leading-5 text-[#8b95a3] sm:text-[13px] md:text-sm">
              Fill in your details and our expert will get in touch with you.
            </p>
            <form className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
              {fields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-1.5 sm:gap-2">
                  <span className="text-xs font-bold text-[#1f2937] sm:text-[13px] md:text-sm lg:text-[14px]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-10 rounded-lg border border-[#d9dfe8] bg-white px-3 text-xs font-medium text-[#8b95a3] outline-none focus:border-[#005ca8] sm:h-11 sm:text-[13px] md:h-12 md:text-sm">
                      <option>{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-xs font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-11 sm:text-[13px] md:h-12 md:text-sm"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="mx-auto mt-2 h-11 w-full max-w-xs rounded-full bg-gradient-to-r from-[#1cb45c] to-[#28cf6c] text-xs font-bold text-white sm:h-12 sm:text-sm md:h-13 md:text-[14px]"
              >
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#a0a7b2] sm:text-xs">
                🔒 Your information safe with us
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-9xl gap-6 sm:gap-8 md:grid-cols-3">
        {features.map(({ title, text, icon: Icon }) => (
          <div key={title} className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] text-[#1a6bc6] sm:h-14 sm:w-14 md:h-16 md:w-16">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#1f2937] sm:text-base md:text-[17px] lg:text-[18px]">
                {title}
              </span>
              <span className="mt-1 block text-xs font-medium leading-5 text-[#98a2b3] sm:text-[13px] md:text-sm">
                {text}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}