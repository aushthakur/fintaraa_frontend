"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  X,
  Bell,
  Mail,
  Menu,
  Search,
  Sparkles,
  UserRound,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Clock3,
  CreditCard,
  BriefcaseBusiness,
  FileText,
  Landmark,
  LayoutDashboard,
  LogOut,
  PencilLine,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import {
  clearAuthSession,
  getAuthToken,
  getAuthType,
} from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTypewriter } from "@/hooks/useTypewriter";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import {
  isLoanProduct,
  isInsuranceProduct,
  productHref,
} from "@/lib/productRouting";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import {
  insuranceProductCatalog,
  loanProductCatalog,
  type ProductCatalogItem,
} from "@/data/productCatalog";
import {
  fetchPartnerProfile,
  getCachedPartnerProfile,
  type PartnerProfile,
} from "@/services/partner";
import { LogoutConfirmationModal } from "@/components/account/LogoutConfirmationModal";
import { fetchNotificationStats } from "@/services/notifications";
import { CALL_PHONE } from "@/data/company";

type NavLink = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  badgeColor?: "purple" | "emerald" | "amber" | "blue" | "rose";
};

type NavSection = {
  title: string;
  subtitle?: string;
  links: NavLink[];
};

type NavPromo = {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  features?: string[];
};

type NavItem = NavLink & {
  sections?: NavSection[];
  highlightBadge?: string;
  promo?: NavPromo;
  assetSection?: NavSection;
};

const PRODUCT_INFO: Record<
  string,
  {
    badge?: string;
    badgeColor?: "purple" | "emerald" | "amber" | "blue" | "rose";
    description: string;
  }
> = {
  "personal-loan": {
    badge: "INSTANT",
    badgeColor: "purple",
    description: "Up to ₹40L • Instant in 5 mins",
  },
  "home-loan": {
    badge: "FROM 7.10%",
    badgeColor: "purple",
    description: "Up to ₹5 Cr • Lowest EMI",
  },
  "business-loan": {
    badge: "NO COLLATERAL",
    badgeColor: "amber",
    description: "Working capital up to ₹1 Cr",
  },
  "doctor-loan": {
    badge: "PRIORITY",
    badgeColor: "rose",
    description: "Tailored credit for clinics & doctors",
  },
  "ca-loan": {
    badge: "EXCLUSIVE",
    badgeColor: "purple",
    description: "Pre-approved limits for CAs",
  },
  "car-loan": {
    badge: "UP TO 100%",
    badgeColor: "emerald",
    description: "New vehicles with max funding",
  },
  "loan-against-property": {
    badge: "HIGH VALUE",
    badgeColor: "blue",
    description: "Unlock property equity value",
  },
  "balance-transfer-top-up-loan": {
    badge: "SAVE EMI",
    badgeColor: "emerald",
    description: "Lower interest rate & top-up cash",
  },
  "top-up-loan": {
    description: "Quick extra funds on existing loan",
  },
  "education-loan": {
    badge: "LOW RATE",
    badgeColor: "blue",
    description: "Studies in India & overseas",
  },
  "solar-loan": {
    badge: "SUBSIDY",
    badgeColor: "amber",
    description: "Rooftop solar financing & subsidy",
  },
  "agriculture-loan": {
    description: "Kisan credit & agri infrastructure",
  },
  "used-car-loan": {
    description: "Pre-owned car financing",
  },
  "vehicle-loan": {
    description: "Commercial fleets & heavy trucks",
  },
  "loan-against-car": {
    description: "Quick liquidity against registered car",
  },
  "loan-against-car-value": {
    description: "High LTV loan against car value",
  },
  "health-insurance": {
    badge: "CASHLESS",
    badgeColor: "emerald",
    description: "10,000+ cashless network hospitals",
  },
  "life-insurance": {
    badge: "UP TO ₹2 CR",
    badgeColor: "purple",
    description: "Guaranteed future for your family",
  },
  "term-insurance": {
    badge: "HIGH COVER",
    badgeColor: "blue",
    description: "Pure protection at lowest cost",
  },
  "group-insurance": {
    description: "Corporate team & employee health",
  },
  "personal-accident-insurance": {
    description: "Accident payout & disability support",
  },
  "critical-illness-insurance": {
    badge: "LUMP SUM",
    badgeColor: "rose",
    description: "32+ major critical illnesses covered",
  },
  "retirement-plan": {
    description: "Lifelong guaranteed monthly pension",
  },
  "car-insurance": {
    badge: "ZERO DEP",
    badgeColor: "emerald",
    description: "Instant policy with zero depreciation",
  },
  "bike-insurance": {
    badge: "INSTANT",
    badgeColor: "blue",
    description: "Two-wheeler comprehensive protection",
  },
  "vehicle-insurance": {
    description: "Commercial fleet & transport cover",
  },
  "travel-insurance": {
    badge: "GLOBAL",
    badgeColor: "purple",
    description: "Overseas trip & medical emergency",
  },
  "home-insurance": {
    description: "Protection against fire, theft & storm",
  },
  "property-insurance": {
    description: "Commercial premise & asset coverage",
  },
  "shop-insurance": {
    badge: "ALL-IN-ONE",
    badgeColor: "amber",
    description: "All-in-one shopkeeper & burglary cover",
  },
  "stock-insurance": {
    description: "Inventory, raw materials & goods",
  },
  "machinery-insurance": {
    description: "Plant breakdown & repair protection",
  },
};

const getProductInfo = (slug: string, name: string) => {
  if (PRODUCT_INFO[slug]) return PRODUCT_INFO[slug];
  const lower = name.toLowerCase();
  if (lower.includes("loan")) {
    return { description: "Fast disbursal & flexible EMI options" };
  }
  if (lower.includes("insurance")) {
    return { description: "Comprehensive cover & claims assistance" };
  }
  return { description: "Tailored financial solution" };
};

const productLinks = (products: ProductCatalogItem[]): NavLink[] =>
  products.map((product) => {
    const info = getProductInfo(product.slug, product.name);
    return {
      label: product.name,
      href: productHref(product.slug),
      description: info.description,
      badge: info.badge,
      badgeColor: info.badgeColor,
    };
  });

const groupedSection = (
  products: ProductCatalogItem[],
  group: string,
  title: string,
  subtitle: string,
): NavSection => ({
  title,
  subtitle,
  links: productLinks(products.filter((product) => product.group === group)),
});

const buildLoanSections = (): NavSection[] => [
  {
    title: "Personal & Education",
    subtitle: "Instant credit & education loans",
    links: [
      {
        label: "Personal Loan",
        href: "/products/personal-loan",
        description: "Up to ₹40L · Quick approval",
        badge: "POPULAR",
        badgeColor: "purple",
      },
      {
        label: "Instant Personal Loan",
        href: "/products/instant-loan",
        description: "Fast digital application & disbursal",
      },
      {
        label: "Education Loan",
        href: "/products/education-loan",
        description: "Study in India or overseas",
      },
      {
        label: "Renovation Loan",
        href: "/products/renovation-loan",
        description: "Finance your home improvements",
      },
      {
        label: "Wedding Loan",
        href: "/products/personal-loan",
        description: "Flexible finance for wedding expenses",
      },
      {
        label: "Medical Loan",
        href: "/products/personal-loan",
        description: "Finance planned medical expenses",
      },
    ],
  },
  {
    title: "Home & Property",
    subtitle: "Housing & asset-backed loans",
    links: [
      {
        label: "Home Loan",
        href: "/products/home-loan",
        description: "Competitive rates · Flexible tenure",
        badge: "FROM 7.10%",
        badgeColor: "purple",
      },
      {
        label: "Balance Transfer & Top-Up",
        href: "/products/balance-transfer-top-up-loan",
        description: "Reduce EMI or unlock additional funds",
        badge: "SAVE EMI",
        badgeColor: "emerald",
      },
      {
        label: "Loan Against Property",
        href: "/products/loan-against-property",
        description: "Unlock liquidity from your property",
        badge: "HIGH VALUE",
        badgeColor: "blue",
      },
      {
        label: "Construction Loan",
        href: "/products/construction-loan",
        description: "Finance residential construction",
      },
      {
        label: "Plot / Land Loan",
        href: "/products/home-loan",
        description: "Finance eligible plot purchases",
      },
      {
        label: "Commercial Property Loan",
        href: "/products/commercial-purchases-loan",
        description: "Finance commercial property needs",
      },
    ],
  },
  {
    title: "Business & Professional",
    subtitle: "Growth capital & commercial credit",
    links: [
      {
        label: "Business Loan",
        href: "/products/business-loan",
        description: "Growth capital for your business",
        badge: "NO COLLATERAL",
        badgeColor: "amber",
      },
      {
        label: "MSME Loan",
        href: "/products/business-loan",
        description: "Funding solutions for growing enterprises",
      },
      {
        label: "Working Capital Loan",
        href: "/products/working-capital-loan",
        description: "Manage day-to-day cash flow",
      },
      {
        label: "Machinery Loan",
        href: "/products/machinery-loan",
        description: "Finance equipment & machinery",
      },
      {
        label: "OD / Overdraft Loan",
        href: "/products/od-loan",
        description: "Flexible access to business funds",
      },
      {
        label: "DOD Loan",
        href: "/products/dod-loan",
        description: "Flexible business credit facility",
      },
      {
        label: "Agriculture Loan",
        href: "/products/agriculture-loan",
        description: "Finance farming & agri infrastructure",
      },
    ],
  },
  {
    title: "Vehicle Loans",
    subtitle: "Auto loans & vehicle finance",
    links: [
      {
        label: "Car Loan",
        href: "/products/car-loan",
        description: "Finance your new car",
        badge: "UP TO 100%",
        badgeColor: "emerald",
      },
      {
        label: "Used Car Loan",
        href: "/products/used-car-loan",
        description: "Finance a pre-owned car",
      },
      {
        label: "Two-Wheeler Loan",
        href: "/products/two-wheeler-loan",
        description: "Quick two-wheeler financing",
      },
      {
        label: "Commercial Vehicle Loan",
        href: "/products/vehicle-loan",
        description: "Finance commercial vehicles",
      },
      {
        label: "Loan Against Car",
        href: "/products/loan-against-car",
        description: "Unlock liquidity against your car",
      },
    ],
  },
];

const buildLoanAssetSection = (): NavSection => ({
  title: "Loans Against Assets",
  subtitle: "Liquidity backed by financial & physical assets",
  links: [
    {
      label: "Gold Loan",
      href: "/products/gold-loan",
      description: "Instant cash against gold",
    },
    {
      label: "Loan Against Securities",
      href: "/products/loan-against-security",
      description: "Shares, bonds & debentures",
    },
    {
      label: "Loan Against FD",
      href: "/products/loan-against-security",
      description: "Liquidity against fixed deposits",
    },
    {
      label: "Loan Against Mutual Funds",
      href: "/products/loan-against-security",
      description: "Digital loan against MF units",
    },
  ],
});

const buildInsuranceSections = (
  products: ProductCatalogItem[],
): NavSection[] => [
  groupedSection(
    products,
    "life-health",
    "Life & Health",
    "Protection for health, life & family",
  ),
  groupedSection(
    products,
    "motor",
    "Motor & Travel",
    "Cover for vehicles, trips & journeys",
  ),
  groupedSection(
    products,
    "property",
    "Property & Business",
    "Commercial, shop, stock & property cover",
  ),
];

const createNavItems = (
  loans: ProductCatalogItem[],
  insurance: ProductCatalogItem[],
): NavItem[] => [
  {
    label: "Loans",
    href: "/products?category=Loans",
    promo: {
      subtitle: "INDIA'S SMART LENDING HUB",
      title: "Loans Marketplace",
      description:
        "Compare offers from 50+ regulated banks & NBFCs with one application.",
      ctaText: "Explore All Loans",
      ctaHref: "/products?category=Loans",
      features: [
        "Zero impact on CIBIL score",
        "Competitive interest rates",
        "Quick eligibility check",
      ],
    },
    sections: buildLoanSections(),
    assetSection: buildLoanAssetSection(),
  },
  {
    label: "Credit Cards",
    href: "/credit-cards",
    promo: {
      title: "Credit Cards Hub",
      subtitle: "50+ Cards from Top Banks",
      description:
        "Find best cards for airport lounge access, accelerated rewards, dining perks, and lifetime zero fee.",
      ctaText: "Compare All Cards",
      ctaHref: "/credit-cards",
      features: [
        "Lifetime free card options",
        "Free airport lounge access",
        "Up to 5% direct cashback",
      ],
    },
    sections: [
      {
        title: "Popular Benefits",
        subtitle: "Cards matching your spending patterns",
        links: [
          {
            label: "Compare All Cards",
            href: "/credit-cards",
            description: "Browse 50+ cards by perks & fees",
            badge: "POPULAR",
            badgeColor: "purple",
          },
          {
            label: "Best Rewards Cards",
            href: "/credit-cards",
            description: "Accelerated reward points on shopping",
            badge: "HIGH REWARD",
            badgeColor: "emerald",
          },
          {
            label: "Cashback Cards",
            href: "/credit-cards",
            description: "Direct cash back on monthly bills",
            badge: "HIGH SAVINGS",
            badgeColor: "amber",
          },
          {
            label: "Travel & Lounge Cards",
            href: "/credit-cards",
            description: "Domestic & international lounge passes",
            badge: "LOUNGE PASS",
            badgeColor: "blue",
          },
          {
            label: "Fuel Surcharge Cards",
            href: "/credit-cards",
            description: "Save on petrol & diesel spends",
          },
        ],
      },
      {
        title: "Top Bank Cards",
        subtitle: "Official cards from premier lenders",
        links: [
          {
            label: "HDFC Credit Cards",
            href: "/banks/hdfc-bank/credit-card",
            description: "Millennia, Regalia & Diners cards",
            badge: "TOP RATED",
            badgeColor: "purple",
          },
          {
            label: "SBI Credit Cards",
            href: "/banks/sbi/credit-card",
            description: "Cashback, SimplyCLICK & PRIME",
            badge: "HIGH APPROVAL",
            badgeColor: "emerald",
          },
          {
            label: "ICICI Credit Cards",
            href: "/banks/icici-bank/credit-card",
            description: "Amazon Pay, Coral & Rubyx cards",
          },
        ],
      },
      {
        title: "Card Tools & Check",
        subtitle: "Instant checks before applying",
        links: [
          {
            label: "Check Card Eligibility",
            href: buildLoginRedirectHref({
              redirectTo: "/credit-cards",
              product: "credit-card",
            }),
            description: "Pre-qualified bank offers in 2 mins",
            badge: "INSTANT",
            badgeColor: "purple",
          },
          {
            label: "Free Credit Score",
            href: "/cibil-score",
            description: "Bureau check with zero score impact",
            badge: "FREE",
            badgeColor: "emerald",
          },
        ],
      },
    ],
  },
  {
    label: "Insurance",
    href: "/products?category=Insurance",
    promo: {
      title: "Insurance Shield",
      subtitle: "Complete Family Protection",
      description:
        "Compare quotes from India's leading insurers with 100% cashless claims, zero paperwork, and expert guidance.",
      ctaText: "Explore All Insurance",
      ctaHref: "/products?category=Insurance",
      features: [
        "10,000+ Cashless network hospitals",
        "Dedicated claims assistance desk",
        "Save up to ₹75,000 under 80D",
      ],
    },
    sections: buildInsuranceSections(insurance),
  },
  {
    label: "Services",
    href: "/itr-filing",
    promo: {
      title: "Business & Tax Desk",
      subtitle: "CA-Assisted Compliance",
      description:
        "Fast-track company registration, ITR filing, GST compliance, and bank-ready CMA project reports.",
      ctaText: "Explore Services",
      ctaHref: "/itr-filing",
      features: [
        "Qualified CA & legal team",
        "100% digital & paperless process",
        "Fast turnaround & status tracking",
      ],
    },
    sections: [
      {
        title: "Tax & Compliance",
        subtitle: "Assisted returns & corporate filings",
        links: [
          {
            label: "ITR Filing",
            href: "/itr-filing",
            description: "Assisted income tax return filing by CAs",
            badge: "ASSISTED",
            badgeColor: "purple",
          },
          {
            label: "Tax Compliance",
            href: "/tax-compliance",
            description: "Corporate tax planning, TDS & audit",
          },
          {
            label: "ROC Filing",
            href: "/roc-filing",
            description: "Company filings with Ministry of Corporate Affairs",
          },
          {
            label: "Annual Compliance",
            href: "/annual-compliance",
            description: "Year-round compliance package for businesses",
            badge: "POPULAR",
            badgeColor: "emerald",
          },
        ],
      },
      {
        title: "Business Registrations",
        subtitle: "Incorporate & register entities",
        links: [
          {
            label: "GST Registration",
            href: "/gst-registration",
            description: "New GSTIN registration & modifications",
            badge: "FAST TRACK",
            badgeColor: "blue",
          },
          {
            label: "Company Registration",
            href: "/company-registration",
            description: "Pvt Ltd, LLP, OPC & Partnership setup",
            badge: "POPULAR",
            badgeColor: "purple",
          },
          {
            label: "MSME Registration",
            href: "/msme-registration",
            description: "Udyam certificate for govt subsidies & loans",
            badge: "SUBSIDY",
            badgeColor: "amber",
          },
        ],
      },
      {
        title: "Financial Advisory",
        subtitle: "Bank reports & project planning",
        links: [
          {
            label: "Project Report",
            href: "/project-report",
            description: "Bank-ready loan project & CMA reports",
            badge: "BANK READY",
            badgeColor: "amber",
          },
          {
            label: "Check CIBIL Score",
            href: "/cibil-score",
            description: "Free authorized credit bureau report",
            badge: "FREE",
            badgeColor: "emerald",
          },
        ],
      },
    ],
  },
  {
    label: "Credit Score",
    href: "/cibil-score",
    highlightBadge: "Free",
  },
  {
    label: "Tools",
    href: "/tools",
    promo: {
      title: "Financial Toolkit",
      subtitle: "Calculators & Tracking",
      description:
        "Interactive calculators, loan affordability estimators, live tracking, and expert financial guides in one place.",
      ctaText: "Try All Tools",
      ctaHref: "/tools",
      features: [
        "Zero-cost interactive calculators",
        "Precise tenure & EMI forecasts",
        "Live application tracker",
      ],
    },
    sections: [
      {
        title: "Smart Calculators",
        subtitle: "Estimate monthly budget & payments",
        links: [
          {
            label: "EMI Calculator",
            href: "/tools#calculators",
            description: "Calculate monthly installments for any loan",
            badge: "POPULAR",
            badgeColor: "purple",
          },
          {
            label: "Home Loan Calculator",
            href: "/tools#calculators",
            description: "Plan tenure, interest & amortization",
          },
          {
            label: "Personal Loan Calculator",
            href: "/tools#calculators",
            description: "Estimate monthly budget for personal credit",
          },
          {
            label: "Eligibility Calculator",
            href: "/tools#calculators",
            description: "Check maximum loan amount you qualify for",
            badge: "SMART",
            badgeColor: "emerald",
          },
        ],
      },
      {
        title: "Tracking & Knowledge",
        subtitle: "Status tracking & smart guides",
        links: [
          {
            label: "Track Application",
            href: "/application-status",
            description: "Check live status of your submitted request",
            badge: "LIVE STATUS",
            badgeColor: "emerald",
          },
          {
            label: "Financial Blogs & Insights",
            href: "/blog",
            description: "Guides on loans, credit scores & tax savings",
            badge: "NEW",
            badgeColor: "purple",
          },
          {
            label: "Frequently Asked Questions",
            href: "/faqs",
            description: "Answers to common borrowing queries",
          },
          {
            label: "Media & Press",
            href: "/press-release",
            description: "Latest announcements & news coverage",
          },
        ],
      },
    ],
  },
  {
    label: "Partner",
    href: "/franchise",
    promo: {
      title: "Partner Ecosystem",
      subtitle: "Earn with Fintaraa",
      description:
        "Join 10,000+ active partners. Earn highest market commissions, access dedicated desk support, and scale faster.",
      ctaText: "Partner Login",
      ctaHref: "/partner/login",
      features: [
        "High payout commissions",
        "Real-time CRM & lead tracking",
        "Dedicated Relationship Manager",
      ],
    },
    sections: [
      {
        title: "Partner Programs",
        subtitle: "Grow your business & earnings",
        links: [
          {
            label: "Channel Partner Login",
            href: "/partner/login",
            description: "Login to manage partner profile & leads",
            badge: "PORTAL",
            badgeColor: "purple",
          },
          {
            label: "Become Partner / Franchise",
            href: "/franchise",
            description: "Start a branded partner or franchise journey",
            badge: "HIGH GROWTH",
            badgeColor: "emerald",
          },
          {
            label: "Become DSA",
            href: "/become-dsa",
            description: "Earn attractive commissions on loan files",
            badge: "HIGH PAYOUT",
            badgeColor: "amber",
          },
          {
            label: "Refer & Earn",
            href: "/refer-and-earn",
            description: "Refer users and track cash rewards",
            badge: "REWARDS",
            badgeColor: "rose",
          },
        ],
      },
      {
        title: "Company & Support",
        subtitle: "Connect with Fintaraa team",
        links: [
          {
            label: "About Us",
            href: "/about-us",
            description: "Our story, leadership & partner network",
          },
          {
            label: "Careers",
            href: "/careers",
            description: "Explore open roles and join our team",
          },
          {
            label: "Contact Us",
            href: "/contact-us",
            description: "Get in touch with our support team",
          },
        ],
      },
    ],
  },
];

const defaultNavItems = createNavItems(
  loanProductCatalog,
  insuranceProductCatalog,
);

type StaticSearchEntry = {
  label: string;
  href: string;
  category: string;
  keywords?: string[];
};

const productSearchEntries: StaticSearchEntry[] = loanProductCatalog.map(
  (product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
    category: "Loans",
    keywords: ["loan", "finance", "eligibility", product.name],
  }),
);

const insuranceSearchEntries: StaticSearchEntry[] = insuranceProductCatalog.map(
  (product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
    category: "Insurance",
    keywords: ["insurance", "cover", "policy", product.name],
  }),
);

const creditCardSearchEntries: StaticSearchEntry[] = [
  "Credit Cards",
  "Travel Cards",
  "Fuel Cards",
  "Cashback Cards",
  "Shopping Cards",
  "Premium Cards",
  "Rewards Cards",
  "Balance Transfer",
].map((label) => ({
  label,
  href: label === "Credit Cards" ? "/credit-cards" : "/credit-cards",
  category: "Credit Cards",
  keywords: ["card", "credit card", "rewards", "cashback", label],
}));

const serviceSearchEntries: StaticSearchEntry[] = [
  { label: "Credit Score", href: "/cibil-score", category: "Services" },
  { label: "Credit Report", href: "/cibil-score/report", category: "Services" },
  { label: "ITR Filing", href: "/itr-filing", category: "Services" },
  {
    label: "GST Registration",
    href: "/gst-registration",
    category: "Services",
  },
  {
    label: "Company Registration",
    href: "/company-registration",
    category: "Services",
  },
  {
    label: "MSME Registration",
    href: "/msme-registration",
    category: "Services",
  },
  {
    label: "Annual Compliance",
    href: "/annual-compliance",
    category: "Services",
  },
  {
    label: "ROC Filing",
    href: "/roc-filing",
    category: "Services",
  },
  {
    label: "Tax Compliances",
    href: "/tax-compliance",
    category: "Services",
  },
  {
    label: "Project Report",
    href: "/project-report",
    category: "Services",
  },
  { label: "Document Help", href: "/support", category: "Support" },
  { label: "Mobile App Support", href: "/support", category: "Support" },
  {
    label: "Application Status",
    href: "/application-status",
    category: "Account",
  },
  { label: "Products", href: "/products", category: "Explore" },
  { label: "Offers", href: "/offers", category: "Explore" },
  { label: "Knowledge Hub", href: "/knowledge-hub", category: "Explore" },
  { label: "Blog", href: "/blog", category: "Explore" },
  { label: "Contact Us", href: "/contact-us", category: "Support" },
  { label: "Support", href: "/support", category: "Support" },
  { label: "About Us", href: "/about-us", category: "Company" },
  {
    label: "Awards & Recognitions",
    href: "/awards-and-recognitions",
    category: "Company",
  },
  { label: "Careers", href: "/careers", category: "Company" },
  { label: "Press Release", href: "/press-release", category: "Company" },
  {
    label: "Channel Partner Login",
    href: "/partner/login",
    category: "Partner",
  },
  { label: "Partner Profile", href: "/partner/profile", category: "Partner" },
  { label: "Become Partner", href: "/franchise", category: "Partner" },
  { label: "Become DSA", href: "/become-dsa", category: "Partner" },
  { label: "Refer And Earn", href: "/refer-and-earn", category: "Partner" },
  { label: "Privacy Policy", href: "/privacy-policy", category: "Legal" },
  {
    label: "Terms And Conditions",
    href: "/terms-and-conditions",
    category: "Legal",
  },
  { label: "Loan Disclosure", href: "/loan-disclosure", category: "Legal" },
  { label: "Delete Account", href: "/delete-account", category: "Account" },
];

const navSearchEntries: StaticSearchEntry[] = (() => {
  const fromNav = defaultNavItems.flatMap((item) => [
    {
      label: item.label,
      href: item.href,
      category: "Navigation",
      keywords: [item.label],
    },
    ...(item.sections || []).flatMap((section) =>
      section.links.map((link) => ({
        label: link.label,
        href: link.href,
        category: section.title,
        keywords: [section.title, section.subtitle, link.description].filter(
          Boolean,
        ) as string[],
      })),
    ),
  ]);

  const deduped = new Map<string, StaticSearchEntry>();
  [
    ...productSearchEntries,
    ...insuranceSearchEntries,
    ...creditCardSearchEntries,
    ...serviceSearchEntries,
    ...fromNav,
  ].forEach((entry) => {
    const key = `${entry.label.toLowerCase()}::${entry.href}`;
    if (!deduped.has(key)) deduped.set(key, entry);
  });
  return Array.from(deduped.values());
})();

const popularSearchEntries = [
  "Personal Loan",
  "Credit Cards",
  "Health Insurance",
  "Credit Score",
  "Application Status",
  "Channel Partner Login",
]
  .map((label) => navSearchEntries.find((entry) => entry.label === label))
  .filter(Boolean) as StaticSearchEntry[];

const searchImageByLabel: Record<string, string> = {
  "Personal Loan": "/assets/product-cards/loans/personal-loan.webp",
  "Home Loan": "/assets/product-cards/loans/home-loan.webp",
  "Business Loan": "/assets/product-cards/loans/business-loan.webp",
  "Education Loan": "/assets/product-cards/loans/education-loan.webp",
  "Gold Loan": "/assets/product-cards/loans/gold-loan.webp",
  "Vehicle Loan": "/assets/product-cards/loans/vehicle-loan.webp",
  "Car Loan": "/assets/product-cards/loans/vehicle-loan.webp",
  "Loan Against Property":
    "/assets/product-cards/loans/loan-against-property.webp",
  "Health Insurance": "/assets/product-cards/insurance/health-insurance.webp",
  "Life Insurance": "/assets/product-cards/insurance/life-insurance.webp",
  "Term Insurance": "/assets/product-cards/insurance/term-insurance.webp",
  "Travel Insurance": "/assets/product-cards/insurance/travel-insurance.webp",
  "Property Insurance":
    "/assets/product-cards/insurance/property-insurance.webp",
  "Shop Insurance": "/assets/product-cards/insurance/shop-insurance.webp",
  "Credit Cards": "/assets/product-cards/credit-cards/rewards-cards.webp",
  "Travel Cards": "/assets/product-cards/credit-cards/travel-cards.webp",
  "Fuel Cards": "/assets/product-cards/credit-cards/fuel-cards.webp",
  "Cashback Cards": "/assets/product-cards/credit-cards/cashback-cards.webp",
  "Shopping Cards": "/assets/product-cards/credit-cards/shopping-cards.webp",
  "Rewards Cards": "/assets/product-cards/credit-cards/rewards-cards.webp",
  "Balance Transfer":
    "/assets/product-cards/credit-cards/balance-transfer.webp",
  "Credit Score": "/assets/services/cibil-score-service.png",
  "Credit Report": "/assets/services/cibil-score-service.png",
  "Application Status": "/assets/images/application-status.png",
  "Track Application": "/assets/images/application-status.png",
  "ITR Filing": "/assets/services/itr-hero.png",
  "GST Registration": "/assets/services/gst-hero.png",
  "Company Registration": "/assets/services/company-registration-service.png",
  "MSME Registration": "/assets/services/msme-registration-service.png",
  "Annual Compliance": "/assets/services/annual-compliance-service.png",
  "ROC Filing": "/assets/services/annual-compliance-service.png",
  "Tax Compliances": "/assets/services/tax-compliance-service.png",
  "Project Report": "/assets/services/project-report-service.png",
};

const topSearchProducts = ["Personal Loan", "Credit Cards", "Health Insurance"]
  .map((label) => navSearchEntries.find((entry) => entry.label === label))
  .filter(Boolean) as StaticSearchEntry[];

const accountAndServiceSearchEntries = [
  "Credit Score",
  "Application Status",
  "ITR Filing",
]
  .map((label) => navSearchEntries.find((entry) => entry.label === label))
  .filter(Boolean) as StaticSearchEntry[];

const getSearchIcon = (entry: StaticSearchEntry): LucideIcon => {
  const value = `${entry.label} ${entry.category}`.toLowerCase();
  if (value.includes("loan")) return Landmark;
  if (value.includes("card")) return CreditCard;
  if (value.includes("insurance") || value.includes("cibil")) {
    return ShieldCheck;
  }
  if (value.includes("status") || value.includes("account")) return Clock3;
  if (value.includes("offer")) return Sparkles;
  return FileText;
};

const subscribeToClient = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const searchNavEntries = (query: string) => {
  const normalized = normalizeSearchText(query);
  if (!normalized) return popularSearchEntries;
  const words = normalized.split(/\s+/).filter(Boolean);

  return navSearchEntries
    .map((entry) => {
      const haystack = normalizeSearchText(
        [
          entry.label,
          entry.category,
          entry.href,
          ...(entry.keywords || []),
        ].join(" "),
      );
      const label = normalizeSearchText(entry.label);
      const allWordsMatch = words.every((word) => haystack.includes(word));
      if (!allWordsMatch) return null;

      let score = 20;
      if (label === normalized) score += 120;
      if (label.startsWith(normalized)) score += 90;
      if (label.includes(normalized)) score += 55;
      if (normalizeSearchText(entry.category).includes(normalized)) score += 20;
      words.forEach((word) => {
        if (label.startsWith(word)) score += 8;
      });

      return { entry, score };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const left = a as { entry: StaticSearchEntry; score: number };
      const right = b as { entry: StaticSearchEntry; score: number };
      if (right.score !== left.score) return right.score - left.score;
      return left.entry.label.length - right.entry.label.length;
    })
    .slice(0, 8)
    .map((result) => (result as { entry: StaticSearchEntry }).entry);
};

const underlineClass =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#3b0764] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

const hrefPath = (href: string) => href.split("?")[0];

const stringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

type NavbarAuthProfile = {
  raw: unknown;
  name: string;
  avatar?: string;
  href: string;
};

const normalizePartnerNavProfile = (
  profile?: PartnerProfile | null,
): NavbarAuthProfile | null => {
  if (!profile) return null;
  const personal = profile.kycProfile?.personalDetails || {};
  const name =
    stringValue(personal.fullName) ||
    stringValue(profile.name) ||
    stringValue(profile.email) ||
    stringValue(profile.mobile) ||
    "Partner";
  const avatar =
    stringValue(profile.avatar) || stringValue(profile.profilePictureUrl);

  return {
    raw: profile,
    name,
    avatar,
    href: "/partner/profile",
  };
};

export default function Navbar() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { loans, insurance } = useProductCatalog();
  const navItems = useMemo(
    () => createNavItems(loans, insurance),
    [insurance, loans],
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpenLabel, setMobileOpenLabel] = useState<string | null>(null);
  const [mobileSubOpenTitle, setMobileSubOpenTitle] = useState<string | null>(
    null,
  );
  const closeMobileNavigation = () => {
    setMenuOpen(false);
    setMobileOpenLabel(null);
    setMobileSubOpenTitle(null);
  };
  const [partnerProfile, setPartnerProfile] =
    useState<NavbarAuthProfile | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const { profile } = useCurrentUser();
  const customerProfile: NavbarAuthProfile | null = profile.raw
    ? {
        raw: profile.raw,
        name: profile.name,
        avatar: profile.avatar,
        href: "/account/profile/edit-profile",
      }
    : null;
  const activeProfile = partnerProfile || customerProfile;
  const loggedIn = Boolean(activeProfile?.raw);
  const profileHref = activeProfile?.href || "/account/profile/edit-profile";
  const accountType = partnerProfile ? "partner" : "user";
  const notificationsHref = partnerProfile
    ? "/partner/profile/notifications"
    : "/account/profile/notifications";
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    let active = true;
    const loadUnreadCount = async () => {
      if (!loggedIn) {
        if (active) setUnreadNotifications(0);
        return;
      }
      try {
        const stats = await fetchNotificationStats(accountType);
        if (active) setUnreadNotifications(Number(stats.unread || 0));
      } catch {
        if (active) setUnreadNotifications(0);
      }
    };

    void loadUnreadCount();
    window.addEventListener("notifications:changed", loadUnreadCount);
    return () => {
      active = false;
      window.removeEventListener("notifications:changed", loadUnreadCount);
    };
  }, [accountType, loggedIn]);

  useEffect(() => {
    let active = true;
    let fetchedForToken = "";

    const refreshPartnerProfile = async (allowFetch: boolean) => {
      const isAgencySession = getAuthType() === "agency";
      const token = isAgencySession ? getAuthToken() : null;

      if (!token) {
        fetchedForToken = "";
        if (active) setPartnerProfile(null);
        return;
      }

      const cached = normalizePartnerNavProfile(getCachedPartnerProfile());
      if (active) {
        setPartnerProfile(
          cached || {
            raw: { role: "agency" },
            name: "Partner",
            href: "/partner/profile",
          },
        );
      }

      if (!allowFetch || fetchedForToken === token) return;
      fetchedForToken = token;

      try {
        const current = await fetchPartnerProfile();
        if (active) setPartnerProfile(normalizePartnerNavProfile(current));
      } catch {
        if (active && cached) setPartnerProfile(cached);
      }
    };

    void refreshPartnerProfile(true);

    const handleAuthChange = () => {
      void refreshPartnerProfile(false);
    };

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateHeaderHeight)
        : null;
    observer?.observe(header);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      observer?.disconnect();
    };
  }, []);

  const isHomePage = pathname === "/";
  const [heroInView, setHeroInView] = useState(isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setHeroInView(false);
      return;
    }

    const checkHeroVisibility = () => {
      const hero = document.getElementById("hero-section");
      if (!hero) {
        setHeroInView(window.scrollY < 380);
        return;
      }
      const rect = hero.getBoundingClientRect();
      setHeroInView(rect.bottom > 90 && rect.top < window.innerHeight);
    };

    checkHeroVisibility();

    window.addEventListener("scroll", checkHeroVisibility, { passive: true });
    window.addEventListener("resize", checkHeroVisibility, { passive: true });

    let observer: IntersectionObserver | null = null;
    const hero = document.getElementById("hero-section");
    if (hero && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          const rect = entry.boundingClientRect;
          setHeroInView(rect.bottom > 90 && rect.top < window.innerHeight);
        },
        { rootMargin: "-80px 0px 0px 0px", threshold: [0, 0.1, 0.5] },
      );
      observer.observe(hero);
    }

    return () => {
      window.removeEventListener("scroll", checkHeroVisibility);
      window.removeEventListener("resize", checkHeroVisibility);
      observer?.disconnect();
    };
  }, [isHomePage, pathname]);

  const hideNavbarSearch = isHomePage && heroInView;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 overflow-x-clip border-b border-[#e5eef8] bg-white/95 backdrop-blur"
    >
      <div className="bg-[#4c1d95] px-3 text-white min-[380px]:px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex min-h-8.5 max-w-[92rem] items-center justify-between gap-2 py-1.5 text-[9px] font-medium min-[360px]:text-[10px] sm:gap-3 sm:py-2 sm:text-[11.5px]">
          <div className="flex min-w-0 items-center gap-1.5 leading-4 sm:gap-2">
            <a
              href={CALL_PHONE.href}
              aria-label={`Call customer care at ${CALL_PHONE.display}`}
              className="flex items-center gap-1 whitespace-nowrap text-white/95 no-underline transition hover:text-white sm:hidden"
            >
              <PhoneCall className="h-3.5 w-3.5 shrink-0 text-[#c4b5fd]" />
              <span>{CALL_PHONE.national}</span>
            </a>
            <ShieldCheck className="hidden h-4 w-4 shrink-0 text-[#c4b5fd] sm:block" />
            <span className="hidden text-purple-100 sm:inline">
              Compare offers from regulated banks, NBFCs and insurers with
              secure assisted applications.
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href="mailto:customercare@fintaraa.com"
              className="flex items-center gap-1 text-purple-100 no-underline transition hover:text-white sm:gap-1.5"
            >
              <Mail className="h-3 w-3 shrink-0 text-[#c4b5fd] sm:h-3.5 sm:w-3.5" />
              <span className="min-[380px]:hidden">Support</span>
              <span className="hidden min-[380px]:inline">
                customercare@fintaraa.com
              </span>
            </a>
            <span className="hidden items-center gap-1.5 text-purple-200/90 lg:flex">
              <Clock3 className="h-3.5 w-3.5 text-[#c4b5fd]" />
              Mon–Sat, 10:00 AM–7:00 PM
            </span>
          </div>
        </div>
      </div>

      <nav
        aria-busy={!hydrated}
        data-hydrated={hydrated ? "true" : "false"}
        className={`mobile-site-nav mx-auto flex h-16 w-full max-w-[92rem] items-center justify-between gap-1.5 px-3 sm:px-6 2xl:px-8 ${
          hydrated ? "" : "pointer-events-none"
        }`}
      >
        <Link
          href="/"
          aria-label="Fintaraa home"
          onClick={closeMobileNavigation}
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <Image
            priority
            width={877}
            height={271}
            alt="Fintaraa"
            className="h-auto w-[132px] min-[360px]:w-[146px] sm:w-[162px] xl:w-[178px]"
            src="/assets/logo/fintaraa-brand-logo.png"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex min-[1340px]:gap-2 min-[1440px]:gap-3 min-[1560px]:gap-4 px-2">
          {navItems.map((item, index) => (
            <DesktopNavItem
              key={`${item.label}:${pathname}`}
              align={index >= navItems.length - 2 ? "right" : "left"}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex min-[1380px]:gap-2.5 2xl:gap-3">
          <div
            className={`transition-all duration-300 ease-in-out ${
              hideNavbarSearch
                ? "max-w-0 opacity-0 pointer-events-none -translate-x-2 overflow-hidden"
                : "max-w-[200px] min-[1380px]:max-w-[240px] 2xl:max-w-[280px] opacity-100 translate-x-0"
            }`}
          >
            <NavbarSearch />
          </div>

          <Link
            href={
              loggedIn
                ? notificationsHref
                : buildLoginRedirectHref({
                    redirectTo: "/account/profile/notifications",
                  })
            }
            aria-label="Notifications"
            className="relative inline-flex h-9.5 w-9.5 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100 text-slate-700 no-underline transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#4c1d95] min-[1380px]:h-10 min-[1380px]:w-10 2xl:h-10.5 2xl:w-10.5"
          >
            <Bell className="h-4 w-4 min-[1380px]:h-4.5 min-[1380px]:w-4.5" />
            {unreadNotifications ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f04438] px-1 text-[8.5px] font-extrabold leading-none text-white ring-2 ring-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            ) : null}
          </Link>

          <AuthButton
            loggedIn={loggedIn}
            name={activeProfile?.name || "User"}
            avatar={activeProfile?.avatar}
            href={profileHref}
            accountType={accountType}
          />
        </div>

        <div className="ml-auto flex items-center gap-0.5 min-[360px]:gap-1 xl:hidden">
          <div
            className={`transition-all duration-300 ease-in-out ${
              hideNavbarSearch
                ? "max-w-0 opacity-0 pointer-events-none overflow-hidden"
                : "max-w-[44px] opacity-100"
            }`}
          >
            <NavbarSearch compact onOpen={closeMobileNavigation} />
          </div>
          <Link
            href={
              loggedIn
                ? notificationsHref
                : buildLoginRedirectHref({
                    redirectTo: "/account/profile/notifications",
                  })
            }
            aria-label="Notifications"
            onClick={closeMobileNavigation}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center text-[#344054] no-underline transition active:bg-[#eaf2fb] active:text-[#5b21b6] min-[360px]:h-10 min-[360px]:w-10"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {unreadNotifications ? (
              <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f04438] px-1 text-[8px] font-extrabold leading-none text-white ring-2 ring-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            ) : null}
          </Link>
          <Link
            href={loggedIn ? profileHref : "/login"}
            aria-label={loggedIn ? "Open account" : "Login"}
            onClick={closeMobileNavigation}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-md border border-[#5b21b6] px-1.5 text-[10px] font-bold text-[#5b21b6] no-underline transition active:bg-[#eef5ff] min-[360px]:h-10 min-[360px]:px-2 min-[360px]:text-[11px]"
          >
            <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loggedIn ? "Account" : "Login"}</span>
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f7fb] text-[#101828] transition active:bg-[#eaf2fb] min-[360px]:h-10 min-[360px]:w-10"
            onClick={() => {
              if (menuOpen) {
                closeMobileNavigation();
              } else {
                setMenuOpen(true);
              }
            }}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-var(--site-header-height,6rem))] overflow-y-auto overscroll-contain border-t border-[#dce8f2] bg-[#f4f8fc] px-3 py-3 shadow-[0_24px_45px_rgba(7,22,45,0.18)] min-[380px]:px-4 md:px-6 xl:hidden">
          <div className="mx-auto grid max-w-9xl gap-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#718397]">
                Explore Fintaraa
              </p>
              <p className="text-[10px] font-semibold text-[#8a99a8]">
                Tap a section to expand
              </p>
            </div>
            {navItems.map((item) => {
              const hideDescriptions =
                item.label === "Loans" || item.label === "Insurance";
              const sectionOpen = mobileOpenLabel === item.label;

              return (
                <div
                  key={item.label}
                  className={`overflow-hidden rounded-xl border bg-white transition-shadow ${
                    sectionOpen
                      ? "border-[#bdd8ee] shadow-[0_10px_28px_rgba(25,85,133,0.1)]"
                      : "border-[#e0eaf2]"
                  }`}
                >
                  {item.sections?.length ? (
                    <button
                      type="button"
                      aria-expanded={sectionOpen}
                      aria-controls={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => {
                        setMobileOpenLabel((current) =>
                          current === item.label ? null : item.label,
                        );
                        setMobileSubOpenTitle(null);
                      }}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[13px] font-bold transition min-[380px]:px-3.5 ${
                        sectionOpen
                          ? "bg-[#eef7ff] text-[#5b21b6]"
                          : "text-[#3b0764] active:bg-[#f4f8fc]"
                      }`}
                    >
                      {item.label}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf4fa] text-[#526b80]">
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${sectionOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileNavigation}
                      className="flex min-h-11 items-center justify-between px-3 py-2.5 text-[13px] font-bold text-[#3b0764] no-underline transition active:bg-[#f4f8fc] active:text-[#5b21b6] min-[380px]:px-3.5"
                    >
                      {item.label}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#9aabba]" />
                    </Link>
                  )}
                  {item.sections?.length && sectionOpen ? (
                    <div
                      id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="border-t border-[#dce8f2] bg-[#f8fbfe] p-2.5 min-[380px]:p-3"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileNavigation}
                        className="mb-2.5 flex min-h-10 w-full items-center justify-between rounded-lg bg-[linear-gradient(135deg,#3b0764,#6d28d9)] px-3 text-[12px] font-bold text-white no-underline shadow-[0_8px_20px_rgba(25,85,133,0.16)]"
                      >
                        Explore all {item.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <div className="grid gap-2">
                        {[
                          ...item.sections,
                          ...(item.assetSection ? [item.assetSection] : []),
                        ].map((section) => {
                          const isSubOpen =
                            mobileSubOpenTitle === section.title;
                          return (
                            <div
                              key={section.title}
                              className="overflow-hidden rounded-xl border border-[#e0eaf2] bg-white transition-shadow duration-150"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setMobileSubOpenTitle(
                                    isSubOpen ? null : section.title,
                                  )
                                }
                                aria-expanded={isSubOpen}
                                className="flex min-h-10 w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-slate-50"
                              >
                                <div>
                                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3b0764]">
                                    {section.title}
                                  </p>
                                  {section.subtitle ? (
                                    <p className="text-[9.5px] text-slate-400">
                                      {section.subtitle}
                                    </p>
                                  ) : null}
                                </div>
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf4fa] text-[#526b80]">
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                      isSubOpen
                                        ? "rotate-180 text-[#5b21b6]"
                                        : ""
                                    }`}
                                  />
                                </span>
                              </button>
                              {isSubOpen ? (
                                <div className="border-t border-slate-100 bg-[#fbfcfe] p-2 grid gap-1 min-[420px]:grid-cols-2">
                                  {section.links.map((link) => (
                                    <Link
                                      key={`${section.title}-${link.href}-${link.label}`}
                                      href={link.href}
                                      onClick={closeMobileNavigation}
                                      className="flex flex-col justify-center rounded-lg border border-slate-100/90 bg-white p-2 text-slate-800 no-underline transition active:bg-purple-50 hover:bg-purple-50/50"
                                    >
                                      <div className="flex items-start justify-between gap-1.5 min-w-0">
                                        <span className="truncate text-[12px] font-bold text-slate-900">
                                          {link.label}
                                        </span>
                                        {link.badge ? (
                                          <span className="shrink-0 whitespace-nowrap rounded bg-purple-100 px-1.5 py-0.5 text-[7.5px] font-extrabold uppercase text-[#4c1d95]">
                                            {link.badge}
                                          </span>
                                        ) : null}
                                      </div>
                                      {link.description ? (
                                        <span className="mt-0.5 line-clamp-1 text-[9.5px] font-medium text-slate-500">
                                          {link.description}
                                        </span>
                                      ) : null}
                                    </Link>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="mt-1 grid gap-3 pb-2">
              <AuthButton
                loggedIn={loggedIn}
                name={activeProfile?.name || "User"}
                avatar={activeProfile?.avatar}
                href={profileHref}
                accountType={accountType}
                mobile
                onClick={closeMobileNavigation}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavbarSearch({
  mobile = false,
  compact = false,
  onNavigate,
  onOpen,
}: {
  mobile?: boolean;
  compact?: boolean;
  onNavigate?: () => void;
  onOpen?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const typingPlaceholder = useTypewriter();
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const trimmedQuery = query.trim();
  const results = useMemo(() => searchNavEntries(query), [query]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const openSearch = () => {
    onOpen?.();
    setOpen(true);
  };

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  const navigateTo = (href: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = results[0] || { href: "/products" };
    navigateTo(target.href);
  };

  const searchPanel = (
    <AnimatePresence>
      {open ? (
        <MotionConfig reducedMotion="user">
          <>
            <motion.button
              type="button"
              aria-label="Close site search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="fixed inset-x-0 bottom-0 z-70 bg-[#082b4c]/20 backdrop-blur-[2px]"
              style={{ top: "var(--site-header-height, 6rem)" }}
            />
            <motion.section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search Fintaraa"
              initial={{ opacity: 0.96, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none fixed inset-x-0 z-80 px-2 sm:px-4"
              style={{
                top: "var(--site-header-height, 6rem)",
                maxHeight: "calc(100dvh - var(--site-header-height, 6rem))",
              }}
            >
              <div className="pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-var(--site-header-height,6rem)-1rem)] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#d9e5ee] bg-white p-4 shadow-[0_24px_70px_rgba(15,47,73,0.22)] sm:p-5 lg:w-3/5 lg:min-w-200">
                <div className="flex items-center gap-2.5">
                  <form
                    onSubmit={handleSubmit}
                    className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#a9c5d8] bg-[#f8fbfd] px-3 transition focus-within:border-[#5b21b6] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#5b21b6]/10 sm:px-4"
                  >
                    <Search
                      className="h-4.5 w-4.5 shrink-0 text-[#315c79]"
                      aria-hidden="true"
                    />
                    <input
                      ref={inputRef}
                      value={query}
                      type="text"
                      inputMode="search"
                      aria-label="Search loans, cards, insurance and services"
                      placeholder={typingPlaceholder || "Search loans, cards, insurance or services"}
                      onChange={(event) => setQuery(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#3b0764] outline-none placeholder:font-medium placeholder:text-[#8da0af] sm:text-[14px]"
                    />
                    {trimmedQuery ? (
                      <button
                        type="button"
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => setQuery("")}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#7890a2] transition hover:bg-[#e9f3fa] hover:text-[#5b21b6]"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      aria-label="Open first search result"
                      title="Search"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5b21b6] text-white transition hover:bg-[#4c1d95]"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    title="Close search"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4e2eb] text-[#527189] transition hover:border-[#8ebbd3] hover:bg-[#f4f9fc] hover:text-[#5b21b6]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.8fr)]">
                  <div className="min-w-0">
                    {!trimmedQuery ? (
                      <>
                        <section aria-labelledby="most-searched-title">
                          <h2
                            id="most-searched-title"
                            className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#193a54]"
                          >
                            Most searched
                          </h2>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {popularSearchEntries.map((item) => (
                              <button
                                key={`${item.label}-${item.href}`}
                                type="button"
                                onClick={() => navigateTo(item.href)}
                                className="rounded-full bg-[#f0f4f7] px-3 py-1.5 text-[11px] font-semibold text-[#52697b] transition hover:bg-[#e4f0fa] hover:text-[#5b21b6]"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </section>

                        <section
                          aria-labelledby="top-products-title"
                          className="mt-5"
                        >
                          <h2
                            id="top-products-title"
                            className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#193a54]"
                          >
                            Top products
                          </h2>
                          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                            {topSearchProducts.map((item) => (
                              <button
                                key={`${item.label}-${item.href}`}
                                type="button"
                                onClick={() => navigateTo(item.href)}
                                className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e4ebf0] bg-[#fbfcfd] p-2.5 text-left transition hover:border-[#a9cce2] hover:bg-[#f5faff]"
                              >
                                <Image
                                  src={searchImageByLabel[item.label]}
                                  alt=""
                                  width={48}
                                  height={48}
                                  className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                />
                                <span className="min-w-0">
                                  <span className="block text-[11px] font-bold leading-4 text-[#17334a] group-hover:text-[#5b21b6]">
                                    {item.label}
                                  </span>
                                  <span className="mt-0.5 block text-[10px] font-bold text-[#e04747]">
                                    Apply Now
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>

                        <section
                          aria-labelledby="services-search-title"
                          className="mt-5"
                        >
                          <h2
                            id="services-search-title"
                            className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#193a54]"
                          >
                            Accounts &amp; services
                          </h2>
                          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                            {accountAndServiceSearchEntries.map((item) => (
                              <button
                                key={`${item.label}-${item.href}`}
                                type="button"
                                onClick={() => navigateTo(item.href)}
                                className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e4ebf0] bg-[#fbfcfd] p-2.5 text-left transition hover:border-[#a9cce2] hover:bg-[#f5faff]"
                              >
                                <Image
                                  src={searchImageByLabel[item.label]}
                                  alt=""
                                  width={48}
                                  height={48}
                                  className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                />
                                <span className="min-w-0">
                                  <span className="block text-[11px] font-bold leading-4 text-[#17334a] group-hover:text-[#5b21b6]">
                                    {item.label}
                                  </span>
                                  <span className="mt-0.5 block text-[10px] font-bold text-[#e04747]">
                                    Explore
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>
                      </>
                    ) : (
                      <section aria-labelledby="search-results-title">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <h2
                              id="search-results-title"
                              className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#193a54]"
                            >
                              Search results
                            </h2>
                            <p className="mt-1 text-[11px] font-medium text-[#7890a2]">
                              Best matches for “{trimmedQuery}”
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[#e8f3fb] px-2.5 py-1 text-[10px] font-bold text-[#5b21b6]">
                            {results.length} found
                          </span>
                        </div>

                        {results.length ? (
                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            {results.map((item) => {
                              const Icon = getSearchIcon(item);
                              const itemImage = searchImageByLabel[item.label];
                              return (
                                <button
                                  key={`${item.label}-${item.href}`}
                                  type="button"
                                  onClick={() => navigateTo(item.href)}
                                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e1eaf0] bg-[#fbfcfd] p-2.5 text-left transition hover:border-[#9ec5dd] hover:bg-[#f4f9fc]"
                                >
                                  {itemImage ? (
                                    <Image
                                      src={itemImage}
                                      alt=""
                                      width={48}
                                      height={48}
                                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e9f3fa] text-[#5b21b6]">
                                      <Icon
                                        className="h-4.5 w-4.5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[11px] font-bold text-[#17334a] group-hover:text-[#5b21b6]">
                                      {item.label}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#7890a2]">
                                      {item.category}
                                    </span>
                                  </span>
                                  <ArrowRight
                                    className="h-3.5 w-3.5 shrink-0 text-[#9aaeba] transition-transform group-hover:translate-x-0.5 group-hover:text-[#5b21b6]"
                                    aria-hidden="true"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-3 flex min-h-32 items-center gap-3 rounded-xl border border-dashed border-[#ccdce7] bg-[#f8fbfd] p-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f3fa] text-[#7890a2]">
                              <Search className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                              <p className="text-[12px] font-bold text-[#3b0764]">
                                No matching destination
                              </p>
                              <p className="mt-1 text-[10px] font-medium text-[#7890a2]">
                                Try a loan, card, insurance or service name.
                              </p>
                            </div>
                          </div>
                        )}
                      </section>
                    )}
                  </div>

                  <aside aria-labelledby="discover-title" className="min-w-0">
                    <h2
                      id="discover-title"
                      className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#193a54]"
                    >
                      Discover
                    </h2>
                    <div className="mt-2.5 overflow-hidden rounded-2xl border border-[#dfe8ee] bg-white shadow-[0_10px_30px_rgba(15,47,73,0.08)]">
                      <Image
                        src="/assets/home/hero-banners/financial-advisor-family.png"
                        alt="A family planning its finances"
                        width={500}
                        height={280}
                        className="h-32 w-full object-cover sm:h-40 lg:h-36"
                      />
                      <div className="p-4">
                        <p className="text-[14px] font-extrabold leading-5 text-[#17334a]">
                          Find the right financial product for every goal
                        </p>
                        <p className="mt-1.5 text-[10px] font-medium leading-4 text-[#6f8798]">
                          Compare trusted options with clear guidance from
                          Fintaraa.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigateTo("/products")}
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#5b21b6] px-3.5 py-2 text-[10px] font-bold text-[#5b21b6] transition hover:bg-[#5b21b6] hover:text-white"
                        >
                          Explore Products
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.section>
          </>
        </MotionConfig>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={compact ? "Open site search" : undefined}
        className={`flex items-center transition-all duration-150 ${
          compact
            ? "h-9 w-9 justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#4c1d95] min-[360px]:h-10 min-[360px]:w-10"
            : mobile
              ? "h-11 w-full gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-[13px] font-medium text-slate-500"
              : "h-9.5 w-36 gap-2 rounded-full border border-slate-200/90 bg-slate-50/90 px-3 text-[12px] font-medium text-slate-500 hover:border-purple-300 hover:bg-purple-50/30 hover:text-[#4c1d95] min-[1360px]:w-44 min-[1480px]:w-52 min-[1480px]:text-[12.5px] 2xl:h-10 2xl:w-56"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        {!compact ? (
          <span className="truncate text-slate-500 font-medium">{typingPlaceholder || "Search Fintaraa"}</span>
        ) : null}
      </button>
      {mounted ? createPortal(searchPanel, document.body) : null}
    </>
  );
}

function DropdownProductCard({
  link,
  onNavigate,
}: {
  link: NavLink;
  onNavigate: () => void;
}) {
  const badgeColorClass =
    link.badgeColor === "emerald"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : link.badgeColor === "amber"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : link.badgeColor === "blue"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : link.badgeColor === "rose"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-purple-50 text-[#4c1d95] border-purple-200";

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group/item relative flex flex-col justify-center rounded-lg px-2.5 py-1.5 no-underline transition-all duration-150 hover:bg-purple-50/70"
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-800 group-hover/item:text-[#4c1d95]">
          {link.label}
        </span>
        {link.badge ? (
          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide border leading-none ${badgeColorClass}`}
          >
            {link.badge}
          </span>
        ) : null}
      </div>
      {link.description ? (
        <span className="mt-0.5 block truncate text-[9.5px] font-normal text-slate-500 group-hover/item:text-slate-600">
          {link.description}
        </span>
      ) : null}
    </Link>
  );
}

function DesktopNavItem({
  item,
  align,
  pathname,
}: {
  align: "left" | "right";
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 160);
  };

  const closeDropdown = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const active = (() => {
    if (hrefPath(item.href) === "/products") {
      if (pathname === "/products") return true;
      const slug = pathname.split("/")[2];
      if (slug) {
        return item.label === "Loans"
          ? isLoanProduct(slug)
          : isInsuranceProduct(slug);
      }
      return false;
    }

    return (
      pathname === hrefPath(item.href) ||
      pathname.startsWith(`${hrefPath(item.href)}/`) ||
      item.sections?.some((section) =>
        section.links.some((link) => pathname === hrefPath(link.href)),
      ) ||
      item.assetSection?.links.some((link) => pathname === hrefPath(link.href))
    );
  })();

  if (item.sections?.length) {
    return (
      <div
        className="relative shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            closeDropdown();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeDropdown();
            event.currentTarget
              .querySelector<HTMLElement>("[data-nav-trigger]")
              ?.focus();
          }
        }}
      >
        <Link
          href={item.href}
          data-nav-trigger
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={closeDropdown}
          className={`flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-[12.5px] font-semibold no-underline transition min-[1340px]:text-[13px] min-[1460px]:text-[13.5px] 2xl:text-[14px] ${
            active
              ? "text-[#4c1d95] font-bold"
              : "text-slate-700 hover:text-[#4c1d95]"
          }`}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180 text-[#4c1d95]" : ""
            }`}
          />
        </Link>
        <MegaDropdown
          align={align}
          item={item}
          open={open}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onNavigate={closeDropdown}
        />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-[12.5px] font-semibold no-underline transition min-[1340px]:text-[13px] min-[1460px]:text-[13.5px] 2xl:text-[14px] ${
        active
          ? "text-[#4c1d95] font-bold"
          : "text-slate-700 hover:text-[#4c1d95]"
      }`}
    >
      <span>{item.label}</span>
      {item.highlightBadge ? (
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[8px] font-extrabold uppercase tracking-wide text-emerald-700">
          {item.highlightBadge}
        </span>
      ) : null}
    </Link>
  );
}

function MegaDropdown({
  align,
  item,
  open,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  align: "left" | "right";
  item: NavItem;
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate: () => void;
}) {
  const sections = item.sections || [];

  const dropdownMaxWidthClass =
    sections.length >= 4
      ? "max-w-[74rem]"
      : sections.length === 3
        ? "max-w-[62rem]"
        : "max-w-[48rem]";

  const gridColsClass =
    sections.length >= 4
      ? "xl:grid-cols-[180px_repeat(4,minmax(0,1fr))]"
      : sections.length === 3
        ? "xl:grid-cols-[180px_repeat(3,minmax(0,1fr))]"
        : "xl:grid-cols-[180px_repeat(2,minmax(0,1fr))]";

  return (
    <div
      data-nav-dropdown={item.label}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed left-1/2 top-[var(--site-header-height,4rem)] z-50 w-[min(1180px,calc(100vw-3rem))] -translate-x-1/2 transition-all duration-200 before:absolute before:-top-3.5 before:left-0 before:right-0 before:h-4 before:content-[''] ${dropdownMaxWidthClass} ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_60px_-15px_rgba(76,29,149,0.2),0_0_1px_1px_rgba(0,0,0,0.03)]">
        <div className={`grid min-w-0 ${gridColsClass}`}>
          {/* Left Brand / Promo Banner */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#3b0764] to-[#4c1d95] p-4 text-white">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-purple-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-xl" />

            <div className="relative z-10">
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#c4b5fd]">
                {item.promo?.subtitle || "Fintaraa Services"}
              </p>
              <h3 className="mt-1 text-[16px] font-extrabold leading-snug text-white">
                {item.promo?.title || item.label}
              </h3>
              <p className="mt-2 text-[10.5px] font-normal leading-relaxed text-purple-200/90">
                {item.promo?.description ||
                  "Compare verified rates, check eligibility in minutes, and apply with assisted desk guidance."}
              </p>

              {item.promo?.features?.length ? (
                <div className="mt-3.5 space-y-1.5 border-t border-white/15 pt-3">
                  {item.promo.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-1.5 text-[10px] font-medium text-purple-100"
                    >
                      <span className="text-[#a78bfa] font-bold">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative z-10 mt-4 pt-2">
              <Link
                href={item.promo?.ctaHref || item.href}
                onClick={onNavigate}
                className="group/cta inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#3b0764] no-underline shadow-xs transition-all hover:bg-purple-50 hover:shadow"
              >
                <span>{item.promo?.ctaText || `Explore ${item.label}`}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Section Columns */}
          {sections.map((section) => (
            <div
              key={section.title}
              data-nav-section={section.title}
              className="flex min-w-0 flex-col border-l border-slate-100 p-3"
            >
              <div className="border-b border-slate-100 pb-2 mb-1.5 min-w-0">
                <p className="truncate text-[11px] font-extrabold uppercase tracking-wider text-[#4c1d95]">
                  {section.title}
                </p>
                {section.subtitle ? (
                  <p className="mt-0.5 truncate text-[9.5px] font-normal text-slate-400">
                    {section.subtitle}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-0.5">
                {section.links.map((link) => (
                  <DropdownProductCard
                    key={`${section.title}-${link.href}-${link.label}`}
                    link={link}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Separate Loans Against Assets row */}
        {item.assetSection ? (
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4c1d95]">
                  {item.assetSection.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {item.assetSection.links.map((asset) => (
                  <Link
                    key={asset.label}
                    href={asset.href}
                    onClick={onNavigate}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 no-underline shadow-xs transition-all hover:border-purple-300 hover:bg-purple-50/80 hover:text-[#4c1d95]"
                  >
                    <span>{asset.label}</span>
                    {asset.badge ? (
                      <span className="rounded-full bg-purple-100 px-1.5 py-0.2 text-[8px] font-bold text-[#4c1d95]">
                        {asset.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Bottom Helper Strip */}
        <div className="flex items-center justify-between border-t border-purple-100/80 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/50 px-4 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <PhoneCall className="h-3.5 w-3.5 text-[#4c1d95]" />
            <span>
              Need personalized assistance? Talk to an expert:{" "}
              <a
                href={CALL_PHONE.href}
                className="font-bold text-[#4c1d95] hover:underline"
              >
                {CALL_PHONE.national}
              </a>
              <span className="hidden text-slate-400 sm:inline">
                {" "}
                (Mon–Sat, 10 AM–7 PM)
              </span>
            </span>
          </div>
          <Link
            href="/cibil-score"
            onClick={onNavigate}
            className="hidden items-center gap-1 text-[11px] font-bold text-[#4c1d95] hover:underline sm:inline-flex"
          >
            Check CIBIL Score Free
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuthButton({
  loggedIn,
  name,
  avatar,
  href,
  accountType,
  mobile = false,
  onClick,
}: {
  loggedIn: boolean;
  name: string;
  avatar?: string;
  href: string;
  accountType: "user" | "partner";
  mobile?: boolean;
  onClick?: () => void;
}) {
  const router = useRouter();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const partnerSession = accountType === "partner";
  const dashboardHref = partnerSession
    ? "/partner/profile"
    : "/account/profile/my-applications";
  const editProfileHref = partnerSession ? "/partner/profile/complete" : href;
  const notificationsHref = partnerSession
    ? "/partner/profile/notifications"
    : "/account/profile/notifications";

  const handleLogout = () => {
    setConfirmLogoutOpen(true);
  };

  const confirmLogout = () => {
    clearAuthSession();
    setConfirmLogoutOpen(false);
    onClick?.();
    router.replace("/");
    router.refresh();
  };

  if (!loggedIn && mobile) {
    return (
      <div className="rounded-2xl border border-[#d9e8f4] bg-[#f8fbff] p-3">
        <p className="px-1 pb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#718397]">
          Choose login type
        </p>
        <div className="grid gap-2">
          <Link
            href="/login"
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl border border-[#d8e5ef] bg-white p-3 text-[#3b0764] no-underline transition active:bg-[#edf6ff]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#5b21b6]">
              <UserRound className="h-5 w-5" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[13px] font-extrabold">
                Login as User
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-[#718397]">
                Applications, offers and profile
              </span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#5b21b6]" />
          </Link>
          <Link
            href="/partner/login"
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl border border-[#d8e5ef] bg-white p-3 text-[#3b0764] no-underline transition active:bg-[#f0fbf5]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf8f0] text-[#13a653]">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[13px] font-extrabold">
                Login as Partner
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-[#718397]">
                Leads, earnings and partner tools
              </span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#13a653]" />
          </Link>
        </div>
      </div>
    );
  }

  const firstName = name.split(" ")[0] || "User";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loggedIn && mobile) {
    return (
      <>
        <div className="overflow-hidden rounded-2xl border border-[#d9e8f4] bg-white">
          <div className="flex items-center gap-3 border-b border-[#e5edf3] bg-[#f4f9fd] p-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#3b0764] to-[#5b21b6] text-[11px] font-extrabold text-white">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-extrabold text-[#3b0764]">
                {name}
              </span>
              <span className="text-[11px] font-semibold text-[#718397]">
                {partnerSession ? "Partner account" : "Customer account"}
              </span>
            </span>
          </div>
          <div className="grid p-2">
            <Link
              href={dashboardHref}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#31516b] no-underline active:bg-[#edf6ff]"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-[#5b21b6]" />
              {partnerSession ? "Partner Dashboard" : "Account Dashboard"}
            </Link>
            <Link
              href={editProfileHref}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#31516b] no-underline active:bg-[#edf6ff]"
            >
              <PencilLine className="h-4.5 w-4.5 text-[#5b21b6]" />
              Edit Profile
            </Link>
            <Link
              href={notificationsHref}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#31516b] no-underline active:bg-[#edf6ff]"
            >
              <Bell className="h-4.5 w-4.5 text-[#5b21b6]" />
              Notifications
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold text-[#c43232] active:bg-red-50"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </button>
          </div>
        </div>
        <LogoutConfirmationModal
          open={confirmLogoutOpen}
          onClose={() => setConfirmLogoutOpen(false)}
          onConfirm={confirmLogout}
        />
      </>
    );
  }

  return (
    <>
      <div className="group/auth relative">
        <button
          type="button"
          aria-haspopup="menu"
          className={`inline-flex h-10 items-center rounded-full text-sm transition-all duration-150 2xl:h-10.5 ${
            loggedIn
              ? "gap-2 bg-purple-50 pl-1.5 pr-3.5 font-semibold text-[#4c1d95] ring-1 ring-purple-200/80 hover:bg-purple-100/70"
              : "gap-2 border-1.5 border-[#5b21b6] bg-white px-4 font-semibold text-[#5b21b6] hover:bg-purple-50/80 hover:border-[#4c1d95]"
          }`}
        >
          {loggedIn ? (
            <>
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#3b0764] to-[#5b21b6] text-[11px] font-extrabold text-white 2xl:h-8.5 2xl:w-8.5">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              <span className="max-w-28 truncate 2xl:max-w-36">
                Hi, {firstName}
              </span>
            </>
          ) : (
            <>
              <UserRound className="h-4 w-4 shrink-0" />
              <span>Login</span>
            </>
          )}
          <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/auth:rotate-180 group-focus-within/auth:rotate-180" />
        </button>

        <div className="pointer-events-none absolute right-0 top-full z-60 w-82 translate-y-1 pt-3 opacity-0 transition duration-180 group-hover/auth:pointer-events-auto group-hover/auth:translate-y-0 group-hover/auth:opacity-100 group-focus-within/auth:pointer-events-auto group-focus-within/auth:translate-y-0 group-focus-within/auth:opacity-100">
          <div
            role="menu"
            className="overflow-hidden rounded-2xl border border-[#d8e5ef] bg-white p-2 shadow-[0_20px_55px_rgba(16,44,69,0.17)]"
          >
            {loggedIn ? (
              <>
                <div className="mx-1 mb-1 flex items-center gap-3 rounded-xl bg-[#f3f8fc] px-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f1fb] text-[#5b21b6]">
                    {partnerSession ? (
                      <BriefcaseBusiness className="h-4.5 w-4.5" />
                    ) : (
                      <UserRound className="h-4.5 w-4.5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-extrabold text-[#3b0764]">
                      {name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#718397]">
                      {partnerSession ? "Partner account" : "Customer account"}
                    </span>
                  </span>
                </div>
                <Link
                  href={dashboardHref}
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#5b21b6]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#5b21b6]">
                    <LayoutDashboard className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      {partnerSession
                        ? "Partner Dashboard"
                        : "Account Dashboard"}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-[#7b8ea0]">
                      {partnerSession
                        ? "Leads, earnings and activity"
                        : "Applications, offers and activity"}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                </Link>
                <Link
                  href={editProfileHref}
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#5b21b6]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf8f0] text-[#13a653]">
                    <PencilLine className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      Edit Profile
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-[#7b8ea0]">
                      Update personal and account details
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                </Link>
                <Link
                  href={notificationsHref}
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#5b21b6]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#e37712]">
                    <Bell className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      Notifications
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-[#7b8ea0]">
                      Updates, requests and account alerts
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                </Link>
                <div className="mx-2 my-1 h-px bg-[#e5edf3]" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-extrabold text-[#c43232] transition hover:bg-red-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#c43232]">
                    <LogOut className="h-4.5 w-4.5" />
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="px-3 pb-2 pt-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#7b8ea0]">
                    Continue to Fintaraa
                  </p>
                  <p className="mt-1 text-[13px] font-extrabold text-[#3b0764]">
                    Choose how you want to login
                  </p>
                </div>
                <Link
                  href="/login"
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#5b21b6]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#5b21b6]">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      Login as User
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-[#7b8ea0]">
                      Applications, offers and profile
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                </Link>
                <Link
                  href="/partner/login"
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f0faf4] hover:text-[#108b46]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf8f0] text-[#13a653]">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      Login as Partner
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-[#7b8ea0]">
                      Leads, earnings and partner tools
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {loggedIn ? (
        <LogoutConfirmationModal
          open={confirmLogoutOpen}
          onClose={() => setConfirmLogoutOpen(false)}
          onConfirm={confirmLogout}
        />
      ) : null}
    </>
  );
}
