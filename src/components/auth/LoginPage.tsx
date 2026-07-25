"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSafeRedirectTarget } from "@/lib/loginRedirect";
import { Phone, ArrowRight, LockKeyhole } from "lucide-react";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  sendOtp,
  verifyOtp,
  mobileToPan,
  updateUserProfile,
} from "@/services/auth";

const normalizePhone = (input: string) => input.replace(/\D/g, "");
const normalizePAN = (input: string) =>
  input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthStep = "phone" | "otp" | "mobile-pan" | "complete-profile";

export function LoginPage({ redirectParam }: { redirectParam?: string } = {}) {
  const router = useRouter();
  const postLoginTarget = useMemo(
    () => getSafeRedirectTarget(redirectParam),
    [redirectParam],
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>("phone");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const [consentCibil, setConsentCibil] = useState(false);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [accountExisted, setAccountExisted] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panCard: "",
    otp: "",
  });

  const pan = useMemo(() => normalizePAN(form.panCard), [form.panCard]);
  const digits = useMemo(() => normalizePhone(form.mobile), [form.mobile]);
  const validEmail = !form.email.trim() || emailRegex.test(form.email.trim());

  const validPan = /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(pan);
  const validOtp = form.otp.replace(/\D/g, "").length === 6;
  const validPhone = digits.length >= 10 && digits.length <= 15;

  useEffect(() => {
    if (getAuthType() === "user" && getAuthToken()) {
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

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setAccountExisted(null);
    if (!validPhone) {
      setMessage("Enter a valid mobile number to continue.");
      return;
    }
    setLoading(true);
    try {
      const response = await sendOtp(digits);
      setAccountExisted(
        typeof response?.existed === "boolean" ? response.existed : null,
      );
      setStep("otp");
      setOtpExpiresIn(5 * 60);
      setResendIn(30);
      setMessage("OTP sent to your mobile number.");
    } catch (error) {
      setMessage((error as Error).message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!validOtp) {
      setMessage("Enter the 6-digit OTP sent to your mobile number.");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(digits, form.otp.replace(/\D/g, ""));
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
        setMessage("Mobile verified. Complete your PAN details to continue.");
        return;
      }

      setMessage("Verified successfully. Redirecting.");
      router.push(postLoginTarget);
    } catch (error) {
      setMessage((error as Error).message || "Unable to verify OTP.");
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
    setMessage("");
    if (!form.name.trim()) {
      setMessage("Enter your full name as per PAN.");
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
        setMessage("PAN number was not found for this mobile number.");
        return;
      }
      setForm((prev) => ({ ...prev, panCard: panNumber }));
      setAcceptPolicies(false);
      setConsentCibil(false);
      setStep("complete-profile");
      setMessage("PAN fetched successfully. Review and continue.");
    } catch (error) {
      setMessage((error as Error).message || "Failed to fetch PAN details.");
    } finally {
      setLoading(false);
    }
  };

  const completeVerifiedProfile = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!form.name.trim() || !validPan || !validEmail || !acceptPolicies) {
      setMessage(
        "Complete name, valid PAN, valid email if provided, and policy consent to continue.",
      );
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
      setMessage("Profile completed. Redirecting.");
      router.push(postLoginTarget);
    } catch (error) {
      setMessage((error as Error).message || "Unable to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-8 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-9xl overflow-hidden rounded-[36px] px-4 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-8">
        <section className="relative flex min-h-136 flex-col overflow-hidden rounded-[28px] md:p-10">
          <div className="relative z-10">
            <h1 className="mt-8 max-w-3xl text-[42px] font-bold leading-[0.98] tracking-[-0.03em] text-[#07162d] md:text-[54px]">
              Unlock your
              <span className="block text-[#195585]">Fintaraa account</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[18px] text-[#5d6b7c]">
              Access your profile, applications, offers, documents, statements,
              and support tickets from one secure workspace.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-10">
            <div className="relative min-h-72 overflow-hidden">
              <Image
                src="/assets/refer/login.jpg"
                alt="Fintaraa secure login"
                fill
                priority
                className="object-contain w-full"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-5 lg:py-0">
          <div className="w-full max-w-2xl rounded-[34px] bg-white p-4 md:p-6 border border-gray-200 lg:p-8">
            <div className="mb-7">
              <h2 className="mt-4 text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#07162d]">
                {step === "otp"
                  ? "Verify OTP"
                  : step === "mobile-pan"
                    ? "Verify details"
                    : step === "complete-profile"
                      ? "Finish account setup"
                      : "Login with OTP"}
              </h2>
              {step === "phone" ? (
                <h3 className="mt-5 text-[20px] font-semibold text-[#07162d]">
                  Welcome back!
                </h3>
              ) : null}
              <p className="mt-2 text-[14px] font-semibold text-[#667085]">
                {step === "otp"
                  ? `Enter the 6-digit OTP sent to +${digits}.`
                  : step === "mobile-pan"
                    ? "Enter your full name as per PAN. We will fetch PAN using your verified mobile number."
                    : step === "complete-profile"
                      ? "Review your PAN details and accept policy consent to continue."
                      : "Use your mobile number to receive a one-time code. Standard SMS rates may apply."}
              </p>
            </div>

            {step === "phone" ? (
              <form onSubmit={requestOtp} className="grid gap-5">
                <AuthField
                  label="Mobile number"
                  placeholder="Enter phone number"
                  value={form.mobile}
                  type="tel"
                  icon={<Phone className="h-4 w-4 text-[#98a2b3]" />}
                  onChange={(value) => update("mobile", value)}
                />

                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText="Get OTP"
                  helper="Your information is safe & secure."
                />
              </form>
            ) : step === "otp" ? (
              <form onSubmit={submitOtp} className="grid gap-5">
                <AuthField
                  label="OTP code"
                  placeholder="Enter 6 digit code"
                  value={form.otp}
                  inputMode="numeric"
                  onChange={(value) => update("otp", value)}
                />
                <div className="flex items-center justify-between rounded-xl bg-[#f4f8fc] px-4 py-3 text-[13px] font-bold">
                  <span className="text-[#667085]">OTP validity</span>
                  <span
                    className={
                      otpExpiresIn > 0 ? "text-[#087443]" : "text-[#b42318]"
                    }
                  >
                    {otpExpiresIn > 0
                      ? `${String(Math.floor(otpExpiresIn / 60)).padStart(2, "0")}:${String(otpExpiresIn % 60).padStart(2, "0")}`
                      : "Expired"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-[13px] font-extrabold text-[#195585]"
                  >
                    Change mobile
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (resendIn > 0) return;
                      setLoading(true);
                      try {
                        await sendOtp(digits);
                        setOtpExpiresIn(5 * 60);
                        setResendIn(30);
                        setMessage("OTP resent successfully.");
                      } catch (error) {
                        setMessage(
                          (error as Error).message || "Unable to resend OTP.",
                        );
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={resendIn > 0 || loading}
                    className="text-[13px] font-extrabold text-[#195585] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>
                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText={
                    accountExisted === false
                      ? "Verify & setup account"
                      : "Verify & continue"
                  }
                  helper="Your information is safe & secure."
                />
              </form>
            ) : step === "mobile-pan" ? (
              <form onSubmit={fetchPanFromMobile} className="grid gap-5">
                <AuthField
                  label="Full name as per PAN"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(value) => update("name", value)}
                />
                <AuthField
                  label="Verified mobile number"
                  placeholder="Mobile number"
                  value={digits}
                  type="tel"
                  onChange={() => undefined}
                  disabled
                />
                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText="Fetch PAN & continue"
                  helper="Your information is safe & secure."
                />
              </form>
            ) : (
              <form onSubmit={completeVerifiedProfile} className="grid gap-5">
                <AuthField
                  label="Full name"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(value) => update("name", value)}
                />
                <AuthField
                  label="PAN number"
                  placeholder="ABCDE1234F"
                  value={form.panCard}
                  onChange={(value) => update("panCard", value)}
                  disabled={Boolean(form.panCard)}
                />
                <AuthField
                  label="Email address"
                  placeholder="Optional email address"
                  value={form.email}
                  type="email"
                  onChange={(value) => update("email", value)}
                />
                <div className="grid gap-3">
                  <ConsentRow
                    checked={consentCibil}
                    onChange={() => setConsentCibil((value) => !value)}
                    text="I consent to the collection and use of my CIBIL score for verification purposes."
                  />
                  <ConsentRow
                    checked={acceptPolicies}
                    onChange={() => setAcceptPolicies((value) => !value)}
                    text="I have read and agree to the Privacy Policy and Terms & Conditions."
                  />
                </div>
                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText="Continue"
                  helper="Your information is safe & secure."
                />
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  icon,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "numeric" | "text";
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1 flex items-center gap-2">
        {icon}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-semibold text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold placeholder:transition-colors focus:border-transparent focus:placeholder:text-[#c8d5e1] disabled:text-[#667085]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
        <span className="pointer-events-none absolute -bottom-1 left-0 h-2 w-2 scale-0 rounded-full bg-[#195585] opacity-0 shadow-[0_0_0_5px_rgba(25,85,133,0.10)] transition-all duration-300 peer-focus:scale-100 peer-focus:opacity-100" />
      </div>
    </label>
  );
}

function ConsentRow({
  checked,
  onChange,
  text,
}: {
  checked: boolean;
  onChange: () => void;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-start gap-3 text-left"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-extrabold ${
          checked
            ? "border-[#195585] bg-[#195585] text-white"
            : "border-[#cfddea] bg-white text-transparent"
        }`}
      >
        ✓
      </span>
      <span className="text-[12px] font-semibold leading-5 text-[#667085]">
        {text}
      </span>
    </button>
  );
}

function SubmitBlock({
  message,
  loading,
  buttonText,
  helper,
}: {
  message: string;
  loading: boolean;
  buttonText: string;
  helper: string;
}) {
  return (
    <div className="pt-2">
      {message ? (
        <p className="mb-3 text-[13px] font-semibold leading-6 text-[#195585]">
          {message}
        </p>
      ) : null}
      <div className="grid gap-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-[#195585] px-6 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(25,85,133,0.24)] disabled:opacity-60"
        >
          {loading ? "Please wait..." : buttonText}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
        <p className="text-center text-[13px] font-semibold leading-6 text-[#667085]">
          <LockKeyhole className="mr-2 inline h-4 w-4 align-[-3px] text-[#195585]" />
          {helper}
        </p>
      </div>
    </div>
  );
}
