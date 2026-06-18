import { CircleCheck, UserRound } from "lucide-react";

const mustFile = [
  "Individuals with income above taxable limit",
  "Salaried employees with tax-saving claims",
  "Freelancers, professionals & business owners",
  "Capital gains or rental income earners",
  "Foreign income or assets holders",
];

const benefits = [
  "Avoid tax penalties and legal notices",
  "Claim refunds, if any",
  "Proof of income for loans, visas & more",
  "Helps in building financial credibility",
];

export function ItrInfo() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <h2 className="text-center text-[28px] font-bold text-[#1a6bc6]">
          What is ITR?
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[14px] font-medium leading-6 text-[#1f2937]">
          ITR (Income Tax Return) is a form used by individuals and entities to
          report their income, deductions, and taxes to the Income Tax
          Department.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            ["Who Must File ITR?", mustFile, "bg-[#e8f7ff]"],
            ["Key Benefits", benefits, "bg-[#e7fff3]"],
          ].map(([title, rows, bg]) => (
            <div
              key={String(title)}
              className={`rounded-xl border border-[#b9d8e8] ${bg} p-8`}
            >
              <h3 className="flex items-center gap-3 text-[19px] font-bold text-[#1a6bc6]">
                <UserRound className="h-5 w-5" />
                {title}
              </h3>
              <div className="mt-6 grid gap-4">
                {(rows as string[]).map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-3 text-[13px] font-medium text-[#8b95a3]"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-[#1a6bc6]" />
                    {row}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}