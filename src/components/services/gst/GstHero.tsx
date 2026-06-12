import Image from "next/image";
import { Clock, ShieldCheck, UserRound } from "lucide-react";

const fields = [
  ["Business Name", "Enter Business Name", "text"],
  ["Mobile Number", "Enter Mobile Number", "tel"],
  ["Business Type", "Select Business Type", "select"],
  ["GST Requirement", "Select GST Requirement", "select"],
  ["State", "Select State", "select"],
];

export function GstHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-[42px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[58px]">
            GST Registration & GST Filing
          </h1>
          <p className="mt-4 text-[20px] font-medium text-[#111827]">
            File your Income Tax Return easily and stay 100% compliant
          </p>
          <div className="relative mt-6 min-h-116">
            <Image
              src="/assets/services/gst-hero.png"
              alt="GST services"
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
              Get Started with GST Services
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#8b95a3]">
              Fill in your Business details and our expert will get in touch
              with you.
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

      <div className="mx-auto mt-6 grid max-w-9xl gap-6 md:grid-cols-3">
        {[
          { title: "Expert CA Support", icon: UserRound },
          { title: "100% Compliant", icon: ShieldCheck },
          { title: "Timely Filing", icon: Clock },
        ].map(({ title, icon: Icon }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-3 text-[#005ca8]"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[14px] font-black">{title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
