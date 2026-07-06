"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
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
  type LucideIcon,
} from "lucide-react";
import { productHref, slugifyProduct } from "@/lib/productRouting";
import { fetchPublicProductPages } from "@/services/productCatalog";

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

const productVisualMeta: Record<string, { image?: string; badge?: string }> = {
  "Personal Loan": {
    image: "/assets/home/hero-banners/instant-digital-loan.png",
    badge: "Quick funds",
  },
  "Education Loan": {
    image: "/assets/blogs/blog4.png",
    badge: "Study funding",
  },
  "Vehicle Loan": {
    image: "/assets/refer/header-credit-cards.png",
    badge: "Vehicle finance",
  },
  "Gold Loan": {
    image: "/assets/images/coin-bag.png",
    badge: "Quick cash",
  },
  "Loan Against Car": {
    image: "/assets/refer/header-credit-cards.png",
    badge: "Car value",
  },
  "Instant Loan": {
    image: "/assets/home/hero-banners/instant-digital-loan.png",
    badge: "Fast approval",
  },
  "Loan Against Property": {
    image: "/assets/images/hero.png",
    badge: "Secured loan",
  },
  "Renovation Loan": {
    image: "/assets/contact/contact-hero.png",
    badge: "Home upgrade",
  },
  "Working Capital Loan": {
    image: "/assets/dsa/handshake.png",
    badge: "Cash flow",
  },
  "Loan Against Security": {
    image: "/assets/images/security.png",
    badge: "Asset backed",
  },
  "Machinery Loan": {
    image: "/assets/services/gst-hero.png",
    badge: "Equipment finance",
  },
  "Home Loan": {
    image: "/assets/contact/contact-hero.png",
    badge: "Low EMI",
  },
  "Business Loan": {
    image: "/assets/dsa/handshake.png",
    badge: "Growth capital",
  },
  "DOD Loan": {
    image: "/assets/dsa/hero-quality.png",
    badge: "Credit line",
  },
  "OD Loan": {
    image: "/assets/dsa/hero-quality.png",
    badge: "Flexible limit",
  },
  "Industrial Loan": {
    image: "/assets/services/gst-hero.png",
    badge: "Industrial growth",
  },
  "Commercial Purchases Loan": {
    image: "/assets/images/handshake.png",
    badge: "Commercial credit",
  },
  "Credit Card": {
    image: "/assets/home/hero-banners/credit-card-rewards.png",
    badge: "Card options",
  },
  "Life Insurance": {
    image: "/assets/home/hero-banners/insurance-family-protection.png",
    badge: "Family security",
  },
  "Health Insurance": {
    image: "/assets/images/testimonials/client-1.jpg",
    badge: "Medical cover",
  },
  "Vehicle Insurance": {
    image: "/assets/refer/header-credit-cards.png",
    badge: "Vehicle cover",
  },
  "Property Insurance": {
    image: "/assets/images/hero.png",
    badge: "Property safety",
  },
  "Stock Insurance": {
    image: "/assets/blogs/blog3.png",
    badge: "Asset cover",
  },
  "Machinery Insurance": {
    image: "/assets/services/gst-hero.png",
    badge: "Machine cover",
  },
  "Term Insurance": {
    image: "/assets/images/testimonials/client-3.jpg",
    badge: "Pure protection",
  },
  "Travel Insurance": {
    image: "/assets/careers/life-5.jpg",
    badge: "Trip cover",
  },
  "Retirement Plan": {
    image: "/assets/images/coin-bag.png",
    badge: "Future income",
  },
  "Shop Insurance": {
    image: "/assets/services/gst-hero.png",
    badge: "Business cover",
  },
  "Travel Cards": {
    image: "/assets/careers/life-5.jpg",
    badge: "Travel rewards",
  },
  "Fuel Cards": {
    image: "/assets/images/hero1.png",
    badge: "Fuel savings",
  },
  "Cashback Cards": {
    image: "/assets/banks/visa-card.png",
    badge: "Cashback",
  },
  "Shopping Cards": {
    image: "/assets/blogs/blog2.png",
    badge: "Shopping perks",
  },
  "Premium Cards": {
    image: "/assets/offers/offer.png",
    badge: "Premium rewards",
  },
  "Rewards Cards": {
    image: "/assets/offers/offer.png",
    badge: "Reward points",
  },
  "Balance Transfer": {
    image: "/assets/images/coin-bag.png",
    badge: "Save interest",
  },
  "Credit Score": {
    image: "/assets/images/cibil-score-quality.png",
    badge: "Score check",
  },
  "ITR Filing": {
    image: "/assets/services/itr-hero.png",
    badge: "Tax filing",
  },
  "Digital Payments": {
    image: "/assets/offers/wallet.png",
    badge: "Payments",
  },
  "Financial Planning": {
    image: "/assets/images/blog-feature.png",
    badge: "Planning",
  },
  "Document Help": {
    image: "/assets/services/statusicon.png",
    badge: "Documents",
  },
  "Mobile App Support": {
    image: "/assets/refer/phone.png",
    badge: "App support",
  },
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

function ProductVisualCard({
  title,
  text,
  icon: Icon,
  tone,
  isManaged,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
  tone: string;
  isManaged: boolean;
}) {
  const meta = productVisualMeta[title] || {};

  return (
    <Link
      href={productHref(title)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e2edf8] bg-white no-underline transition-colors hover:border-[#bcd8f4]"
    >
      <div className="relative aspect-[1.45/1] bg-[#f7fbff]">
        {meta.image ? (
          <Image
            src={meta.image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                toneClass[tone] || toneClass.blue
              }`}
            >
              <Icon className="h-7 w-7 stroke-2" />
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#07162d]/60 via-transparent to-transparent" />
        <span className="absolute inset-x-0 top-0 z-10 flex min-h-7 items-center justify-center rounded-t-xl bg-[#075cde] px-3 text-center text-[10px] font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur-md [text-shadow:0_1px_8px_rgba(7,22,45,0.75)]">
          {meta.badge || "Featured"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[16px] font-bold leading-snug text-[#07162d]">
            {title}
          </h3>
          {isManaged ? (
            <span className="shrink-0 rounded-full bg-[#ecfdf3] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#027a48]">
              Managed
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-1 text-[10px] text-[#52657d]">
          {text}
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-[#075cde]">
          Compare options
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [managedSlugs, setManagedSlugs] = useState<Set<string>>(new Set());

  const normalizedQuery = query.trim().toLowerCase();
  const totalProducts = productSections.reduce(
    (count, section) => count + section.products.length,
    0,
  );

  useEffect(() => {
    let active = true;

    fetchPublicProductPages()
      .then(({ loans, insurance }) => {
        if (!active) return;
        setManagedSlugs(
          new Set(
            [
              ...loans.map((item) => item.loanTypeSlug),
              ...insurance.map((item) => item.insuranceTypeSlug),
            ].filter(Boolean) as string[],
          ),
        );
      })
      .catch(() => {
        if (active) setManagedSlugs(new Set());
      });

    return () => {
      active = false;
    };
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
      <section className="relative overflow-hidden px-4 py-7 md:px-6 lg:px-8">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(25,85,133,0.10),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(18,183,106,0.12),transparent_22%),linear-gradient(180deg,#f5fbff_0%,#ffffff_72%)]" /> */}
        <div className="relative mx-auto max-w-9xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 shrink-0">
              <h1 className="text-[24px] font-black leading-tight tracking-[-0.02em] text-[#07162d] md:text-[30px]">
                Fintaraa Products & Services.
              </h1>
              <p className="mt-1 text-[12px] font-bold text-[#667085]">
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
                  <span className="text-[18px] font-black text-[#07162d]">
                    {value}
                  </span>
                </div>
              ))}
            </div> */}
            <div className="flex min-w-0 flex-col gap-3 xl:flex-1 xl:flex-row xl:items-center xl:justify-end">
              <label className="relative block w-full xl:max-w-[440px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search personal loan, cashback cards, health insurance..."
                  className="h-11 w-full rounded-full border border-[#dbe7f2] bg-white pl-9 pr-4 text-[13px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#195585]"
                />
              </label>

              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((current) => !current)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#eef8ff] px-3 text-[12px] font-extrabold text-[#195585] transition hover:bg-[#e1f2ff]"
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
                      className={`h-10 shrink-0 rounded-full px-3.5 text-[12px] font-extrabold transition ${
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
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-14">
          {filteredSections.length ? (
            filteredSections.map((section) => (
              <div key={section.title}>
                <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="mt-3 text-[30px] font-black tracking-[-0.02em] text-[#07162d]">
                      {section.title}
                    </h2>
                    {/* <p className="mt-2 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
                      {section.subtitle}
                    </p> */}
                  </div>
                  <span className="w-fit rounded-full bg-[#ecfdf3] px-4 py-2 text-[12px] font-extrabold text-[#067647]">
                    {section.products.length} products
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
                  {section.products.map(({ title, text, icon: Icon, tone }) => {
                    const slug = slugifyProduct(title);
                    const isManaged = managedSlugs.has(slug);

                    return (
                      <ProductVisualCard
                        key={title}
                        title={title}
                        text={text}
                        icon={Icon}
                        tone={tone}
                        isManaged={isManaged}
                      />
                    );
                  })}
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
