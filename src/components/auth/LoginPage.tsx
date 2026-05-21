"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Phone, ArrowRight, LockKeyhole, WalletCards } from "lucide-react";
import {
  signup,
  sendOtp,
  verifyOtp,
  mobileToPan,
  type AuthMode,
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

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [consentCibil, setConsentCibil] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panCard: "",
    referralCode: "",
    otp: "",
  });

  const digits = useMemo(() => normalizePhone(form.mobile), [form.mobile]);
  const pan = useMemo(() => normalizePAN(form.panCard), [form.panCard]);
  const validEmail = !form.email.trim() || emailRegex.test(form.email.trim());
  const validPan = /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(pan);
  const validPhone = digits.length >= 10 && digits.length <= 15;
  const validOtp = form.otp.replace(/\D/g, "").length === 6;
  const isSignupReady =
    mode === "login" ||
    (form.name.trim().length >= 2 &&
      validPhone &&
      validPan &&
      validEmail &&
      acceptPolicies);

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!validPhone || !isSignupReady) {
      setMessage("Please complete the required details before continuing.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup({
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          mobile: digits,
          panCard: pan,
          referralCode: form.referralCode.trim() || undefined,
          agreedToTerms: true,
          privacyPolicyAccepted: true,
        });
      }
      await sendOtp(digits);
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
      const response = await verifyOtp(
        digits,
        form.otp.replace(/\D/g, ""),
        mode === "signup" ? form.email.trim() || undefined : undefined,
        mode === "signup" ? form.name.trim() || undefined : undefined,
      );
      const user = response?.user;
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

      setMessage("Verified successfully. Redirecting to your account.");
      router.push("/account/profile");
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

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("phone");
    setMessage("");
    setAcceptPolicies(false);
    setConsentCibil(false);
    setForm((prev) => ({ ...prev, otp: "" }));
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
    if (!form.name.trim() || !validPan || !acceptPolicies) {
      setMessage("Complete name, valid PAN, and policy consent to continue.");
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
      setMessage("Profile completed. Redirecting to your account.");
      router.push("/account/profile");
    } catch (error) {
      setMessage((error as Error).message || "Unable to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-9xl overflow-hidden rounded-[36px] bg-[#eef8ff] p-5 shadow-[0_28px_80px_rgba(25,85,133,0.12)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:p-8">
        <section className="relative flex min-h-136 flex-col overflow-hidden rounded-[28px] p-6 md:p-10">
          <div className="relative z-10">
            <h1 className="mt-8 max-w-3xl text-[52px] font-bold leading-[0.98] tracking-[-0.03em] text-[#07162d] md:text-[64px]">
              Unlock your
              <span className="block text-[#195585]">Fintaraa account</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[20px] font-semibold leading-9 text-[#5d6b7c]">
              Access your profile, applications, offers, documents, statements,
              and support tickets from one secure workspace.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-10">
            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-[#195585]/28 bg-white/50 p-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]">
              <div>
                <WalletCards className="mx-auto h-12 w-12 text-[#195585]" />
                <p className="mt-4 text-[18px] font-black text-[#07162d]">
                  Image placement area
                </p>
                <p className="mt-2 max-w-md text-[13px] font-semibold leading-6 text-[#667085]">
                  Add the login visual here later. This space is aligned like
                  the reference image block.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-5 lg:py-0">
          <div className="w-full max-w-2xl rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(25,85,133,0.12)] md:p-10 lg:p-12">
            {step === "phone" ? (
              <div className="mb-7 grid grid-cols-2 gap-2 rounded-full bg-[#eef8ff] p-1">
                {[
                  ["login", "Login"],
                  ["signup", "Create Account"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => switchMode(value as AuthMode)}
                    className={`h-11 rounded-full text-[13px] font-black transition ${
                      mode === value
                        ? "bg-[#195585] text-white shadow-[0_10px_22px_rgba(25,85,133,0.22)]"
                        : "text-[#195585]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-7 inline-flex rounded-full bg-[#eef8ff] px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#195585]">
                {mode === "signup" ? "Create account flow" : "Login flow"}
              </div>
            )}

            <div className="mb-7">
              <h2 className="mt-4 text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#07162d]">
                {step === "otp"
                  ? "Verify OTP"
                  : step === "mobile-pan"
                    ? "Verify details"
                    : step === "complete-profile"
                      ? "Complete profile"
                      : mode === "login"
                        ? "Login with OTP"
                        : "Create account"}
              </h2>
              {step === "phone" ? (
                <h3 className="mt-5 text-[20px] font-semibold text-[#07162d]">
                  {mode === "login" ? "Welcome back!" : "Welcome to Fintaraa!"}
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
                {mode === "signup" ? (
                  <>
                    <AuthField
                      label="Full name"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(value) => update("name", value)}
                    />
                    <AuthField
                      label="Email address"
                      placeholder="Optional email address"
                      value={form.email}
                      type="email"
                      onChange={(value) => update("email", value)}
                    />
                  </>
                ) : null}

                <AuthField
                  label="Mobile number"
                  placeholder="Enter phone number"
                  value={form.mobile}
                  type="tel"
                  icon={<Phone className="h-4 w-4 text-[#98a2b3]" />}
                  onChange={(value) => update("mobile", value)}
                />

                {mode === "signup" ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <AuthField
                      label="PAN number"
                      placeholder="ABCDE1234F"
                      value={form.panCard}
                      onChange={(value) => update("panCard", value)}
                    />
                    <AuthField
                      label="Referral code"
                      placeholder="Optional"
                      value={form.referralCode}
                      onChange={(value) => update("referralCode", value)}
                    />
                  </div>
                ) : null}
                {mode === "signup" ? (
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
                ) : null}

                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText={
                    mode === "signup" ? "Create account" : "Send code"
                  }
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-[13px] font-black text-[#195585]"
                  >
                    Change mobile
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await sendOtp(digits);
                        setMessage("OTP resent successfully.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-[13px] font-black text-[#195585]"
                  >
                    Resend OTP
                  </button>
                </div>
                <SubmitBlock
                  message={message}
                  loading={loading}
                  buttonText="Verify & continue"
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
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
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
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-black ${
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
          className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-[#195585] px-6 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(25,85,133,0.24)] disabled:opacity-60"
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
