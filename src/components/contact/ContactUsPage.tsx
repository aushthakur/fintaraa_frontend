import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Landmark,
  MessageCircle,
  Users,
  Phone,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { ContactConsultationForm } from "./ContactConsultationForm";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import {
  CALL_PHONE,
  COMPANY_NAME,
  OFFICE,
  WHATSAPP_PHONE,
} from "@/data/company";

const heroStats = [
  { value: "Quick Approval", label: "Just in 24hrs", icon: ShieldCheck },
  { value: "10,000+", label: "Happy Customers", icon: Users },
  { value: "100+", label: "Lending Partners", icon: Landmark },
];

const contactCards = [
  {
    title: "Call Us",
    value: CALL_PHONE.display,
    lines: ["Mon - Sat, 10:00 AM - 7:00 PM"],
    icon: Phone,
    href: CALL_PHONE.href,
    actionLabel: "Call now",
  },
  {
    title: "Email Us",
    value: "customercare@fintaraa.com",
    lines: ["We Reply within 24hrs"],
    icon: Mail,
    href: "mailto:customercare@fintaraa.com",
    actionLabel: "Send email",
  },
  {
    title: "WhatsApp",
    value: WHATSAPP_PHONE.display,
    lines: ["Chat With Our Expert"],
    icon: MessageCircle,
    href: WHATSAPP_PHONE.href,
    actionLabel: "Open WhatsApp",
    external: true,
  },
  {
    title: "Visit Our Office",
    value: COMPANY_NAME,
    lines: [OFFICE.address],
    icon: MapPin,
    href: OFFICE.mapUrl,
    actionLabel: "View directions",
    external: true,
  },
];

function HeroMetric({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_26px_rgba(16,24,40,0.06)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#1d5fbf]">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <AnimatedCounter
          value={value}
          className="block text-[15px] font-extrabold text-[#111827]"
        />
        <span className="block text-[11px] font-medium text-[#667085]">
          {label}
        </span>
      </span>
    </div>
  );
}

function ContactCard({
  title,
  value,
  lines,
  icon: Icon,
  href,
  actionLabel,
  external = false,
}: {
  title: string;
  value: string;
  lines: string[];
  icon: typeof Phone;
  href: string;
  actionLabel: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={`${actionLabel}: ${value}`}
      className="group flex items-start gap-4 rounded-2xl border border-[#e5eaf0] bg-white px-4 py-4 text-inherit no-underline shadow-[0_10px_26px_rgba(16,24,40,0.05)] transition hover:border-[#b9d7ee] hover:bg-[#fbfdff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#1d5fbf]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold text-[#111827]">{title}</p>
        <p className="mt-1 wrap-break-word text-[13px] font-semibold text-[#344054]">
          {value}
        </p>
        {lines.map((line) => (
          <p key={line} className="text-[12px] leading-5 text-[#667085]">
            {line}
          </p>
        ))}
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#1d5fbf]">
          {actionLabel}
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function ContactUsPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden px-4 py-10 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-16 h-24 w-24 rounded-r-full bg-[#eaf4ff]" />
        <div className="relative mx-auto max-w-9xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.96fr]">
            <div>
              <h1 className="max-w-3xl text-[34px] font-extrabold leading-[1.04] tracking-normal text-[#111827] sm:text-[44px] lg:text-[48px]">
                We&apos;re Here To Help You
                <span className="block text-[#1d5fbf]">
                  Find The Right Loan
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#98a2b3]">
                Get expert guidance for Home Loans, Personal Loans and other
                financial solutions.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#16b654] px-8 text-[15px] font-semibold text-white no-underline shadow-[0_14px_28px_rgba(22,182,84,0.24)] sm:w-auto"
                >
                  Apply Loan
                </Link>
                <a
                  href={CALL_PHONE.href}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#73d08b] bg-white px-8 text-[15px] font-semibold text-[#16b654] no-underline sm:w-auto"
                >
                  Call Us Now
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <HeroMetric key={stat.value} {...stat} />
                ))}
              </div>
            </div>

            <div className="relative flex min-h-62.5 items-center justify-center lg:min-h-77.5">
              <div className="relative h-82.5 w-full max-w-140">
                <Image
                  src="/assets/contact/contact-hero.png"
                  alt="Fintaraa customer support team"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => (
            <ContactCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5">
            <h2 className="text-[24px] font-extrabold tracking-normal text-[#111827]">
              Get A Free Loan Consultation
            </h2>
            <p className="mt-1 text-[13px] text-[#98a2b3]">
              Fill in your details and our loan expert will contact you
            </p>
          </div>
          <ContactConsultationForm />
        </div>
      </section>

      <Testimonials />

      <section className="px-4 pb-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl rounded-[18px] border border-[#d9eafb] bg-[#eaf4ff] px-5 py-6 shadow-[0_18px_42px_rgba(16,24,40,0.06)] md:px-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              {/* Image Placeholder */}
              <div className="flex h-22.5 w-22.5 shrink-0 items-center justify-center">
                <Image
                  src="/assets/images/help-desk 1.png"
                  alt="Support Agent"
                  width={90}
                  height={90}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[#152033] sm:text-[26px]">
                  Need help choosing the right partner or product?
                </p>
                <p className="mt-1 text-[15px] font-medium text-[#667085]">
                  Connect with our experts and get personalized assistance.
                </p>
              </div>
            </div>

            <a
              href={CALL_PHONE.href}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#16b654] px-7 text-[16px] font-semibold text-white no-underline shadow-[0_16px_30px_rgba(22,182,84,0.24)] transition hover:-translate-y-0.5 hover:bg-[#119b48] sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Talk to Loan Expert
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:px-6 lg:px-8">
        <FaqAccordion />
      </section>

      <AppDownloadBanner />
    </main>
  );
}
