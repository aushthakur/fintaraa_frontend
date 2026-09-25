"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  BadgePercent,
  Briefcase,
  Building2,
  Calculator,
  Car,
  Coins,
  Construction,
  CreditCard,
  Crown,
  Factory,
  FileCheck2,
  Fuel,
  GraduationCap,
  HandCoins,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  Layers,
  MapPin,
  PackageCheck,
  Plane,
  ReceiptText,
  Repeat2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Stethoscope,
  Tractor,
  Umbrella,
  WalletCards,
  Wrench,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";

type ProductItem = {
  title: string;
  text: string;
  href: string;
  category: "Loans" | "Insurance" | "Cards" | "Services";
  subcategory?: string;
  badge?: string;
  icon: any;
};

const allProducts: ProductItem[] = [
  // Personal & Retail Loans
  {
    title: "Personal Loan",
    text: "Unsecured personal credit with flexible repayment options up to 6 years.",
    href: "/products/personal-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "From 10.50% p.a.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Instant Personal Loan",
    text: "Paperless digital application with fast-track approval and 24-hour disbursal.",
    href: "/products/instant-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "Digital Process",
    icon: HandCoins,
  },
  {
    title: "Education Loan",
    text: "Cover tuition fees, living expenses, and travel for studies in India or overseas.",
    href: "/products/education-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "From 8.50% p.a.",
    icon: GraduationCap,
  },
  {
    title: "Renovation Loan",
    text: "Finance home remodeling, modular kitchen upgrades, and interior improvements.",
    href: "/products/renovation-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "Up to ₹50 Lakhs",
    icon: Construction,
  },
  {
    title: "Wedding Loan",
    text: "Fund venue bookings, catering, bridal apparel, jewelry, and celebration expenses.",
    href: "/products/wedding-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "Collateral-Free",
    icon: Heart,
  },
  {
    title: "Medical Loan",
    text: "Financial assistance for emergency surgeries, hospital admission, and specialty care.",
    href: "/products/medical-loan",
    category: "Loans",
    subcategory: "Personal Loans",
    badge: "Fast Disbursal",
    icon: HeartPulse,
  },

  // Home & Property Loans
  {
    title: "Home Loan",
    text: "Finance home purchases with competitive interest rates and extended tenures.",
    href: "/products/home-loan",
    category: "Loans",
    subcategory: "Home & Property",
    badge: "From 8.50% p.a.",
    icon: Home,
  },
  {
    title: "Balance Transfer & Top-Up",
    text: "Transfer existing high-rate home loans to lower rates and unlock top-up capital.",
    href: "/products/balance-transfer-top-up-loan",
    category: "Loans",
    subcategory: "Home & Property",
    badge: "Lower EMI",
    icon: Repeat2,
  },
  {
    title: "Loan Against Property",
    text: "Unsecured and secured funding against residential or commercial real estate.",
    href: "/products/loan-against-property",
    category: "Loans",
    subcategory: "Home & Property",
    badge: "High Sanction",
    icon: Building2,
  },
  {
    title: "Construction Loan",
    text: "Structured stage-wise disbursal for residential property construction.",
    href: "/products/construction-loan",
    category: "Loans",
    subcategory: "Home & Property",
    badge: "Stage Disbursal",
    icon: Construction,
  },
  {
    title: "Commercial Property Loan",
    text: "Finance commercial office spaces, retail outlets, and industrial real estate.",
    href: "/products/commercial-purchases-loan",
    category: "Loans",
    subcategory: "Home & Property",
    badge: "Commercial Use",
    icon: Landmark,
  },

  // Business Loans
  {
    title: "Business Loan",
    text: "Unsecured commercial growth capital for business expansion and operational needs.",
    href: "/products/business-loan",
    category: "Loans",
    subcategory: "Business Loans",
    badge: "Zero Collateral",
    icon: Briefcase,
  },
  {
    title: "Working Capital Loan",
    text: "Manage operational cash flow, inventory purchases, and seasonal business cycles.",
    href: "/products/working-capital-loan",
    category: "Loans",
    subcategory: "Business Loans",
    badge: "Cash Flow Support",
    icon: WalletCards,
  },
  {
    title: "Machinery Loan",
    text: "Finance manufacturing equipment, industrial machinery, and commercial tools.",
    href: "/products/machinery-loan",
    category: "Loans",
    subcategory: "Business Loans",
    badge: "Equipment Cover",
    icon: Wrench,
  },
  {
    title: "OD / Overdraft Loan",
    text: "Flexible revolving credit facility with interest charged strictly on utilized amounts.",
    href: "/products/od-loan",
    category: "Loans",
    subcategory: "Business Loans",
    badge: "Revolving Credit",
    icon: Landmark,
  },
  {
    title: "Agriculture Loan",
    text: "Finance farming equipment, agricultural land improvements, and crop cultivation.",
    href: "/products/agriculture-loan",
    category: "Loans",
    subcategory: "Business Loans",
    badge: "Agri Support",
    icon: Tractor,
  },

  // Vehicle & Asset Loans
  {
    title: "Car Loan",
    text: "Finance new passenger car purchases with competitive interest rates.",
    href: "/products/car-loan",
    category: "Loans",
    subcategory: "Vehicle & Asset Loans",
    badge: "Up to 100% On-Road",
    icon: Car,
  },
  {
    title: "Used Car Loan",
    text: "Pre-owned passenger vehicle financing with fast documentation checks.",
    href: "/products/used-car-loan",
    category: "Loans",
    subcategory: "Vehicle & Asset Loans",
    badge: "Pre-Owned Cover",
    icon: Car,
  },
  {
    title: "Two-Wheeler Loan",
    text: "Quick two-wheeler financing for motorcycles and electric scooters.",
    href: "/products/two-wheeler-loan",
    category: "Loans",
    subcategory: "Vehicle & Asset Loans",
    badge: "Quick Approval",
    icon: Car,
  },
  {
    title: "Gold Loan",
    text: "Instant short-term liquidity pledged against gold ornaments and coins.",
    href: "/products/gold-loan",
    category: "Loans",
    subcategory: "Vehicle & Asset Loans",
    badge: "Instant Disbursal",
    icon: Coins,
  },
  {
    title: "Loan Against Security",
    text: "Access liquidity pledged against mutual funds, stocks, and fixed deposits.",
    href: "/products/loan-against-security",
    category: "Loans",
    subcategory: "Vehicle & Asset Loans",
    badge: "Asset Backed",
    icon: ShieldCheck,
  },

  // Credit Cards
  {
    title: "Rewards Credit Cards",
    text: "Accelerated reward points on everyday dining, retail shopping, and utility bills.",
    href: "/credit-cards",
    category: "Cards",
    badge: "High Reward Rate",
    icon: BadgePercent,
  },
  {
    title: "Cashback Credit Cards",
    text: "Direct cashback credits applied automatically against monthly card statements.",
    href: "/credit-cards",
    category: "Cards",
    badge: "Up to 5% Cashback",
    icon: WalletCards,
  },
  {
    title: "Travel & Lounge Cards",
    text: "Complimentary airport lounge access, air miles, and overseas travel insurance.",
    href: "/credit-cards",
    category: "Cards",
    badge: "Lounge Access",
    icon: Plane,
  },
  {
    title: "Fuel Savings Credit Cards",
    text: "Fuel surcharge waivers and bonus points at petrol stations across India.",
    href: "/credit-cards",
    category: "Cards",
    badge: "Surcharge Waiver",
    icon: Fuel,
  },
  {
    title: "Lifetime Free Cards",
    text: "Zero joining fee and zero annual renewal fee with essential reward benefits.",
    href: "/credit-cards",
    category: "Cards",
    badge: "Zero Annual Fee",
    icon: Crown,
  },

  // Insurance
  {
    title: "Life Insurance",
    text: "Long-term financial protection and wealth accumulation plans for your family.",
    href: "/products/life-insurance",
    category: "Insurance",
    badge: "Family Protection",
    icon: Umbrella,
  },
  {
    title: "Health Insurance",
    text: "Comprehensive hospital bill coverage, cashless admission, and critical illness cover.",
    href: "/products/health-insurance",
    category: "Insurance",
    badge: "Cashless Treatment",
    icon: HeartPulse,
  },
  {
    title: "Term Insurance",
    text: "Pure life protection cover providing high sum assured at affordable premiums.",
    href: "/products/term-insurance",
    category: "Insurance",
    badge: "High Sum Assured",
    icon: ShieldCheck,
  },
  {
    title: "Vehicle Insurance",
    text: "Comprehensive and third-party insurance for cars, two-wheelers, and commercial fleets.",
    href: "/products/vehicle-insurance",
    category: "Insurance",
    badge: "Instant Renewal",
    icon: Car,
  },
  {
    title: "Property & Business Insurance",
    text: "Protect commercial property, shop inventory, and industrial machinery from risks.",
    href: "/products/property-insurance",
    category: "Insurance",
    badge: "Asset Security",
    icon: Store,
  },

  // Services
  {
    title: "CIBIL Score Check",
    text: "Check your credit bureau score and detailed report online.",
    href: "/cibil-score",
    category: "Services",
    badge: "100% Free Check",
    icon: Calculator,
  },
  {
    title: "ITR Filing Assistance",
    text: "Assisted income tax return filing solutions for salaried and self-employed profiles.",
    href: "/itr-filing",
    category: "Services",
    badge: "Tax Assistance",
    icon: ReceiptText,
  },
  {
    title: "GST Registration & Filing",
    text: "End-to-end GST registration and monthly return filing for business entities.",
    href: "/gst-registration",
    category: "Services",
    badge: "GST Solutions",
    icon: FileCheck2,
  },
  {
    title: "MSME Udyam Registration",
    text: "Official government MSME registration to unlock priority lending incentives.",
    href: "/msme-registration",
    category: "Services",
    badge: "Govt Incentives",
    icon: Briefcase,
  },
];

export function ProductsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Loans" | "Insurance" | "Cards" | "Services">("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") || "";
    if (cat.toLowerCase().includes("loan")) setActiveCategory("Loans");
    else if (cat.toLowerCase().includes("insurance")) setActiveCategory("Insurance");
    else if (cat.toLowerCase().includes("card")) setActiveCategory("Cards");
    else if (cat.toLowerCase().includes("service")) setActiveCategory("Services");
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchQ = !q || [p.title, p.text, p.category, p.subcategory || ""].join(" ").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  // Grouping for Loans category display
  const loanSubcategories = useMemo(() => {
    if (activeCategory !== "Loans") return [];
    const subs = Array.from(new Set(allProducts.filter((p) => p.category === "Loans").map((p) => p.subcategory)));
    return subs.filter(Boolean) as string[];
  }, [activeCategory]);

  return (
    <main className="bg-white text-[#192337] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F7F3FF] via-white to-slate-50/50 border-b border-purple-100/60 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] tracking-[0.16em] uppercase text-[#5B21B6] font-medium block mb-1">
                Fintaraa Products Directory
              </span>
              <h1 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.1]">
                Financial Products & Services Directory
              </h1>
              <p className="mt-2 text-[15px] text-slate-500 font-light max-w-2xl">
                Compare loans, credit cards, insurance coverage, and compliance services from top partner institutions.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-80 relative shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search personal loan, cards..."
                className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[13px] text-slate-800 outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 font-light"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
            {(["All", "Loans", "Cards", "Insurance", "Services"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-medium transition whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#5B21B6] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat === "All" ? "All Products" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeCategory === "Loans" && !query ? (
            // Grouped Subcategory Sections for Loans
            <div className="space-y-12">
              {loanSubcategories.map((sub) => {
                const subProducts = filteredProducts.filter((p) => p.subcategory === sub);
                if (subProducts.length === 0) return null;
                return (
                  <div key={sub} className="space-y-5">
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                      <h2 className="text-[22px] font-normal text-slate-900">{sub}</h2>
                      <span className="text-[12px] text-slate-400 font-light">{subProducts.length} Options</span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subProducts.map((p) => (
                        <ProductCard key={p.title} product={p} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Regular Filtered Grid
            <div>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-600">
                  Showing {filteredProducts.length} product options
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.title} product={p} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Search className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                  <p className="text-[16px] font-medium text-slate-800">No products matched your search.</p>
                  <p className="text-[13px] text-slate-500 font-light mt-1">Try clearing filters or search terms.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#5B21B6] text-white text-[12.5px] font-medium cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <AppDownloadBanner />
    </main>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  const IconComp = product.icon;
  return (
    <Link
      href={product.href}
      className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between no-underline"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center transition-transform group-hover:scale-105">
            <IconComp className="h-5 w-5" />
          </div>
          {product.badge && (
            <span className="rounded-lg bg-purple-50/80 px-2.5 py-1 text-[11px] font-medium text-[#5B21B6] border border-purple-100">
              {product.badge}
            </span>
          )}
        </div>

        <h3 className="text-[18px] font-medium text-slate-900 group-hover:text-[#5B21B6] transition-colors">
          {product.title}
        </h3>
        <p className="mt-2 text-[13px] text-slate-500 font-light leading-relaxed">
          {product.text}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[12.5px] font-medium text-[#5B21B6]">
        <span>Explore Details</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
