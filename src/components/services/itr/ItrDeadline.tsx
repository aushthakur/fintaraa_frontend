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
    <section className="px-4 py-7 md:px-6 md:py-8 lg:px-8">
      <div className="mobile-safe-container rounded-xl border border-[#d7dfe8] bg-white p-4 sm:p-6 md:p-8">
        <h2 className="text-center text-xl font-bold text-[#1a6bc6] sm:text-2xl md:text-left md:text-[26px] lg:text-[28px]">
          Key Deadline
        </h2>

        <div className="mt-5 grid gap-3 sm:mt-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[#e3e8ee]">
          {deadlines.map(({ day, suffix, rest, label, iconSrc, iconAlt }, index) => (
            <div
              key={label}
              className={`rounded-xl border border-[#e7eef6] bg-[#f8fbff] p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0 ${
                index > 0 ? "md:pl-6" : ""
              } ${index < deadlines.length - 1 ? "md:pr-6" : ""}`}
            >
              <div className="flex items-center gap-3 md:flex-col md:justify-center md:text-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm md:h-9 md:w-9 md:bg-transparent md:shadow-none lg:h-10 lg:w-10">
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold leading-snug text-[#111827] sm:text-base md:text-[18px] lg:text-xl">
                    {day}
                    <sup className="text-[10px] sm:text-[11px]">{suffix}</sup>
                    {rest}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium leading-5 text-[#667085] sm:text-sm md:mt-3 md:text-[15px]">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 text-center sm:mt-7 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[12px] font-medium leading-5 text-[#a0a7b2] sm:text-[13px] md:text-sm">
            *Dates are subject to change as per Income Tax Department updates.
          </p>
          <a
            href="#itr-filing-status"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#5b21b6] px-4 text-[13px] font-bold text-[#5b21b6] no-underline transition hover:bg-[#5b21b6] hover:text-white"
          >
            Track ITR Filing Status
          </a>
        </div>
      </div>
    </section>
  );
}
