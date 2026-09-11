import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import type { LoanSeoPageData, LoanSeoTab } from "@/services/loanSeoPages";

const isUsefulDetail = (item: string) => {
  const value = item.toLowerCase();
  return ![
    "complete view",
    "full context",
    "together",
    "guided application and document readiness support",
  ].some((phrase) => value.includes(phrase));
};

export function LoanFeaturesBenefits({
  page,
  active,
  embedded = false,
}: {
  page: LoanSeoPageData;
  active: LoanSeoTab;
  embedded?: boolean;
}) {
  const contentItems = (active?.content || []).filter(isUsefulDetail);
  const bulletItems = (active?.bullets || []).filter(isUsefulDetail);

  return (
    <section
      className={
        embedded
          ? ""
          : "rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs"
      }
    >
      {!embedded ? (
        <div className="max-w-3xl mb-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5b21b6]">
            Loan overview
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900">
            Features & Benefits of our{" "}
            <span className="text-[#5b21b6]">{page.loanType}</span>
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            {active?.description || page.subtitle}
          </p>
        </div>
      ) : null}

      {contentItems.length ? (
        <div className={`${embedded ? "" : "mt-6"} grid gap-3.5 sm:grid-cols-2`}>
          {contentItems.slice(0, 6).map((item, index) => {
            const Icon = index === 0 ? FileText : ShieldCheck;
            return (
              <div
                key={item}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all hover:border-purple-200 hover:shadow-xs"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6] border border-purple-100/60">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {bulletItems.length ? (
        <div className="mt-5 grid gap-2.5">
          {bulletItems.slice(0, 8).map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-white hover:border-purple-200"
            >
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5b21b6]" />
              <p className="text-xs sm:text-sm font-semibold leading-normal text-slate-800">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
