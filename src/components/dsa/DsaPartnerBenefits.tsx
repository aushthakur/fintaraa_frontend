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
  "30+ Bank Tie-ups": { bg: "bg-[#fff4e5]", text: "text-[#f59e0b]" },
  "High Commissions": { bg: "bg-[#e6faf0]", text: "text-[#13a653]" },
  "Training Program": { bg: "bg-[#ffebee]", text: "text-[#e53935]" },
  "Dedicated Support": { bg: "bg-[#e8f4ff]", text: "text-[#005ca8]" },
  "Faster Payouts": { bg: "bg-[#fffde7]", text: "text-[#fbc02d]" },
  "Marketing Material": { bg: "bg-[#f3e5f5]", text: "text-[#8e24aa]" },
  "Single Dashboard": { bg: "bg-[#e8f4ff]", text: "text-[#005ca8]" },
  "Real-time Tracking": { bg: "bg-[#fff4e5]", text: "text-[#f59e0b]" },
};

export function DsaPartnerBenefits() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[22px] font-black text-[#111827]">
          Why Partner with Fintaraa?
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dsaBenefits.map(({ title, text, icon: Icon }) => {
            const colors = benefitColors[title] || {
              bg: "bg-[#e8f4ff]",
              text: "text-[#005ca8]",
            };
            return (
              <div
                key={title}
                className="flex items-center gap-4 rounded-xl border border-[#d9e2ec] bg-white p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[13px] font-black text-[#111827]">
                    {title}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold leading-5 text-[#667085]">
                    {text}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <div className="rounded-xl border border-[#d9e2ec] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-[20px] font-black text-[#111827]">
              Commission Structure
            </h3>
            <table className="mt-4 w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-left text-[#111827]">
                  <th className="py-3 font-black">Product</th>
                  <th className="py-3 font-black">Commission</th>
                </tr>
              </thead>
              <tbody>
                {commissionRows.map(([product, commission]) => (
                  <tr key={product} className="border-t border-[#dce3eb]">
                    <td className="py-4 font-semibold text-[#667085]">
                      {product}
                    </td>
                    <td className="py-4 font-bold text-[#111827]">
                      {commission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-[20px] font-black text-[#111827] mb-5">
              Who Can Become a Partner
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {eligibleProfiles.map(({ title, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-xl border border-[#d9e2ec] bg-white p-5 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[12px] font-black text-[#111827] leading-tight">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="dsa-form"
          className="mt-8 grid gap-6 rounded-xl border border-[#d9e2ec] bg-white p-5 shadow-[0_12px_35px_rgba(16,24,40,0.06)] lg:grid-cols-[1fr_23rem]"
        >
          <div>
            <h2 className="text-[22px] font-black text-[#111827]">
              Register as a Fintaraa Partner
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#667085]">
              Fill the form below and our partnership team will contact you
              shortly.
            </p>
            <form className="mt-5 grid gap-4 sm:grid-cols-2">
              {formFields.map(([label, placeholder, type]) => (
                <label key={label} className="grid gap-1">
                  <span className="text-[12px] font-black text-[#111827]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-10 rounded-lg border border-[#d7dfe9] bg-white px-3 text-[12px] font-semibold text-[#667085] outline-none">
                      <option>{placeholder}</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-10 rounded-lg border border-[#d7dfe9] px-3 text-[12px] font-semibold outline-none placeholder:text-[#98a2b3] focus:border-[#005ca8]"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="h-12 rounded-full bg-[#13a653] hover:bg-[#11954a] transition-all text-[13px] font-black text-white sm:col-span-2 shadow-sm"
              >
                Become a Partner
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-[#98a2b3] sm:col-span-2">
                <Lock className="h-3.5 w-3.5" />
                Your information is safe with us
              </p>
            </form>
          </div>

          <aside className="rounded-xl bg-[#e8f4ff] p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-[20px] font-black text-[#111827]">
                Benefits You Get
              </h3>
              <div className="mt-4 grid gap-3">
                {partnerBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-[13px] font-semibold text-[#344054]"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-[#005ca8]" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-6 min-h-42">
              <Image
                src="/assets/dsa/handshake.png"
                alt="DSA partnership"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
