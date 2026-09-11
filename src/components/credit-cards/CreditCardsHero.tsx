"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Gift,
  IndianRupee,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

const inputClass =
  "h-11 w-full rounded-xl border border-[#d8e4f0] bg-[#f8fbff] px-3 text-[13px] font-bold text-[#1f2937] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#4c1d95] focus:bg-white focus:ring-2 focus:ring-[#e4f1ff]";

const selectClass =
  "h-11 w-full rounded-xl border border-[#d8e4f0] bg-[#f8fbff] px-3 text-[13px] font-bold text-[#1f2937] outline-none transition focus:border-[#4c1d95] focus:bg-white focus:ring-2 focus:ring-[#e4f1ff]";

export type CreditCardRecommendation = {
  fullName: string;
  mobile: string;
  monthlyIncome: number;
  employmentType: string;
  creditScore?: number;
  preferredCategory?: string;
};

const emptyForm = {
  fullName: "",
  mobile: "",
  monthlyIncome: "",
  employmentType: "",
};

const formatIncome = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
};

export function CreditCardsHero({
  onOffersRequested,
}: {
  onOffersRequested: (value: CreditCardRecommendation) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullName = form.fullName.trim().replace(/\s+/g, " ");
    const mobile = form.mobile.replace(/\D/g, "");
    const monthlyIncome = Number(form.monthlyIncome.replace(/\D/g, ""));

    if (fullName.length < 3) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!Number.isFinite(monthlyIncome) || monthlyIncome < 10000) {
      setError("Please enter a monthly income of ₹10,000 or more.");
      return;
    }
    if (!form.employmentType) {
      setError("Please select your employment type.");
      return;
    }

    onOffersRequested({
      fullName,
      mobile,
      monthlyIncome,
      employmentType: form.employmentType,
    });
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>
      <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-[1.3fr_0.7fr] md:items-center">
        {/* LEFT CONTAINER: HERO COPY */}
        <motion.div
          initial={{ opacity: 0.95, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-4 flex flex-col justify-start ps-0 sm:mt-10 sm:ps-10 lg:pt-4"
        >
          <div className="relative max-w-2xl">
            <div className="absolute -left-1 -top-6 h-20 w-36 sm:-left-16 sm:-top-16 sm:h-36 sm:w-64 md:-left-18">
              <Image
                src="/assets/images/credit-gauge.png"
                alt="Credit Score Meter Gauge"
                fill
                unoptimized
                priority
                className="object-contain object-left"
              />
            </div>
            <h1 className="mt-14 max-w-2xl text-[32px] font-extrabold leading-[1.14] text-[#111625] sm:mt-10 sm:text-[40px] lg:text-[48px]">
              Find the Best Credit
              <span className="block text-[#4c1d95]">
                Cards for Your Lifestyle
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-[14px] md:text-[15px] font-medium leading-relaxed text-gray-500/90">
              Find the perfect card for cashback, travel, fuel savings, rewards
              and more from participating partner banks.
            </p>
            <AuthRedirectLink
              href="/credit-cards"
              productSlug="credit-card"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-7 text-[14px] font-extrabold text-white no-underline"
            >
              Apply for Credit Card
              <Gift className="h-4 w-4" />
            </AuthRedirectLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.95, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full max-w-100 md:mx-0"
        >
          <div className="absolute inset-0 block translate-x-2 translate-y-2 rounded-[18px] bg-[#4c1d95] sm:translate-x-3 sm:translate-y-3" />

          <div className="relative rounded-[18px] border border-[#d9dfe8] bg-white p-5 shadow-[0_10px_26px_rgba(0,92,168,0.12)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[21px] font-extrabold leading-tight text-[#111827]">
                  Check your card offers
                </h2>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                  Get personalised suggestions from participating partners.
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#4c1d95]">
                <Gift className="h-5 w-5" />
              </span>
            </div>

            <form className="mt-5 grid gap-3" onSubmit={handleSubmit} noValidate>
              <label className="grid gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#475467]">
                  Full Name
                </span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    autoComplete="name"
                    placeholder="Enter name as per PAN"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#475467]">
                  Mobile Number
                </span>
                <div className="flex h-11 overflow-hidden rounded-xl border border-[#d8e4f0] bg-[#f8fbff] transition focus-within:border-[#4c1d95] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e4f1ff]">
                  <span className="flex items-center border-r border-[#d8e4f0] bg-[#eef8ff] px-3 text-[13px] font-extrabold text-[#4c1d95]">
                    +91
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={(event) =>
                        updateField(
                          "mobile",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="h-full w-full bg-transparent px-3 pl-10 text-[13px] font-bold text-[#1f2937] outline-none placeholder:text-[#9aa8b8]"
                    />
                  </div>
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#475467]">
                    Monthly Income
                  </span>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={form.monthlyIncome}
                      onChange={(event) =>
                        updateField("monthlyIncome", formatIncome(event.target.value))
                      }
                      autoComplete="off"
                      inputMode="numeric"
                      placeholder="e.g. 75,000"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#475467]">
                    Employment Type
                  </span>
                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                    <select
                      name="employmentType"
                      value={form.employmentType}
                      onChange={(event) =>
                        updateField("employmentType", event.target.value)
                      }
                      className={`${selectClass} pl-10`}
                    >
                      <option value="">Select employment</option>
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="business-owner">Business owner</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </label>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              ) : null}

              {submitted ? (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Personalised card matches are ready below.
                </motion.p>
              ) : null}

              <button
                type="submit"
                className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-4 text-[13px] font-extrabold text-white shadow-[0_10px_20px_rgba(18,183,106,0.18)] transition hover:brightness-105"
              >
                Unlock Card Offers
                <Gift className="ml-2 h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-[#667085]">
              <ShieldCheck className="h-4 w-4 text-[#0fae5e]" />
              100% secure. Soft check only, no impact on credit score.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
