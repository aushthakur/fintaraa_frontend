"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/services/newsletter";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const result = await subscribeToNewsletter({
        email: normalizedEmail,
        pagePath:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        (error as Error).message
          ?.replace(/^\u274c\s*/, "")
          ?.replace(/^\u26a0\ufe0f?\s*/, "") ||
          "We could not subscribe you right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#e8f3fe] px-4 py-8 border-y border-[#dce6f0] font-sans antialiased sm:px-6 sm:py-10 md:px-12 md:py-12">
      <div className="mx-auto max-w-9xl grid gap-6 md:grid-cols-[auto_1fr_320px] lg:gap-8 items-center">
        {/* Left Aspect: Illustration Frame Asset - responsive size */}
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 md:w-36 md:h-24 bg-white rounded-xl shadow-xs border border-[#e1ecf7] flex items-center justify-center p-2 mx-auto md:mx-0">
          <Image
            src="/assets/blogs/newsletter-envelope.png"
            alt="Newsletter Paper Airplane Envelope Illustration"
            width={128}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Center Aspect: Text Heading Layout Content - responsive text */}
        <div className="text-center md:text-left space-y-1 sm:space-y-1.5">
          <h4 className="text-sm font-bold text-[#000000] tracking-tight sm:text-[14px] md:text-[15px] lg:text-base">
            Enjoyed this article?
          </h4>
          <h3 className="text-lg font-extrabold text-[#005ca8] tracking-tight sm:text-xl md:text-[20px] lg:text-2xl xl:text-[26px]">
            Subscribe to our Newsletter
          </h3>
          <p className="text-[11px] font-medium leading-relaxed text-[#8f9ca9] max-w-md sm:text-xs md:text-sm lg:text-[14px]">
            Join 10,000+ readers who get practical finance tips, guides, loan
            offers, and market updates.
          </p>
        </div>

        {/* Right Aspect: Newsletter Action Form inputs - responsive sizing */}
        <form
          onSubmit={handleSubmit}
          className="space-y-2.5 sm:space-y-3"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2d3142] pl-0.5 sm:text-[13px] md:text-sm">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled={submitting}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="Enter Email Address"
              className="h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-xs text-[#1a1d25] placeholder-[#a0aec0] shadow-2xs outline-none focus:border-[#005ca8] transition-colors sm:h-10 sm:text-[13px] md:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#0ea243] text-xs font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-[#0c8e3a] disabled:cursor-not-allowed disabled:bg-[#7cc99c] sm:h-11 sm:text-sm md:text-[14px]"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>

          {message ? (
            <p
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold leading-4 ${
                status === "success"
                  ? "bg-[#ecfdf3] text-[#027a48]"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status === "success" ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <span>{message}</span>
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
