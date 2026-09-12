"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Landmark,
  CreditCard,
  BadgeCheck,
  LockKeyhole,
  Mail,
  MapPin,
  Newspaper,
  PhoneCall,
  ShieldCheck,
  MessageCircle,
  Wrench,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";
import {
  FaApple,
  FaFacebookF,
  FaGooglePlay,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { productHref } from "@/lib/productRouting";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import {
  CALL_PHONE,
  COMPANY_NAME,
  OFFICE,
  SOCIAL_MEDIA_LINKS,
  WHATSAPP_PHONE,
} from "@/data/company";

/* ─── DATA ─────────────────────────────────────────────────── */

const financialServiceLinks = [
  { label: "Free CIBIL Score Check", href: "/cibil-score" },
  { label: "ITR Filing", href: "/itr-filing" },
  { label: "GST Registration", href: "/gst-registration" },
  { label: "MSME Registration", href: "/msme-registration" },
  { label: "Annual Compliance", href: "/annual-compliance" },
  { label: "ROC Filing", href: "/roc-filing" },
  { label: "Tax Compliances", href: "/tax-compliance" },
  { label: "Project Report", href: "/project-report" },
  { label: "Company Registration", href: "/company-registration" },
];

const aboutCompanyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Banking Partners", href: "/partners" },
  { label: "Franchise Program", href: "/franchise" },
  { label: "Become DSA Partner", href: "/become-dsa" },
  { label: "Press Releases", href: "/press-release" },
  { label: "Awards & Recognitions", href: "/awards-and-recognitions" },
  { label: "FAQs & Help Center", href: "/faqs" },
  { label: "Customer Feedback", href: "/feedback" },
];

const quickLinks = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Financial Calculators", href: "#calculators", icon: Wrench },
  { label: "Credit Score Bureau", href: "/cibil-score", icon: BadgeCheck },
  { label: "Financial Insights Blog", href: "/blog", icon: Newspaper },
  { label: "Application Status", href: "/application-status", icon: Wrench },
  { label: "Channel Partner Login", href: "/partner/login", icon: Landmark },
  { label: "Contact Us", href: "/contact-us", icon: PhoneCall },
];

const trustItems = [
  {
    title: "RBI Regulated Partners",
    text: "Partnered exclusively with licensed banks & NBFCs",
    icon: Landmark,
    badgeImage: "/assets/footer/rbi-badge.png",
  },
  {
    title: "ISO 27001 Certified",
    text: "Audited & compliant data security management",
    icon: Award,
    badgeImage: "/assets/footer/iso-badge.png",
  },
  {
    title: "256-Bit SSL Secure",
    text: "Bank-grade end-to-end data encryption",
    icon: ShieldCheck,
    badgeImage: null,
  },
  {
    title: "Zero Data Selling",
    text: "100% strict confidentiality & user privacy",
    icon: LockKeyhole,
    badgeImage: null,
  },
];

const socialMediaIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
} as const;

/* ─── HELPERS ───────────────────────────────────────────────── */

type FooterLinkItem = string | { label: string; href: string };

function FooterLinkList({
  links,
  productGrid = false,
}: {
  links: FooterLinkItem[];
  productGrid?: boolean;
}) {
  return (
    <ul
      className={`mt-4 gap-x-4 gap-y-2.5 ${
        productGrid ? "space-y-2.5 xl:grid xl:grid-cols-2 xl:space-y-0" : "space-y-2.5"
      }`}
    >
      {links.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const href = typeof item === "string" ? productHref(item) : item.href;

        return (
          <li key={`${label}-${href}`}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium leading-relaxed text-slate-600 no-underline transition-colors duration-200 hover:text-[#5b21b6]"
            >
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#5b21b6]" />
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function QuickLinkList() {
  return (
    <ul className="mt-4 space-y-2.5">
      {quickLinks.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-[13.5px] font-medium leading-relaxed text-slate-600 no-underline transition-colors duration-200 hover:text-[#5b21b6]"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 group-hover:bg-[#f3e8ff] group-hover:text-[#5b21b6] transition-colors">
              <Icon className="h-3 w-3" />
            </span>
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileFooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-slate-200/90 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[14px] font-bold text-slate-900 marker:content-none hover:text-[#5b21b6] transition-colors">
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-4 [&>ul]:mt-0">{children}</div>
    </details>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[14px] font-extrabold uppercase tracking-wider text-slate-900">
        {children}
      </h4>
      <div className="mt-2 h-0.5 w-7 rounded-full bg-linear-to-r from-[#5b21b6] to-[#0ea5e9]" />
    </div>
  );
}

function SocialMediaLinks() {
  return (
    <nav
      aria-label="Fintaraa social media"
      className="flex flex-wrap items-center gap-2"
    >
      {SOCIAL_MEDIA_LINKS.map(({ key, label, href }) => {
        const Icon = socialMediaIcons[key];
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow Fintaraa on ${label}`}
            title={label}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5b21b6] hover:bg-[#5b21b6] hover:text-white shadow-2xs"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}

/* ─── APP DOWNLOAD BANNER ───────────────────────────────────── */

export const AppDownloadBanner = () => {
  return (
    <section className="bg-white px-4 py-8 md:px-6 md:py-12 lg:px-8 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-linear-to-br from-[#faf5ff] via-white to-[#f0f9ff] p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#5b21b6]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#0ea5e9]/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr] lg:items-stretch">
            
            {/* Left Column: Value Prop */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-100/80 px-3 py-1 text-[11px] font-bold text-[#5b21b6] mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#5b21b6]" />
                <span>Next-Gen Mobile Experience</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-slate-900 leading-tight">
                Manage Your Finances{" "}
                <span className="bg-linear-to-r from-[#5b21b6] via-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent block sm:inline">
                  Anytime, Anywhere
                </span>
              </h2>

              <p className="mt-3 text-sm sm:text-[15px] font-medium leading-relaxed text-slate-600 max-w-md">
                Monitor your live CIBIL score, compare 50+ lenders, manage loan EMIs, and receive custom pre-approved offers directly from your phone.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-[#5b21b6]" />
                  100% Free &amp; Paperless
                </span>
                <span className="flex items-center gap-1.5">
                  <LockKeyhole className="h-4 w-4 text-[#5b21b6]" />
                  256-Bit Encryption
                </span>
              </div>
            </div>

            {/* Center Column: App Mockup (stretched to touch top and bottom of outer box) */}
            <div className="relative flex items-end justify-center -my-6 sm:-my-8 md:-my-10 pt-2">
              <div className="relative h-72 sm:h-88 lg:h-full w-full max-w-xs sm:max-w-sm md:max-w-md flex items-end justify-center transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/assets/refer/footer.png"
                  alt="Fintaraa mobile app preview"
                  fill
                  unoptimized
                  priority
                  className="object-contain object-bottom drop-shadow-2xl select-none"
                />
              </div>
            </div>

            {/* Right Column: Download Actions */}
            <div className="flex flex-col justify-center lg:items-end">
              <div className="w-full max-w-sm lg:text-right">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Download Fintaraa App
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Rated 4.8★ by 500,000+ borrowers across India
                </p>

                <div className="mt-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <a
                    href="/app"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white no-underline shadow-md transition-all duration-200 hover:bg-[#5b21b6] hover:shadow-lg active:scale-98"
                  >
                    <FaGooglePlay className="h-6 w-6 shrink-0 text-white group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-300 leading-none">
                        GET IT ON
                      </span>
                      <span className="block text-[15px] font-bold leading-tight">
                        Google Play
                      </span>
                    </div>
                  </a>

                  <a
                    href="/app"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white no-underline shadow-md transition-all duration-200 hover:bg-[#5b21b6] hover:shadow-lg active:scale-98"
                  >
                    <FaApple className="h-7 w-7 shrink-0 text-white group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-300 leading-none">
                        DOWNLOAD ON THE
                      </span>
                      <span className="block text-[15px] font-bold leading-tight">
                        App Store
                      </span>
                    </div>
                  </a>
                </div>

                <p className="mt-4 text-[12px] font-medium text-slate-500">
                  Simple. Secure. Transparent.{" "}
                  <span className="font-bold text-[#5b21b6]">Fintaraa.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── MAIN FOOTER (WHITE BACKGROUND THEME) ───────────────────── */

export default function Footer() {
  const { loans, insurance } = useProductCatalog();
  const loanLinks = loans.map((product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
  }));
  const insuranceLinks = insurance.map((product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
  }));

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="scroll-mt-28 bg-white text-slate-700 relative overflow-hidden border-t border-slate-200"
    >
      {/* ── Top Brand & Overview Bar ── */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/assets/logo/logo.png"
                alt="Fintaraa Logo"
                width={150}
                height={38}
                className="h-9 w-auto object-contain"
                unoptimized
              />
            </div>
            <p className="text-xs sm:text-[13.5px] font-medium leading-relaxed text-slate-600">
              India’s smart borrowing &amp; financial marketplace. Compare 50+ RBI-licensed banks and NBFCs for personal, business, and home loans with zero impact on your CIBIL score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200/80 px-3 py-1.5 text-[#5b21b6]">
              <ShieldCheck className="h-4 w-4 text-[#5b21b6]" />
              100% Free Comparison
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-emerald-700">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              No Hidden Charges
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1.5 text-blue-700">
              <LockKeyhole className="h-4 w-4 text-blue-600" />
              256-Bit SSL Secured
            </span>
          </div>
        </div>
      </div>

      {/* ── 5-Column Navigation Links ── */}
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        
        {/* Mobile Accordions */}
        <div className="md:hidden">
          <MobileFooterSection title="Loans Marketplace">
            <FooterLinkList links={loanLinks} />
          </MobileFooterSection>
          <MobileFooterSection title="Insurance & Protection">
            <FooterLinkList links={insuranceLinks} />
          </MobileFooterSection>
          <MobileFooterSection title="Financial & Tax Services">
            <FooterLinkList links={financialServiceLinks} />
          </MobileFooterSection>
          <MobileFooterSection title="Tools & Calculators">
            <QuickLinkList />
          </MobileFooterSection>
          <MobileFooterSection title="About & Network">
            <FooterLinkList links={aboutCompanyLinks} />
          </MobileFooterSection>
        </div>

        {/* Desktop 5-Column Grid */}
        <div className="hidden gap-x-8 gap-y-10 md:grid md:grid-cols-3 lg:grid-cols-5">
          {/* Col 1 – Loans */}
          <div>
            <ColHeading>Loans Marketplace</ColHeading>
            <FooterLinkList links={loanLinks} />
          </div>

          {/* Col 2 – Insurance */}
          <div>
            <ColHeading>Insurance</ColHeading>
            <FooterLinkList links={insuranceLinks} />
          </div>

          {/* Col 3 – Financial & Compliance */}
          <div>
            <ColHeading>Financial Services</ColHeading>
            <FooterLinkList links={financialServiceLinks} />
          </div>

          {/* Col 4 – Quick Tools */}
          <div>
            <ColHeading>Tools &amp; Portals</ColHeading>
            <QuickLinkList />
          </div>

          {/* Col 5 – About Company */}
          <div>
            <ColHeading>About Fintaraa</ColHeading>
            <FooterLinkList links={aboutCompanyLinks} />
          </div>
        </div>
      </div>

      {/* ── Contact & Support Ribbon ── */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 border-t border-slate-200 pt-8 text-xs">
          
          {/* Address */}
          <a
            href={OFFICE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-700 no-underline transition hover:border-[#5b21b6]/40 hover:bg-purple-50/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#5b21b6]">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                Corporate Office
              </span>
              <p className="mt-0.5 text-slate-500 line-clamp-2 leading-snug">
                {COMPANY_NAME} {OFFICE.address}
              </p>
            </div>
          </a>

          {/* Phone */}
          <a
            href={CALL_PHONE.href}
            className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-700 no-underline transition hover:border-[#5b21b6]/40 hover:bg-purple-50/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#5b21b6]">
              <PhoneCall className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                Direct Helpline
              </span>
              <p className="mt-0.5 font-bold text-[#5b21b6]">
                {CALL_PHONE.display}
              </p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_PHONE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-700 no-underline transition hover:border-emerald-500/50 hover:bg-emerald-50/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <MessageCircle className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                WhatsApp Desk
              </span>
              <p className="mt-0.5 font-bold text-emerald-700">
                {WHATSAPP_PHONE.display}
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:customercare@fintaraa.com"
            className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-700 no-underline transition hover:border-[#5b21b6]/40 hover:bg-purple-50/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#5b21b6]">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                Customer Care
              </span>
              <p className="mt-0.5 font-medium text-slate-600 truncate">
                customercare@fintaraa.com
              </p>
            </div>
          </a>

          {/* Hours */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#5b21b6]">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <span className="block font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                Working Hours
              </span>
              <p className="mt-0.5 text-slate-500">
                Mon - Sat: 10AM - 7PM
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Trust & Compliance Strip ── */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {trustItems.map(({ title, text, icon: Icon, badgeImage }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-3 sm:px-4 sm:py-3.5 transition hover:border-purple-200 hover:bg-purple-50/30"
            >
              {badgeImage ? (
                <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                  <Image
                    src={badgeImage}
                    alt={title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#5b21b6]">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  {title}
                </p>
                <p className="mt-0.5 text-[10.5px] sm:text-[11.5px] text-slate-500 truncate leading-snug">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Regulatory Disclaimer ── */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-[11px] leading-relaxed text-slate-500">
          <p>
            <strong className="text-slate-700">Regulatory Disclaimer:</strong> Fintaraa Technologies Private Limited is a registered digital lending aggregator and marketplace platform. Fintaraa does not directly disburse loans or make credit underwriting decisions. All credit decisions, loan approvals, interest rates, and loan processing charges are governed solely by our partnered RBI-licensed Banks, NBFCs, and financial institutions in compliance with applicable RBI digital lending guidelines.
          </p>
        </div>
      </div>

      {/* ── Bottom Legal & Social Bar ── */}
      <div className="border-t border-slate-200 bg-slate-50 pb-24 pt-5 sm:pt-5 sm:pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          {/* Copyright */}
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {currentYear} {COMPANY_NAME}. All Rights Reserved.
          </p>

          {/* Social Icons */}
          <SocialMediaLinks />

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-[#5b21b6] transition-colors no-underline">
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terms-and-conditions" className="hover:text-[#5b21b6] transition-colors no-underline">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/grievance" className="hover:text-[#5b21b6] transition-colors no-underline">
              Grievance
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/delete-account" className="hover:text-[#5b21b6] transition-colors no-underline">
              Delete Account
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/sitemap.xml" className="hover:text-[#5b21b6] transition-colors no-underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
