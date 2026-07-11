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
  "Project Report",
  "Tax Compliances",
  "Credit Cards",
];

const aboutCompanyLinks = [
  "Site Map",
  "About Us",
  "Awards & Recognitions",
  "Blogs",
  "Articles",
  "FAQ's",
  "Media & Press Release",
  "Press Release",
  "Feedback",
  "Subscribe",
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
  { label: "Application Status", href: "/application-status", icon: Wrench },
  { label: "Careers", href: "/careers", icon: BriefcaseBusiness },
  {
    label: "Partner Login",
    href: "/partner/login",
    icon: Landmark,
  },
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
            className={`${hoverUnderline} flex items-center gap-1.5 text-[14px] font-normal leading-[1.55] text-white/90 no-underline transition-colors hover:text-white`}
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
      <div className="mt-2 h-0.5 w-8 rounded-full bg-[#8fc7ff]" />
    </div>
  );
}

/* ─── APP DOWNLOAD BANNER ───────────────────────────────────── */

export const AppDownloadBanner = () => {
  return (
    <section className="bg-white px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mobile-safe-container grid gap-4 overflow-hidden rounded-xl bg-white py-4 md:gap-5 md:py-6 lg:grid-cols-[1fr_0.82fr_1fr]">
        <div className="order-1 flex flex-col justify-center py-2 md:py-3 lg:order-0">
          <h2 className="max-w-xl text-[22px] font-bold leading-[1.12] tracking-tight text-[#07162d] md:text-[30px] xl:text-[34px]">
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

        <div className="relative order-2 flex min-h-52 items-end justify-center overflow-hidden rounded-xl bg-[#f3f9ff] sm:min-h-60 lg:order-0 lg:min-h-0 lg:rounded-none lg:bg-transparent">
          <Image
            src="/assets/refer/footer.png"
            alt="Fintaraa mobile app preview"
            width={420}
            height={360}
            unoptimized
            className="h-auto max-h-64 w-full max-w-80 object-contain sm:max-h-72 sm:max-w-90 lg:h-full lg:max-h-none lg:max-w-none lg:object-cover"
          />
        </div>

        <div className="order-3 flex flex-col justify-center py-2 md:py-3 lg:order-0 lg:pt-0">
          <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-[#07162d] md:text-[26px]">
            Download the Fintaraa App Now!
          </h3>
          <p className="mt-3 text-[15px] font-medium text-[#344054] md:text-[17px]">
            Get smarter insights and better offers on the go.
          </p>
          <div className="mt-5 flex flex-row gap-2.5 sm:mt-6 sm:flex-wrap sm:gap-3">
            <a
              href="/app"
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-2.5 text-white no-underline transition hover:bg-[#111827] sm:h-14 sm:flex-none sm:gap-3 sm:px-5"
            >
              <FaGooglePlay className="h-5 w-5 shrink-0 text-white sm:h-7 sm:w-7" />
              <span className="min-w-0">
                <span className="block text-[8.5px] font-bold uppercase leading-none sm:text-[10px]">
                  Get it on
                </span>
                <span className="block text-[12px] font-semibold leading-tight sm:text-[16px]">
                  Google Play
                </span>
              </span>
            </a>
            <a
              href="/app"
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-2.5 text-white no-underline transition hover:bg-[#111827] sm:h-14 sm:flex-none sm:gap-3 sm:px-5"
            >
              <FaApple className="h-5 w-5 shrink-0 text-white sm:h-7 sm:w-7" />
              <span className="min-w-0">
                <span className="block text-[8.5px] font-bold leading-none sm:text-[10px]">
                  Download on the
                </span>
                <span className="block text-[12px] font-semibold leading-tight sm:text-[16px]">
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
        <div className="mx-auto max-w-9xl px-4 pb-0 pt-9 md:px-6 md:pt-10 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                      className={`${hoverUnderline} flex items-center gap-2 text-[14px] font-normal leading-[1.55] text-white/90 no-underline transition-colors hover:text-white`}
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
        <div className="mx-auto mt-8 max-w-9xl border-t border-white/10 px-4 md:px-6 lg:px-8">
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
              href="tel:+918448282680"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-white/70" />
              +91 84482 82680
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/918448282680"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-white/70" />
              +91 84482 82680
            </a>

            {/* Email */}
            <a
              href="mailto:customercare@fintaraa.com"
              className="flex items-center gap-3 text-white no-underline transition-colors hover:text-white/80"
            >
              <Mail className="h-4 w-4 shrink-0 text-white/70" />
              customercare@fintaraa.com
            </a>

            {/* Hours */}
            <div className="flex items-center gap-3 text-white">
              <Clock className="h-4 w-4 shrink-0 text-white/70" />
              Mon - Sat: 9:30 AM - 6:30 PM
            </div>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mx-auto max-w-9xl px-4 pb-8 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/20 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 bg-[#002B4D] px-5 py-5"
              >
                <Icon className="h-9 w-9 shrink-0 text-white/80" />
                <div>
                  <p className="text-[14px] font-bold text-white">{title}</p>
                  <p className="text-[12px] text-white/70">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-9xl flex-col items-start justify-between gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:px-8">
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
                { label: "Delete Account", href: "/delete-account" },
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
          </div>
        </div>
      </footer>
    </>
  );
}
