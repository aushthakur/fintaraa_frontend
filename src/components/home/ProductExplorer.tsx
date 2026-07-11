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

type ProductExplorerProps = {
  sectionTitles?: string[];
  compactSpacing?: boolean;
};

type ProductItem = {
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

const productMeta: Record<
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
  },
  "Home Loan": {
    rate: "From 8.5% p.a.",
    hint: "Up to ₹5 Cr",
    detail: "Long tenure, lower EMI",
    badge: "Low EMI",
    image: "/assets/contact/contact-hero.png",
  },
  "Business Loan": {
    rate: "From 12% p.a.",
    hint: "No collateral options",
    detail: "Working capital support",
    badge: "Growth capital",
    image: "/assets/dsa/handshake.png",
  },
  "Vehicle Loan": {
    rate: "From 7.9% p.a.",
    hint: "Used & new cars",
    detail: "Fast dealer coordination",
    badge: "Fast sanction",
    image: "/assets/refer/header-credit-cards.png",
  },
  "Education Loan": {
    rate: "Study funding",
    hint: "Domestic & overseas",
    detail: "Course-based eligibility",
    badge: "Career ready",
    image: "/assets/blogs/blog4.png",
  },
  "Gold Loan": {
    rate: "Instant value",
    hint: "Against pledged gold",
    detail: "Quick valuation process",
    badge: "Quick cash",
    image: "/assets/images/coin-bag.png",
  },
  "Loan Against Property": {
    rate: "High-ticket funding",
    hint: "Residential/commercial",
    detail: "Secured large funding",
    badge: "Secured loan",
    image: "/assets/images/hero.png",
  },
  "Health Insurance": {
    image: "/assets/images/testimonials/client-1.jpg",
    hint: "Cashless care, family floater and hospital-network options.",
    detail: "Compare premiums, waiting periods and room-rent limits.",
    badge: "Medical cover",
  },
  "Life Insurance": {
    image: "/assets/images/testimonials/client-2.jpg",
    hint: "Long-term financial protection for the people who depend on you.",
    detail: "Review cover amount, payout terms and premium flexibility.",
    badge: "Family security",
  },
  "Shop Insurance": {
    image: "/assets/services/gst-hero.png",
    hint: "Protect your shop from fire, theft, liability and business risk.",
    detail: "Useful for retail stores, offices and small business owners.",
    badge: "Business cover",
  },
  "Stock Insurance": {
    image: "/assets/blogs/blog3.png",
    hint: "Cover inventory and stock against unexpected damage or loss.",
    detail: "Designed for traders, retailers and warehouse-led businesses.",
    badge: "Asset cover",
  },
  "Term Insurance": {
    image: "/assets/images/testimonials/client-3.jpg",
    hint: "High life cover at a disciplined, affordable premium.",
    detail: "Compare claim ratio, riders and payout preferences.",
    badge: "Pure protection",
  },
  "Property Insurance": {
    image: "/assets/images/hero.png",
    hint: "Secure your home, building and valuable assets from risk.",
    detail: "Compare structure, contents and natural calamity coverage.",
    badge: "Property safety",
  },
  "Travel Insurance": {
    image: "/assets/careers/life-5.jpg",
    hint: "Travel with cover for medical, baggage and trip disruptions.",
    detail: "Useful for domestic, international and frequent travellers.",
    badge: "Trip cover",
  },
  "Travel Cards": {
    image: "/assets/careers/life-5.jpg",
    hint: "Airport lounge access, miles and low forex markups.",
    detail: "Best for frequent flyers and international spends.",
    badge: "Travel rewards",
  },
  "Fuel Cards": {
    image: "/assets/images/hero1.png",
    hint: "Fuel surcharge waivers and savings on everyday refuels.",
    detail: "Built for commuters, road trips and monthly fuel budgets.",
    badge: "Fuel savings",
  },
  "Cashback Cards": {
    image: "/assets/banks/visa-card.png",
    hint: "Earn direct value back on groceries, bills and online spends.",
    detail: "Simple rewards for users who prefer cash value over points.",
    badge: "Cashback",
  },
  "Shopping Cards": {
    image: "/assets/blogs/blog2.png",
    hint: "Marketplace offers, brand deals and accelerated rewards.",
    detail: "Good for online shoppers and seasonal sale purchases.",
    badge: "Shopping perks",
  },
  "Rewards Cards": {
    image: "/assets/offers/offer.png",
    hint: "Convert regular spends into points, vouchers and upgrades.",
    detail: "Compare redemption value, caps and partner benefits.",
    badge: "Premium rewards",
  },
  "Balance Transfer": {
    image: "/assets/images/coin-bag.png",
    hint: "Move outstanding dues into easier repayment options.",
    detail: "Useful for reducing interest pressure and planning EMIs.",
    badge: "Save interest",
  },
  "Dining Cards": {
    image: "/assets/careers/life-4.jpg",
    hint: "Dining discounts, table offers and partner restaurant deals.",
    detail: "Best for food lovers and frequent weekend plans.",
    badge: "Dining offers",
  },
  "CIBIL Score Check": {
    image: "/assets/images/cibil-score-quality.png",
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
    image: "/assets/dsa/hero.png",
    hint: "Register MSME and unlock business benefits.",
    cta: "Register MSME",
  },
  "Annual Compliance": {
    image: "/assets/services/statusicon.png",
    hint: "Stay compliant with annual filings and reminders.",
    cta: "Check compliance",
  },
  "Project Report": {
    image: "/assets/images/blog-feature.png",
    hint: "Get project reports for funding, tenders and planning.",
    cta: "Request report",
  },
  "Tax Compliances": {
    image: "/assets/services/itr-deadline-1.png",
    hint: "Manage notices, filings and compliance deadlines with experts.",
    cta: "Request support",
  },
  "Company Registration": {
    image: "/assets/contact/contact-hero.png",
    hint: "Register your company online and move forward.",
    cta: "Start registration",
  },
};

const sectionEyebrow: Record<string, string> = {
  "Explore Insurance Plans": "Secure today, protected tomorrow",
  "Explore Credit Card Options": "Smart choices, bigger rewards",
  "Other financial services": "More services, more convenience",
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
          {sectionEyebrow[title] ? (
            <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#075cde] md:text-[12px]">
              <Sparkles className="h-3.5 w-3.5" />
              {sectionEyebrow[title]}
            </p>
          ) : null}
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
                <span className="text-[#075cde]">
                  30+ Trusted Banks & NBFCs
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
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#e9f2ff] px-3 text-[12px] font-bold leading-none text-[#075cde] no-underline transition hover:bg-[#d9eaff] sm:h-10 sm:gap-2 sm:bg-[#075cde] sm:px-4 sm:text-[13px] sm:text-white sm:hover:bg-[#064cb8]"
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

function ResponsiveSevenRow({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none md:-mx-6 md:px-6 xl:mx-0 xl:overflow-visible xl:px-0 xl:pb-0">
      <div className="flex snap-x snap-mandatory gap-3 md:gap-4 xl:grid xl:grid-cols-7">
        {items.map((child, index) => (
          <div
            key={index}
            className="w-[min(76vw,20rem)] shrink-0 snap-start sm:w-[18rem] md:w-[17.5rem] xl:w-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponsiveServicesRow({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none md:-mx-6 md:px-6 xl:mx-0 xl:overflow-visible xl:px-0 xl:pb-0">
      <div className="flex snap-x snap-mandatory gap-3 md:gap-4 xl:grid xl:grid-cols-4">
        {items.map((child, index) => (
          <div
            key={index}
            className="w-[min(82vw,22rem)] shrink-0 snap-start sm:w-[22rem] md:w-[24rem] xl:w-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

function BankOfferCard({ product }: { product: ProductItem }) {
  const details =
    bankOfferDetails[product.title] || bankOfferDetails["ICICI Bank"];
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex h-full min-h-60 flex-col justify-between rounded-xl border border-[#e2edf8] bg-white px-3 py-4 no-underline transition-colors hover:border-[#bcd8f4]"
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
            <span className="text-[18px] font-bold text-[#075cde]">
              {details.rate}
            </span>
          </div>
          <div className="space-y-1">
            {[details.perk, details.amount].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#075cde]" />
                <span className="text-xs line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#e9f2ff] text-[13px] font-bold text-[#075cde] transition group-hover:bg-[#075cde] group-hover:text-white">
        Claim offer
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
      className="group flex h-full min-h-48 flex-col justify-between rounded-xl border border-[#dceaf7] bg-white p-4 no-underline transition-colors hover:border-[#bcd8f4]"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#075cde]">
            {Icon ? (
              <Icon className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#075cde]">
              {meta.badge || "Matched"}
            </p>
            <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-[#07162d]">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="mt-2 border-t border-[#edf3f8] pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#8090a4]">
            Starting from
          </p>
          <p className="mt-1 text-[15px] font-bold leading-none text-[#075cde]">
            {meta.rate || product.text}
          </p>
        </div>

        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-[#344054]">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {meta.hint || "Eligibility guidance before applying"}
          </span>
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-[#61748f]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#075cde]" />
          <span>
            {meta.detail || "Compare eligibility, documents and next steps."}
          </span>
        </p>
      </div>
      <span className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#e9f2ff] text-[13px] font-bold text-[#075cde] transition group-hover:bg-[#075cde] group-hover:text-white">
        Check options
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ImageProductCard({
  product,
  hideIcon = false,
  hideContentBadge = true,
}: {
  product: ProductItem;
  hideIcon?: boolean;
  hideContentBadge?: boolean;
}) {
  const meta = productMeta[product.title] || {};
  const Icon = product.icon;
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e2edf8] bg-white no-underline transition-colors hover:border-[#bcd8f4]"
    >
      <div className="relative aspect-[1.45/1] bg-white">
        {meta.image ? (
          <Image
            src={meta.image}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-[#07162d]/60 via-transparent to-transparent" />
        {!hideIcon ? (
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#075cde]">
            {Icon ? (
              <Icon className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {!hideContentBadge ? (
          <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#075cde]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {meta.badge || "Featured"}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-[#07162d]">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#52657d]">
          {meta.hint || product.text}
        </p>
        {/* <p className="mt-2 min-h-10 flex-1 text-[11px] font-semibold leading-5 text-[#8090a4]">
          {meta.detail ||
            "Compare benefits, eligibility and next steps before applying."}
        </p> */}
        <span className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-[#075cde]">
          Compare options
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ServiceWorkflowCard({ product }: { product: ProductItem }) {
  const meta = productMeta[product.title] || {};
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group grid min-h-32 overflow-hidden rounded-xl border border-[#e2edf8] bg-white no-underline transition-colors hover:border-[#bcd8f4] sm:grid-cols-[112px_minmax(0,1fr)]"
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
        <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-bold text-[#075cde]">
          {meta.cta || "Start workflow"}
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
      className={`bg-white px-4 md:px-6 lg:px-8 ${
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
                    <ResponsiveSevenRow>
                      {products.map((product) => (
                        <BankOfferCard
                          key={product.title}
                          product={product}
                        />
                      ))}
                    </ResponsiveSevenRow>
                  </div>
                ) : otherServices ? (
                  <div className="mt-4">
                    <ResponsiveServicesRow>
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
                    <ResponsiveSevenRow>
                      {products.map((product) => {
                        const compactImageHeader =
                          title === "Explore Loan Options" ||
                          title === "Explore Credit Card Options";

                        return (
                          <ImageProductCard
                            key={product.title}
                            product={product}
                            hideContentBadge={compactImageHeader}
                            hideIcon={title === "Explore Loan Options"}
                          />
                        );
                      })}
                    </ResponsiveSevenRow>
                  </>
                ) : (
                  <>
                    <ResponsiveSevenRow>
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
