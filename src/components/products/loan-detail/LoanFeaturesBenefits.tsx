import type { LoanSeoPageData, LoanSeoTab } from "@/services/loanSeoPages";

export function LoanFeaturesBenefits({
  page,
  active,
}: {
  page: LoanSeoPageData;
  active: LoanSeoTab;
}) {
  return (
    <section>
      <h2 className="text-[24px] font-black text-[#111827]">
        <span className="text-[#13a653]">Features & Benefits</span> of our{" "}
        {page.loanType}
      </h2>
      <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
        {active?.description || page.subtitle}
      </p>
      {active?.content?.length ? (
        <div className="mt-3 grid gap-2 text-[13px] font-medium leading-6 text-[#2f3744]">
          {active.content.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}
      <ul className="mt-3 grid gap-2 text-[13px] font-medium leading-6 text-[#111827]">
        {(active?.bullets || []).map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}
