"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import {
  fetchPartnerProfile,
  isPartnerLoggedIn,
  updatePartnerKycProfile,
  uploadPartnerBankDocument,
  type PartnerProfile,
} from "@/services/partner";

type PartnerProfileForm = {
  registerAs: "individual" | "company";
  fullName: string;
  dateOfBirth: string;
  panNumber: string;
  aadhaarNumber: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  employerName: string;
  companyType: string;
  businessType: string;
  professionOrJobTitle: string;
  workPhone: string;
  workEmail: string;
  companyAddress: string;
  monthlyIncome: string;
  businessIncome: string;
  tenure: string;
  totalExperience: string;
  experienceInCurrentCompany: string;
  accountHolderName: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  ifscCode: string;
  cancelledChequeUrl: string;
  panDocumentUrl: string;
  aadhaarDocumentUrl: string;
};

const defaultForm: PartnerProfileForm = {
  registerAs: "individual",
  fullName: "",
  dateOfBirth: "",
  panNumber: "",
  aadhaarNumber: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  employerName: "",
  companyType: "",
  businessType: "",
  professionOrJobTitle: "",
  workPhone: "",
  workEmail: "",
  companyAddress: "",
  monthlyIncome: "",
  businessIncome: "",
  tenure: "",
  totalExperience: "",
  experienceInCurrentCompany: "",
  accountHolderName: "",
  bankName: "",
  accountType: "Saving Account",
  accountNumber: "",
  ifscCode: "",
  cancelledChequeUrl: "",
  panDocumentUrl: "",
  aadhaarDocumentUrl: "",
};

const companyTypeOptions = [
  "Shop or Office Only",
  "MSME",
  "Micro MSME",
  "Private Limited",
  "Public Limited",
  "LLP",
  "Partnership",
  "Proprietorship",
  "One Person Company",
  "Startup",
  "Other",
];

const accountTypeOptions = ["Saving Account", "Current Account", "OD Account"];

const stringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeDateInput = (value: unknown) => {
  const raw = stringValue(value);
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const normalizeRegisterAs = (value: unknown): "individual" | "company" => {
  const normalized = stringValue(value).toLowerCase();
  return normalized.includes("company") ? "company" : "individual";
};

const normalizeIfscCode = (value: unknown) =>
  stringValue(value)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 12);

const isValidIfscCode = (value: unknown) => {
  const normalized = normalizeIfscCode(value);
  return (
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(normalized) ||
    /^[A-Z]{4}[A-Z0-9]{7,8}$/.test(normalized)
  );
};

const findDocUrl = (profile: PartnerProfile, docType: string) => {
  const docs = profile.kycProfile?.documents || [];
  const matched = docs.find(
    (doc) => stringValue(doc.docType).toLowerCase() === docType,
  );
  return stringValue(matched?.fileUrl || matched?.url);
};

const hydrateForm = (profile?: PartnerProfile | null): PartnerProfileForm => {
  if (!profile) return defaultForm;
  const personal = profile.kycProfile?.personalDetails || {};
  const addressDetails = profile.kycProfile?.addressDetails || {};
  const currentAddress =
    ((addressDetails.currentAddress ||
      addressDetails.address ||
      addressDetails) as Record<string, unknown>) || {};
  const employment = profile.kycProfile?.employmentDetails || {};
  const bank = profile.bankDetails || profile.kycProfile?.bankDetails || {};

  return {
    registerAs: normalizeRegisterAs(personal.registerAs),
    fullName: stringValue(personal.fullName) || stringValue(profile.name),
    dateOfBirth: normalizeDateInput(personal.dateOfBirth),
    panNumber: stringValue(personal.panNumber).toUpperCase(),
    aadhaarNumber: stringValue(personal.aadhaarNumber),
    mobile: stringValue(personal.mobile) || stringValue(profile.mobile),
    email: stringValue(personal.email) || stringValue(profile.email),
    address:
      stringValue(personal.address) ||
      stringValue(currentAddress.street) ||
      stringValue(currentAddress.address),
    city: stringValue(personal.city) || stringValue(currentAddress.city),
    state: stringValue(personal.state) || stringValue(currentAddress.state),
    pinCode:
      stringValue(personal.pinCode) ||
      stringValue(personal.pincode) ||
      stringValue(currentAddress.postalCode) ||
      stringValue(currentAddress.pincode),
    employerName: stringValue(employment.employerName),
    companyType:
      stringValue(employment.companyType) || stringValue(employment.industry),
    businessType: stringValue(employment.businessType),
    professionOrJobTitle: stringValue(employment.professionOrJobTitle),
    workPhone: stringValue(employment.workPhone),
    workEmail: stringValue(employment.workEmail),
    companyAddress: stringValue(employment.companyAddress),
    monthlyIncome: stringValue(employment.monthlyIncome),
    businessIncome: stringValue(employment.businessIncome),
    tenure: stringValue(employment.tenure),
    totalExperience: stringValue(employment.totalExperience),
    experienceInCurrentCompany: stringValue(
      employment.experienceInCurrentCompany,
    ),
    accountHolderName: stringValue(bank.accountHolderName),
    bankName: stringValue(bank.bankName),
    accountType: stringValue(bank.accountType) || "Saving Account",
    accountNumber: stringValue(bank.accountNumber),
    ifscCode: normalizeIfscCode(bank.ifscCode),
    cancelledChequeUrl:
      stringValue(bank.cancelledChequeUrl) ||
      findDocUrl(profile, "cancelled_cheque"),
    panDocumentUrl: findDocUrl(profile, "pan_card"),
    aadhaarDocumentUrl: findDocUrl(profile, "aadhaar_card"),
  };
};

const buildAddressPayload = (form: PartnerProfileForm) => ({
  currentAddress: {
    street: form.address,
    city: form.city,
    state: form.state,
    postalCode: form.pinCode,
    country: "India",
    isDefault: true,
    label: "home",
  },
  permanentAddress: {
    street: form.address,
    city: form.city,
    state: form.state,
    postalCode: form.pinCode,
    country: "India",
    isDefault: true,
    label: "home",
  },
});

const managedDocumentTypes = new Set([
  "pan_card",
  "aadhaar_card",
  "cancelled_cheque",
]);

const buildDocumentsPayload = (
  form: PartnerProfileForm,
  profile?: PartnerProfile | null,
) => {
  const existingDocuments = (profile?.kycProfile?.documents || []).filter(
    (doc) => !managedDocumentTypes.has(stringValue(doc.docType).toLowerCase()),
  );
  const managedDocuments = [
    form.panDocumentUrl
      ? {
          docType: "pan_card",
          fileUrl: form.panDocumentUrl,
          referenceId: "PAN Card",
          issuer: "user_provided",
          verified: false,
        }
      : null,
    form.aadhaarDocumentUrl
      ? {
          docType: "aadhaar_card",
          fileUrl: form.aadhaarDocumentUrl,
          referenceId: "Aadhaar Card",
          issuer: "user_provided",
          verified: false,
        }
      : null,
    form.cancelledChequeUrl
      ? {
          docType: "cancelled_cheque",
          fileUrl: form.cancelledChequeUrl,
          referenceId: "Cancelled Cheque",
          issuer: "user_provided",
          verified: false,
        }
      : null,
  ].filter(Boolean);

  return [...existingDocuments, ...managedDocuments];
};

const buildKycPayload = (
  form: PartnerProfileForm,
  profile?: PartnerProfile | null,
) => ({
  reusableAcrossApplications: true,
  personalDetails: {
    registerAs: form.registerAs,
    fullName: form.fullName,
    dateOfBirth: form.dateOfBirth,
    panNumber: form.panNumber.toUpperCase(),
    aadhaarNumber: form.aadhaarNumber,
    mobile: form.mobile.replace(/\D/g, ""),
    email: form.email.trim().toLowerCase(),
    address: form.address,
    city: form.city,
    state: form.state,
    pinCode: form.pinCode,
    pincode: form.pinCode,
    country: "India",
  },
  addressDetails: buildAddressPayload(form),
  employmentDetails: {
    employmentType: "selfEmployedProfessional",
    employerType: "selfEmployedProfessional",
    employerName: form.employerName,
    monthlyIncome: form.monthlyIncome,
    businessIncome: form.businessIncome,
    companyType: form.companyType,
    industry: form.companyType,
    businessType: form.businessType,
    professionOrJobTitle: form.professionOrJobTitle,
    workPhone: form.workPhone.replace(/\D/g, "") || form.mobile.replace(/\D/g, ""),
    workEmail: form.workEmail.trim().toLowerCase() || form.email.trim().toLowerCase(),
    companyAddress: form.companyAddress,
    tenure: form.tenure,
    totalExperience: form.totalExperience,
    experienceInCurrentCompany: form.experienceInCurrentCompany,
  },
  bankDetails: {
    accountHolderName: form.accountHolderName,
    bankName: form.bankName,
    accountType: form.accountType,
    accountNumber: form.accountNumber,
    ifscCode: normalizeIfscCode(form.ifscCode),
    cancelledChequeUrl: form.cancelledChequeUrl,
  },
  documents: buildDocumentsPayload(form, profile),
});

const requiredLabels: Array<[keyof PartnerProfileForm, string]> = [
  ["fullName", "Full name"],
  ["dateOfBirth", "Date of birth"],
  ["mobile", "Mobile number"],
  ["email", "Email"],
  ["panNumber", "PAN number"],
  ["aadhaarNumber", "Aadhaar number"],
  ["address", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pinCode", "PIN code"],
  ["employerName", "Company name"],
  ["companyType", "Company type"],
  ["professionOrJobTitle", "Designation"],
  ["workPhone", "SPOC mobile number"],
  ["workEmail", "SPOC email ID"],
  ["companyAddress", "Company address"],
  ["monthlyIncome", "Monthly income"],
  ["totalExperience", "Total experience"],
  ["experienceInCurrentCompany", "Current company experience"],
  ["accountHolderName", "Account holder name"],
  ["bankName", "Bank name"],
  ["accountType", "Account type"],
  ["accountNumber", "Account number"],
  ["ifscCode", "IFSC code"],
  ["panDocumentUrl", "PAN document link"],
  ["aadhaarDocumentUrl", "Aadhaar document link"],
  ["cancelledChequeUrl", "Cancelled cheque"],
];

type StepKey = "personal" | "business" | "bank" | "documents";

type PartnerStep = {
  key: StepKey;
  title: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  fields: Array<keyof PartnerProfileForm>;
};

const partnerSteps: PartnerStep[] = [
  {
    key: "personal",
    title: "Personal Details",
    eyebrow: "Partner KYC",
    description:
      "Add authorised person, contact, PAN, Aadhaar, and current address details.",
    icon: <UserRound className="h-5 w-5" />,
    fields: [
      "registerAs",
      "fullName",
      "dateOfBirth",
      "panNumber",
      "aadhaarNumber",
      "mobile",
      "email",
      "address",
      "city",
      "state",
      "pinCode",
    ],
  },
  {
    key: "business",
    title: "Company Details",
    eyebrow: "Business profile",
    description:
      "Save the same company, SPOC, designation, income, and experience keys used in the B2B app.",
    icon: <Building2 className="h-5 w-5" />,
    fields: [
      "employerName",
      "companyType",
      "businessType",
      "professionOrJobTitle",
      "workPhone",
      "workEmail",
      "companyAddress",
      "monthlyIncome",
      "businessIncome",
      "tenure",
      "totalExperience",
      "experienceInCurrentCompany",
    ],
  },
  {
    key: "bank",
    title: "Bank Details",
    eyebrow: "Payout readiness",
    description:
      "Add partner bank account details and upload cancelled cheque for payout verification.",
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    fields: [
      "accountHolderName",
      "bankName",
      "accountType",
      "accountNumber",
      "ifscCode",
      "cancelledChequeUrl",
    ],
  },
  {
    key: "documents",
    title: "KYC Documents",
    eyebrow: "Document links",
    description:
      "Share secure document URLs for PAN and Aadhaar verification.",
    icon: <FileText className="h-5 w-5" />,
    fields: ["panDocumentUrl", "aadhaarDocumentUrl"],
  },
];

const requiredLabelMap = Object.fromEntries(requiredLabels) as Record<
  keyof PartnerProfileForm,
  string
>;

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadhaar: /^\d{12}$/,
  pincode: /^\d{6}$/,
};

const fieldMeta: Record<
  keyof PartnerProfileForm,
  {
    label: string;
    placeholder: string;
    type?: string;
    wide?: boolean;
    options?: string[];
  }
> = {
  registerAs: {
    label: "Register as",
    placeholder: "Register as",
  },
  fullName: {
    label: "Full name",
    placeholder: "Enter full name",
  },
  dateOfBirth: {
    label: "Date of birth",
    placeholder: "YYYY-MM-DD",
    type: "date",
  },
  panNumber: {
    label: "PAN number",
    placeholder: "ABCDE1234F",
  },
  aadhaarNumber: {
    label: "Aadhaar number",
    placeholder: "12-digit Aadhaar number",
  },
  mobile: {
    label: "Mobile number",
    placeholder: "10-digit mobile",
    type: "tel",
  },
  email: {
    label: "Email ID",
    placeholder: "name@example.com",
    type: "email",
  },
  address: {
    label: "Address",
    placeholder: "Enter complete address",
    wide: true,
  },
  city: {
    label: "City",
    placeholder: "City",
  },
  state: {
    label: "State",
    placeholder: "State",
  },
  pinCode: {
    label: "PIN code",
    placeholder: "6-digit PIN code",
  },
  employerName: {
    label: "Shop / business name",
    placeholder: "Enter shop or business name",
  },
  companyType: {
    label: "Company type",
    placeholder: "Select company type",
    options: companyTypeOptions,
  },
  businessType: {
    label: "Business type",
    placeholder: "Loan DSA / Insurance POSP / Distributor",
  },
  professionOrJobTitle: {
    label: "Designation",
    placeholder: "Owner / Director / Manager",
  },
  workPhone: {
    label: "SPOC mobile number",
    placeholder: "Business mobile",
    type: "tel",
  },
  workEmail: {
    label: "SPOC email ID",
    placeholder: "Business email",
    type: "email",
  },
  companyAddress: {
    label: "Company address",
    placeholder: "Enter complete business address",
    wide: true,
  },
  monthlyIncome: {
    label: "Monthly income",
    placeholder: "Monthly income",
    type: "number",
  },
  businessIncome: {
    label: "Business income",
    placeholder: "Annual or monthly business income",
    type: "number",
  },
  tenure: {
    label: "Tenure",
    placeholder: "Business / work tenure",
  },
  totalExperience: {
    label: "Total experience",
    placeholder: "Years / months",
  },
  experienceInCurrentCompany: {
    label: "Current company experience",
    placeholder: "Years / months",
  },
  accountHolderName: {
    label: "Account holder name",
    placeholder: "Account holder name",
  },
  bankName: {
    label: "Bank name",
    placeholder: "Bank name",
  },
  accountType: {
    label: "Account type",
    placeholder: "Select account type",
    options: accountTypeOptions,
  },
  accountNumber: {
    label: "Account number",
    placeholder: "Account number",
  },
  ifscCode: {
    label: "IFSC code",
    placeholder: "IFSC code",
  },
  cancelledChequeUrl: {
    label: "Cancelled cheque",
    placeholder: "Upload cancelled cheque",
    wide: true,
  },
  panDocumentUrl: {
    label: "PAN document URL",
    placeholder: "Paste PAN document link",
    wide: true,
  },
  aadhaarDocumentUrl: {
    label: "Aadhaar document URL",
    placeholder: "Paste Aadhaar document link",
    wide: true,
  },
};

const getMissing = (form: PartnerProfileForm) =>
  requiredLabels
    .filter(([key]) => !stringValue(form[key]))
    .map(([, label]) => label);

export function PartnerCompleteProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [form, setForm] = useState<PartnerProfileForm>(defaultForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerProfileForm, string>>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCheque, setUploadingCheque] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isPartnerLoggedIn()) {
      router.replace("/partner/login?redirect=/partner/profile/complete");
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const current = await fetchPartnerProfile();
        if (!active) return;
        setProfile(current);
        setForm(hydrateForm(current));
      } catch (error) {
        if (!active) return;
        setMessage(
          (error as Error).message || "Unable to load partner profile.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [router]);

  const missing = useMemo(() => getMissing(form), [form]);
  const completion = useMemo(() => {
    const total = requiredLabels.length;
    return Math.round(((total - missing.length) / total) * 100);
  }, [missing.length]);
  const step = partnerSteps[stepIndex];
  const isLastStep = stepIndex === partnerSteps.length - 1;
  const progress =
    partnerSteps.length > 1
      ? (stepIndex / (partnerSteps.length - 1)) * 100
      : 100;

  const update = (key: keyof PartnerProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "ifscCode"
          ? normalizeIfscCode(value)
          : key === "panNumber"
          ? value.toUpperCase()
          : key === "mobile" || key === "workPhone"
            ? value.replace(/\D/g, "")
          : value,
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateStep = (targetStep = step) => {
    const nextErrors: Partial<Record<keyof PartnerProfileForm, string>> = {};
    targetStep.fields.forEach((key) => {
      const label = requiredLabelMap[key] || "This field";
      const value = stringValue(form[key]);
      if (requiredLabelMap[key] && !value) {
        nextErrors[key] = `${label} is required.`;
        return;
      }

      if (value && key === "email" && !patterns.email.test(value)) {
        nextErrors[key] = "Enter a valid email address.";
      }
      if (value && (key === "mobile" || key === "workPhone")) {
        const clean = value.replace(/\D/g, "");
        if (!patterns.phone.test(clean)) {
          nextErrors[key] = "Enter a valid 10-digit mobile number.";
        }
      }
      if (value && key === "panNumber" && !patterns.pan.test(value)) {
        nextErrors[key] = "Enter a valid PAN number.";
      }
      if (
        value &&
        key === "aadhaarNumber" &&
        !patterns.aadhaar.test(value.replace(/\D/g, ""))
      ) {
        nextErrors[key] = "Enter a valid 12-digit Aadhaar number.";
      }
      if (value && key === "pinCode" && !patterns.pincode.test(value)) {
        nextErrors[key] = "Enter a valid 6-digit PIN code.";
      }
      if (value && key === "ifscCode" && !isValidIfscCode(value)) {
        nextErrors[key] = "Enter a valid IFSC code.";
      }
    });

    setErrors(nextErrors);
    const firstErrorKey = targetStep.fields.find((key) => nextErrors[key]);
    if (firstErrorKey) {
      document
        .getElementById(`partner-${firstErrorKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(nextErrors).length === 0;
  };

  const validateAllSteps = () => {
    for (let index = 0; index < partnerSteps.length; index += 1) {
      const targetStep = partnerSteps[index];
      const nextErrors: Partial<Record<keyof PartnerProfileForm, string>> = {};
      targetStep.fields.forEach((key) => {
        const label = requiredLabelMap[key] || "This field";
        const value = stringValue(form[key]);
        if (requiredLabelMap[key] && !value) {
          nextErrors[key] = `${label} is required.`;
          return;
        }
        if (value && key === "email" && !patterns.email.test(value)) {
          nextErrors[key] = "Enter a valid email address.";
        }
        if (value && (key === "mobile" || key === "workPhone")) {
          const clean = value.replace(/\D/g, "");
          if (!patterns.phone.test(clean)) {
            nextErrors[key] = "Enter a valid 10-digit mobile number.";
          }
        }
        if (value && key === "panNumber" && !patterns.pan.test(value)) {
          nextErrors[key] = "Enter a valid PAN number.";
        }
        if (
          value &&
          key === "aadhaarNumber" &&
          !patterns.aadhaar.test(value.replace(/\D/g, ""))
        ) {
          nextErrors[key] = "Enter a valid 12-digit Aadhaar number.";
        }
        if (value && key === "pinCode" && !patterns.pincode.test(value)) {
          nextErrors[key] = "Enter a valid 6-digit PIN code.";
        }
        if (value && key === "ifscCode" && !isValidIfscCode(value)) {
          nextErrors[key] = "Enter a valid IFSC code.";
        }
      });

      if (Object.keys(nextErrors).length > 0) {
        setStepIndex(index);
        setErrors(nextErrors);
        window.setTimeout(() => {
          const firstErrorKey = targetStep.fields.find((key) => nextErrors[key]);
          if (firstErrorKey) {
            document
              .getElementById(`partner-${firstErrorKey}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 0);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const saveProfileDetails = async (successMessage: string) => {
    setSaving(true);
    try {
      const updated = await updatePartnerKycProfile(buildKycPayload(form, profile));
      setProfile(updated);
      setForm(hydrateForm(updated));
      setMessage(successMessage);
      return true;
    } catch (error) {
      setMessage((error as Error).message || "Unable to save profile.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    setMessage("");
    if (!validateStep()) return;
    const saved = await saveProfileDetails("Step details saved.");
    if (!saved) return;
    setStepIndex((current) => Math.min(current + 1, partnerSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setMessage("");
    setErrors({});
    setStepIndex((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!isLastStep) {
      await goNext();
      return;
    }
    if (!validateAllSteps()) return;
    const saved = await saveProfileDetails("Partner profile saved successfully.");
    if (saved) {
      router.push("/partner/profile");
    }
  };

  const handleChequeUpload = async (file?: File | null) => {
    if (!file) return;
    setMessage("");
    setErrors((prev) => ({ ...prev, cancelledChequeUrl: "" }));
    setUploadingCheque(true);
    try {
      const uploaded = await uploadPartnerBankDocument(file);
      if (!uploaded.url) {
        throw new Error("Unable to read uploaded cheque URL.");
      }
      update("cancelledChequeUrl", uploaded.url);
      setMessage("Cancelled cheque uploaded. Continue to save this step.");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        cancelledChequeUrl:
          (error as Error).message || "Unable to upload cancelled cheque.",
      }));
    } finally {
      setUploadingCheque(false);
    }
  };

  const partnerName =
    stringValue(form.fullName) || stringValue(profile?.name) || "Partner";

  const stepFilledCount = step.fields.filter((key) => {
    if (!requiredLabelMap[key]) return false;
    return Boolean(stringValue(form[key]));
  }).length;
  const stepRequiredCount = step.fields.filter(
    (key) => requiredLabelMap[key],
  ).length;
  const summaryRows = [
    ["Partner ID", stringValue(profile?.agencyId) || "-"],
    ["Mobile", form.mobile || stringValue(profile?.mobile) || "-"],
    ["Email", form.email || stringValue(profile?.email) || "-"],
    ["Business", form.employerName || "-"],
    ["Bank", form.bankName || "-"],
  ];

  const renderField = (key: keyof PartnerProfileForm) => {
    if (key === "registerAs") {
      return (
        <div key={key} className="md:col-span-2">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085]">
            Register yourself as
          </p>
          <div className="mt-3 grid max-w-md grid-cols-2 gap-2 bg-[#f3f8fc] p-1">
            {[
              { value: "individual", label: "Individual" },
              { value: "company", label: "Company" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    registerAs: item.value as "individual" | "company",
                  }))
                }
                className={`h-11 text-[13px] font-extrabold transition ${
                  form.registerAs === item.value
                    ? "bg-[#195585] text-white"
                    : "text-[#344054] hover:bg-white hover:text-[#195585]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    const meta = fieldMeta[key];
    const label =
      key === "fullName" && form.registerAs === "company"
        ? "Authorised person name"
        : key === "address" && form.registerAs === "company"
          ? "Company full address"
          : meta.label;
    const isRequired = Boolean(requiredLabelMap[key]);

    if (key === "cancelledChequeUrl") {
      return (
        <ChequeUploadField
          key={key}
          id={`partner-${key}`}
          label={label}
          value={form.cancelledChequeUrl}
          onUpload={handleChequeUpload}
          uploading={uploadingCheque}
          error={errors[key]}
          required={isRequired}
        />
      );
    }

    if (meta.options) {
      return (
        <SelectField
          key={key}
          id={`partner-${key}`}
          label={label}
          value={String(form[key] || "")}
          onChange={(value) => update(key, value)}
          options={meta.options}
          error={errors[key]}
          required={isRequired}
        />
      );
    }

    return (
      <FormField
        key={key}
        id={`partner-${key}`}
        label={label}
        value={String(form[key] || "")}
        onChange={(value) => update(key, value)}
        placeholder={meta.placeholder}
        type={meta.type}
        wide={meta.wide}
        error={errors[key]}
        required={isRequired}
      />
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/partner/profile"
              className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#195585] no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to partner profile
            </Link>
            <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.02em] text-[#07162d] md:text-[40px]">
              Complete Partner Profile
            </h1>
          </div>
          <div className="min-w-[9rem]">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085]">
              Completion
            </p>
            <p className="mt-1 text-[32px] font-extrabold leading-none text-[#195585]">
              {completion}%
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="relative overflow-hidden">
            <div
              className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-1 overflow-hidden bg-[#e7eef6] md:block"
              aria-hidden="true"
            >
              <div
                className="h-full bg-[#195585] transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="relative grid gap-3 md:grid-cols-4">
              {partnerSteps.map((item, index) => {
                const isActive = index === stepIndex;
                const isDone = index < stepIndex;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (index <= stepIndex) {
                        setErrors({});
                        setStepIndex(index);
                      }
                    }}
                    className={`relative z-10 flex items-center gap-3 bg-white text-left transition md:flex-col md:items-center md:text-center ${
                      index > stepIndex ? "cursor-default" : ""
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                        isActive || isDone
                          ? "bg-[#195585] text-white"
                          : "bg-[#edf3f8] text-[#667085]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </span>
                    <span>
                      <span
                        className={`block text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                          isActive ? "text-[#195585]" : "text-[#667085]"
                        }`}
                      >
                        Step {index + 1}
                      </span>
                      <span className="mt-1 block text-[14px] font-extrabold text-[#07162d]">
                        {item.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <div>
            {loading ? (
              <div className="mb-5 bg-[#f6f9fc] px-4 py-3 text-[14px] font-semibold text-[#667085]">
                Prefilling your details...
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <div className="mb-6 flex items-center gap-2 text-[13px] font-extrabold text-[#667085]">
                  <span>Step {stepIndex + 1}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{partnerSteps.length}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#eaf4ff] text-[#195585]">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085]">
                      {step.eyebrow}
                    </p>
                    <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.02em] text-[#07162d]">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  {step.fields.map(renderField)}
                </div>

                {message ? (
                  <p className="mt-5 text-[13px] font-semibold leading-6 text-[#195585]">
                    {message}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={stepIndex === 0 || saving || uploadingCheque}
                    className="inline-flex h-12 items-center justify-center gap-2 bg-[#eef5fb] px-5 text-[14px] font-extrabold text-[#195585] transition hover:bg-[#e3f0fb] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving || loading || uploadingCheque}
                    className="inline-flex h-12 min-w-[12rem] items-center justify-center gap-2 bg-[#195585] px-6 text-[14px] font-extrabold text-white transition hover:bg-[#13486f] disabled:opacity-60"
                  >
                    {uploadingCheque
                      ? "Uploading..."
                      : saving
                        ? "Saving..."
                        : isLastStep
                          ? "Save profile"
                          : "Continue"}
                    {!saving && !uploadingCheque ? (
                      <ArrowRight className="h-4 w-4" />
                    ) : null}
                  </button>
                </div>

                <div className="mt-7 text-[13px] font-semibold text-[#667085]">
                  {stepRequiredCount > 0
                    ? `${stepFilledCount}/${stepRequiredCount} required details filled in this step`
                    : "This step has optional profile details"}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="h-fit xl:sticky xl:top-[calc(var(--site-header-height,0px)+1rem)]">
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="mt-1 h-5 w-5 shrink-0 text-[#195585]" />
              <div className="min-w-0">
                <p className="truncate text-[18px] font-extrabold text-[#07162d]">
                  {partnerName}
                </p>
                <p className="text-[12px] font-semibold text-[#667085]">
                  Partner KYC profile
                </p>
              </div>
            </div>

            <div className="mt-6 h-px bg-[#e7eef6]" />

            <div className="mt-6">
              <div className="flex items-center justify-between text-[12px] font-extrabold text-[#07162d]">
                <span>Required details</span>
                <span>{completion}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden bg-[#edf3f8]">
                <div
                  className="h-full bg-gradient-to-r from-[#195585] to-[#12b76a] transition-[width] duration-700 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#98a2b3]">
                    {label}
                  </span>
                  <span className="max-w-[11rem] truncate text-right text-[13px] font-bold text-[#344054]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 h-px bg-[#e7eef6]" />

            {missing.length ? (
              <div className="mt-6">
                <p className="text-[13px] font-extrabold text-[#07162d]">
                  Missing details
                </p>
                <div className="mt-3 grid gap-2">
                  {missing.slice(0, 7).map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f79009]" />
                      <span className="text-[12px] font-semibold text-[#667085]">
                        {item}
                      </span>
                    </div>
                  ))}
                  {missing.length > 7 ? (
                    <p className="text-[12px] font-semibold text-[#667085]">
                      +{missing.length - 7} more
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-6 flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#12b76a]" />
                <p className="text-[13px] font-semibold leading-5 text-[#067647]">
                  All core partner profile fields are filled.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-start gap-2 text-[12px] font-semibold leading-5 text-[#667085]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#195585]" />
              Details are saved to the same agency profile used by the B2B
              partner app.
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function ChequeUploadField({
  id,
  label,
  value,
  onUpload,
  uploading,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onUpload: (file?: File | null) => void;
  uploading: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="md:col-span-2" id={id}>
      <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
        {label}
        {required ? <span className="text-[#d92d20]"> *</span> : null}
      </span>
      <div
        className={`mt-2 flex flex-col gap-3 bg-[#f6f9fc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
          error ? "bg-[#fff4f2]" : ""
        }`}
      >
        <div className="min-w-0">
          <p className="text-[14px] font-extrabold text-[#07162d]">
            {value ? "Cancelled cheque uploaded" : "Upload cancelled cheque"}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#667085]">
            PDF, JPG, PNG, or WEBP file accepted.
          </p>
          {value ? (
            <Link
              href={value}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-[12px] font-extrabold text-[#195585] no-underline"
            >
              View uploaded cheque
            </Link>
          ) : null}
        </div>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 bg-[#195585] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#13486f]">
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading..." : value ? "Replace file" : "Upload file"}
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void onUpload(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      {error ? (
        <span className="mt-2 block text-[12px] font-semibold text-[#d92d20]">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  wide = false,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  wide?: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
        {label}
        {required ? <span className="text-[#d92d20]"> *</span> : null}
      </span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className={`mt-2 h-12 w-full bg-[#f6f9fc] px-4 text-[14px] font-semibold text-[#07162d] outline-none transition placeholder:text-[#98a2b3] focus:bg-[#eef6ff] ${
          error ? "bg-[#fff4f2]" : ""
        }`}
      />
      {error ? (
        <span className="mt-2 block text-[12px] font-semibold text-[#d92d20]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
        {label}
        {required ? <span className="text-[#d92d20]"> *</span> : null}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-12 w-full bg-[#f6f9fc] px-4 text-[14px] font-semibold text-[#07162d] outline-none transition focus:bg-[#eef6ff] ${
          error ? "bg-[#fff4f2]" : ""
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span className="mt-2 block text-[12px] font-semibold text-[#d92d20]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
