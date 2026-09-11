"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ChevronDown,
  FileCheck2,
  Handshake,
  Mail,
  MapPin,
  MessagesSquare,
  Network,
  PhoneCall,
  Quote,
  Star,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { CALL_PHONE, COMPANY_NAME, OFFICE } from "@/data/company";

const processSteps: Array<{
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    number: "01",
    title: "Share your requirement",
    text: "Tell us the loan type, amount, profile, city, and preferred timeline.",
    icon: MessagesSquare,
  },
  {
    number: "02",
    title: "Submit basic documents",
    text: "We help organise KYC, income, and lender-specific information for verification.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Compare and process",
    text: "Your profile is mapped with partner criteria and moved through approval checks.",
    icon: BadgeCheck,
  },
  {
    number: "04",
    title: "Receive the funds",
    text: "After approval, the application moves to disbursal with clear next-step support.",
    icon: WalletCards,
  },
];

const roadmap: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "AI-based borrower profiling",
    text: "Smarter matching between customer circumstances and practical lender options.",
    icon: BrainCircuit,
  },
  {
    title: "Deeper bank and NBFC partnerships",
    text: "A wider lender network for more choice, better access, and faster movement.",
    icon: Handshake,
  },
  {
    title: "A growing agent and DSA network",
    text: "Stronger on-ground reach across Tier-1, Tier-2, Tier-3, and rural India.",
    icon: Network,
  },
  {
    title: "Specialised financial products",
    text: "Focused solutions for MSMEs, self-employed professionals, and underserved communities.",
    icon: UsersRound,
  },
];

const testimonials = [
  {
    quote:
      "Fintaraa made my home loan process incredibly smooth. The team was professional, and I got the best interest rate.",
    name: "Rahul S.",
    label: "Home loan customer",
  },
  {
    quote:
      "I secured a business loan without any hassle. Their process was quick, and their support team was amazing.",
    name: "Priya M.",
    label: "Business loan customer",
  },
  {
    quote:
      "No hidden charges, clear support, and a team that really cares about customers.",
    name: "Amit K.",
    label: "Fintaraa customer",
  },
];

const faqs = [
  {
    question: "How long does it take to get a loan approved?",
    answer:
      "Approval movement can take as little as 24-48 hours after complete document submission, depending on lender verification, eligibility checks, and the selected product.",
  },
  {
    question: "Can I apply if my CIBIL score is low?",
    answer:
      "Yes. Fintaraa works with multiple lenders and can help explore customised options for profiles that need a more considered eligibility assessment. Final approval remains subject to lender policy.",
  },
  {
    question: "Which types of loans does Fintaraa support?",
    answer:
      "The range includes home, personal, Mudra, business, machinery, new and used car, top-up, balance transfer, and working-capital loans.",
  },
  {
    question: "Is collateral required for every loan?",
    answer:
      "No. Selected personal, business, and working-capital products may be available without collateral. Security requirements depend on the product, amount, profile, and lender terms.",
  },
  {
    question: "Can the application be completed digitally?",
    answer:
      "Yes. Fintaraa supports a digital application and processing journey, with human assistance available for documentation and lender-specific requirements.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "Fintaraa's stated approach is transparent communication before commitment. Applicable lender fees, charges, and repayment terms should be reviewed in the final offer and sanction documents.",
  },
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
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={[
        "text-[30px] font-extrabold leading-[1.2] text-[#0b1f3a] md:text-[35px] lg:text-[38px]",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

export function AboutVision() {
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
      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            {...reveal()}
            className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <div>
              <SectionLabel>How It Works</SectionLabel>
              <SectionHeading>Four clear steps to your loan.</SectionHeading>
            </div>
            <p className="max-w-2xl text-[15px] font-medium leading-8 text-[#5b697d] md:text-[16px] lg:justify-self-end">
              A simple journey with less paperwork, clear communication, and one
              team coordinating the process from the first conversation to
              disbursal.
            </p>
          </motion.div>

          <div className="relative mt-12">
            <span className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.75 bg-[#d7ebf8] md:hidden" />
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease }}
              className="absolute left-[5%] right-[5%] top-5 hidden h-0.75 origin-left bg-[#8fcff0] md:block"
            />
            <div className="relative grid gap-9 md:grid-cols-4 md:gap-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    key={step.number}
                    {...reveal(index * 0.1, 18)}
                    className="relative pl-16 md:pl-0"
                  >
                    <motion.span
                      whileHover={{ scale: 1.08 }}
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#5b21b6] text-white md:relative md:z-10"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </motion.span>
                    <p className="text-[11px] font-extrabold uppercase text-[#2b91cf] md:mt-6">
                      Step {step.number}
                    </p>
                    <h3 className="mt-2 text-[17px] font-extrabold leading-7 text-[#132842] md:text-[18px]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] font-medium leading-6 text-[#66758a] md:text-[14px] md:leading-7">
                      {step.text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#faf5ff] px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div {...reveal()}>
            <SectionLabel>Vision & Belief</SectionLabel>
            <SectionHeading>
              A financially aware and financially stable society.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-8 text-[#59687b] md:text-[16px]">
              Fintaraa believes loans should be planned decisions, not stressful
              surprises. Its role is to help customers choose the right
              financial product at the right time through education, comparison,
              documentation support, and responsible guidance.
            </p>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div className="flex gap-4">
                <span className="mt-1 h-14 w-0.75 shrink-0 bg-[#5b21b6]" />
                <div>
                  <p className="text-[12px] font-extrabold uppercase text-[#5b21b6]">
                    Our vision
                  </p>
                  <p className="mt-2 text-[14px] font-semibold leading-7 text-[#3f5067]">
                    Make reliable financial services more understandable and
                    accessible across India.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 h-14 w-0.75 shrink-0 bg-[#16a3e0]" />
                <div>
                  <p className="text-[12px] font-extrabold uppercase text-[#5b21b6]">
                    Our mission
                  </p>
                  <p className="mt-2 text-[14px] font-semibold leading-7 text-[#3f5067]">
                    Combine technology, lender choice, and personal support in
                    one transparent borrowing journey.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-9 max-w-2xl font-highlight text-[23px] font-semibold italic leading-8 text-[#0b72c9] md:text-[28px] md:leading-9">
              “Money does grow on trees; you need to plant the correct seed at
              the right time.”
            </p>
          </motion.div>

          <motion.div
            {...reveal(0.08)}
            className="relative min-h-110 sm:min-h-140"
          >
            <span
              aria-hidden="true"
              className="absolute right-[4%] top-[5%] h-[82%] w-[83%] bg-[#dff2ff]"
            />
            <motion.div
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.45, ease }}
              className="absolute left-0 top-0 h-[79%] w-[83%] overflow-hidden rounded-md bg-[#dcecf8]"
            >
              <Image
                src="/assets/about/about-home-dream.jpg"
                alt="A family planning a future home"
                fill
                sizes="(min-width: 1024px) 45vw, 84vw"
                className="object-cover object-center"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 1, x: 22, y: 18 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.75, delay: 0.22, ease }}
              className="absolute bottom-0 right-0 h-[43%] w-[52%] overflow-hidden rounded-sm bg-[#dcecf8]"
            >
              <Image
                src="/assets/about/about-mobile-access.jpg"
                alt="Digital financial access through a mobile device"
                fill
                sizes="(min-width: 1024px) 29vw, 53vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
          <motion.div
            {...reveal()}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <SectionLabel>The Road Ahead</SectionLabel>
            <SectionHeading>
              Building a smarter, more inclusive loan ecosystem.
            </SectionHeading>
            <p className="mt-5 max-w-xl text-[15px] font-medium leading-8 text-[#5c6a7e] md:text-[16px]">
              The next phase is focused on scalable technology, stronger
              distribution, deeper lender partnerships, and products designed
              for borrowers who are often underserved.
            </p>

            <div className="mt-9">
              <p className="font-highlight text-[42px] font-bold italic leading-none text-[#5b21b6] md:text-[48px]">
                Rs. 1,000 crore
              </p>
              <p className="mt-3 max-w-sm text-[13px] font-bold leading-6 text-[#52647a]">
                Long-term target for monthly loan disbursals through the
                expanding Fintaraa ecosystem.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
            {roadmap.map(({ title, text, icon: Icon }, index) => (
              <motion.article
                key={title}
                {...reveal(index * 0.07, 18)}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f4ff] text-[#5b21b6]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-highlight text-[23px] font-bold italic text-[#9acff0]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[18px] font-extrabold leading-7 text-[#132842]">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] font-medium leading-7 text-[#657388]">
                  {text}
                </p>
                <span className="mt-6 block h-px w-full bg-[#d7eaf6]" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            {...reveal()}
            className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"
          >
            <div>
              <SectionLabel>Client Voices</SectionLabel>
              <SectionHeading>
                Trust, reflected in real journeys.
              </SectionHeading>
            </div>
            <p className="max-w-2xl text-[15px] font-medium leading-8 text-[#5d6b7f] md:text-[16px] lg:justify-self-end">
              Customers value a process that is responsive, transparent, and
              supported by people who remain available when questions arise.
            </p>
          </motion.div>

          <div className="mt-11 grid gap-9 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                {...reveal(index * 0.09, 18)}
                whileHover={{ y: -4 }}
              >
                <Quote className="h-8 w-8 text-[#9fd3ef]" />
                <div className="mt-4 flex gap-1 text-[#178bd0]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-3.5 w-3.5 fill-current"
                      strokeWidth={1.8}
                    />
                  ))}
                </div>
                <p className="mt-5 text-[14px] font-semibold leading-7 text-[#34465d] md:text-[15px] md:leading-8">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="mt-6 text-[16px] font-extrabold text-[#102640]">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-[12px] font-bold text-[#6a788b]">
                  {testimonial.label}
                </p>
                <span className="mt-6 block h-px w-full bg-[#d9eaf6]" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6fbff] px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-11 lg:grid-cols-[0.58fr_1.42fr] lg:gap-16">
          <motion.div
            {...reveal()}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <SectionLabel>Quick Answers</SectionLabel>
            <SectionHeading>Common questions, clearly answered.</SectionHeading>
            <p className="mt-5 max-w-md text-[14px] font-medium leading-7 text-[#607085] md:text-[15px]">
              Product eligibility and final terms always depend on the selected
              lender and the customer&apos;s verified profile.
            </p>
          </motion.div>

          <motion.div {...reveal(0.06)}>
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group py-5 [&>summary::-webkit-details-marker]:hidden"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="text-[16px] font-extrabold leading-7 text-[#132842] md:text-[17px]">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e2f2ff] text-[#5b21b6]">
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl pr-10 text-[14px] font-medium leading-7 text-[#657388] md:text-[15px] md:leading-8">
                  {faq.answer}
                </p>
                <span className="mt-5 block h-px w-full bg-[#d6e9f6]" />
              </details>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#e8f5ff] px-4 py-14 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-11 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-16">
          <motion.div {...reveal()}>
            <SectionLabel>Start A Conversation</SectionLabel>
            <SectionHeading className="max-w-3xl">
              Choose a financial partner that stays with you.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-8 text-[#52647a] md:text-[16px]">
              Share your requirement and speak with a Fintaraa expert about the
              loan options that may fit your next milestone.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/products"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#5b21b6] px-6 text-[14px] font-extrabold text-white no-underline transition-colors hover:bg-[#064ebd] sm:w-auto"
                >
                  Explore Loan Options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={CALL_PHONE.href}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-6 text-[14px] font-extrabold text-[#5b21b6] no-underline transition-colors hover:bg-[#f8fcff] sm:w-auto"
                >
                  <PhoneCall className="h-4 w-4" />
                  Talk to an Expert
                </a>
              </motion.div>
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <a
                href="mailto:customercare@fintaraa.com"
                className="flex items-start gap-3 text-[#213750] no-underline"
              >
                <Mail className="mt-1 h-4.5 w-4.5 shrink-0 text-[#5b21b6]" />
                <span className="text-[13px] font-bold leading-6">
                  customercare@fintaraa.com
                </span>
              </a>
              <a
                href={CALL_PHONE.href}
                className="flex items-start gap-3 text-[#213750] no-underline"
              >
                <PhoneCall className="mt-1 h-4.5 w-4.5 shrink-0 text-[#5b21b6]" />
                <span className="text-[13px] font-bold leading-6">
                  {CALL_PHONE.display}
                </span>
              </a>
              <a
                href={OFFICE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-inherit no-underline"
              >
                <MapPin className="mt-1 h-4.5 w-4.5 shrink-0 text-[#5b21b6]" />
                <p className="text-[12px] font-semibold leading-6 text-[#4f6278] md:text-[13px]">
                  {COMPANY_NAME}: {OFFICE.address}
                </p>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 1.025 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease }}
            className="relative min-h-90 overflow-hidden rounded-md bg-[#dcecf8] sm:min-h-115"
          >
            <Image
              src="/assets/about/about-mobile-access.jpg"
              alt="A customer accessing financial services from a mobile phone"
              fill
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
