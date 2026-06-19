import Link from "next/link";
import { 
  Banknote, 
  Plane, 
  Fuel, 
  Star, 
  ShoppingBag, 
  User, 
  Briefcase, 
  Gem 
} from "lucide-react";

const categories = [
  {
    title: "Cashback",
    icon: Banknote,
    iconBg: "bg-[#e8f4ff]",
    iconColor: "text-[#005ca8]",
  },
  {
    title: "Travel",
    icon: Plane,
    iconBg: "bg-[#ffe3ff]",
    iconColor: "text-[#cc00cc]",
  },
  {
    title: "Fuel",
    icon: Fuel,
    iconBg: "bg-[#e1ffe1]",
    iconColor: "text-[#00b33c]",
  },
  {
    title: "Rewards",
    icon: Star,
    iconBg: "bg-[#fff0e0]",
    iconColor: "text-[#e67300]",
  },
  {
    title: "Lifetime Free",
    icon: ShoppingBag,
    iconBg: "bg-[#ffe6f2]",
    iconColor: "text-[#e60073]",
  },
  {
    title: "Beginners",
    icon: User,
    iconBg: "bg-[#e8f4ff]",
    iconColor: "text-[#005ca8]",
  },
  {
    title: "Self-Employed",
    icon: Briefcase,
    iconBg: "bg-[#e1ffe1]",
    iconColor: "text-[#00b33c]",
  },
  {
    title: "Super-Premium",
    icon: Gem,
    iconBg: "bg-[#ffffcc]",
    iconColor: "text-[#b3b300]",
  },
];

export function ExploreCategories() {
  return (
    <section className="px-4 py-12 md:px-8 lg:px-16 bg-white font-sans">
      <div className="mx-auto max-w-9xl">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[26px] font-black text-[#22252a] tracking-tight">
              Explore Credit Cards by Category
            </h2>
            <p className="mt-1 text-[14px] text-[#8a94a6] max-w-xl leading-relaxed">
              Find the perfect credit card for your lifestyle and spending needs.
            </p>
          </div>
          <Link 
            href="/credit-cards/categories" 
            className="text-[13px] font-bold text-[#005ca8] hover:underline whitespace-nowrap inline-flex items-center gap-1 self-start sm:self-end"
          >
            View All Categories <span className="text-[14px]">→</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
          {categories.map(({ title, icon: Icon, iconBg, iconColor }) => (
            <div 
              key={title} 
              className="rounded-xl border border-[#e3ebf3] bg-white p-5 text-center flex flex-col items-center justify-center min-h-36.25 shadow-[0_4px_12px_rgba(22,34,50,0.02)] hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              {/* Colored Circular Icon Container */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg} ${iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              
              {/* Stacked Labels */}
              <div className="mt-4">
                <p className="text-[14px] font-bold text-[#1a1d24] leading-tight">
                  {title}
                </p>
                <p className="text-[11px] font-medium text-[#8a94a6] mt-0.5">
                  Cards
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
