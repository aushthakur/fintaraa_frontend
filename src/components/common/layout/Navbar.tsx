"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Mail,
  Menu,
  Phone,
  Sparkles,
  UserRound,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  productHref as resolveProductHref,
  isLoanProduct,
  isInsuranceProduct,
} from "@/lib/productRouting";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";

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

const navItems = [
  {
    label: "CIBIL Score",
    href: "/cibil-score",
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
            label: "Franchise",
            href: "/franchise",
            description: "Open your own Fintaraa franchise.",
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

const underlineClass =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

const hrefPath = (href: string) => href.split("?")[0];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useCurrentUser();
  const loggedIn = Boolean(profile.raw);

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-[#e5eef8] bg-white/95 backdrop-blur">
      <div className="bg-[#002B4D] px-4 text-white md:px-6 lg:pl-8 lg:pr-10">
        <div className="mx-auto flex min-h-9 max-w-9xl items-center justify-center gap-4 py-2 text-center text-[11px] font-semibold sm:justify-between sm:text-left">
          <p className="flex items-center justify-center gap-2 leading-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#7ee3a2]" />
            Compare offers from regulated banks, NBFCs and insurers with secure
            assisted applications.
          </p>
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:18001234567"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              1800-123-4567
            </a>
            <a
              href="mailto:support@fintaraa.com"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              support@fintaraa.com
            </a>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-18 max-w-9xl items-center justify-between gap-5 px-4 md:px-6 lg:px-8">
        <Link href="/" aria-label="Fintaraa home" className="shrink-0">
          <Image
            priority
            width={134}
            height={41}
            alt="Fintaraa"
            className="h-auto w-18"
            src="/assets/logo/logo.png"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item, index) => (
            <DesktopNavItem
              key={item.label}
              align={index >= navItems.length - 2 ? "right" : "left"}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href={
              loggedIn
                ? "/products"
                : buildLoginRedirectHref({ redirectTo: "/products" })
            }
            className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-4 text-sm font-medium text-white no-underline shadow-[0_8px_18px_rgba(18,183,106,0.22)]"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>

          <AuthButton
            loggedIn={loggedIn}
            name={profile.name}
            avatar={profile.avatar}
          />
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-md border border-[#d0d5dd] p-2 text-[#101828] lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="max-h-[calc(100dvh-6.75rem)] overflow-y-auto border-t border-[#e5eef8] bg-white px-4 pb-5 shadow-lg md:px-6 lg:hidden">
          <div className="mx-auto grid max-w-9xl gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-[#edf3f8] py-2">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${underlineClass} flex items-center justify-between rounded-md px-3 py-2 text-[14px] font-extrabold text-[#101828] no-underline hover:text-[#195585]`}
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
                        <p className="px-3 pt-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#195585]">
                          {section.title}
                        </p>
                        <div className="mt-1 grid gap-1">
                          {section.links.map((link) => (
                            <Link
                              key={`${item.label}-${link.href}-${link.label}`}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="rounded-md px-3 py-2 text-[13px] font-semibold text-[#667085] no-underline hover:bg-[#eef8ff] hover:text-[#195585]"
                            >
                              {link.label}
                              <span className="mt-0.5 line-clamp-1 block text-[11px] font-medium text-[#8b95a3]">
                                {link.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-4 grid gap-3">
              <Link
                href={
                  loggedIn
                    ? "/products"
                    : buildLoginRedirectHref({ redirectTo: "/products" })
                }
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#12b76a] px-4 py-3 text-center text-[13px] font-extrabold text-white no-underline"
              >
                Apply Now
              </Link>
              <AuthButton
                loggedIn={loggedIn}
                name={profile.name}
                avatar={profile.avatar}
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
          className={`${underlineClass} flex items-center gap-1 text-base font-semibold no-underline transition ${
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
      className={`${underlineClass} flex items-center gap-1 text-base font-semibold no-underline transition ${
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
      <div className="overflow-hidden border border-[#d9e9f6] bg-white shadow-[0_28px_80px_rgba(25,85,133,0.16)]">
        <div className={`grid gap-0 ${columnCount}`}>
          <div className="bg-[linear-gradient(145deg,#195585,#0f6fba)] p-4 text-white">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
              <Sparkles className="h-5 w-5 text-[#7ee3a2]" />
            </div>
            <h3 className="mt-5 text-[20px] font-extrabold leading-tight">
              {item.label}
            </h3>
            <p className="mt-3 text-xs text-white/76">
              Compare options, check eligibility, and continue with assisted
              Fintaraa support.
            </p>
            <Link
              href={item.href}
              className="mt-6 inline-flex h-10 whitespace-nowrap items-center gap-2 rounded-full bg-white px-4 text-[13px] font-extrabold text-[#195585] no-underline"
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
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
                {section.title}
              </p>
              {section.subtitle ? (
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                  {section.subtitle}
                </p>
              ) : null}
              <div className="mt-4 grid gap-1.5">
                {section.links.map((link) => (
                  <Link
                    key={`${section.title}-${link.href}-${link.label}`}
                    href={link.href}
                    className="group/item flex items-center gap-3 rounded-2xl py-2 text-[#07162d] no-underline transition"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef8ff] text-[#195585] transition group-hover/item:bg-[#195585] group-hover/item:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-extrabold">
                        {link.label}
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-[11px] font-semibold text-[#667085]">
                        {link.description}
                      </span>
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

  if (!section) return null;

  return (
    <div
      className={`pointer-events-none absolute ${dropdownAlignClass} top-full z-50 w-86 pt-5 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100`}
    >
      <div className="rounded-xl border border-[#d9e9f6] bg-white p-3 shadow-[0_24px_70px_rgba(25,85,133,0.16)]">
        <div className="rounded-lg bg-[#eef8ff] px-4 py-3">
          <p className="line-clamp-1 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
            {section.title}
          </p>
          {section.subtitle ? (
            <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#667085]">
              {section.subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-2 grid gap-1">
          {section.links.map((link) => (
            <Link
              key={`${section.title}-${link.href}-${link.label}`}
              href={link.href}
              className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#07162d] no-underline transition hover:bg-[#f6fbff]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef8ff] text-[#195585] transition group-hover/item:bg-[#195585] group-hover/item:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-extrabold">
                  {link.label}
                </span>
                <span className="mt-0.5 line-clamp-1 block text-[11px] font-semibold text-[#667085]">
                  {link.description}
                </span>
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
  mobile = false,
  onClick,
}: {
  loggedIn: boolean;
  name: string;
  avatar?: string;
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
            ? "rounded-full border border-[#12b76a] px-4 py-3 text-center text-[13px] font-extrabold text-[#0f5132] no-underline"
            : "inline-flex h-10 items-center gap-2 rounded-full border border-[#12b76a] px-4 text-sm font-medium text-[#0f5132] no-underline"
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
      href="/account/profile"
      onClick={onClick}
      className={
        mobile
          ? "flex items-center justify-center gap-3 rounded-full bg-[#eef8ff] px-4 py-3 text-center text-[13px] font-extrabold text-[#195585] no-underline"
          : "inline-flex h-10 items-center gap-2 rounded-full bg-[#eef8ff] pl-1.5 pr-4 text-sm font-extrabold text-[#195585] no-underline ring-1 ring-[#d5ebfb]"
      }
      aria-label={`Open account profile for ${name}`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#12b76a] text-[11px] font-extrabold text-white">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </span>
      <span className="max-w-36 truncate">Hi, {firstName}</span>
    </Link>
  );
}
