const deadlines = [
  {
    day: "29",
    suffix: "th",
    rest: " May, 2026",
    label: "For Individual Salaried",
    emoji: "👤",
  },
  {
    day: "01",
    suffix: "th",
    rest: " June, 2026",
    label: "For Individual & Business",
    emoji: "📈",
  },
  {
    day: "18",
    suffix: "th",
    rest: " July, 2026",
    label: "Revised ITR Filling",
    emoji: "📃",
  },
];

export function ItrDeadline() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <h2 className="text-[28px] font-bold text-[#1a6bc6]">Key Deadline</h2>
        <div className="mt-8 grid gap-6 divide-y divide-[#e3e8ee] md:grid-cols-3 md:divide-y-0 md:divide-x">
          {deadlines.map(({ day, suffix, rest, label, emoji }, index) => (
            <div
              key={label}
              className={`px-2 text-center ${index > 0 ? "pt-6 md:pt-0" : ""}`}
            >
              <h3 className="text-[19px] font-bold text-[#111827]">
                {day}
                <sup className="text-[11px]">{suffix}</sup>
                {rest}
              </h3>
              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-[#98a2b3]">
                <span className="text-[20px] leading-none">{emoji}</span>
                {label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 text-[11px] font-medium text-[#a0a7b2]">
          *Dates are subject to change as per Income Tax Department updates.
        </p>
      </div>
    </section>
  );
}