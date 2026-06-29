"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BadgeCheck,
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
  { image?: string; rate?: string; hint?: string; badge?: string; cta?: string }
> = {
  "Personal Loan": {
    rate: "From 10.5% p.a.",
    hint: "Salaried & self-employed",
    badge: "Quick funds",
  },
  "Home Loan": {
    rate: "From 8.5% p.a.",
    hint: "Up to ₹5 Cr",
    badge: "Low EMI",
    image: "/assets/contact/contact-hero.png",
  },
  "Business Loan": {
    rate: "From 12% p.a.",
    hint: "No collateral options",
    badge: "Growth capital",
    image: "/assets/dsa/handshake.png",
  },
  "Vehicle Loan": {
    rate: "From 7.9% p.a.",
    hint: "Used & new cars",
    badge: "Fast sanction",
    image: "/assets/refer/header-credit-cards.png",
  },
  "Education Loan": {
    rate: "Study funding",
    hint: "Domestic & overseas",
    badge: "Career ready",
    image: "/assets/blogs/blog4.png",
  },
  "Gold Loan": {
    rate: "Instant value",
    hint: "Against pledged gold",
    badge: "Quick cash",
    image: "/assets/images/coin-bag.png",
  },
  "Loan Against Property": {
    rate: "High-ticket funding",
    hint: "Residential/commercial",
    badge: "Secured loan",
    image: "/assets/images/hero.png",
  },
  "Health Insurance": {
    image: "/assets/images/testimonials/client-1.jpg",
    hint: "Stay covered, stay worry-free",
    badge: "Family cover",
  },
  "Life Insurance": {
    image: "/assets/images/testimonials/client-2.jpg",
    hint: "Secure your loved ones' future",
    badge: "Protection",
  },
  "Shop Insurance": {
    image: "/assets/services/gst-hero.png",
    hint: "Protect your business",
    badge: "Business cover",
  },
  "Stock Insurance": {
    image: "/assets/blogs/blog3.png",
    hint: "Coverage for valuable stock",
    badge: "Asset cover",
  },
  "Term Insurance": {
    image: "/assets/images/testimonials/client-3.jpg",
    hint: "High coverage, low premium",
    badge: "Low premium",
  },
  "Property Insurance": {
    image: "/assets/images/hero.png",
    hint: "Protect your home and assets",
    badge: "Home safety",
  },
  "Travel Insurance": {
    image: "/assets/careers/life-5.jpg",
    hint: "Travel smart, travel insured",
    badge: "Trip cover",
  },
  "Travel Cards": {
    image: "/assets/careers/life-5.jpg",
    hint: "Earn miles. Fly more. Pay less.",
    badge: "Travel",
  },
  "Fuel Cards": {
    image: "/assets/images/hero1.png",
    hint: "More savings on every fill",
    badge: "Fuel",
  },
  "Cashback Cards": {
    image: "/assets/banks/visa-card.png",
    hint: "Cashback on every spend",
    badge: "Cashback",
  },
  "Shopping Cards": {
    image: "/assets/blogs/blog2.png",
    hint: "Shop more. Save more.",
    badge: "Shopping",
  },
  "Rewards Cards": {
    image: "/assets/offers/offer.png",
    hint: "Unlock premium rewards",
    badge: "Rewards",
  },
  "Balance Transfer": {
    image: "/assets/images/coin-bag.png",
    hint: "Transfer balance. Save interest.",
    badge: "Save EMI",
  },
  "Dining Cards": {
    image: "/assets/careers/life-4.jpg",
    hint: "Offers for food lovers",
    badge: "Dining",
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
  // "Project Report": {
  //   image: "/assets/blogs/blog-feature.png",
  //   hint: "Get project reports for funding and planning.",
  //   cta: "Create report",
  // },
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
  "Explore Loan Options": "Choose by rate, eligibility and speed",
};

const isBankSection = (title: string) => title.includes("Get Instant Loan");
const isOtherServices = (title: string) => title === "Other financial services";
const isImageCategory = (title: string) =>
  title === "Explore Insurance Plans" ||
  title === "Explore Credit Card Options";

function SectionTop({
  title,
  subtitle,
  cta,
  href,
  hero = false,
}: {
  title: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  hero?: boolean;
}) {
  return (
    <div
      className={
        hero
          ? "mb-0 rounded-2xl bg-white p-5 sm:p-6"
          : "mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div>
        {sectionEyebrow[title] ? (
          <p className="mb-2 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#075cde]">
            <Sparkles className="h-3.5 w-3.5" />
            {sectionEyebrow[title]}
          </p>
        ) : null}
        <h2
          className={
            hero
              ? "max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[38px]"
              : "text-[24px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[30px]"
          }
        >
          {isBankSection(title) ? (
            <>
              Get Instant Loan from{" "}
              <span className="text-[#075cde]">30+ Trusted Banks & NBFCs</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#5f7189]">
          {isBankSection(title)
            ? "One application. Multiple offers. Best rates. 100% digital process."
            : subtitle ||
              "Compare options faster with useful details before you click."}
        </p>
      </div>

      <Link
        href={href || "/products"}
        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl border border-[#bcd8f4] bg-white px-4 text-[13px] font-bold text-[#075cde] no-underline transition hover:border-[#075cde]"
      >
        {cta || "View All"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function BankOfferCard({
  product,
  index,
}: {
  product: ProductItem;
  index: number;
}) {
  const details =
    bankOfferDetails[product.title] || bankOfferDetails["ICICI Bank"];
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group flex min-h-67.5 flex-col justify-between rounded-xl border border-[#e2edf8] bg-white p-4 no-underline transition-colors hover:border-[#bcd8f4]"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wide ${
              index === 0 ? "text-[#075cde]" : "text-[#087443]"
            }`}
          >
            {index === 0 ? "Best offers" : "Verified"}
          </span>
          <CheckCircle2 className="h-5 w-5 text-[#12b76a]" />
        </div>
        <div className="mt-5 flex h-20 items-center justify-center">
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
        <h3 className="mt-4 text-center text-[17px] font-bold text-[#07162d]">
          {product.title}
        </h3>
        <div className="mt-4 grid gap-3 text-[12px] font-bold text-[#52657d]">
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-[#8090a4]">
              Interest rate
            </span>
            <span className="text-[20px] font-bold text-[#075cde]">
              {details.rate}
            </span>
          </div>
          {[details.perk, details.amount, details.speed].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 shrink-0 text-[#0f7a4d]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#e9f2ff] text-[13px] font-bold text-[#075cde] transition group-hover:bg-[#075cde] group-hover:text-white">
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
      className="group flex min-h-40 flex-col justify-between rounded-xl border border-[#e2edf8] bg-white p-5 no-underline transition-colors hover:border-[#bcd8f4]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#075cde]">
            {Icon ? (
              <Icon className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </span>
          <span className="text-right text-[10px] font-bold uppercase tracking-wide text-[#087443]">
            {meta.badge || "Matched"}
          </span>
        </div>
        <h3 className="mt-4 text-[17px] font-bold text-[#07162d]">
          {product.title}
        </h3>
        <p className="mt-1 text-[13px] font-bold text-[#61748f]">
          {meta.rate || product.text}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-bold text-[#0f7a4d]">
          <CheckCircle2 className="h-4 w-4" />
          {meta.hint || "Eligibility guidance before applying"}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#075cde]">
        Check options
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ImageProductCard({ product }: { product: ProductItem }) {
  const meta = productMeta[product.title] || {};
  const Icon = product.icon;
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group overflow-hidden rounded-xl border border-[#e2edf8] bg-white no-underline transition-colors hover:border-[#bcd8f4]"
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
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#075cde]">
          {meta.badge || "Featured"}
        </span>
        <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#075cde]">
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-[#07162d]">
          {product.title}
        </h3>
        <p className="mt-1 min-h-10 text-[12px] font-bold leading-5 text-[#61748f]">
          {meta.hint || product.text}
        </p>
      </div>
    </Link>
  );
}

function ServiceWorkflowCard({ product }: { product: ProductItem }) {
  const meta = productMeta[product.title] || {};
  return (
    <Link
      href={product.href || productHref(product.title)}
      className="group grid min-h-40.5 overflow-hidden rounded-xl border border-[#e2edf8] bg-white no-underline transition-colors hover:border-[#bcd8f4] sm:grid-cols-[112px_minmax(0,1fr)]"
    >
      <div className="relative h-36 bg-white sm:h-auto">
        {meta.image ? (
          <Image
            src={meta.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col justify-between p-4">
        <div>
          <h3 className="text-[16px] font-bold leading-snug text-[#07162d]">
            {product.title}
          </h3>
          <p className="mt-2 text-[12px] font-bold leading-5 text-[#61748f]">
            {meta.hint || product.text}
          </p>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-[#075cde]">
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
        compactSpacing ? "py-7" : "py-8"
      }`}
    >
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-10">
          {visibleSections.map((section) => {
            const title = section.title;
            const bankSection = isBankSection(title);
            const otherServices = isOtherServices(title);
            const imageCategory = isImageCategory(title);
            const href = (section as any).ctaHref || "/products";
            const products = section.products as ProductItem[];

            return (
              <div
                key={title}
                className={
                  bankSection || otherServices
                    ? "overflow-hidden rounded-2xl bg-white p-4 sm:p-6"
                    : ""
                }
              >
                <SectionTop
                  title={title}
                  subtitle={(section as any).subtitle}
                  cta={(section as any).cta}
                  href={href}
                  hero={bankSection}
                />

                {bankSection ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product, index) => (
                      <BankOfferCard
                        key={product.title}
                        product={product}
                        index={index}
                      />
                    ))}
                  </div>
                ) : otherServices ? (
                  <>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {products.map((product) => (
                        <ServiceWorkflowCard
                          key={product.title}
                          product={product}
                        />
                      ))}
                    </div>
                    <div className="mt-5 grid gap-3 rounded-2xl border border-[#dceaf7] bg-white p-3 sm:grid-cols-4">
                      {[
                        ["100% Secure", "Your data is safe with us"],
                        ["Quick & Easy", "Simple process, faster results"],
                        ["Expert Support", "Get help from specialists"],
                        ["Trusted by Millions", "Join satisfied customers"],
                      ].map(([label, text]) => (
                        <div
                          key={label}
                          className="flex items-start gap-3 rounded-xl bg-white p-4"
                        >
                          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#075cde]" />
                          <div>
                            <p className="text-[13px] font-bold text-[#07162d]">
                              {label}
                            </p>
                            <p className="mt-1 text-[12px] font-semibold text-[#61748f]">
                              {text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : imageCategory ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ImageProductCard key={product.title} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                      <InformativeCard key={product.title} product={product} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
