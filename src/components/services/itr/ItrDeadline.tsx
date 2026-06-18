import Image from "next/image";

const deadlines = [
  {
    day: "29",
    suffix: "th",
    rest: " May, 2026",
    label: "For Individual Salaried",
    iconSrc: "/assets/services/itr-deadline-1.png",
    iconAlt: "Individual salaried icon",
  },
  {
    day: "01",
    suffix: "st",
    rest: " June, 2026",
    label: "For Individual & Business",
    iconSrc: "/assets/services/itr-deadline-2.png",
    iconAlt: "Individual and business icon",
  },
  {
    day: "18",
    suffix: "th",
    rest: " July, 2026",
    label: "Revised ITR Filing",
    iconSrc: "/assets/services/itr-deadline-3.png",
    iconAlt: "Revised ITR filing icon",
  },
];

export function ItrDeadline() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <h2 className="text-[28px] font-bold text-[#1a6bc6]">Key Deadline</h2>

        <div className="mt-8 grid gap-6 divide-y divide-[#e3e8ee] md:grid-cols-3 md:divide-x md:divide-y-0">
          {deadlines.map(({ day, suffix, rest, label, iconSrc, iconAlt }, index) => (
            <div
              key={label}
              className={`text-center ${index > 0 ? "pt-6 md:pt-0 md:pl-6" : ""}`}
            >
              <h3 className="text-[19px] font-bold text-[#111827]">
                {day}
                <sup className="text-[11px]">{suffix}</sup>
                {rest}
              </h3>

              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-[#98a2b3]">
                {/* Icon placeholder — drop your image at the iconSrc path to replace */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={28}
                    height={28}
                    unoptimized
                    className="object-contain"
                  />
                </span>
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