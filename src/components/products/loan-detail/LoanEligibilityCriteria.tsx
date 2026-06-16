export function LoanEligibilityCriteria() {
  return (
    <section>
      <h2 className="text-[24px] font-black text-[#111827]">
        <span className="text-[#13a653]">Eligibility Criteria</span>
      </h2>
      <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
        Eligibility depends on profile quality, income, documents, credit
        history, and partner policy.
      </p>
      <ul className="mt-3 grid gap-1 text-[13px] font-medium leading-6 text-[#111827]">
        {[
          "Age should generally be 21 years or above.",
          "Stable monthly income or business cash flow is required.",
          "PAN, Aadhaar, mobile number, and address details should match.",
          "Credit score and repayment history can influence approval.",
          "Serviceability may vary by state, city, pincode, and area.",
        ].map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}