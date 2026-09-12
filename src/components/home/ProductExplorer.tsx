"use client";

import { Children, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { productSections } from "@/data/homePage";
import { productHref } from "@/lib/productRouting";
import { AutoCarousel } from "@/components/common/AutoCarousel";

type ProductExplorerProps = {
  sectionTitles?: string[];
  compactSpacing?: boolean;
};

export type ProductItem = {
  tag?: string;
  title: string;
  text?: string;
  logo?: string;
  tone?: string;
  href?: string;
  icon?: LucideIcon;
};

const bankOfferDetails: Record<
  string,
  { rate: string; perk: string; speed: string; amount: string }
> = {
  "ICICI Bank": {
    rate: "8.40%* p.a.",
    perk: "Processing fee ₹0",
    speed: "Loan in 5 minutes",
    amount: "Up to ₹25 Lakh",
  },
  "Kotak Bank": {
    rate: "8.65%* p.a.",
    perk: "eGift upto ₹2,500",
    speed: "Quick approval",
    amount: "Up to ₹20 Lakh",
  },
  "SBI Bank": {
    rate: "8.50%* p.a.",
    perk: "Foreclosure 0 charges",
    speed: "Fast verification",
    amount: "Up to ₹30 Lakh",
  },
  "HDFC Bank": {
    rate: "8.70%* p.a.",
    perk: "Welcome benefit ₹3,000",
    speed: "Digital sanction",
    amount: "Up to ₹40 Lakh",
  },
  "Axis Bank": {
    rate: "8.75%* p.a.",
    perk: "Cashback upto ₹2,000",
    speed: "Instant approval",
    amount: "Up to ₹18 Lakh",
  },
  "Yes Bank": {
    rate: "8.60%* p.a.",
    perk: "Same-day disbursal",
    speed: "Paperless flow",
    amount: "Up to ₹22 Lakh",
  },
  "IndusInd Bank": {
    rate: "8.95%* p.a.",
    perk: "Low document check",
    speed: "Priority callback",
    amount: "Up to ₹15 Lakh",
  },
};

export const productMeta: Record<
  string,
  {
    image?: string;
    rate?: string;
    hint?: string;
    badge?: string;
    detail?: string;
    cta?: string;
  }
> = {
  "Personal Loan": {
    rate: "From 10.5% p.a.",
    hint: "Salaried & self-employed",
    detail: "Instant approval guidance",
    badge: "Quick funds",
    image: "/assets/product-cards/loans/personal-loan.webp",
  },
  "Home Loan": {
    rate: "From 8.5% p.a.",
    hint: "Up to ₹5 Cr",
    detail: "Long tenure, lower EMI",
    badge: "Low EMI",
    image: "/assets/product-cards/loans/home-loan.webp",
  },
  "Business Loan": {
    rate: "From 12% p.a.",
    hint: "No collateral options",
    detail: "Working capital support",
    badge: "Growth capital",
    image: "/assets/product-cards/loans/business-loan.webp",
  },
  "Vehicle Loan": {
    rate: "From 7.9% p.a.",
    hint: "Used & new cars",
    detail: "Fast dealer coordination",
    badge: "Fast sanction",
    image: "/assets/product-cards/loans/vehicle-loan.webp",
  },
  "Education Loan": {
    rate: "Study funding",
    hint: "Domestic & overseas",
    detail: "Course-based eligibility",
    badge: "Career ready",
    image: "/assets/product-cards/loans/education-loan.webp",
  },
  "Gold Loan": {
    rate: "Instant value",
    hint: "Against pledged gold",
    detail: "Quick valuation process",
    badge: "Quick cash",
    image: "/assets/product-cards/loans/gold-loan.webp",
  },
  "Loan Against Property": {
    rate: "High-ticket funding",
    hint: "Residential/commercial",
    detail: "Secured large funding",
    badge: "Secured loan",
    image: "/assets/product-cards/loans/loan-against-property.webp",
  },
  "Health Insurance": {
    image: "/assets/product-cards/insurance/health-insurance.webp",
    hint: "Cashless care, family floater and hospital-network options.",
    detail: "Compare premiums, waiting periods and room-rent limits.",
    badge: "Medical cover",
  },
  "Life Insurance": {
    image: "/assets/product-cards/insurance/life-insurance.webp",
    hint: "Long-term financial protection for the people who depend on you.",
    detail: "Review cover amount, payout terms and premium flexibility.",
    badge: "Family security",
  },
  "Shop Insurance": {
    image: "/assets/product-cards/insurance/shop-insurance.webp",
    hint: "Protect your shop from fire, theft, liability and business risk.",
    detail: "Useful for retail stores, offices and small business owners.",
    badge: "Business cover",
  },
  "Stock Insurance": {
    image: "/assets/product-cards/insurance/stock-insurance.webp",
    hint: "Cover inventory and stock against unexpected damage or loss.",
    detail: "Designed for traders, retailers and warehouse-led businesses.",
    badge: "Asset cover",
  },
  "Term Insurance": {
    image: "/assets/product-cards/insurance/term-insurance.webp",
    hint: "High life cover at a disciplined, affordable premium.",
    detail: "Compare claim ratio, riders and payout preferences.",
    badge: "Pure protection",
  },
  "Property Insurance": {
    image: "/assets/product-cards/insurance/property-insurance.webp",
    hint: "Secure your home, building and valuable assets from risk.",
    detail: "Compare structure, contents and natural calamity coverage.",
    badge: "Property safety",
  },
  "Travel Insurance": {
    image: "/assets/product-cards/insurance/travel-insurance.webp",
    hint: "Travel with cover for medical, baggage and trip disruptions.",
    detail: "Useful for domestic, international and frequent travellers.",
    badge: "Trip cover",
  },
  "Travel Cards": {
    image: "/assets/product-cards/credit-cards/travel-cards.webp",
    hint: "Airport lounge access, miles and low forex markups.",
    detail: "Best for frequent flyers and international spends.",
    badge: "Travel rewards",
  },
  "Fuel Cards": {
    image: "/assets/product-cards/credit-cards/fuel-cards.webp",
    hint: "Fuel surcharge waivers and savings on everyday refuels.",
    detail: "Built for commuters, road trips and monthly fuel budgets.",
    badge: "Fuel savings",
  },
  "Cashback Cards": {
    image: "/assets/product-cards/credit-cards/cashback-cards.webp",
    hint: "Earn direct value back on groceries, bills and online spends.",
    detail: "Simple rewards for users who prefer cash value over points.",
    badge: "Cashback",
  },
  "Shopping Cards": {
    image: "/assets/product-cards/credit-cards/shopping-cards.webp",
    hint: "Marketplace offers, brand deals and accelerated rewards.",
    detail: "Good for online shoppers and seasonal sale purchases.",
    badge: "Shopping perks",
  },
  "Rewards Cards": {
    image: "/assets/product-cards/credit-cards/rewards-cards.webp",
    hint: "Convert regular spends into points, vouchers and upgrades.",
    detail: "Compare redemption value, caps and partner benefits.",
    badge: "Premium rewards",
  },
  "Balance Transfer": {
    image: "/assets/product-cards/credit-cards/balance-transfer.webp",
    hint: "Move outstanding dues into easier repayment options.",
    detail: "Useful for reducing interest pressure and planning EMIs.",
    badge: "Save interest",
  },
  "Dining Cards": {
    image: "/assets/product-cards/credit-cards/dining-cards.webp",
    hint: "Dining discounts, table offers and partner restaurant deals.",
    detail: "Best for food lovers and frequent weekend plans.",
    badge: "Dining offers",
  },
  "CIBIL Score Check": {
    image: "/assets/services/cibil-score-service.png",
    hint: "Check score instantly and stay financially healthy.",
    cta: "Start score check",
  },
  "ITR Filing": {
    image: "/assets/services/itr-hero.png",
    hint: "File returns accurately with guided expert support.",
    cta: "Start ITR flow",
  },
  "GST Registration & Return Filing": {
    image: "/assets/services/gst-hero.png",
    hint: "Simplify GST registration and return filing in one workflow.",
    cta: "Start GST flow",
  },
  "MSME Registration": {
    image: "/assets/services/msme-registration-service.png",
    hint: "Register MSME and unlock business benefits.",
    cta: "Register MSME",
  },
  "Annual Compliance": {
    image: "/assets/services/annual-compliance-service.png",
    hint: "Stay compliant with annual filings and reminders.",
    cta: "Check compliance",
  },
  "ROC Filing": {
    image: "/assets/services/annual-compliance-service.png",
    hint: "Prepare annual and event-based ROC filings with expert support.",
    cta: "Start ROC filing",
  },
  "Project Report": {
    image: "/assets/services/project-report-service.png",
    hint: "Get project reports for funding, tenders and planning.",
    cta: "Request report",
  },
  "Tax Compliances": {
    image: "/assets/services/tax-compliance-service.png",
    hint: "Manage notices, filings and compliance deadlines with experts.",
    cta: "Request support",
  },
  "Company Registration": {
    image: "/assets/services/company-registration-service.png",
    hint: "Register your company online and move forward.",
    cta: "Start registration",
  },
  "Loan Against Car": {
    image:
      "/assets/loan-banners/rendered/loan-against-car-01-mobile.webp",
    hint: "Access secured funds against the value of your eligible car.",
    detail: "Compare valuation, tenure and lender requirements.",
    badge: "Car value",
  },
  "Instant Loan": {
    image: "/assets/loan-banners/rendered/instant-loan-01-mobile.webp",
    hint: "Quick digital assistance for urgent personal requirements.",
    detail: "Check eligibility and next steps through a guided journey.",
    badge: "Fast approval",
  },
  "Renovation Loan": {
    image: "/assets/loan-banners/rendered/renovation-loan-01-mobile.webp",
    hint: "Finance repairs, upgrades and improvements for your property.",
    detail: "Plan project costs with structured repayment options.",
    badge: "Home upgrade",
  },
  "Working Capital Loan": {
    image:
      "/assets/loan-banners/rendered/working-capital-loan-01-mobile.webp",
    hint: "Support inventory, cash flow and day-to-day business cycles.",
    detail: "Compare limits and repayment structures for your business.",
    badge: "Cash flow",
  },
  "Loan Against Security": {
    image:
      "/assets/loan-banners/rendered/loan-against-security-01-mobile.webp",
    hint: "Unlock liquidity against eligible financial securities.",
    detail: "Retain investments while accessing secured credit.",
    badge: "Asset backed",
  },
  "Machinery Loan": {
    image: "/assets/loan-banners/rendered/machinery-loan-01-mobile.webp",
    hint: "Finance machinery and equipment for business expansion.",
    detail: "Compare funding for new and upgraded equipment.",
    badge: "Equipment finance",
  },
  "DOD Loan": {
    image: "/assets/loan-banners/rendered/dod-loan-01-mobile.webp",
    hint: "Demand-overdraft support for eligible business requirements.",
    detail: "Understand limits, utilisation and repayment terms.",
    badge: "Credit line",
  },
  "OD Loan": {
    image: "/assets/loan-banners/rendered/od-loan-01-mobile.webp",
    hint: "Flexible overdraft support for short-term liquidity.",
    detail: "Pay interest on utilised limits as per lender terms.",
    badge: "Flexible limit",
  },
  "Industrial Loan": {
    image: "/assets/loan-banners/rendered/industrial-loan-01-mobile.webp",
    hint: "Funding for manufacturing and industrial growth needs.",
    detail: "Compare options for capacity, assets and expansion.",
    badge: "Industrial growth",
  },
  "Commercial Purchases Loan": {
    image:
      "/assets/loan-banners/rendered/commercial-purchases-loan-01-mobile.webp",
    hint: "Credit support for eligible commercial assets and purchases.",
    detail: "Plan business acquisitions with structured repayments.",
    badge: "Commercial credit",
  },
  "Credit Card": {
    image: "/assets/product-cards/credit-cards/rewards-cards.webp",
    hint: "Explore credit cards matched to spending and reward needs.",
    detail: "Compare fees, benefits and eligibility before applying.",
    badge: "Card options",
  },
  "Vehicle Insurance": {
    image:
      "/assets/insurance-banners/rendered/vehicle-insurance-01-mobile.webp",
    hint: "Protect eligible vehicles against covered damage and loss.",
    detail: "Compare own-damage, third-party and add-on coverage.",
    badge: "Vehicle cover",
  },
  "Machinery Insurance": {
    image:
      "/assets/insurance-banners/rendered/machinery-insurance-01-mobile.webp",
    hint: "Protect business machinery from covered operational risks.",
    detail: "Review asset value, exclusions and protection scope.",
    badge: "Machine cover",
  },
  "Retirement Plan": {
    image:
      "/assets/insurance-banners/rendered/retirement-plan-01-mobile.webp",
    hint: "Build a disciplined plan for long-term retirement income.",
    detail: "Compare contribution, vesting and payout preferences.",
    badge: "Future income",
  },
  "Premium Cards": {
    image: "/assets/product-cards/credit-cards/rewards-cards.webp",
    hint: "Premium rewards, travel privileges and lifestyle benefits.",
    detail: "Compare fees, milestones and premium partner offers.",
    badge: "Premium rewards",
  },
  "Credit Score": {
    image: "/assets/services/cibil-score-service.png",
    hint: "Check your score and understand the factors affecting it.",
    detail: "Use guided insights before planning your next application.",
    badge: "Score check",
  },
  "Digital Payments": {
    image: "/assets/offers/wallet.png",
    hint: "Manage everyday payments through secure digital options.",
    detail: "Explore convenient payment tools and account support.",
    badge: "Payments",
  },
  "Financial Planning": {
    image: "/assets/images/blog-feature.png",
    hint: "Plan goals, budgets and credit decisions with more clarity.",
    detail: "Build a practical roadmap around your financial priorities.",
    badge: "Planning",
  },
  "Document Help": {
    image: "/assets/services/statusicon.png",
    hint: "Organise KYC, income and bank documents for applications.",
    detail: "Follow a clear checklist and reduce missing-document delays.",
    badge: "Documents",
  },
  "Mobile App Support": {
    image: "/assets/refer/phone.png",
    hint: "Get help managing your Fintaraa account and application.",
    detail: "Resolve access, profile and application-tracking questions.",
    badge: "App support",
  },
};

const isBankSection = (title: string) => title.includes("Get Instant Loan");
const isOtherServices = (title: string) => title === "Other financial services";
const isImageCategory = (title: string) =>
  title === "Explore Loan Options" ||
  title === "Explore Insurance Plans" ||
  title === "Explore Credit Card Options";

const sectionHref = (title: string, fallback?: string) => {
  if (fallback) return fallback;
  if (title === "Explore Loan Options") return "/products?category=loans";
  if (title === "Explore Insurance Plans")
    return "/products?category=insurance";
  if (title === "Explore Credit Card Options")
    return "/products?category=credit-cards";
  if (title === "Other financial services")
    return "/products?category=services";
  return "/products";
};

function SectionTop({
  title,
  subtitle,
  ctaLabel,
  href,
  hero = false,
}: {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  hero?: boolean;
}) {
  const hideSubtitle =
    isBankSection(title) ||
    title === "Explore Loan Options" ||
    title === "Explore Insurance Plans" ||
    title === "Explore Credit Card Options";

  return (
    <div className={hero ? "mb-0 rounded-xl bg-white p-4 sm:p-5" : "mb-4"}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className={
              hero
                ? "max-w-3xl text-[24px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[34px]"
                : "text-[20px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[28px]"
            }
          >
            {isBankSection(title) ? (
              <>
                Get Instant Loan in 5 Minutes from{" "}
                <span className="text-[#5b21b6]">
                  50+ Trusted Banks & NBFCs
                </span>
              </>
            ) : (
              title
            )}
          </h2>
          {!hideSubtitle &&
          (subtitle || title === "Other financial services") ? (
            <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#5f7189]">
              {subtitle ||
                "Explore useful services for business, tax, and compliance needs."}
            </p>
          ) : null}
        </div>
        {ctaLabel && href ? (
          <Link
            href={href}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#ede9fe] px-3 text-[12px] font-bold leading-none text-[#5b21b6] no-underline transition hover:bg-[#d9eaff] sm:h-10 sm:gap-2 sm:bg-[#5b21b6] sm:px-4 sm:text-[13px] sm:text-white sm:hover:bg-[#4c1d95]"
          >
            <span className="hidden sm:inline">{ctaLabel}</span>
            <span className="sm:hidden">View</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ResponsiveSevenRow({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <AutoCarousel
      ariaLabel={ariaLabel}
      mobileSlides={2}
      wideSlides={6}
      className="product-card-carousel"
    >
      {children}
    </AutoCarousel>
  );
}

export function ResponsiveServicesRow({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  const items = Children.toArray(children);
  const pairs = Array.from(
    { length: Math.ceil(items.length / 2) },
    (_, index) => items.slice(index * 2, index * 2 + 2),
  );

  return (
    <AutoCarousel
      ariaLabel={ariaLabel}
      mobileSlides={2}
      tabletSlides={2}
      desktopSlides={3}
      wideSlides={4}
    >
      {pairs.map((pair, index) => (
        <div key={index} className="grid h-full grid-rows-2 gap-3 md:gap-4">
          {pair.map((child, childIndex) => (
            <div key={childIndex} className="min-h-0">
              {child}
            </div>
          ))}
        </div>
      ))}
    </AutoCarousel>
  );
}

function BankOfferCard({ product }: { product: ProductItem }) {
  const details =
    bankOfferDetails[product.title] || bankOfferDetails["ICICI Bank"];
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex h-full min-h-60 flex-col justify-between rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl no-underline transition-all duration-500 hover:-translate-y-1 hover:border-[#ddd6fe] hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(91,33,182,0.12)]"
    >
      <div>
        <div className="flex h-16 items-center justify-center">
          {product.logo ? (
            <Image
              src={product.logo}
              alt={product.title}
              width={82}
              height={82}
              className="max-h-18 w-auto object-contain"
              unoptimized
            />
          ) : null}
        </div>
        <h3 className="mt-4 text-center text-[16px] font-bold leading-tight text-[#07162d]">
          {product.title}
        </h3>
        <div className="mt-4 grid gap-2 text-[12px] font-bold text-[#52657d]">
          <div>
            <span className="block text-[10px] tracking-wide text-[#8090a4]">
              ROI Starts from
            </span>
            <span className="text-[18px] font-bold text-[#5b21b6]">
              {details.rate}
            </span>
          </div>
          <div className="space-y-1">
            {[details.perk, details.amount].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5b21b6]" />
                <span className="text-xs line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="card-action-button mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-[13px] font-bold">
        Apply Now
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function InformativeCard({ product }: { product: ProductItem }) {
  const meta = productMeta[product.title] || {};
  const Icon = product.icon;
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex h-full min-h-48 flex-col justify-between rounded-2xl border border-white/60 bg-white/60 p-5 shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl no-underline transition-all duration-500 hover:-translate-y-1 hover:border-[#ddd6fe] hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(91,33,182,0.12)]"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] text-[#5b21b6]">
            {Icon ? (
              <Icon className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#07162d]">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="mt-2 border-t border-[#edf3f8] pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#8090a4]">
            Starting from
          </p>
          <p className="mt-1 text-[15px] font-bold leading-none text-[#5b21b6]">
            {meta.rate || product.text}
          </p>
        </div>

        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-[#344054]">
          <CheckCircle2 className="h-4 w-4" />
          <span>{meta.hint || "Eligibility guidance before applying"}</span>
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-[#61748f]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5b21b6]" />
          <span>
            {meta.detail || "Compare eligibility, documents and next steps."}
          </span>
        </p>
      </div>
      <span className="card-action-button mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-[13px] font-bold">
        Apply Now
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function ImageProductCard({
  product,
  hideIcon = false,
  hideContentBadge = true,
  statusBadge,
}: {
  product: ProductItem;
  hideIcon?: boolean;
  hideContentBadge?: boolean;
  statusBadge?: string;
}) {
  const meta = productMeta[product.title] || {};
  const Icon = product.icon;
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl no-underline transition-all duration-500 hover:-translate-y-1 hover:border-[#ddd6fe] hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(91,33,182,0.12)]"
    >
      <div className="relative aspect-[1.45/1] bg-white">
        {meta.image ? (
          <Image
            src={meta.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 23vw, (min-width: 640px) 32vw, 48vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-[#07162d]/60 via-transparent to-transparent" />
        {!hideIcon ? (
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#5b21b6]">
            {Icon ? (
              <Icon className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {!hideContentBadge ? (
          <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#5b21b6]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {meta.badge || "Featured"}
          </p>
        ) : null}
        <div className="flex min-h-10 items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[#07162d] sm:text-[16px]">
            {product.title}
          </h3>
          {statusBadge ? (
            <span className="hidden shrink-0 rounded-full bg-[#ede9fe] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#5b21b6] sm:inline-flex">
              {statusBadge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 min-h-10 text-[10px] leading-5 text-[#52657d] sm:mt-2 sm:text-[13px]">
          {meta.hint || product.text}
        </p>
        {/* <p className="mt-2 min-h-10 flex-1 text-[11px] font-semibold leading-5 text-[#8090a4]">
          {meta.detail ||
            "Compare benefits, eligibility and next steps before applying."}
        </p> */}
        <span className="card-action-button mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-bold sm:h-10 sm:gap-2 sm:px-3 sm:text-[12px]">
          Apply Now
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ServiceWorkflowCard({ product }: { product: ProductItem }) {
  const meta = productMeta[product.title] || {};
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group grid h-full min-h-32 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl no-underline transition-all duration-500 hover:-translate-y-1 hover:border-[#ddd6fe] hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(91,33,182,0.12)] xl:grid-cols-[96px_minmax(0,1fr)]"
    >
      <div className="relative h-28 bg-white sm:h-auto">
        {meta.image ? (
          <Image
            src={meta.image}
            alt={product.title}
            fill
            unoptimized
            className="object-contain my-auto"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col justify-between p-4">
        <div>
          <h3 className="text-[16px] font-bold leading-snug text-[#07162d]">
            {product.title}
          </h3>
          <p className="mt-2 text-xs  line-clamp-2 text-[#61748f]">
            {meta.hint || product.text}
          </p>
        </div>
        <span className="card-action-button mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-3 text-[12px] font-bold">
          {meta.cta || "Get Started"}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProductExplorer({
  sectionTitles,
  compactSpacing = false,
}: ProductExplorerProps) {
  const visibleSections = sectionTitles?.length
    ? productSections.filter((section) => sectionTitles.includes(section.title))
    : productSections;

  return (
    <section
      className={`relative overflow-hidden bg-linear-to-b from-white to-[#f5f3ff] px-4 md:px-6 lg:px-8 ${
        compactSpacing ? "py-5 md:py-7" : "py-6 md:py-8"
      }`}
    >
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-8 md:gap-10">
          {visibleSections.map((section) => {
            const title = section.title;
            const bankSection = isBankSection(title);
            const otherServices = isOtherServices(title);
            const imageCategory = isImageCategory(title);
            const href = sectionHref(title, (section as any).ctaHref);
            const ctaLabel = (section as any).cta || "View All";
            const products = section.products as ProductItem[];

            return (
              <div
                key={title}
                className={
                  otherServices
                    ? "overflow-hidden rounded-xl bg-white p-0 sm:p-0"
                    : ""
                }
              >
                <SectionTop
                  title={title}
                  subtitle={(section as any).subtitle}
                  ctaLabel={ctaLabel}
                  href={href}
                />

                {bankSection ? (
                  <div className="mt-4">
                    <ResponsiveSevenRow ariaLabel={`${title} offers`}>
                      {products.map((product) => (
                        <BankOfferCard key={product.title} product={product} />
                      ))}
                    </ResponsiveSevenRow>
                  </div>
                ) : otherServices ? (
                  <div className="mt-4">
                    <ResponsiveServicesRow ariaLabel={title}>
                      {products.map((product) => (
                        <ServiceWorkflowCard
                          key={product.title}
                          product={product}
                        />
                      ))}
                    </ResponsiveServicesRow>
                  </div>
                ) : imageCategory ? (
                  <>
                    <ResponsiveSevenRow ariaLabel={title}>
                      {products.map((product) => {
                        return (
                          <ImageProductCard
                            key={product.title}
                            product={product}
                            hideContentBadge
                            hideIcon={title === "Explore Loan Options"}
                          />
                        );
                      })}
                    </ResponsiveSevenRow>
                  </>
                ) : (
                  <>
                    <ResponsiveSevenRow ariaLabel={title}>
                      {products.map((product) => (
                        <InformativeCard
                          key={product.title}
                          product={product}
                        />
                      ))}
                    </ResponsiveSevenRow>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
