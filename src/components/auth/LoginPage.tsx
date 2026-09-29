"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSafeRedirectTarget } from "@/lib/loginRedirect";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  Building2,
  RefreshCw,
  Edit3,
  User,
  CreditCard,
  Mail,
  Zap,
  Star,
  Check,
} from "lucide-react";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  sendOtp,
  verifyOtp,
  mobileToPan,
  updateUserProfile,
} from "@/services/auth";
import { trackReferralVisit } from "@/services/referrals";
import {
  clearPendingReferralAttribution,
  normalizeReferralCode,
  prepareReferralLanding,
  type PendingReferralAttribution,
} from "@/services/referralAttribution";

const normalizePhone = (input: string) => input.replace(/\D/g, "");
const normalizePAN = (input: string) =>
  input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthStep = "phone" | "otp" | "mobile-pan" | "complete-profile";

export function LoginPage({
  redirectParam,
  referralCode,
}: {
  redirectParam?: string;
  referralCode?: string;
} = {}) {
  const router = useRouter();
  const postLoginTarget = useMemo(
    () => getSafeRedirectTarget(redirectParam),
    [redirectParam],
  );
  const [message, setMessage] = useState<{ text: string; type: "error" | "info" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>("phone");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const [consentCibil, setConsentCibil] = useState(false);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [accountExisted, setAccountExisted] = useState<boolean | null>(null);
  const pendingReferralRef = useRef<PendingReferralAttribution | undefined>(
    undefined,
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panCard: "",
    otp: "",
  });

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pan = useMemo(() => normalizePAN(form.panCard), [form.panCard]);
  const digits = useMemo(() => normalizePhone(form.mobile), [form.mobile]);
  const validEmail = !form.email.trim() || emailRegex.test(form.email.trim());

  const validPan = /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(pan);
  const validOtp = form.otp.replace(/\D/g, "").length === 6;
  const validPhone = digits.length >= 10 && digits.length <= 15;

  useEffect(() => {
    const code = normalizeReferralCode(referralCode);
    if (!code) {
      pendingReferralRef.current = undefined;
      clearPendingReferralAttribution();
      return;
    }

    const authenticated = getAuthType() === "user" && Boolean(getAuthToken());
    const landing = prepareReferralLanding(code, !authenticated);
    pendingReferralRef.current = authenticated ? undefined : landing;
    if (!landing) return;

    const trackedKey = `fintaraa_referral_tracked_${code}`;
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, "1");

    void trackReferralVisit({
      referralCode: code,
      visitorId: landing.referralVisitorId,
      landingPath: `${window.location.pathname}${window.location.search}`,
      source: "website",
    }).catch(() => {
      sessionStorage.removeItem(trackedKey);
    });
  }, [referralCode]);

  useEffect(() => {
    if (getAuthType() === "user" && getAuthToken()) {
      pendingReferralRef.current = undefined;
      clearPendingReferralAttribution();
      router.replace(postLoginTarget);
    }
  }, [postLoginTarget, router]);

  useEffect(() => {
    if (step !== "otp" || (otpExpiresIn <= 0 && resendIn <= 0)) return;
    const timer = window.setInterval(() => {
      setOtpExpiresIn((value) => Math.max(value - 1, 0));
      setResendIn((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresIn, resendIn, step]);

  // Focus the first OTP box when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setAccountExisted(null);
    if (!validPhone) {
      setMessage({ text: "Please enter a valid 10-digit mobile number.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await sendOtp(digits);
      setAccountExisted(
        typeof response?.existed === "boolean" ? response.existed : null,
      );
      setStep("otp");
      setOtpExpiresIn(response?.expiresInSeconds || 5 * 60);
      setResendIn(30);
      setMessage({ text: "OTP sent successfully to your mobile number.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to send OTP. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    const raw = value.replace(/\D/g, "");
    if (!raw) {
      // User erased
      const chars = form.otp.split("");
      chars[index] = "";
      setForm((prev) => ({ ...prev, otp: chars.join("") }));
      return;
    }

    if (raw.length > 1) {
      // Pasted full or partial code
      const pastedDigits = raw.slice(0, 6);
      setForm((prev) => ({ ...prev, otp: pastedDigits }));
      const nextIdx = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    // Single digit input
    const currentChars = (form.otp + "      ").slice(0, 6).split("");
    currentChars[index] = raw;
    const updated = currentChars.join("").trim();
    setForm((prev) => ({ ...prev, otp: updated }));

    if (index < 5 && raw) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!form.otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      setForm((prev) => ({ ...prev, otp: pasted }));
      const targetIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[targetIdx]?.focus();
    }
  };

  const submitOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!validOtp) {
      setMessage({ text: "Please enter the complete 6-digit OTP.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const normalizedReferralCode = normalizeReferralCode(referralCode);
      const pendingReferral =
        accountExisted === false &&
        pendingReferralRef.current?.referralCode === normalizedReferralCode
          ? pendingReferralRef.current
          : undefined;
      const response = await verifyOtp(
        digits,
        form.otp.replace(/\D/g, ""),
        undefined,
        undefined,
        pendingReferral,
      );
      pendingReferralRef.current = undefined;
      clearPendingReferralAttribution();
      const user = response?.user;
      const existed =
        typeof response?.accountExisted === "boolean"
          ? response.accountExisted
          : accountExisted;
      setAccountExisted(existed);
      const userName = String(user?.name || "").trim();
      const needsProfileCompletion = Boolean(
        response?.needsProfileCompletion ||
        !userName ||
        userName.toLowerCase().startsWith("user ") ||
        !user?.panCard,
      );

      if (needsProfileCompletion) {
        setForm((prev) => ({
          ...prev,
          name:
            userName && !userName.toLowerCase().startsWith("user ")
              ? userName
              : prev.name,
          panCard: user?.panCard ? String(user.panCard) : prev.panCard,
          otp: "",
        }));
        setStep("mobile-pan");
        setMessage({ text: "Mobile verified! Complete your PAN details to continue.", type: "info" });
        return;
      }

      setMessage({ text: "Verified successfully! Redirecting...", type: "success" });
      router.push(postLoginTarget);
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to verify OTP. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "panCard" ? normalizePAN(value) : value,
    }));
  };

  const fetchPanFromMobile = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!form.name.trim()) {
      setMessage({ text: "Enter your full name exactly as per PAN.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await mobileToPan({
        name: form.name.trim(),
        mobile_no: digits,
      });
      const panNumber = response?.data?.pan_number;
      if (!panNumber) {
        setMessage({ text: "PAN number not found for this mobile. Please enter PAN manually.", type: "error" });
        return;
      }
      setForm((prev) => ({ ...prev, panCard: panNumber }));
      setAcceptPolicies(false);
      setConsentCibil(false);
      setStep("complete-profile");
      setMessage({ text: "PAN fetched successfully! Review and continue.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Failed to fetch PAN details.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const completeVerifiedProfile = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!form.name.trim() || !validPan || !validEmail || !acceptPolicies) {
      setMessage({
        text: "Please enter your name, valid PAN, and accept the terms & policies to continue.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile({
        name: form.name.trim(),
        mobile: digits,
        panCard: pan,
        email: form.email.trim() || undefined,
        agreedToTerms: acceptPolicies,
        privacyPolicyAccepted: acceptPolicies,
      });
      setMessage({ text: "Profile completed successfully! Redirecting...", type: "success" });
      router.push(postLoginTarget);
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to complete profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-[#FAF7FF] via-[#F8F5FE] to-[#F3EBFF] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-purple-200/40 via-violet-300/30 to-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-6xl grid lg:grid-cols-12 gap-0 overflow-hidden rounded-[32px] sm:rounded-[36px] bg-white border border-purple-100/90 shadow-[0_25px_70px_rgba(91,33,182,0.09)]">
        
        {/* ================= LEFT HERO SHOWCASE ================= */}
        <section className="relative lg:col-span-5 bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] text-white p-7 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200">
                Fintaraa Account
              </span>
            </h1>

            <p className="mt-3 text-purple-100 text-xs sm:text-sm leading-relaxed max-w-md">
              Access your personalized loan offers, track disbursals in real-time, and manage all your applications in one secure place.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <Zap className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Instant Approval & Rates</h4>
                  <p className="text-[11px] text-purple-200 font-normal">Compare 40+ banks starting at 8.35% p.a.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <ShieldCheck className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Zero CIBIL Score Impact</h4>
                  <p className="text-[11px] text-purple-200 font-normal">Check your pre-approved eligibility safely.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <Building2 className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Direct Bank Sanctions</h4>
                  <p className="text-[11px] text-purple-200 font-normal">100% digital, zero paperwork hassle.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Metric */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  ))}
                  <span className="ml-1.5 text-xs font-semibold text-white">4.9/5</span>
                </div>
                <p className="text-[11px] text-purple-200 font-normal mt-0.5">50,000+ Customers</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-white">₹100 Cr+</p>
                <p className="text-[11px] text-purple-200 font-normal">Disbursed across India</p>
              </div>
            </div>
          </div>
        </section>


        {/* ================= RIGHT AUTH FORM ================= */}
        <section className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Step Progress Pills */}
            <div className="flex items-center gap-2 mb-8">
              <StepPill
                number={1}
                label="Mobile"
                active={step === "phone"}
                completed={step !== "phone"}
              />
              <div className="h-0.5 w-6 sm:w-10 bg-purple-100 rounded-full" />
              <StepPill
                number={2}
                label="OTP"
                active={step === "otp"}
                completed={step === "mobile-pan" || step === "complete-profile"}
              />
              <div className="h-0.5 w-6 sm:w-10 bg-purple-100 rounded-full" />
              <StepPill
                number={3}
                label="Details"
                active={step === "mobile-pan" || step === "complete-profile"}
                completed={false}
              />
            </div>

            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07162d] tracking-tight">
                {step === "otp"
                  ? "Verify OTP"
                  : step === "mobile-pan"
                    ? "Verify Identity"
                    : step === "complete-profile"
                      ? "Complete Your Profile"
                      : "Login or Sign Up"}
              </h2>
              <p className="mt-2 text-sm text-[#667085] leading-relaxed">
                {step === "otp" ? (
                  <>
                    We sent a 6-digit verification code to{" "}
                    <span className="font-bold text-[#5B21B6]">+91 {digits}</span>
                  </>
                ) : step === "mobile-pan" ? (
                  "Enter your full name as per PAN. We will fetch and verify your PAN details automatically."
                ) : step === "complete-profile" ? (
                  "Confirm your PAN details and complete your profile to unlock customized loan rates."
                ) : (
                  "Enter your mobile number to receive a secure one-time verification code."
                )}
              </p>
            </div>

            {/* Alert Message Box */}
            {message && (
              <div
                className={`mb-6 flex items-start gap-3 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  message.type === "error"
                    ? "bg-rose-50 border border-rose-200 text-rose-700"
                    : message.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-purple-50 border border-purple-200 text-purple-800"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {message.type === "error" ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-200 text-rose-800 text-xs font-black">!</span>
                  ) : message.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">{message.text}</div>
              </div>
            )}

            {/* Step 1: PHONE FORM */}
            {step === "phone" && (
              <form onSubmit={requestOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B21B6] mb-2">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-2xl border-2 border-purple-100 bg-white focus-within:border-[#5B21B6] focus-within:ring-4 focus-within:ring-purple-100/50 transition-all shadow-sm hover:border-purple-200">
                    <div className="flex items-center justify-center gap-2 px-4 h-[56px] bg-slate-50 border-r border-purple-100/50 text-[#07162d] shrink-0">
                      <span className="text-[20px] leading-none mb-[2px] shrink-0">🇮🇳</span>
                      <span className="font-bold text-base leading-none text-[#5B21B6] whitespace-nowrap">+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoFocus
                      placeholder="Enter 10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      className="w-full h-[56px] bg-transparent px-4 text-lg font-bold text-[#07162d] placeholder:font-medium placeholder:text-[#98a2b3] outline-none"
                    />
                    {digits.length === 10 && (
                      <div className="pr-4 text-emerald-600 flex items-center">
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-[#98a2b3] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5B21B6]" />
                    An OTP will be sent via SMS for verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || digits.length < 10}
                  className="w-full h-14 mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(91,33,182,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(91,33,182,0.45)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Sending OTP...
                    </span>
                  ) : (
                    <>
                      <span>Get Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP VERIFICATION FORM */}
            {step === "otp" && (
              <form onSubmit={submitOtp} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5B21B6]">
                      Enter 6-Digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setMessage(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#5B21B6] hover:underline"
                    >
                      <Edit3 className="w-3 h-3" /> Change Number
                    </button>
                  </div>

                  {/* Modern 6-Box Segmented OTP Input */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const digit = form.otp[index] || "";
                      return (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-13 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 border-purple-100 bg-purple-50/20 text-[#07162d] focus:border-[#5B21B6] focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all shadow-sm outline-none"
                        />
                      );
                    })}
                  </div>

                  {/* Resend & Timer Footer */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-purple-50/50 p-3 border border-purple-100 text-xs">
                    <span className="font-semibold text-[#667085]">
                      {otpExpiresIn > 0 ? (
                        <>
                          Code expires in:{" "}
                          <span className="font-bold text-emerald-700">
                            {String(Math.floor(otpExpiresIn / 60)).padStart(2, "0")}:
                            {String(otpExpiresIn % 60).padStart(2, "0")}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-rose-600">OTP Expired</span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={async () => {
                        if (resendIn > 0) return;
                        setLoading(true);
                        try {
                          const response = await sendOtp(digits);
                          setAccountExisted(
                            typeof response?.existed === "boolean"
                              ? response.existed
                              : null,
                          );
                          setOtpExpiresIn(response?.expiresInSeconds || 5 * 60);
                          setResendIn(30);
                          setMessage({ text: "A fresh OTP has been resent to your mobile number.", type: "success" });
                        } catch (error) {
                          setMessage({
                            text: (error as Error).message || "Unable to resend OTP.",
                            type: "error",
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={resendIn > 0 || loading}
                      className="font-bold text-[#5B21B6] hover:text-[#4C1D95] disabled:text-[#98a2b3] disabled:cursor-not-allowed transition-colors"
                    >
                      {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || form.otp.replace(/\D/g, "").length !== 6}
                  className="w-full h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(91,33,182,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(91,33,182,0.45)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Verifying OTP...
                    </span>
                  ) : (
                    <>
                      <span>
                        {accountExisted === false
                          ? "Verify & Create Account"
                          : "Verify & Log In"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: MOBILE TO PAN STEP */}
            {step === "mobile-pan" && (
              <form onSubmit={fetchPanFromMobile} className="space-y-5">
                <ModernInputField
                  label="Full Name (as per PAN card)"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  icon={<User className="w-4 h-4 text-purple-600" />}
                  onChange={(val) => update("name", val)}
                  autoFocus
                />

                <ModernInputField
                  label="Verified Mobile Number"
                  placeholder="Mobile"
                  value={`+91 ${digits}`}
                  disabled
                  icon={<Phone className="w-4 h-4 text-emerald-600" />}
                  badge="Verified"
                  onChange={() => undefined}
                />

                <button
                  type="submit"
                  disabled={loading || !form.name.trim()}
                  className="w-full h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(91,33,182,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(91,33,182,0.45)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Fetching PAN details...
                    </span>
                  ) : (
                    <>
                      <span>Fetch PAN & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 4: COMPLETE PROFILE */}
            {step === "complete-profile" && (
              <form onSubmit={completeVerifiedProfile} className="space-y-4">
                <ModernInputField
                  label="Full Name"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  icon={<User className="w-4 h-4 text-purple-600" />}
                  onChange={(val) => update("name", val)}
                />

                <ModernInputField
                  label="PAN Card Number"
                  placeholder="ABCDE1234F"
                  value={form.panCard}
                  icon={<CreditCard className="w-4 h-4 text-purple-600" />}
                  disabled={Boolean(form.panCard && validPan)}
                  badge={validPan ? "Verified" : undefined}
                  onChange={(val) => update("panCard", val)}
                />

                <ModernInputField
                  label="Email Address (Optional)"
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                  icon={<Mail className="w-4 h-4 text-purple-600" />}
                  onChange={(val) => update("email", val)}
                />

                <div className="pt-2 space-y-3">
                  <ModernCheckbox
                    checked={consentCibil}
                    onChange={() => setConsentCibil((v) => !v)}
                    label="I consent to Fintaraa fetching my credit report from CIBIL/Experian to show pre-approved loan offers without impacting my credit score."
                  />
                  <ModernCheckbox
                    checked={acceptPolicies}
                    onChange={() => setAcceptPolicies((v) => !v)}
                    label="I have read and agree to the Fintaraa Terms & Conditions and Privacy Policy."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.name.trim() || !validPan || !acceptPolicies}
                  className="w-full h-14 mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(91,33,182,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(91,33,182,0.45)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Saving Profile...
                    </span>
                  ) : (
                    <>
                      <span>Complete & Access Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Portal Switcher & Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-purple-100/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-[#667085] font-semibold text-center sm:text-left">
                Are you a Channel Partner / DSA?{" "}
                <Link
                  href="/partner/login"
                  className="text-[#5B21B6] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Partner Login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-[#98a2b3] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StepPill({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          completed
            ? "bg-emerald-600 text-white"
            : active
              ? "bg-[#5B21B6] text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-200"
              : "bg-purple-100 text-[#5B21B6]"
        }`}
      >
        {completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : number}
      </div>
      <span
        className={`text-xs font-bold hidden sm:inline ${
          active ? "text-[#5B21B6]" : completed ? "text-emerald-700" : "text-[#98a2b3]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ModernInputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
  badge,
  autoFocus = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5B21B6]">
          {label}
        </label>
        {badge && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" /> {badge}
          </span>
        )}
      </div>
      <div
        className={`relative flex items-center rounded-2xl border-2 border-purple-100 bg-purple-50/20 px-3.5 py-3 transition-all ${
          disabled
            ? "bg-gray-50/80 border-gray-200 opacity-90"
            : "focus-within:border-[#5B21B6] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100"
        }`}
      >
        {icon && <div className="mr-3 shrink-0">{icon}</div>}
        <input
          type={type}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm sm:text-base font-bold text-[#07162d] placeholder:font-normal placeholder:text-[#98a2b3] outline-none disabled:text-[#667085]"
        />
      </div>
    </div>
  );
}

function ModernCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      onClick={onChange}
      className="flex items-start gap-3 p-3 rounded-xl border border-purple-100/80 bg-purple-50/20 hover:bg-purple-50/40 cursor-pointer transition-colors"
    >
      <div
        className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
          checked
            ? "bg-[#5B21B6] border-[#5B21B6] text-white shadow-sm"
            : "bg-white border-purple-200 text-transparent"
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>
      <span className="text-xs text-[#5d6b7c] font-medium leading-relaxed select-none">
        {label}
      </span>
    </label>
  );
}
