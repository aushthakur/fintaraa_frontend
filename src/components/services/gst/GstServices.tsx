import { CircleCheck, FileText, ShieldCheck, UserRound, Tag } from "lucide-react";

const serviceCards = [
  {
    title: "GST Registration",
    text: "Get your business registered under GST quickly and hassle-free.",
    rows: [
      "New GST Registration",
      "GST Amendment",
      "Cancellation & Surrender",
      "Document & ARN Support",
    ],
    bg: "bg-[#eaf6ff]",
    border: "border-[#bcdff5]",
    iconBg: "bg-[#d0ecff]",
  },
  {
    title: "GST Filing",
    text: "We manage your GST returns with accuracy and on-time filing.",
    rows: [
      "Monthly GSTR-1, GSTR-3B Filing",
      "Quarterly Filing (QRMP Scheme)",
      "Annual Return (GSTR-9)",
      "Reconciliation & Compliance",
    ],
    bg: "bg-[#eafff4]",
    border: "border-[#b5e8cf]",
    iconBg: "bg-[#c8f5de]",
  },
];

const featureBadges = [
  { label: "Timely & Accurate Filing", icon: UserRound },
  { label: "Expert CA Assistance", icon: ShieldCheck },
  { label: "100% Compliance", icon: ShieldCheck },
  { label: "Affordable Pricing", icon: Tag },
];

export function GstServices() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-5 sm:p-6 md:p-8">
        {/* Section heading */}
        <h2 className="text-xl font-black tracking-[-0.01em] text-[#005ca8] sm:text-2xl md:text-[28px] lg:text-[32px]">
          Our GST Services
        </h2>

        {/* Two service cards */}
        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 md:grid-cols-2">
          {serviceCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.border} ${card.bg} p-5 sm:p-6 md:p-7`}
            >
              {/* Card header with icon placeholder */}
              <h3 className="flex items-center gap-3 text-base font-black text-[#005ca8] sm:text-[17px] md:text-[18px] lg:text-xl">
                {/* Icon placeholder box — swap with <Image> later */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg} sm:h-9 sm:w-9`}
                >
                  <FileText className="h-4 w-4 text-[#005ca8] sm:h-5 sm:w-5" />
                </span>
                {card.title}
              </h3>

              <p className="mt-3 text-xs font-medium leading-[1.65] text-[#374151] sm:text-sm md:text-[14px] lg:text-base">
                {card.text}
              </p>

              {/* Checklist rows */}
              <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
                {card.rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-3 text-xs font-semibold text-[#4b5563] sm:text-sm md:text-[14px]"
                  >
                    <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#005ca8] sm:h-4 sm:w-4" />
                    {row}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 4 feature badges */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#eaf0f8] pt-6 sm:mt-8 sm:pt-7 md:grid-cols-4">
          {featureBadges.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-[#005ca8]"
            >
              {/* Icon placeholder box — swap with <Image> later */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff] sm:h-9 sm:w-9">
                <Icon className="h-4 w-4 text-[#005ca8] sm:h-5 sm:w-5" />
              </span>
              <span className="text-[11px] font-black leading-[1.4] text-[#005ca8] sm:text-xs md:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}