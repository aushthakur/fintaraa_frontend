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
import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import {
  clearAuthSession,
  getAuthToken,
  getAuthType,
} from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import {
  isLoanProduct,
  isInsuranceProduct,
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

type NavLink = {
  label: string;
  href: string;
  description?: string;
};

type NavSection = {
  title: string;
  subtitle?: string;
  links: NavLink[];
};

type NavItem = NavLink & {
  sections?: NavSection[];
};

const productLinks = (products: ProductCatalogItem[]): NavLink[] =>
  products.map((product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
  }));

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

const buildLoanSections = (products: ProductCatalogItem[]): NavSection[] => [
  groupedSection(
    products,
    "personal",
    "Personal & Purpose",
    "Flexible finance for personal milestones.",
  ),
  groupedSection(
    products,
    "secured",
    "Home & Secured",
    "Property and asset-backed loan options.",
  ),
  groupedSection(
    products,
    "business",
    "Business & Industry",
    "Capital for operations, assets and expansion.",
  ),
  groupedSection(
    products,
    "vehicle",
    "Vehicle Finance",
    "New, used and vehicle-backed options.",
  ),
];

const buildInsuranceSections = (
  products: ProductCatalogItem[],
): NavSection[] => [
  groupedSection(
    products,
    "life-health",
    "Life, Health & Future",
    "Protection for health, income and long-term goals.",
  ),
  groupedSection(
    products,
    "motor",
    "Motor & Travel",
    "Cover vehicles, journeys and travel risks.",
  ),
  groupedSection(
    products,
    "property",
    "Property & Business",
    "Protection for premises, stock and machinery.",
  ),
];

const createNavItems = (
  loans: ProductCatalogItem[],
  insurance: ProductCatalogItem[],
) => [
  { label: "CIBIL Score", href: "/cibil-score" },
  {
    label: "Loans",
    href: "/products?category=Loans",
    sections: buildLoanSections(loans),
  },
  {
    label: "Insurance",
    href: "/products?category=Insurance",
    sections: buildInsuranceSections(insurance),
  },
  {
    label: "Credit Cards",
    href: "/credit-cards",
    sections: [
      {
        title: "Explore Cards",
        subtitle: "Compare cards by rewards, cashback, and usage.",
        links: [
          {
            label: "Compare Credit Cards",
            href: "/credit-cards",
            description: "Find cards by fee, rewards, and usage.",
          },
          {
            label: "Offers & Rewards",
            href: "/offers",
            description: "Cashback and exclusive bank offers.",
          },
          {
            label: "Check Card Eligibility",
            href: buildLoginRedirectHref({
              redirectTo: "/credit-cards",
              product: "credit-card",
            }),
            description: "Check eligible card offers quickly.",
          },
        ],
      },
      {
        title: "Bank Cards",
        subtitle: "Bank-wise card pages.",
        links: [
          {
            label: "HDFC Credit Cards",
            href: "/banks/hdfc-bank/credit-card",
            description: "Explore HDFC card options.",
          },
          {
            label: "SBI Credit Cards",
            href: "/banks/sbi/credit-card",
            description: "Explore SBI card options.",
          },
          {
            label: "ICICI Credit Cards",
            href: "/banks/icici-bank/credit-card",
            description: "Explore ICICI card options.",
          },
        ],
      },
    ],
  },
  {
    label: "Track Application",
    href: "/application-status",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
  {
    label: "Partner Zone",
    href: "/franchise",
    sections: [
      {
        title: "Partner With Us",
        subtitle: "Business and earning opportunities.",
        links: [
          {
            label: "Channel Partner Login",
            href: "/partner/login",
            description: "Login to manage partner profile and leads.",
          },
          {
            label: "Become Partner",
            href: "/franchise",
            description: "Start a partner or franchise journey.",
          },
          {
            label: "Become DSA",
            href: "/become-dsa",
            description: "Earn commissions as a DSA partner.",
          },
          {
            label: "Refer & Earn",
            href: "/refer-and-earn",
            description: "Refer users and track rewards.",
          },
        ],
      },
      {
        title: "Company",
        subtitle: "Work with Fintaraa and get support.",
        links: [
          {
            label: "Careers",
            href: "/careers",
            description: "Explore open roles at Fintaraa.",
          },
          // {
          //   label: "Partner Support",
          //   href: "/support",
          //   description: "Get help for partner journeys.",
          // },
          // {
          //   label: "Contact Us",
          //   href: "/contact-us",
          //   description: "Connect with our team.",
          // },
        ],
      },
    ],
  },
] satisfies NavItem[];

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

const insuranceSearchEntries: StaticSearchEntry[] =
  insuranceProductCatalog.map((product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
    category: "Insurance",
    keywords: ["insurance", "cover", "policy", product.name],
  }));

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
  "Health Insurance":
    "/assets/product-cards/insurance/health-insurance.webp",
  "Life Insurance": "/assets/product-cards/insurance/life-insurance.webp",
  "Term Insurance": "/assets/product-cards/insurance/term-insurance.webp",
  "Travel Insurance":
    "/assets/product-cards/insurance/travel-insurance.webp",
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
  "Company Registration":
    "/assets/services/company-registration-service.png",
  "MSME Registration": "/assets/services/msme-registration-service.png",
  "Annual Compliance": "/assets/services/annual-compliance-service.png",
  "ROC Filing": "/assets/services/annual-compliance-service.png",
  "Tax Compliances": "/assets/services/tax-compliance-service.png",
  "Project Report": "/assets/services/project-report-service.png",
};

const topSearchProducts = [
  "Personal Loan",
  "Credit Cards",
  "Health Insurance",
]
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
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

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
  const closeMobileNavigation = () => {
    setMenuOpen(false);
    setMobileOpenLabel(null);
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

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 overflow-x-clip border-b border-[#e5eef8] bg-white/95 backdrop-blur"
    >
      <div className="bg-[#002B4D] px-3 text-white min-[380px]:px-4 md:px-6 lg:pl-8 lg:pr-10">
        <div className="mx-auto flex min-h-8 max-w-9xl items-center justify-between gap-2 py-1.5 text-[8.5px] font-semibold min-[360px]:text-[9.5px] sm:gap-3 sm:py-2 sm:text-[11px]">
          <p className="flex min-w-0 items-center gap-1.5 leading-4 sm:gap-2">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#8fc7ff] sm:h-4 sm:w-4" />
            <span className="whitespace-nowrap sm:hidden">
              30+ trusted institutions
            </span>
            <span className="hidden sm:inline">
              Compare offers from regulated banks, NBFCs and insurers with
              secure assisted applications.
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href="mailto:customercare@fintaraa.com"
              className="flex items-center gap-1 text-white/90 no-underline transition hover:text-white sm:gap-1.5"
            >
              <Mail className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="min-[380px]:hidden">Support</span>
              <span className="hidden min-[380px]:inline">
                customercare@fintaraa.com
              </span>
            </a>
            <span className="hidden items-center gap-1.5 text-white/80 lg:flex">
              <Clock3 className="h-3.5 w-3.5" />
              Mon–Sat, 10:00 AM–7:00 PM
            </span>
          </div>
        </div>
      </div>

      <nav
        aria-busy={!hydrated}
        data-hydrated={hydrated ? "true" : "false"}
        className={`mobile-site-nav mx-auto flex h-15 w-full max-w-9xl items-center justify-between gap-1 px-3 min-[360px]:h-16 min-[360px]:gap-2 min-[360px]:px-4 md:h-18 md:px-6 xl:px-6 2xl:px-8 ${
          hydrated ? "" : "pointer-events-none"
        }`}
      >
        <Link
          href="/"
          aria-label="Fintaraa home"
          onClick={closeMobileNavigation}
          className="shrink-0"
        >
          <Image
            priority
            width={134}
            height={41}
            alt="Fintaraa"
            className="h-auto w-14 min-[360px]:w-16"
            src="/assets/logo/logo.png"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex min-[1380px]:gap-4 2xl:gap-6">
          {navItems.map((item, index) => (
            <DesktopNavItem
              key={`${item.label}:${pathname}`}
              align={index >= navItems.length - 2 ? "right" : "left"}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 xl:flex min-[1380px]:gap-2 2xl:gap-3">
          <NavbarSearch />

          <Link
            href={
              loggedIn
                ? notificationsHref
                : buildLoginRedirectHref({
                    redirectTo: "/account/profile/notifications",
                  })
            }
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7fb] text-[#344054] no-underline transition hover:bg-[#eaf2fb] hover:text-[#075cde] 2xl:h-11 2xl:w-11"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotifications ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#f04438] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-white">
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
          <NavbarSearch compact onOpen={closeMobileNavigation} />
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
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center text-[#344054] no-underline transition active:bg-[#eaf2fb] active:text-[#075cde] min-[360px]:h-10 min-[360px]:w-10"
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
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-md border border-[#075cde] px-1.5 text-[10px] font-bold text-[#075cde] no-underline transition active:bg-[#eef5ff] min-[360px]:h-10 min-[360px]:px-2 min-[360px]:text-[11px]"
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
                      onClick={() =>
                        setMobileOpenLabel((current) =>
                          current === item.label ? null : item.label,
                        )
                      }
                      className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[13px] font-bold transition min-[380px]:px-3.5 ${
                        sectionOpen
                          ? "bg-[#eef7ff] text-[#075cde]"
                          : "text-[#17354d] active:bg-[#f4f8fc]"
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
                      className="flex min-h-11 items-center justify-between px-3 py-2.5 text-[13px] font-bold text-[#17354d] no-underline transition active:bg-[#f4f8fc] active:text-[#075cde] min-[380px]:px-3.5"
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
                        className="flex min-h-10 w-full items-center justify-between rounded-lg bg-[linear-gradient(135deg,#195585,#0878c9)] px-3 text-[12px] font-bold text-white no-underline shadow-[0_8px_20px_rgba(25,85,133,0.16)]"
                      >
                        Explore all {item.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <div className="mt-2.5 grid gap-2 min-[680px]:grid-cols-2">
                        {item.sections.map((section) => (
                          <div
                            key={section.title}
                            className="rounded-xl border border-[#e0eaf2] bg-white p-2.5"
                          >
                            <p className="px-1 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#195585]">
                              {section.title}
                            </p>
                            <div className="mt-1.5 grid gap-0.5 min-[380px]:grid-cols-2 min-[680px]:grid-cols-1">
                              {section.links.map((link) => (
                                <Link
                                  key={`${item.label}-${link.href}-${link.label}`}
                                  href={link.href}
                                  onClick={closeMobileNavigation}
                                  className="flex min-h-9 min-w-0 flex-col justify-center rounded-lg px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-[#526b80] no-underline transition active:bg-[#edf6ff] active:text-[#075cde]"
                                >
                                  <span>{link.label}</span>
                                  {!hideDescriptions && link.description ? (
                                    <span className="mt-0.5 hidden line-clamp-1 text-[10px] font-medium leading-4 text-[#8b99a8] min-[380px]:block">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
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
              <div className="pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-var(--site-header-height,6rem)-1rem)] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#d9e5ee] bg-white p-4 shadow-[0_24px_70px_rgba(15,47,73,0.22)] sm:p-5 lg:w-3/5 lg:min-w-[760px]">
                <div className="flex items-center gap-2.5">
                  <form
                    onSubmit={handleSubmit}
                    className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#a9c5d8] bg-[#f8fbfd] px-3 transition focus-within:border-[#075cde] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#075cde]/10 sm:px-4"
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
                      placeholder="Search loans, cards, insurance or services"
                      onChange={(event) => setQuery(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#102f49] outline-none placeholder:font-medium placeholder:text-[#8da0af] sm:text-[14px]"
                    />
                    {trimmedQuery ? (
                      <button
                        type="button"
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => setQuery("")}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#7890a2] transition hover:bg-[#e9f3fa] hover:text-[#075cde]"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      aria-label="Open first search result"
                      title="Search"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#075cde] text-white transition hover:bg-[#064cb8]"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    title="Close search"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4e2eb] text-[#527189] transition hover:border-[#8ebbd3] hover:bg-[#f4f9fc] hover:text-[#075cde]"
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
                                className="rounded-full bg-[#f0f4f7] px-3 py-1.5 text-[11px] font-semibold text-[#52697b] transition hover:bg-[#e4f0fa] hover:text-[#075cde]"
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
                                  <span className="block text-[11px] font-bold leading-4 text-[#17334a] group-hover:text-[#075cde]">
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
                                  <span className="block text-[11px] font-bold leading-4 text-[#17334a] group-hover:text-[#075cde]">
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
                          <span className="shrink-0 rounded-full bg-[#e8f3fb] px-2.5 py-1 text-[10px] font-bold text-[#075cde]">
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
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e9f3fa] text-[#075cde]">
                                      <Icon
                                        className="h-4.5 w-4.5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[11px] font-bold text-[#17334a] group-hover:text-[#075cde]">
                                      {item.label}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#7890a2]">
                                      {item.category}
                                    </span>
                                  </span>
                                  <ArrowRight
                                    className="h-3.5 w-3.5 shrink-0 text-[#9aaeba] transition-transform group-hover:translate-x-0.5 group-hover:text-[#075cde]"
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
                              <p className="text-[12px] font-bold text-[#102f49]">
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
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#075cde] px-3.5 py-2 text-[10px] font-bold text-[#075cde] transition hover:bg-[#075cde] hover:text-white"
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
        className={`flex items-center text-[#344054] transition-colors hover:bg-[#eaf2fb] hover:text-[#075cde] ${
          compact
            ? "h-9 w-9 justify-center rounded-md min-[360px]:h-10 min-[360px]:w-10"
            : mobile
              ? "h-11 w-full gap-2 rounded-lg px-3 text-[13px] font-semibold"
              : "h-10 w-44 gap-2 rounded-lg px-3 text-[12px] font-semibold min-[1380px]:w-52 min-[1380px]:text-[13px] 2xl:h-11 2xl:w-60"
        }`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        {!compact ? (
          <span className="truncate text-[#7890a2]">Search Fintaraa</span>
        ) : null}
      </button>
      {mounted ? createPortal(searchPanel, document.body) : null}
    </>
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
  const closeDropdown = () => setOpen(false);
  const active = (() => {
    // Loans and Insurance both use href="/products" — differentiate by product type
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
      )
    );
  })();

  if (item.sections?.length) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={closeDropdown}
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
          className={`${underlineClass} flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold no-underline transition min-[1380px]:text-[14px] 2xl:text-[15px] ${
            active
              ? "text-[#195585] after:scale-x-100"
              : "text-[#101828] hover:text-[#195585]"
          }`}
        >
          {item.label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </Link>
        <MegaDropdown
          align={align}
          item={item}
          open={open}
          onNavigate={closeDropdown}
        />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${underlineClass} flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold no-underline transition min-[1380px]:text-[14px] 2xl:text-[15px] ${
        active
          ? "text-[#195585] after:scale-x-100"
          : "text-[#101828] hover:text-[#195585]"
      }`}
    >
      {item.label}
    </Link>
  );
}

function MegaDropdown({
  align,
  item,
  open,
  onNavigate,
}: {
  align: "left" | "right";
  item: NavItem;
  open: boolean;
  onNavigate: () => void;
}) {
  const sections = item.sections || [];
  const totalLinks = sections.reduce(
    (count, section) => count + section.links.length,
    0,
  );
  const compact = sections.length <= 1 && totalLinks <= 4;
  if (compact) {
    return (
      <CompactDropdown
        align={align}
        item={item}
        open={open}
        onNavigate={onNavigate}
      />
    );
  }

  const hideDescriptions = item.label === "Loans" || item.label === "Insurance";
  const dropdownMaxWidthClass =
    sections.length >= 4
      ? "max-w-[68rem]"
      : sections.length === 3
        ? "max-w-[58rem]"
        : "max-w-[52rem]";
  const columnCount =
    sections.length >= 4
      ? "xl:grid-cols-5"
      : sections.length === 3
      ? "xl:grid-cols-[0.8fr_1fr_1fr_1fr]"
      : sections.length === 2
        ? "xl:grid-cols-[0.8fr_1fr_1fr]"
        : "xl:grid-cols-[0.8fr_1fr]";

  return (
    <div
      data-nav-dropdown={item.label}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      className={`fixed left-1/2 top-[calc(var(--site-header-height,6.5rem)-2.5rem)] z-50 w-[calc(100vw-2rem)] -translate-x-1/2 pt-10 transition duration-200 ${dropdownMaxWidthClass} ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-xl border border-[#d9e9f6] bg-white shadow-[0_24px_60px_rgba(7,22,45,0.18)]">
        <div className={`grid gap-0 ${columnCount}`}>
          <div className="bg-[linear-gradient(145deg,#195585,#0f6fba)] p-4 text-white">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
              <Sparkles className="h-5 w-5 text-[#8fc7ff]" />
            </div>
            <h3 className="mt-5 text-[20px] font-semibold leading-tight">
              {item.label}
            </h3>
            <p className="mt-3 text-xs text-white/76">
              Compare options, check eligibility, and continue with assisted
              Fintaraa support.
            </p>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="mt-6 inline-flex h-10 whitespace-nowrap items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-[#195585] no-underline"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {sections.map((section) => (
            <div
              key={section.title}
              className="border-l border-[#edf3f8] px-3 py-4"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#195585]">
                {section.title}
              </p>
              {!hideDescriptions && section.subtitle ? (
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                  {section.subtitle}
                </p>
              ) : null}
              <div className="mt-2 grid gap-1.5">
                {section.links.map((link) => (
                  <Link
                    key={`${section.title}-${link.href}-${link.label}`}
                    href={link.href}
                    onClick={onNavigate}
                    className={`group/item relative block rounded-lg px-2 text-[#07162d] no-underline transition after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 ${
                      hideDescriptions ? "py-1.5" : "py-2"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="inline-block max-w-full truncate text-[13px] font-semibold group-hover/item:text-[#195585]">
                        {link.label}
                      </span>
                      {!hideDescriptions && link.description ? (
                        <span className="mt-0.5 line-clamp-1 block text-[11px] font-semibold text-[#667085]">
                          {link.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompactDropdown({
  item,
  open,
  onNavigate,
}: {
  align: "left" | "right";
  item: NavItem;
  open: boolean;
  onNavigate: () => void;
}) {
  const section = item.sections?.[0];
  const hideDescriptions = item.label === "Loans" || item.label === "Insurance";

  if (!section) return null;

  return (
    <div
      data-nav-dropdown={item.label}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      className={`fixed left-1/2 top-[calc(var(--site-header-height,6.5rem)-2.5rem)] z-50 w-[calc(100vw-2rem)] max-w-96 -translate-x-1/2 pt-10 transition duration-200 ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0"
      }`}
    >
      <div className="rounded-xl border border-[#d9e9f6] bg-white p-3 shadow-[0_24px_60px_rgba(7,22,45,0.18)]">
        <div className="grid gap-1">
          {section.links.map((link) => (
            <Link
              key={`${section.title}-${link.href}-${link.label}`}
              href={link.href}
              onClick={onNavigate}
              className={`group/item relative block rounded-lg px-2 text-[#07162d] no-underline transition after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 ${
                hideDescriptions ? "py-1.5" : "py-2"
              }`}
            >
              <span className="min-w-0">
                <span className="inline-block max-w-full truncate text-[13px] font-semibold group-hover/item:text-[#195585]">
                  {link.label}
                </span>
                {!hideDescriptions && link.description ? (
                  <span className="mt-0.5 line-clamp-1 block text-[11px] font-semibold text-[#667085]">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
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
  const editProfileHref = partnerSession
    ? "/partner/profile/complete"
    : href;
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
            className="flex items-center gap-3 rounded-xl border border-[#d8e5ef] bg-white p-3 text-[#17354d] no-underline transition active:bg-[#edf6ff]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
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
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#075cde]" />
          </Link>
          <Link
            href="/partner/login"
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl border border-[#d8e5ef] bg-white p-3 text-[#17354d] no-underline transition active:bg-[#f0fbf5]"
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
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#075cde] text-[11px] font-extrabold text-white">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-extrabold text-[#17354d]">
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
              <LayoutDashboard className="h-4.5 w-4.5 text-[#075cde]" />
              {partnerSession ? "Partner Dashboard" : "Account Dashboard"}
            </Link>
            <Link
              href={editProfileHref}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#31516b] no-underline active:bg-[#edf6ff]"
            >
              <PencilLine className="h-4.5 w-4.5 text-[#075cde]" />
              Edit Profile
            </Link>
            <Link
              href={notificationsHref}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#31516b] no-underline active:bg-[#edf6ff]"
            >
              <Bell className="h-4.5 w-4.5 text-[#075cde]" />
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
        className={`inline-flex h-10 items-center rounded-full text-sm transition 2xl:h-11 ${
          loggedIn
            ? "gap-2 bg-[#eef8ff] pl-1.5 pr-3 font-semibold text-[#195585] ring-1 ring-[#d5ebfb] hover:bg-[#e5f4ff]"
            : "gap-2 border border-[#075cde] px-4 font-medium text-[#075cde] hover:bg-[#eef5ff]"
        }`}
      >
        {loggedIn ? (
          <>
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#075cde] text-[11px] font-extrabold text-white 2xl:h-9 2xl:w-9 2xl:text-[12px]">
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
            <UserRound className="h-4 w-4" />
            Login
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover/auth:rotate-180 group-focus-within/auth:rotate-180" />
      </button>

      <div className="pointer-events-none absolute right-0 top-full z-60 w-82 translate-y-1 pt-3 opacity-0 transition duration-180 group-hover/auth:pointer-events-auto group-hover/auth:translate-y-0 group-hover/auth:opacity-100 group-focus-within/auth:pointer-events-auto group-focus-within/auth:translate-y-0 group-focus-within/auth:opacity-100">
        <div
          role="menu"
          className="overflow-hidden rounded-2xl border border-[#d8e5ef] bg-white p-2 shadow-[0_20px_55px_rgba(16,44,69,0.17)]"
        >
          {loggedIn ? (
            <>
              <div className="mx-1 mb-1 flex items-center gap-3 rounded-xl bg-[#f3f8fc] px-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f1fb] text-[#075cde]">
                  {partnerSession ? (
                    <BriefcaseBusiness className="h-4.5 w-4.5" />
                  ) : (
                    <UserRound className="h-4.5 w-4.5" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold text-[#17354d]">
                    {name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#718397]">
                    {partnerSession ? "Partner account" : "Customer account"}
                  </span>
                </span>
              </div>
              <Link
                href={dashboardHref}
                role="menuitem"
                className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#075cde]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
                  <LayoutDashboard className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-extrabold">
                    {partnerSession ? "Partner Dashboard" : "Account Dashboard"}
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
                className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#075cde]"
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
                className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#075cde]"
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
                <p className="mt-1 text-[13px] font-extrabold text-[#17354d]">
                  Choose how you want to login
                </p>
              </div>
              <Link
                href="/login"
                role="menuitem"
                className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[#31516b] no-underline transition hover:bg-[#f3f8fc] hover:text-[#075cde]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
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
