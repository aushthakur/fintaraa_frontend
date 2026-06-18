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
import {
  FaApple,
  FaGooglePlay,
  // FaYoutube,
  // FaXTwitter,
  // FaFacebookF,
  // FaInstagram,
  // FaLinkedinIn,
} from "react-icons/fa6";
import Image from "next/image";
import { productHref } from "@/lib/productRouting";

/* ─── DATA ─────────────────────────────────────────────────── */

const otherFinancialLinks = [
  "GST Registration",
  "ITR Filing",
  "ROC Filing",
  "Company Registration",
  "Credit Card",
  "Site Map",
  "About Us",
];

const otherFinancialLinks2 = [
  "About Us",
  "Site Map",
  "Awards & Recognitions",
  "Articles",
  "Press Release",
  "FAQ's",
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
  { label: "CIBIL Score", href: "/login?product=cibil-score", icon: BadgeCheck },
  { label: "Blog & Articles", href: "/blog", icon: Newspaper },
  { label: "Careers", href: "/careers", icon: BriefcaseBusiness },
  { label: "Franchise", href: "/franchise", icon: Landmark },
  { label: "Become DSA", href: "/become-dsa", icon: BadgeCheck },
  { label: "Contact Us", href: "/contact-us", icon: PhoneCall },
];

// const socialLinks = [
//   { label: "Facebook", href: "https://www.facebook.com/fintaraa", icon: FaFacebookF },
//   { label: "X", href: "https://x.com/fintaraa", icon: FaXTwitter },
//   { label: "Instagram", href: "https://www.instagram.com/fintaraa/", icon: FaInstagram },
//   { label: "LinkedIn", href: "https://www.linkedin.com/company/fintaraa/", icon: FaLinkedinIn },
//   { label: "YouTube", href: "https://www.youtube.com/@Fintaraa-finance", icon: FaYoutube },
// ];

const trustItems = [
  { title: "SSL Secure", text: "256-bit encryption", icon: ShieldCheck },
  { title: "ISO 27001", text: "Certified", icon: BadgeCheck },
  { title: "RBI Registered", text: "Trusted & Compliant", icon: Landmark },
  { title: "Data Protected", text: "Your privacy is our priority", icon: LockKeyhole },
];

/* ─── HELPERS ───────────────────────────────────────────────── */

const hoverUnderline =
  "relative w-fit after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

function FooterLinkList({ links }: { links: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {links.map((link) => (
        <li key={link}>
          <Link
            href={productHref(link)}
            className={`${hoverUnderline} flex items-center gap-1.5 text-[13px] font-normal leading-[1.6] text-white/80 no-underline transition-colors hover:text-white`}
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
      <h3 className="text-[15px] font-bold text-white">{children}</h3>
      <div className="mt-2 h-0.5 w-8 rounded-full bg-[#28c7ed]" />
    </div>
  );
}

/* ─── APP DOWNLOAD BANNER (unchanged) ──────────────────────── */

export const AppDownloadBanner = () => {
  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-5 overflow-hidden rounded-[26px] border border-[#a8e5fb] bg-[radial-gradient(circle_at_94%_12%,rgba(24,194,225,0.12),transparent_16%),radial-gradient(circle_at_4%_90%,rgba(25,85,133,0.08),transparent_18%),linear-gradient(105deg,#f3fbff_0%,#ffffff_44%,#eafffb_100%)] px-4 py-6 shadow-[0_20px_55px_rgba(25,85,133,0.09)] md:grid-cols-[1fr_0.9fr_1fr] md:px-6 lg:px-8">
        <div className="flex flex-col justify-center py-3">
          <h2 className="mt-7 max-w-xl text-[20px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#07162d] md:text-[32px] xl:text-[36px]">
            Manage Your Finances
            <span className="block bg-[linear-gradient(90deg,#0b7fe8,#176bff)] bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-4.5 font-medium leading-8 text-[#344054]">
            Track your credit score, explore loans, pay EMIs, get personalised
            offers &amp; do much more.
          </p>
        </div>

        <div className="relative hidden items-end justify-center md:flex">
          <Image
            src="/assets/refer/footer.png"
            alt="Fintaraa mobile app preview"
            width={420}
            height={360}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center py-3 pt-8 md:pt-0">
          <h3 className="text-[24px] font-extrabold tracking-[-0.01em] text-[#07162d] md:text-[26px]">
            Download the Fintaraa App Now!
          </h3>
          <p className="mt-3 text-4.5 font-medium text-[#344054]">
            Get smarter insights and better offers on the go.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
            >
              <FaGooglePlay className="h-7 w-7 text-[#34a853]" />
              <span>
                <span className="block text-[10px] font-bold uppercase leading-none">Get it on</span>
                <span className="text-[16px] font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="/app"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
            >
              <FaApple className="h-7 w-7 text-white" />
              <span>
                <span className="block text-[10px] font-bold leading-none">Download on the</span>
                <span className="text-[16px] font-semibold leading-none">App Store</span>
              </span>
            </a>
          </div>
          <p className="mt-6 text-[16px] font-medium text-[#344054]">
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
      {/* ── Main dark footer ── */}
      <footer className="bg-[#002B4D] text-white">

        {/* ── 5-column link grid ── */}
        <div className="mx-auto max-w-9xl px-6 pt-12 pb-0 lg:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">

            {/* Col 1 – Other Financial Services */}
            <div>
              <ColHeading>Other Financial Services</ColHeading>
              <FooterLinkList links={otherFinancialLinks} />
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
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`${hoverUnderline} flex items-center gap-2 text-[13px] font-normal leading-[1.6] text-white/80 no-underline transition-colors hover:text-white`}
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

            {/* Col 5 – Other Financial Services (right) */}
            <div>
              <ColHeading>Other Financial Services</ColHeading>
              <FooterLinkList links={otherFinancialLinks2} />
            </div>
          </div>
        </div>

        {/* ── Contact bar ── */}
        <div className="mx-auto mt-10 max-w-9xl border-t border-white/10 px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-5 py-7 text-[13px] text-white/75 sm:grid-cols-2 lg:grid-cols-[1.6fr_1px_1fr_1px_1fr_1px_1fr_1px_1fr]">

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
              <p className="leading-[1.7]">
                Fintaraa Financial Services Pvt. Ltd.
                <br />
                Unit No. 402, 4th Floor, Tower A,
                <br />
                Spaze I-Tech Park, Sector 49,
                <br />
                Gurugram, Haryana - 122018
              </p>
            </div>

            {/* Vertical divider */}
<div className="hidden lg:block w-6" />
            {/* Phone */}
            <a
              href="tel:+911244567890"
              className="flex items-center gap-3 text-white/75 no-underline transition-colors hover:text-white"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-white/50" />
              +91 124 456 7890
            </a>

           <div className="hidden lg:block w-6" />

            {/* WhatsApp */}
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 text-white/75 no-underline transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-white/50" />
              +91 98765 43210
            </a>

           <div className="hidden lg:block w-6" />

            {/* Email */}
            <a
              href="mailto:support@fintaraa.com"
              className="flex items-center gap-3 text-white/75 no-underline transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-white/50" />
              support@fintaraa.com
            </a>

            <div className="hidden lg:block w-6" />

            {/* Hours */}
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-white/50" />
              Mon - Sat: 9:30 AM - 6:30 PM
            </div>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mx-auto max-w-9xl px-6 pb-10 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-white/15 rounded-xl border border-white/15 md:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 px-6 py-5"
              >
                <Icon className="h-9 w-9 shrink-0 text-white/80" />
                <div>
                  <p className="text-3.5 font-bold text-white">{title}</p>
                  <p className="text-[12px] text-white/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-9xl flex-col items-start justify-between gap-4 px-6 py-4 lg:flex-row lg:items-center lg:px-8">

            {/* Copyright */}
            <p className="text-[12px] text-white/55">
              © 2024 Fintaraa Financial Services Pvt. Ltd. All Rights Reserved.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/65">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Grievance Redressal", href: "/grievance" },
                { label: "Sitemap", href: "/sitemap" },
              ].map(({ label, href }, i, arr) => (
                <span key={href} className="flex items-center gap-4">
                  <Link
                    href={href}
                    className={`${hoverUnderline} text-white/65 no-underline transition-colors hover:text-white`}
                  >
                    {label}
                  </Link>
                  {i < arr.length - 1 && <span className="text-white/30">|</span>}
                </span>
              ))}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              {/* SECTIGO */}
              <span className="flex items-center gap-1 rounded border border-white/20 bg-white/5 px-2 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#28c7ed]" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-white/80">
                  Secured by Sectigo
                </span>
              </span>

              {/* ISO */}
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-[11px] font-extrabold text-white/80">
                ISO
              </span>

              {/* RBI */}
              <span className="text-[11px] leading-[1.4] text-white/55">
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