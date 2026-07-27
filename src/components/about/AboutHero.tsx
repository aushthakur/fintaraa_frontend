"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, PhoneCall } from "lucide-react";
import { CALL_PHONE } from "@/data/company";

const heroStats = [
  { value: "2016", label: "Founded with a customer-first lending vision" },
  { value: "10,000+", label: "Happy customers guided through finance" },
  { value: "100+", label: "Banks and lending partners in the network" },
  { value: "24-48 hrs", label: "Approval movement after verification" },
];

const trustPoints = [
  "End-to-end digital journey",
  "Personalised loan consultation",
  "Dedicated relationship support",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutHero() {
  const copyVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.08,
      },
    },
  };

  const copyItem = {
    hidden: { opacity: 1, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 pb-14 pt-10 md:px-6 md:pb-16 md:pt-14 lg:px-8 lg:pt-16">
      <span
        aria-hidden="true"
        className="absolute left-0 top-30 h-32 w-1.5 bg-[#0b7fe5]"
      />

      <div className="mx-auto max-w-9xl">
        <div className="grid gap-11 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
            variants={copyVariants}
          >
            <motion.h1
              variants={copyItem}
              className="max-w-172.5 text-[34px] font-extrabold leading-[1.1] text-[#0b1f3a] sm:text-[40px] md:text-[45px] lg:text-[48px]"
            >
              Your trusted financial partner for loans that{" "}
              <span className="text-[#075cde]">move life forward.</span>
            </motion.h1>

            <motion.p
              variants={copyItem}
              className="mt-5 font-highlight text-[23px] font-semibold italic leading-8 text-[#0b72c9] md:text-[28px] md:leading-9"
            >
              Simplifying loans, empowering dreams.
            </motion.p>

            <motion.p
              variants={copyItem}
              className="mt-6 max-w-2xl text-[15px] font-medium leading-7 text-[#536176] md:text-[16px] md:leading-8"
            >
              Since 2016, Fintaraa has helped individuals, families, and
              businesses navigate borrowing with greater clarity. From the first
              requirement to lender comparison, documentation, approval, and
              disbursal, one experienced team stays with the customer.
            </motion.p>

            <motion.div
              variants={copyItem}
              className="mt-7 grid gap-x-5 gap-y-3 sm:grid-cols-2"
            >
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e7f4ff] text-[#075cde]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                  </span>
                  <span className="text-[13px] font-bold leading-5 text-[#26364d] md:text-[14px]">
                    {point}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={copyItem}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/products"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#075cde] px-6 text-[14px] font-extrabold text-white no-underline transition-colors hover:bg-[#064ebd] sm:w-auto"
                >
                  Explore Loan Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={CALL_PHONE.href}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#eaf6ff] px-6 text-[14px] font-extrabold text-[#075cde] no-underline transition-colors hover:bg-[#dcedff] sm:w-auto"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call {CALL_PHONE.national}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="relative min-h-97.5 pb-12 sm:min-h-120 lg:min-h-140 lg:pb-14">
            <motion.div
              initial={{ opacity: 1, scale: 1.02, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, ease }}
              className="relative ml-auto h-82.5 w-[91%] overflow-hidden rounded-md bg-[#e7f3fb] sm:h-105 lg:h-127.5"
            >
              <Image
                src="/assets/about/about-team-collaboration.jpg"
                alt="A collaborative financial consultation team"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 92vw"
                className="object-cover object-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 1, x: -24, y: 18 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.5,
                ease,
              }}
              className="absolute bottom-0 left-0 h-33.75 w-[48%] overflow-hidden rounded-sm bg-[#ddecf8] sm:h-45 lg:h-51.25"
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ scale: [1, 1.025, 1] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/assets/about/about-hero-consultation.jpg"
                  alt="Loan planning and documentation consultation"
                  fill
                  sizes="(min-width: 1024px) 25vw, 46vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 1, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.78,
                ease,
              }}
              className="absolute bottom-1 right-0 flex items-center gap-3 bg-white py-3 pl-5 sm:bottom-3"
            >
              <span className="h-10 w-0.75 bg-[#16a3e0]" />
              <div>
                <p className="text-[20px] font-extrabold leading-none text-[#075cde]">
                  Since 2016
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#637083] sm:text-[12px]">
                  Trust built one journey at a time
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.72, ease }}
          className="mt-14"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease }}
            className="block h-0.75 origin-left bg-[#075cde]"
          />
          <div className="grid gap-x-7 gap-y-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 1, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease,
                }}
                className="justify-center text-center"
              >
                <p className="text-[29px] font-extrabold leading-none text-[#075cde] md:text-[34px]">
                  {stat.value}
                </p>
                <p className="mt-3 w-2/3 mx-auto text-[13px] font-semibold leading-6 text-[#5a687c]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
