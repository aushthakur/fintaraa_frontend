"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Phone,
  Loader2,
  RefreshCcw,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import {
  sendOtp,
  verifyOtp,
  mobileToPan,
  getCurrentUser,
  updateUserProfile,
} from "@/services/auth";
import { fetchUserCibil, type UserCibilResponse } from "@/services/cibil";

type Step = "phone" | "otp" | "details" | "score";

const inputClass =
  "h-10 w-full rounded-lg border border-[#d7e4f2] bg-white px-3 text-[13px] font-bold text-[#111827] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#00529c] focus:ring-2 focus:ring-[#e4f1ff] disabled:bg-slate-50 disabled:text-slate-500 sm:h-11";

const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(-10);
const normalizePan = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
const isValidPan = (value: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);

const unwrap = (response: any): UserCibilResponse =>
  response?.data || response || {};

const extractScore = (data: any) =>
  data?.cibilScore ||
  data?.report?.data?.credit_score ||
  data?.report?.data?.score ||
  data?.report?.data?.cibil_score ||
  data?.report?.score ||
  data?.report?.cibil_score ||
  data?.data?.report?.data?.credit_score ||
  null;

const formatDateTime = (value?: string) => {
  if (!value) return "Not fetched yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not fetched yet";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const profileValue = (source: any, keys: string[]) => {
  for (const key of keys) {
    const value = key.split(".").reduce((acc, part) => acc?.[part], source);
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

function CreditReportTermsCopy() {
  return (
    <p className="text-[13px] font-medium leading-relaxed text-gray-500">
      By logging in, you agree to the following Credit Report Terms of use an
      privacy policy.{" "}
      <Link
        href="/terms-and-conditions"
        className="font-semibold text-[#00529c] hover:underline"
      >
        More
      </Link>
    </p>
  );
}

function PoweredByBureaus() {
  return (
    <div className="mt-5 flex flex-col items-center">
      <div className="relative flex w-full items-center justify-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent" />
        </div>
        <span className="relative z-10 bg-white px-3 text-[12px] font-bold text-gray-500">
          Powered by
        </span>
      </div>

      <div className="mt-3 flex items-center gap-5 select-none">
        <div className="flex flex-col items-start leading-none">
          <span className="text-[18px] font-black tracking-tight text-[#008ccf]">
            CIBIL
          </span>
          <span className="-mt-0.5 text-[7px] font-bold uppercase tracking-tighter text-gray-400">
            Part of TransUnion
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="grid h-2.5 w-2.5 shrink-0 rotate-45 grid-cols-2 gap-0.5">
            <span className="h-1 w-1 rounded-full bg-indigo-500" />
            <span className="h-1 w-1 rounded-full bg-pink-500" />
            <span className="h-1 w-1 rounded-full bg-purple-500" />
            <span className="h-1 w-1 rounded-full bg-blue-500" />
          </div>
          <span className="font-sans text-[15px] font-bold tracking-tight text-[#3b2b80]">
            Experian<span className="font-light text-blue-500">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function CibilScoreChecker() {
  const { user } = useCurrentUser();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("phone");
  const [hasUserSession, setHasUserSession] = useState(false);
  const [scoreData, setScoreData] = useState<UserCibilResponse | null>(null);
  const [form, setForm] = useState({
    otp: "",
    name: "",
    mobile: "",
    panCard: "",
    gender: "male",
  });

  const score = useMemo(() => extractScore(scoreData), [scoreData]);
  const lastFetchedAt = scoreData?.lastFetchedAt || scoreData?.lastConsentAt;
  const canFetch = Boolean(
    form.name.trim() &&
    normalizePhone(form.mobile).length === 10 &&
    isValidPan(form.panCard),
  );

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      const loggedIn = getAuthType() === "user" && Boolean(getAuthToken());
      const source = user || {};
      const next = {
        mobile: normalizePhone(
          profileValue(source, [
            "mobile",
            "personalDetails.mobile",
            "kycProfile.personalDetails.mobile",
          ]),
        ),
        name: profileValue(source, [
          "name",
          "fullName",
          "personalDetails.fullName",
          "kycProfile.personalDetails.fullName",
        ]),
        panCard: normalizePan(
          profileValue(source, [
            "panCard",
            "personalDetails.panNumber",
            "kycProfile.personalDetails.panNumber",
          ]),
        ),
        gender:
          profileValue(source, [
            "gender",
            "personalDetails.gender",
            "kycProfile.personalDetails.gender",
          ]).toLowerCase() === "female"
            ? "female"
            : "male",
      };

      setHasUserSession(loggedIn);
      setForm((current) => ({
        ...current,
        name: current.name || next.name,
        mobile: current.mobile || next.mobile,
        gender: current.gender || next.gender,
        panCard: current.panCard || next.panCard,
      }));

      if (loggedIn) setStep("details");

      const existingScore = (source as any)?.cibilScore;
      const existingLastFetched = (source as any)?.cibilLastFetchedAt;
      if (existingScore || existingLastFetched) {
        setScoreData({
          cibilScore: Number(existingScore) || undefined,
          lastFetchedAt: existingLastFetched
            ? String(existingLastFetched)
            : undefined,
          cached: true,
        });
        setStep("score");
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  const setField = (key: keyof typeof form, value: string) => {
    setError("");
    setMessage("");
    setForm((current) => ({
      ...current,
      [key]:
        key === "mobile"
          ? normalizePhone(value)
          : key === "panCard"
            ? normalizePan(value)
            : value,
    }));
  };

  const handleSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (normalizePhone(form.mobile).length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(normalizePhone(form.mobile));
      setStep("otp");
      setMessage("OTP sent to your mobile number.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.otp.replace(/\D/g, "").length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(
        normalizePhone(form.mobile),
        form.otp.replace(/\D/g, ""),
      );
      const verifiedUser = response?.user as any;
      setForm((current) => ({
        ...current,
        name: current.name || String(verifiedUser?.name || ""),
        panCard:
          current.panCard || normalizePan(String(verifiedUser?.panCard || "")),
        gender:
          String(
            verifiedUser?.gender || current.gender || "male",
          ).toLowerCase() === "female"
            ? "female"
            : "male",
      }));
      setStep("details");
      setMessage("Mobile verified. Confirm your PAN details to fetch CIBIL.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPanIfNeeded = async () => {
    if (isValidPan(form.panCard)) return form.panCard;
    if (!form.name.trim()) throw new Error("Enter your full name as per PAN.");
    const response = await mobileToPan({
      name: form.name.trim(),
      mobile_no: normalizePhone(form.mobile),
    });
    const panNumber = normalizePan(response?.data?.pan_number || "");
    if (!isValidPan(panNumber)) {
      throw new Error("PAN number was not found for this mobile number.");
    }
    setForm((current) => ({ ...current, panCard: panNumber }));
    return panNumber;
  };

  const handleFetchScore = async (forceRefresh = false) => {
    setError("");
    setMessage("");
    if (normalizePhone(form.mobile).length !== 10) {
      setError("Mobile number is required.");
      return;
    }
    if (!form.name.trim()) {
      setError("Enter your full name as per PAN.");
      return;
    }

    setLoading(true);
    try {
      const panCard = await fetchPanIfNeeded();
      await updateUserProfile({
        name: form.name.trim(),
        mobile: normalizePhone(form.mobile),
        panCard,
        gender: form.gender,
        agreedToTerms: true,
        privacyPolicyAccepted: true,
      });
      const response = unwrap(await fetchUserCibil(forceRefresh));
      setScoreData(response);
      setStep("score");
      setMessage(response?.message || "CIBIL score fetched successfully.");
      void getCurrentUser().catch(() => undefined);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to fetch CIBIL score.",
      );
    } finally {
      setLoading(false);
    }
  };

  const actionLabel = score ? "Refetch Credit Score" : "Get Credit Score";

  return (
    <div className="mx-auto w-full max-w-120 overflow-hidden rounded-b-lg border border-gray-200/80 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.035)] lg:mx-0">
      <div className="bg-[#00529c] px-4 py-2.5 text-center">
        <p className="text-[12px] font-normal tracking-wide text-white">
          Check free credit score{" "}
          <span className="font-extrabold">with live CIBIL fetch</span>
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-[#222222] sm:text-[22px]">
              {step === "score" ? "Your Credit Score" : "Check Your Score Now"}
            </h2>
            {step !== "score" ? (
              <p className="mt-1 text-[13px] font-medium text-gray-500">
                {hasUserSession
                  ? "Confirm your details to fetch your score."
                  : "Verify your mobile to continue."}
              </p>
            ) : null}
          </div>
          {hasUserSession ? (
            <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Logged in
            </span>
          ) : null}
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] font-black text-[#344054]">
                Mobile Number
              </span>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <input
                  className={`${inputClass} pl-10`}
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={(event) => setField("mobile", event.target.value)}
                />
              </div>
            </label>
            <p className="text-[12px] font-medium leading-normal text-gray-600/90">
              You will receive an OTP on mentioned number
            </p>
            <CreditReportTermsCopy />
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-[14px] font-bold text-white transition-colors hover:bg-[#17a34f] disabled:opacity-70 active:scale-[0.995]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Sending OTP..." : "Get Free Credit Score"}
            </button>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={handleVerifyOtp} className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] font-black text-[#344054]">
                OTP Code
              </span>
              <input
                className={inputClass}
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={form.otp}
                onChange={(event) =>
                  setField(
                    "otp",
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-[12px] font-black text-[#00529c]"
              >
                Change mobile
              </button>
              <button
                type="button"
                onClick={() => void sendOtp(normalizePhone(form.mobile))}
                className="text-[12px] font-black text-[#00529c]"
              >
                Resend OTP
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-[14px] font-bold text-white disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Verify OTP
            </button>
          </form>
        ) : null}

        {step === "details" || step === "score" ? (
          <div className="mt-4 grid gap-3">
            {step === "score" ? (
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fbff] px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#00529c]">
                      CIBIL Score
                    </p>
                    <p className="mt-1 text-[11px] font-bold leading-snug text-[#667085]">
                      Last fetched: {formatDateTime(lastFetchedAt)}
                    </p>
                    {scoreData?.refreshAvailableInDays ? (
                      <p className="mt-0.5 text-[11px] font-bold text-amber-700">
                        Refresh in {scoreData.refreshAvailableInDays} day(s).
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-[48px] font-black leading-none text-[#111827]">
                    {score || "—"}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-[#344054]">
                  Full Name as per PAN
                </span>
                <input
                  className={inputClass}
                  value={form.name}
                  placeholder="Full name"
                  onChange={(event) => setField("name", event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-[#344054]">
                  Mobile
                </span>
                <input className={inputClass} value={form.mobile} disabled />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-[#344054]">
                  PAN Number
                </span>
                <input
                  className={inputClass}
                  value={form.panCard}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  onChange={(event) => setField("panCard", event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-[#344054]">
                  Gender
                </span>
                <select
                  className={inputClass}
                  value={form.gender}
                  onChange={(event) => setField("gender", event.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>

            <div className={score ? "grid gap-2.5 sm:grid-cols-2" : ""}>
              <button
                type="button"
                disabled={loading || !canFetch}
                onClick={() => handleFetchScore(Boolean(score))}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : score ? (
                  <RefreshCcw className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {loading ? "Fetching..." : actionLabel}
              </button>

              {score ? (
                <Link
                  href="/cibil-score/report"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#00529c] bg-white text-[14px] font-bold text-[#00529c] no-underline transition-colors hover:bg-[#eef8ff]"
                >
                  <FileText className="h-4 w-4" />
                  View Full Report
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {message ? (
          <p className="mt-4 text-[12px] font-bold text-[#00529c]">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-4 text-[12px] font-bold text-red-600">{error}</p>
        ) : null}

        {step === "score" ? null : <PoweredByBureaus />}
      </div>
    </div>
  );
}
