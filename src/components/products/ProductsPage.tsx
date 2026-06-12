"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  BadgePercent,
  BriefcaseBusiness,
  Calculator,
  Car,
  ChartPie,
  Coins,
  Construction,
  CreditCard,
  Crown,
  Factory,
  FileCheck2,
  Fuel,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  PackageCheck,
  QrCode,
  ReceiptText,
  Repeat2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Store,
  Tractor,
  Umbrella,
  WalletCards,
  Wrench,
} from "lucide-react";
import { productHref } from "@/lib/productRouting";

const toneClass: Record<string, string> = {
  amber: "bg-[#fff3df] text-[#f79009]",
  blue: "bg-[#e4f4ff] text-[#195585]",
  brown: "bg-[#fff3e5] text-[#a36a19]",
  gold: "bg-[#fff3c6] text-[#d4a42f]",
  green: "bg-[#dff7e8] text-[#2a9f55]",
  olive: "bg-[#fbffd8] text-[#8a941a]",
  orange: "bg-[#fff4eb] text-[#f28c28]",
  pink: "bg-[#ffd5f1] text-[#f1129d]",
  red: "bg-[#ffe1e4] text-[#ef1010]",
  rose: "bg-[#ffd4e5] text-[#bd3b75]",
  sky: "bg-[#dff0ff] text-[#1b76a6]",
  violet: "bg-[#f3e2ff] text-[#c067f2]",
  yellow: "bg-[#fff1bd] text-[#e8b23d]",
};

const productSections = [
  {
    title: "Explore Loan Options",
    subtitle:
      "All loan types supported by the Fintaraa backend for assisted applications.",
    products: [
      {
        title: "Personal Loan",
        text: "Flexible credit for planned or urgent personal needs.",
        icon: BadgeIndianRupee,
        tone: "pink",
      },
      {
        title: "Education Loan",
        text: "Finance courses, tuition, living costs, and study goals.",
        icon: GraduationCap,
        tone: "green",
      },
      {
        title: "Vehicle Loan",
        text: "Funding support for new or used vehicle purchases.",
        icon: Car,
        tone: "red",
      },
      {
        title: "Gold Loan",
        text: "Unlock short-term liquidity against eligible gold assets.",
        icon: Coins,
        tone: "gold",
      },
      {
        title: "Loan Against Car",
        text: "Use eligible car value to access secured funds.",
        icon: Car,
        tone: "blue",
      },
      {
        title: "Instant Loan",
        text: "Quick digital loan assistance for immediate requirements.",
        icon: HandCoins,
        tone: "yellow",
      },
      {
        title: "Loan Against Property",
        text: "Secured funding against residential or commercial property.",
        icon: Home,
        tone: "orange",
      },
      {
        title: "Renovation Loan",
        text: "Upgrade, repair, or renovate your property with structured EMIs.",
        icon: Construction,
        tone: "amber",
      },
      {
        title: "Working Capital Loan",
        text: "Manage inventory, cash flow, and business operating cycles.",
        icon: BriefcaseBusiness,
        tone: "violet",
      },
      {
        title: "Loan Against Security",
        text: "Access credit against eligible financial securities.",
        icon: ShieldCheck,
        tone: "sky",
      },
      {
        title: "Machinery Loan",
        text: "Finance machinery and equipment for business growth.",
        icon: Wrench,
        tone: "olive",
      },
      {
        title: "Home Loan",
        text: "Finance purchase, construction, or takeover of your home.",
        icon: Home,
        tone: "orange",
      },
      {
        title: "Business Loan",
        text: "Capital for expansion, operations, and business opportunities.",
        icon: BriefcaseBusiness,
        tone: "amber",
      },
      {
        title: "DOD Loan",
        text: "Demand overdraft style credit for eligible business needs.",
        icon: Landmark,
        tone: "blue",
      },
      {
        title: "OD Loan",
        text: "Overdraft facility support for short-term liquidity.",
        icon: WalletCards,
        tone: "green",
      },
      {
        title: "Industrial Loan",
        text: "Funding assistance for industrial and manufacturing use cases.",
        icon: Factory,
        tone: "brown",
      },
      {
        title: "Commercial Purchases Loan",
        text: "Credit support for commercial purchases and assets.",
        icon: Tractor,
        tone: "rose",
      },
      {
        title: "Credit Card",
        text: "Backend-supported credit card application and offer journey.",
        icon: CreditCard,
        tone: "sky",
      },
    ],
  },
  {
    title: "Explore Insurance Plans",
    subtitle:
      "All insurance types supported by the Fintaraa backend for enquiry and fulfilment.",
    products: [
      {
        title: "Life Insurance",
        text: "Financial protection for your family’s long-term future.",
        icon: Umbrella,
        tone: "brown",
      },
      {
        title: "Health Insurance",
        text: "Cover medical expenses, hospitalisation, and emergencies.",
        icon: HeartPulse,
        tone: "rose",
      },
      {
        title: "Vehicle Insurance",
        text: "Protect cars, bikes, and vehicles from covered risks.",
        icon: Car,
        tone: "red",
      },
      {
        title: "Property Insurance",
        text: "Secure homes, shops, and property against covered losses.",
        icon: Home,
        tone: "orange",
      },
      {
        title: "Stock Insurance",
        text: "Protect business stock and inventory from unexpected risks.",
        icon: PackageCheck,
        tone: "pink",
      },
      {
        title: "Machinery Insurance",
        text: "Coverage support for machinery and equipment assets.",
        icon: Wrench,
        tone: "olive",
      },
      {
        title: "Term Insurance",
        text: "Pure protection cover for financial security.",
        icon: ShieldCheck,
        tone: "sky",
      },
      {
        title: "Travel Insurance",
        text: "Cover travel-related medical, baggage, and trip risks.",
        icon: Plane,
        tone: "violet",
      },
      {
        title: "Retirement Plan",
        text: "Plan long-term income and retirement security.",
        icon: Landmark,
        tone: "gold",
      },
      {
        title: "Shop Insurance",
        text: "Protect your shop from fire, theft, and business risks.",
        icon: Store,
        tone: "green",
      },
    ],
  },
  {
    title: "Explore Credit Card Options",
    subtitle:
      "Pick cards for travel, fuel, shopping, cashback, and premium rewards.",
    products: [
      {
        title: "Travel Cards",
        text: "Miles, lounge access, and trip benefits.",
        icon: Plane,
        tone: "orange",
      },
      {
        title: "Fuel Cards",
        text: "Save more on fuel spends and surcharges.",
        icon: Fuel,
        tone: "blue",
      },
      {
        title: "Cashback Cards",
        text: "Earn value back on everyday purchases.",
        icon: WalletCards,
        tone: "green",
      },
      {
        title: "Shopping Cards",
        text: "Rewards and offers for online shopping.",
        icon: Store,
        tone: "yellow",
      },
      {
        title: "Premium Cards",
        text: "Lifestyle privileges and curated benefits.",
        icon: Crown,
        tone: "violet",
      },
      {
        title: "Rewards Cards",
        text: "Earn points and benefits on regular spends.",
        icon: BadgePercent,
        tone: "rose",
      },
      {
        title: "Balance Transfer",
        text: "Shift card dues into easier repayment options.",
        icon: Repeat2,
        tone: "sky",
      },
    ],
  },
  {
    title: "Explore Additional Services",
    subtitle:
      "Useful financial tools and services for a smoother money journey.",
    products: [
      {
        title: "Credit Score",
        text: "Check your score and understand key factors.",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "ITR Filing",
        text: "Get organised help for income tax filing.",
        icon: ReceiptText,
        tone: "green",
      },
      {
        title: "Balance Transfer",
        text: "Move eligible balances to better terms.",
        icon: Repeat2,
        tone: "blue",
      },
      {
        title: "Digital Payments",
        text: "Manage payments with secure digital options.",
        icon: QrCode,
        tone: "red",
      },
      {
        title: "Financial Planning",
        text: "Plan goals, budgets, and credit decisions.",
        icon: ChartPie,
        tone: "violet",
      },
      {
        title: "Document Help",
        text: "Organise KYC, income, and bank documents.",
        icon: FileCheck2,
        tone: "yellow",
      },
      {
        title: "Mobile App Support",
        text: "Get help managing your Fintaraa app account.",
        icon: Smartphone,
        tone: "sky",
      },
    ],
  },
];

const categories = ["All", ...productSections.map((section) => section.title)];

export function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const normalizedQuery = query.trim().toLowerCase();
  const totalProducts = productSections.reduce(
    (count, section) => count + section.products.length,
    0,
  );

  const filteredSections = useMemo(() => {
    return productSections
      .filter((section) => category === "All" || section.title === category)
      .map((section) => ({
        ...section,
        products: section.products.filter((product) => {
          if (!normalizedQuery) return true;
          return [product.title, product.text, section.title, section.subtitle]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        }),
      }))
      .filter((section) => section.products.length > 0);
  }, [category, normalizedQuery]);

  const visibleProducts = filteredSections.reduce(
    (count, section) => count + section.products.length,
    0,
  );

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden px-4 py-12 md:px-6 lg:px-8">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(25,85,133,0.10),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(18,183,106,0.12),transparent_22%),linear-gradient(180deg,#f5fbff_0%,#ffffff_72%)]" /> */}
        <div className="relative mx-auto max-w-9xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_25rem] lg:items-end">
            <div>
              <h1 className="text-[20px] font-bold leading-[1.02] tracking-[-0.02em] text-[#07162d] md:text-[40px]">
                Compare financial products with clarity.
              </h1>
              <p className="mt-5 max-w-3xl text-[16px] text-[#5d6b7c]">
                Explore loans, credit cards, insurance plans, and support
                services designed for assisted applications and transparent
                financial decisions.
              </p>
            </div>

            {/* <div className="grid gap-3 bg-white/90 p-4 ring-1 ring-[#e4edf5]">
              {[
                ["Total products", `${totalProducts}+`],
                ["Categories", `${productSections.length}`],
                ["Secure journey", "Assisted"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-[#edf3f8] pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-[13px] font-semibold text-[#667085]">
                    {label}
                  </span>
                  <span className="text-[18px] font-black text-[#07162d]">
                    {value}
                  </span>
                </div>
              ))}
            </div> */}
          </div>

          <div className="mt-9 grid gap-4 bg-white p-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <label className="relative block">
              <Search className="absolute left-0 top-3.5 h-4.5 w-4.5 text-[#98a2b3]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search personal loan, cashback cards, health insurance..."
                className="h-12 w-full border-0 border-b border-[#cfddea] bg-transparent pl-8 text-[15px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#195585]"
              />
            </label>

            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="hidden h-10 items-center gap-2 rounded-full bg-[#eef8ff] px-3 text-[12px] font-extrabold text-[#195585] xl:inline-flex">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </span>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition ${
                    category === item
                      ? "bg-[#195585] text-white"
                      : "bg-[#f3faff] text-[#195585] hover:bg-[#e7f4ff]"
                  }`}
                >
                  {item === "All" ? "All" : item.replace("Explore ", "")}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[13px] font-semibold text-[#667085]">
            Showing {visibleProducts} of {totalProducts} products
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-14">
          {filteredSections.length ? (
            filteredSections.map((section) => (
              <div key={section.title}>
                <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#195585]">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#12b76a]" />
                      {section.title.replace("Explore ", "")}
                    </div>
                    <h2 className="mt-3 text-[30px] font-black tracking-[-0.02em] text-[#07162d]">
                      {section.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
                      {section.subtitle}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[#ecfdf3] px-4 py-2 text-[12px] font-extrabold text-[#067647]">
                    {section.products.length} products
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
                  {section.products.map(({ title, text, icon: Icon, tone }) => (
                    <Link
                      key={title}
                      href={productHref(title)}
                      className="group flex min-h-64 flex-col items-center justify-between rounded-xl bg-white px-2 py-4 text-center no-underline ring-1 ring-[#eef2f7] transition duration-300 hover:-translate-y-1 hover:ring-[#d9f6e6]"
                    >
                      <div>
                        <div className="flex justify-center">
                          <span
                            className={`mt-3 flex h-14 w-14 items-center justify-center rounded-full ${
                              toneClass[tone] || toneClass.blue
                            }`}
                          >
                            <Icon className="h-7 w-7 stroke-2" />
                          </span>
                        </div>

                        <h3 className="mt-5 line-clamp-2 text-[16px] font-extrabold leading-snug text-[#1d2738] transition group-hover:text-[#195585]">
                          {title}
                        </h3>
                        <p className="mt-4 line-clamp-3 text-[13px] font-medium leading-5 text-[#4b5565]">
                          {text}
                        </p>
                      </div>

                      <span className="mt-6 flex h-9 w-9 items-center justify-center text-[#08a045] transition group-hover:translate-x-1">
                        <ArrowRight className="h-7 w-7 stroke-[2.6]" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f8fcff] p-10 text-center ring-1 ring-[#e4edf5]">
              <Search className="mx-auto h-8 w-8 text-[#195585]" />
              <h2 className="mt-4 text-[24px] font-black text-[#07162d]">
                No products found
              </h2>
              <p className="mt-2 text-[14px] font-semibold text-[#667085]">
                Try a different keyword or switch back to all categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="mt-5 rounded-full bg-[#195585] px-5 py-3 text-[13px] font-extrabold text-white"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
