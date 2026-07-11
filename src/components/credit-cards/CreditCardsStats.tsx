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
    <section className="bg-[#005ca8] px-2 py-2 text-white md:px-6 md:py-5 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-0.5 md:grid-cols-4 md:gap-4 md:py-5">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex min-h-14 items-center justify-start gap-2 px-1.5 py-1.5 sm:px-2 md:min-h-0 md:justify-center md:gap-3 md:px-4 md:py-0"
          >
            <Icon className="h-5 w-5 shrink-0 md:h-9 md:w-9" />
            <div className="min-w-0">
              <AnimatedCounter
                value={value}
                className="block text-[15px] font-extrabold leading-tight md:text-xl"
              />
              <p className="text-[9.5px] font-semibold leading-3 text-white/80 sm:text-[10.5px] md:text-[13px] md:leading-normal">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
