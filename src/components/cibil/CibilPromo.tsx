"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  FileChartColumn,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Secure and private",
    desc: "Consent-led access with protected account information.",
    icon: LockKeyhole,
    surface: "bg-[#e7f2ff]",
    color: "text-[#075cde]",
  },
  {
    title: "Instant result",
    desc: "Fetch the latest available score after verification.",
    icon: Zap,
    surface: "bg-[#fff8e5]",
    color: "text-[#9a6700]",
  },
  {
    title: "Detailed report",
    desc: "Review the signals influencing your current profile.",
    icon: FileChartColumn,
    surface: "bg-[#f5efff]",
    color: "text-[#7c4bc1]",
  },
  {
    title: "No score impact",
    desc: "Checking your own credit report does not reduce the score.",
    icon: ShieldCheck,
    surface: "bg-[#edf9f3]",
    color: "text-[#07845e]",
  },
];

export function CibilPromo() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-[#eef7fc] px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0.95, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#075cde]">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Credit health, simplified
            </p>
            <h2 className="mt-3 max-w-2xl text-[28px] font-bold leading-[1.16] text-[#102f49] sm:text-[34px]">
              Turn your credit score into clearer financial decisions
            </h2>
            <p className="mt-4 max-w-2xl text-[14px] font-medium leading-7 text-[#587287] md:text-[15px]">
              Access your CIBIL score and report, understand where your profile
              stands and prepare more confidently for future credit applications.
            </p>

            <div className="mt-8 grid border-t border-[#c7dfec] sm:grid-cols-2">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0.95, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`flex gap-3 border-b border-[#c7dfec] py-5 sm:px-5 ${
                      index % 2 === 0 ? "sm:border-r sm:pl-0" : "sm:pr-0"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.surface} ${item.color}`}>
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#102f49]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium leading-5 text-[#60788b]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/cibil-score/report"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#075cde] px-6 text-[14px] font-bold text-white no-underline transition-colors hover:bg-[#064cb8] sm:w-auto"
                >
                  Check my CIBIL score
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
              <span className="flex items-center gap-2 text-[12px] font-semibold text-[#557086]">
                <ShieldCheck className="h-4 w-4 text-[#07845e]" aria-hidden="true" />
                Free check, no score impact
              </span>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0.95, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -3 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[560px]"
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
              <Image
                src="/assets/about/about-credit-profile.jpg"
                alt="Reviewing a credit score and its key profile factors"
                fill
                sizes="(max-width: 1024px) 92vw, 560px"
                className="object-cover"
              />
            </div>
            <figcaption className="grid grid-cols-3 border-b border-[#c7dfec] bg-white">
              {[
                ["Score view", "300 - 900"],
                ["Profile", "Key factors"],
                ["Access", "Consent-led"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`min-w-0 px-3 py-4 text-center ${
                    index > 0 ? "border-l border-[#c7dfec]" : ""
                  }`}
                >
                  <p className="text-[9px] font-semibold uppercase text-[#8094a4]">
                    {label}
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-[#123e5e]">
                    {value}
                  </p>
                </div>
              ))}
            </figcaption>
          </motion.figure>
        </div>
      </section>
    </MotionConfig>
  );
}
