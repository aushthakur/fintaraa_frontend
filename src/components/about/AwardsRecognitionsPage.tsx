import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { WebsiteKnowledgeItem } from "@/services/websiteKnowledge";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarCheck2,
  FileBadge2,
  Handshake,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const recognitionHighlights: Array<{
  label: string;
  value: string;
  title: string;
  text: string;
  icon: LucideIcon;
  imageUrl?: string;
}> = [
  {
    label: "Company milestone",
    value: "Since 2016",
    title: "A sustained customer-first journey",
    text: "Fintaraa has continued to develop its assisted financial-product discovery and application experience.",
    icon: CalendarCheck2,
  },
  {
    label: "Partner ecosystem",
    value: "100+",
    title: "Banks and lending partners",
    text: "A broad partner network helps customers explore products suited to different financial profiles and needs.",
    icon: Handshake,
  },
  {
    label: "Service recognition",
    value: "Digital + assisted",
    title: "Technology backed by human support",
    text: "Customers can move through a digital journey while receiving help with eligibility, documentation, and next steps.",
    icon: Sparkles,
  },
];

const certificateCategories: Array<{
  title: string;
  text: string;
  status: string;
  icon: LucideIcon;
}> = [
  {
    title: "Corporate credentials",
    text: "Verified company-registration records and operating-identity documents belong in this collection.",
    status: "Verification details to be published",
    icon: Building2,
  },
  {
    title: "Information-security certificates",
    text: "Issuer, certification scope, certificate number, and validity dates will be shown with each approved record.",
    status: "Verified document required",
    icon: ShieldCheck,
  },
  {
    title: "Partner and compliance credentials",
    text: "Partner-level registrations will be clearly distinguished from credentials issued directly to Fintaraa.",
    status: "Partner scope will be identified",
    icon: Landmark,
  },
];

function PageOption({
  href,
  title,
  text,
  icon: Icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      className="group flex min-h-32 items-start gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/15"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#075cde]">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="flex items-center gap-2 text-[17px] font-extrabold">
          {title}
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
        </span>
        <span className="mt-1 block text-[12px] font-medium leading-5 text-white/70">
          {text}
        </span>
      </span>
    </a>
  );
}

export function AwardsRecognitionsPage({
  awards = [],
}: {
  awards?: WebsiteKnowledgeItem[];
}) {
  const displayHighlights = awards.length
    ? awards.slice(0, 12).map((item) => ({
        label: item.category || "Award / achievement",
        value: item.publishedAt
          ? new Date(item.publishedAt).getFullYear().toString()
          : "Recognition",
        title: item.title,
        text:
          item.summary ||
          item.excerpt ||
          "A Fintaraa award, achievement, or company milestone.",
        icon: Award,
        imageUrl: item.coverImageUrl,
      }))
    : recognitionHighlights;

  return (
    <main className="bg-white text-[#102c45]">
      <section className="overflow-hidden bg-[linear-gradient(135deg,#071f3e_0%,#075cde_68%,#078856_140%)] px-4 py-14 text-white md:px-6 md:py-18 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#b7e2ff]">
              <Award className="h-4 w-4" />
              Awards &amp; recognitions
            </p>
            <h1 className="mt-4 max-w-4xl text-[36px] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-[46px] lg:text-[56px]">
              Milestones, recognition, and verified credentials
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] font-medium leading-7 text-white/80 md:text-[17px]">
              Explore Fintaraa&apos;s recognition highlights and the dedicated
              certificate register. Formal credentials are published only with
              clear issuer, scope, and verification details.
            </p>
          </div>

          <nav
            aria-label="Awards and certificates"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            <PageOption
              href="#awards"
              title="Awards & recognitions"
              text="View service milestones and recognition highlights."
              icon={Award}
            />
            <PageOption
              href="#certificates"
              title="Certificates"
              text="View certificate categories and verification status."
              icon={FileBadge2}
            />
          </nav>
        </div>
      </section>

      <section
        id="awards"
        aria-labelledby="awards-heading"
        className="scroll-mt-28 px-4 py-14 md:px-6 md:py-18 lg:px-8"
      >
        <div className="mx-auto max-w-9xl">
          <div className="max-w-3xl">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#075cde]">
              Recognition highlights
            </p>
            <h2
              id="awards-heading"
              className="mt-3 text-[29px] font-extrabold tracking-[-0.03em] text-[#102c45] md:text-[39px]"
            >
              Progress worth recognising
            </h2>
            <p className="mt-4 text-[14px] font-medium leading-7 text-[#657a8f] md:text-[15px]">
              These are company and service milestones, presented separately
              from independently issued awards or certificates.
            </p>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {displayHighlights.map(
              ({ label, value, title, text, icon: Icon, imageUrl }) => (
                <article
                  key={title}
                  className="flex h-full flex-col rounded-3xl border border-[#dce8f2] bg-[#f8fbff] p-6 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white text-[#075cde] shadow-sm">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#075cde]">
                      {label}
                    </span>
                  </div>
                  <p className="mt-7 text-[24px] font-extrabold text-[#075cde]">
                    {value}
                  </p>
                  <h3 className="mt-2 text-[19px] font-extrabold leading-7 text-[#102c45]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[13px] font-medium leading-6 text-[#667b8f]">
                    {text}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="certificates"
        aria-labelledby="certificates-heading"
        className="scroll-mt-28 bg-[#f3f8fc] px-4 py-14 md:px-6 md:py-18 lg:px-8"
      >
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#087d50]">
                Certificate register
              </p>
              <h2
                id="certificates-heading"
                className="mt-3 text-[29px] font-extrabold tracking-[-0.03em] text-[#102c45] md:text-[39px]"
              >
                Certificates &amp; credentials
              </h2>
            </div>
            <div className="rounded-2xl border border-[#cfe2ef] bg-white p-5">
              <p className="flex items-start gap-3 text-[13px] font-semibold leading-6 text-[#536b7f]">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#087d50]" />
                Only verified records should appear as certificates. Each
                published item will identify its issuer, holder, scope,
                reference number, issue date, and validity period.
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {certificateCategories.map(
              ({ title, text, status, icon: Icon }) => (
                <article
                  key={title}
                  className="flex min-h-72 flex-col rounded-3xl border border-[#d9e6ef] bg-white p-6"
                >
                  <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e9f7f1] text-[#087d50]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-[19px] font-extrabold leading-7 text-[#102c45]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[13px] font-medium leading-6 text-[#667b8f]">
                    {text}
                  </p>
                  <p className="mt-auto border-t border-[#e0eaf1] pt-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#087d50]">
                    {status}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl flex-col items-start justify-between gap-5 rounded-3xl bg-[#102c45] p-7 text-white md:flex-row md:items-center md:p-9">
          <div>
            <h2 className="text-[23px] font-extrabold">
              Learn more about Fintaraa
            </h2>
            <p className="mt-2 text-[13px] font-medium text-white/70">
              Explore our story, leadership, values, and customer-first
              approach.
            </p>
          </div>
          <Link
            href="/about-us"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[12px] font-extrabold text-[#075cde] no-underline"
          >
            Visit About Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
