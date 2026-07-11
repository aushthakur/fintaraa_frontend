"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const bands = [
  {
    range: "300 - 549",
    label: "Poor",
    text: "Approval options may be limited until the profile improves.",
    bar: "bg-[#ef5b47]",
    surface: "bg-[#fff5f2]",
    accent: "text-[#b83224]",
  },
  {
    range: "550 - 649",
    label: "Average",
    text: "Some lenders may offer credit with tighter terms.",
    bar: "bg-[#efb42f]",
    surface: "bg-[#fff9e9]",
    accent: "text-[#9a6700]",
  },
  {
    range: "650 - 749",
    label: "Good",
    text: "A reliable profile can support wider borrowing options.",
    bar: "bg-[#69c66c]",
    surface: "bg-[#f2fbf2]",
    accent: "text-[#287a36]",
  },
  {
    range: "750 - 900",
    label: "Excellent",
    text: "A strong profile can improve access to competitive offers.",
    bar: "bg-[#079455]",
    surface: "bg-[#edf9f3]",
    accent: "text-[#067647]",
  },
];

const steps = [
  {
    number: "01",
    eyebrow: "Start securely",
    title: "Enter your mobile number",
    text: "Use the mobile number linked to your active financial accounts.",
    icon: Smartphone,
    surface: "bg-[#e7f2ff]",
    color: "text-[#075cde]",
  },
  {
    number: "02",
    eyebrow: "Verify consent",
    title: "Confirm the OTP",
    text: "Complete a secure one-time verification before the report is fetched.",
    icon: KeyRound,
    surface: "bg-[#edf9f3]",
    color: "text-[#07845e]",
  },
  {
    number: "03",
    eyebrow: "View your profile",
    title: "Get your CIBIL score",
    text: "Review your latest score and the factors shaping your credit health.",
    icon: Gauge,
    surface: "bg-[#fff7e8]",
    color: "text-[#b8750b]",
  },
];

export function CibilBandsSteps() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-[#f2f8fc] px-4 py-14 md:px-6 md:py-18 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(380px,0.78fr)] lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0.95, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#075cde]">
                <Gauge className="h-4 w-4" aria-hidden="true" />
                Credit score basics
              </p>
              <h2 className="mt-3 max-w-xl text-[28px] font-bold leading-[1.16] text-[#102f49] sm:text-[34px]">
                Understanding CIBIL Score
              </h2>
              <p className="mt-4 max-w-xl text-[14px] font-medium leading-7 text-[#587287] md:text-[15px]">
                A CIBIL score is a three-digit summary of your creditworthiness.
                It generally ranges from 300 to 900 and helps lenders assess how
                consistently you have managed credit.
              </p>

              <dl className="mt-7 grid max-w-xl grid-cols-3 border-y border-[#cfe2ef] bg-white">
                {[
                  ["Score range", "300 - 900"],
                  ["Strong profile", "750+"],
                  ["Format", "3 digits"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={`min-w-0 px-3 py-4 ${
                      index > 0 ? "border-l border-[#cfe2ef]" : ""
                    }`}
                  >
                    <dt className="text-[10px] font-semibold uppercase leading-4 text-[#7890a2]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-bold text-[#0b3d63]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.95, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[520px]"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="relative aspect-[1.82] w-full">
                  <Image
                    src="/assets/images/cibil-gauge-graphic.png"
                    alt="CIBIL score range from poor to excellent"
                    fill
                    sizes="(max-width: 1024px) 90vw, 520px"
                    className="object-contain"
                  />
                </div>
                <p className="mx-auto -mt-2 max-w-sm text-center text-[12px] font-semibold leading-5 text-[#657f92]">
                  Higher scores generally indicate stronger repayment behaviour and
                  lower perceived credit risk.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bands.map((item, index) => (
              <motion.article
                key={item.range}
                initial={{ opacity: 0.95, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  duration: 0.48,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`overflow-hidden rounded-lg border border-[#d7e7f0] ${item.surface}`}
              >
                <div className={`h-1.5 w-full ${item.bar}`} />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[17px] font-bold text-[#102f49]">
                      {item.range}
                    </p>
                    <span className={`text-[11px] font-bold uppercase ${item.accent}`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] font-medium leading-5 text-[#5c7487]">
                    {item.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase text-[#075cde]">
                Simple and secure
              </p>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.16] text-[#102f49] sm:text-[34px]">
                Check your CIBIL score in 3 easy steps
              </h2>
              <p className="mt-3 text-[14px] font-medium leading-6 text-[#5c7487] md:text-[15px]">
                Complete a consent-led verification and access your latest credit
                profile without affecting your score.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#557086]">
              <LockKeyhole className="h-4 w-4 text-[#07845e]" aria-hidden="true" />
              Secure bureau verification
            </div>
          </div>

          <div className="relative mt-10">
            <div className="absolute left-[16.5%] right-[16.5%] top-7 hidden h-px bg-[#bfd9e8] md:block" />
            <div className="relative grid gap-5 md:grid-cols-3">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.number}
                    initial={{ opacity: 0.95, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative rounded-lg border border-[#d9e7f0] bg-white p-5 md:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#d6e6f0] bg-white text-[16px] font-bold text-[#075cde]">
                        {item.number}
                      </span>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.surface} ${item.color}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <p className={`mt-6 text-[10px] font-bold uppercase ${item.color}`}>
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 text-[17px] font-bold leading-snug text-[#102f49]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] font-medium leading-6 text-[#60788b]">
                      {item.text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-6 border-y border-[#d9e7f0] py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["No score impact", ShieldCheck],
                ["Secure consent", LockKeyhole],
                ["Credit report access", BadgeCheck],
              ].map(([label, Icon]) => {
                const SafeIcon = Icon as typeof ShieldCheck;
                return (
                  <span
                    key={label as string}
                    className="flex items-center gap-2 text-[12px] font-semibold text-[#46657b]"
                  >
                    <SafeIcon className="h-4 w-4 text-[#07845e]" aria-hidden="true" />
                    {label as string}
                  </span>
                );
              })}
            </div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/cibil-score/report"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#075cde] px-6 text-[14px] font-bold text-white no-underline transition-colors hover:bg-[#064cb8] sm:w-auto"
              >
                Get free credit score
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
