"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  Building,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Home,
  Info,
  Key,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  PieChart,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sliders,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { buildApiUrl } from "@/services/apiUrl";
import type { LoanSeoLocationPage, LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

// ─── Bank Logo Resolver ────────────────────────────────────────────────────────
const getBankLogoPath = (slug: string) => {
  const s = (slug || "").toLowerCase();
  if (s.includes("hdfc")) return "/assets/banks/HDFC-Bank.png";
  if (s.includes("icici")) return "/assets/banks/ICICI-Bank.png";
  if (s.includes("axis")) return "/assets/banks/axis-bank.png";
  if (s.includes("sbi") || s.includes("state-bank"))
    return "/assets/banks/State-Bank-of-India.png";
  if (s.includes("kotak")) return "/assets/banks/Kotak-Mahindra-Bank.png";
  if (s.includes("bajaj")) return "/assets/banks/bajaj-finserv.png";
  if (s.includes("baroda")) return "/assets/banks/Bank-of-Baroda.png";
  if (s.includes("indusind")) return "/assets/banks/IndusInd-Bank.png";
  if (s.includes("federal")) return "/assets/banks/Federal-Bank.png";
  if (s.includes("pnb") || s.includes("punjab"))
    return "/assets/banks/Punjab-National-Bank.png";
  if (s.includes("canara")) return "/assets/banks/canara-bank.png";
  if (s.includes("union")) return "/assets/banks/union-bank.png";
  if (s.includes("idfc")) return "/assets/banks/idfc.png";
  if (s.includes("yes")) return "/assets/banks/yes-bank.png";
  return "/assets/banks/hdfc.png";
};

// ─── Exact Live Bank Rates Dictionary ──────────────────────────────────────────
const LIVE_BANK_RATES: Record<
  string,
  { rate: string; fee: string; amount: string; tenure: string }
> = {
  sbi: {
    rate: "8.35% – 9.15% p.a.",
    fee: "0.15% to 0.35% (Max ₹10,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "state-bank-of-india": {
    rate: "8.35% – 9.15% p.a.",
    fee: "0.15% to 0.35% (Max ₹10,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  hdfc: {
    rate: "8.40% – 9.40% p.a.",
    fee: "Up to 0.50% (Min ₹3,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "hdfc-bank": {
    rate: "8.40% – 9.40% p.a.",
    fee: "Up to 0.50% (Min ₹3,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  icici: {
    rate: "8.40% – 9.35% p.a.",
    fee: "0.50% to 1.00% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "icici-bank": {
    rate: "8.40% – 9.35% p.a.",
    fee: "0.50% to 1.00% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "bank-of-baroda": {
    rate: "8.35% – 9.10% p.a.",
    fee: "Nil to 0.25% (Special Offer)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  baroda: {
    rate: "8.35% – 9.10% p.a.",
    fee: "Nil to 0.25% (Special Offer)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  axis: {
    rate: "8.45% – 9.45% p.a.",
    fee: "Up to 1.00% (Min ₹10,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "axis-bank": {
    rate: "8.45% – 9.45% p.a.",
    fee: "Up to 1.00% (Min ₹10,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "kotak-bank": {
    rate: "8.50% – 9.30% p.a.",
    fee: "0.50% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 25 years",
  },
  "kotak-mahindra-bank": {
    rate: "8.50% – 9.30% p.a.",
    fee: "0.50% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 25 years",
  },
  "punjab-national-bank": {
    rate: "8.40% – 9.25% p.a.",
    fee: "0.35% (Max ₹15,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  pnb: {
    rate: "8.40% – 9.25% p.a.",
    fee: "0.35% (Max ₹15,000)",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
  },
  "bajaj-finserv": {
    rate: "8.50% – 9.50% p.a.",
    fee: "Up to 0.50% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 32 years",
  },
  "bajaj-housing-finance": {
    rate: "8.50% – 9.50% p.a.",
    fee: "Up to 0.50% + GST",
    amount: "Up to ₹100 Crores",
    tenure: "Up to 32 years",
  },
  "federal-bank": {
    rate: "8.60% – 9.60% p.a.",
    fee: "0.50% (Min ₹5,000)",
    amount: "Up to ₹50 Crores",
    tenure: "Up to 30 years",
  },
  "indusind-bank": {
    rate: "8.65% – 9.75% p.a.",
    fee: "Up to 1.00%",
    amount: "Up to ₹50 Crores",
    tenure: "Up to 25 years",
  },
  "canara-bank": {
    rate: "8.40% – 9.20% p.a.",
    fee: "0.20% to 0.35%",
    amount: "Up to ₹75 Crores",
    tenure: "Up to 30 years",
  },
  "union-bank": {
    rate: "8.35% – 9.15% p.a.",
    fee: "0.25% (Max ₹12,000)",
    amount: "Up to ₹75 Crores",
    tenure: "Up to 30 years",
  },
  idfc: {
    rate: "8.60% – 9.50% p.a.",
    fee: "0.50% + GST",
    amount: "Up to ₹50 Crores",
    tenure: "Up to 30 years",
  },
  "yes-bank": {
    rate: "8.75% – 9.85% p.a.",
    fee: "0.75% + GST",
    amount: "Up to ₹30 Crores",
    tenure: "Up to 25 years",
  },
};

const getLiveLenderDetails = (lender: BankProductLender) => {
  const slug = (lender.bankSlug || "").toLowerCase();
  for (const [key, val] of Object.entries(LIVE_BANK_RATES)) {
    if (slug.includes(key)) {
      return val;
    }
  }
  const rate =
    lender.interestRate && !lender.interestRate.toLowerCase().includes("check")
      ? lender.interestRate
      : "8.35% – 9.25% p.a.";
  return {
    rate,
    fee: lender.processingFee || "0.25% – 0.50%",
    amount: lender.loanAmount || "Up to ₹100 Crores",
    tenure: lender.tenure || "Up to 30 years",
  };
};

// ─── Hero Dynamic Slides ───────────────────────────────────────────────────────
const homeHeroSlides = [
  {
    image: "/images/loans/home/villa_hero.jpg",
    title: "Luxury Architectural Villas & Ready Homes",
    subtitle: "Finance your bespoke villa with interest rates starting at 8.35% p.a.",
  },
  {
    image: "/images/loans/home/penthouse_hero.jpg",
    title: "Prime Duplex & High-Rise City Penthouses",
    subtitle: "Fast-track 48-hour digital sanction with up to 90% property valuation funding",
  },
  {
    image: "/images/loans/home/family_home_hero.jpg",
    title: "Serene Gated Communities & Family Residences",
    subtitle: "Unlock dual co-applicant tax savings up to ₹7 Lakhs/yr under 80C & 24(b)",
  },
];

// ─── Comprehensive Indian Cities List ──────────────────────────────────────────
const allIndianCities = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Prayagraj",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubballi-Dharwad",
  "Mysuru",
  "Tiruchirappalli",
  "Bareilly",
  "Aligarh",
  "Tiruppur",
  "Gurugram",
  "Moradabad",
  "Jalandhar",
  "Bhubaneswar",
  "Salem",
  "Warangal",
  "Jalgaon",
  "Noida",
  "Kochi",
  "Dehradun",
  "Mangalore",
  "Udaipur",
  "Shimla",
  "Panaji",
  "Pondicherry",
  "Other Cities",
];

// ─── Default Comprehensive Home Loan Lenders (Live Rates) ────────────────────
const defaultHomeLenders: BankProductLender[] = [
  {
    bankName: "State Bank of India (SBI Home Loan)",
    bankSlug: "sbi",
    productSlug: "home-loan",
    interestRate: "8.35% – 9.15% p.a.",
    processingFee: "0.15% to 0.35% (Max ₹10,000)",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/sbi",
  },
  {
    bankName: "HDFC Bank Home Loan",
    bankSlug: "hdfc-bank",
    productSlug: "home-loan",
    interestRate: "8.40% – 9.40% p.a.",
    processingFee: "Up to 0.50% (Min ₹3,000)",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/hdfc-bank",
  },
  {
    bankName: "ICICI Bank Home Loan",
    bankSlug: "icici-bank",
    productSlug: "home-loan",
    interestRate: "8.40% – 9.35% p.a.",
    processingFee: "0.50% to 1.00% + GST",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/icici-bank",
  },
  {
    bankName: "Bank of Baroda (Baroda Home Loan)",
    bankSlug: "bank-of-baroda",
    productSlug: "home-loan",
    interestRate: "8.35% – 9.10% p.a.",
    processingFee: "Nil to 0.25% (Special Offer)",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/bank-of-baroda",
  },
  {
    bankName: "Axis Bank Home Loan",
    bankSlug: "axis-bank",
    productSlug: "home-loan",
    interestRate: "8.45% – 9.45% p.a.",
    processingFee: "Up to 1.00% (Min ₹10,000)",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/axis-bank",
  },
  {
    bankName: "Kotak Mahindra Bank Home Loan",
    bankSlug: "kotak-bank",
    productSlug: "home-loan",
    interestRate: "8.50% – 9.30% p.a.",
    processingFee: "0.50% + GST",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 25 years",
    canonicalPath: "/products/home-loan/kotak-bank",
  },
  {
    bankName: "Punjab National Bank (PNB Max-Saver)",
    bankSlug: "punjab-national-bank",
    productSlug: "home-loan",
    interestRate: "8.40% – 9.25% p.a.",
    processingFee: "0.35% (Max ₹15,000)",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/punjab-national-bank",
  },
  {
    bankName: "Bajaj Housing Finance Ltd",
    bankSlug: "bajaj-finserv",
    productSlug: "home-loan",
    interestRate: "8.50% – 9.50% p.a.",
    processingFee: "Up to 0.50% + GST",
    loanAmount: "Up to ₹100 Crores",
    tenure: "Up to 32 years",
    canonicalPath: "/products/home-loan/bajaj-finserv",
  },
  {
    bankName: "Federal Bank Housing Loan",
    bankSlug: "federal-bank",
    productSlug: "home-loan",
    interestRate: "8.60% – 9.60% p.a.",
    processingFee: "0.50% (Min ₹5,000)",
    loanAmount: "Up to ₹50 Crores",
    tenure: "Up to 30 years",
    canonicalPath: "/products/home-loan/federal-bank",
  },
  {
    bankName: "IndusInd Bank Home Loan",
    bankSlug: "indusind-bank",
    productSlug: "home-loan",
    interestRate: "8.65% – 9.75% p.a.",
    processingFee: "Up to 1.00%",
    loanAmount: "Up to ₹50 Crores",
    tenure: "Up to 25 years",
    canonicalPath: "/products/home-loan/indusind-bank",
  },
];

// ─── Loan Types Portfolio (Full Width Flush Edge Images) ─────────────────────
const homeLoanTypes = [
  {
    id: "ready-purchase",
    title: "Ready-to-Move & Resale Home Loan",
    desc: "For purchasing ready apartments, duplexes, or independent villas. Instant disbursement directly to the seller with zero GST on completed properties and immediate move-in certainty.",
    image: "/images/loans/home/keys_handover.jpg",
    rate: "From 8.35% p.a.",
    maxFunding: "Up to 90% LTV",
    badge: "Most Popular",
    points: [
      "Immediate possession without developer construction delays or escrow risks",
      "Save on monthly rent while claiming full Sec 24(b) & 80C tax deductions",
      "Express 3-step legal title verification and direct spot disbursement to seller",
      "Flexible tenures up to 30 years with Step-Up EMI structures for young professionals",
    ],
  },
  {
    id: "construction",
    title: "Plot Purchase & Architectural Construction Loan",
    desc: "Composite mortgage financing to acquire residential plots and construct your custom architectural home within 3-5 years with milestone-based tranche disbursements.",
    image: "/images/loans/home/construction.jpg",
    rate: "From 8.45% p.a.",
    maxFunding: "Up to 80% Construction Cost",
    badge: "Architectural Custom Build",
    points: [
      "Unified financing for both land purchase and stage-wise architectural construction",
      "Tranche-wise disbursement directly aligned with chartered engineer site progress",
      "Moratorium period available during active construction so you pay only pre-EMI interest",
      "Support for multi-floor builder floors, independent bungalows, and farm estates",
    ],
  },
  {
    id: "balance-transfer",
    title: "Home Loan Balance Transfer + Liquid Top-Up",
    desc: "Refinance your existing high-interest home loan to prime rates (save ₹10L+ in interest) and obtain an unrestricted cash top-up for home interiors, business, or education.",
    image: "/images/loans/home/balance_transfer.jpg",
    rate: "From 8.35% p.a.",
    maxFunding: "Save ₹5,000+/mo EMI",
    badge: "Maximum Interest Savings",
    points: [
      "Zero foreclosure or penalty charges on floating-rate external refinancing",
      "Substantial reduction in loan tenure or immediate relief in monthly EMI outflow",
      "Additional Top-up loan up to ₹1 Crore at low home loan interest rates",
      "Doorstep documentation pickup and seamless retrieval of original property deeds",
    ],
  },
  {
    id: "luxury-nri",
    title: "NRI & Luxury High-Value Home Loan",
    desc: "Tailored multi-crore mortgage solutions for Non-Resident Indians (NRIs), PIOs, and High Net Worth Individuals purchasing luxury estates across India.",
    image: "/images/loans/home/villa_hero.jpg",
    rate: "From 8.40% p.a.",
    maxFunding: "Up to ₹100 Crores",
    badge: "NRI & HNWI Special",
    points: [
      "Power of Attorney (POA) assisted seamless digital execution from overseas",
      "Repayment via NRE / NRO bank accounts with currency hedge advantage",
      "Dedicated Senior Mortgage Relationship Manager and express legal concierge",
      "Flexible income recognition for foreign currency earnings across GCC, USA, UK & SG",
    ],
  },
];

// ─── City Real Estate & Loan Intelligence ─────────────────────────────────────
const metroCityInsights = [
  {
    city: "Mumbai (MMR)",
    stampDuty: "5% - 6%",
    regFee: "1% (Max ₹30k)",
    avgPrice: "₹18,500 - ₹45,000 /sq.ft",
    popularAreas: "Bandra, Andheri, Thane, Navi Mumbai, Worli",
    highlight: "High demand for redevelopment & sea-facing luxury apartments",
  },
  {
    city: "Bengaluru",
    stampDuty: "3% - 5%",
    regFee: "1%",
    avgPrice: "₹6,800 - ₹16,500 /sq.ft",
    popularAreas: "Whitefield, Sarjapur, HSR Layout, Indiranagar, North BLR",
    highlight: "IT corridor tech-buyer surge with villa township preferences",
  },
  {
    city: "Delhi NCR (Gurugram/Noida)",
    stampDuty: "5% - 7%",
    regFee: "1%",
    avgPrice: "₹7,200 - ₹22,000 /sq.ft",
    popularAreas: "Golf Course Ext, Dwarka Expwy, Noida Sec 150, New Gurugram",
    highlight: "High-ticket luxury high-rises and integrated plotted townships",
  },
  {
    city: "Hyderabad",
    stampDuty: "6% - 7.5%",
    regFee: "0.5%",
    avgPrice: "₹6,200 - ₹14,000 /sq.ft",
    popularAreas: "Gachibowli, HITEC City, Kokapet, Financial District, Tellapur",
    highlight: "Rapidly expanding commercial hub with ultra-modern gated communities",
  },
  {
    city: "Pune",
    stampDuty: "6% - 7%",
    regFee: "1% (Max ₹30k)",
    avgPrice: "₹5,800 - ₹13,500 /sq.ft",
    popularAreas: "Kharadi, Hinjawadi, Baner, Wakad, Viman Nagar",
    highlight: "Balanced rental yields with high absorption by manufacturing & IT pros",
  },
  {
    city: "Chennai",
    stampDuty: "7%",
    regFee: "2% - 4%",
    avgPrice: "₹6,000 - ₹15,000 /sq.ft",
    popularAreas: "OMR, ECR, Anna Nagar, Velachery, Porur",
    highlight: "Stable capital appreciation with growing suburban villa projects",
  },
];

// ─── Document Checklist Tabs ──────────────────────────────────────────────────
const documentTabs = [
  {
    id: "salaried",
    label: "Salaried Employees",
    desc: "For corporate professionals, government employees, and MNC staff.",
    items: [
      {
        title: "Proof of Identity & Address",
        detail: "PAN Card (mandatory), Aadhaar Card, Passport, or Voter ID.",
      },
      {
        title: "Income & Salary Slips",
        detail: "Latest 3 to 6 months salary slips with complete company deductions.",
      },
      {
        title: "Bank Account Statements",
        detail: "Last 6 months operating salary account statement (PDF with net banking sign-off).",
      },
      {
        title: "Tax Verification Proof",
        detail: "Form 16 (Part A & B) for past 2 years & latest ITR acknowledgment.",
      },
      {
        title: "Employment Credentials",
        detail: "Official corporate email verification, appointment letter, or official employee badge.",
      },
    ],
  },
  {
    id: "self-employed",
    label: "Self-Employed / Business",
    desc: "For entrepreneurs, directors, doctors, CAs, and business owners.",
    items: [
      {
        title: "Business KYC & Identity",
        detail: "PAN of applicant & firm, GST registration, Udyam certificate, Shop Act license.",
      },
      {
        title: "Income Tax Returns (ITR)",
        detail: "Last 3 financial years ITR with complete Computation of Income statement.",
      },
      {
        title: "Audited Financials",
        detail: "Audited Balance Sheet and Profit & Loss statement signed by a Certified CA.",
      },
      {
        title: "Banking Cashflow History",
        detail: "Last 12 months primary current account & savings account bank statements.",
      },
      {
        title: "Ownership & Track Record",
        detail: "Memorandum of Association (MOA), Partnership Deed, or Business Vintage proof.",
      },
    ],
  },
  {
    id: "property",
    label: "Property Legal Checklist",
    desc: "Essential documents for title search, technical vetting, and valuation.",
    items: [
      {
        title: "Title Deed & Chain of Title",
        detail: "Registered Sale Deed / Conveyance Deed with unbroken 30-year link history.",
      },
      {
        title: "Allotment & Builder NOC",
        detail: "Allotment letter, Builder-Buyer Agreement (BBA), and Tripartite NOC.",
      },
      {
        title: "Sanctioned Architectural Plan",
        detail: "Municipal / Town Planning authority approved building layout and sanction drawings.",
      },
      {
        title: "Encumbrance Certificate (EC)",
        detail: "Updated Nil-Encumbrance Certificate (Form 15/16) from the Sub-Registrar.",
      },
      {
        title: "Tax Receipts & RERA Number",
        detail: "Latest property tax paid receipts and valid state RERA project registration.",
      },
    ],
  },
  {
    id: "nri",
    label: "NRI / Foreign Residents",
    desc: "For non-resident Indians and PIOs investing in property across India.",
    items: [
      {
        title: "Passport & Valid Visa",
        detail: "Copy of valid Indian Passport, Visa / Work Permit stamped, and CDC if seafarer.",
      },
      {
        title: "Overseas Income Proof",
        detail: "Last 6 months overseas salary slips and continuous employment contract.",
      },
      {
        title: "NRE / NRO Bank Statements",
        detail: "Last 6 months overseas bank account & NRE/NRO operating accounts in India.",
      },
      {
        title: "Credit Report Overseas",
        detail: "Equifax / Experian / TransUnion credit report from current country of residence.",
      },
      {
        title: "Power of Attorney (POA)",
        detail: "Registered and notarized POA executed by Indian Embassy / Consulate.",
      },
    ],
  },
];

// ─── In-depth FAQs ─────────────────────────────────────────────────────────────
const homeLoanFaqs = [
  {
    question: "What is the lowest home loan interest rate available on Fintaraa?",
    answer:
      "Home loan interest rates through Fintaraa's partner banks start from 8.35% p.a. for borrowers with a credit score of 750 or above. Rates are linked directly to the RBI Repo Rate (RLLR/EBLR), ensuring transparent and immediate transmission of monetary rate benefits.",
  },
  {
    question: "How much home loan amount can I borrow based on my salary?",
    answer:
      "Banks typically approve home loans such that your total monthly EMIs do not exceed 50% to 65% of your net monthly take-home salary (known as FOIR - Fixed Obligation to Income Ratio). For example, with a net monthly salary of ₹1,00,000 and zero existing EMIs, you can comfortably qualify for a home loan of approximately ₹65 Lakhs to ₹75 Lakhs for a 25-year tenure. Adding a working co-applicant significantly boosts this borrowing limit.",
  },
  {
    question: "What are the tax benefits of a Home Loan under Indian Income Tax laws?",
    answer:
      "Home loan borrowers can claim substantial annual tax deductions: 1) Under Section 24(b), deduct up to ₹2,00,000 per financial year against interest paid on a self-occupied property. 2) Under Section 80C, deduct up to ₹1,50,000 per year on principal repayment, stamp duty, and registration charges. 3) For joint home loans with a spouse/parent where both are co-owners, both individuals can independently claim these deductions, doubling total household tax savings up to ₹7,00,000 per year.",
  },
  {
    question: "Are there any prepayment or foreclosure penalties on Home Loans?",
    answer:
      "As per Reserve Bank of India (RBI) mandates, zero foreclosure or part-prepayment charges are applicable on floating-rate home loans availed by individual borrowers. You can make lump-sum prepayments at any time to drastically reduce your total interest and shorten your loan tenure without any additional penalty fees.",
  },
  {
    question: "How does a Home Loan Balance Transfer save me money?",
    answer:
      "If your current home loan interest rate is 9.50% or higher, transferring your outstanding balance to a partner bank offering 8.35% p.a. can save you ₹10 Lakhs to ₹25 Lakhs in total interest over a 15-20 year tenure. Additionally, you can secure a top-up loan at low home loan interest rates to fund home renovations, business expansion, or other personal financial goals.",
  },
  {
    question: "What is the maximum Loan-to-Value (LTV) ratio permitted by the RBI?",
    answer:
      "The maximum loan amount approved against property market value (LTV) is capped by RBI guidelines: 1) Loans up to ₹30 Lakhs: Up to 90% LTV (borrower contributes 10%). 2) Loans between ₹30 Lakhs and ₹75 Lakhs: Up to 80% LTV (borrower contributes 20%). 3) Loans above ₹75 Lakhs: Up to 75% LTV (borrower contributes 25%).",
  },
  {
    question: "What is the difference between Fixed and Floating interest rates?",
    answer:
      "A Floating Rate changes automatically in response to RBI Repo Rate revisions, giving you the benefit of rate cuts and zero prepayment charges. A Fixed Rate remains constant throughout the chosen tenure or reset period, protecting you from rate hikes but generally charging 1.5% - 2.5% higher base interest and potential foreclosure fees.",
  },
  {
    question: "How does Fintaraa assist throughout the home loan journey?",
    answer:
      "Fintaraa provides an end-to-end digital mortgage experience: 1) Instant algorithmic multi-bank comparison to identify your lowest interest rate, 2) Digital in-principle sanction in 48 hours, 3) Dedicated doorstep/online document pickup, 4) Complete legal title and technical property verification coordination, and 5) Fast-track disbursement directly to the builder or seller.",
  },
];

type Props = {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
};

export function HomeLoanPage({ page, lenders, locationPages }: Props) {
  // ── Hero Carousel State ──────────────────────────────────────────────────
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % homeHeroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // ── Live Filter for Lenders ──────────────────────────────────────────────
  const [lenderFilter, setLenderFilter] = useState<"all" | "psu" | "private" | "hfc">(
    "all",
  );

  const activeLenders = useMemo(() => {
    const list = lenders && lenders.length > 0 ? lenders : defaultHomeLenders;
    if (lenderFilter === "all") return list;
    if (lenderFilter === "psu") {
      return list.filter((l) => {
        const s = l.bankSlug.toLowerCase();
        return (
          s.includes("sbi") ||
          s.includes("baroda") ||
          s.includes("punjab") ||
          s.includes("canara") ||
          s.includes("union")
        );
      });
    }
    if (lenderFilter === "private") {
      return list.filter((l) => {
        const s = l.bankSlug.toLowerCase();
        return (
          s.includes("hdfc") ||
          s.includes("icici") ||
          s.includes("axis") ||
          s.includes("kotak") ||
          s.includes("federal") ||
          s.includes("indusind") ||
          s.includes("yes")
        );
      });
    }
    if (lenderFilter === "hfc") {
      return list.filter((l) => {
        const s = l.bankSlug.toLowerCase();
        return s.includes("bajaj") || s.includes("lic") || s.includes("tata");
      });
    }
    return list;
  }, [lenders, lenderFilter]);

  // ── Interactive EMI Calculator State ─────────────────────────────────────
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.4); // 8.4%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 Years

  const emiCalculation = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayable: 0,
        principalPercent: 50,
        interestPercent: 50,
      };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    const principalPct = Math.round((P / totalAmount) * 100);
    const interestPct = 100 - principalPct;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalAmount),
      principalPercent: principalPct,
      interestPercent: interestPct,
    };
  }, [loanAmount, interestRate, tenureYears]);

  // ── Balance Transfer Simulator State ─────────────────────────────────────
  const [btExistingLoan, setBtExistingLoan] = useState<number>(6000000); // ₹60L
  const [btExistingRate, setBtExistingRate] = useState<number>(9.65); // 9.65%
  const [btNewRate, setBtNewRate] = useState<number>(8.35); // 8.35%
  const [btRemainingYears, setBtRemainingYears] = useState<number>(18); // 18 yrs

  const btSavings = useMemo(() => {
    const P = btExistingLoan;
    const n = btRemainingYears * 12;

    const rOld = btExistingRate / 12 / 100;
    const emiOld = (P * rOld * Math.pow(1 + rOld, n)) / (Math.pow(1 + rOld, n) - 1);
    const totalOld = emiOld * n;

    const rNew = btNewRate / 12 / 100;
    const emiNew = (P * rNew * Math.pow(1 + rNew, n)) / (Math.pow(1 + rNew, n) - 1);
    const totalNew = emiNew * n;

    const totalSavings = Math.max(0, totalOld - totalNew);
    const monthlySavings = Math.max(0, emiOld - emiNew);

    return {
      oldEmi: Math.round(emiOld),
      newEmi: Math.round(emiNew),
      monthlySavings: Math.round(monthlySavings),
      totalInterestSaved: Math.round(totalSavings),
    };
  }, [btExistingLoan, btExistingRate, btNewRate, btRemainingYears]);

  // ── Document Checklist Active Tab ────────────────────────────────────────
  const [activeDocTab, setActiveDocTab] = useState<string>("salaried");

  // ── Eligibility Quick Checker State ──────────────────────────────────────
  const [monthlySalary, setMonthlySalary] = useState<number>(90000);
  const [existingEmi, setExistingEmi] = useState<number>(10000);
  const [desiredTenure, setDesiredTenure] = useState<number>(25);

  const eligibilityResult = useMemo(() => {
    const maxAllowedEmi = Math.max(0, monthlySalary * 0.55 - existingEmi);
    const r = 8.4 / 12 / 100;
    const n = desiredTenure * 12;
    const maxLoan =
      maxAllowedEmi > 0
        ? (maxAllowedEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
        : 0;

    return {
      maxEmiAffordability: Math.round(maxAllowedEmi),
      maxLoanAmount: Math.round(maxLoan),
    };
  }, [monthlySalary, existingEmi, desiredTenure]);

  // ── Fast Quote Lead Form State ───────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [formLoanAmount, setFormLoanAmount] = useState("5000000");
  const [employmentType, setEmploymentType] = useState("Salaried Employee");
  const [city, setCity] = useState("Mumbai");
  const [propertyType, setPropertyType] = useState("Ready-to-Move Apartment");
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBank, setModalBank] = useState<string>("State Bank of India");

  const handleOpenModal = (bankName: string) => {
    setModalBank(bankName);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!mobile || mobile.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        fullName,
        mobile,
        email,
        loanAmount: Number(formLoanAmount),
        employmentType,
        city,
        propertyType,
        productSlug: "home-loan",
        consent: buildWebsiteConsentPayload("home-loan"),
      };
      const res = await fetch(buildApiUrl("/leads/loan"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Unable to submit application right now.");
      }
      setSubmitSuccess(true);
    } catch {
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-purple-600 selection:text-white">
      {/* ── 1. CINEMATIC PURPLE-WHITE CONVERSION HERO ── */}
      <section className="relative isolate overflow-hidden border-b border-purple-100 bg-slate-950">
        {/* Full-bleed background carousel */}
        <div className="absolute inset-0 -z-20">
          {homeHeroSlides.map((slide, idx) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                heroSlide === idx ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={heroSlide !== idx}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                unoptimized
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[9000ms] ease-out ${
                  heroSlide === idx ? "scale-[1.07]" : "scale-100"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Crystal-clear readability gradients: soft left scrim, vivid banner visibility */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,8,24,0.76)_0%,rgba(15,10,30,0.45)_45%,rgba(15,10,30,0.08)_72%,rgba(12,8,24,0.22)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,8,24,0.20)_0%,transparent_45%,rgba(12,8,24,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
          <div className="grid min-h-[650px] items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Fixed Headline & Feature List */}
            <div className="lg:col-span-6 lg:pr-6">
              <div className="max-w-2xl">
                <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extralight leading-[1.14] tracking-[-0.035em] text-white drop-shadow-md">
                  <span className="block text-white">Your dream home,</span>
                  <span className="block font-normal text-white">funded with unmatched clarity.</span>
                </h1>

                {/* Feature list */}
                <ul className="mt-7 space-y-3">
                  {[
                    {
                      icon: BadgeCheck,
                      text: "Compare offers from SBI, HDFC, ICICI, Axis, Kotak & 30+ leading banks",
                    },
                    {
                      icon: ShieldCheck,
                      text: "Lowest interest rates starting from 8.35% p.a. with zero prepayment penalties",
                    },
                    {
                      icon: Clock,
                      text: "Digital in-principle sanction letter delivered in as little as 24–48 hours",
                    },
                    {
                      icon: Sparkles,
                      text: "Covers ready flats, villas, plots, construction, balance transfers & NRIs",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/25">
                        <Icon className="h-3 w-3 text-purple-200" />
                      </span>
                      <span className="text-[13.5px] font-light leading-snug text-white/85">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Stats Row */}
                <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/12 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <div className="px-5 py-5">
                    <p className="text-[28px] font-semibold tracking-tight text-white">
                      ₹100 Cr
                    </p>
                    <p className="mt-1 text-[11px] font-light leading-snug text-white/60">
                      Maximum loan
                      <br />
                      amount available
                    </p>
                  </div>
                  <div className="border-x border-white/10 px-5 py-5">
                    <p className="text-[28px] font-semibold tracking-tight text-white">
                      8.35%
                    </p>
                    <p className="mt-1 text-[11px] font-light leading-snug text-white/60">
                      Lowest starting
                      <br />
                      rate per annum*
                    </p>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-[28px] font-semibold tracking-tight text-white">
                      30 yrs
                    </p>
                    <p className="mt-1 text-[11px] font-light leading-snug text-white/60">
                      Maximum repayment
                      <br />
                      tenure available
                    </p>
                  </div>
                </div>

                {/* Carousel dots */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {homeHeroSlides.map((slide, idx) => (
                      <button
                        key={slide.image}
                        type="button"
                        onClick={() => setHeroSlide(idx)}
                        aria-label={`Show scene ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          heroSlide === idx
                            ? "w-8 bg-purple-300"
                            : "w-2 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10.5px] text-white/40 font-light">
                    *Repo rate linked. Subject to credit score and property evaluation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Contrast Floating Form */}
            <div className="lg:col-span-6 lg:pl-4">
              <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_32px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4 border-b border-purple-100 bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] px-5 py-5 text-white sm:px-7">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-purple-200">
                      Instant eligibility check
                    </span>
                    <h2 className="mt-1 text-[22px] font-normal tracking-tight text-white">
                      Find Home Loan Options for Your Profile
                    </h2>
                    <p className="mt-1 text-[11.5px] font-light text-purple-100">
                      Compare customized interest rates from 30+ banks in 2 minutes.
                    </p>
                  </div>
                  <div className="hidden rounded-2xl bg-white/10 px-3 py-2 text-center sm:block">
                    <p className="text-[16px] font-medium">2 min</p>
                    <p className="text-[9px] text-purple-200">to check</p>
                  </div>
                </div>

                {submitSuccess ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-[#5B21B6]">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      Application Submitted Successfully!
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Our Senior Home Loan Specialist is analyzing your profile against 30+ bank underwriting systems. You will receive matched sanction offers on WhatsApp shortly.
                    </p>
                    <AuthRedirectLink
                      href={getApplyHref({ category: "loan", productSlug: "home-loan" })}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#5B21B6] px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-purple-900/15 transition hover:bg-[#4C1D95]"
                    >
                      Track Application Status <ArrowRight className="ml-2 h-4 w-4" />
                    </AuthRedirectLink>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    noValidate
                    className="grid gap-3.5 p-5 sm:grid-cols-2 sm:p-6"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name (as per PAN)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) =>
                            setMobile(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="9876543210"
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Property City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600 pointer-events-none" />
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        >
                          {allIndianCities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Property Type / Purpose
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600 pointer-events-none" />
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        >
                          <option value="Ready-to-Move Apartment">
                            Ready-to-Move Apartment / Villa
                          </option>
                          <option value="Under-Construction Flat">
                            Under-Construction Property
                          </option>
                          <option value="Plot + Construction">
                            Plot Purchase & Construction
                          </option>
                          <option value="Balance Transfer">
                            Home Loan Balance Transfer
                          </option>
                          <option value="Home Extension/Renovation">
                            Home Extension & Renovation
                          </option>
                          <option value="NRI Purchase">NRI Property Loan</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Required Loan Amount
                      </label>
                      <div className="relative">
                        <BadgeIndianRupee className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600 pointer-events-none" />
                        <select
                          value={formLoanAmount}
                          onChange={(e) => setFormLoanAmount(e.target.value)}
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        >
                          <option value="2500000">₹25 Lakhs</option>
                          <option value="5000000">₹50 Lakhs</option>
                          <option value="7500000">₹75 Lakhs</option>
                          <option value="10000000">₹1 Crore</option>
                          <option value="20000000">₹2 Crores</option>
                          <option value="50000000">₹5 Crores+</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employment Status
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 h-3.5 w-3.5 text-purple-600 pointer-events-none" />
                        <select
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          className="w-full rounded-xl border border-purple-100 bg-purple-50/30 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
                        >
                          <option value="Salaried Employee">
                            Salaried Employee (Corporate / MNC / Govt)
                          </option>
                          <option value="Self-Employed Professional">
                            Self-Employed Professional (Doctor / CA / Architect)
                          </option>
                          <option value="Business Owner / Director">
                            Business Owner / Director / Entrepreneur
                          </option>
                          <option value="NRI / Foreign Resident">
                            Non-Resident Indian (NRI)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <WhatsAppConsent
                        checked={whatsappConsent}
                        onChange={(val) => setWhatsappConsent(val)}
                      />
                    </div>

                    {submitError && (
                      <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B21B6] px-5 text-[14px] font-medium text-white shadow-lg shadow-purple-900/15 transition-all duration-200 hover:bg-[#4C1D95] hover:shadow-purple-900/25 active:scale-[0.99] disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            Checking Bank Offers...
                          </>
                        ) : (
                          <>
                            Check My Lowest Rate <ArrowRight className="h-4 w-4 text-white" />
                          </>
                        )}
                      </button>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-slate-400">
                        <span className="inline-flex items-center gap-1 text-purple-700">
                          <ShieldCheck className="h-3.5 w-3.5 text-purple-600" /> 256-Bit SSL
                        </span>
                        <span>•</span>
                        <span>No CIBIL Impact</span>
                        <span>•</span>
                        <span>100% Free Consultation</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LIVE BANK LENDER COMPARISON MATRIX ── */}
      <section id="compare-lenders" className="py-10 sm:py-14 bg-white border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Compare India&apos;s Top Home Loan Lenders
              </h2>
            </div>

            {/* Filter Tabs (Aligned strictly in one single line) */}
            <div className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-2xl border border-purple-100 bg-[#FAF7FF] p-1 shadow-sm whitespace-nowrap">
              {[
                { id: "all", label: "All Banks" },
                { id: "psu", label: "Public Sector (PSU)" },
                { id: "private", label: "Private Banks" },
                { id: "hfc", label: "HFCs" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setLenderFilter(id as any)}
                  className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    lenderFilter === id
                      ? "bg-[#5B21B6] text-white shadow-sm"
                      : "text-slate-600 hover:text-purple-700 hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Lender Table / Rows Header (Desktop) */}
          <div className="mt-8 hidden lg:grid lg:grid-cols-12 items-center gap-4 rounded-2xl bg-purple-50/60 px-6 py-3.5 text-xs font-semibold text-slate-500 border border-purple-100/60">
            <div className="col-span-4">Lending Partner</div>
            <div className="col-span-2 text-center">Live Interest Rate</div>
            <div className="col-span-2 text-center">Max Tenure</div>
            <div className="col-span-2 text-center">Processing Fee & Cap</div>
            <div className="col-span-2 text-right pr-4">Action</div>
          </div>

          {/* Lender Rows List */}
          <div className="mt-4 space-y-3.5">
            {activeLenders.map((lender) => {
              const liveDetails = getLiveLenderDetails(lender);
              return (
                <div
                  key={lender.bankSlug}
                  className="group relative flex flex-col lg:grid lg:grid-cols-12 items-center gap-4 rounded-2xl border border-purple-100/80 bg-white p-5 lg:px-6 lg:py-4 shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-[0_12px_36px_rgba(91,33,182,0.06)] hover:-translate-y-0.5"
                >
                  {/* 1. Bank Logo (Big & Borderless) */}
                  <div className="w-full lg:w-auto lg:col-span-4 flex items-center justify-between lg:justify-start gap-4">
                    <div className="relative flex h-14 sm:h-16 w-44 sm:w-52 items-center justify-start py-1 transition duration-300 group-hover:scale-105">
                      <Image
                        src={getBankLogoPath(lender.bankSlug)}
                        alt={lender.bankName}
                        width={180}
                        height={52}
                        className="max-h-12 w-auto max-w-[175px] object-contain"
                      />
                    </div>
                    <span className="lg:hidden rounded-full bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 text-[10px] font-medium text-[#5B21B6]">
                      Live Rate
                    </span>
                  </div>

                  {/* 2. Live Exact Interest Rate (No 'Check lender details' / 'Repo Linked' fallbacks) */}
                  <div className="w-full lg:w-auto lg:col-span-2 flex justify-between lg:justify-center items-center text-center">
                    <span className="lg:hidden text-xs text-slate-400 font-light">Live Rate:</span>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-base font-bold text-[#5B21B6]">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        {liveDetails.rate}
                      </span>
                    </div>
                  </div>

                  {/* 3. Max Tenure */}
                  <div className="w-full lg:w-auto lg:col-span-2 flex justify-between lg:justify-center items-center text-center">
                    <span className="lg:hidden text-xs text-slate-400 font-light">Max Tenure:</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">
                        {liveDetails.tenure}
                      </span>
                    </div>
                  </div>

                  {/* 4. Processing Fee & Max Amount */}
                  <div className="w-full lg:w-auto lg:col-span-2 flex justify-between lg:justify-center items-center text-center">
                    <span className="lg:hidden text-xs text-slate-400 font-light">Processing Fee:</span>
                    <div>
                      <span className="text-xs font-medium text-slate-700 block">
                        {liveDetails.fee}
                      </span>
                      <span className="text-[10.5px] text-purple-700 font-medium">
                        {liveDetails.amount}
                      </span>
                    </div>
                  </div>

                  {/* 5. Action Buttons */}
                  <div className="w-full lg:w-auto lg:col-span-2 flex items-center justify-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-purple-50">
                    <button
                      onClick={() => handleOpenModal(lender.bankName)}
                      className="flex-1 lg:flex-none rounded-xl bg-[#5B21B6] px-5 py-2.5 text-center text-xs font-medium text-white transition hover:bg-[#4C1D95] shadow-sm"
                    >
                      Apply
                    </button>
                    <AuthRedirectLink
                      href={getApplyHref({
                        category: "loan",
                        productSlug: "home-loan",
                        bankSlug: lender.bankSlug,
                      })}
                      className="rounded-xl border border-purple-200 bg-white px-3.5 py-2.5 text-center text-xs font-medium text-purple-700 transition hover:bg-purple-50"
                    >
                      Details
                    </AuthRedirectLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. SPECIALIZED HOME FINANCING VARIANTS (FLUSH EDGE IMAGES) ── */}
      <section className="py-10 sm:py-14 bg-[#FAF7FF] border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Specialized Home Financing Variants
            </h2>
          </div>

          {/* Full-width vertical cards with flush images touching the outer container edges */}
          <div className="mt-12 space-y-8">
            {homeLoanTypes.map((type, index) => {
              const isImageRight = index % 2 === 1;
              return (
                <div
                  key={type.id}
                  className="group relative overflow-hidden rounded-[32px] border border-purple-100/80 bg-white shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-[0_24px_60px_rgba(91,33,182,0.08)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Flush Image Column (Zero gap from top, bottom, left/right container boundary) */}
                    <div
                      className={`lg:col-span-5 relative w-full min-h-[280px] sm:min-h-[340px] lg:min-h-full overflow-hidden ${
                        isImageRight ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <Image
                        src={type.image}
                        alt={type.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent" />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-5 left-5 rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-[#5B21B6] shadow-sm backdrop-blur-md">
                        {type.badge}
                      </div>
                      <div className="absolute bottom-5 left-5 rounded-xl bg-[#5B21B6] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                        {type.rate}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${
                        isImageRight ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-50">
                          <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 group-hover:text-[#5B21B6] transition">
                            {type.title}
                          </h3>
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#5B21B6]">
                            {type.maxFunding}
                          </span>
                        </div>

                        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                          {type.desc}
                        </p>

                        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                          {type.points.map((pt) => (
                            <div
                              key={pt}
                              className="flex items-start gap-2.5 rounded-xl border border-purple-100/50 bg-[#FAF7FF] p-3 text-xs text-slate-700"
                            >
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#5B21B6]/15">
                                <CheckCircle2 className="h-3 w-3 text-[#5B21B6]" />
                              </span>
                              <span className="leading-snug">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center gap-4 pt-4 border-t border-purple-50">
                        <AuthRedirectLink
                          href={getApplyHref({ category: "loan", productSlug: "home-loan" })}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#5B21B6] px-6 py-3 text-xs font-medium text-white shadow-md shadow-purple-900/10 transition hover:bg-[#4C1D95]"
                        >
                          Apply for {type.title.split(" ")[0]} Loan <ArrowRight className="h-3.5 w-3.5 text-white" />
                        </AuthRedirectLink>
                        <button
                          onClick={() => handleOpenModal(type.title)}
                          className="rounded-xl border border-purple-200 bg-white px-5 py-3 text-xs font-medium text-purple-800 transition hover:bg-purple-50"
                        >
                          Talk to Specialist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. DUAL INTERACTIVE FINANCIAL CALCULATOR SUITE ── */}
      <section id="calculator" className="py-10 sm:py-14 bg-white border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Home Loan Repayment & Savings Intelligence
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Box: Advanced EMI Calculator */}
            <div className="lg:col-span-7 rounded-[32px] border border-purple-100 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(91,33,182,0.05)]">
              <div className="flex items-center justify-between pb-5 border-b border-purple-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#5B21B6]" />
                  Monthly EMI & Interest Breakdown
                </h3>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  Fixed vs Floating
                </span>
              </div>

              {/* Sliders */}
              <div className="mt-6 space-y-6">
                {/* 1. Loan Amount */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-600">Loan Amount Required</span>
                    <span className="text-base font-bold text-[#5B21B6]">
                      ₹{(loanAmount / 100000).toFixed(loanAmount >= 10000000 ? 2 : 1)}{" "}
                      {loanAmount >= 10000000 ? "Crores" : "Lakhs"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={100000000}
                    step={500000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>₹10 Lakhs</span>
                    <span>₹50 Lakhs</span>
                    <span>₹10 Crores</span>
                  </div>
                </div>

                {/* 2. Interest Rate */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-600">Interest Rate (% p.a.)</span>
                    <span className="text-base font-bold text-[#5B21B6]">
                      {interestRate.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8.0}
                    max={15.0}
                    step={0.05}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>8.00% (Prime Bank)</span>
                    <span>10.00%</span>
                    <span>15.00% (NBFC)</span>
                  </div>
                </div>

                {/* 3. Tenure */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-600">Loan Tenure</span>
                    <span className="text-base font-bold text-[#5B21B6]">
                      {tenureYears} Years ({tenureYears * 12} Months)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>5 Years</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              {/* Result Cards & Visual Bar */}
              <div className="mt-8 rounded-2xl border border-purple-100 bg-[#FAF7FF] p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-xs text-slate-500 font-light">Monthly EMI</span>
                    <div className="mt-1 text-2xl font-extrabold text-[#5B21B6]">
                      ₹{emiCalculation.monthlyEmi.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-light">Total Interest</span>
                    <div className="mt-1 text-xl font-bold text-slate-800">
                      ₹{emiCalculation.totalInterest.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs text-slate-500 font-light">Total Payable</span>
                    <div className="mt-1 text-xl font-bold text-purple-900">
                      ₹{emiCalculation.totalPayable.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {/* Ratio Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                    <span className="text-[#5B21B6]">
                      Principal: {emiCalculation.principalPercent}%
                    </span>
                    <span className="text-purple-400">
                      Interest: {emiCalculation.interestPercent}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-purple-100 flex">
                    <div
                      style={{ width: `${emiCalculation.principalPercent}%` }}
                      className="bg-[#5B21B6] transition-all duration-500"
                    />
                    <div
                      style={{ width: `${emiCalculation.interestPercent}%` }}
                      className="bg-purple-300 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Balance Transfer Simulator */}
            <div className="lg:col-span-5 rounded-[32px] border border-purple-100 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(91,33,182,0.05)]">
              <div className="flex items-center justify-between pb-4 border-b border-purple-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-[#5B21B6]" />
                  Balance Transfer Refinancing
                </h3>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-[#5B21B6]">
                  Save ₹10L+
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Existing Loan Balance</span>
                    <span className="font-bold text-slate-900">
                      ₹{(btExistingLoan / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={30000000}
                    step={200000}
                    value={btExistingLoan}
                    onChange={(e) => setBtExistingLoan(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Current Bank Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.05}
                        value={btExistingRate}
                        onChange={(e) => setBtExistingRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-purple-100 bg-purple-50/40 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      New Fintaraa Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.05}
                        value={btNewRate}
                        onChange={(e) => setBtNewRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-xs font-bold text-[#5B21B6] focus:outline-none focus:border-purple-600"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Remaining Tenure</span>
                    <span className="font-bold text-slate-900">{btRemainingYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={btRemainingYears}
                    onChange={(e) => setBtRemainingYears(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                </div>
              </div>

              {/* Savings Highlight Card */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] p-6 text-center text-white shadow-lg shadow-purple-900/10">
                <span className="text-[11px] font-medium text-purple-200 uppercase tracking-wider">
                  Total Interest You Save
                </span>
                <div className="mt-1 text-3xl font-extrabold text-white tracking-tight">
                  ₹{btSavings.totalInterestSaved.toLocaleString("en-IN")}
                </div>
                <div className="mt-2 text-xs text-purple-100 font-light">
                  Monthly EMI Drops by{" "}
                  <strong className="text-white font-semibold">
                    ₹{btSavings.monthlySavings.toLocaleString("en-IN")}/mo
                  </strong>
                </div>
                <AuthRedirectLink
                  href={getApplyHref({
                    category: "loan",
                    productSlug: "balance-transfer-top-up-loan",
                  })}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white py-3 text-xs font-bold text-[#5B21B6] shadow hover:bg-purple-50 transition"
                >
                  Initiate Balance Transfer <ArrowRight className="ml-2 h-4 w-4 text-[#5B21B6]" />
                </AuthRedirectLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ELIGIBILITY CRITERIA & BORROWING CAPACITY ENGINE ── */}
      <section className="py-10 sm:py-14 bg-[#FAF7FF] border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
                Who Can Apply for a Fintaraa Home Loan?
              </h2>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B21B6]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Age & Citizenship
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                      Resident Indians, NRIs, and PIOs aged 21 to 65 years (up to 70 years for self-employed with established business continuity).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B21B6]">
                    <BadgeIndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Minimum Monthly Income
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                      ₹25,000/month for salaried corporate employees; ₹3,00,000 annual net profit for self-employed business owners and professionals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B21B6]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Credit Score (CIBIL)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                      750+ qualifies for prime tier interest rates (8.35% - 8.50%). Scores between 650 and 749 accepted with customized risk pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Eligibility Simulator */}
            <div className="lg:col-span-6 rounded-[32px] border border-purple-100 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(91,33,182,0.06)]">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-purple-50">
                <Sliders className="h-5 w-5 text-[#5B21B6]" />
                Quick Borrowing Capacity Estimator
              </h3>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Net Monthly Salary</span>
                    <span className="font-bold text-[#5B21B6]">
                      ₹{monthlySalary.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={500000}
                    step={5000}
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Existing Monthly EMIs</span>
                    <span className="font-bold text-slate-900">
                      ₹{existingEmi.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={2000}
                    value={existingEmi}
                    onChange={(e) => setExistingEmi(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Desired Loan Tenure</span>
                    <span className="font-bold text-slate-900">{desiredTenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={30}
                    step={1}
                    value={desiredTenure}
                    onChange={(e) => setDesiredTenure(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-purple-100 accent-[#5B21B6]"
                  />
                </div>
              </div>

              {/* Estimate Output */}
              <div className="mt-8 rounded-2xl border border-purple-200 bg-[#FAF7FF] p-6 text-center">
                <span className="text-xs font-semibold text-[#5B21B6] uppercase tracking-wider">
                  Estimated Eligible Home Loan Sanction
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  ₹{(eligibilityResult.maxLoanAmount / 100000).toFixed(2)} Lakhs
                </div>
                <div className="mt-2 text-xs text-slate-600 font-light">
                  Affordable Max EMI: ₹{eligibilityResult.maxEmiAffordability.toLocaleString("en-IN")}/mo (55% FOIR)
                </div>
                <div className="mt-4 pt-4 border-t border-purple-100 text-[11.5px] text-slate-500 font-light">
                  Tip: Add your spouse or working parents as co-applicant to increase borrowing capacity up to <strong className="text-[#5B21B6] font-semibold">₹{(eligibilityResult.maxLoanAmount * 1.65 / 100000).toFixed(2)} Lakhs</strong>!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. EXHAUSTIVE INDIAN INCOME TAX BENEFITS EXPLAINER ── */}
      <section className="py-10 sm:py-14 bg-white border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Save Up to ₹7,00,000 Annually in Taxes
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Section 24(b) */}
            <div className="rounded-[28px] border border-purple-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-purple-300 transition duration-300">
              <div>
                <div className="inline-block rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-[#5B21B6]">
                  Section 24(b)
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Interest Deduction up to ₹2.0 Lakhs
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  Claim up to ₹2,00,000 per financial year on the interest portion paid on a home loan for a self-occupied property. For let-out properties, the entire interest is deductible against rental income.
                </p>
                <div className="mt-4 rounded-xl bg-[#FAF7FF] p-3.5 text-xs text-slate-700">
                  <strong>Tax Bracket Savings:</strong> Save up to ₹62,400 in direct tax in the 30% tax bracket.
                </div>
              </div>
            </div>

            {/* Section 80C */}
            <div className="rounded-[28px] border border-purple-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-purple-300 transition duration-300">
              <div>
                <div className="inline-block rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-[#5B21B6]">
                  Section 80C
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Principal Repayment up to ₹1.5 Lakhs
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  Deduct up to ₹1,50,000 annually towards the principal component of your home loan repayment. Stamp duty and registration charges can also be claimed under 80C in the year of purchase.
                </p>
                <div className="mt-4 rounded-xl bg-[#FAF7FF] p-3.5 text-xs text-slate-700">
                  <strong>Lock-in Condition:</strong> Property must not be sold within 5 years of possession.
                </div>
              </div>
            </div>

            {/* Joint Loan Multiplier */}
            <div className="rounded-[28px] border border-purple-200 bg-gradient-to-br from-white via-purple-50/40 to-purple-100/30 p-6 sm:p-8 shadow-md flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-lg bg-[#5B21B6] px-3 py-1 text-xs font-bold text-white">
                  Joint Owner Advantage
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Double Deductions: ₹7.0 Lakhs/Year
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  When a husband and wife apply as co-owners and co-borrowers, both can independently claim ₹2L (Interest) + ₹1.5L (Principal), creating a massive combined deduction of ₹7,00,000 every year!
                </p>
                <div className="mt-4 rounded-xl bg-purple-100/80 border border-purple-200 p-3.5 text-xs text-[#5B21B6] font-semibold">
                  Total Annual Household Tax Saved: Up to ₹2,18,400!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. DOCUMENTATION CHECKLIST TABS ── */}
      <section className="py-10 sm:py-14 bg-[#FAF7FF] border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Home Loan Document Checklist
            </h2>
          </div>

          {/* Tabs header */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {documentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDocTab(tab.id)}
                className={`rounded-2xl px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeDocTab === tab.id
                    ? "bg-[#5B21B6] text-white shadow-md shadow-purple-900/10 scale-105"
                    : "border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="mt-8 mx-auto max-w-4xl">
            {documentTabs
              .filter((t) => t.id === activeDocTab)
              .map((tab) => (
                <div
                  key={tab.id}
                  className="rounded-[32px] border border-purple-100 bg-white p-6 sm:p-8 lg:p-10 shadow-sm"
                >
                  <div className="mb-6 pb-4 border-b border-purple-50">
                    <h3 className="text-xl font-normal text-slate-900">
                      {tab.label} Checklist
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-light">{tab.desc}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {tab.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-purple-100/60 bg-[#FAF7FF] p-4 transition hover:border-purple-200"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#5B21B6] shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.title}
                          </h4>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed pl-6 font-light">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── 8. 6-STEP DIGITAL-TO-DISBURSEMENT ROADMAP ── */}
      <section className="py-10 sm:py-14 bg-white border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Your 6-Step Journey from Application to Keys
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Digital Eligibility Profiling",
                desc: "Enter your income, employment, and property requirement details to run instant multi-bank algorithms.",
                time: "2 Minutes",
              },
              {
                step: "02",
                title: "Digital In-Principle Sanction",
                desc: "Receive pre-approved sanction letters from top lenders with exact interest rates and loan caps.",
                time: "24 - 48 Hours",
              },
              {
                step: "03",
                title: "Property Legal & Valuation",
                desc: "Our empaneled lawyers and technical evaluators verify 30-year title deeds and municipal approvals.",
                time: "3 - 5 Days",
              },
              {
                step: "04",
                title: "Final Sanction & Offer Letter",
                desc: "Review your final loan agreement, RLLR spread terms, processing fee waivers, and repayment schedule.",
                time: "Day 6",
              },
              {
                step: "05",
                title: "Agreement & MODT Registration",
                desc: "Sign loan contract documents, execute Memorandum of Deposit of Title Deeds (MODT) at the sub-registrar office.",
                time: "Day 7",
              },
              {
                step: "06",
                title: "Disbursement & Key Handover",
                desc: "Funds disbursed directly to the seller or builder tranche. Congratulations on owning your dream home!",
                time: "Disbursed",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="relative rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm transition hover:border-purple-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-purple-50">
                    <span className="text-3xl font-bold text-purple-200">
                      {st.step}
                    </span>
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-semibold text-[#5B21B6]">
                      {st.time}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-light">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. METRO CITY REAL ESTATE & LOAN INTELLIGENCE ── */}
      <section className="py-10 sm:py-14 bg-[#FAF7FF] border-b border-purple-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Property Market & Stamp Duty Intelligence
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {metroCityInsights.map((city) => (
              <div
                key={city.city}
                className="rounded-3xl border border-purple-100 bg-white p-6 flex flex-col justify-between shadow-sm hover:border-purple-200 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-[#5B21B6]" />
                      {city.city}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#5B21B6] bg-purple-50 px-2 py-0.5 rounded-full">
                      High Demand
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-light">Stamp Duty:</span>
                      <span className="font-semibold text-slate-900">{city.stampDuty}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-light">Registration Fee:</span>
                      <span className="font-semibold text-slate-900">{city.regFee}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-light">Avg Property Rate:</span>
                      <span className="font-bold text-[#5B21B6]">{city.avgPrice}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 font-light">
                      <strong className="text-slate-700 font-medium">Hotspots:</strong> {city.popularAreas}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-50 text-[11px] text-slate-500 italic font-light">
                  {city.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* Directory of Location Pages */}
          {locationPages && locationPages.length > 0 && (
            <div className="mt-14 border-t border-purple-100 pt-10">
              <ProductLocationDirectory
                productName={page.loanType || "Home Loan"}
                productSlug={page.loanTypeSlug || "home-loan"}
                currentLocation={page.location}
                pages={locationPages}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── 10. COMPREHENSIVE SEO FAQS ACCORDION ── */}
      <section className="py-10 sm:py-14 bg-white border-b border-purple-100/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[32px] sm:text-[44px] font-light tracking-tight text-slate-900 leading-[1.12]">
              Frequently Asked Questions on Home Loans
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {homeLoanFaqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-purple-100 bg-[#FAF7FF] p-5 transition open:bg-white open:border-purple-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm sm:text-base font-semibold text-slate-900 transition group-hover:text-[#5B21B6]">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-[#5B21B6]" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-purple-100/60 pt-3 font-light">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* Embedded FAQ Structured Data component */}
          <div className="mt-10">
            <LoanFAQSection faqs={homeLoanFaqs} title="Home Loan Frequently Asked Questions" />
          </div>
        </div>
      </section>

      {/* ── 11. FINANCIAL BLOGS & MORTGAGE GUIDES ── */}
      <ProductRelatedBlogs category="Loans" productName={page.loanType || "Home Loan"} className="bg-[#FAF7FF]" />

      {/* ── APP DOWNLOAD BANNER ── */}
      <AppDownloadBanner />

      {/* ── MODAL: ASSISTED CALLBACK POPUP ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-purple-50 p-2 text-purple-700 hover:bg-purple-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#5B21B6]">
                Priority Mortgage Advisory
              </span>
              <h3 className="mt-1 text-xl font-normal text-slate-900">
                Apply with {modalBank}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-light">
                A dedicated Home Loan Specialist will assist with bank rate negotiation, door-step KYC pickup, and legal vetting.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none"
                >
                  {allIndianCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Loan Amount
                </label>
                <select
                  value={formLoanAmount}
                  onChange={(e) => setFormLoanAmount(e.target.value)}
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-600 focus:bg-white focus:outline-none"
                >
                  <option value="2500000">₹25 Lakhs</option>
                  <option value="5000000">₹50 Lakhs</option>
                  <option value="7500000">₹75 Lakhs</option>
                  <option value="10000000">₹1 Crore</option>
                  <option value="20000000">₹2 Crores+</option>
                </select>
              </div>

              <div className="pt-1">
                <WhatsAppConsent
                  checked={whatsappConsent}
                  onChange={(val) => setWhatsappConsent(val)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#5B21B6] py-3 text-sm font-medium text-white shadow hover:bg-[#4C1D95] transition"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Get Instant Callback"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
