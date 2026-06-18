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
          <h1 className="text-[40px] font-bold leading-tight tracking-[-0.02em] text-[#1a6bc6] md:text-[54px]">
            ITR Filling
          </h1>
          <p className="mt-3 text-[17px] font-medium text-[#1f2937] md:text-[19px]">
            File your Income Tax Return easily and stay 100% compliant
          </p>
          <div className="relative mt-6 min-h-130">
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
          <div className="absolute -right-7 -top-7 h-full w-[460px] rounded-2xl bg-[#005ca8]" />
          <div className="relative rounded-2xl bg-white p-8 shadow-[0_18px_45px_rgba(16,24,40,0.14)]">
            <h2 className="text-[24px] font-bold text-[#1f2937]">
              Get Started with ITR Filling
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-5 text-[#8b95a3]">
              Fill in your details and our expert will get in touch with you.
            </p>
            <form className="mt-6 grid gap-5">
              {fields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-12 rounded-lg border border-[#d9dfe8] bg-white px-4 text-[13px] font-medium text-[#8b95a3] outline-none focus:border-[#005ca8]">
                      <option>{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-12 rounded-lg border border-[#d9dfe8] px-4 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="mx-auto mt-2 h-13 w-64 rounded-full bg-gradient-to-r from-[#1cb45c] to-[#28cf6c] text-[14px] font-bold text-white"
              >
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-[#a0a7b2]">
                🔒 Your information safe with us
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-9xl gap-8 md:grid-cols-3">
        {features.map(({ title, text, icon: Icon }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] text-[#1a6bc6]">
              <Icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[18px] font-bold text-[#1f2937]">
                {title}
              </span>
              <span className="mt-1 block text-[13px] font-medium leading-5 text-[#98a2b3]">
                {text}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}