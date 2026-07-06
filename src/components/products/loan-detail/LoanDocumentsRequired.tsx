import { FileCheck2 } from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

const documentItems = [
  "Completed application details with registered mobile number.",
  "PAN card and Aadhaar or valid identity proof.",
  "Current address proof and service pincode.",
  "Recent bank statement and income proof.",
  "Employment or business proof where applicable.",
];

export function LoanDocumentsRequired({ page }: { page: LoanSeoPageData }) {
  return (
    <section className="border border-[#e2edf8] bg-white p-5 sm:p-6">
      <div className="max-w-3xl">
        <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#00529b]">
          Document checklist
        </p>
        <h2 className="mt-2 text-[24px] font-black text-[#111827]">
          Documents required to apply for{" "}
          <span className="text-[#13a653]">{page.loanType}</span>
        </h2>
      </div>

      <div className="mt-5 grid gap-2">
        {documentItems.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 border border-[#e9eff6] bg-[#fbfdff] px-4 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#e9f6ff] text-[#00529b]">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold leading-6 text-[#111827]">
                {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
