import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Landmark,
  CreditCard,
  BadgeCheck,
  LockKeyhole,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Wrench,
  Newspaper,
  PhoneCall,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import {
  FaApple,
  FaGooglePlay,
  FaYoutube,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import Image from "next/image";

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
  { label: "CIBIL Score", href: "/cibil-score", icon: Clock },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Careers", href: "/careers", icon: BriefcaseBusiness },
  { label: "Franchise", href: "/franchise", icon: Landmark },
  { label: "Become DSA", href: "/become-dsa", icon: HandshakeIcon },
  { label: "Contact Us", href: "/contact-us", icon: PhoneCall },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/fintaraa",
    icon: FaFacebookF,
  },
  { label: "X", href: "https://x.com/fintaraa", icon: FaXTwitter },
  {
    label: "Instagram",
    href: "https://www.instagram.com/fintaraa/",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/fintaraa/",
    icon: FaLinkedinIn,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Fintaraa-finance",
    icon: FaYoutube,
  },
];

const trustItems = [
  {
    title: "SSL Secure",
    text: "256-bit encryption",
    icon: ShieldCheck,
  },
  {
    title: "ISO 27001",
    text: "Certified",
    icon: BadgeCheck,
  },
  {
    title: "RBI Registered",
    text: "Trusted & Compliant",
    icon: Landmark,
  },
  {
    title: "Data Protected",
    text: "Your privacy is our priority",
    icon: LockKeyhole,
  },
];

const footerUnderlineClass =
  "relative w-fit after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

function HandshakeIcon({ className }: { className?: string }) {
  return <BadgeCheck className={className} />;
}

export const AppDownloadBanner = () => {
  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-5 overflow-hidden rounded-[26px] border border-[#a8e5fb] bg-[radial-gradient(circle_at_94%_12%,rgba(24,194,225,0.12),transparent_16%),radial-gradient(circle_at_4%_90%,rgba(25,85,133,0.08),transparent_18%),linear-gradient(105deg,#f3fbff_0%,#ffffff_44%,#eafffb_100%)] px-4 py-6 shadow-[0_20px_55px_rgba(25,85,133,0.09)] md:grid-cols-[1fr_0.9fr_1fr] md:px-6 lg:px-8">
        <div className="flex flex-col justify-center py-3">
          <h2 className="mt-7 max-w-xl text-[24px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#07162d] md:text-[36px] xl:text-[42px]">
            Manage Your Finances
            <span className="block bg-[linear-gradient(90deg,#0b7fe8,#176bff)] bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-[18px] font-medium leading-8 text-[#344054]">
            Track your credit score, explore loans, pay EMIs, get personalised
            offers & do much more.
          </p>
        </div>

        <div className="relative hidden min-h-82.5 items-end justify-center md:flex">
          <Image
            src="/assets/refer/footer.png"
            alt="Fintaraa mobile app preview"
            width={420}
            height={360}
            className="h-auto w-full max-w-90 object-contain"
            sizes="(min-width: 1024px) 30vw, 360px"
          />
        </div>

        <div className="flex flex-col justify-center py-3 pt-8 md:pt-0">
          <h3 className="text-[24px] font-extrabold tracking-[-0.01em] text-[#07162d] md:text-[26px]">
            Download the Fintaraa App Now!
          </h3>
          <p className="mt-3 text-[18px] font-medium text-[#344054]">
            Get smarter insights and better offers on the go.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/app"
              className="inline-flex h-15 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
            >
              <FaGooglePlay className="h-8 w-8 text-[#34a853]" />
              <span>
                <span className="block text-[10px] font-bold uppercase leading-none">
                  Get it on
                </span>
                <span className="text-[18px] font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="/app"
              className="inline-flex h-15 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white no-underline shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
            >
              <FaApple className="h-9 w-9 text-white" />
              <span>
                <span className="block text-[10px] font-bold leading-none">
                  Download on the
                </span>
                <span className="text-[18px] font-semibold leading-none">
                  App Store
                </span>
              </span>
            </a>
          </div>
          <p className="mt-7 text-[18px] font-medium leading-7 text-[#344054]">
            Simple. Secure. Reliable.
          </p>
        </div>
      </div>
    </section>
  );
};

function FooterLinkList({ links }: { links: string[] }) {
  return (
    <div className="mt-5 grid gap-4">
      {links.map((link) => (
        <Link
          key={link}
          href="/products"
          className={`${footerUnderlineClass} group flex cursor-pointer items-center gap-2 text-[15px] font-medium text-white/88 no-underline transition hover:text-white`}
        >
          {link}
          <ArrowUpRight className="h-4 w-4 shrink-0 rotate-0 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="bg-[#195585] text-white">
        <div className="mx-auto max-w-9xl px-4 py-12 md:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1.1fr_1.25fr_1.1fr_1.55fr]">
            <div>
              <Link href="/" aria-label="Fintaraa home" className="shrink-0">
                <Image
                  priority
                  width={134}
                  height={41}
                  alt="Fintaraa"
                  className="h-auto w-32 invert brightness-0"
                  src="/assets/logo/logo.png"
                />
              </Link>
              <p className="mt-8 max-w-sm text-[16px] leading-8 text-white/88">
                Fintaraa is India&apos;s trusted financial marketplace helping
                you compare, choose and manage loans, credit cards, insurance
                and more - all in one place.
              </p>
              <div className="mt-16">
                <p className="text-[16px] font-medium">Follow Us</p>
                <div className="mt-5 flex gap-4">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white hover:text-[#195585]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[20px] font-extrabold">Loans</h3>
              <div className="mt-3 h-0.5 w-9 bg-[#28c7ed]" />
              <FooterLinkList links={loanLinks} />
            </div>

            <div>
              <h3 className="text-[20px] font-extrabold">Insurance</h3>
              <div className="mt-3 h-0.5 w-9 bg-[#28c7ed]" />
              <FooterLinkList links={insuranceLinks} />
            </div>

            <div>
              <h3 className="text-[20px] font-extrabold">Quick Links</h3>
              <div className="mt-3 h-0.5 w-9 bg-[#28c7ed]" />
              <div className="mt-6 grid gap-5">
                {quickLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`${footerUnderlineClass} flex items-center gap-4 text-[16px] font-medium text-white/90 no-underline transition hover:text-white`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[20px] font-extrabold">Contact</h3>
              <div className="mt-3 h-0.5 w-9 bg-[#28c7ed]" />
              <div className="mt-7 grid gap-7 text-[16px] leading-7 text-white/90">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0" />
                  <p>
                    Fintaraa Financial Services Pvt. Ltd.
                    <br />
                    Unit No. 402, 4th Floor, Tower A,
                    <br />
                    Spaze I-Tech Park, Sector 49,
                    <br />
                    Gurugram, Haryana - 122018
                  </p>
                </div>
                <a
                  href="tel:+911244567890"
                  className={`${footerUnderlineClass} flex items-center gap-4 text-white/90 no-underline transition hover:text-white`}
                >
                  <PhoneCall className="h-5 w-5" />
                  +91 124 456 7890
                </a>
                <a
                  href="tel:+919876543210"
                  className={`${footerUnderlineClass} flex items-center gap-4 text-white/90 no-underline transition hover:text-white`}
                >
                  <MessageCircle className="h-5 w-5" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:support@fintaraa.com"
                  className={`${footerUnderlineClass} flex items-center gap-4 text-white/90 no-underline transition hover:text-white`}
                >
                  <Mail className="h-5 w-5" />
                  support@fintaraa.com
                </a>
                <p className="flex items-center gap-4">
                  <Clock className="h-5 w-5" />
                  Mon - Sat: 9:30 AM - 6:30 PM
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 grid rounded-2xl border border-white/25 py-5 md:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }, index) => (
              <div
                key={title}
                className={`flex items-center justify-center gap-5 px-7 py-4 ${
                  index > 0 ? "md:border-l md:border-white/25" : ""
                }`}
              >
                <Icon className="h-11 w-11 shrink-0" />
                <div>
                  <p className="text-[17px] font-extrabold">{title}</p>
                  <p className="text-[15px] text-white/82">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/20">
          <div className="mx-auto flex max-w-9xl flex-col gap-6 px-4 py-3 text-[14px] text-white/88 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/privacy-policy"
                className={`${footerUnderlineClass} text-white/88 no-underline transition hover:text-white`}
              >
                Privacy Policy
              </Link>
              <span>|</span>
              <Link
                href="/terms-and-conditions"
                className={`${footerUnderlineClass} text-white/88 no-underline transition hover:text-white`}
              >
                Terms and Conditions
              </Link>
              <span>|</span>
              <Link
                href="/grievance"
                className={`${footerUnderlineClass} text-white/88 no-underline transition hover:text-white`}
              >
                Grievance Redressal Policy
              </Link>
              <span>|</span>
              <Link
                href="/loan-disclosure"
                className={`${footerUnderlineClass} text-white/88 no-underline transition hover:text-white`}
              >
                Loan Disclosure & Disclaimer
              </Link>
              <span>|</span>
              <Link
                href="/partners"
                className={`${footerUnderlineClass} text-white/88 no-underline transition hover:text-white`}
              >
                Our Lending Partners
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-md bg-white px-3 py-2 text-[12px] font-extrabold text-[#195585]">
                SECURED BY SECTIGO
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 text-[13px] font-extrabold">
                ISO
              </span>
              <span className="text-[13px] leading-5">
                Registered with
                <br />
                Reserve Bank of India (RBI)
              </span>
            </div>
          </div>
          <p className="text-center pb-4">
            © 2024 Fintaraa Financial Services Pvt. Ltd. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
