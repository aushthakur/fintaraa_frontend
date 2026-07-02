"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Gauge,
  HandCoins,
  Info,
  LockKeyhole,
  ShieldCheck,
  Umbrella,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { loanProductDirectory } from "@/data/bankDirectory";
import {
  fallbackHomeBanners,
  fetchHomeBanners,
  type HomeBanner,
} from "@/services/homeBanners";
import { LoanExpertButton } from "./LoanExpertPopup";

const trustStats = [
  { value: "2M+", label: "customers", icon: UsersRound },
  { value: "30+", label: "banks & NBFCs", icon: ShieldCheck },
  { value: "256-bit", label: "secure", icon: LockKeyhole },
];

const proofItems = ["RBI registered", "ISO 27001 certified", "No CIBIL impact"];

const productTabs = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: Umbrella },
  { label: "Credit Card", icon: CreditCard },
];

const amountOptions = [
  { label: "Rs. 2L", value: 200000 },
  { label: "Rs. 5L", value: 500000 },
  { label: "Rs. 10L", value: 1000000 },
  { label: "Rs. 20L", value: 2000000 },
  { label: "Rs. 30L", value: 3000000 },
];

const loanTypeOptions = loanProductDirectory.map((loan) => loan.name);
const tenureOptions = ["5 Years", "3 Years", "7 Years", "10 Years"];
const salaryOptions = [
  "Salaried",
  "Self Employed",
  "Self Employed Professional",
];
const loanPurposeSlugs = Object.fromEntries(
  loanProductDirectory.map((loan) => [loan.name, loan.slug]),
);

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

const resolveBannerHref = (buttonText?: string, href?: string) => {
  if (/eligibility/i.test(buttonText || "")) return "/#eligibility-check";
  return href || "";
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

const getTenureYears = (value: string) => Number(value.match(/\d+/)?.[0] || 5);

function CompactSelect({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  icon: LucideIcon;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-[#344054]">{label}</span>
      <span className="relative mt-1 flex h-10 w-full items-center gap-2 rounded-xl border border-[#d7e5f3] bg-white px-3 transition focus-within:border-[#075cde]">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#075cde]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 appearance-none bg-transparent pr-5 text-[12px] font-bold text-[#2f3a4a] outline-none"
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-[#667085]" />
      </span>
    </label>
  );
}

export function HeroSection() {
  const [banners, setBanners] = useState<HomeBanner[]>(fallbackHomeBanners);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(productTabs[0].label);
  const [amount, setAmount] = useState(1000000);
  const [purpose, setPurpose] = useState(loanTypeOptions[0]);
  const [tenure, setTenure] = useState(tenureOptions[0]);
  const [salaryType, setSalaryType] = useState(salaryOptions[0]);
  const [cibilScore, setCibilScore] = useState(720);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      const result = await fetchHomeBanners();
      if (!active) return;
      setBanners(result.length ? result : fallbackHomeBanners);
      setActiveIndex(0);
    });

    return () => {
      active = false;
    };
  }, []);

  const activeBanner = banners[activeIndex] || fallbackHomeBanners[0];
  const duration = safeDuration(activeBanner.displayDurationMs);
  const hasMultiple = banners.length > 1;

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % banners.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, banners.length, duration]);

  const activeDescription = useMemo(
    () =>
      activeBanner.description ||
      "One secure check. Multiple trusted offers. No CIBIL impact.",
    [activeBanner.description],
  );
  const primaryHref =
    resolveBannerHref(
      activeBanner.secondaryButtonText,
      activeBanner.secondaryLinkUrl,
    ) || "/#eligibility-check";
  const secondaryHref =
    resolveBannerHref(activeBanner.buttonText, activeBanner.linkUrl) ||
    "/products";
  const continueHref = useMemo(() => {
    if (selectedProduct === "Credit Card") return "/credit-cards";
    if (selectedProduct === "Insurance") return "/products";

    const loanType = loanPurposeSlugs[purpose] || "personal-loan";
    const params = new URLSearchParams({
      product: "loan",
      loanType,
      amount: String(amount),
      salaryType,
      cibilScore: String(cibilScore),
      tenureYears: String(getTenureYears(tenure)),
    });

    return `/eligibility-results?${params.toString()}`;
  }, [amount, cibilScore, purpose, salaryType, selectedProduct, tenure]);
  const continueLabel =
    selectedProduct === "Loan" ? "Check Offers" : "Continue";

  return (
    <section className="relative min-h-[calc(100svh-6.75rem)] overflow-hidden bg-[#061a3d] px-4 py-5 text-white md:px-6 lg:min-h-[640px] lg:px-8 lg:py-8">
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <Image
            src={banner.image}
            alt={banner.imageAlt || banner.title}
            key={banner._id || `${banner.image}-${index}`}
            fill
            priority={index === 0}
            unoptimized
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[#061a3d]/22" />
        <div className="absolute inset-0 bg-linear-to-r from-[#061a3d]/88 via-[#061a3d]/44 to-[#061a3d]/5" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#061a3d]/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[100vw] items-center py-6 lg:min-h-[580px] lg:max-w-9xl lg:py-0">
        <div className="grid w-full min-w-0 max-w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
          <div className="mobile-hero-copy min-w-0 max-w-[calc(100vw-2rem)] lg:max-w-3xl">
            <div className="hidden flex-wrap gap-4 sm:flex">
              {proofItems.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85"
                >
                  <BadgeCheck className="h-3.5 w-3.5 text-[#8fc7ff]" />
                  {chip}
                </span>
              ))}
            </div>

            <div
              key={activeBanner._id || `${activeBanner.title}-${activeIndex}`}
              className="hero-copy-transition"
            >
              {activeBanner.eyebrow ? (
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ed0ff]">
                  {activeBanner.eyebrow}
                </p>
              ) : null}

              <h1 className="mt-3 max-w-4xl text-[32px] font-bold leading-[1.08] tracking-tight text-white sm:text-[42px] lg:text-[56px] xl:text-[60px]">
                {activeBanner.title}
                {activeBanner.highlightText ? (
                  <span className="block font-bold text-[#8fc7ff]">
                    {activeBanner.highlightText}
                  </span>
                ) : null}
              </h1>

              <p className="mt-4 max-w-2xl break-words text-[15px] font-medium leading-7 text-white/86 sm:text-[16px]">
                {activeDescription}
              </p>
            </div>

            <div className="mt-5 hidden max-w-2xl gap-2 md:grid md:grid-cols-3">
              {["100% free", "Instant results", "No hidden charges"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[14px] font-bold text-white/88"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#8fc7ff]" />
                    {item}
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[14px] font-semibold text-white no-underline transition hover:bg-[#064cb8]"
              >
                Check my eligibility - free & instant
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex h-11 items-center justify-center gap-2 text-[13px] font-semibold text-white/88 no-underline transition hover:text-white"
              >
                View all products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <LoanExpertButton className="bg-white/12 px-4 text-white hover:bg-white/18" />
            </div>

            <div className="mt-6 hidden max-w-2xl gap-2 sm:grid sm:grid-cols-3">
              {trustStats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center text-[#8fc7ff]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <AnimatedCounter
                      value={value}
                      className="block text-[18px] font-bold leading-none text-white"
                    />
                    <span className="mt-1 block text-[11px] font-bold text-white/70">
                      {label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-hero-card w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/18 bg-white/94 p-4 text-[#07162d] shadow-[0_22px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-5 lg:max-w-none lg:justify-self-end">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[19px] font-bold tracking-tight">
                  Check Your Eligibility
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#61748f]">
                  Compact, secure, and personalised.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#087443]">
                <LockKeyhole className="h-3.5 w-3.5" />
                Secure
              </span>
            </div>

            <form className="mt-4 grid gap-3">
              <div className="grid grid-cols-3 border-b border-[#d7e5f3]">
                {productTabs.map(({ label, icon: Icon }) => {
                  const active = selectedProduct === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedProduct(label)}
                    className={`flex h-10 min-w-0 items-center justify-center gap-1 border-b-2 px-1 text-[10px] font-bold transition sm:gap-1.5 sm:text-[11px] ${
                      active
                        ? "border-[#075cde] text-[#075cde]"
                        : "border-transparent text-[#344054] hover:text-[#075cde]"
                    }`}
                  >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {label === "Credit Card" ? "Card" : label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <p className="text-[11px] font-bold text-[#344054]">
                    Requirement Amount
                  </p>
                  <p className="text-[20px] font-bold tracking-tight text-[#07162d] sm:text-[22px]">
                    Rs. {formatAmount(amount)}
                  </p>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#075cde]"
                  style={{
                    background: `linear-gradient(to right, #075cde 0%, #075cde ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 100%)`,
                  }}
                  aria-label="Requirement amount"
                />
                <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                  {amountOptions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAmount(item.value)}
                      className={`min-w-0 truncate h-8 rounded-lg border px-1 text-[10px] font-bold transition ${
                        amount === item.value
                          ? "border-[#075cde] bg-[#075cde] text-white"
                          : "border-[#d7e5f3] bg-white text-[#344054] hover:border-[#075cde]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <CompactSelect
                  label="Loan Type"
                  value={purpose}
                  options={loanTypeOptions}
                  icon={UserRound}
                  onChange={setPurpose}
                />
                <CompactSelect
                  label="Tenure"
                  value={tenure}
                  options={tenureOptions}
                  icon={CalendarDays}
                  onChange={setTenure}
                />
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <CompactSelect
                  label="Employment Type"
                  value={salaryType}
                  options={salaryOptions}
                  icon={BriefcaseBusiness}
                  onChange={setSalaryType}
                />
                <label className="block">
                  <span className="text-[11px] font-bold text-[#344054]">
                    CIBIL Score
                  </span>
                  <span className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl border border-[#d7e5f3] bg-white px-3 transition focus-within:border-[#075cde]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#075cde]">
                      <Gauge className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="number"
                      min={300}
                      max={900}
                      value={cibilScore}
                      onChange={(event) =>
                        setCibilScore(Number(event.target.value || 0))
                      }
                      className="min-w-0 flex-1 border-0 bg-transparent text-[12px] font-bold text-[#2f3a4a] outline-none"
                      aria-label="CIBIL Score"
                    />
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2 text-[11px] font-bold leading-5 text-[#61748f]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#075cde]" />
                <p>
                  No hard enquiry. Matched offers open with your selected
                  inputs.
                </p>
              </div>

              <Link
                href={continueHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[13px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
              >
                {continueLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-center text-[10px] font-bold text-[#667085]">
                Your information is encrypted and never sold.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {hasMultiple
          ? banners.map((banner, index) => (
              <button
                key={banner._id || `${banner.title}-${index}`}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))
          : null}
      </div>
    </section>
  );
}
