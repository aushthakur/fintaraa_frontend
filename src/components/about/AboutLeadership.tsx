"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { COMPANY_NAME } from "@/data/company";

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutLeadership() {
  const reveal = (delay = 0) => ({
    initial: { opacity: 1, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: {
      duration: 0.7,
      delay,
      ease,
    },
  });

  return (
    <section className="overflow-hidden bg-[#faf5ff] px-4 py-16 md:px-6 md:py-20 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:gap-16">
        <motion.div {...reveal()} className="relative min-h-125 sm:min-h-155">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[8%] h-[92%] w-[78%] bg-[#dff2ff]"
          />
          <motion.div
            initial={{ scale: 1.025 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.95, ease }}
            className="absolute bottom-0 left-0 right-[14%] top-0 overflow-hidden rounded-md bg-[#dcecf8]"
          >
            <Image
              src="/assets/about/kunal-mehndiratta.jpg"
              alt="Kunal Mehndiratta, Founder and CEO of Fintaraa"
              fill
              sizes="(min-width: 1024px) 36vw, 86vw"
              className="object-cover object-top"
            />
          </motion.div>
          <p className="absolute bottom-5 right-0 text-[10px] font-extrabold uppercase text-[#5b21b6] [writing-mode:vertical-rl]">
            Founder &amp; CEO / Fintaraa
          </p>
        </motion.div>

        <motion.div {...reveal(0.08)}>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#5b21b6]">
            Leadership
          </p>
          <h2 className="mt-3 text-[30px] font-extrabold leading-[1.2] text-[#0b1f3a] md:text-[35px] lg:text-[38px]">
            Financial knowledge, legal insight, and a customer-first vision.
          </h2>
          <Quote className="mt-7 h-8 w-8 text-[#2e9dd7]" />
          <p className="mt-4 max-w-3xl font-highlight text-[25px] font-semibold italic leading-9 text-[#0b72c9] md:text-[30px] md:leading-10">
            “At Fintaraa, we do not just offer loans; we craft financial
            journeys built on trust, speed, and long-term value.”
          </p>

          <div className="mt-8">
            <h3 className="text-[22px] font-extrabold text-[#0b1f3a]">
              Kunal Mehndiratta
            </h3>
            <p className="mt-2 text-[14px] font-extrabold leading-6 text-[#5b21b6] md:text-[15px]">
              Founder &amp; CEO, {COMPANY_NAME} (Fintaraa)
            </p>
            <p className="mt-4 max-w-3xl text-[15px] font-medium leading-8 text-[#5d6b7f] md:text-[16px]">
              With a B.Com, MBA in Finance, LLB, and LLM in Taxation, Kunal
              brings financial and legal perspective to loan distribution. He
              has worked with salaried professionals, MSME owners, women
              entrepreneurs, and startup founders to help secure tailored and
              compliant financing.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
              {["B.Com", "MBA (Finance)", "LLB", "LLM (Taxation)"].map(
                (credential) => (
                  <span
                    key={credential}
                    className="text-[12px] font-extrabold uppercase text-[#40546b]"
                  >
                    {credential}
                  </span>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
