import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import type { LoanSeoPageData, LoanSeoTab } from "@/services/loanSeoPages";

export function LoanFeaturesBenefits({
  page,
  active,
}: {
  page: LoanSeoPageData;
  active: LoanSeoTab;
}) {
  const contentItems = active?.content || [];
  const bulletItems = active?.bullets || [];

  return (
    <section className="border border-[#e2edf8] bg-[#f8fbff] p-5 sm:p-6">
      <div className="max-w-3xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#00529b]">
          Loan overview
        </p>
        <h2 className="mt-2 text-[24px] font-extrabold text-[#111827]">
          <span className="text-[#13a653]">Features & Benefits</span> of our{" "}
          {page.loanType}
        </h2>
        <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
          {active?.description || page.subtitle}
        </p>
      </div>

      {contentItems.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {contentItems.map((item, index) => {
            const Icon = index === 0 ? FileText : ShieldCheck;
            return (
              <div
                key={item}
                className="flex gap-3 border border-[#e5edf5] bg-white p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e9f6ff] text-[#00529b]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="text-[13px] font-semibold leading-6 text-[#2f3744]">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {bulletItems.length ? (
        <div className="mt-5 grid gap-2">
          {bulletItems.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 border border-[#e9eff6] bg-white px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#13a653]" />
              <p className="text-[13px] font-bold leading-6 text-[#111827]">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
