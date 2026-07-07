"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Mail,
  Check,
  Phone,
  Building2,
  ArrowRight,
  LockKeyhole,
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
  const [message, setMessage] = useState("");
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
  });

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
    setMessage("");
  };

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (mode === "login" && !validPhone) {
      setMessage("Enter a valid mobile number to continue.");
      return;
    }

    if (mode === "register" && !registerReady) {
      setMessage(
        "Enter agency name, valid email, mobile number, and required consent.",
      );
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
      setMessage("OTP sent to your registered mobile number.");
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

      setMessage("Verified successfully. Redirecting.");
      router.replace(
        needsProfile ? "/partner/profile/complete" : redirectTarget,
      );
    } catch (error) {
      setMessage((error as Error).message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setMessage("");
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
      setMessage("OTP resent successfully.");
    } catch (error) {
      setMessage((error as Error).message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-9xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative flex min-h-136 flex-col overflow-hidden px-2 py-8 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mt-8 text-[42px] font-bold leading-[0.98] tracking-[-0.03em] text-[#07162d] md:text-[54px]">
              Unlock your
              <span className="block text-[#195585]">partner account</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[18px] leading-8 text-[#5d6b7c]">
              Access your Fintaraa partner profile, complete agency KYC, and
              review lead activity from one secure workspace.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-10">
            <div className="relative min-h-72 overflow-hidden">
              <Image
                src="/assets/refer/login.jpg"
                alt="Fintaraa partner login"
                fill
                priority
                className="w-full object-contain"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-5 lg:py-0">
          <div className="w-full max-w-2xl bg-white px-1 py-5 md:px-6 lg:px-8">
            <div className="mb-7">
              <h2 className="mt-4 text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#07162d]">
                {step === "otp"
                  ? "Verify OTP"
                  : mode === "register"
                    ? "Create partner account"
                    : "Partner login"}
              </h2>
              {step === "details" && mode === "login" ? (
                <h3 className="mt-5 text-[20px] font-semibold text-[#07162d]">
                  Welcome back!
                </h3>
              ) : null}
              <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085]">
                {step === "otp"
                  ? `Enter the 6-digit OTP sent to +${digits}.`
                  : mode === "register"
                    ? "Register your agency with name, email, mobile, and consent."
                    : "Use your partner mobile number to receive a one-time code."}
              </p>
            </div>

            {step === "details" ? (
              <form onSubmit={requestOtp} className="grid gap-5">
                {mode === "register" ? (
                  <>
                    <PartnerAuthField
                      label="Agency name"
                      placeholder="Fintaraa Partner"
                      value={form.name}
                      icon={<Building2 className="h-4 w-4 text-[#98a2b3]" />}
                      onChange={(value) => update("name", value)}
                    />
                    <PartnerAuthField
                      label="Agency email"
                      placeholder="partner@example.com"
                      value={form.email}
                      type="email"
                      icon={<Mail className="h-4 w-4 text-[#98a2b3]" />}
                      onChange={(value) => update("email", value)}
                    />
                  </>
                ) : null}

                <PartnerAuthField
                  label="Mobile number"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  type="tel"
                  inputMode="numeric"
                  icon={<Phone className="h-4 w-4 text-[#98a2b3]" />}
                  onChange={(value) => update("mobile", value)}
                />

                {mode === "register" ? (
                  <div className="grid gap-3">
                    <PartnerConsentRow
                      checked={whatsappConsent}
                      onChange={() => setWhatsappConsent((value) => !value)}
                      text="I agree to receive onboarding, application, and support updates from Fintaraa on WhatsApp, SMS, email, and phone."
                    />
                    <PartnerConsentRow
                      checked={acceptPolicies}
                      onChange={() => setAcceptPolicies((value) => !value)}
                      text="I agree to the Fintaraa Privacy Policy and Terms & Conditions."
                    />
                  </div>
                ) : null}

                <PartnerSubmitBlock
                  message={message}
                  loading={loading}
                  buttonText={
                    mode === "register" ? "Register with OTP" : "Get OTP"
                  }
                />
              </form>
            ) : (
              <form onSubmit={submitOtp} className="grid gap-5">
                <PartnerAuthField
                  label="OTP code"
                  placeholder="Enter 6 digit code"
                  value={form.otp}
                  inputMode="numeric"
                  onChange={(value) => update("otp", value)}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("details");
                      setMessage("");
                    }}
                    className="text-[13px] font-extrabold text-[#195585]"
                  >
                    Change details
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={loading}
                    className="text-[13px] font-extrabold text-[#195585] disabled:opacity-60"
                  >
                    Resend OTP
                  </button>
                </div>
                <PartnerSubmitBlock
                  message={message}
                  loading={loading}
                  buttonText="Verify & continue"
                />
              </form>
            )}

            <div className="mt-7 grid gap-3 text-center text-[13px] font-semibold text-[#667085]">
              {mode === "login" ? (
                <p>
                  New partner?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-extrabold text-[#195585]"
                  >
                    Create partner account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-extrabold text-[#195585]"
                  >
                    Login with OTP
                  </button>
                </p>
              )}
              <p>
                Looking for customer login?{" "}
                <Link href="/login" className="font-extrabold text-[#195585]">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PartnerAuthField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "numeric" | "text";
  icon?: ReactNode;
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
          onChange={(event) => onChange(event.target.value)}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-semibold text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold focus:border-transparent focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
      </div>
    </label>
  );
}

function PartnerConsentRow({
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
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
          checked
            ? "border-[#195585] bg-[#195585] text-white"
            : "border-[#cfddea] bg-white text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-[12px] font-semibold leading-5 text-[#667085]">
        {text}
      </span>
    </button>
  );
}

function PartnerSubmitBlock({
  message,
  loading,
  buttonText,
}: {
  message: string;
  loading: boolean;
  buttonText: string;
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
          className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-[#195585] px-6 text-[15px] font-extrabold text-white transition hover:bg-[#12476f] disabled:opacity-60"
        >
          {loading ? "Please wait..." : buttonText}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
        <p className="text-center text-[13px] font-semibold leading-6 text-[#667085]">
          <LockKeyhole className="mr-2 inline h-4 w-4 align-[-3px] text-[#195585]" />
          Your partner information is safe and secure.
        </p>
      </div>
    </div>
  );
}
