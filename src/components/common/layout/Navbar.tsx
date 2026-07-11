"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Bell,
  Mail,
  Menu,
  Phone,
  Search,
  Sparkles,
  UserRound,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import {
  productHref as resolveProductHref,
  isLoanProduct,
  isInsuranceProduct,
} from "@/lib/productRouting";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import {
  fetchPartnerProfile,
  getCachedPartnerProfile,
  type PartnerProfile,
} from "@/services/partner";

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

const loanSections: NavSection[] = [
  {
    title: "Popular Loans",
    subtitle: "High intent products for quick applications.",
    links: [
      {
        label: "Personal Loan",
        href: resolveProductHref("Personal Loan"),
        description: "Quick funds for planned or urgent needs.",
      },
      {
        label: "Home Loan",
        href: resolveProductHref("Home Loan"),
        description: "Finance your home with assisted support.",
      },
      {
        label: "Business Loan",
        href: resolveProductHref("Business Loan"),
        description: "Working capital and growth funding.",
      },
      {
        label: "Vehicle Loan",
        href: resolveProductHref("Vehicle Loan"),
        description: "Loans for new or used vehicles.",
      },
    ],
  },
  {
    title: "Secured Loans",
    subtitle: "Asset-backed loan options.",
    links: [
      "Loan Against Property",
      "Gold Loan",
      "Loan Against Security",
      "Car Loan",
    ].map((label) => ({
      label,
      href: resolveProductHref(label),
      description: "Compare secured options and rates.",
    })),
  },
  {
    title: "More Loans",
    subtitle: "Specific needs and assisted loan journeys.",
    links: [
      "Two Wheeler Loan",
      "Education Loan",
      "Instant Loan",
      "Credit Score Loan",
    ].map((label) => ({
      label,
      href: resolveProductHref(label),
      description: "Apply with eligibility and document help.",
    })),
  },
];

const insuranceSections: NavSection[] = [
  {
    title: "Life & Health",
    subtitle: "Protect family, health, and income.",
    links: ["Health Insurance", "Term Insurance", "Life Insurance"].map(
      (label) => ({
        label,
        href: resolveProductHref(label),
        description: "Compare plans and coverage details.",
      }),
    ),
  },
  {
    title: "Vehicle & Travel",
    subtitle: "Cover movement and mobility risks.",
    links: ["Car Insurance", "Bike Insurance", "Travel Insurance"].map(
      (label) => ({
        label,
        href: resolveProductHref(label),
        description: "Protect journeys, vehicles, and trips.",
      }),
    ),
  },
  {
    title: "Property & Business",
    subtitle: "Cover assets and business continuity.",
    links: [
      "Home Insurance",
      "Property Insurance",
      "Shop Insurance",
      "Stock Insurance",
    ].map((label) => ({
      label,
      href: resolveProductHref(label),
      description: "Coverage for assets and business risks.",
    })),
  },
];

const cibilSections: NavSection[] = [
  {
    title: "Credit Score",
    subtitle: "Know, track, and improve your score.",
    links: [
      {
        label: "Know Your Score",
        href: "/cibil-score",
        description: "Check your score with a secure guided flow.",
      },
      {
        label: "How to Improve Score",
        href: "/blog/all?category=Credit%20Score",
        description: "Read score improvement guides and tips.",
      },
      {
        label: "Credit Report",
        href: "/cibil-score/report",
        description: "Understand report factors and offer readiness.",
      },
    ],
  },
];

const navItems = [
  {
    label: "CIBIL Score",
    href: "/cibil-score",
    sections: cibilSections,
  },
  { label: "Loans", href: "/products", sections: loanSections },
  { label: "Insurance", href: "/products", sections: insuranceSections },
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
            label: "Partner Login",
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

type StaticSearchEntry = {
  label: string;
  href: string;
  category: string;
  keywords?: string[];
};

const productSearchEntries: StaticSearchEntry[] = [
  "Personal Loan",
  "Education Loan",
  "Vehicle Loan",
  "Gold Loan",
  "Loan Against Car",
  "Instant Loan",
  "Loan Against Property",
  "Renovation Loan",
  "Working Capital Loan",
  "Loan Against Security",
  "Machinery Loan",
  "Home Loan",
  "Business Loan",
  "DOD Loan",
  "OD Loan",
  "Industrial Loan",
  "Commercial Purchases Loan",
].map((label) => ({
  label,
  href: resolveProductHref(label),
  category: "Loans",
  keywords: ["loan", "finance", "eligibility", label],
}));

const insuranceSearchEntries: StaticSearchEntry[] = [
  "Life Insurance",
  "Health Insurance",
  "Vehicle Insurance",
  "Car Insurance",
  "Bike Insurance",
  "Property Insurance",
  "Home Insurance",
  "Stock Insurance",
  "Machinery Insurance",
  "Term Insurance",
  "Travel Insurance",
  "Retirement Plan",
  "Shop Insurance",
].map((label) => ({
  label,
  href: resolveProductHref(label),
  category: "Insurance",
  keywords: ["insurance", "cover", "policy", label],
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
  { label: "Digital Payments", href: "/products", category: "Services" },
  { label: "Financial Planning", href: "/products", category: "Services" },
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
  { label: "Careers", href: "/careers", category: "Company" },
  { label: "Press Release", href: "/press-release", category: "Company" },
  { label: "Partner Login", href: "/partner/login", category: "Partner" },
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
  const fromNav = navItems.flatMap((item) => [
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
  "Partner Login",
]
  .map((label) => navSearchEntries.find((entry) => entry.label === label))
  .filter(Boolean) as StaticSearchEntry[];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [partnerProfile, setPartnerProfile] =
    useState<NavbarAuthProfile | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const { profile } = useCurrentUser();
  const customerProfile: NavbarAuthProfile | null = profile.raw
    ? {
        raw: profile.raw,
        name: profile.name,
        avatar: profile.avatar,
        href: "/account/profile",
      }
    : null;
  const activeProfile = partnerProfile || customerProfile;
  const loggedIn = Boolean(activeProfile?.raw);
  const profileHref = activeProfile?.href || "/account/profile";

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
      <div className="bg-[#002B4D] px-4 text-white md:px-6 lg:pl-8 lg:pr-10">
        <div className="mx-auto flex min-h-7 max-w-9xl items-center justify-center gap-4 py-1 text-center text-[11px] font-semibold sm:min-h-8 sm:justify-between sm:py-2 sm:text-left">
          <p className="flex items-center justify-center gap-2 leading-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#8fc7ff]" />
            <span className="sm:hidden">Secure finance marketplace.</span>
            <span className="hidden sm:inline">
              Compare offers from regulated banks, NBFCs and insurers with
              secure assisted applications.
            </span>
          </p>
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:+918448282680"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 84482 82680
            </a>
            <a
              href="mailto:customercare@fintaraa.com"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              customercare@fintaraa.com
            </a>
          </div>
        </div>
      </div>

      <nav className="mobile-site-nav mx-auto flex h-16 w-full max-w-9xl items-center justify-between gap-4 px-4 md:h-18 md:px-6 xl:px-6 2xl:px-8">
        <Link href="/" aria-label="Fintaraa home" className="shrink-0">
          <Image
            priority
            width={134}
            height={41}
            alt="Fintaraa"
            className="h-auto w-16"
            src="/assets/logo/logo.png"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-6">
          {navItems.map((item, index) => (
            <DesktopNavItem
              key={item.label}
              align={index >= navItems.length - 2 ? "right" : "left"}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          <NavbarSearch />

          <Link
            href={
              loggedIn
                ? profileHref
                : buildLoginRedirectHref({ redirectTo: "/account/profile" })
            }
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e5f3] text-[#344054] no-underline transition hover:border-[#075cde] hover:text-[#075cde] 2xl:h-11 2xl:w-11"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#f04438]" />
          </Link>

          <AuthButton
            loggedIn={loggedIn}
            name={activeProfile?.name || "User"}
            avatar={activeProfile?.avatar}
            href={profileHref}
          />
        </div>

        <button
          aria-label="Toggle menu"
          className="mobile-menu-toggle ml-auto rounded-md border border-[#d0d5dd] p-2 text-[#101828] xl:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="max-h-[calc(100dvh-6.25rem)] overflow-y-auto border-t border-[#e5eef8] bg-white px-4 pb-5 md:max-h-[calc(100dvh-6.75rem)] md:px-6 xl:hidden">
          <div className="mx-auto grid max-w-9xl gap-1">
            <NavbarSearch mobile onNavigate={() => setMenuOpen(false)} />
            {navItems.map((item) => {
              const hideDescriptions =
                item.label === "Loans" || item.label === "Insurance";

              return (
                <div
                  key={item.label}
                  className="border-b border-[#edf3f8] py-2"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`${underlineClass} flex items-center justify-between rounded-md px-3 py-2 text-[14px] font-semibold text-[#101828] no-underline hover:text-[#195585]`}
                  >
                    {item.label}
                    {item.sections?.length ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null}
                  </Link>
                  {item.sections?.length ? (
                    <div className="grid gap-3 px-3 pb-2">
                      {item.sections.map((section) => (
                        <div key={section.title}>
                          <p className="px-3 pt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#195585]">
                            {section.title}
                          </p>
                          <div className="mt-1 grid gap-1">
                            {section.links.map((link) => (
                              <Link
                                key={`${item.label}-${link.href}-${link.label}`}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`relative rounded-md px-2 text-[13px] font-semibold text-[#667085] no-underline transition after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 hover:text-[#195585] hover:after:scale-x-100 ${
                                  hideDescriptions ? "py-1.5" : "py-2"
                                }`}
                              >
                                {link.label}
                                {!hideDescriptions && link.description ? (
                                  <span className="mt-0.5 line-clamp-1 block text-[11px] font-medium text-[#8b95a3]">
                                    {link.description}
                                  </span>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="mt-4 grid gap-3">
              <AuthButton
                loggedIn={loggedIn}
                name={activeProfile?.name || "User"}
                avatar={activeProfile?.avatar}
                href={profileHref}
                mobile
                onClick={() => setMenuOpen(false)}
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
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trimmedQuery = query.trim();
  const results = useMemo(() => searchNavEntries(query), [query]);
  const showSuggestions = focused && results.length > 0;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const navigateTo = (href: string) => {
    clearCloseTimer();
    setFocused(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = results[0] || {
      href: trimmedQuery ? "/products" : "/products",
    };
    navigateTo(target.href);
  };

  return (
    <div className={mobile ? "relative mt-4 w-full" : "relative w-48 2xl:w-64"}>
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 border border-[#d7e5f3] bg-white text-[#344054] transition focus-within:border-[#075cde] focus-within:shadow-[0_12px_30px_rgba(7,92,222,0.10)] ${
          mobile ? "h-11 rounded-xl px-3" : "h-10 rounded-full px-3 2xl:h-11"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-[#667085]" />
        <input
          value={query}
          type="search"
          placeholder={mobile ? "Search loans, cards, insurance" : "Search"}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            clearCloseTimer();
            setFocused(true);
          }}
          onBlur={() => {
            closeTimer.current = setTimeout(() => setFocused(false), 140);
          }}
          className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:text-[#98a2b3]"
        />
        {trimmedQuery ? (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              setFocused(true);
            }}
            className="text-[#98a2b3] transition hover:text-[#195585]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </form>

      {showSuggestions ? (
        <div
          className={
            mobile
              ? "mt-2 overflow-hidden rounded-xl border border-[#d9e9f6] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.10)]"
              : "absolute right-0 top-[calc(100%+0.65rem)] z-50 w-84 overflow-hidden rounded-xl border border-[#d9e9f6] bg-white shadow-[0_22px_60px_rgba(16,24,40,0.14)]"
          }
        >
          <div className="border-b border-[#edf3f8] bg-[#f7fbff] px-3 py-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#667085]">
              {trimmedQuery ? "Search results" : "Popular searches"}
            </p>
          </div>
          <div className="grid max-h-80 overflow-y-auto p-2">
            {results.map((item) => (
              <button
                key={`${item.label}-${item.href}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => navigateTo(item.href)}
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#eef8ff]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold text-[#07162d] group-hover:text-[#195585]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] font-semibold text-[#667085]">
                    {item.category}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#195585]" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
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
  const active = (() => {
    // Loans and Insurance both use href="/products" — differentiate by product type
    if (item.href === "/products") {
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
      <div className="group relative">
        <Link
          href={item.href}
          className={`${underlineClass} flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold no-underline transition 2xl:text-[15px] ${
            active
              ? "text-[#195585] after:scale-x-100"
              : "text-[#101828] hover:text-[#195585]"
          }`}
        >
          {item.label}
          <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
        </Link>
        <MegaDropdown align={align} item={item} />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${underlineClass} flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold no-underline transition 2xl:text-[15px] ${
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
}: {
  align: "left" | "right";
  item: NavItem;
}) {
  const sections = item.sections || [];
  const totalLinks = sections.reduce(
    (count, section) => count + section.links.length,
    0,
  );
  const compact = sections.length <= 1 && totalLinks <= 4;
  if (compact) return <CompactDropdown align={align} item={item} />;

  const hideDescriptions = item.label === "Loans" || item.label === "Insurance";
  const dropdownAlignClass = align === "right" ? "right-0" : "left-0";
  const columnCount =
    sections.length >= 3
      ? "xl:grid-cols-[0.8fr_1fr_1fr_1fr]"
      : sections.length === 2
        ? "xl:grid-cols-[0.8fr_1fr_1fr]"
        : "xl:grid-cols-[0.8fr_1fr]";

  return (
    <div
      className={`pointer-events-none absolute ${dropdownAlignClass} top-full z-50 w-[min(92vw,52rem)] pt-5 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100`}
    >
      <div className="overflow-hidden border border-[#d9e9f6] bg-white">
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
  align,
  item,
}: {
  align: "left" | "right";
  item: NavItem;
}) {
  const section = item.sections?.[0];
  const dropdownAlignClass = align === "right" ? "right-0" : "left-0";
  const hideDescriptions = item.label === "Loans" || item.label === "Insurance";

  if (!section) return null;

  return (
    <div
      className={`pointer-events-none absolute ${dropdownAlignClass} top-full z-50 w-86 pt-5 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100`}
    >
      <div className="rounded-xl border border-[#d9e9f6] bg-white p-3">
        <div className="grid gap-1">
          {section.links.map((link) => (
            <Link
              key={`${section.title}-${link.href}-${link.label}`}
              href={link.href}
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
  mobile = false,
  onClick,
}: {
  loggedIn: boolean;
  name: string;
  avatar?: string;
  href: string;
  mobile?: boolean;
  onClick?: () => void;
}) {
  if (!loggedIn) {
    return (
      <Link
        href="/login"
        onClick={onClick}
        className={
          mobile
            ? "rounded-full border border-[#075cde] px-4 py-3 text-center text-[13px] font-semibold text-[#075cde] no-underline"
            : "inline-flex h-10 items-center gap-2 rounded-full border border-[#075cde] px-4 text-sm font-medium text-[#075cde] no-underline 2xl:h-11"
        }
      >
        <span className="inline-flex items-center justify-center gap-2">
          <UserRound className="h-4 w-4" />
          Login
        </span>
      </Link>
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

  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        mobile
          ? "flex items-center justify-center gap-3 rounded-full bg-[#eef8ff] px-4 py-3 text-center text-[13px] font-semibold text-[#195585] no-underline"
          : "inline-flex h-10 items-center gap-2 rounded-full bg-[#eef8ff] pl-1.5 pr-4 text-sm font-semibold text-[#195585] no-underline ring-1 ring-[#d5ebfb] 2xl:h-11"
      }
      aria-label={`Open profile for ${name}`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#075cde] text-[11px] font-semibold text-white 2xl:h-9 2xl:w-9 2xl:text-[12px]">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </span>
      <span className="max-w-28 truncate 2xl:max-w-36">Hi, {firstName}</span>
    </Link>
  );
}
