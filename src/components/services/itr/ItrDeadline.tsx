import { FileText, UserRound } from "lucide-react";

export function ItrDeadline() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <h2 className="text-[34px] font-black text-[#005ca8]">
          Key Deadline
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              date: "29th May, 2026",
              label: "For Individual Salaried",
              icon: UserRound,
            },
            {
              date: "01th June, 2026",
              label: "For Individual & Business",
              icon: FileText,
            },
            {
              date: "18th July, 2026",
              label: "Revised ITR Filling",
              icon: FileText,
            },
          ].map(({ date, label, icon: Icon }, index) => (
            <div
              key={date}
              className={`text-center ${index > 0 ? "md:border-l md:border-[#dce3eb]" : ""}`}
            >
              <h3 className="text-[20px] font-black text-[#111827]">
                {date}
              </h3>
              <div className="mt-5 flex items-center justify-center gap-3 text-[13px] font-semibold text-[#8b95a3]">
                <Icon className="h-7 w-7 text-[#36a3ff]" />
                {label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 text-[11px] font-semibold text-[#a0a7b2]">
          *Dates are subject to change as per Income Tax Department updates.
        </p>
      </div>
    </section>
  );
}
