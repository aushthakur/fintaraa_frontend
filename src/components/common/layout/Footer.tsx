import Link from "next/link";
import {
  Clock,
  Landmark,
  CreditCard,
  BadgeCheck,
  LockKeyhole,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Newspaper,
  PhoneCall,
  ShieldCheck,
  MessageCircle,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import Image from "next/image";
import { productHref } from "@/lib/productRouting";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";

/* ─── DATA ─────────────────────────────────────────────────── */

const financialServiceLinks = [
  "GST Registration",
  "ITR Filing",
  "ROC Filing",
  "Company Registration",
  "Credit Cards",
  "All Others Credit Cards",
];

const aboutCompanyLinks = [
  "Feedback",
  "Site Map",
  "Awards & Recognitions",
  "Articles",
  "Press Release",
  "Subscribe",
  "FAQ's",
  "About Us",
];

const loanLinks = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Loan Against Property",
  "Car Loan",
  "Two Wheeler Loan",
  "Education Loan",
  "Gold Loan",
  "Instant Loan",
  "Credit Score Loan",
];

const insuranceLinks = [
  "Term Insurance",
  "Health Insurance",
  "Car Insurance",
  "Bike Insurance",
  "Life Insurance",
  "Travel Insurance",
  "Home Insurance",
  "Personal Accident Insurance",
  "Critical Illness Insurance",
  "Group Insurance",
];

const quickLinks = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Tools", href: "/tools", icon: Wrench },
  {
    label: "CIBIL Score",
    href: buildLoginRedirectHref({
      redirectTo: "/cibil-score",
      product: "cibil-score",
    }),
    icon: BadgeCheck,
  },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Careers", href: "/careers", icon: BriefcaseBusiness },
  { label: "Franchise", href: "/franchise", icon: Landmark },
  { label: "Become DSA", href: "/become-dsa", icon: BadgeCheck },
  { label: "Contact Us", href: "/contact-us", icon: PhoneCall },
];

const trustItems = [
  { title: "SSL Secure", text: "256-bit encryption", icon: ShieldCheck },
  { title: "ISO 27001", text: "Certified", icon: BadgeCheck },
  { title: "RBI Registered", text: "Trusted & Compliant", icon: Landmark },
  {
    title: "Data Protected",
    text: "Your privacy is our priority",
    icon: LockKeyhole,
  },
];

/* ─── HELPERS ───────────────────────────────────────────────── */

const hoverUnderline =
  "relative w-fit after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

function FooterLinkList({ links }: { links: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link}>
          <Link
            href={productHref(link)}
            className={`${hoverUnderline} flex items-center gap-1.5 text-3.5 font-normal leading-[1.55] text-white/90 no-underline transition-colors hover:text-white`}
          >
            <ChevronRight className="h-3 w-3 shrink-0 text-white/50" />
            {link}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[16px] font-bold text-white">{children}</h3>
      <div className="mt-2 h-0.5 w-8 rounded-full bg-[#28c7ed]" />
    </div>
  );
}

/* ─── APP DOWNLOAD BANNER ───────────────────────────────────── */

export const AppDownloadBanner = () => {
  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-5 overflow-hidden rounded-[22px] border border-[#a8e5fb] bg-[radial-gradient(circle_at_94%_12%,rgba(24,194,225,0.12),transparent_16%),radial-gradient(circle_at_4%_90%,rgba(25,85,133,0.08),transparent_18%),linear-gradient(105deg,#f3fbff_0%,#ffffff_44%,#eafffb_100%)] px-4 py-6 shadow-[0_20px_55px_rgba(25,85,133,0.09)] md:px-6 lg:grid-cols-[1fr_0.82fr_1fr] lg:px-8">
        <div className="flex flex-col justify-center py-3">
          <h2 className="max-w-xl text-[22px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#07162d] md:text-[32px] xl:text-[36px]">
            Manage Your Finances
            <span className="block bg-[linear-gradient(90deg,#0b7fe8,#176bff)] bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-[15px] font-medium leading-7 text-[#344054] md:text-[17px] md:leading-8">
            Track your credit score, explore loans, pay EMIs, get personalised
            offers &amp; do much more.
          </p>
        </div>

        <div className="relative hidden items-end justify-center lg:flex">
          <Image
            src="/assets/refer/footer.png"
            alt="Fintaraa mobile app preview"
            width={420}
            height={360}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center py-3 lg:pt-0">
          <h3 className="text-[22px] font-extrabold tracking-[-0.01em] text-[#07162d] md:text-[26px]">
            Download the Fintaraa App Now!
          </h3>
          <p className="mt-3 text-[15px] font-medium text-[#344054] md:text-[17px]">
            Get smarter insights and better offers on the go.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/app"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827] sm:w-auto"
            >
              <FaGooglePlay className="h-7 w-7 text-[#34a853]" />
              <span>
                <span className="block text-[10px] font-bold uppercase leading-none">
                  Get it on
                </span>
                <span className="text-[16px] font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="/app"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827] sm:w-auto"
            >
              <FaApple className="h-7 w-7 text-white" />
              <span>
                <span className="block text-[10px] font-bold leading-none">
                  Download on the
                </span>
                <span className="text-[16px] font-semibold leading-none">
                  App Store
                </span>
              </span>
            </a>
          </div>
          <p className="mt-6 text-[15px] font-medium text-[#344054] md:text-[16px]">
            Simple. Secure. Reliable.{" "}
            <span className="font-semibold text-[#0b7fe8]">Fintaraa.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

/* ─── MAIN FOOTER ───────────────────────────────────────────── */

export default function Footer() {
  return (
    <>
      <footer className="bg-[#002B4D] text-white">
        {/* ── 5-column link grid ── */}
        <div className="mx-auto max-w-9xl px-6 pt-12 pb-0 lg:px-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {/* Col 1 – Financial Services */}
            <div>
              <ColHeading>Financial Services</ColHeading>
              <FooterLinkList links={financialServiceLinks} />
            </div>

            {/* Col 2 – Loans */}
            <div>
              <ColHeading>Loans</ColHeading>
              <FooterLinkList links={loanLinks} />
            </div>

            {/* Col 3 – Insurance */}
            <div>
              <ColHeading>Insurance</ColHeading>
              <FooterLinkList links={insuranceLinks} />
            </div>

            {/* Col 4 – Quick Links */}
            <div>
              <ColHeading>Quick Links</ColHeading>
              <ul className="mt-4 space-y-3">
                {quickLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`${hoverUnderline} flex items-center gap-2 text-3.5 font-normal leading-[1.55] text-white/90 no-underline transition-colors hover:text-white`}
                    >
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-white/60" />
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 5 – About Company */}
            <div>
              <ColHeading>About Company</ColHeading>
              <FooterLinkList links={aboutCompanyLinks} />
            </div>
          </div>
        </div>

        {/* ── Contact bar ── */}
        <div className="mx-auto mt-10 max-w-9xl border-t border-white/10 px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-5 py-7 text-[14px] text-white sm:grid-cols-2 sm:items-start lg:grid-cols-5 lg:items-center">
            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
              <p className="leading-[1.7] text-white/90">
                Fintaraa Financial Services Pvt. Ltd. Unit No. 402, 4th Floor,
                Tower A, Spaze I-Tech Park, Sector 49, Gurugram, Haryana -
                122018
              </p>
            </div>

            {/* Phone */}
            <a
              href="tel:+911244567890"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-white/70" />
              +91 124 456 7890
            </a>

            {/* WhatsApp */}
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-white/70" />
              +91 98765 43210
            </a>

            {/* Email */}
            <a
              href="mailto:support@fintaraa.com"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <Mail className="h-4 w-4 shrink-0 text-white/70" />
              support@fintaraa.com
            </a>

            {/* Hours */}
            <div className="flex items-center gap-3 text-white">
              <Clock className="h-4 w-4 shrink-0 text-white/70" />
              Mon - Sat: 9:30 AM - 6:30 PM
            </div>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mx-auto max-w-9xl px-6 pb-10 lg:px-10">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/20 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 bg-[#002B4D] px-5 py-5"
              >
                <Icon className="h-9 w-9 shrink-0 text-white/80" />
                <div>
                  <p className="text-3.5 font-bold text-white">{title}</p>
                  <p className="text-[12px] text-white/70">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-9xl flex-col items-start justify-between gap-4 px-6 py-4 lg:flex-row lg:items-center lg:px-10">
            {/* Copyright */}
            <p className="text-[13px] text-white/70">
              © 2024 Fintaraa Financial Services Pvt. Ltd. All Rights Reserved.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/80">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Grievance Redressal", href: "/grievance" },
                { label: "Sitemap", href: "/sitemap" },
              ].map(({ label, href }, i, arr) => (
                <span key={href} className="flex items-center gap-3">
                  <Link
                    href={href}
                    className={`${hoverUnderline} text-white/80 no-underline transition-colors hover:text-white`}
                  >
                    {label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="text-white/30">|</span>
                  )}
                </span>
              ))}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              {/* SECTIGO badge */}
              <span className="flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-2.5 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#28c7ed]" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-white/80">
                  Secured by Sectigo
                </span>
              </span>

              {/* ISO badge — image placeholder, replace with /assets/footer/iso-badge.png */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30">
                <Image
                  src="/assets/footer/iso-badge.png"
                  alt="ISO 27001 Certified"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </span>

              {/* RBI badge — image placeholder, replace with /assets/footer/rbi-badge.png */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30">
                <Image
                  src="/assets/footer/rbi-badge.png"
                  alt="Registered with Reserve Bank of India"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </span>

              {/* RBI text label */}
              <span className="text-[11px] leading-normal text-white/60">
                Registered with
                <br />
                Reserve Bank of India (RBI)
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
