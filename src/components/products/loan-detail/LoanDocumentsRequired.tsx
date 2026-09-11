import { FileCheck2 } from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

const documentItems = [
  "Completed application details with registered mobile number.",
  "PAN card and Aadhaar or valid identity proof.",
  "Current address proof and service pincode.",
  "Recent bank statement and income proof.",
  "Employment or business proof where applicable.",
];

export function LoanDocumentsRequired({
  page,
  embedded = false,
}: {
  page: LoanSeoPageData;
  embedded?: boolean;
}) {
  return (
    <section
      id="loan-documents"
      style={{
        scrollMarginTop:
          "calc(var(--site-header-height, 8.25rem) + 5.5rem)",
      }}
      className={`${
        embedded ? "" : "rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs"
      }`}
    >
      {!embedded ? (
        <div className="max-w-3xl mb-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5b21b6]">
            Document checklist
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900">
            Documents required to apply for{" "}
            <span className="text-[#5b21b6]">{page.loanType}</span>
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            Keep these documents ready for faster digital verification and immediate loan processing.
          </p>
        </div>
      ) : null}

      <div
        className={`${embedded ? "grid gap-3 sm:grid-cols-2" : "mt-6 grid gap-3 sm:grid-cols-2"}`}
      >
        {documentItems.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-purple-200 hover:shadow-xs"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6] border border-purple-100/60">
              <FileCheck2 className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800">
                {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
