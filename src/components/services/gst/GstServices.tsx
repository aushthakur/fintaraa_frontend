import { CircleCheck, FileText, ShieldCheck, UserRound } from "lucide-react";

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
    bg: "bg-[#e8f7ff]",
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
    bg: "bg-[#e7fff3]",
  },
];

export function GstServices() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <h2 className="text-[34px] font-black text-[#005ca8]">
          Our GST Services
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {serviceCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border border-[#b9d8e8] ${card.bg} p-8`}
            >
              <h3 className="flex items-center gap-3 text-[22px] font-black text-[#005ca8]">
                <FileText className="h-6 w-6" />
                {card.title}
              </h3>
              <p className="mt-6 text-[15px] font-medium leading-6 text-[#111827]">
                {card.text}
              </p>
              <div className="mt-6 grid gap-4">
                {card.rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-3 text-[14px] font-semibold text-[#8b95a3]"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-[#005ca8]" />
                    {row}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            { title: "Timely & Accurate Filing", icon: UserRound },
            { title: "Expert CA Assistance", icon: ShieldCheck },
            { title: "100% Compliance", icon: ShieldCheck },
            { title: "Affordable Pricing", icon: CircleCheck },
          ].map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-3 text-[#005ca8]"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[14px] font-black">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
