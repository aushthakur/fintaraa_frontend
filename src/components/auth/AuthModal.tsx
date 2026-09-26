"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  RefreshCw,
  Edit3,
  User,
  CreditCard,
  Mail,
  Building2,
  Check,
} from "lucide-react";
import { useAuthModal, type AuthModalMode } from "@/context/AuthModalContext";
import {
  sendOtp,
  verifyOtp,
  mobileToPan,
  updateUserProfile,
} from "@/services/auth";
import {
  sendPartnerOtp,
  verifyPartnerOtp,
  fetchPartnerProfile,
  isPartnerProfileComplete,
} from "@/services/partner";
import { emitAuthChanged } from "@/lib/authEvents";
import { normalizeReferralCode } from "@/services/referralAttribution";

const normalizePhone = (input: string) => input.replace(/\D/g, "");
const normalizePAN = (input: string) =>
  input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserStep = "phone" | "otp" | "mobile-pan" | "complete-profile";
type PartnerStep = "details" | "otp";
type PartnerSubMode = "login" | "register";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, closeAuthModal, mode, setMode, redirectTarget, referralCode } =
    useAuthModal();

  // User auth state
  const [userStep, setUserStep] = useState<UserStep>("phone");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panCard: "",
    otp: "",
  });
  const [userConsentCibil, setUserConsentCibil] = useState(false);
  const [userAcceptPolicies, setUserAcceptPolicies] = useState(false);
  const [userAccountExisted, setUserAccountExisted] = useState<boolean | null>(null);

  // Partner auth state
  const [partnerSubMode, setPartnerSubMode] = useState<PartnerSubMode>("login");
  const [partnerStep, setPartnerStep] = useState<PartnerStep>("details");
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
  });
  const [partnerWhatsappConsent, setPartnerWhatsappConsent] = useState(false);
  const [partnerAcceptPolicies, setPartnerAcceptPolicies] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "info" | "success" } | null>(null);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Computed values
  const userDigits = useMemo(() => normalizePhone(userForm.mobile), [userForm.mobile]);
  const userPan = useMemo(() => normalizePAN(userForm.panCard), [userForm.panCard]);
  const validUserPan = /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(userPan);
  const validUserEmail = !userForm.email.trim() || emailRegex.test(userForm.email.trim());

  const partnerDigits = useMemo(() => normalizePhone(partnerForm.mobile), [partnerForm.mobile]);
  const validPartnerEmail = emailRegex.test(partnerForm.email.trim());
  const partnerRegisterReady =
    partnerForm.name.trim().length >= 2 &&
    validPartnerEmail &&
    partnerDigits.length >= 10 &&
    partnerAcceptPolicies &&
    partnerWhatsappConsent;

  // Reset states when modal closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAuthModal]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || (otpExpiresIn <= 0 && resendIn <= 0)) return;
    const timer = window.setInterval(() => {
      setOtpExpiresIn((v) => Math.max(v - 1, 0));
      setResendIn((v) => Math.max(v - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, otpExpiresIn, resendIn]);

  // Auto focus OTP box
  useEffect(() => {
    if (
      (mode === "user" && userStep === "otp") ||
      (mode === "partner" && partnerStep === "otp")
    ) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [mode, userStep, partnerStep]);

  const handleTabChange = (newMode: AuthModalMode) => {
    setMode(newMode);
    setMessage(null);
    setLoading(false);
  };

  /* ================= USER FLOW HANDLERS ================= */
  const requestUserOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (userDigits.length < 10) {
      setMessage({ text: "Please enter a valid 10-digit mobile number.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await sendOtp(userDigits);
      setUserAccountExisted(
        typeof response?.existed === "boolean" ? response.existed : null,
      );
      setUserStep("otp");
      setOtpExpiresIn(response?.expiresInSeconds || 5 * 60);
      setResendIn(30);
      setMessage({ text: "OTP sent to your mobile number.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to send OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const submitUserOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanOtp = userForm.otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setMessage({ text: "Please enter the 6-digit OTP.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(
        userDigits,
        cleanOtp,
        undefined,
        undefined,
      );
      const user = response?.user;
      const existed =
        typeof response?.accountExisted === "boolean"
          ? response.accountExisted
          : userAccountExisted;
      setUserAccountExisted(existed);
      const userName = String(user?.name || "").trim();
      const needsProfile = Boolean(
        response?.needsProfileCompletion ||
        !userName ||
        userName.toLowerCase().startsWith("user ") ||
        !user?.panCard,
      );

      if (needsProfile) {
        setUserForm((prev) => ({
          ...prev,
          name:
            userName && !userName.toLowerCase().startsWith("user ")
              ? userName
              : prev.name,
          panCard: user?.panCard ? String(user.panCard) : prev.panCard,
          otp: "",
        }));
        setUserStep("mobile-pan");
        setMessage({ text: "Mobile verified. Please confirm your PAN details.", type: "info" });
        return;
      }

      emitAuthChanged();
      closeAuthModal();
      if (redirectTarget) {
        router.push(redirectTarget);
      } else {
        router.refresh();
      }
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to verify OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPan = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!userForm.name.trim()) {
      setMessage({ text: "Enter your full name as per PAN.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await mobileToPan({
        name: userForm.name.trim(),
        mobile_no: userDigits,
      });
      const panNumber = response?.data?.pan_number;
      if (!panNumber) {
        setMessage({ text: "PAN not found for this number. Enter PAN manually.", type: "error" });
        return;
      }
      setUserForm((prev) => ({ ...prev, panCard: panNumber }));
      setUserAcceptPolicies(false);
      setUserConsentCibil(false);
      setUserStep("complete-profile");
      setMessage({ text: "PAN details retrieved. Confirm to proceed.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Failed to fetch PAN details.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const completeUserProfile = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!userForm.name.trim() || !validUserPan || !validUserEmail || !userAcceptPolicies) {
      setMessage({
        text: "Please fill all details and accept the terms to continue.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile({
        name: userForm.name.trim(),
        mobile: userDigits,
        panCard: userPan,
        email: userForm.email.trim() || undefined,
        agreedToTerms: userAcceptPolicies,
        privacyPolicyAccepted: userAcceptPolicies,
      });
      emitAuthChanged();
      closeAuthModal();
      if (redirectTarget) {
        router.push(redirectTarget);
      } else {
        router.refresh();
      }
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to complete profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= PARTNER FLOW HANDLERS ================= */
  const requestPartnerOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (partnerSubMode === "login" && partnerDigits.length < 10) {
      setMessage({ text: "Please enter a valid 10-digit mobile number.", type: "error" });
      return;
    }
    if (partnerSubMode === "register" && !partnerRegisterReady) {
      setMessage({
        text: "Please enter agency name, valid email, mobile, and accept consent.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (partnerSubMode === "register") {
        await sendPartnerOtp({
          mobile: partnerDigits,
          name: partnerForm.name.trim(),
          email: partnerForm.email.trim().toLowerCase(),
        });
      } else {
        await sendPartnerOtp(partnerDigits);
      }
      setPartnerStep("otp");
      setOtpExpiresIn(5 * 60);
      setResendIn(30);
      setMessage({ text: "OTP sent to your registered partner number.", type: "success" });
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to send OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const submitPartnerOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanOtp = partnerForm.otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setMessage({ text: "Please enter the 6-digit OTP.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const verification = await verifyPartnerOtp(partnerDigits, cleanOtp);
      const profile =
        verification?.agency || (await fetchPartnerProfile().catch(() => null));
      const needsProfile =
        partnerSubMode === "register" ||
        verification?.isNewAccount ||
        !isPartnerProfileComplete(profile);

      emitAuthChanged();
      closeAuthModal();
      router.push(needsProfile ? "/partner/profile/complete" : redirectTarget || "/partner/profile");
    } catch (error) {
      setMessage({ text: (error as Error).message || "Unable to verify OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP BOX HELPERS ================= */
  const handleOtpBoxChange = (
    index: number,
    value: string,
    currentOtp: string,
    setOtp: (val: string) => void,
  ) => {
    const raw = value.replace(/\D/g, "");
    if (!raw) {
      const chars = currentOtp.split("");
      chars[index] = "";
      setOtp(chars.join(""));
      return;
    }

    if (raw.length > 1) {
      const pasted = raw.slice(0, 6);
      setOtp(pasted);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const currentChars = (currentOtp + "      ").slice(0, 6).split("");
    currentChars[index] = raw;
    const updated = currentChars.join("").trim();
    setOtp(updated);

    if (index < 5 && raw) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    currentOtp: string,
  ) => {
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLElement>,
    setOtp: (val: string) => void,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      setOtp(pasted);
      const targetIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[targetIdx]?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden z-10 my-auto"
          >
            {/* Modal Top Header */}
            <div className="relative pt-6 px-6 sm:px-8 pb-3 border-b border-purple-50">
              {/* Close Button */}
              <button
                type="button"
                onClick={closeAuthModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Mode Toggle Tabs (Customer vs Partner) */}
              <div className="flex p-1 bg-purple-50/70 rounded-xl max-w-xs mx-auto mb-4 border border-purple-100">
                <button
                  type="button"
                  onClick={() => handleTabChange("user")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    mode === "user"
                      ? "bg-white text-[#5B21B6] shadow-sm"
                      : "text-slate-600 hover:text-[#5B21B6]"
                  }`}
                >
                  Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("partner")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    mode === "partner"
                      ? "bg-white text-[#5B21B6] shadow-sm"
                      : "text-slate-600 hover:text-[#5B21B6]"
                  }`}
                >
                  Partner Login
                </button>
              </div>

              {/* Title and Subtitle - Clean typography without bold text */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  {mode === "user"
                    ? userStep === "otp"
                      ? "Verify Mobile Number"
                      : userStep === "mobile-pan"
                        ? "Verify Identity"
                        : userStep === "complete-profile"
                          ? "Complete Profile"
                          : "Welcome to Fintaraa"
                    : partnerStep === "otp"
                      ? "Verify Partner OTP"
                      : partnerSubMode === "register"
                        ? "Register Partner Account"
                        : "Partner Portal Login"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
                  {mode === "user"
                    ? userStep === "otp"
                      ? `Enter the 6-digit code sent to +91 ${userDigits}`
                      : userStep === "mobile-pan"
                        ? "We will fetch and verify your PAN details"
                        : userStep === "complete-profile"
                          ? "Confirm details to access personalized offers"
                          : "Enter mobile number to receive a one-time password"
                    : partnerStep === "otp"
                      ? `Enter the 6-digit code sent to +91 ${partnerDigits}`
                      : partnerSubMode === "register"
                        ? "Sign up your agency to submit loan applications"
                        : "Access partner dashboard and real-time lead updates"}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4">
              {/* Alert Message Box */}
              {message && (
                <div
                  className={`flex items-start gap-2.5 p-3 rounded-xl text-xs font-medium transition-all ${
                    message.type === "error"
                      ? "bg-rose-50 border border-rose-200 text-rose-700"
                      : message.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-purple-50 border border-purple-200 text-purple-800"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {message.type === "error" ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold">!</span>
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">{message.text}</div>
                </div>
              )}

              {/* ================= USER FLOW ================= */}
              {mode === "user" && (
                <>
                  {userStep === "phone" && (
                    <form onSubmit={requestUserOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Mobile Number
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 p-1 focus-within:border-[#7C3AED] focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-purple-100 text-xs font-medium text-slate-800">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            autoFocus
                            placeholder="Enter 10-digit number"
                            value={userForm.mobile}
                            onChange={(e) =>
                              setUserForm((prev) => ({
                                ...prev,
                                mobile: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base font-normal text-slate-800 placeholder:text-slate-400 outline-none"
                          />
                          {userDigits.length === 10 && (
                            <div className="pr-3 text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || userDigits.length < 10}
                        className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Sending OTP...
                          </span>
                        ) : (
                          <>
                            <span>Get Verification Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {userStep === "otp" && (
                    <form onSubmit={submitUserOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-slate-700">
                            Enter 6-digit code
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setUserStep("phone");
                              setMessage(null);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-normal text-[#6D28D9] hover:underline"
                          >
                            <Edit3 className="w-3 h-3" /> Change
                          </button>
                        </div>

                        {/* 6 OTP Boxes */}
                        <div
                          className="flex items-center justify-between gap-1.5 sm:gap-2"
                          onPaste={(e) =>
                            handleOtpPaste(e, (val) =>
                              setUserForm((prev) => ({ ...prev, otp: val })),
                            )
                          }
                        >
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                otpInputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={userForm.otp[idx] || ""}
                              onChange={(e) =>
                                handleOtpBoxChange(
                                  idx,
                                  e.target.value,
                                  userForm.otp,
                                  (val) =>
                                    setUserForm((prev) => ({
                                      ...prev,
                                      otp: val,
                                    })),
                                )
                              }
                              onKeyDown={(e) =>
                                handleOtpKeyDown(idx, e, userForm.otp)
                              }
                              className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg font-medium rounded-xl border border-purple-200 bg-purple-50/20 text-slate-900 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                            />
                          ))}
                        </div>

                        {/* Timer and Resend */}
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-normal">
                          <span>
                            {otpExpiresIn > 0 ? (
                              <>Expires in: <span className="text-emerald-700 font-medium">{Math.floor(otpExpiresIn / 60)}:{String(otpExpiresIn % 60).padStart(2, "0")}</span></>
                            ) : (
                              <span className="text-rose-600 font-medium">Expired</span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (resendIn > 0) return;
                              setLoading(true);
                              try {
                                const resp = await sendOtp(userDigits);
                                setOtpExpiresIn(resp?.expiresInSeconds || 5 * 60);
                                setResendIn(30);
                                setMessage({ text: "OTP resent successfully.", type: "success" });
                              } catch (err) {
                                setMessage({ text: (err as Error).message || "Failed to resend.", type: "error" });
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={resendIn > 0 || loading}
                            className="text-[#6D28D9] hover:underline disabled:text-slate-400 font-medium"
                          >
                            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || userForm.otp.replace(/\D/g, "").length !== 6}
                        className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                          </span>
                        ) : (
                          <>
                            <span>Verify & Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {userStep === "mobile-pan" && (
                    <form onSubmit={fetchUserPan} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Full Name as per PAN
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2.5 focus-within:border-[#6D28D9] focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                          <User className="w-4 h-4 text-purple-600 mr-2.5 shrink-0" />
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={userForm.name}
                            onChange={(e) =>
                              setUserForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none"
                            autoFocus
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !userForm.name.trim()}
                        className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Fetching PAN...
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

                  {userStep === "complete-profile" && (
                    <form onSubmit={completeUserProfile} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2 focus-within:border-[#6D28D9] focus-within:bg-white">
                          <User className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) =>
                              setUserForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent text-sm font-normal text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          PAN Card Number
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2 focus-within:border-[#6D28D9] focus-within:bg-white">
                          <CreditCard className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={userForm.panCard}
                            disabled={Boolean(userForm.panCard && validUserPan)}
                            onChange={(e) =>
                              setUserForm((prev) => ({
                                ...prev,
                                panCard: normalizePAN(e.target.value),
                              }))
                            }
                            className="w-full bg-transparent text-sm font-normal text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Email Address (Optional)
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2 focus-within:border-[#6D28D9] focus-within:bg-white">
                          <Mail className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                          <input
                            type="email"
                            placeholder="name@example.com"
                            value={userForm.email}
                            onChange={(e) =>
                              setUserForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent text-sm font-normal text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1 space-y-2">
                        <label
                          onClick={() => setUserConsentCibil((v) => !v)}
                          className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none"
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              userConsentCibil
                                ? "bg-[#6D28D9] border-[#6D28D9] text-white"
                                : "bg-white border-purple-200"
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>I consent to checking pre-approved loan eligibility via credit bureaus.</span>
                        </label>

                        <label
                          onClick={() => setUserAcceptPolicies((v) => !v)}
                          className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none"
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              userAcceptPolicies
                                ? "bg-[#6D28D9] border-[#6D28D9] text-white"
                                : "bg-white border-purple-200"
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>I agree to Fintaraa Terms & Conditions and Privacy Policy.</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !userForm.name.trim() || !validUserPan || !userAcceptPolicies}
                        className="w-full h-11 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                          </span>
                        ) : (
                          <>
                            <span>Complete & Continue</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ================= PARTNER FLOW ================= */}
              {mode === "partner" && (
                <>
                  {partnerStep === "details" && (
                    <form onSubmit={requestPartnerOtp} className="space-y-3.5">
                      {/* Sub-mode toggle */}
                      <div className="flex p-0.5 bg-slate-100 rounded-lg mb-2">
                        <button
                          type="button"
                          onClick={() => setPartnerSubMode("login")}
                          className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-all ${
                            partnerSubMode === "login"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Partner Login
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerSubMode("register")}
                          className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-all ${
                            partnerSubMode === "register"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Register Agency
                        </button>
                      </div>

                      {partnerSubMode === "register" && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Agency Name
                            </label>
                            <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2 focus-within:border-[#6D28D9] focus-within:bg-white">
                              <Building2 className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                              <input
                                type="text"
                                placeholder="e.g. Acme Financial"
                                value={partnerForm.name}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full bg-transparent text-sm font-normal text-slate-800 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Agency Email
                            </label>
                            <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 px-3 py-2 focus-within:border-[#6D28D9] focus-within:bg-white">
                              <Mail className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                              <input
                                type="email"
                                placeholder="partner@example.com"
                                value={partnerForm.email}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="w-full bg-transparent text-sm font-normal text-slate-800 outline-none"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Partner Mobile Number
                        </label>
                        <div className="relative flex items-center rounded-xl border border-purple-200 bg-purple-50/20 p-1 focus-within:border-[#6D28D9] focus-within:bg-white">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-xs font-medium text-slate-800">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="Enter 10-digit mobile"
                            value={partnerForm.mobile}
                            onChange={(e) =>
                              setPartnerForm((prev) => ({
                                ...prev,
                                mobile: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base font-normal text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      {partnerSubMode === "register" && (
                        <div className="pt-1 space-y-2">
                          <label
                            onClick={() => setPartnerWhatsappConsent((v) => !v)}
                            className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none"
                          >
                            <div
                              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                partnerWhatsappConsent
                                  ? "bg-[#6D28D9] border-[#6D28D9] text-white"
                                  : "bg-white border-purple-200"
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span>I agree to receive file status and payout alerts on WhatsApp & Email.</span>
                          </label>

                          <label
                            onClick={() => setPartnerAcceptPolicies((v) => !v)}
                            className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none"
                          >
                            <div
                              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                partnerAcceptPolicies
                                  ? "bg-[#6D28D9] border-[#6D28D9] text-white"
                                  : "bg-white border-purple-200"
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span>I agree to Partner Terms and Privacy Policy.</span>
                          </label>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || (partnerSubMode === "login" ? partnerDigits.length < 10 : !partnerRegisterReady)}
                        className="w-full h-11 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Sending OTP...
                          </span>
                        ) : (
                          <>
                            <span>{partnerSubMode === "register" ? "Register with OTP" : "Get Partner OTP"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {partnerStep === "otp" && (
                    <form onSubmit={submitPartnerOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-slate-700">
                            Enter 6-digit partner code
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setPartnerStep("details");
                              setMessage(null);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-normal text-[#6D28D9] hover:underline"
                          >
                            <Edit3 className="w-3 h-3" /> Change
                          </button>
                        </div>

                        {/* 6 OTP Boxes */}
                        <div
                          className="flex items-center justify-between gap-1.5 sm:gap-2"
                          onPaste={(e) =>
                            handleOtpPaste(e, (val) =>
                              setPartnerForm((prev) => ({ ...prev, otp: val })),
                            )
                          }
                        >
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                otpInputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={partnerForm.otp[idx] || ""}
                              onChange={(e) =>
                                handleOtpBoxChange(
                                  idx,
                                  e.target.value,
                                  partnerForm.otp,
                                  (val) =>
                                    setPartnerForm((prev) => ({
                                      ...prev,
                                      otp: val,
                                    })),
                                )
                              }
                              onKeyDown={(e) =>
                                handleOtpKeyDown(idx, e, partnerForm.otp)
                              }
                              className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg font-medium rounded-xl border border-purple-200 bg-purple-50/20 text-slate-900 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                            />
                          ))}
                        </div>

                        {/* Timer and Resend */}
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-normal">
                          <span>
                            {otpExpiresIn > 0 ? (
                              <>Expires in: <span className="text-emerald-700 font-medium">{Math.floor(otpExpiresIn / 60)}:{String(otpExpiresIn % 60).padStart(2, "0")}</span></>
                            ) : (
                              <span className="text-rose-600 font-medium">Expired</span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (resendIn > 0) return;
                              setLoading(true);
                              try {
                                if (partnerSubMode === "register") {
                                  await sendPartnerOtp({
                                    mobile: partnerDigits,
                                    name: partnerForm.name.trim(),
                                    email: partnerForm.email.trim().toLowerCase(),
                                  });
                                } else {
                                  await sendPartnerOtp(partnerDigits);
                                }
                                setOtpExpiresIn(5 * 60);
                                setResendIn(30);
                                setMessage({ text: "OTP resent successfully.", type: "success" });
                              } catch (err) {
                                setMessage({ text: (err as Error).message || "Failed to resend.", type: "error" });
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={resendIn > 0 || loading}
                            className="text-[#6D28D9] hover:underline disabled:text-slate-400 font-medium"
                          >
                            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || partnerForm.otp.replace(/\D/g, "").length !== 6}
                        className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                          </span>
                        ) : (
                          <>
                            <span>Verify & Enter Portal</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer Security Guarantee */}
            <div className="py-3 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Bank Grade SSL Encryption</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
