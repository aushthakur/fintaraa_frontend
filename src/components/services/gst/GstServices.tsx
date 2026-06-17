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
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        {/* Section heading */}
        <h2 className="text-[32px] font-black tracking-[-0.01em] text-[#005ca8]">
          Our GST Services
        </h2>

        {/* Two service cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {serviceCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.border} ${card.bg} p-7`}
            >
              {/* Card header with icon placeholder */}
              <h3 className="flex items-center gap-3 text-[18px] font-black text-[#005ca8]">
                {/* Icon placeholder box — swap with <Image> later */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
                >
                  <FileText className="h-5 w-5 text-[#005ca8]" />
                </span>
                {card.title}
              </h3>

              <p className="mt-4 text-[14px] font-medium leading-[1.65] text-[#374151]">
                {card.text}
              </p>

              {/* Checklist rows */}
              <div className="mt-5 grid gap-3">
                {card.rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-3 text-[13px] font-semibold text-[#4b5563]"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-[#005ca8]" />
                    {row}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 4 feature badges */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#eaf0f8] pt-7 md:grid-cols-4">
          {featureBadges.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-[#005ca8]"
            >
              {/* Icon placeholder box — swap with <Image> later */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff]">
                <Icon className="h-5 w-5 text-[#005ca8]" />
              </span>
              <span className="text-[12px] font-black leading-[1.4]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}