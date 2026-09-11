"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ShieldCheck,
} from "lucide-react";

type StatusHeroProps = {
  totalApplications?: number;
  activeApplications?: number;
  completedApplications?: number;
  viewerType?: "user" | "agency" | null;
};

const formatCount = (value?: number) =>
  String(Math.max(0, Number(value) || 0)).padStart(2, "0");

const ease = [0.22, 1, 0.36, 1] as const;

export function StatusHero({
  totalApplications = 0,
  activeApplications = 0,
  completedApplications = 0,
  viewerType = null,
}: StatusHeroProps) {
  const stats = [
    {
      title: "Total records",
      value: formatCount(totalApplications),
      icon: ClipboardList,
      tone: "bg-[#e4f2ff] text-[#4c1d95]",
      accent: "bg-[#7c3aed]",
    },
    {
      title: "In progress",
      value: formatCount(activeApplications),
      icon: Clock3,
      tone: "bg-[#fff4df] text-[#a85b00]",
      accent: "bg-[#e59b2f]",
    },
    {
      title: "Completed",
      value: formatCount(completedApplications),
      icon: CheckCircle2,
      tone: "bg-[#e6f8ef] text-[#087443]",
      accent: "bg-[#12a66a]",
    },
  ];

  const contextLabel =
    viewerType === "agency"
      ? "Partner portfolio"
      : viewerType === "user"
        ? "Customer account"
        : "Secure public tracker";

  return (
    <section className="relative overflow-hidden bg-[#f5f9fd] px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <span
        aria-hidden="true"
        className="absolute left-0 top-10 h-24 w-1.5 bg-[#7c3aed]"
      />
      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="flex items-center gap-3">
            <span className="h-0.75 w-8 bg-[#7c3aed]" />
            <p className="text-[11px] font-extrabold uppercase text-[#4c1d95] md:text-[12px]">
              {contextLabel}
            </p>
          </div>
          <h1 className="mt-3 text-[35px] font-extrabold leading-[1.08] text-[#07162d] md:text-[43px]">
            Application status
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] font-medium leading-7 text-[#5f6f82] md:text-[15px]">
            Follow every important stage of your loan, insurance, credit card,
            or financial service request from one secure place.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#477561]">
              <ShieldCheck className="h-4 w-4 text-[#087443]" />
              Secure account-linked data
            </p>
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#52657c]">
              <BadgeCheck className="h-4 w-4 text-[#7c3aed]" />
              Status from Fintaraa systems
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map(({ title, value, icon: Icon, tone, accent }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 1, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease }}
              className="relative overflow-hidden rounded-md bg-white px-3 py-3 sm:px-4 sm:py-4"
            >
              <span
                aria-hidden="true"
                className={["absolute inset-x-0 top-0 h-0.75", accent].join(
                  " ",
                )}
              />
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-10 sm:w-10",
                    tone,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div>
                  <p className="text-[8px] font-extrabold uppercase leading-4 text-[#718096] sm:text-[10px]">
                    {title}
                  </p>
                  <motion.p
                    key={value}
                    initial={{ opacity: 1, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[22px] font-extrabold leading-none text-[#07162d] sm:text-[25px]"
                  >
                    {value}
                  </motion.p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
