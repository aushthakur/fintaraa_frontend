"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Star,
  User,
} from "lucide-react";
import { buildApiUrl } from "@/services/apiUrl";
import { buildWebsiteSourcePayload } from "@/lib/formConsent";

type FeedbackForm = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  category: string;
  message: string;
};

const initialForm: FeedbackForm = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  category: "",
  message: "",
};

const categories = [
  "Website Experience",
  "Loan or Product Journey",
  "Customer Support",
  "Business Service",
  "Suggestion",
  "Other",
];

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cityRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;

function FeedbackField({
  label,
  value,
  placeholder,
  type = "text",
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  icon: typeof User;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-bold text-[#344054]">{label}</span>
      <span className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8da0]" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-[#d8e3ed] bg-white pl-10 pr-3 text-[13px] font-semibold text-[#172033] outline-none transition placeholder:font-medium placeholder:text-[#9aa8b6] focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
        />
      </span>
    </label>
  );
}

export function FeedbackPage() {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (key: keyof FeedbackForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobile = form.mobile.trim().replace(/[\s-]/g, "");

    if (!nameRegex.test(form.fullName.trim())) {
      setError("Please enter a valid full name.");
      return;
    }
    if (!mobileRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!cityRegex.test(form.city.trim())) {
      setError("Please enter a valid city.");
      return;
    }
    if (!form.category || rating < 1) {
      setError("Please select a feedback category and rating.");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Please share at least 10 characters of feedback.");
      return;
    }

    const url = buildApiUrl("/contact-requests");
    if (!url) {
      setError("Feedback service is unavailable right now. Please try again later.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const message = `[Feedback | ${form.category} | Rating ${rating}/5] ${form.message.trim()}`.slice(
        0,
        1000,
      );
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          mobile,
          email: form.email.trim(),
          city: form.city.trim(),
          message,
          ...buildWebsiteSourcePayload("website_feedback_page"),
          whatsappConsent: false,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.message || "Unable to submit feedback right now.");
      }

      setSuccess(true);
      setForm(initialForm);
      setRating(0);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit feedback right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white px-4 py-10 md:px-6 md:py-12 lg:px-8">
      <div className="mx-auto grid max-w-9xl items-start gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
        <section className="lg:sticky lg:top-32">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#075cde]">
            Share Feedback
          </p>
          <h1 className="mt-3 max-w-xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#102c45] sm:text-[42px] md:text-[48px]">
            Help us make Fintaraa better
          </h1>
          <p className="mt-4 max-w-xl text-[14px] font-medium leading-7 text-[#657b8e] md:text-[16px]">
            Tell us what worked well or where your experience can improve. Every
            response is reviewed by our team.
          </p>
          <div className="relative mt-5 h-65 w-full max-w-xl sm:h-80">
            <Image
              src="/assets/contact/contact-hero.png"
              alt="Fintaraa customer feedback support"
              fill
              priority
              unoptimized
              className="object-contain object-left"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-[#dce7ef] bg-white p-5 shadow-[0_20px_55px_rgba(16,44,69,0.09)] sm:p-7 md:p-8">
          <div className="border-b border-[#e6edf3] pb-5">
            <h2 className="text-[23px] font-extrabold text-[#172f45]">
              Your feedback
            </h2>
            <p className="mt-1.5 text-[13px] font-medium text-[#718598]">
              Fields marked below help us route your response correctly.
            </p>
          </div>

          {success ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#ccebd9] bg-[#f0fbf5] p-4 text-[#17613a]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-[14px] font-extrabold">Thank you for your feedback.</p>
                <p className="mt-1 text-[12px] font-medium leading-5">
                  Your response has been shared with the Fintaraa team.
                </p>
              </div>
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-5 grid gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FeedbackField
                label="Full Name"
                value={form.fullName}
                placeholder="Enter your name"
                icon={User}
                onChange={(value) => updateField("fullName", value)}
              />
              <FeedbackField
                label="Mobile Number"
                value={form.mobile}
                placeholder="Enter 10-digit number"
                type="tel"
                icon={Phone}
                onChange={(value) => updateField("mobile", value)}
              />
              <FeedbackField
                label="Email Address"
                value={form.email}
                placeholder="name@example.com"
                type="email"
                icon={Mail}
                onChange={(value) => updateField("email", value)}
              />
              <FeedbackField
                label="City"
                value={form.city}
                placeholder="Enter your city"
                icon={MapPin}
                onChange={(value) => updateField("city", value)}
              />
            </div>

            <label className="grid gap-1.5">
              <span className="text-[12px] font-bold text-[#344054]">
                Feedback Category
              </span>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="h-11 rounded-xl border border-[#d8e3ed] bg-white px-3 text-[13px] font-semibold text-[#53687a] outline-none focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-[12px] font-bold text-[#344054]">
                Overall Rating
              </legend>
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setError("");
                      setSuccess(false);
                    }}
                    aria-label={`Rate ${value} out of 5`}
                    className="rounded-lg p-1.5 text-[#d0d9e2] transition hover:scale-105 hover:text-[#f4ad21] focus:outline-none focus:ring-2 focus:ring-[#075cde]/25"
                  >
                    <Star
                      className={`h-7 w-7 ${value <= rating ? "fill-[#f4ad21] text-[#f4ad21]" : ""}`}
                    />
                  </button>
                ))}
                {rating ? (
                  <span className="ml-2 text-[12px] font-extrabold text-[#53687a]">
                    {rating}/5
                  </span>
                ) : null}
              </div>
            </fieldset>

            <label className="grid gap-1.5">
              <span className="text-[12px] font-bold text-[#344054]">
                Your Feedback
              </span>
              <span className="relative">
                <MessageSquareText className="absolute left-3.5 top-3.5 h-4 w-4 text-[#7b8da0]" />
                <textarea
                  rows={5}
                  maxLength={850}
                  value={form.message}
                  placeholder="Share your experience or suggestion"
                  onChange={(event) => updateField("message", event.target.value)}
                  className="min-h-32 w-full resize-none rounded-xl border border-[#d8e3ed] bg-white py-3 pl-10 pr-3 text-[13px] font-semibold leading-6 text-[#172033] outline-none transition placeholder:font-medium placeholder:text-[#9aa8b6] focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
                />
              </span>
            </label>

            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] font-bold leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#13a653] px-6 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(19,166,83,0.2)] transition hover:bg-[#0f8f45] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:justify-self-start"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit Feedback
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
