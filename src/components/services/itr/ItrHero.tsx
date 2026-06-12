import Image from "next/image";
import { LockKeyhole, ShieldCheck, Timer } from "lucide-react";

const fields = [
  ["Name", "Enter Full Name", "text"],
  ["Mobile Number", "Enter Mobile Number", "tel"],
  ["Employment Type", "Select Employment Type", "select"],
  ["Annual Income", "Select Annual Income", "select"],
];

export function ItrHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h1 className="text-[42px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[58px]">
            ITR Filling
          </h1>
          <p className="mt-3 text-[20px] font-medium text-[#111827]">
            File your Income Tax Return easily and stay 100% compliant
          </p>
          <div className="relative mt-6 min-h-110">
            <Image
              src="/assets/services/itr-hero.png"
              alt="ITR filing"
              fill
              unoptimized
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -right-9 -top-9 h-full w-full rounded bg-[#005ca8]" />
          <div className="relative rounded bg-white p-8 shadow-[0_18px_45px_rgba(16,24,40,0.14)]">
            <h2 className="text-[24px] font-black text-[#2a2f36]">
              Get Started with ITR Filling
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#8b95a3]">
              Fill in your details and our expert will get in touch with you.
            </p>
            <form className="mt-6 grid gap-5">
              {fields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-2">
                  <span className="text-[13px] font-black text-[#2a2f36]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-11 border border-[#d9dfe8] bg-white px-4 text-[12px] font-semibold text-[#8b95a3] outline-none">
                      <option>{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-11 border border-[#d9dfe8] px-4 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2]"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="mx-auto mt-2 h-13 w-64 rounded-full bg-[#13a653] text-[13px] font-black text-white"
              >
                Submit Inquiry
              </button>
              <p className="text-center text-[11px] font-semibold text-[#a0a7b2]">
                Your information is safe with us
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-9xl gap-6 md:grid-cols-3">
        {[
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
            icon: Timer,
          },
        ].map(({ title, text, icon: Icon }) => (
          <div key={title} className="flex items-center gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] text-[#005ca8]">
              <Icon className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-[22px] font-black text-[#111827]">
                {title}
              </span>
              <span className="mt-2 block text-[13px] font-semibold leading-5 text-[#8b95a3]">
                {text}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
