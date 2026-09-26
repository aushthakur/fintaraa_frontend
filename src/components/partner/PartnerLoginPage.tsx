"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Mail,
  Check,
  Phone,
  Building2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Edit3,
  TrendingUp,
  Award,
  Users,
  Star,
  Zap,
} from "lucide-react";
import { getSafeRedirectTarget } from "@/lib/loginRedirect";
import {
  sendPartnerOtp,
  verifyPartnerOtp,
  isPartnerLoggedIn,
  fetchPartnerProfile,
  isPartnerProfileComplete,
} from "@/services/partner";

const normalizePhone = (input: string) => input.replace(/\D/g, "");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PartnerAuthMode = "login" | "register";
type PartnerAuthStep = "details" | "otp";

const resolveRedirect = (value?: string) => {
  const target = getSafeRedirectTarget(value, "/partner/profile");
  if (target === "/partner/login" || target.startsWith("/partner/login?")) {
    return "/partner/profile";
  }
  return target;
};

export function PartnerLoginPage({
  redirectParam,
}: {
  redirectParam?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<PartnerAuthMode>("login");
  const [step, setStep] = useState<PartnerAuthStep>("details");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "info" | "success" } | null>(null);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
  });

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const redirectTarget = useMemo(
    () => resolveRedirect(redirectParam),
    [redirectParam],
  );
  const digits = useMemo(() => normalizePhone(form.mobile), [form.mobile]);
  const validPhone = digits.length >= 10 && digits.length <= 15;
  const validEmail = emailRegex.test(form.email.trim());
  const validOtp = form.otp.replace(/\D/g, "").length === 6;
  const registerReady =
    form.name.trim().length >= 2 &&
    validEmail &&
    validPhone &&
    acceptPolicies &&
    whatsappConsent;

  useEffect(() => {
    if (!isPartnerLoggedIn()) return;
    let active = true;
    const load = async () => {
      try {
        const profile = await fetchPartnerProfile();
        if (!active) return;
        router.replace(
          isPartnerProfileComplete(profile)
            ? redirectTarget
            : "/partner/profile/complete",
        );
      } catch {
        // Stay on login if the saved partner session is not usable.
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [redirectTarget, router]);

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

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "mobile" || key === "otp" ? value.replace(/\D/g, "") : value,
    }));
  };

  const switchMode = (nextMode: PartnerAuthMode) => {
    setMode(nextMode);
    setStep("details");
    setMessage(null);
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    const raw = value.replace(/\D/g, "");
    if (!raw) {
      const chars = form.otp.split("");
      chars[index] = "";
      setForm((prev) => ({ ...prev, otp: chars.join("") }));
      return;
    }

    if (raw.length > 1) {
      const pastedDigits = raw.slice(0, 6);
      setForm((prev) => ({ ...prev, otp: pastedDigits }));
      const nextIdx = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

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

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (mode === "login" && !validPhone) {
      setMessage({ text: "Please enter a valid 10-digit mobile number.", type: "error" });
      return;
    }

    if (mode === "register" && !registerReady) {
      setMessage({
        text: "Please enter agency name, valid email, mobile number, and agree to the required consent.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await sendPartnerOtp({
          mobile: digits,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        });
      } else {
        await sendPartnerOtp(digits);
      }
      setStep("otp");
      setOtpExpiresIn(5 * 60);
      setResendIn(30);
      setMessage({ text: "OTP sent successfully to your registered mobile number.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to send OTP. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!validOtp) {
      setMessage({ text: "Please enter the 6-digit OTP sent to your mobile.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const verification = await verifyPartnerOtp(
        digits,
        form.otp.replace(/\D/g, ""),
      );
      const profile =
        verification?.agency || (await fetchPartnerProfile().catch(() => null));
      const needsProfile =
        mode === "register" ||
        verification?.isNewAccount ||
        !isPartnerProfileComplete(profile);

      setMessage({ text: "Verified successfully! Redirecting to partner workspace...", type: "success" });
      router.replace(
        needsProfile ? "/partner/profile/complete" : redirectTarget,
      );
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to verify OTP. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendIn > 0) return;
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "register") {
        await sendPartnerOtp({
          mobile: digits,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        });
      } else {
        await sendPartnerOtp(digits);
      }
      setOtpExpiresIn(5 * 60);
      setResendIn(30);
      setMessage({ text: "OTP resent successfully.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to resend OTP.", type: "error" });
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
        <section className="relative lg:col-span-5 bg-gradient-to-br from-[#3B0764] via-[#5B21B6] to-[#6D28D9] text-white p-7 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              Scale your loan business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200">
                Fintaraa
              </span>
            </h1>

            <p className="mt-3 text-purple-100 text-xs sm:text-sm leading-relaxed max-w-md">
              Access 40+ banks & NBFCs, earn highest industry payouts, and track file disbursals in real time.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <Award className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Highest Industry Payouts</h4>
                  <p className="text-[11px] text-purple-200 font-normal">Guaranteed timely monthly payouts.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <TrendingUp className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Real-Time Application Tracking</h4>
                  <p className="text-[11px] text-purple-200 font-normal">Instant updates from lead login to sanction.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-purple-400/30 flex items-center justify-center shrink-0 text-white">
                  <Zap className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Dedicated Relationship Manager</h4>
                  <p className="text-[11px] text-purple-200 font-normal">Full operational and sanction support.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Metric */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-white">
                  <Users className="w-4 h-4 text-purple-200" />
                  <span className="text-xs font-semibold text-white">2,500+ Active DSAs</span>
                </div>
                <p className="text-[11px] text-purple-200 font-normal mt-0.5">Pan-India Partner Network</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-white">₹500 Cr+</p>
                <p className="text-[11px] text-purple-200 font-normal">Disbursed via Partners</p>
              </div>
            </div>
          </div>
        </section>


        {/* ================= RIGHT AUTH FORM ================= */}
        <section className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Mode Switcher Tabs */}
            {step === "details" && (
              <div className="flex p-1.5 rounded-2xl bg-purple-50/60 border border-purple-100 mb-8 max-w-md">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === "login"
                      ? "bg-[#5B21B6] text-white shadow-md shadow-purple-500/20"
                      : "text-[#5d6b7c] hover:text-[#5B21B6]"
                  }`}
                >
                  Partner Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === "register"
                      ? "bg-[#5B21B6] text-white shadow-md shadow-purple-500/20"
                      : "text-[#5d6b7c] hover:text-[#5B21B6]"
                  }`}
                >
                  Join as Partner
                </button>
              </div>
            )}

            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07162d] tracking-tight">
                {step === "otp"
                  ? "Verify OTP"
                  : mode === "register"
                    ? "Register Partner Agency"
                    : "Channel Partner Login"}
              </h2>
              <p className="mt-2 text-sm text-[#667085] leading-relaxed">
                {step === "otp" ? (
                  <>
                    Enter the 6-digit code sent to{" "}
                    <span className="font-bold text-[#5B21B6]">+91 {digits}</span>
                  </>
                ) : mode === "register" ? (
                  "Create your official partner account to start submitting loan cases directly to 40+ banks."
                ) : (
                  "Enter your registered partner mobile number to receive a secure login OTP."
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

            {/* DETAILS STEP (Login or Register) */}
            {step === "details" && (
              <form onSubmit={requestOtp} className="space-y-4">
                {mode === "register" && (
                  <>
                    <PartnerInputField
                      label="Agency / Business Name"
                      placeholder="e.g. Acme Financial Advisors"
                      value={form.name}
                      icon={<Building2 className="w-4 h-4 text-purple-600" />}
                      onChange={(val) => update("name", val)}
                      autoFocus
                    />

                    <PartnerInputField
                      label="Official Email Address"
                      placeholder="partner@yourcompany.com"
                      type="email"
                      value={form.email}
                      icon={<Mail className="w-4 h-4 text-purple-600" />}
                      onChange={(val) => update("email", val)}
                    />
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B21B6] mb-2">
                    Partner Mobile Number
                  </label>
                  <div className="relative flex items-center rounded-2xl border-2 border-purple-100 bg-purple-50/20 p-1.5 focus-within:border-[#5B21B6] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100 transition-all">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-purple-100 text-sm font-bold text-[#07162d] shadow-sm">
                      <span className="text-base">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoFocus={mode === "login"}
                      placeholder="Enter 10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      className="w-full bg-transparent px-3 py-2 text-base sm:text-lg font-bold text-[#07162d] placeholder:font-normal placeholder:text-[#98a2b3] outline-none"
                    />
                    {digits.length === 10 && (
                      <div className="pr-3 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      </div>
                    )}
                  </div>
                </div>

                {mode === "register" && (
                  <div className="pt-2 space-y-3">
                    <PartnerCheckbox
                      checked={whatsappConsent}
                      onChange={() => setWhatsappConsent((v) => !v)}
                      label="I agree to receive partner onboarding, payout updates, and file status alerts on WhatsApp and Email."
                    />
                    <PartnerCheckbox
                      checked={acceptPolicies}
                      onChange={() => setAcceptPolicies((v) => !v)}
                      label="I agree to the Fintaraa Channel Partner Agreement, Privacy Policy, and Terms of Service."
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "login" ? digits.length < 10 : !registerReady)}
                  className="w-full h-14 mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(91,33,182,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(91,33,182,0.45)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Sending OTP...
                    </span>
                  ) : (
                    <>
                      <span>{mode === "register" ? "Register with OTP" : "Get Login OTP"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP STEP */}
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
                        setStep("details");
                        setMessage(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#5B21B6] hover:underline"
                    >
                      <Edit3 className="w-3 h-3" /> Change Details
                    </button>
                  </div>

                  {/* 6-Box Segmented OTP Input */}
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
                      onClick={resendOtp}
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
                      <RefreshCw className="w-5 h-5 animate-spin" /> Verifying Partner OTP...
                    </span>
                  ) : (
                    <>
                      <span>Verify & Enter Partner Portal</span>
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
                Looking for regular customer login?{" "}
                <Link
                  href="/login"
                  className="text-[#5B21B6] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Customer Login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-[#98a2b3] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Bank Grade SSL</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PartnerInputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
  autoFocus = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#5B21B6] mb-1.5">
        {label}
      </label>
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

function PartnerCheckbox({
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
