"use client";

import { Children, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  BadgePercent,
  BriefcaseBusiness,
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
  HeartPulse,
  Home,
  Landmark,
  Plane,
  PackageCheck,
  ReceiptText,
  Repeat2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Tractor,
  Umbrella,
  WalletCards,
  Wrench,
} from "lucide-react";
import { AutoCarousel } from "@/components/common/AutoCarousel";
import {
  ImageProductCard,
  ResponsiveServicesRow,
  ServiceWorkflowCard,
} from "@/components/home/ProductExplorer";

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
      "Business, tax and compliance services available on the Fintaraa homepage.",
    products: [
      {
        title: "CIBIL Score Check",
        text: "Check your credit score instantly.",
        href: "/cibil-score",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "ITR Filing",
        text: "Professional income tax return filing.",
        href: "/itr-filing",
        icon: ReceiptText,
        tone: "orange",
      },
      {
        title: "GST Registration & Return Filing",
        text: "Complete GST compliance solutions.",
        href: "/gst-registration",
        icon: FileCheck2,
        tone: "orange",
      },
      {
        title: "MSME Registration",
        text: "Register your MSME business easily.",
        href: "/msme-registration",
        icon: BriefcaseBusiness,
        tone: "orange",
      },
      {
        title: "Annual Compliance",
        text: "Stay compliant with annual requirements.",
        href: "/annual-compliance",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "ROC Filing",
        text: "Get support for annual and event-based company filings.",
        href: "/roc-filing",
        icon: FileCheck2,
        tone: "orange",
      },
      {
        title: "Project Report",
        text: "Get project reports for loan, funding and business planning.",
        href: "/project-report",
        icon: FileCheck2,
        tone: "orange",
      },
      {
        title: "Tax Compliances",
        text: "Get support for tax notices, filings and compliance tracking.",
        href: "/tax-compliance",
        icon: ReceiptText,
        tone: "orange",
      },
      {
        title: "Company Registration",
        text: "Register Pvt Ltd, LLP & OPC companies.",
        href: "/company-registration",
        icon: BriefcaseBusiness,
        tone: "orange",
      },
    ],
  },
];

const categories = ["All", ...productSections.map((section) => section.title)];

const categoryFromQuery = (value: string | null) => {
  const normalized = String(value || "").toLowerCase();
  if (["loan", "loans"].includes(normalized)) return "Explore Loan Options";
  if (["insurance", "insurances"].includes(normalized))
    return "Explore Insurance Plans";
  if (["card", "cards", "credit-card", "credit-cards"].includes(normalized))
    return "Explore Credit Card Options";
  if (["services", "additional-services"].includes(normalized))
    return "Explore Additional Services";
  return "All";
};

const categoryLabel = (value: string) => {
  if (value === "All") return "All";
  if (value === "Explore Loan Options") return "Loans";
  if (value === "Explore Insurance Plans") return "Insurance";
  if (value === "Explore Credit Card Options") return "Cards";
  if (value === "Explore Additional Services") return "Services";
  return value.replace("Explore ", "");
};

function ResponsiveProductCollection({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  const items = Children.toArray(children);

  return (
    <>
      <div className="md:hidden">
        <AutoCarousel
          ariaLabel={ariaLabel}
          mobileSlides={2}
          tabletSlides={2}
          delay={4600}
          className="product-card-carousel"
        >
          {items}
        </AutoCarousel>
      </div>

      <div
        role="region"
        aria-label={ariaLabel}
        className="hidden gap-4 md:grid md:grid-cols-4 lg:grid-cols-7"
      >
        {items.map((item, index) => (
          <div key={index} className="h-full min-w-0">
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

export function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const normalizedQuery = query.trim().toLowerCase();
  const totalProducts = productSections.reduce(
    (count, section) => count + section.products.length,
    0,
  );

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setCategory(categoryFromQuery(params.get("category")));
      const search = params.get("q") || params.get("search");
      if (search) setQuery(search);
    });
  }, []);

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
      <section className="relative overflow-hidden px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(25,85,133,0.10),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(18,183,106,0.12),transparent_22%),linear-gradient(180deg,#faf5ff_0%,#ffffff_72%)]" /> */}
        <div className="relative mx-auto max-w-9xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 shrink-0">
              <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-[#07162d] md:text-[30px]">
                Fintaraa Products & Services
              </h1>
              <p className="mt-1 text-[13px] font-bold text-[#667085]">
                Showing {visibleProducts} of {totalProducts} products
              </p>
              {/* <p className="mt-5 max-w-3xl text-[16px] text-[#5d6b7c]">
                Explore loans, credit cards, insurance plans, and support
                services designed for assisted applications and transparent
                financial decisions.
              </p> */}
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
                  <span className="text-[18px] font-extrabold text-[#07162d]">
                    {value}
                  </span>
                </div>
              ))}
            </div> */}
            <div className="flex min-w-0 flex-col gap-3 xl:flex-1 xl:flex-row xl:items-center xl:justify-end">
              <label className="relative block w-full xl:max-w-110">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search personal loan, cashback cards, health insurance..."
                  className="h-11 w-full rounded-xl border border-[#dbe7f2] bg-white pl-9 pr-4 text-[13px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#3b0764]"
                />
              </label>

              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((current) => !current)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#eef8ff] px-3 text-[12px] font-extrabold text-[#3b0764] transition hover:bg-[#e1f2ff]"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </button>
                <div
                  className={`min-w-0 gap-2 overflow-x-auto ${
                    filtersOpen ? "flex" : "hidden"
                  }`}
                >
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`h-10 shrink-0 rounded-xl px-3.5 text-[12px] font-extrabold transition ${
                        category === item
                          ? "bg-[#3b0764] text-white"
                          : "bg-[#f3faff] text-[#3b0764] hover:bg-[#e7f4ff]"
                      }`}
                    >
                      {categoryLabel(item)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 md:pb-12 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 md:gap-12">
          {filteredSections.length ? (
            filteredSections.map((section) => (
              <div key={section.title}>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#07162d] md:text-[26px]">
                      {section.title}
                    </h2>
                    {/* <p className="mt-2 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
                      {section.subtitle}
                    </p> */}
                  </div>
                  <span className="w-fit rounded-full bg-[#ede9fe] px-4 py-2 text-[12px] font-extrabold text-[#5b21b6]">
                    {section.products.length} products
                  </span>
                </div>

                {section.title === "Explore Additional Services" ? (
                  <ResponsiveServicesRow ariaLabel={section.title}>
                    {section.products.map((product) => (
                      <ServiceWorkflowCard
                        key={product.title}
                        product={product}
                      />
                    ))}
                  </ResponsiveServicesRow>
                ) : (
                  <ResponsiveProductCollection
                    ariaLabel={`${section.title} products`}
                  >
                    {section.products.map((product) => {
                      const { title } = product;

                      return (
                        <ImageProductCard
                          key={title}
                          product={product}
                          hideContentBadge
                          hideIcon
                        />
                      );
                    })}
                  </ResponsiveProductCollection>
                )}
              </div>
            ))
          ) : (
            <div className="bg-[#f8fcff] p-10 text-center ring-1 ring-[#e4edf5]">
              <Search className="mx-auto h-8 w-8 text-[#3b0764]" />
              <h2 className="mt-4 text-[24px] font-extrabold text-[#07162d]">
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
                className="mt-5 rounded-full bg-[#3b0764] px-5 py-3 text-[13px] font-extrabold text-white"
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
