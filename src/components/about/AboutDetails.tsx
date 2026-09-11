"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Car,
  Check,
  Factory,
  HandCoins,
  Home,
  Landmark,
  RefreshCw,
} from "lucide-react";

const standOut: Array<{
  title: string;
  text: string;
}> = [
  {
    title: "End-to-end digital process",
    text: "Apply, share details, submit documents, and stay informed through a guided digital journey.",
  },
  {
    title: "Pre-approved loan offers",
    text: "Eligible profiles can move faster through lender checks and documentation stages.",
  },
  {
    title: "No-collateral options",
    text: "Selected personal, business, and working-capital products are available without security.",
  },
  {
    title: "Personalised consultation",
    text: "Experts help assess eligibility, repayment comfort, and lender fit before an application is placed.",
  },
  {
    title: "Dedicated relationship managers",
    text: "One point of contact coordinates the application from requirement sharing to disbursal.",
  },
];

const loanServices: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "Home Loan",
    text: "Purchase, construction, and balance-transfer support with rates starting from 8.10%*.",
    icon: Home,
  },
  {
    title: "Personal Loan",
    text: "Quick unsecured funding for planned expenses and important life moments.",
    icon: HandCoins,
  },
  {
    title: "Mudra Loan",
    text: "Government-backed credit support for micro and small enterprises.",
    icon: Landmark,
  },
  {
    title: "Business Loan",
    text: "Growth capital for expansion, inventory, and operations, without collateral in eligible cases.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Machinery Loan",
    text: "Finance for new equipment, technology upgrades, and increased production capacity.",
    icon: Factory,
  },
  {
    title: "New & Used Car Loan",
    text: "Finance up to 90% of vehicle value, subject to lender and profile eligibility.",
    icon: Car,
  },
  {
    title: "Top-Up Loan",
    text: "Additional funding over an existing loan when financial needs grow.",
    icon: BadgeCheck,
  },
  {
    title: "Balance Transfer",
    text: "Move an eligible high-interest loan to improve rates or repayment comfort.",
    icon: RefreshCw,
  },
  {
    title: "Working Capital Loan",
    text: "Short-term funding that helps businesses protect cash flow and daily operations.",
    icon: Building2,
  },
];

const audiences = [
  {
    title: "Individuals & families",
    text: "For a first home, a vehicle, personal priorities, or a better repayment structure.",
    image: "/assets/about/about-home-dream.jpg",
    alt: "A family planning their future home",
  },
  {
    title: "MSMEs & growing businesses",
    text: "For machinery, expansion, inventory, working capital, and the next stage of scale.",
    image: "/assets/about/about-machinery-loan.jpg",
    alt: "Industrial machinery financed for business growth",
  },
  {
    title: "Entrepreneurs & self-employed",
    text: "For founders and professionals who need a lender match built around a nuanced profile.",
    image: "/assets/about/about-personal-advisor.jpg",
    alt: "A financial advisor guiding a self-employed customer",
  },
];

const digitalEdge = [
  {
    title: "100% digital application and processing",
    text: "Apply online from anywhere and complete the journey with guided assistance.",
  },
  {
    title: "Transparent terms and flexible repayment",
    text: "Understand charges, repayment choices, and lender requirements before committing.",
  },
  {
    title: "A wide financial product range",
    text: "Access solutions from small personal requirements to large commercial needs.",
  },
  {
    title: "Expert advisory with human support",
    text: "Professional help remains available through eligibility, documentation, and disbursal.",
  },
  {
    title: "Pan-India reach",
    text: "A growing network extends access across metros, smaller cities, and underserved communities.",
  },
];

const differentiators = [
  "Approval movement within 24-48 hours after successful document verification",
  "Minimal documentation with fewer repetitive paperwork loops",
  "Multi-lender tie-ups to improve the chance of a suitable match",
  "Tailored solutions based on income, repayment ability, and financial goals",
  "Flexible EMI options designed around repayment comfort",
  "Doorstep document support where operationally available",
  "Profile expertise for borrowers with complex eligibility requirements",
  "Competitive offers made possible through lender partnerships",
  "Clear communication with no hidden charges before commitment",
  "Post-loan help for repayment, pre-closure, and future financing needs",
];

const scaleStats = [
  { value: "650+", label: "Delhi NCR reach" },
  { value: "2,50,000+", label: "Families served" },
  { value: "1,25,000+", label: "Applications processed" },
  { value: "100+", label: "Lending partners" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">{children}</span>
  );
}

function SectionHeading({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={[
        "text-[30px] font-extrabold leading-[1.2] text-[#0b1f3a] md:text-[35px] lg:text-[38px]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

export function AboutDetails() {
  const reveal = (delay = 0, y = 22) => ({
    initial: { opacity: 1, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: {
      duration: 0.7,
      delay,
      ease,
    },
  });

  return (
    <>
      <section className="overflow-hidden bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16">
          <motion.div
            {...reveal()}
            className="relative min-h-107.5 sm:min-h-130"
          >
            <span
              aria-hidden="true"
              className="absolute left-[7%] top-[6%] h-[78%] w-[77%] bg-[#eaf6ff]"
            />
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.45, ease }}
              className="absolute right-0 top-0 h-[76%] w-[80%] overflow-hidden rounded-md bg-[#dcecf8]"
            >
              <Image
                src="/assets/about/about-growth-city.jpg"
                alt="Modern Indian business growth and opportunity"
                fill
                sizes="(min-width: 1024px) 45vw, 80vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 1, x: -24, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.75,
                delay: 0.2,
                ease,
              }}
              className="absolute bottom-0 left-0 h-[46%] w-[57%] overflow-hidden rounded-sm bg-[#d8e9f6]"
            >
              <Image
                src="/assets/about/about-customer-guidance.jpg"
                alt="One-to-one customer guidance from a financial professional"
                fill
                sizes="(min-width: 1024px) 30vw, 58vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>

          <motion.div {...reveal(0.08)}>
            <SectionLabel>Our Story</SectionLabel>
            <SectionHeading>
              Built to make borrowing feel clear, personal, and possible.
            </SectionHeading>
            <p className="mt-6 text-[15px] font-medium leading-8 text-[#59677a] md:text-[16px]">
              Founded in 2016, Fintaraa is a next-generation loan facilitation
              platform under Xpertserve Services Pvt. Ltd. It was created to
              simplify a process that often feels fragmented, paperwork-heavy,
              and difficult to understand.
            </p>
            <p className="mt-4 text-[15px] font-medium leading-8 text-[#59677a] md:text-[16px]">
              Technology brings speed and access; experienced advisors bring
              judgement and context. Together, they help customers compare
              lender options, prepare stronger applications, and make more
              informed borrowing decisions.
            </p>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div className="flex gap-4">
                <span className="mt-1 h-12 w-0.75 shrink-0 bg-[#5b21b6]" />
                <div>
                  <p className="text-[18px] font-extrabold text-[#0b1f3a]">
                    Customer first
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-6 text-[#66758a]">
                    Advice shaped around profile, purpose, and repayment
                    comfort.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 h-12 w-0.75 shrink-0 bg-[#16a3e0]" />
                <div>
                  <p className="text-[18px] font-extrabold text-[#0b1f3a]">
                    One guided journey
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-6 text-[#66758a]">
                    Support from the first question through final disbursal.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        aria-labelledby="why-fintaraa-heading"
        className="bg-[#f6fbff] px-4 py-16 md:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-9xl">
          <motion.div {...reveal()} className="max-w-3xl">
            <SectionLabel>Built Around You</SectionLabel>
            <SectionHeading id="why-fintaraa-heading">
              Why Fintaraa stands out.
            </SectionHeading>
            <p className="mt-5 max-w-xl text-[15px] font-medium leading-8 text-[#5a687b] md:text-[16px]">
              A technology-led platform should still feel human. Fintaraa
              combines fast digital processing with relationship-led support for
              India&apos;s varied borrower profiles.
            </p>
          </motion.div>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#d8e9f6] bg-[#d8e9f6] sm:grid-cols-2 xl:grid-cols-5">
            {standOut.map(({ title, text }, index) => (
              <motion.article
                key={title}
                {...reveal(index * 0.06, 18)}
                whileHover={{ y: -3 }}
                className="min-h-56 bg-white p-6 sm:last:col-span-2 xl:last:col-span-1 xl:min-h-64"
              >
                <h3 className="text-[18px] font-extrabold leading-7 text-[#132842]">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] font-medium leading-7 text-[#637186] md:text-[15px]">
                  {text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            {...reveal()}
            className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <div>
              <SectionLabel>Our Loan Services</SectionLabel>
              <SectionHeading className="max-w-xl">
                One platform for every financial milestone.
              </SectionHeading>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-2xl text-[15px] font-medium leading-8 text-[#5d6b7f] md:text-[16px]">
                From a home or vehicle to business expansion, equipment, and
                cash flow, Fintaraa brings multiple borrowing needs into one
                guided experience.
              </p>
              <p className="mt-2 max-w-2xl text-[12px] font-semibold leading-5 text-[#7a8798]">
                *Rates and terms vary by lender, borrower profile,
                documentation, and applicable policy.
              </p>
            </div>
          </motion.div>

          <div className="relative mt-11">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[10%] top-[10%] bg-[#eaf6ff]"
            />
            <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {[
                {
                  src: "/assets/about/about-home-loan.jpg",
                  label: "Home",
                  alt: "Home loan support",
                },
                {
                  src: "/assets/about/about-personal-loan.jpg",
                  label: "Personal",
                  alt: "Personal loan planning",
                },
                {
                  src: "/assets/about/about-car-loan.jpg",
                  label: "Vehicle",
                  alt: "Car loan financing",
                },
                {
                  src: "/assets/about/about-machinery-loan.jpg",
                  label: "Business",
                  alt: "Machinery financing",
                },
              ].map((image, index) => (
                <motion.figure
                  key={image.src}
                  {...reveal(index * 0.07, 20)}
                  className={index % 2 === 1 ? "pt-5 lg:pt-8" : ""}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.35, ease }}
                    className="relative aspect-4/3 overflow-hidden rounded-[5px] bg-[#dcecf8]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 24vw, 48vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </motion.div>
                  <figcaption className="mt-3 text-[12px] font-extrabold uppercase text-[#5b21b6] md:text-[13px]">
                    {image.label} finance
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          <div className="mt-13 grid gap-x-9 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {loanServices.map(({ title, text, icon: Icon }, index) => (
              <motion.article
                key={title}
                {...reveal(index * 0.035, 16)}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf7ff] text-[#5b21b6] transition-colors group-hover:bg-[#d9eeff]">
                    <Icon className="h-4.75 w-4.75" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-extrabold leading-7 text-[#132842]">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] font-medium leading-6 text-[#66758a] md:text-[14px]">
                      {text}
                    </p>
                  </div>
                </div>
                <span className="mt-6 block h-px w-full bg-[#d9eaf6]" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div {...reveal()} className="max-w-3xl">
            <SectionLabel>Who We Serve</SectionLabel>
            <SectionHeading>
              Financial guidance for different ambitions.
            </SectionHeading>
            <p className="mt-5 text-[15px] font-medium leading-8 text-[#5b697d] md:text-[16px]">
              Lending is not one-size-fits-all. Every recommendation starts with
              the customer&apos;s purpose, profile, and practical ability to
              repay.
            </p>
          </motion.div>

          <div className="mt-11 grid gap-9 md:grid-cols-3">
            {audiences.map((audience, index) => (
              <motion.article
                key={audience.title}
                {...reveal(index * 0.09, 20)}
              >
                <motion.div
                  whileHover={{ scale: 1.018 }}
                  transition={{ duration: 0.45, ease }}
                  className="relative aspect-4/3 overflow-hidden rounded-[5px] bg-[#e5f1f9]"
                >
                  <Image
                    src={audience.image}
                    alt={audience.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="mt-5 flex gap-4">
                  <span className="font-highlight text-[26px] font-bold italic leading-none text-[#68b7e7]">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-[18px] font-extrabold leading-7 text-[#112640]">
                      {audience.title}
                    </h3>
                    <p className="mt-2 text-[14px] font-medium leading-7 text-[#657388]">
                      {audience.text}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#faf5ff] px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16">
          <motion.div
            {...reveal()}
            className="relative min-h-107.5 sm:min-h-135"
          >
            <motion.div
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.45, ease }}
              className="absolute left-0 top-0 h-[76%] w-[84%] overflow-hidden rounded-md bg-[#dcecf8]"
            >
              <Image
                src="/assets/about/about-digital-workspace.jpg"
                alt="Digital loan processing and advisory workspace"
                fill
                sizes="(min-width: 1024px) 45vw, 85vw"
                className="object-cover"
              />
            </motion.div>
            <span
              aria-hidden="true"
              className="absolute bottom-[4%] right-[3%] h-[44%] w-[51%] bg-[#d8f3ff]"
            />
            <motion.div
              initial={{ opacity: 1, x: 24, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.75,
                delay: 0.22,
                ease,
              }}
              className="absolute bottom-0 right-0 h-[42%] w-[49%] overflow-hidden rounded-sm bg-[#dcecf8]"
            >
              <Image
                src="/assets/about/about-credit-profile.jpg"
                alt="Digital credit profile displayed on a mobile phone"
                fill
                sizes="(min-width: 1024px) 27vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div {...reveal(0.08)}>
            <SectionLabel>Our Digital Edge</SectionLabel>
            <SectionHeading>
              Faster technology, backed by real people.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-8 text-[#5c6a7e] md:text-[16px]">
              Digital processing reduces delays and unnecessary paperwork. Human
              guidance keeps the experience understandable, compliant, and
              personal at every important decision.
            </p>

            <div className="mt-8 grid gap-5">
              {digitalEdge.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 1, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.55 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                    ease,
                  }}
                  className="flex gap-4"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dff1ff] text-[#5b21b6]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-extrabold leading-7 text-[#132842] md:text-[17px]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-medium leading-6 text-[#657388] md:text-[14px]">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-11 lg:grid-cols-[0.66fr_1.34fr] lg:gap-16">
          <motion.div
            {...reveal()}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <SectionLabel>No Surprises. Just Support.</SectionLabel>
            <SectionHeading>The difference is in the details.</SectionHeading>
            <p className="mt-5 max-w-xl text-[15px] font-medium leading-8 text-[#5b697d] md:text-[16px]">
              We help customers compare practical options from multiple lenders
              and understand the complete journey before moving forward.
            </p>
          </motion.div>

          <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {differentiators.map((item, index) => (
              <motion.div key={item} {...reveal(index * 0.035, 15)}>
                <div className="flex gap-4">
                  <span className="font-highlight text-[25px] font-bold italic leading-7 text-[#4ca9df]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] font-bold leading-7 text-[#26384f] md:text-[15px]">
                    {item}
                  </p>
                </div>
                <span className="mt-5 block h-px w-full bg-[#d8eaf6]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf6ff] px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease }}
            className="h-0.75 origin-left bg-[#5b21b6]"
          />
          <div className="grid gap-x-8 gap-y-9 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {scaleStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                {...reveal(index * 0.07, 16)}
              >
                <p className="text-[29px] font-extrabold leading-none text-[#5b21b6] md:text-[35px]">
                  {stat.value}
                </p>
                <p className="mt-3 text-[13px] font-bold leading-6 text-[#40536b] md:text-[14px]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="max-w-3xl mx-auto text-center text-[12px] font-semibold leading-5 text-[#687b90]">
            Scale indicators are presented from the supplied Fintaraa company
            profile and reflect the organisation&apos;s stated network and
            service footprint.
          </p>
        </div>
      </section>
    </>
  );
}
