"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
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
    <section className="relative w-full overflow-hidden border-b border-gray-200 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]">
        
        {/* ── Left Column: Background Image & Hero Copy (7 Cols) ── */}
        <div className="relative lg:col-span-7 flex flex-col justify-center overflow-hidden px-4 sm:px-7 lg:px-9 xl:px-12 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-12 lg:pb-16 min-h-[480px] sm:min-h-[540px] lg:min-h-full bg-gradient-to-br from-[#f8faff] via-white to-[#f0f5ff]">
          
          {/* Boy and Girl Image */}
          <div className="absolute bottom-0 right-0 z-0 w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] opacity-100 pointer-events-none">
            <Image 
              src="/images/boy-girl.png" 
              alt="Boy and girl with shopping bags and cards" 
              width={600} 
              height={600} 
              className="w-full h-auto object-contain object-bottom" 
              priority 
              unoptimized
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-2xl text-slate-900 mt-12 sm:mt-16 lg:mt-24"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.12] tracking-tight text-slate-900 mb-4">
              Credit Cards Directory <br />
              <span className="text-[#6424C7] font-normal">
                & Comparison Marketplace
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-[15px] sm:text-[17px] font-normal leading-relaxed text-slate-600">
              Compare cards from top partner banks for cashback, airport lounge access, rewards points, and zero annual fee options.
            </p>
            <AuthRedirectLink
              href="/credit-cards"
              productSlug="credit-card"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl whitespace-nowrap bg-[#6424C7] px-6 text-sm font-normal text-white transition-all hover:bg-[#521eb0] active:scale-[0.98] no-underline shadow-md"
            >
              Compare Card Offers
              <ArrowRight className="h-4 w-4 ml-2" />
            </AuthRedirectLink>
          </motion.div>
        </div>

        {/* ── Right Column: Form (5 Cols) ── */}
        <div className="lg:col-span-5 flex flex-col justify-center py-6 sm:py-8 lg:py-10 px-4 sm:px-7 lg:px-9 xl:px-12 bg-gradient-to-br from-slate-50/80 via-white to-purple-50/30 font-normal">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[480px] mx-auto lg:mx-0 bg-white rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-5 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal leading-tight text-slate-900">
                  Check your card offers
                </h2>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-slate-500">
                  Get personalised suggestions from participating partners.
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6424C7]">
                <Gift className="h-5 w-5" />
              </span>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
              <label className="grid gap-1.5">
                <span className="text-xs font-normal text-slate-700">Full Name</span>
                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    autoComplete="name"
                    placeholder="Enter name as per PAN"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-normal text-slate-900 outline-none transition focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
                  />
                </div>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-normal text-slate-700">Mobile Number</span>
                <div className="relative flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-[#6424C7] focus-within:ring-1 focus-within:ring-[#6424C7]">
                  <span className="flex items-center border-r border-slate-100 bg-slate-50 px-3.5 text-sm font-normal text-slate-600">
                    +91
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={(event) =>
                        updateField("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="h-full w-full bg-transparent px-3 pl-10 text-sm font-normal text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-normal text-slate-700">Monthly Income</span>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={form.monthlyIncome}
                      onChange={(event) => updateField("monthlyIncome", formatIncome(event.target.value))}
                      autoComplete="off"
                      inputMode="numeric"
                      placeholder="e.g. 75,000"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-normal text-slate-900 outline-none transition focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
                    />
                  </div>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-normal text-slate-700">Employment Type</span>
                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="employmentType"
                      value={form.employmentType}
                      onChange={(event) => updateField("employmentType", event.target.value)}
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-normal text-slate-900 outline-none transition focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
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
                <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-normal text-red-700 mt-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              ) : null}

              {submitted ? (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-normal text-emerald-700 mt-2"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Personalised card matches are ready below.
                </motion.p>
              ) : null}

              <button
                type="submit"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#6424C7] px-6 text-sm font-normal text-white transition-all hover:bg-[#521eb0] active:scale-[0.98] shadow-md"
              >
                Unlock Card Offers
                <Gift className="ml-2 h-4 w-4" />
              </button>
            </form>
            <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-normal text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              100% secure. Soft check only, no impact on credit score.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
