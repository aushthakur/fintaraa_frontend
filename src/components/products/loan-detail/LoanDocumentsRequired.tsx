import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanDocumentsRequired({ page }: { page: LoanSeoPageData }) {
  return (
    <section>
      <h2 className="text-[24px] font-black text-[#111827]">
        Documents required to apply for{" "}
        <span className="text-[#13a653]">{page.loanType}</span>
      </h2>
      <ul className="mt-3 grid gap-1 text-[13px] font-medium leading-6 text-[#111827]">
        {[
          "Completed application details with registered mobile number.",
          "PAN card and Aadhaar or valid identity proof.",
          "Current address proof and service pincode.",
          "Recent bank statement and income proof.",
          "Employment or business proof where applicable.",
        ].map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}