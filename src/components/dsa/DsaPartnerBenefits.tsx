import Image from "next/image";
import { CircleCheck, Lock } from "lucide-react";
import {
  commissionRows,
  dsaBenefits,
  eligibleProfiles,
  formFields,
  partnerBenefits,
} from "./dsaData";

const benefitColors: Record<string, { bg: string; text: string }> = {
  "30+ Bank Tie-ups": { bg: "bg-[#fff4e5]", text: "text-[#d69a16]" },
  "High Commissions": { bg: "bg-[#e6faf0]", text: "text-[#169954]" },
  "Training Program": { bg: "bg-[#fff1f0]", text: "text-[#d94848]" },
  "Dedicated Support": { bg: "bg-[#edf5ff]", text: "text-[#0d64bf]" },
  "Faster Payouts": { bg: "bg-[#fff9e8]", text: "text-[#ca8a04]" },
  "Marketing Material": { bg: "bg-[#f3e8ff]", text: "text-[#8b5cf6]" },
  "Single Dashboard": { bg: "bg-[#edf5ff]", text: "text-[#0d64bf]" },
  "Real-time Tracking": { bg: "bg-[#fff4e5]", text: "text-[#d69a16]" },
};

export function DsaPartnerBenefits() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#33393f]">
          Why Partner with Fintaraa?
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dsaBenefits.map(({ title, text, icon: Icon }) => {
            const colors = benefitColors[title] || {
              bg: "bg-[#edf5ff]",
              text: "text-[#0d64bf]",
            };

            return (
              <div
                key={title}
                className="rounded-[18px] border border-[#e3eaf3] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,24,40,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-extrabold text-[#22272e]">
                      {title}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium leading-5 text-[#8b95a5]">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[24px] border border-[#e3eaf3] bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.04)]">
            <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#33393f]">
              Commission Structure
            </h3>
            <table className="mt-4 w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#e8edf3] text-left text-[#22272e]">
                  <th className="py-3 font-extrabold">Product</th>
                  <th className="py-3 font-extrabold">Commission</th>
                </tr>
              </thead>
              <tbody>
                {commissionRows.map(([product, commission]) => (
                  <tr key={product} className="border-b border-[#edf2f7] last:border-b-0">
                    <td className="py-4 font-medium text-[#7d8794]">{product}</td>
                    <td className="py-4 font-semibold text-[#22272e]">
                      {commission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#33393f]">
              Who Can Become a Partner
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {eligibleProfiles.map(({ title, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[18px] border border-[#e3eaf3] bg-white px-4 py-5 text-center shadow-[0_8px_24px_rgba(16,24,40,0.03)]"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ff] text-[#0d64bf]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[12px] font-extrabold leading-5 text-[#22272e]">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="dsa-form"
          className="mt-8 grid gap-6 rounded-[26px] border border-[#e3eaf3] bg-white p-5 shadow-[0_16px_44px_rgba(16,24,40,0.05)] lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#33393f]">
              Register as a Fintaraa Partner
            </h2>
            <p className="mt-1 text-[12px] font-medium text-[#8b95a5]">
              Fill the form below and our partnership team will contact you
              shortly.
            </p>

            <form className="mt-5 grid gap-4 sm:grid-cols-2">
              {formFields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-1.5">
                  <span className="text-[12px] font-extrabold text-[#22272e]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-10 rounded-lg border border-[#d7dfe9] bg-white px-3 text-[12px] font-medium text-[#8b95a5] outline-none focus:border-[#0d64bf]">
                      <option>{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-10 rounded-lg border border-[#d7dfe9] px-3 text-[12px] font-medium outline-none placeholder:text-[#a0a8b6] focus:border-[#0d64bf]"
                    />
                  )}
                </label>
              ))}

              <button
                type="button"
                className="mt-1 h-12 rounded-full bg-[#1cb45c] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(28,180,92,0.2)] transition hover:bg-[#16954d] sm:col-span-2"
              >
                Become a Partner
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#a0a8b6] sm:col-span-2">
                <Lock className="h-3.5 w-3.5" />
                Your information safe with us
              </p>
            </form>
          </div>

          <aside className="flex min-h-[340px] flex-col justify-between rounded-[22px] bg-[#eaf3ff] p-5">
            <div>
              <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#22272e]">
                Benefits You Get
              </h3>
              <div className="mt-4 grid gap-3">
                {partnerBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-[13px] font-medium text-[#4d5968]"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-[#0d64bf]" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-6 min-h-[160px]">
              <Image
                src="/assets/images/handshake.png"
                alt="DSA partnership"
                fill
                unoptimized
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="object-contain object-bottom"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
