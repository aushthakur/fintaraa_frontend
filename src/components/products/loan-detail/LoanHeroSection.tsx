"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  IndianRupee,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getApplyHref } from "@/components/application/flowRegistry";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

const personalLoanSlides = [
  {
    image: "/assets/personal-loan/hero-slide-1.jpg",
    alt: "Young Indian couple planning their goals in modern apartment",
    badge: "⚡ 100% Paperless Digital Sanction",
    title: "Instant Personal Loans up to ₹1 Crore",
    highlight: "Disbursal in 24 Hours",
    description:
      "Achieve milestone goals with quick digital approvals from 50+ RBI-regulated lenders. Zero collateral, minimal documentation, and transparent terms.",
    chips: ["From 10.49%* p.a.", "Tenure up to 7 Yrs", "Zero Hidden Charges"],
    ctaText: "Check Pre-Approved Offer",
  },
  {
    image: "/assets/personal-loan/hero-slide-2.jpg",
    alt: "Confident Indian entrepreneur in modern atrium",
    badge: "💼 For Salaried & Working Professionals",
    title: "Preferential Rates & Instant Credit Sanctions",
    highlight: "Direct Bank Transfer",
    description:
      "Exclusive low-interest borrowing plans crafted for corporate employees and self-employed professionals with swift online KYC verification.",
    chips: ["24-Hour Sanction", "Soft Bureau Check", "Lowest Processing Fees"],
    ctaText: "Explore Top Bank Offers",
  },
  {
    image: "/assets/personal-loan/hero-slide-3.jpg",
    alt: "Happy Indian family celebrating in new home",
    badge: "🎉 Low EMI Guarantee",
    title: "Celebrate Life's Joyful Moments with Affordable EMIs",
    highlight: "No Collateral Required",
    description:
      "Whether planning a wedding, home upgrade, travel, or medical emergency, secure funds quickly with flexible repayment and part-payment benefits.",
    chips: ["Flexible Tenures", "Part-Payment Option", "2M+ Satisfied Borrowers"],
    ctaText: "Calculate & Apply Today",
  },
];

export type EmploymentType = "salaried" | "self-employed";
export type CompanyCategoryTier = 1 | 2 | 3;

export interface CompanyItem {
  name: string;
  category: CompanyCategoryTier;
}

export const defaultPopularCompanies: CompanyItem[] = [
  { name: "Genpact India", category: 1 },
  { name: "Tata Consultancy Services (TCS)", category: 1 },
  { name: "Infosys Limited", category: 1 },
  { name: "Wipro Technologies", category: 1 },
  { name: "Accenture Services", category: 1 },
  { name: "Reliance Industries", category: 1 },
  { name: "HDFC Bank Ltd", category: 1 },
  { name: "ICICI Bank Ltd", category: 1 },
  { name: "State Bank of India (SBI)", category: 1 },
  { name: "Microsoft India", category: 1 },
  { name: "Google India", category: 1 },
  { name: "Amazon India", category: 1 },
  { name: "Deloitte India", category: 1 },
  { name: "Larsen & Toubro (L&T)", category: 1 },
  { name: "Bharti Airtel", category: 1 },
  { name: "Zomato Ltd", category: 2 },
  { name: "Swiggy (Bundl Technologies)", category: 2 },
  { name: "Tech Mahindra", category: 2 },
  { name: "Cognizant Technology Solutions", category: 2 },
  { name: "Paytm (One97 Communications)", category: 2 },
  { name: "Flipkart Internet", category: 2 },
  { name: "Oyo Rooms (Oravel Stays)", category: 2 },
  { name: "Delhivery Pvt Ltd", category: 2 },
  { name: "LTIMindtree", category: 2 },
  { name: "Federal Bank", category: 2 },
  { name: "Other / Custom / Unlisted Company", category: 3 },
];

export const categoryConfig: Record<
  CompanyCategoryTier,
  {
    title: string;
    badge: string;
    approvalNote: string;
    rate: number;
    banks: { name: string; rate: string; logo: string }[];
  }
> = {
  1: {
    title: "Category 1 Company (e.g. Genpact, TCS, Top MNCs)",
    badge: "All Banks Provide Loans Easily",
    approvalNote: "Top-tier listed corporate: All 50+ prime banks approve loans easily with highest ticket limits & lowest rates.",
    rate: 10.49,
    banks: [
      { name: "HDFC Bank", rate: "10.49%", logo: "/assets/banks/hdfc.png" },
      { name: "ICICI Bank", rate: "10.55%", logo: "/assets/banks/icici.png" },
      { name: "SBI", rate: "10.60%", logo: "/assets/banks/sbi.png" },
      { name: "Axis Bank", rate: "10.65%", logo: "/assets/banks/axis-bank.png" },
      { name: "Kotak Bank", rate: "10.75%", logo: "/assets/banks/kotak.png" },
    ],
  },
  2: {
    title: "Category 2 Company (e.g. Zomato, Swiggy, Tech Mahindra)",
    badge: "Most Top Banks & NBFCs Approve",
    approvalNote: "Established mid-corporate / growth startup: Strong approval rate across primary private banks and leading NBFCs.",
    rate: 11.49,
    banks: [
      { name: "ICICI Bank", rate: "11.49%", logo: "/assets/banks/icici.png" },
      { name: "Axis Bank", rate: "11.50%", logo: "/assets/banks/axis-bank.png" },
      { name: "Bajaj Finserv", rate: "11.55%", logo: "/assets/banks/bajaj-finserv.png" },
      { name: "IDFC FIRST", rate: "11.65%", logo: "/assets/banks/idfc.png" },
    ],
  },
  3: {
    title: "Custom / Unknown Company (Unlisted Firm / Small Entity)",
    badge: "Few Banks Only Provide Loan",
    approvalNote: "Custom or unlisted employer: Major primary banks restrict eligibility, but these selective partner NBFCs & banks fund loans based on 6-month bank statements.",
    rate: 12.99,
    banks: [
      { name: "Bajaj Finserv", rate: "12.99%", logo: "/assets/banks/bajaj-finserv.png" },
      { name: "IDFC FIRST", rate: "13.25%", logo: "/assets/banks/idfc.png" },
      { name: "Shriram Finance", rate: "13.50%", logo: "/assets/banks/shriram.png" },
      { name: "Federal Bank", rate: "13.75%", logo: "/assets/banks/Federal-Bank.png" },
    ],
  },
};

export const selfEmployedConfig = {
  title: "Self-Employed Loan Program",
  badge: "ITR & Banking Turnover Based",
  approvalNote: "Loans for business owners, traders & professionals. Evaluated on 2-year ITR, GST returns, and current account turnover.",
  rate: 11.99,
  professions: [
    "Business Owner / Trader",
    "Doctor / CA / Professional",
    "Retailer / Manufacturer",
    "Consultant / Freelancer",
  ],
  banks: [
    { name: "Kotak Bank", rate: "11.99%", logo: "/assets/banks/kotak.png" },
    { name: "Bajaj Finserv", rate: "12.25%", logo: "/assets/banks/bajaj-finserv.png" },
    { name: "HDFC Bank", rate: "12.50%", logo: "/assets/banks/hdfc.png" },
    { name: "ICICI Bank", rate: "12.75%", logo: "/assets/banks/icici.png" },
  ],
};

const defaultProductRanges: Record<
  string,
  {
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    stepAmount: number;
    rate: number;
    minTenure: number;
    maxTenure: number;
    defaultTenure: number;
    rateBadge: string;
    amountBadge: string;
  }
> = {
  "personal-loan": {
    minAmount: 50000,
    maxAmount: 10000000,
    defaultAmount: 500000,
    stepAmount: 50000,
    rate: 10.49,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 3,
    rateBadge: "From 10.49%* p.a.",
    amountBadge: "Up to ₹1 Crore",
  },
  "home-loan": {
    minAmount: 50000,
    maxAmount: 50000000,
    defaultAmount: 5000000,
    stepAmount: 100000,
    rate: 7.1,
    minTenure: 5,
    maxTenure: 30,
    defaultTenure: 20,
    rateBadge: "From 7.10%* p.a.",
    amountBadge: "Up to ₹5 Crore",
  },
  "business-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 1500000,
    stepAmount: 50000,
    rate: 11.99,
    minTenure: 1,
    maxTenure: 5,
    defaultTenure: 3,
    rateBadge: "From 11.99%* p.a.",
    amountBadge: "Collateral-free up to ₹1 Cr",
  },
  "gold-loan": {
    minAmount: 20000,
    maxAmount: 5000000,
    defaultAmount: 300000,
    stepAmount: 10000,
    rate: 8.95,
    minTenure: 1,
    maxTenure: 3,
    defaultTenure: 1,
    rateBadge: "From 8.95%* p.a.",
    amountBadge: "Up to 75% of Gold Value",
  },
  "loan-against-property": {
    minAmount: 1000000,
    maxAmount: 50000000,
    defaultAmount: 7500000,
    stepAmount: 250000,
    rate: 8.9,
    minTenure: 3,
    maxTenure: 20,
    defaultTenure: 15,
    rateBadge: "From 8.90%* p.a.",
    amountBadge: "Up to ₹10 Crore",
  },
  "doctor-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 2000000,
    stepAmount: 50000,
    rate: 10.25,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 4,
    rateBadge: "From 10.25%* p.a.",
    amountBadge: "Up to ₹1 Crore",
  },
  "ca-loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    defaultAmount: 2000000,
    stepAmount: 50000,
    rate: 10.25,
    minTenure: 1,
    maxTenure: 7,
    defaultTenure: 4,
    rateBadge: "From 10.25%* p.a.",
    amountBadge: "Up to ₹1 Crore",
  },
};

const fallbackRange = {
  minAmount: 50000,
  maxAmount: 10000000,
  defaultAmount: 500000,
  stepAmount: 25000,
  rate: 10.5,
  minTenure: 1,
  maxTenure: 5,
  defaultTenure: 3,
  rateBadge: "From 10.49%* p.a.",
  amountBadge: "Up to ₹1 Crore",
};

const fmtCurrency = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(num || 0)));

const fmtShort = (num: number) => {
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (num >= 100000) {
    const lk = num / 100000;
    return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(1)} Lakh`;
  }
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
};

export function LoanHeroSection({ page }: { page: LoanSeoPageData }) {
  const range = defaultProductRanges[page.loanTypeSlug] || fallbackRange;

  // Estimator interactive state
  const [amount, setAmount] = useState<number>(range.defaultAmount);
  const [amountInputStr, setAmountInputStr] = useState<string>(
    range.defaultAmount.toLocaleString("en-IN")
  );
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [tenureYears, setTenureYears] = useState<number>(range.defaultTenure);

  // Employment Type & Company / Profession interactive state
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("salaried");
  const [companySearchQuery, setCompanySearchQuery] = useState(
    "Genpact India"
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CompanyCategoryTier>(1);
  const [selfEmployedProfession, setSelfEmployedProfession] = useState(
    "Business Owner / Trader"
  );
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompanySearchChange = (val: string) => {
    setCompanySearchQuery(val);
    setIsCompanyDropdownOpen(true);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) return;

    const exactMatch = defaultPopularCompanies.find(
      (c) => c.name.toLowerCase() === trimmed
    );
    if (exactMatch) {
      setSelectedCategory(exactMatch.category);
      return;
    }

    const partialCat1 = defaultPopularCompanies
      .filter((c) => c.category === 1)
      .some(
        (c) =>
          trimmed.includes(c.name.toLowerCase().split(" ")[0]) ||
          c.name.toLowerCase().includes(trimmed)
      );
    if (partialCat1) {
      setSelectedCategory(1);
      return;
    }

    const partialCat2 = defaultPopularCompanies
      .filter((c) => c.category === 2)
      .some(
        (c) =>
          trimmed.includes(c.name.toLowerCase().split(" ")[0]) ||
          c.name.toLowerCase().includes(trimmed)
      );
    if (partialCat2) {
      setSelectedCategory(2);
      return;
    }

    // Otherwise it's a custom / unlisted company!
    setSelectedCategory(3);
  };

  const filteredCompanies = useMemo(() => {
    const q = companySearchQuery.trim().toLowerCase();
    if (!q) return defaultPopularCompanies.slice(0, 8);
    const matches = defaultPopularCompanies.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      return [
        {
          name: companySearchQuery.trim()
            ? `"${companySearchQuery.trim()}" (Custom / Unlisted Company)`
            : "Other / Custom / Unlisted Company",
          category: 3 as CompanyCategoryTier,
        },
      ];
    }
    return matches;
  }, [companySearchQuery]);

  const effectiveRate = useMemo(() => {
    if (employmentType === "self-employed") {
      return selfEmployedConfig.rate;
    }
    return categoryConfig[selectedCategory]?.rate || range.rate;
  }, [employmentType, selectedCategory, range.rate]);

  // Sync amount input display when amount changes via presets or blur
  useEffect(() => {
    if (!isEditingAmount) {
      setAmountInputStr(amount.toLocaleString("en-IN"));
    }
  }, [amount, isEditingAmount]);

  const handleAmountInputChange = (val: string) => {
    const rawDigits = val.replace(/\D/g, "");
    if (rawDigits === "") {
      setAmountInputStr("");
      return;
    }
    const num = Number(rawDigits);
    setAmountInputStr(num.toLocaleString("en-IN"));
    setAmount(num);
  };

  const handleAmountBlur = () => {
    setIsEditingAmount(false);
    const rawDigits = amountInputStr.replace(/\D/g, "");
    let finalAmount = rawDigits === "" ? range.defaultAmount : Number(rawDigits);
    if (finalAmount < range.minAmount) finalAmount = range.minAmount;
    if (finalAmount > range.maxAmount) finalAmount = range.maxAmount;
    setAmount(finalAmount);
    setAmountInputStr(finalAmount.toLocaleString("en-IN"));
  };

  // Half-page banner carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(() => {
    if (page.loanTypeSlug === "personal-loan") {
      return personalLoanSlides;
    }
    // Generic dynamic adaptation for other loan products
    return personalLoanSlides.map((slide, idx) => ({
      ...slide,
      title:
        idx === 0
          ? `${page.loanType} up to ${range.amountBadge}`
          : idx === 1
          ? `Competitive Rates on ${page.loanType}`
          : `Fast 24-Hour Approval for ${page.loanType}`,
      badge: idx === 0 ? `⚡ ${range.rateBadge}` : slide.badge,
    }));
  }, [page.loanType, page.loanTypeSlug, range.amountBadge, range.rateBadge]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  const emiCalc = useMemo(() => {
    const monthlyRate = effectiveRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    if (monthlyRate === 0)
      return { emi: Math.round(amount / totalMonths), total: amount, interest: 0 };
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const total = emi * totalMonths;
    const interest = total - amount;
    const principalPct = Math.max(
      1,
      Math.min(99, Math.round((amount / total) * 100))
    );
    const interestPct = 100 - principalPct;
    return {
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(interest),
      principalPct,
      interestPct,
    };
  }, [amount, tenureYears, effectiveRate]);

  return (
    <section
      aria-label={`${page.loanType} Hero Section`}
      className="relative w-full overflow-hidden border-b border-gray-200 bg-white"
    >
      {/* ── CUSTOM INLINE STYLES FOR CONTINUOUS SHINE BUTTON ── */}
      <style jsx global>{`
        /* Continuous Shine Animation on Action Buttons */
        @keyframes continuousShineKeyframes {
          0% {
            left: -130%;
          }
          32%,
          100% {
            left: 230%;
          }
        }

        .btn-continuous-shine {
          position: relative;
          overflow: hidden;
        }

        .btn-continuous-shine::after {
          content: "";
          position: absolute;
          top: -50%;
          bottom: -50%;
          left: -130%;
          width: 55%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0.68) 50%,
            rgba(255, 255, 255, 0.15) 80%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-24deg);
          animation: continuousShineKeyframes 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]">
        {/* ══════════════════════════════════════════════════════════════
            LEFT: FULL-HEIGHT CAROUSEL WITHOUT A CURVED CONTAINER
            Stretches edge-to-edge, full height, no outer card box
           ══════════════════════════════════════════════════════════════ */}
        <div
          className="relative lg:col-span-7 flex flex-col justify-between overflow-hidden text-white select-none p-6 sm:p-10 lg:p-12 xl:pl-16 xl:pr-12 min-h-[480px] sm:min-h-[540px] lg:min-h-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image Carousel (Full Height & Width of left column) */}
          <div className="absolute inset-0 z-0 bg-gray-950">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Ultra-High Contrast Gradient Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-transparent to-black/15 pointer-events-none" />
          </div>

          {/* ── Slide Header / Eyebrow Pill ── */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-[12px] font-bold text-white border border-white/30 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>{slides[currentSlide].badge}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white/90 border border-white/15">
              <span>{currentSlide + 1}</span>
              <span className="text-white/50">/</span>
              <span className="text-white/60">{slides.length}</span>
            </div>
          </div>

          {/* ── Slide Core Content ── */}
          <div className="relative z-10 my-auto py-6 sm:py-8 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Main Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-tight leading-[1.18] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {slides[currentSlide].title}{" "}
                  <span className="block mt-1 bg-gradient-to-r from-yellow-300 via-purple-200 to-white bg-clip-text text-transparent">
                    {slides[currentSlide].highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-3.5 text-[14px] sm:text-[15.5px] font-normal leading-relaxed text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  {slides[currentSlide].description}
                </p>

                {/* Benefit Chips */}
                <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {slides[currentSlide].chips.map((chip) => (
                    <div
                      key={chip}
                      className="flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-3 py-1.5 text-[11.5px] sm:text-[12px] font-semibold text-white border border-white/20 shadow-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{chip}</span>
                    </div>
                  ))}
                </div>

                {/* ── CTA BUTTON WITH CONTINUOUS SHINE EFFECT ── */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href={applyHref}
                    className="btn-continuous-shine inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-[14.5px] font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(100,36,199,0.55)] active:scale-98 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #6424c7 50%, #4c1d95 100%)",
                    }}
                  >
                    <span>{slides[currentSlide].ctaText}</span>
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-gray-300">
                    <Clock className="h-4 w-4 text-purple-300" />
                    <span>Decision in 3 mins</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Slide Controls & Indicators ── */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4">
            {/* Dot / Pill Indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? "w-8 bg-white shadow-xs"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Left / Right Arrow Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-white/25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-white/25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT: LOAN ESTIMATOR AS INTEGRATED PAGE INPUT (NOT A FORM)
            Clean, spacious, interactive direct page inputs + calculations
           ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col justify-center py-6 sm:py-8 lg:py-10 px-4 sm:px-7 lg:px-9 xl:px-12 bg-gradient-to-br from-slate-50/80 via-white to-purple-50/30">
          <div className="w-full max-w-[480px] mx-auto lg:mx-0">
            {/* Estimator Header Banner */}
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-3 mb-3.5">
              <div>
                <h2 className="text-[17px] sm:text-[19px] font-bold text-gray-950 leading-tight">
                  Quick {page.loanType} Estimator
                </h2>
                <p className="text-[11px] sm:text-[11.5px] font-normal text-gray-500 mt-0.5">
                  Real-time installment preview
                </p>
              </div>
              <div className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200/80 px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-bold text-[#6424C7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6424C7] animate-pulse shrink-0" />
                <span className="whitespace-nowrap">From {effectiveRate.toFixed(2)}%* p.a.</span>
              </div>
            </div>

            {/* ── Employment Type Toggle (Salaried vs Self-Employed) ── */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-xl mb-2.5">
              <button
                type="button"
                onClick={() => setEmploymentType("salaried")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  employmentType === "salaried"
                    ? "bg-[#6424C7] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Salaried</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    employmentType === "salaried"
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Company Based
                </span>
              </button>
              <button
                type="button"
                onClick={() => setEmploymentType("self-employed")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  employmentType === "self-employed"
                    ? "bg-[#6424C7] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Self-Employed</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    employmentType === "self-employed"
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  ITR Based
                </span>
              </button>
            </div>

            {/* ── 1. Loan Amount: Direct Input Box (No badges, No scroller) ── */}
            <div className="mb-2.5">
              <div className="flex items-center justify-between mb-1 text-xs font-semibold text-gray-700">
                <label htmlFor="loan-amount-input">Required Loan Amount</label>
                <span className="text-[11.5px] font-bold text-[#6424C7]">
                  {fmtShort(amount)}
                </span>
              </div>
              <div className="relative flex items-center rounded-xl border border-gray-200/90 bg-[#f8fafc] hover:bg-[#f1f5f9] focus-within:bg-white focus-within:border-[#6424C7] focus-within:ring-2 focus-within:ring-[#6424C7]/20 transition-all px-3 py-2">
                <span className="text-gray-500 font-extrabold text-[15px] mr-2 select-none">
                  ₹
                </span>
                <input
                  id="loan-amount-input"
                  type="text"
                  inputMode="numeric"
                  value={amountInputStr}
                  onFocus={() => setIsEditingAmount(true)}
                  onChange={(e) => handleAmountInputChange(e.target.value)}
                  onBlur={handleAmountBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAmountBlur();
                  }}
                  placeholder="Enter amount, e.g. 5,00,000"
                  className="w-full bg-transparent text-[14.5px] font-extrabold text-gray-900 outline-none tabular-nums placeholder:text-gray-400 placeholder:font-normal"
                  aria-label="Required Loan Amount"
                />
                <span className="text-[10.5px] text-gray-400 shrink-0 select-none">
                  Max {fmtShort(range.maxAmount)}
                </span>
              </div>
            </div>

            {/* ── 2. Employment Details: Salaried (Company Tier Banks) vs Self-Employed ── */}
            {employmentType === "salaried" ? (
              <div className="mb-2.5" ref={companyDropdownRef}>
                <div className="flex items-center justify-between mb-1 text-xs font-semibold text-gray-700">
                  <span>Employer / Company</span>
                  {/* Category Pills */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(1);
                        setCompanySearchQuery("Genpact India");
                      }}
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-all cursor-pointer ${
                        selectedCategory === 1
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                      title="Category 1: Genpact, TCS, Top MNCs - All Banks Provide Loans Easily"
                    >
                      Cat 1 (Genpact/MNC)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(2);
                        setCompanySearchQuery("Zomato Ltd");
                      }}
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-all cursor-pointer ${
                        selectedCategory === 2
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                      title="Category 2: Mid Corporates - Most Banks & NBFCs Approve"
                    >
                      Cat 2 (Growth)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(3);
                        setCompanySearchQuery("Custom / Unlisted Company");
                      }}
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-all cursor-pointer ${
                        selectedCategory === 3
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                      title="Category 3: Custom or Unlisted Firm - Few Banks Only"
                    >
                      Custom / Unknown
                    </button>
                  </div>
                </div>

                {/* Searchable Input */}
                <div className="relative">
                  <div className="relative flex items-center rounded-xl border border-gray-200/90 bg-[#f8fafc] hover:bg-[#f1f5f9] focus-within:bg-white focus-within:border-[#6424C7] focus-within:ring-2 focus-within:ring-[#6424C7]/20 transition-all px-3 py-1.5">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={companySearchQuery}
                      onFocus={() => setIsCompanyDropdownOpen(true)}
                      onChange={(e) => handleCompanySearchChange(e.target.value)}
                      placeholder="Type company (e.g. Genpact, TCS, or custom employer)..."
                      className="w-full bg-transparent text-[13px] font-bold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-normal"
                    />
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1 shrink-0" />
                  </div>

                  {/* Autocomplete dropdown */}
                  {isCompanyDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-y-auto rounded-xl border border-purple-100 bg-white p-1 shadow-xl">
                      <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
                        <span>Select Company &amp; Category</span>
                        <span className="text-[9px] text-[#6424C7] font-semibold">
                          Determines Bank Availability
                        </span>
                      </div>
                      {filteredCompanies.map((comp) => (
                        <button
                          key={comp.name}
                          type="button"
                          onClick={() => {
                            setCompanySearchQuery(comp.name);
                            setSelectedCategory(comp.category);
                            setIsCompanyDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-800 truncate">
                            {comp.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                              comp.category === 1
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : comp.category === 2
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            {comp.category === 1
                              ? "Cat 1 • All Banks"
                              : comp.category === 2
                              ? "Cat 2 • Most Banks"
                              : "Custom • Few Banks"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamic Banks List Based on Company Tier */}
                <div
                  className={`mt-2 rounded-xl border p-2 transition-all ${
                    selectedCategory === 1
                      ? "bg-emerald-50/40 border-emerald-100"
                      : selectedCategory === 2
                      ? "bg-blue-50/40 border-blue-100"
                      : "bg-amber-50/50 border-amber-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10.5px] font-semibold mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {selectedCategory === 1 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          All Banks Provide Loans Easily (Cat 1: Genpact / MNC)
                        </span>
                      ) : selectedCategory === 2 ? (
                        <span className="inline-flex items-center gap-1 text-blue-800 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          Most Top Banks &amp; NBFCs Approve (Cat 2: Growth)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          Few Banks Only Provide Loan (Custom / Unlisted)
                        </span>
                      )}
                    </div>
                    <span className="text-[#6424C7] font-bold shrink-0 ml-1">
                      {categoryConfig[selectedCategory].rate.toFixed(2)}%* p.a.
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-600 mb-1.5 leading-tight">
                    {categoryConfig[selectedCategory].approvalNote}
                  </p>

                  <div
                    className={`grid gap-1.5 ${
                      selectedCategory === 1 ? "grid-cols-5" : "grid-cols-4"
                    }`}
                  >
                    {categoryConfig[selectedCategory].banks.map((b) => (
                      <div
                        key={b.name}
                        className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200/80 px-1 py-1.5 shadow-2xs text-center hover:border-purple-300 transition-colors"
                      >
                        <div className="relative h-4.5 w-11 sm:w-13">
                          <Image
                            src={b.logo}
                            alt={b.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[9px] font-extrabold text-[#6424C7] mt-0.5 leading-none">
                          {b.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Self-Employed Flow ── */
              <div className="mb-2.5">
                <div className="flex items-center justify-between mb-1 text-xs font-semibold text-gray-700">
                  <span>Profession / Business Type</span>
                  <span className="text-[10px] font-bold text-[#6424C7]">
                    ITR &amp; Banking Based
                  </span>
                </div>
                {/* 4 Profession Buttons */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {selfEmployedConfig.professions.map((prof) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => setSelfEmployedProfession(prof)}
                      className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all cursor-pointer border ${
                        selfEmployedProfession === prof
                          ? "bg-purple-50 border-[#6424C7] text-[#6424C7] font-bold shadow-2xs"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>

                {/* Self-Employed Matched Banks */}
                <div className="rounded-xl bg-purple-50/60 border border-purple-100 p-2">
                  <div className="flex items-center justify-between text-[10.5px] font-semibold mb-1">
                    <span className="text-gray-800 font-bold flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-[#6424C7]" />
                      Self-Employed Loan Partners:
                    </span>
                    <span className="text-[#6424C7] font-bold">
                      {selfEmployedConfig.rate.toFixed(2)}%* p.a.
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-1.5 leading-tight">
                    {selfEmployedConfig.approvalNote}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {selfEmployedConfig.banks.map((b) => (
                      <div
                        key={b.name}
                        className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200/80 px-1 py-1.5 shadow-2xs text-center hover:border-purple-300 transition-colors"
                      >
                        <div className="relative h-4.5 w-12 sm:w-14">
                          <Image
                            src={b.logo}
                            alt={b.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[9px] font-extrabold text-[#6424C7] mt-0.5 leading-none">
                          {b.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. Repayment Period (No scroller, only 1, 2, 3, 5, 7 Years options) ── */}
            <div className="mb-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Repayment Period</span>
                <span className="text-[#6424C7] font-bold text-[11.5px]">
                  {tenureYears} {tenureYears === 1 ? "Year" : "Years"} ({tenureYears * 12} Mos)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 5, 7].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenureYears(t)}
                    className={`py-1.5 rounded-xl text-center text-[11.5px] font-bold transition-all cursor-pointer ${
                      tenureYears === t
                        ? "bg-[#6424C7] text-white shadow-xs scale-[1.02]"
                        : "bg-gray-100/90 text-gray-700 hover:bg-purple-50 hover:text-[#6424C7] border border-gray-200/80"
                    }`}
                  >
                    {t} {t === 1 ? "Year" : "Years"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── 4. Estimated Monthly EMI: Compact, tight, space-efficient ── */}
            <div className="rounded-xl bg-gradient-to-r from-purple-50/70 via-slate-50 to-white border border-purple-100/90 p-2 sm:p-2.5 mb-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                    Estimated Monthly EMI
                  </span>
                  <div className="text-[18px] sm:text-[20px] font-extrabold text-[#6424C7] tabular-nums leading-tight">
                    {fmtCurrency(emiCalc.emi)}
                    <span className="text-[10.5px] font-normal text-gray-500 ml-1">
                      /mo
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                    Total Repayable
                  </span>
                  <div className="text-[13px] font-bold text-gray-900 tabular-nums leading-tight">
                    {fmtCurrency(emiCalc.total)}
                  </div>
                  <span className="text-[9.5px] text-gray-500">
                    Interest: {fmtCurrency(emiCalc.interest)}
                  </span>
                </div>
              </div>
              {/* Ultra-compact visual split bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden flex mt-1.5">
                <div
                  className="h-full bg-[#6424C7] transition-all duration-300"
                  style={{ width: `${emiCalc.principalPct}%` }}
                />
                <div
                  className="h-full bg-[#a855f7] transition-all duration-300"
                  style={{ width: `${emiCalc.interestPct}%` }}
                />
              </div>
            </div>

            {/* ── 5. Action CTA & Trust Signals ── */}
            <Link
              href={`/eligibility-results?product=loan&loanType=${page.loanTypeSlug}&amount=${amount}&tenureYears=${tenureYears}&employmentType=${employmentType}&company=${encodeURIComponent(
                employmentType === "salaried"
                  ? companySearchQuery
                  : selfEmployedProfession
              )}&category=${employmentType === "salaried" ? selectedCategory : 0}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-98 no-underline cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #6424C7 50%, #4c1d95 100%)",
              }}
            >
              <span>Check Eligibility for {fmtShort(amount)}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-2 flex items-center justify-center gap-3 text-[10.5px] font-medium text-gray-500">
              <span className="flex items-center gap-1">
                <LockKeyhole className="h-3 w-3 text-emerald-600" />
                100% Free
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#6424C7]" />
                Zero Bureau Impact
              </span>
              <span>•</span>
              <span>Instant Result</span>
            </div>
          </div>
        </div>
        </div>
      </section>
  );
}
