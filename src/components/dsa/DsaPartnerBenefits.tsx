import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { PartnerLeadForm } from "@/components/services/shared/PartnerLeadForm";
import {
  commissionRows,
  dsaBenefits,
  eligibleProfiles,
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
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-[13px]">
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

            <div className="mt-5">
              <PartnerLeadForm
                serviceType="dsa_partner"
                source="website_dsa_page"
                submitLabel="Become a Partner"
                successTitle="Thank you! Your DSA partner request has been submitted."
                successMessage="We have generated your partner query ID. Our partnership team will review your profile and contact you."
                primarySelectLabel="Partner Profile"
                primarySelectPlaceholder="Select partner profile"
                primaryOptions={[
                  "Loan consultant",
                  "Insurance advisor",
                  "Financial distributor",
                  "CA / tax consultant",
                  "Real estate broker",
                  "Other",
                ]}
                secondarySelectLabel="Monthly Lead Volume"
                secondarySelectPlaceholder="Select expected volume"
                secondaryOptions={[
                  "1 - 10 leads",
                  "11 - 25 leads",
                  "26 - 50 leads",
                  "50+ leads",
                ]}
              />
            </div>
          </div>

          <aside className="flex min-h-85 flex-col justify-between rounded-[22px] bg-[#eaf3ff] p-5">
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

            <div className="relative mt-6 min-h-40">
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
