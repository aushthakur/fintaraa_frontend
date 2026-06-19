"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Sparkles,
  FileText,
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { submitApplication } from "./payload";
import { getCurrentUser } from "@/services/auth";
import type { FormField, FormFlow } from "./flows";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { fetchCarRcDetails } from "@/services/applicationLookups";
import { humanizeProduct, type ApplicationCategory } from "./flowRegistry";
import { CoApplicantsSection, type CoApplicant } from "./CoApplicantsSection";

type FormValues = Record<string, any>;
type FormErrors = Record<string, string>;
type CurrentUser = Record<string, any>;

const fieldClass =
  "h-11 w-full rounded-xl border border-[#dce9f7] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#005ca8] focus:ring-2 focus:ring-[#e5f1ff]";
const textareaClass =
  "min-h-24 w-full rounded-xl border border-[#dce9f7] bg-white px-3 py-3 text-[13px] font-semibold text-[#111827] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#005ca8] focus:ring-2 focus:ring-[#e5f1ff]";

const patterns: Record<string, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^(?:\+91[\s-]?)?[6-9]\d{9}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadhaar: /^\d{12}$/,
  pincode: /^\d{6}$/,
};

const benefitItems = [
  ["Quick & Easy", "Complete your application in a few minutes."],
  ["Secure Process", "Your information is handled with care."],
  ["Minimal Documentation", "Upload only relevant documents now."],
  ["Attractive Rates", "Get partner-side rate discovery support."],
];

const normalizePhone = (value: string) => value.replace(/[\s-]/g, "");
const normalizeRcNumber = (value: string) =>
  value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === "";

const firstValue = (values: FormValues, keys: string[]) => {
  for (const key of keys) {
    if (values[key]) return values[key];
  }
  return undefined;
};

const pickString = (...candidates: any[]) =>
  candidates.find((value) => typeof value === "string" && value.trim())?.trim();

const extractYear = (value: any) => {
  if (!value) return undefined;
  const match = String(value).match(/(19|20)\d{2}/);
  return match ? match[0] : undefined;
};

const isRcFieldKey = (key: string) =>
  key === "carRegistrationNumber" || key === "registrationNumber";

const normalizeFieldToken = (value: string) =>
  value.replace(/[^a-z0-9]/gi, "").toLowerCase();

const isPanNumberField = (field: Pick<FormField, "key" | "label" | "type">) => {
  if (field.type === "file") return false;

  const key = normalizeFieldToken(field.key);
  if (key === "pan" || key === "pannumber" || key === "coapplicantpan") {
    return true;
  }

  const label = field.label
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
  return /\bpan(?:\s*(?:no|number))?\b/.test(label);
};

const normalizePanNumber = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);

const focusApplicationField = (fieldKey?: string) => {
  if (!fieldKey || typeof document === "undefined") return;

  window.requestAnimationFrame(() => {
    const fields = Array.from(
      document.querySelectorAll<HTMLElement>("[data-application-field]"),
    );
    const fieldElement = fields.find(
      (element) => element.dataset.applicationField === fieldKey,
    );
    if (!fieldElement) return;

    fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusTarget = fieldElement.querySelector<HTMLElement>(
      "input:not([type='hidden']), select, textarea, button:not([disabled])",
    );
    (focusTarget || fieldElement).focus({ preventScroll: true });
  });
};

const pickValue = (...values: unknown[]) =>
  values.find((value) => !isEmptyValue(value));

const splitName = (fullName?: unknown) => {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const firstName = parts.shift() || "";
  return { firstName, lastName: parts.join(" ") };
};

const formatDateInput = (value: unknown) => {
  if (!value) return undefined;
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const toSnake = (value: unknown) =>
  String(value || "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();

const getFieldOptions = (field?: FormField) => [
  ...(field?.options || []),
  ...Object.values(field?.optionsByParent || {}).flat(),
];

const findFlowField = (flow: FormFlow, key: string) =>
  flow.steps.flatMap((step) => step.fields).find((field) => field.key === key);

const normalizeSelectValue = (flow: FormFlow, key: string, value: unknown) => {
  if (isEmptyValue(value)) return undefined;
  const field = findFlowField(flow, key);
  if (field?.type !== "select") return value;

  const options = getFieldOptions(field);
  if (!options.length) return value;

  const normalized = toSnake(value);
  const exact = options.find(
    (option) =>
      toSnake(option.value) === normalized ||
      toSnake(option.label) === normalized,
  );
  if (exact) return exact.value;

  if (key.toLowerCase().includes("employment") || key === "employment") {
    const target = normalized.includes("salary")
      ? "salaried"
      : normalized.includes("self") || normalized.includes("business")
        ? "self"
        : normalized;
    const employmentOption = options.find((option) => {
      const optionValue = toSnake(option.value);
      return optionValue === target || optionValue.includes(target);
    });
    if (employmentOption) return employmentOption.value;
  }

  if (key === "gender" && normalized.includes("prefer")) {
    return options.find((option) => option.value === "other")?.value;
  }

  return undefined;
};

const buildAddressText = (...sources: any[]) => {
  for (const source of sources) {
    const direct = pickValue(
      source?.address,
      source?.fullAddress,
      source?.street,
    );
    if (direct) return String(direct);
  }
  const source =
    sources.find((item) =>
      [
        item?.houseNo,
        item?.flatNo,
        item?.line1,
        item?.street,
        item?.landmark,
        item?.city,
      ].some(Boolean),
    ) || {};
  return [
    source.houseNo,
    source.flatNo,
    source.line1,
    source.street,
    source.landmark,
    source.city,
  ]
    .filter(Boolean)
    .join(", ");
};

const firstObjectWithData = (...sources: any[]) =>
  sources.find(
    (source) =>
      source &&
      typeof source === "object" &&
      Object.values(source).some((value) => !isEmptyValue(value)),
  ) || {};

const buildAutofillValues = (
  user: CurrentUser,
  flow: FormFlow,
  category: ApplicationCategory,
) => {
  const kyc = user.kycProfile || {};
  const personal = kyc.personalDetails || {};
  const employment = kyc.employmentDetails || {};
  const financial = kyc.financialDetails || {};
  const currentAddress = firstObjectWithData(
    kyc.addressDetails?.currentAddress || kyc.addressDetails?.address,
    personal,
    Array.isArray(user.addresses)
      ? user.addresses.find((address: any) => address?.isDefault) ||
          user.addresses[0]
      : {},
  );
  const bankDetails = user.bankDetails || {};
  const fullName = pickValue(personal.fullName, user.name);
  const { firstName, lastName } = splitName(fullName);
  const dateOfBirth = formatDateInput(
    pickValue(personal.dateOfBirth, user.dateOfBirth),
  );
  const mobile = String(pickValue(personal.mobile, user.mobile) || "").replace(
    /\D/g,
    "",
  );
  const monthlyIncome = pickValue(
    employment.monthlyIncome,
    financial.monthlyIncome,
    user.monthlyIncome,
  );
  const annualIncome = pickValue(
    employment.annualIncome,
    financial.annualIncome,
    user.annualIncome,
  );
  const income =
    category === "insurance"
      ? pickValue(annualIncome, Number(monthlyIncome || 0) * 12 || undefined)
      : pickValue(monthlyIncome, annualIncome);
  const address = buildAddressText(personal, currentAddress);
  const rawValues: FormValues = {
    fullName,
    name: fullName,
    firstName,
    lastName,
    email: pickValue(personal.email, user.email),
    phone: mobile,
    mobile,
    dateOfBirth,
    dob: dateOfBirth,
    gender: pickValue(personal.gender, user.gender),
    marriedStatus: personal.maritalStatus,
    maritalStatus: personal.maritalStatus,
    pan: pickValue(personal.panNumber, user.panCard),
    panNumber: pickValue(personal.panNumber, user.panCard),
    aadhaar: pickValue(personal.aadhaarNumber, user.aadhaarCard),
    aadhaarNumber: pickValue(personal.aadhaarNumber, user.aadhaarCard),
    address,
    street: address,
    fullAddress: address,
    city: pickValue(personal.city, currentAddress.city),
    state: pickValue(personal.state, currentAddress.state),
    pincode: pickValue(
      personal.pincode,
      personal.pinCode,
      currentAddress.pincode,
      currentAddress.pinCode,
      currentAddress.postalCode,
    ),
    pinCode: pickValue(
      personal.pinCode,
      currentAddress.pinCode,
      currentAddress.postalCode,
    ),
    employment: pickValue(
      employment.employmentType,
      employment.employmentStatus,
    ),
    employmentType: pickValue(
      employment.employmentType,
      employment.employmentStatus,
    ),
    occupation: pickValue(
      employment.professionOrJobTitle,
      employment.employmentType,
    ),
    companyName: pickValue(
      employment.employerName,
      employment.companyName,
      employment.businessName,
      personal.companyName,
      personal.businessName,
    ),
    employerName: pickValue(employment.employerName, employment.companyName),
    businessName: pickValue(employment.businessName, personal.businessName),
    monthlyIncome,
    netIncome: monthlyIncome,
    income,
    salary: monthlyIncome,
    annualIncome,
    workExperience: pickValue(
      employment.totalExperience,
      employment.experienceInCurrentCompany,
    ),
    officeAddress: pickValue(
      employment.companyAddress,
      employment.businessAddress,
      employment.officeAddress,
    ),
    companyAddress: pickValue(
      employment.companyAddress,
      employment.businessAddress,
    ),
    bankName: bankDetails.bankName,
    accountType: bankDetails.accountType,
    accountNumber: bankDetails.accountNumber,
    ifscCode: bankDetails.ifscCode,
    nomineeName: user.emergencyContact?.name,
    nomineeRelation: user.emergencyContact?.relationship,
  };

  return Object.fromEntries(
    Object.entries(rawValues)
      .map(([key, value]) => [key, normalizeSelectValue(flow, key, value)])
      .filter(([, value]) => !isEmptyValue(value)),
  );
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
};

function visibleFields(
  flow: FormFlow,
  values: FormValues,
  stepIndex: number,
  activeTab?: string,
) {
  const step = flow.steps[stepIndex];
  return step.fields.filter((field) => {
    if (field.type === "coApplicants") return Boolean(values.coApplicant);
    if (field.key.startsWith("coApplicant") && field.key !== "coApplicant") {
      return false;
    }
    if (field.showOnTabs?.length && activeTab) {
      return field.showOnTabs.includes(activeTab);
    }
    return true;
  });
}

function estimatePremium(category: ApplicationCategory, values: FormValues) {
  if (category !== "insurance") return null;
  const cover =
    Number(
      String(
        firstValue(values, ["sumInsured", "coverAmount", "coverage"]) || "",
      ).replace(/,/g, ""),
    ) || 500000;
  const age =
    Number(firstValue(values, ["age", "currentAge", "dob"]) || 30) || 30;
  const monthly = Math.max(
    399,
    Math.round((cover / 100000) * (age > 45 ? 145 : 95)),
  );
  return `₹${monthly.toLocaleString("en-IN")}/mo approx.`;
}

function buildInitialValues(flow: FormFlow) {
  const values: FormValues = {};
  if (flow.tabFieldKey && flow.tabs?.[0])
    values[flow.tabFieldKey] = flow.tabs[0].key;
  flow.steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.type === "checkbox") values[field.key] = false;
      if (field.type === "coApplicants")
        values[field.key] = [] as CoApplicant[];
    });
  });
  return values;
}

const mergeAutofillValues = (base: FormValues, autofill: FormValues) => {
  const next = { ...base };
  Object.entries(autofill).forEach(([key, value]) => {
    if (!isEmptyValue(value) && isEmptyValue(next[key])) next[key] = value;
  });
  return next;
};

function FieldInput({
  field,
  value,
  error,
  values,
  onChange,
  onRcLookup,
  rcLookupLoading,
}: {
  field: FormField;
  value: any;
  error?: string;
  values: FormValues;
  onChange: (key: string, value: any) => void;
  onRcLookup?: () => void;
  rcLookupLoading?: boolean;
}) {
  if (field.type === "coApplicants") {
    return (
      <div className="col-span-full" data-application-field={field.key}>
        <CoApplicantsSection
          value={value}
          error={error}
          onChange={(next) => onChange(field.key, next)}
        />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        className="col-span-full flex items-start gap-3 rounded-xl border border-[#dce9f7] bg-[#f7fbff] p-3"
        data-application-field={field.key}
      >
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.key, event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#005ca8]"
        />
        <span>
          <span className="block text-[13px] font-bold text-[#111827]">
            {field.label}
            {field.required ? <span className="text-red-500">*</span> : null}
          </span>
          {field.helperText ? (
            <span className="mt-1 block text-[11px] font-medium text-[#7a869a]">
              {field.helperText}
            </span>
          ) : null}
          {error ? (
            <span className="mt-1 block text-[11px] font-bold text-red-600">
              {error}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  const options =
    field.parentKey && field.optionsByParent
      ? field.optionsByParent[String(values[field.parentKey] || "")]
      : field.options;

  return (
    <label
      className={
        field.type === "textarea" || field.type === "file"
          ? "col-span-full grid gap-1.5"
          : "grid gap-1.5"
      }
      data-application-field={field.key}
    >
      <span className="text-[12px] font-bold text-[#1f2937]">
        {field.label}
        {field.required ? <span className="text-red-500">*</span> : null}
      </span>

      {field.type === "select" ? (
        <select
          className={fieldClass}
          value={value || ""}
          onChange={(event) => {
            onChange(field.key, event.target.value);
            field.resetOnChangeKeys?.forEach((key) => onChange(key, ""));
          }}
        >
          <option value="">
            {field.placeholder || `Select ${field.label}`}
          </option>
          {(options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className={textareaClass}
          value={value || ""}
          placeholder={field.placeholder || field.label}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      ) : field.type === "file" ? (
        <div className="rounded-xl border border-dashed border-[#c9ddf2] bg-[#fbfdff] p-3">
          <div className="flex items-center gap-2 text-[12px] font-black text-[#111827]">
            <UploadCloud className="h-4 w-4 text-[#005ca8]" />
            {field.placeholder || "Upload PDF or image"}
          </div>
          <input
            type="file"
            multiple
            className="mt-3 block w-full text-[12px] font-semibold text-[#667085] file:mr-3 file:rounded-full file:border-0 file:bg-[#eaf3ff] file:px-4 file:py-2 file:text-[12px] file:font-black file:text-[#005ca8]"
            onChange={(event) =>
              onChange(field.key, Array.from(event.target.files || []))
            }
          />
          {Array.isArray(value) && value.length ? (
            <p className="mt-2 text-[11px] font-bold text-[#13a653]">
              {value.length} file{value.length === 1 ? "" : "s"} selected
            </p>
          ) : null}
        </div>
      ) : onRcLookup ? (
        <div className="flex gap-2">
          <input
            className={fieldClass}
            type={field.type === "number" ? "text" : field.type}
            value={value || ""}
            maxLength={field.maxLength}
            placeholder={field.placeholder || field.label}
            onChange={(event) =>
              onChange(field.key, normalizeRcNumber(event.target.value))
            }
          />
          <button
            type="button"
            disabled={rcLookupLoading}
            onClick={onRcLookup}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#005ca8] px-4 text-[12px] font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {rcLookupLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {rcLookupLoading ? "Fetching" : field.verifyLabel || "Fetch"}
          </button>
        </div>
      ) : (
        <input
          className={fieldClass}
          type={field.type === "number" ? "text" : field.type}
          value={value || ""}
          maxLength={field.maxLength}
          placeholder={field.placeholder || field.label}
          onChange={(event) =>
            onChange(
              field.key,
              isPanNumberField(field)
                ? normalizePanNumber(event.target.value)
                : event.target.value,
            )
          }
        />
      )}

      {field.helperText ? (
        <span className="text-[11px] font-medium text-[#7a869a]">
          {field.helperText}
        </span>
      ) : null}
      {error ? (
        <span className="text-[11px] font-bold text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

export function ApplicationFlowPage({
  category,
  productSlug,
  flowKey,
  flow,
  referrer,
  bank,
}: {
  category: ApplicationCategory;
  productSlug: string;
  flowKey: string;
  flow: FormFlow;
  referrer?: string;
  bank?: string;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>(() => {
    const initialValues = buildInitialValues(flow);
    const storedUser = getStoredUser();
    return storedUser
      ? mergeAutofillValues(
          initialValues,
          buildAutofillValues(storedUser, flow, category),
        )
      : initialValues;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rcLookupLoadingKey, setRcLookupLoadingKey] = useState("");
  const [rcLookupMessage, setRcLookupMessage] = useState("");
  const [autofillMessage, setAutofillMessage] = useState(() =>
    getStoredUser() ? "Profile details synced from your saved profile." : "",
  );
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const activeTab = flow.tabFieldKey
    ? values[flow.tabFieldKey] || flow.tabs?.[0]?.key
    : undefined;
  const step = flow.steps[stepIndex];
  const isLastStep = stepIndex === flow.steps.length - 1;
  const progress =
    flow.steps.length > 1 ? (stepIndex / (flow.steps.length - 1)) * 100 : 100;
  const fields = useMemo(
    () => visibleFields(flow, values, stepIndex, activeTab),
    [activeTab, flow, stepIndex, values],
  );
  const premium = estimatePremium(category, values);
  const currentApplyHref = useMemo(() => {
    const params = new URLSearchParams();
    if (referrer) params.set("referrer", referrer);
    if (bank) params.set("bank", bank);
    const query = params.toString();
    return `/apply/${category}/${productSlug}${query ? `?${query}` : ""}`;
  }, [bank, category, productSlug, referrer]);

  useEffect(() => {
    const isLoggedIn = getAuthType() === "user" && Boolean(getAuthToken());
    if (isLoggedIn) {
      let active = true;
      queueMicrotask(() => {
        if (active) setAuthReady(true);
      });
      return () => {
        active = false;
      };
    }

    if (typeof window === "undefined") return;
    const redirectTo = `${window.location.pathname}${window.location.search}`;
    router.replace(
      buildLoginRedirectHref({
        redirectTo,
        product: productSlug,
      }),
    );
  }, [productSlug, router]);

  const applyAutofill = useCallback(
    (user: CurrentUser, source: "saved profile" | "current profile") => {
      const autofill = buildAutofillValues(user, flow, category);
      const autofillEntries = Object.entries(autofill);

      setValues((current) => {
        const next = { ...current };
        autofillEntries.forEach(([key, value]) => {
          if (!isEmptyValue(value) && isEmptyValue(next[key])) {
            next[key] = value;
          }
        });
        return next;
      });

      if (autofillEntries.length > 0) {
        setAutofillMessage(`Profile details synced from your ${source}.`);
      }
    },
    [category, flow],
  );

  useEffect(() => {
    if (!authReady || getAuthType() !== "user" || !getAuthToken()) return;

    let active = true;
    getCurrentUser()
      .then((user) => {
        if (!active || !user) return;
        applyAutofill(user, "current profile");
      })
      .catch(() => {
        if (active) setAutofillMessage("");
      });

    return () => {
      active = false;
    };
  }, [applyAutofill, authReady]);

  const updateValue = (key: string, nextValue: any) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSubmitError("");
    setSubmitMessage("");
    if (isRcFieldKey(key)) setRcLookupMessage("");
  };

  const handleRcLookup = async (
    fieldKey: "carRegistrationNumber" | "registrationNumber",
  ) => {
    const raw = values[fieldKey];
    if (!raw) {
      setErrors((current) => ({
        ...current,
        [fieldKey]: "Enter a valid registration number.",
      }));
      focusApplicationField(fieldKey);
      return;
    }

    const normalized = normalizeRcNumber(String(raw));
    const rcPattern = /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/;
    if (!rcPattern.test(normalized)) {
      setErrors((current) => ({
        ...current,
        [fieldKey]: "Use a valid registration number like DL10CW7560.",
      }));
      focusApplicationField(fieldKey);
      return;
    }

    setRcLookupLoadingKey(fieldKey);
    setRcLookupMessage("");
    try {
      const response = await fetchCarRcDetails(normalized);
      const payload = response?.data?.data || response?.data || response || {};
      const rcData = payload?.data || payload?.result || payload || {};

      const makeModel = pickString(
        rcData?.maker_model,
        rcData?.vehicle?.maker_model,
        rcData?.vehicle?.make_model,
        rcData?.vehicle?.makeModel,
        rcData?.make_model,
        rcData?.vehicle_make_model,
        rcData?.vehicle_model,
        rcData?.model,
      );
      const vehicleType = pickString(
        rcData?.vehicle_category_description,
        rcData?.vehicle_category,
        rcData?.vehicle?.vehicle_class,
        rcData?.vehicle?.vehicle_type,
        rcData?.vehicle_class,
        rcData?.vehicle_type,
      );
      const year = extractYear(
        rcData?.manufacturing_date_formatted ||
          rcData?.manufacturing_date ||
          rcData?.registration_date ||
          rcData?.reg_date ||
          rcData?.vehicle?.manufacture_year ||
          rcData?.manufacture_year ||
          rcData?.mfg_year,
      );

      const updates: FormValues = {
        [fieldKey]: rcData?.rc_number
          ? normalizeRcNumber(String(rcData.rc_number))
          : normalized,
      };

      if (fieldKey === "registrationNumber") {
        if (makeModel) updates.makeModel = makeModel;
        if (year) updates.year = year;
        if (rcData?.fuel_type) updates.fuelType = rcData.fuel_type;
        if (rcData?.insurance_company)
          updates.previousInsurer = rcData.insurance_company;
        if (rcData?.insurance_upto)
          updates.policyExpiry = rcData.insurance_upto;
      } else {
        if (makeModel) updates.makeModel = makeModel;
        if (vehicleType) updates.vehicleType = vehicleType;
        if (year) updates.manufactureYear = year;
        if (rcData?.owner_name) updates.carOwnerName = rcData.owner_name;
        if (rcData?.father_name) updates.carFatherName = rcData.father_name;
        if (rcData?.registration_date)
          updates.carRegistrationDate = rcData.registration_date;
        if (rcData?.registered_at)
          updates.carRegisteredAt = rcData.registered_at;
        if (rcData?.vehicle_category_description)
          updates.carCategory = rcData.vehicle_category_description;
        if (rcData?.maker_description)
          updates.carMakerDescription = rcData.maker_description;
        if (rcData?.body_type) updates.carBodyType = rcData.body_type;
        if (rcData?.fuel_type) updates.carFuelType = rcData.fuel_type;
        if (rcData?.color) updates.carColor = rcData.color;
        if (rcData?.vehicle_chasi_number)
          updates.carChassisNumber = rcData.vehicle_chasi_number;
        if (rcData?.vehicle_engine_number)
          updates.carEngineNumber = rcData.vehicle_engine_number;
        if (rcData?.insurance_company)
          updates.carInsuranceCompany = rcData.insurance_company;
        if (rcData?.insurance_upto)
          updates.carInsuranceUpto = rcData.insurance_upto;
        if (rcData?.financer) updates.carFinancer = rcData.financer;
        if (rcData?.rc_status) updates.carRcStatus = rcData.rc_status;
      }

      setValues((current) => ({ ...current, ...updates }));
      setErrors((current) => ({ ...current, [fieldKey]: "" }));
      setRcLookupMessage("Vehicle details fetched and filled from RC.");
    } catch (error: any) {
      const message =
        error?.message ||
        error?.error ||
        error?.data?.message ||
        "Unable to fetch vehicle details right now.";
      setErrors((current) => ({ ...current, [fieldKey]: message }));
      focusApplicationField(fieldKey);
      setRcLookupMessage("");
    } finally {
      setRcLookupLoadingKey("");
    }
  };

  const validateStep = () => {
    const nextErrors: FormErrors = {};
    fields.forEach((field) => {
      const value = values[field.key];
      if (field.required) {
        const missing =
          field.type === "checkbox"
            ? !value
            : field.type === "coApplicants"
              ? !Array.isArray(value) || value.length === 0
              : value === undefined ||
                value === null ||
                String(value).trim() === "";
        if (missing) nextErrors[field.key] = "This field is required.";
      }

      if (
        value &&
        field.type === "email" &&
        !patterns.email.test(String(value))
      ) {
        nextErrors[field.key] = "Enter a valid email address.";
      }
      if (
        value &&
        field.type === "phone" &&
        !patterns.phone.test(normalizePhone(String(value)))
      ) {
        nextErrors[field.key] = "Enter a valid 10-digit mobile number.";
      }
      if (
        value &&
        isPanNumberField(field) &&
        !patterns.pan.test(String(value))
      ) {
        nextErrors[field.key] = "Enter a valid PAN number.";
      }
      if (
        value &&
        field.key.toLowerCase().includes("aadhaar") &&
        !patterns.aadhaar.test(String(value))
      ) {
        nextErrors[field.key] = "Enter a valid 12-digit Aadhaar number.";
      }
      if (
        value &&
        field.key.toLowerCase().includes("pincode") &&
        !patterns.pincode.test(String(value))
      ) {
        nextErrors[field.key] = "Enter a valid 6-digit pincode.";
      }
      if (
        value &&
        field.pattern &&
        !new RegExp(field.pattern).test(String(value))
      ) {
        nextErrors[field.key] = field.patternError || "Enter a valid value.";
      }
    });

    if (values.coApplicant && Array.isArray(values.coApplicants)) {
      values.coApplicants.forEach((item: CoApplicant, index: number) => {
        const mobile = normalizePhone(String(item.mobile || ""));
        const pan = String(item.pan || "").toUpperCase();
        const email = String(item.email || "");
        if (
          !item.name ||
          !patterns.pan.test(pan) ||
          !patterns.phone.test(mobile)
        ) {
          nextErrors.coApplicants = `Enter valid name, PAN, and 10-digit mobile for co-applicant ${index + 1}.`;
        }
        if (email && !patterns.email.test(email)) {
          nextErrors.coApplicants = `Enter a valid email for co-applicant ${index + 1}.`;
        }
      });
    }

    const firstErrorKey =
      fields.find((field) => nextErrors[field.key])?.key ||
      Object.keys(nextErrors)[0];
    const isValid = Object.keys(nextErrors).length === 0;

    setErrors(nextErrors);
    if (!isValid) focusApplicationField(firstErrorKey);
    return isValid;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStepIndex((current) => Math.min(current + 1, flow.steps.length - 1));
  };

  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    if (loading) return;
    if (!validateStep()) return;
    if (getAuthType() !== "user" || !getAuthToken()) {
      setSubmitError(
        "Please login with your mobile number before submitting this application.",
      );
      return;
    }

    setLoading(true);
    setSubmitError("");
    setSubmitMessage("");
    try {
      await submitApplication({ category, flowKey, values, referrer });
      setSubmitMessage(
        "Application saved successfully. Our team will contact you for the next step.",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit application.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-[#dce9f7] bg-[#f7fbff] px-5 py-4 text-[13px] font-black text-[#005ca8]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to login...
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-white px-4 py-8 font-sans md:px-8 lg:px-16">
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-20 rotate-140 rounded bg-[#e0effe]" />
      <div className="mx-auto max-w-7xl">
        <Link
          href={referrer || "/products"}
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-bold text-[#005ca8] no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to product
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
          <form onSubmit={handleSubmit} className="min-w-0">
            <div className="mb-8 rounded-2xl border border-[#dce9f7] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-4 shadow-[0_16px_40px_rgba(0,92,168,0.06)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#005ca8]">
                    Application progress
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                    Step {stepIndex + 1} of {flow.steps.length}: {step.title}
                  </p>
                </div>
                <span className="rounded-full border border-[#cfe6ff] bg-white px-3 py-1 text-[11px] font-black text-[#005ca8]">
                  {Math.round(progress)}% complete
                </span>
              </div>

              <div className="relative">
                <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-[#d7eafd]" />
                <motion.div
                  className="absolute left-5 top-5 h-1 rounded-full bg-[linear-gradient(90deg,#005ca8,#13a653)]"
                  initial={false}
                  animate={{ width: `calc((100% - 40px) * ${progress / 100})` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <div
                  className="relative grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${flow.steps.length}, minmax(0, 1fr))`,
                  }}
                >
                  {flow.steps.map((item, index) => {
                    const completed = index < stepIndex;
                    const active = index === stepIndex;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => index < stepIndex && setStepIndex(index)}
                        className="group flex min-w-0 flex-col items-center gap-2 text-center"
                      >
                        <motion.span
                          animate={{ scale: active ? 1.08 : 1 }}
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[12px] font-black shadow-sm transition ${
                            completed
                              ? "border-[#13a653] bg-[#13a653] text-white"
                              : active
                                ? "border-[#005ca8] bg-[#005ca8] text-white ring-4 ring-[#dcefff]"
                                : "border-[#cfe3f6] bg-white text-[#8bb7dc]"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </motion.span>
                        <span
                          className={`hidden max-w-28 truncate text-[11px] font-black md:block ${active ? "text-[#005ca8]" : "text-[#8a94a6]"}`}
                        >
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[12px] font-black uppercase tracking-wide text-[#005ca8]">
                {category === "insurance"
                  ? "Insurance application"
                  : "Loan application"}
              </p>
              <h1 className="mt-1 text-[28px] font-black tracking-tight text-[#005ca8] md:text-[34px]">
                Apply for {flow.title || humanizeProduct(productSlug)}
              </h1>
              <p className="mt-1 text-[13px] font-medium text-[#7a869a]">
                {step.description ||
                  flow.description ||
                  "Complete the details step by step."}
              </p>
              {bank ? (
                <p className="mt-2 inline-flex rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-black text-[#005ca8]">
                  Partner context: {humanizeProduct(bank)}
                </p>
              ) : null}
              {autofillMessage ? (
                <p className="mt-2 inline-flex rounded-full border border-[#dce9f7] bg-white px-3 py-1 text-[11px] font-black text-[#005ca8]">
                  {autofillMessage}
                </p>
              ) : null}
              {rcLookupMessage ? (
                <p className="mt-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                  {rcLookupMessage}
                </p>
              ) : null}
            </div>

            {flow.tabs?.length && flow.tabFieldKey ? (
              <div className="mb-5 flex flex-wrap gap-2">
                {flow.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => updateValue(flow.tabFieldKey!, tab.key)}
                    className={`rounded-full border px-4 py-2 text-[12px] font-black transition ${
                      activeTab === tab.key
                        ? "border-[#005ca8] bg-[#005ca8] text-white"
                        : "border-[#dce9f7] bg-white text-[#005ca8]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.section
                key={step.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="grid gap-4 md:grid-cols-2"
              >
                {fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    values={values}
                    error={errors[field.key]}
                    onChange={updateValue}
                    onRcLookup={
                      isRcFieldKey(field.key)
                        ? () =>
                            handleRcLookup(
                              field.key as
                                | "carRegistrationNumber"
                                | "registrationNumber",
                            )
                        : undefined
                    }
                    rcLookupLoading={rcLookupLoadingKey === field.key}
                  />
                ))}
              </motion.section>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="h-11 min-w-40 rounded-full border border-[#13a653] bg-white px-6 text-[13px] font-black text-[#13a653]"
                >
                  Save & Back
                </button>
              ) : null}
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-11 min-w-40 items-center justify-center gap-2 rounded-full bg-[#13a653] px-6 text-[13px] font-black text-white"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-full bg-[#13a653] px-6 text-[13px] font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {loading
                    ? "Submitting..."
                    : flow.submitLabel || "Submit Application"}
                </button>
              )}
            </div>

            {submitError ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-[13px] font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {submitError}{" "}
                  {submitError.toLowerCase().includes("login") ? (
                    <Link
                      href={buildLoginRedirectHref({
                        redirectTo: currentApplyHref,
                        product: productSlug,
                      })}
                      className="underline"
                    >
                      Login now
                    </Link>
                  ) : null}
                </span>
              </div>
            ) : null}
            {submitMessage ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[13px] font-bold text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {submitMessage}
              </div>
            ) : null}
          </form>

          <aside className="h-fit rounded-2xl border border-[#dce9f7] bg-[#f4f9ff] p-5 lg:sticky lg:top-24">
            <div className="relative mx-auto mb-4 h-28 w-full">
              <Image
                src="/assets/images/coin-bag.png"
                alt="Apply online"
                fill
                sizes="(max-width: 640px) 100vw, 224px"
                className="object-contain"
              />
            </div>
            <h2 className="text-[15px] font-black text-[#111827]">
              Why apply online?
            </h2>
            <div className="mt-4 space-y-4">
              {benefitItems.map(([title, text], index) => {
                const Icon =
                  [Sparkles, ShieldCheck, FileText, LockKeyhole][index] ||
                  Sparkles;
                return (
                  <div key={title} className="flex gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#005ca8]" />
                    <div>
                      <p className="text-[12px] font-black text-[#111827]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#667085]">
                        {text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {premium ? (
              <div className="mt-5 rounded-xl border border-[#cfe6ff] bg-white p-4">
                <p className="text-[11px] font-black uppercase tracking-wide text-[#005ca8]">
                  Premium placeholder
                </p>
                <p className="mt-1 text-[20px] font-black text-[#111827]">
                  {premium}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#667085]">
                  Final premium depends on insurer underwriting and documents.
                </p>
              </div>
            ) : null}
            <div className="mt-5 rounded-xl border border-[#dce9f7] bg-white p-4">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#005ca8]">
                Notes
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] font-medium leading-5 text-[#667085]">
                <li>
                  Keep PAN, Aadhaar, income proof, and bank statement ready.
                </li>
                <li>
                  Co-applicant documents can be added now or requested later by
                  the team.
                </li>
                <li>
                  Uploaded files are used only for application verification.
                </li>
              </ul>
            </div>
            <div className="mt-5 rounded-xl border border-[#dce9f7] bg-white p-4 text-[11px] font-medium leading-5 text-[#667085]">
              <b className="text-[#111827]">Disclaimer:</b> Submitting this form
              does not guarantee approval, rate, premium, disbursal, or policy
              issuance. Partner checks and document verification apply.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
