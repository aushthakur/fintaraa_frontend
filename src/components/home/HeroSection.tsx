"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  // BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Gauge,
  HandCoins,
  IndianRupee,
  // Info,
  Umbrella,
  UserRound,
  UsersRound,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { loanProductDirectory } from "@/data/bankDirectory";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { productHref } from "@/lib/productRouting";
import { type HomeBanner, fetchHomeBanners } from "@/services/homeBanners";

const trustStats = [
  { value: "2M+", label: "customers", icon: UsersRound },
  { value: "30+", label: "banks & NBFCs", icon: ShieldCheck },
  { value: "256-bit", label: "secure", icon: LockKeyhole },
];

// const proofItems = ["RBI registered", "ISO 27001 certified", "No CIBIL impact"];

const productTabs = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: Umbrella },
  { label: "Credit Card", icon: CreditCard },
];

// const amountOptions = [
//   { label: "Rs. 2L", value: 200000 },
//   { label: "Rs. 5L", value: 500000 },
//   { label: "Rs. 10L", value: 1000000 },
//   { label: "Rs. 20L", value: 2000000 },
//   { label: "Rs. 30L", value: 3000000 },
// ];

const quickLoanOption = "Loan in 5 Minutes";
const loanTypeOptions = [
  quickLoanOption,
  ...loanProductDirectory.map((loan) => loan.name),
];
const tenureOptions = Array.from(
  { length: 30 },
  (_, index) => `${index + 1} ${index === 0 ? "Year" : "Years"}`,
);
const salaryOptions = [
  "Salaried",
  "Self Employed",
  "Self Employed Professional",
];
const insuranceTypeOptions = [
  "Health Insurance",
  "Life Insurance",
  "Term Insurance",
  "Travel Insurance",
  "Property Insurance",
];
const insuranceNeedOptions = [
  "Self",
  "Family",
  "Parents",
  "Business",
  "Vehicle",
];
const cardTypeOptions = [
  "Cashback Cards",
  "Travel Cards",
  "Fuel Cards",
  "Shopping Cards",
  "Rewards Cards",
];
const loanPurposeSlugs: Record<string, string> = {
  [quickLoanOption]: "instant-loan",
  ...Object.fromEntries(
    loanProductDirectory.map((loan) => [loan.name, loan.slug]),
  ),
};

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

function HomeResponsiveBannerImage({
  banner,
  eager,
  active,
}: {
  banner: HomeBanner;
  eager: boolean;
  active: boolean;
}) {
  const alt = banner.imageAlt || banner.title;
  const { props: desktopImage } = getImageProps({
    src: banner.image,
    alt,
    width: 1920,
    height: 1080,
    unoptimized: true,
  });
  const { props: mobileImage } = getImageProps({
    src: banner.mobileImage || banner.image,
    alt,
    width: 900,
    height: 1200,
    unoptimized: true,
  });

  return (
    <picture
      className={`absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-in-out ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <source
        media="(max-width: 767px)"
        srcSet={mobileImage.srcSet || mobileImage.src}
      />
      <img
        {...desktopImage}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  );
}

const formatAmount = (value: number | string) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(numericValue);
};

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
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(productTabs[0].label);
  const [amount, setAmount] = useState("1000000");
  const [purpose, setPurpose] = useState(loanTypeOptions[0]);
  const [tenure, setTenure] = useState("5 Years");
  const [salaryType, setSalaryType] = useState(salaryOptions[0]);
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [insuranceType, setInsuranceType] = useState(insuranceTypeOptions[0]);
  const [insuranceNeed, setInsuranceNeed] = useState(insuranceNeedOptions[0]);
  const [cardType, setCardType] = useState(cardTypeOptions[0]);
  const [cibilScore, setCibilScore] = useState(720);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      const result = await fetchHomeBanners();
      if (!active) return;
      setBanners(result);
      setActiveIndex(0);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const activeBanner = banners[activeIndex];
  const duration = safeDuration(activeBanner?.displayDurationMs);
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
      activeBanner?.description ||
      "One secure check. Multiple trusted offers. No CIBIL impact.",
    [activeBanner?.description],
  );
  const primaryHref = activeBanner?.linkUrl || "/products";
  const primaryLabel = activeBanner?.buttonText || "Explore products";
  const secondaryHref = activeBanner?.secondaryLinkUrl || "/#eligibility-check";
  const secondaryLabel =
    activeBanner?.secondaryButtonText || "Check eligibility";
  const continueHref = useMemo(() => {
    if (selectedProduct === "Credit Card") return "/credit-cards";
    if (selectedProduct === "Insurance") return productHref(insuranceType);

    const loanType = loanPurposeSlugs[purpose] || "personal-loan";
    const params = new URLSearchParams({
      product: "loan",
      loanType,
      amount: amount || "0",
      salaryType,
      monthlyIncome: monthlyIncome || "0",
      cibilScore: String(cibilScore),
      tenureYears: String(getTenureYears(tenure)),
    });

    return `/eligibility-results?${params.toString()}`;
  }, [
    amount,
    cibilScore,
    insuranceType,
    monthlyIncome,
    purpose,
    salaryType,
    selectedProduct,
    tenure,
  ]);
  const continueLabel =
    selectedProduct === "Loan"
      ? "Check Offers"
      : selectedProduct === "Insurance"
        ? "Explore Cover"
        : "Explore Cards";

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading homepage banners"
        className="min-h-115 animate-pulse bg-[#061a3d] sm:min-h-125 lg:min-h-135"
      />
    );
  }

  if (!activeBanner) return null;

  return (
    <section className="relative min-h-115 overflow-hidden bg-[#061a3d] px-4 py-8 text-white sm:min-h-125 md:px-6 md:py-8 lg:min-h-135 lg:px-8 lg:py-5">
      <div
        key={`analytics-${activeBanner._id || activeIndex}`}
        aria-hidden="true"
        data-analytics-banner
        data-analytics-name={activeBanner.title}
        data-analytics-placement={`home_hero:${activeBanner._id || activeIndex}`}
        className="pointer-events-none absolute inset-0"
      />
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <HomeResponsiveBannerImage
            banner={banner}
            key={banner._id || `${banner.image}-${index}`}
            eager={index === 0}
            active={index === activeIndex}
          />
        ))}
        <div className="absolute inset-0 bg-[#061a3d]/22" />
        <div className="absolute inset-0 bg-linear-to-r from-[#061a3d]/88 via-[#061a3d]/44 to-[#061a3d]/5" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#061a3d]/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-100 w-full max-w-9xl items-center py-0 sm:min-h-110 lg:min-h-130">
        <div className="grid w-full min-w-0 max-w-full items-center gap-5 md:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
          <div className="mobile-hero-copy min-w-0 max-w-[calc(100vw-2rem)] lg:max-w-3xl">
            {/* <div className="hidden flex-wrap gap-4 sm:flex">
              {proofItems.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85"
                >
                  <BadgeCheck className="h-3.5 w-3.5 text-[#8fc7ff]" />
                  {chip}
                </span>
              ))}
            </div> */}

            <div
              key={activeBanner._id || `${activeBanner.title}-${activeIndex}`}
              className="hero-copy-transition"
            >
              {/* {activeBanner.eyebrow ? (
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ed0ff]">
                  {activeBanner.eyebrow}
                </p>
              ) : null} */}

              <h1 className="mt-2 max-w-4xl text-[28px] font-bold leading-[1.1] tracking-tight text-white sm:text-[38px] lg:text-[52px] xl:text-[56px]">
                {activeBanner.title}
                {activeBanner.highlightText ? (
                  <span className="block font-bold text-[#8fc7ff]">
                    {activeBanner.highlightText}
                  </span>
                ) : null}
              </h1>

              <p className="mt-3 max-w-2xl wrap-break-word text-[14px] font-medium leading-6 text-white/86 sm:text-[15px] sm:leading-7">
                {activeDescription}
              </p>
            </div>

            {/* <div className="mt-5 hidden max-w-2xl gap-2 md:grid md:grid-cols-3">
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
            </div> */}

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:items-center sm:gap-3">
              <Link
                href={primaryHref}
                data-analytics-category="banner"
                data-analytics-name={`${activeBanner.title} - ${primaryLabel}`}
                data-analytics-placement={`home_hero:${activeBanner._id || activeIndex}`}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#075cde] px-3 text-center text-[12px] font-semibold text-white no-underline transition hover:bg-[#064cb8] sm:gap-2 sm:px-5 sm:text-[14px]"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href={secondaryHref}
                data-analytics-category="banner"
                data-analytics-name={`${activeBanner.title} - ${secondaryLabel}`}
                data-analytics-placement={`home_hero:${activeBanner._id || activeIndex}`}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/45 bg-white/12 px-3 text-center text-[12px] font-semibold text-white no-underline transition hover:bg-white/18 sm:gap-2 sm:px-5 sm:text-[14px]"
              >
                {secondaryLabel}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>

            <div className="mt-5 grid max-w-2xl grid-cols-3 gap-1 sm:gap-2">
              {trustStats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-w-0 items-center gap-1.5 sm:gap-3"
                >
                  <span className="hidden h-9 w-9 shrink-0 items-center justify-center text-[#8fc7ff] sm:flex">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <AnimatedCounter
                      value={value}
                      className="block text-[16px] font-bold leading-none text-white sm:text-[18px]"
                    />
                    <span className="mt-1 block truncate text-[9px] font-bold text-white/70 sm:text-[11px]">
                      {label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-hero-card hidden w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/18 bg-white/94 p-4 text-[#07162d] shadow-[0_22px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-5 lg:block lg:max-w-none lg:justify-self-end">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[18px] font-bold tracking-tight">
                  Check Your Eligibility
                </p>
                <p className="mt-1 text-[13px] font-semibold leading-5 text-[#61748f]">
                  Compact, secure, and personalised.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#075cde]">
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

              {selectedProduct === "Loan" ? (
                <>
                  <div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <p className="text-[12px] font-bold text-[#344054]">
                        Requirement Amount
                      </p>
                      <p className="text-[19px] font-bold tracking-tight text-[#07162d] sm:text-[21px]">
                        {amount
                          ? `Rs. ${formatAmount(amount)}`
                          : "Enter amount"}
                      </p>
                    </div>
                    <label className="mt-2 flex h-11 w-full items-center gap-2 rounded-xl border border-[#d7e5f3] bg-white px-3 transition focus-within:border-[#075cde]">
                      <span className="text-[13px] font-bold text-[#075cde]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={amount}
                        onChange={(event) =>
                          setAmount(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter amount"
                        className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[#07162d] outline-none [appearance:textfield] placeholder:text-[#98a2b3] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Requirement amount"
                      />
                    </label>
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
                      value={salaryType}
                      label="Employment Type"
                      options={salaryOptions}
                      icon={BriefcaseBusiness}
                      onChange={setSalaryType}
                    />
                    <label className="block">
                      <span className="text-[12px] font-bold text-[#344054]">
                        Monthly Salary / Income
                      </span>
                      <span className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl border border-[#d7e5f3] bg-white px-3 transition focus-within:border-[#075cde]">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#075cde]">
                          <IndianRupee className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={monthlyIncome}
                          onChange={(event) =>
                            setMonthlyIncome(
                              event.target.value.replace(/\D/g, ""),
                            )
                          }
                          placeholder="Enter amount"
                          className="min-w-0 flex-1 border-0 bg-transparent text-[12px] font-bold text-[#2f3a4a] outline-none"
                          aria-label="Monthly Salary / Income"
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-bold text-[#344054]">
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
                </>
              ) : selectedProduct === "Insurance" ? (
                <div className="grid gap-2.5">
                  <CompactSelect
                    label="Insurance Type"
                    value={insuranceType}
                    options={insuranceTypeOptions}
                    icon={Umbrella}
                    onChange={setInsuranceType}
                  />
                  <CompactSelect
                    label="Cover For"
                    value={insuranceNeed}
                    options={insuranceNeedOptions}
                    icon={ShieldCheck}
                    onChange={setInsuranceNeed}
                  />
                  <p className="rounded-xl bg-[#f5fbff] px-3 py-2 text-[13px] font-semibold leading-5 text-[#5f7189]">
                    Compare plans by cover, premium, waiting period, and claim
                    support.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5">
                  <CompactSelect
                    label="Card Preference"
                    value={cardType}
                    options={cardTypeOptions}
                    icon={CreditCard}
                    onChange={setCardType}
                  />
                  <p className="rounded-xl bg-[#f5fbff] px-3 py-2 text-[13px] font-semibold leading-5 text-[#5f7189]">
                    Explore cards for cashback, travel, fuel, shopping, and
                    rewards.
                  </p>
                </div>
              )}

              {/* <div className="flex items-start gap-2 text-[11px] font-bold leading-5 text-[#61748f]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#075cde]" />
                <p>
                  No hard enquiry. Matched offers open with your selected
                  inputs.
                </p>
              </div> */}

              <Link
                href={continueHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[13px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
              >
                {continueLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {/* <p className="text-center text-[10px] font-bold text-[#667085]">
                Your information is encrypted and never sold.
              </p> */}
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
