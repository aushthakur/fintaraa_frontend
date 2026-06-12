import { Banknote, Clock, FileText, Headphones, Landmark } from "lucide-react";

const stats = [
  { value: "5M+", label: "Happy Users", icon: FileText },
  { value: "100+", label: "Credit Cards", icon: Landmark },
  { value: "30+", label: "Banking Partners", icon: Banknote },
  { value: "24x7", label: "Support", icon: Headphones },
];

export function CreditCardsStats() {
  return (
    <section className="bg-[#005ca8] px-4 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-4 py-5 text-white md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-center">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-4 border-white/50 md:border-r"
          >
            <Icon className="h-6 w-6" />
            <div>
              <p className="text-[15px] font-black">{value}</p>
              <p className="text-[11px] font-semibold text-white/80">{label}</p>
            </div>
          </div>
        ))}
        <button className="mx-auto inline-flex h-11 items-center gap-2 rounded-full bg-[#13a653] px-7 text-[13px] font-black">
          <Clock className="h-4 w-4" />
          Talk to Loan Expert
        </button>
      </div>
    </section>
  );
}
