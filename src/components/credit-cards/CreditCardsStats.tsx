import { Banknote, FileText, Headphones, Landmark } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

const stats = [
  { value: "5M+", label: "Happy Users", icon: FileText },
  { value: "100+", label: "Credit Cards", icon: Landmark },
  { value: "30+", label: "Banking Partners", icon: Banknote },
  { value: "24x7", label: "Support", icon: Headphones },
];

export function CreditCardsStats() {
  return (
    <section className="bg-[#005ca8] px-4 py-6 md:px-6 md:py-5 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-white md:grid-cols-4 md:gap-4 md:py-5">
        {stats.map(({ value, label, icon: Icon }, index) => (
          <div
            key={label}
            className={`flex items-center justify-center gap-3 border-white/50 px-2 py-3 md:px-4 md:py-0 ${
              index < 2 ? "border-b md:border-b-0" : ""
            } ${index % 2 === 0 ? "md:border-r" : ""}`}
          >
            <Icon className="h-6 w-6 md:h-9 md:w-9" />
            <div>
              <AnimatedCounter
                value={value}
                className="block text-base font-black md:text-xl"
              />
              <p className="text-[10px] font-semibold text-white/80 md:text-[13px]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
