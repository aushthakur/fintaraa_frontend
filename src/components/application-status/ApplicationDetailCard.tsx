const details = [
  { label: "Applied On", value: "12 May, 2026" },
  { label: "Loan Amount", value: "₹1,20,000" },
  { label: "Partner Bank", value: "HDFC Bank" },
  { label: "Loan Type", value: "Personal Loan" },
];

export function ApplicationDetailCard() {
  return (
    <section className="px-4 pb-9 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[18px] font-medium text-[#9aa0a6]">
            Application ID: PLN1234567890
          </p>
          <span className="w-fit rounded-md border border-[#a8e6c0] bg-[#e3faea] px-6 py-2 text-[14px] font-semibold text-[#13a653]">
            Under Review
          </span>
        </div>
        <div className="mt-8 grid gap-6 rounded-xl border border-[#d7dfe8] bg-white p-8 md:grid-cols-4">
          {details.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[13px] font-medium text-[#9aa0a6]">{label}</p>
              <p className="mt-3 text-[17px] font-bold text-[#2a2f36]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}