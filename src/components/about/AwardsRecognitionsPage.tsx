import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Handshake,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const recognitionPillars = [
  {
    title: "Customer-first service",
    text: "Clear guidance, transparent journeys, and practical help at each step.",
    icon: UsersRound,
  },
  {
    title: "Partner confidence",
    text: "A growing network built around responsible product discovery and fulfilment.",
    icon: Handshake,
  },
  {
    title: "Responsible processes",
    text: "Secure handling, documented workflows, and compliance-led operations.",
    icon: ShieldCheck,
  },
];

const milestones = [
  {
    value: "2016",
    label: "The Fintaraa journey began with a customer-first lending vision.",
  },
  {
    value: "100+",
    label: "Banks and lending partners represented across the network.",
  },
  {
    value: "Digital + assisted",
    label: "A blended journey that combines technology with human support.",
  },
];

export function AwardsRecognitionsPage() {
  return (
    <main className="bg-white">
      <section className="overflow-hidden bg-[linear-gradient(135deg,#071f3e_0%,#075cde_62%,#088c58_135%)] px-4 py-14 text-white md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#b7e2ff]">
              <Award className="h-4 w-4" />
              Awards & recognitions
            </p>
            <h1 className="mt-4 max-w-4xl text-[36px] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-[46px] lg:text-[58px]">
              Recognition built on trust, service, and lasting partnerships
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] font-medium leading-7 text-white/80 md:text-[17px]">
              We value every milestone that reflects stronger customer
              outcomes, responsible financial guidance, and confidence from
              our lending and service partners.
            </p>
          </div>

          <div className="relative mx-auto flex min-h-72 w-full max-w-md items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-full border border-white/25 bg-white/10 text-center shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#075cde] shadow-lg">
                <Award className="h-8 w-8" />
              </span>
              <p className="mt-5 text-[21px] font-extrabold">
                Customer trust
              </p>
              <p className="mt-1 text-[12px] font-bold text-white/70">
                Our most meaningful recognition
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="max-w-3xl">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#075cde]">
              What recognition means to us
            </p>
            <h2 className="mt-3 text-[29px] font-extrabold tracking-[-0.03em] text-[#102c45] md:text-[39px]">
              Standards we work to earn every day
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {recognitionPillars.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="rounded-3xl border border-[#e0eaf3] bg-[#f8fbff] p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#075cde] shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[18px] font-extrabold text-[#102c45]">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] font-medium leading-6 text-[#667b8f]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f8fc] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0a9658] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-[28px] font-extrabold tracking-[-0.03em] text-[#102c45] md:text-[36px]">
                Milestones that shape our journey
              </h2>
              <p className="mt-3 text-[14px] font-medium leading-7 text-[#657a8f]">
                These company milestones reflect the scale, continuity, and
                service model behind Fintaraa.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {milestones.map((milestone) => (
                <article
                  key={milestone.value}
                  className="rounded-3xl border border-[#dfe9f2] bg-white p-6"
                >
                  <BadgeCheck className="h-5 w-5 text-[#0a9658]" />
                  <p className="mt-4 text-[24px] font-extrabold text-[#075cde]">
                    {milestone.value}
                  </p>
                  <p className="mt-2 text-[12px] font-medium leading-5 text-[#677c90]">
                    {milestone.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#102c45] p-7 text-white md:flex-row md:items-center md:p-9">
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
        </div>
      </section>
    </main>
  );
}
