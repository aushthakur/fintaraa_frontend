"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ArrowRight,
  FileSearch,
  BriefcaseBusiness,
  Clock3,
  Gift,
  MessageCircle,
  Search,
  Send,
  Star,
  X,
  Loader2,
  Landmark,
  ShieldCheck,
  IndianRupee,
  UserRound,
  Building2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { emitAuthChanged } from "@/lib/authEvents";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { accountItemBySlug } from "@/data/accountProfile";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { LogoutPanel } from "@/components/account/HelpLegalPanels";
import { updateKycProfile, type CurrentUser } from "@/services/profile";
import { StatementsLettersPanel } from "@/components/account/StatementsLettersPanel";
import { UploadedDocumentsPanel } from "@/components/account/UploadedDocumentsPanel";
import {
  type AccountLoanQuery,
  type AccountInsuranceQuery,
  type AccountChatMessage,
  fetchAccountLoanApplications,
  fetchAccountInsuranceApplications,
  fetchAccountApplicationMessages,
  sendAccountApplicationMessage,
} from "@/services/accountActivity";
import {
  fetchCreditCards,
  type CreditCardProduct,
} from "@/services/bankProducts";
import {
  type ServiceRequestRecord,
  fetchServiceRequestHistory,
} from "@/services/serviceRequests";

type EditProfileFieldKey =
  | "fullName"
  | "panNumber"
  | "dateOfBirth"
  | "fatherName"
  | "aadhaarNumber"
  | "email"
  | "mobile"
  | "city"
  | "state"
  | "pinCode"
  | "currentAddress"
  | "employmentType"
  | "employmentStatus"
  | "employerName"
  | "professionOrJobTitle"
  | "monthlyIncome"
  | "annualIncome"
  | "workExperience"
  | "existingEmi"
  | "companyAddress"
  | "workEmail"
  | "workPhone"
  | "salaryAccountBank"
  | "officeCity"
  | "officeState"
  | "officePinCode"
  | "industry"
  | "taxId"
  | "gstNumber"
  | "businessRegistrationType"
  | "licenseNumber"
  | "companyType"
  | "businessVintage"
  | "annualTurnover"
  | "numberOfEmployees"
  | "businessAddress"
  | "businessEmail"
  | "businessPhone"
  | "businessType"
  | "website"
  | "emiPaid"
  | "accountHolderName"
  | "bankName"
  | "accountType"
  | "accountNumber"
  | "ifscCode"
  | "branchCity";

type EditProfileFormState = Record<EditProfileFieldKey, string>;
type EmploymentType =
  | "salaried"
  | "selfEmployedProfessional"
  | "selfEmployedNonProfessional";

type EditProfileField = {
  key: EditProfileFieldKey;
  label: string;
  placeholder: string;
  type?: string;
};

const emptyProfileForm: EditProfileFormState = {
  fullName: "",
  dateOfBirth: "",
  fatherName: "",
  panNumber: "",
  aadhaarNumber: "",
  email: "",
  mobile: "",
  currentAddress: "",
  city: "",
  state: "",
  pinCode: "",
  employmentType: "",
  employmentStatus: "",
  employerName: "",
  professionOrJobTitle: "",
  monthlyIncome: "",
  annualIncome: "",
  workExperience: "",
  existingEmi: "",
  companyAddress: "",
  workEmail: "",
  workPhone: "",
  salaryAccountBank: "",
  officeCity: "",
  officeState: "",
  officePinCode: "",
  industry: "",
  taxId: "",
  gstNumber: "",
  businessRegistrationType: "",
  licenseNumber: "",
  companyType: "",
  businessVintage: "",
  annualTurnover: "",
  numberOfEmployees: "",
  businessAddress: "",
  businessEmail: "",
  businessPhone: "",
  businessType: "",
  website: "",
  emiPaid: "",
  accountHolderName: "",
  bankName: "",
  accountType: "",
  accountNumber: "",
  ifscCode: "",
  branchCity: "",
};

const cleanValue = (value: unknown) =>
  value === undefined || value === null || typeof value === "object"
    ? ""
    : String(value).trim();

const firstValue = (...values: unknown[]) => {
  const match = values.find((value) => cleanValue(value));
  return cleanValue(match);
};

const padDatePart = (value: number) => String(value).padStart(2, "0");

const formatDateForInput = (date: Date) =>
  `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate(),
  )}`;

const getAdultMaxDob = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return formatDateForInput(date);
};

const normalizeDateInput = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateForInput(value);
  }

  const text = cleanValue(value);
  if (!text) return "";

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const indianMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (indianMatch) {
    const [, day, month, year] = indianMatch;
    return `${year}-${padDatePart(Number(month))}-${padDatePart(Number(day))}`;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : formatDateForInput(parsed);
};

const firstDateValue = (...values: unknown[]) => {
  const match = values.find((value) => normalizeDateInput(value));
  return normalizeDateInput(match);
};

const isAtLeast18 = (dob: string) => Boolean(dob) && dob <= getAdultMaxDob();

const employmentOptions: Array<{
  value: EmploymentType;
  label: string;
  note: string;
}> = [
  {
    value: "salaried",
    label: "Salaried",
    note: "For employees with salary income.",
  },
  {
    value: "selfEmployedProfessional",
    label: "Self-employed professional",
    note: "For doctors, CAs, consultants, and licensed professionals.",
  },
  {
    value: "selfEmployedNonProfessional",
    label: "Self-employed business",
    note: "For business owners, traders, retailers, and service firms.",
  },
];

const isEmploymentType = (value: unknown): value is EmploymentType =>
  value === "salaried" ||
  value === "selfEmployedProfessional" ||
  value === "selfEmployedNonProfessional";

const normalizeEmploymentType = (
  employment: Record<string, unknown>,
): EmploymentType => {
  const direct = firstValue(employment.employmentType, employment.employerType);
  if (isEmploymentType(direct)) return direct;

  const normalized = direct.toLowerCase();
  if (normalized.includes("professional")) return "selfEmployedProfessional";
  if (
    normalized.includes("business") ||
    normalized.includes("self") ||
    normalized.includes("non")
  ) {
    return "selfEmployedNonProfessional";
  }

  const hasProfessionalSignal = firstValue(
    employment.licenseNumber,
    employment.profession,
    employment.professionOrJobTitle,
  );
  const hasBusinessSignal = firstValue(
    employment.businessType,
    employment.businessRegistrationType,
    employment.gstNumber,
    employment.taxId,
    employment.businessVintage,
  );

  if (hasProfessionalSignal && hasBusinessSignal)
    return "selfEmployedProfessional";
  if (hasBusinessSignal) return "selfEmployedNonProfessional";
  return "salaried";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const addressPart = (value: unknown, keys: string[]): string => {
  if (!isRecord(value)) return "";
  for (const key of keys) {
    const text = cleanValue(value[key]);
    if (text) return text;
  }
  return "";
};

const addressText = (value: unknown) => {
  const scalar = cleanValue(value);
  if (scalar) return scalar;
  if (!isRecord(value)) return "";

  const parts = [
    addressPart(value, ["address", "street", "line1", "addressLine1"]),
    addressPart(value, ["locality", "area", "landmark"]),
    addressPart(value, ["city"]),
    addressPart(value, ["state"]),
    addressPart(value, ["pinCode", "pincode", "postalCode"]),
    addressPart(value, ["country"]),
  ].filter(Boolean);

  return Array.from(new Set(parts)).join(", ");
};

const firstAddressValue = (...values: unknown[]) => {
  const match = values.find((value) => addressText(value));
  return addressText(match);
};

const firstAddressSource = (...values: unknown[]) =>
  values.find((value) => addressText(value));

function buildEditProfileForm(user: CurrentUser | null): EditProfileFormState {
  const personal = {
    ...(user?.personalDetails || {}),
    ...(user?.kycProfile?.personalDetails || {}),
  };
  const address = {
    ...(user?.addressDetails || {}),
    ...(user?.kycProfile?.addressDetails || {}),
  };
  const employment = {
    ...(user?.employmentDetails || {}),
    ...(user?.kycProfile?.employmentDetails || {}),
  };
  const bank = {
    ...(user?.bankDetails || {}),
    ...(user?.kycProfile?.bankDetails || {}),
  };
  const currentAddressSource = firstAddressSource(
    personal.address,
    address.currentAddress,
    address.address,
    address.street,
    user?.address,
  );

  return {
    fullName: firstValue(personal.fullName, user?.fullName, user?.name),
    dateOfBirth: firstDateValue(
      personal.dateOfBirth,
      personal.dob,
      personal.DOB,
      user?.dateOfBirth,
      user?.dob,
    ),
    fatherName: firstValue(personal.fatherName),
    panNumber: firstValue(personal.panNumber, user?.panCard),
    aadhaarNumber: firstValue(personal.aadhaarNumber, user?.aadhaarCard),
    email: firstValue(personal.email, user?.email),
    mobile: firstValue(
      personal.mobile,
      user?.mobile,
      user?.phone,
      user?.phoneNumber,
    ),
    currentAddress: firstAddressValue(currentAddressSource),
    city: firstValue(
      personal.city,
      address.city,
      addressPart(currentAddressSource, ["city"]),
      user?.city,
    ),
    state: firstValue(
      personal.state,
      address.state,
      addressPart(currentAddressSource, ["state"]),
      user?.state,
    ),
    pinCode: firstValue(
      personal.pinCode,
      personal.pincode,
      address.pinCode,
      address.pincode,
      addressPart(currentAddressSource, ["pinCode", "pincode", "postalCode"]),
      user?.pinCode,
      user?.pincode,
    ),
    employmentType: normalizeEmploymentType(employment),
    employmentStatus: firstValue(
      employment.employmentStatus,
      employment.employmentCategory,
    ),
    employerName: firstValue(
      employment.employerName,
      employment.companyName,
      employment.businessName,
    ),
    professionOrJobTitle: firstValue(
      employment.professionOrJobTitle,
      employment.jobTitle,
      employment.profession,
    ),
    monthlyIncome: firstValue(
      employment.monthlyIncome,
      employment.businessIncome,
      employment.netIncomeAfterTax,
      employment.monthlySalaryAmount,
    ),
    annualIncome: firstValue(
      employment.annualIncome,
      employment.yearlyIncome,
      employment.annualSalary,
    ),
    workExperience: firstValue(
      employment.workExperience,
      employment.businessVintage,
      employment.tenure,
      employment.totalExperience,
    ),
    existingEmi: firstValue(employment.existingEmi, employment.emiPaid),
    companyAddress: firstValue(
      employment.companyAddress,
      employment.officeAddress,
      employment.businessAddress,
      employment.address,
    ),
    workEmail: firstValue(employment.workEmail, employment.email),
    workPhone: firstValue(
      employment.workPhone,
      employment.mobile,
      employment.phone,
    ),
    salaryAccountBank: firstValue(
      employment.salaryAccountBank,
      employment.salaryBank,
    ),
    officeCity: firstValue(employment.officeCity, employment.workCity),
    officeState: firstValue(employment.officeState, employment.workState),
    officePinCode: firstValue(
      employment.officePinCode,
      employment.workPinCode,
      employment.workPincode,
    ),
    industry: firstValue(employment.industry),
    taxId: firstValue(
      employment.taxId,
      employment.gstTurnover,
      employment.gstNumber,
      employment.gstNo,
    ),
    gstNumber: firstValue(
      employment.gstNumber,
      employment.gstNo,
      employment.gstId,
    ),
    businessRegistrationType: firstValue(
      employment.businessRegistrationType,
      employment.registrationType,
    ),
    licenseNumber: firstValue(
      employment.licenseNumber,
      employment.registrationNumber,
    ),
    companyType: firstValue(
      employment.companyType,
      employment.businessEntity,
      employment.businessType,
    ),
    businessVintage: firstValue(
      employment.businessVintage,
      employment.vintage,
      employment.businessTenure,
      employment.tenure,
    ),
    annualTurnover: firstValue(
      employment.annualTurnover,
      employment.turnover,
      employment.annualRevenue,
    ),
    numberOfEmployees: firstValue(
      employment.numberOfEmployees,
      employment.employeesCount,
    ),
    businessAddress: firstValue(
      employment.businessAddress,
      employment.officeAddress,
      employment.companyAddress,
      employment.address,
    ),
    businessEmail: firstValue(employment.businessEmail, employment.officeEmail),
    businessPhone: firstValue(employment.businessPhone, employment.officePhone),
    businessType: firstValue(employment.businessType, employment.industry),
    website: firstValue(employment.website, employment.businessWebsite),
    emiPaid: firstValue(
      employment.emiPaid,
      employment.emiAmount,
      employment.emi,
    ),
    accountHolderName: firstValue(bank.accountHolderName),
    bankName: firstValue(bank.bankName),
    accountType: firstValue(bank.accountType),
    accountNumber: firstValue(bank.accountNumber),
    ifscCode: firstValue(bank.ifscCode),
    branchCity: firstValue(bank.branchCity, bank.city),
  };
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  min,
  max,
  helper,
}: {
  type?: string;
  min?: string;
  max?: string;
  helper?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-extrabold text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold placeholder:transition-colors focus:border-transparent focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
        <span className="pointer-events-none absolute -bottom-1 left-0 h-2 w-2 scale-0 rounded-full bg-[#195585] opacity-0 transition-all duration-300 peer-focus:scale-100 peer-focus:opacity-100" />
      </div>
      {helper ? (
        <span className="mt-2 block text-[11px] font-semibold leading-5 text-[#667085]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

const editProfileSteps = [
  {
    step: "01",
    id: "personal-details",
    title: "Personal Details",
    text: "Identity, contact, and address details used for KYC and partner verification.",
    icon: UserRound,
    fields: [
      { key: "fullName", label: "Full name", placeholder: "Rahul Sharma" },
      {
        key: "dateOfBirth",
        label: "Date of birth",
        placeholder: "Select date of birth",
        type: "date",
      },
      {
        key: "fatherName",
        label: "Father name",
        placeholder: "Enter father's name",
      },
      { key: "panNumber", label: "PAN number", placeholder: "ABCDE1234F" },
      {
        key: "aadhaarNumber",
        label: "Aadhaar number",
        placeholder: "XXXX XXXX 1234",
      },
      {
        key: "email",
        label: "Email",
        placeholder: "rahul.sharma@example.com",
        type: "email",
      },
      {
        key: "mobile",
        label: "Mobile",
        placeholder: "+91 98765 43210",
        type: "tel",
      },
      {
        key: "currentAddress",
        label: "Current address",
        placeholder: "House, street, locality",
      },
      { key: "city", label: "City", placeholder: "Gurugram" },
      { key: "state", label: "State", placeholder: "Haryana" },
      { key: "pinCode", label: "PIN code", placeholder: "122018" },
    ] satisfies EditProfileField[],
  },
  {
    step: "02",
    id: "professional-details",
    title: "Professional Details",
    text: "Employment and income information that helps lenders assess repayment capacity.",
    icon: Building2,
    fields: [] satisfies EditProfileField[],
  },
  {
    step: "03",
    id: "bank-details",
    title: "Bank Details",
    text: "Bank account details used for verification, repayment mandates, and partner fulfilment.",
    icon: Landmark,
    fields: [
      {
        key: "accountHolderName",
        label: "Account holder name",
        placeholder: "Rahul Sharma",
      },
      { key: "bankName", label: "Bank name", placeholder: "HDFC Bank" },
      { key: "accountType", label: "Account type", placeholder: "Savings" },
      {
        key: "accountNumber",
        label: "Account number",
        placeholder: "XXXXXX9821",
      },
      { key: "ifscCode", label: "IFSC code", placeholder: "HDFC0001234" },
      { key: "branchCity", label: "Branch city", placeholder: "Gurugram" },
    ] satisfies EditProfileField[],
  },
];

const professionalFieldsByType: Record<EmploymentType, EditProfileField[]> = {
  salaried: [
    {
      key: "employerName",
      label: "Current company",
      placeholder: "Enter company name",
    },
    {
      key: "professionOrJobTitle",
      label: "Designation",
      placeholder: "Enter designation",
    },
    {
      key: "employmentStatus",
      label: "Employment status",
      placeholder: "Full-time / Part-time / Contract",
    },
    {
      key: "monthlyIncome",
      label: "Net salary",
      placeholder: "Enter net salary",
      type: "number",
    },
    {
      key: "annualIncome",
      label: "Annual income",
      placeholder: "Enter annual income",
      type: "number",
    },
    {
      key: "workEmail",
      label: "Work email",
      placeholder: "name@company.com",
      type: "email",
    },
    {
      key: "workPhone",
      label: "Work phone",
      placeholder: "Office phone",
      type: "tel",
    },
    {
      key: "salaryAccountBank",
      label: "Salary account bank",
      placeholder: "Bank name",
    },
    {
      key: "companyAddress",
      label: "Office address",
      placeholder: "Office address",
    },
    { key: "officeCity", label: "Office city", placeholder: "City" },
    { key: "officeState", label: "Office state", placeholder: "State" },
    {
      key: "officePinCode",
      label: "Office PIN code",
      placeholder: "PIN code",
      type: "number",
    },
  ],
  selfEmployedProfessional: [
    {
      key: "employerName",
      label: "Business name",
      placeholder: "Enter business name",
    },
    { key: "taxId", label: "GST No", placeholder: "Enter GST number" },
    {
      key: "gstNumber",
      label: "GST registration number",
      placeholder: "Enter GST registration number",
    },
    {
      key: "businessRegistrationType",
      label: "Business registration type",
      placeholder: "Proprietorship / LLP / Pvt Ltd",
    },
    {
      key: "licenseNumber",
      label: "License / registration no",
      placeholder: "Enter license number",
    },
    {
      key: "professionOrJobTitle",
      label: "Professional degree",
      placeholder: "Enter professional degree",
    },
    {
      key: "companyType",
      label: "Business entity",
      placeholder: "Proprietorship / LLP / Pvt Ltd",
    },
    {
      key: "businessVintage",
      label: "Business age",
      placeholder: "Enter years",
      type: "number",
    },
    {
      key: "annualTurnover",
      label: "Annual turnover",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      key: "numberOfEmployees",
      label: "Number of employees",
      placeholder: "Enter count",
      type: "number",
    },
    {
      key: "monthlyIncome",
      label: "Profit after tax",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      key: "businessAddress",
      label: "Business address",
      placeholder: "Enter business address",
    },
    {
      key: "businessEmail",
      label: "Business email",
      placeholder: "name@business.com",
      type: "email",
    },
    {
      key: "businessPhone",
      label: "Business phone",
      placeholder: "Business phone",
      type: "tel",
    },
    { key: "website", label: "Website", placeholder: "https://" },
    {
      key: "emiPaid",
      label: "EMI paid",
      placeholder: "Enter amount",
      type: "number",
    },
  ],
  selfEmployedNonProfessional: [
    {
      key: "employerName",
      label: "Business name",
      placeholder: "Enter business name",
    },
    {
      key: "taxId",
      label: "GST No",
      placeholder: "Enter GST number",
    },
    {
      key: "gstNumber",
      label: "GST registration number",
      placeholder: "Enter GST registration number",
    },
    {
      key: "businessRegistrationType",
      label: "Business registration type",
      placeholder: "Proprietorship / LLP / Pvt Ltd",
    },
    { key: "industry", label: "Industry", placeholder: "Enter industry" },
    {
      key: "businessType",
      label: "Business type",
      placeholder: "Retail / Services / Manufacturing",
    },
    {
      key: "companyType",
      label: "Business entity",
      placeholder: "Proprietorship / LLP / Pvt Ltd",
    },
    {
      key: "businessVintage",
      label: "Business age",
      placeholder: "Enter years",
      type: "number",
    },
    {
      key: "annualTurnover",
      label: "Annual turnover",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      key: "numberOfEmployees",
      label: "Number of employees",
      placeholder: "Enter count",
      type: "number",
    },
    {
      key: "monthlyIncome",
      label: "Profit after tax",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      key: "businessAddress",
      label: "Business address",
      placeholder: "Enter business address",
    },
    {
      key: "businessEmail",
      label: "Business email",
      placeholder: "name@business.com",
      type: "email",
    },
    {
      key: "businessPhone",
      label: "Business phone",
      placeholder: "Business phone",
      type: "tel",
    },
    { key: "website", label: "Website", placeholder: "https://" },
    {
      key: "emiPaid",
      label: "EMI paid",
      placeholder: "Enter amount",
      type: "number",
    },
  ],
};

function EditProfileForm() {
  const { user, loading } = useCurrentUser();
  const [form, setForm] = useState<EditProfileFormState>(emptyProfileForm);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(
    "Autofilled from your saved account details.",
  );

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active || dirty) return;
      setForm(buildEditProfileForm(user));
      setStatus(
        user
          ? "Autofilled from your saved account details."
          : "Login to autofill your account details.",
      );
    });

    return () => {
      active = false;
    };
  }, [dirty, user]);

  const updateField = (key: EditProfileFieldKey, value: string) => {
    setDirty(true);
    setStatus("Unsaved changes in your profile form.");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const activeEmploymentType = isEmploymentType(form.employmentType)
    ? form.employmentType
    : "salaried";

  const updateEmploymentType = (value: EmploymentType) => {
    setDirty(true);
    setStatus("Professional fields updated for the selected employment type.");
    setForm((current) => ({ ...current, employmentType: value }));
  };

  const saveLocalUser = (payload: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    const personalDetails = payload.personalDetails as Record<string, string>;
    const employmentDetails = payload.employmentDetails as Record<
      string,
      string
    >;
    const bankDetails = payload.bankDetails as Record<string, string>;
    const addressDetails = payload.addressDetails as Record<string, unknown>;
    const nextUser = {
      ...(user || {}),
      name: personalDetails.fullName || user?.name,
      fullName: personalDetails.fullName || user?.fullName,
      email: personalDetails.email || user?.email,
      mobile: personalDetails.mobile || user?.mobile,
      personalDetails,
      employmentDetails,
      bankDetails,
      addressDetails,
      kycProfile: {
        ...(user?.kycProfile || {}),
        personalDetails,
        employmentDetails,
        bankDetails,
        addressDetails,
      },
    };
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.dateOfBirth && !isAtLeast18(form.dateOfBirth)) {
      setStatus("You must be at least 18 years old to update your profile.");
      return;
    }

    setSaving(true);
    setStatus("Saving your profile securely...");

    const currentAddress = {
      street: form.currentAddress,
      city: form.city,
      state: form.state,
      country: "India",
      postalCode: form.pinCode,
      label: "home",
      isDefault: true,
    };

    const payload = {
      personalDetails: {
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        fatherName: form.fatherName,
        panNumber: form.panNumber,
        aadhaarNumber: form.aadhaarNumber,
        email: form.email,
        mobile: form.mobile,
        address: form.currentAddress,
        city: form.city,
        state: form.state,
        pinCode: form.pinCode,
      },
      addressDetails: {
        currentAddress,
        permanentAddress: currentAddress,
      },
      employmentDetails: {
        employmentType: activeEmploymentType,
        employerType: activeEmploymentType,
        employmentStatus: form.employmentStatus,
        employerName: form.employerName,
        professionOrJobTitle: form.professionOrJobTitle,
        monthlyIncome: form.monthlyIncome,
        annualIncome: form.annualIncome,
        workExperience: form.workExperience,
        existingEmi: form.existingEmi,
        companyAddress: form.companyAddress,
        workEmail: form.workEmail,
        workPhone: form.workPhone,
        salaryAccountBank: form.salaryAccountBank,
        officeCity: form.officeCity,
        officeState: form.officeState,
        officePinCode: form.officePinCode,
        industry: form.industry,
        taxId: form.taxId,
        gstNumber: form.gstNumber,
        businessRegistrationType: form.businessRegistrationType,
        licenseNumber: form.licenseNumber,
        companyType: form.companyType,
        businessVintage: form.businessVintage,
        annualTurnover: form.annualTurnover,
        numberOfEmployees: form.numberOfEmployees,
        businessAddress: form.businessAddress,
        businessEmail: form.businessEmail,
        businessPhone: form.businessPhone,
        businessType: form.businessType,
        website: form.website,
        emiPaid: form.emiPaid,
      },
      bankDetails: {
        accountHolderName: form.accountHolderName,
        bankName: form.bankName,
        accountType: form.accountType,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        branchCity: form.branchCity,
      },
      reusableAcrossApplications: true,
    };

    try {
      await updateKycProfile(payload);
      saveLocalUser(payload);
      setDirty(false);
      setStatus("Profile saved. Your account details are now in sync.");
      emitAuthChanged();
    } catch {
      setStatus("Profile could not be saved. Please review and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fintaraa-edit-profile-draft", JSON.stringify(form));
    }
    setStatus("Draft saved on this device.");
  };

  return (
    <div className="grid gap-7">
      <div className="grid gap-3 md:grid-cols-3">
        {editProfileSteps.map(
          ({ step, id, title, text, icon: Icon }, index) => (
            <a
              key={title}
              href={`#${id}`}
              className={`block p-5 no-underline transition hover:-translate-y-0.5 ${
                index === 0
                  ? "bg-[#195585] text-white"
                  : "bg-linear-to-br from-[#f8fcff] to-white text-[#07162d]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`text-[12px] font-extrabold uppercase tracking-[0.18em] ${
                    index === 0 ? "text-white/70" : "text-[#195585]"
                  }`}
                >
                  Step {step}
                </span>
                <Icon
                  className={`h-5 w-5 ${
                    index === 0 ? "text-[#7ee3a2]" : "text-[#195585]"
                  }`}
                />
              </div>
              <h3 className="mt-4 text-[19px] font-extrabold">{title}</h3>
              <p
                className={`mt-2 text-[12px] font-semibold leading-5 ${
                  index === 0 ? "text-white/76" : "text-[#667085]"
                }`}
              >
                {text}
              </p>
            </a>
          ),
        )}
      </div>

      <form className="grid gap-8" onSubmit={handleSubmit}>
        {editProfileSteps.map(
          ({ step, id, title, text, icon: Icon, fields }) => {
            const sectionFields =
              id === "professional-details"
                ? professionalFieldsByType[activeEmploymentType]
                : fields;

            return (
              <section key={title} id={id} className="scroll-mt-32 bg-white">
                <div className="flex flex-col gap-4 border-b border-[#e4edf5] pb-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#eef8ff] text-[#195585]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
                        Step {step}
                      </p>
                      <h3 className="mt-1 text-[24px] font-extrabold text-[#07162d]">
                        {title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#667085]">
                        {text}
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#079455]">
                    {loading ? "Syncing" : dirty ? "Editing" : "Synced"}
                  </span>
                </div>

                {id === "professional-details" ? (
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {employmentOptions.map((option) => {
                      const active = activeEmploymentType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateEmploymentType(option.value)}
                          className={`p-4 text-left transition hover:-translate-y-0.5 ${
                            active
                              ? "bg-[#195585] text-white shadow-[0_16px_32px_rgba(25,85,133,0.16)]"
                              : "bg-[#f8fcff] text-[#07162d] ring-1 ring-[#e4edf5]"
                          }`}
                        >
                          <span
                            className={`text-[12px] font-extrabold uppercase tracking-[0.14em] ${
                              active ? "text-white/72" : "text-[#195585]"
                            }`}
                          >
                            Employment type
                          </span>
                          <span className="mt-2 block text-[15px] font-extrabold">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 block text-[12px] font-semibold leading-5 ${
                              active ? "text-white/72" : "text-[#667085]"
                            }`}
                          >
                            {option.note}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sectionFields.map((field) => (
                    <FormField
                      type={"type" in field ? field.type : undefined}
                      min={
                        field.key === "dateOfBirth" ? "1900-01-01" : undefined
                      }
                      max={
                        field.key === "dateOfBirth"
                          ? getAdultMaxDob()
                          : undefined
                      }
                      helper={
                        field.key === "dateOfBirth"
                          ? "You must be 18 years or older to use Fintaraa services."
                          : undefined
                      }
                      key={field.label}
                      label={field.label}
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      onChange={(value) => updateField(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            );
          },
        )}

        <div className="flex flex-col gap-3 bg-[#07162d] p-5 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[18px] font-extrabold">Ready to update?</p>
            <p className="mt-1 text-[13px] font-semibold text-white/70">
              Review all details before saving. Partner verification may request
              supporting documents.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDraft}
              className="h-11 rounded-full bg-white/10 px-5 text-[13px] font-extrabold text-white"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-white px-6 text-[13px] font-extrabold text-[#195585]"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
        <p className="-mt-5 text-[12px] font-semibold text-[#667085]">
          {status}
        </p>
      </form>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-linear-to-br from-[#f8fcff] to-white p-6">
      <CheckCircle2 className="h-7 w-7 text-[#12b76a]" />
      <h3 className="mt-5 text-[24px] font-extrabold text-[#07162d]">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
        {text}
      </p>
    </div>
  );
}

type AccountApplicationCategory = "all" | "loan" | "insurance" | "service";

type AccountApplication = {
  id: string;
  sourceId: string;
  reference: string;
  category: Exclude<AccountApplicationCategory, "all">;
  title: string;
  subtitle: string;
  status: string;
  statusKey: string;
  stage: string;
  assignedTo: string;
  updatedBy?: string;
  tags: string[];
  detailFields: Array<{ label: string; value: string }>;
  timeline?: Array<{
    stage: string;
    status: "pending" | "active" | "completed" | "blocked";
    remarks?: string;
    updatedBy?: string;
    updatedAt?: string;
  }>;
  chatKind?: "loan" | "insurance";
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
  href: string;
};

type AccountOffer = {
  id: string;
  title: string;
  bank: string;
  image?: string;
  type: string;
  network: string;
  reward: string;
  welcomeBenefit: string;
  tags: string[];
  benefits: string[];
  annualFee?: number;
  minimumIncome?: number;
  creditScore?: number;
  featured: boolean;
  profileMatch: boolean;
  matchLabel: string;
  href: string;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const normalizeLabel = (value: unknown, fallback = "Not specified") => {
  const text = cleanValue(value);
  if (!text) return fallback;
  return text
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getNumber = (value: unknown): number | undefined => {
  const cleaned = cleanValue(value).replace(/[^\d.-]/g, "");
  if (!cleaned) return undefined;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : undefined;
};

const formatCurrency = (value?: number) => {
  if (value === undefined) return "Not shared";
  if (value === 0) return "No fee";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDisplayDate = (value?: string) => {
  if (!value) return "Not updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const dateValue = (value?: string) => {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const getAssigneeName = (...values: unknown[]) => {
  for (const value of values) {
    const record = asObject(value);
    const name = firstValue(record.name, record.username, record.email);
    if (name) return name;
    const text = cleanValue(value);
    if (text) return text;
  }
  return "Fintaraa team";
};

const getStatusTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (
    normalized.includes("approved") ||
    normalized.includes("completed") ||
    normalized.includes("issued") ||
    normalized.includes("filed")
  ) {
    return "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]";
  }
  if (
    normalized.includes("reject") ||
    normalized.includes("blocked") ||
    normalized.includes("failed")
  ) {
    return "bg-[#fef3f2] text-[#b42318] ring-[#fecdca]";
  }
  if (normalized.includes("pending") || normalized.includes("draft")) {
    return "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]";
  }
  return "bg-[#eef8ff] text-[#195585] ring-[#c7e7ff]";
};

const getUserAnnualIncome = (user?: CurrentUser | null) => {
  const userRecord = asObject(user);
  const kyc = asObject(userRecord.kycProfile);
  const employment = asObject(
    kyc.employmentDetails || userRecord.employmentDetails,
  );
  const annual = getNumber(
    firstValue(
      employment.annualIncome,
      employment.annualTurnover,
      userRecord.annualIncome,
    ),
  );
  if (annual) return annual;
  const monthly = getNumber(
    firstValue(
      employment.monthlyIncome,
      employment.netIncome,
      userRecord.monthlyIncome,
    ),
  );
  return monthly ? monthly * 12 : undefined;
};

const getUserCreditScore = (user?: CurrentUser | null) => {
  const userRecord = asObject(user);
  const cibil = asObject(userRecord.cibil);
  const report = asObject(userRecord.cibilReport);
  return getNumber(
    firstValue(
      userRecord.cibilScore,
      userRecord.creditScore,
      cibil.score,
      report.score,
    ),
  );
};

const normalizeLoanApplication = (
  item: AccountLoanQuery,
): AccountApplication => {
  const amount = getNumber(item.loanAmount);
  const status = normalizeLabel(item.status || "submitted");
  const product = normalizeLabel(item.loanType, "Loan Application");
  const location = [item.city, item.state].filter(Boolean).join(", ");
  const reference =
    firstValue(item.loanId, item._id ? item._id.slice(-8).toUpperCase() : "") ||
    "Loan";

  return {
    id: `loan-${item._id}`,
    sourceId: item._id,
    reference,
    category: "loan",
    title: product,
    subtitle: item.bankName || "Loan application",
    status,
    statusKey: status.toLowerCase(),
    stage: status,
    assignedTo: getAssigneeName(item.assignedAgent, item.assignedLander),
    updatedBy: item.updatedByName,
    chatKind: "loan",
    tags: [
      "Loan",
      product,
      item.approved ? "Approved" : status,
      item.employmentType ? normalizeLabel(item.employmentType) : "",
    ].filter(Boolean),
    detailFields: [
      { label: "Reference ID", value: reference },
      { label: "Product", value: product },
      { label: "Loan amount", value: formatCurrency(amount) },
      { label: "Bank", value: item.bankName || "Partner allocation pending" },
      {
        label: "Applicant",
        value: firstValue(item.firstName, item.lastName) || "Applicant",
      },
      { label: "Mobile", value: item.mobile || "Not shared" },
      { label: "Email", value: item.email || "Not shared" },
      { label: "Location", value: location || "Not shared" },
      {
        label: "Income",
        value: formatCurrency(getNumber(item.monthlyIncome)),
      },
      {
        label: "Work experience",
        value: item.workExperience
          ? `${item.workExperience} years`
          : "Not shared",
      },
    ],
    amount,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.createdAt,
    href: "/application-status",
  };
};

const normalizeInsuranceApplication = (
  item: AccountInsuranceQuery,
): AccountApplication => {
  const status = normalizeLabel(item.status || "submitted");
  const product = `${normalizeLabel(item.typeOfInsurance, "Insurance")} Plan`;
  const location = [item.city, item.state].filter(Boolean).join(", ");
  const reference =
    firstValue(
      item.insuranceId,
      item.queryId,
      item._id ? item._id.slice(-8).toUpperCase() : "",
    ) || "Insurance";

  return {
    id: `insurance-${item._id}`,
    sourceId: item._id,
    reference,
    category: "insurance",
    title: product,
    subtitle: "Insurance application",
    status,
    statusKey: status.toLowerCase(),
    stage: status,
    assignedTo: getAssigneeName(item.assignedAgent, item.assignedLander),
    chatKind: "insurance",
    tags: ["Insurance", product, status].filter(Boolean),
    detailFields: [
      { label: "Reference ID", value: reference },
      { label: "Product", value: product },
      {
        label: "Annual income",
        value: formatCurrency(getNumber(item.annualIncome)),
      },
      {
        label: "Applicant",
        value: firstValue(item.firstName, item.lastName) || "Applicant",
      },
      { label: "Mobile", value: item.mobile || "Not shared" },
      { label: "Email", value: item.email || "Not shared" },
      { label: "Location", value: location || "Not shared" },
      {
        label: "Assigned to",
        value: getAssigneeName(item.assignedAgent, item.assignedLander),
      },
    ],
    amount: getNumber(item.annualIncome),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.createdAt,
    href: "/application-status",
  };
};

const normalizeServiceApplication = (
  item: ServiceRequestRecord,
): AccountApplication => {
  const isGst = item.serviceType === "gst_registration";
  const status = normalizeLabel(
    item.status || item.currentStage || "submitted",
  );
  return {
    id: `service-${item._id}`,
    sourceId: item._id,
    reference: item.queryId || item._id.slice(-8).toUpperCase(),
    category: "service",
    title: isGst ? "GST Registration" : "ITR Filing",
    subtitle: item.businessName || item.email || "Service request",
    status,
    statusKey: status.toLowerCase(),
    stage: item.currentStage || status,
    assignedTo: item.assignedExecutive || "Fintaraa expert",
    updatedBy: item.timeline?.findLast?.((entry) => entry.updatedBy)?.updatedBy,
    tags: ["Service", isGst ? "GST" : "ITR", status].filter(Boolean),
    timeline: item.timeline,
    detailFields: [
      { label: "Query ID", value: item.queryId || "Pending" },
      { label: "Service", value: isGst ? "GST Registration" : "ITR Filing" },
      { label: "Applicant", value: item.name || "Applicant" },
      { label: "Mobile", value: item.mobile || "Not shared" },
      { label: "Email", value: item.email || "Not shared" },
      { label: "Business name", value: item.businessName || "Not shared" },
      { label: "State", value: item.state || "Not shared" },
      {
        label: "Assigned executive",
        value: item.assignedExecutive || "Pending assignment",
      },
    ],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.createdAt,
    href: isGst ? "/gst-registration" : "/itr-filing",
  };
};

const normalizeOffer = (
  card: CreditCardProduct,
  user?: CurrentUser | null,
): AccountOffer => {
  const annualIncome = getUserAnnualIncome(user);
  const creditScore = getUserCreditScore(user);
  const minimumIncome = getNumber(card.minimumIncome);
  const requiredScore = getNumber(card.creditScoreRequirement);
  const incomePass =
    minimumIncome === undefined ||
    annualIncome === undefined ||
    annualIncome >= minimumIncome;
  const scorePass =
    requiredScore === undefined ||
    creditScore === undefined ||
    creditScore >= requiredScore;
  const hasProfileSignal =
    annualIncome !== undefined || creditScore !== undefined;
  const profileMatch = hasProfileSignal ? incomePass && scorePass : false;

  return {
    id: card._id || card.id || card.name,
    title: card.name || card.title || "Credit Card",
    bank: card.bankName || "Partner Bank",
    image: card.image,
    type: card.cardType || card.type || "Credit Card",
    network: card.cardNetwork || "Network varies",
    reward:
      card.welcomeBenefits ||
      card.cashbackDetails ||
      card.rewardStructure ||
      "Benefits available after bank approval.",
    welcomeBenefit: card.welcomeBenefits || "Welcome benefits available",
    tags: Array.from(
      new Set([card.cardType, card.rewardsType].filter(Boolean)),
    ) as string[],
    benefits: [
      card.welcomeBenefits,
      card.rewardStructure,
      card.cashbackDetails,
      ...(card.featuresList || []),
    ]
      .filter(Boolean)
      .slice(0, 3) as string[],
    annualFee: getNumber(card.annualFee),
    minimumIncome,
    creditScore: requiredScore,
    featured: Boolean(card.featured),
    profileMatch,
    matchLabel: hasProfileSignal
      ? profileMatch
        ? "Profile match"
        : "Review eligibility"
      : "Complete profile",
    href: card.applyUrl || card.link || "/credit-cards",
  };
};

function AccountPanelToolbar({
  search,
  onSearch,
  children,
}: {
  search: string;
  onSearch: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_auto] xl:items-center">
      <label className="relative block mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#667085]" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by product, bank, reference, or status"
          className="h-12 w-full rounded-2xl border border-[#d9e6f2] bg-[#f8fbff] pl-11 pr-4 text-[14px] font-semibold text-[#07162d] outline-none transition placeholder:text-[#98a2b3] focus:border-[#195585] focus:bg-white focus:ring-4 focus:ring-[#195585]/10"
        />
      </label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SoftSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#667085]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-[#d9e6f2] bg-white px-3 text-[13px] font-extrabold text-[#07162d] outline-none transition focus:border-[#195585] focus:ring-4 focus:ring-[#195585]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-[#e4edf5] bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.04)]"
        >
          <div className="h-4 w-28 animate-pulse rounded-full bg-[#e4edf5]" />
          <div className="mt-4 h-7 w-2/5 animate-pulse rounded-full bg-[#e4edf5]" />
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((__, itemIndex) => (
              <div
                key={itemIndex}
                className="h-16 animate-pulse rounded-2xl bg-[#f2f6fb]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type ApplicationTimelineStep = {
  label: string;
  description: string;
  status: "pending" | "active" | "completed" | "blocked";
  updatedBy?: string;
  updatedAt?: string;
};

const getApplicationAccent = (category: AccountApplication["category"]) => {
  if (category === "loan") return "from-[#0c2340] to-[#1d3557]";
  if (category === "insurance") return "from-[#063b48] to-[#0f766e]";
  return "from-[#11284a] to-[#195585]";
};

function ApplicationCategoryIcon({
  category,
  className,
}: {
  category: AccountApplication["category"];
  className?: string;
}) {
  if (category === "loan") return <IndianRupee className={className} />;
  if (category === "insurance") return <ShieldCheck className={className} />;
  return <BriefcaseBusiness className={className} />;
}

const getTimelineIndex = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("complete") || normalized.includes("disbursed")) {
    return 5;
  }
  if (
    normalized.includes("approved") ||
    normalized.includes("reject") ||
    normalized.includes("sanction") ||
    normalized.includes("decision")
  ) {
    return 4;
  }
  if (
    normalized.includes("verification") ||
    normalized.includes("verified") ||
    normalized.includes("filed") ||
    normalized.includes("processing")
  ) {
    return 3;
  }
  if (normalized.includes("document")) return 2;
  if (
    normalized.includes("review") ||
    normalized.includes("assigned") ||
    normalized.includes("pending")
  ) {
    return 1;
  }
  return 0;
};

const buildApplicationTimeline = (
  application: AccountApplication,
): ApplicationTimelineStep[] => {
  if (application.timeline?.length) {
    return application.timeline.map((item) => ({
      label: normalizeLabel(item.stage),
      description: item.remarks || "Status updated by the Fintaraa team.",
      status: item.status,
      updatedBy: item.updatedBy,
      updatedAt: item.updatedAt,
    }));
  }

  const currentIndex = getTimelineIndex(application.status);
  const labels =
    application.category === "insurance"
      ? [
          "Application Submitted",
          "Risk Review",
          "Document Check",
          "Insurer Processing",
          "Policy Decision",
          "Completed",
        ]
      : application.category === "service"
        ? [
            "Request Submitted",
            "Expert Assigned",
            "Document Review",
            "Processing",
            "Final Review",
            "Completed",
          ]
        : [
            "Application Submitted",
            "Profile Review",
            "Document Check",
            "Lender Processing",
            "Approval Decision",
            "Completed",
          ];

  return labels.map((label, index) => ({
    label,
    status:
      application.statusKey.includes("reject") && index === currentIndex
        ? "blocked"
        : index < currentIndex
          ? "completed"
          : index === currentIndex
            ? "active"
            : "pending",
    description:
      index === currentIndex
        ? `${application.status} is the current application stage.`
        : index < currentIndex
          ? "This stage has been completed."
          : "This stage will start after the previous checks are complete.",
    updatedBy:
      index <= currentIndex
        ? application.updatedBy || application.assignedTo
        : undefined,
    updatedAt: index <= currentIndex ? application.updatedAt : undefined,
  }));
};

function ApplicationDetailsModal({
  application,
  onClose,
}: {
  application: AccountApplication;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<AccountChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [chatLoading, setChatLoading] = useState(Boolean(application.chatKind));
  const [sending, setSending] = useState(false);
  const timeline = useMemo(
    () => buildApplicationTimeline(application),
    [application],
  );

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      if (!application.chatKind) {
        setChatLoading(false);
        setChatStatus(
          "Chat will be enabled after this service request is assigned.",
        );
        return;
      }

      setChatLoading(true);
      setChatStatus("");
      try {
        const result = await fetchAccountApplicationMessages(
          application.chatKind,
          application.sourceId,
        );
        if (!active) return;
        setMessages(result);
      } catch {
        if (!active) return;
        setMessages([]);
        setChatStatus("Unable to load chat history right now.");
      } finally {
        if (active) setChatLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [application]);

  const sendMessage = async () => {
    const text = chatDraft.trim();
    if (!text || !application.chatKind) return;
    setSending(true);
    setChatStatus("");
    try {
      const message = await sendAccountApplicationMessage(
        application.chatKind,
        application.sourceId,
        text,
      );
      setMessages((current) => [...current, message]);
      setChatDraft("");
    } catch (error) {
      setChatStatus((error as Error).message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102033]/55 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-3 border-b border-[#e2edf6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
              <ApplicationCategoryIcon
                category={application.category}
                className="h-5 w-5"
              />
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#005ca8]">
                {application.reference}
              </p>
              <h3 className="mt-1 text-[20px] font-extrabold text-[#1a1d25]">
                {application.title}
              </h3>
              <p className="mt-1 text-[12px] font-semibold text-[#64748b]">
                {application.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center self-start rounded-full border border-[#d8e3ef] text-[#64748b] transition hover:bg-[#f5f8fb] sm:self-center"
            aria-label="Close application details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-82px)] overflow-auto p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div
                className={`overflow-hidden rounded-2xl bg-linear-to-br ${getApplicationAccent(application.category)} p-5 text-white shadow-sm`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                      Current status
                    </p>
                    <h4 className="mt-2 text-[28px] font-extrabold leading-tight">
                      {application.status}
                    </h4>
                    <p className="mt-2 text-[13px] font-semibold leading-6 text-white/72">
                      Assigned to {application.assignedTo}. Last updated{" "}
                      {formatDisplayDate(application.updatedAt)}.
                    </p>
                  </div>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em]">
                    {application.category}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Amount", formatCurrency(application.amount)],
                    ["Created", formatDisplayDate(application.createdAt)],
                    ["Updated", formatDisplayDate(application.updatedAt)],
                    ["Owner", application.assignedTo],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">
                        {label}
                      </p>
                      <p className="mt-1 line-clamp-1 text-[12px] font-extrabold">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <section className="rounded-2xl border border-[#e2edf6] bg-white p-5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-[#005ca8]" />
                  <h4 className="text-[15px] font-extrabold text-[#1a1d25]">
                    Step-wise tracking
                  </h4>
                </div>
                <div className="mt-5 space-y-4">
                  {timeline.map((step, index) => {
                    const done = step.status === "completed";
                    const active = step.status === "active";
                    const blocked = step.status === "blocked";
                    return (
                      <div
                        key={`${step.label}-${index}`}
                        className="flex gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex min-h-8 min-w-8 items-center justify-center rounded-full text-[12px] font-black ring-4 ${
                              done
                                ? "bg-[#12b76a] text-white ring-[#ecfdf3]"
                                : active
                                  ? "bg-[#005ca8] text-white ring-[#e8f4ff]"
                                  : blocked
                                    ? "bg-[#f04438] text-white ring-[#fef3f2]"
                                    : "bg-[#f2f6fb] text-[#98a2b3] ring-white"
                            }`}
                          >
                            {index + 1}
                          </span>
                          {index < timeline.length - 1 ? (
                            <span className="mt-2 h-full min-h-8 w-px bg-[#e2edf6]" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1 pb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="text-[13px] font-extrabold text-[#1a1d25]">
                              {step.label}
                            </h5>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                                done
                                  ? "bg-[#ecfdf3] text-[#067647]"
                                  : active
                                    ? "bg-[#e8f4ff] text-[#005ca8]"
                                    : blocked
                                      ? "bg-[#fef3f2] text-[#b42318]"
                                      : "bg-[#f2f6fb] text-[#667085]"
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] font-semibold leading-5 text-[#667085]">
                            {step.description}
                          </p>
                          <p className="mt-1 text-[10px] text-[#98a2b3]">
                            {step.updatedBy || "Fintaraa"} ·{" "}
                            {formatDisplayDate(step.updatedAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-2xl border border-[#e2edf6] bg-[#fafcff] p-5">
                <h4 className="text-[15px] font-extrabold text-[#1a1d25]">
                  Application details
                </h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {application.detailFields.map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-[#eef3f8] bg-white p-3"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">
                        {field.label}
                      </p>
                      <p className="mt-1 text-[13px] font-extrabold text-[#1a1d25]">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[#e2edf6] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#005ca8]" />
                    <h4 className="text-[15px] font-extrabold text-[#1a1d25]">
                      Application chat
                    </h4>
                  </div>
                  <span className="rounded-full bg-[#f2f6fb] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#667085]">
                    {application.chatKind ? "Live" : "Support"}
                  </span>
                </div>

                <div className="mt-4 flex h-64 flex-col rounded-xl border border-[#edf3f8] bg-[#fafcff]">
                  <div className="flex-1 space-y-3 overflow-auto p-3">
                    {chatLoading ? (
                      <div className="flex items-center gap-2 text-[12px] font-bold text-[#005ca8]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading chat...
                      </div>
                    ) : messages.length ? (
                      messages.map((message, index) => {
                        const mine = message.senderModel === "User";
                        return (
                          <div
                            key={message._id || message.id || index}
                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[82%] rounded-2xl px-3 py-2 ${
                                mine
                                  ? "bg-[#005ca8] text-white"
                                  : "bg-white text-[#1a1d25] ring-1 ring-[#e2edf6]"
                              }`}
                            >
                              <p className="text-[12px] font-semibold leading-5">
                                {message.text || "Attachment"}
                              </p>
                              <p
                                className={`mt-1 text-[10px] font-bold ${
                                  mine ? "text-white/65" : "text-[#98a2b3]"
                                }`}
                              >
                                {message.sender?.name || "Fintaraa"} ·{" "}
                                {formatDisplayDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-xl bg-white p-3 text-[12px] font-semibold leading-5 text-[#667085] ring-1 ring-[#edf3f8]">
                        {application.chatKind
                          ? "No messages yet. Send your first update or question to the assigned team."
                          : "Chat is not connected for this service request yet. Your assigned executive details will appear here after assignment."}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#edf3f8] p-3">
                    {chatStatus ? (
                      <p className="mb-2 text-[11px] font-bold text-[#b54708]">
                        {chatStatus}
                      </p>
                    ) : null}
                    <div className="flex gap-2">
                      <input
                        value={chatDraft}
                        onChange={(event) => setChatDraft(event.target.value)}
                        disabled={!application.chatKind || sending}
                        placeholder={
                          application.chatKind
                            ? "Type your message..."
                            : "Chat will be available after assignment"
                        }
                        className="h-10 min-w-0 flex-1 rounded-lg border border-[#d8e3ef] px-3 text-[12px] font-semibold outline-none focus:border-[#005ca8] focus:ring-4 focus:ring-[#005ca8]/10 disabled:bg-[#f8fafc]"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void sendMessage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => void sendMessage()}
                        disabled={
                          !application.chatKind || !chatDraft.trim() || sending
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#005ca8] text-white disabled:cursor-not-allowed disabled:bg-[#9db9d1]"
                        aria-label="Send message"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountApplicationsPanel() {
  const [records, setRecords] = useState<AccountApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AccountApplicationCategory>("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");
  const [selectedApplication, setSelectedApplication] =
    useState<AccountApplication | null>(null);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      if (!active) return;
      setLoading(true);
      setError("");

      const settled = await Promise.allSettled([
        fetchAccountLoanApplications(),
        fetchAccountInsuranceApplications(),
        fetchServiceRequestHistory({ serviceType: "gst_registration" }),
        fetchServiceRequestHistory({ serviceType: "itr_filing" }),
      ]);

      if (!active) return;

      const loans =
        settled[0].status === "fulfilled"
          ? settled[0].value.map(normalizeLoanApplication)
          : [];
      const insurance =
        settled[1].status === "fulfilled"
          ? settled[1].value.map(normalizeInsuranceApplication)
          : [];
      const gst =
        settled[2].status === "fulfilled"
          ? settled[2].value.map(normalizeServiceApplication)
          : [];
      const itr =
        settled[3].status === "fulfilled"
          ? settled[3].value.map(normalizeServiceApplication)
          : [];

      setRecords([...loans, ...insurance, ...gst, ...itr]);
      setError(
        settled.some((result) => result.status === "rejected")
          ? "Some application records could not be loaded. Showing available data."
          : "",
      );
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const statusOptions = useMemo(() => {
    const unique = Array.from(
      new Set(records.map((record) => record.statusKey)),
    );
    return [
      { label: "All statuses", value: "all" },
      ...unique.map((value) => ({ label: normalizeLabel(value), value })),
    ];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter((record) => {
        const matchesCategory =
          category === "all" || record.category === category;
        const matchesStatus = status === "all" || record.statusKey === status;
        const haystack = [
          record.reference,
          record.title,
          record.subtitle,
          record.status,
          record.stage,
          record.assignedTo,
        ]
          .join(" ")
          .toLowerCase();
        return (
          matchesCategory &&
          matchesStatus &&
          (!query || haystack.includes(query))
        );
      })
      .sort((a, b) => {
        if (sort === "oldest")
          return dateValue(a.createdAt) - dateValue(b.createdAt);
        if (sort === "amount") return (b.amount || 0) - (a.amount || 0);
        return (
          dateValue(b.updatedAt || b.createdAt) -
          dateValue(a.updatedAt || a.createdAt)
        );
      });
  }, [category, records, search, sort, status]);

  const counts = useMemo(
    () => ({
      all: records.length,
      loan: records.filter((record) => record.category === "loan").length,
      insurance: records.filter((record) => record.category === "insurance")
        .length,
      service: records.filter((record) => record.category === "service").length,
    }),
    [records],
  );

  return (
    <div className="grid gap-6 mt-4">
      <div className="rounded-3xl border border-[#dce9f6] bg-[#f8fbff] p-5 shadow-[0_18px_50px_rgba(25,85,133,0.07)] md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white text-[#195585] shadow-[0_14px_30px_rgba(25,85,133,0.08)]">
              <FileSearch className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#195585]">
                Application command center
              </p>
              <h3 className="mt-2 text-[20px] font-extrabold text-[#07162d] md:text-[24px]">
                Track every submitted request in one place
              </h3>
              <p className="text-[14px] text-[#667085]">
                Review loan, insurance, GST, and ITR activity with clear status,
                assigned owner, latest update, and next tracking entry.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(25,85,133,0.18)] transition hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["All", counts.all, FileSearch],
              ["Loans", counts.loan, IndianRupee],
              ["Insurance", counts.insurance, ShieldCheck],
              ["Services", counts.service, BriefcaseBusiness],
            ] satisfies Array<[string, number, LucideIcon]>
          ).map(([label, value, Icon]) => (
            <div
              key={String(label)}
              className="rounded-2xl bg-white p-4 ring-1 ring-[#e4edf5]"
            >
              <Icon className="h-5 w-5 text-[#195585]" />
              <p className="mt-3 text-[24px] font-extrabold text-[#07162d]">
                {String(value).padStart(2, "0")}
              </p>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AccountPanelToolbar search={search} onSearch={setSearch}>
        <SoftSelect
          label="Category"
          value={category}
          onChange={(value) => setCategory(value as AccountApplicationCategory)}
          options={[
            { label: "All categories", value: "all" },
            { label: "Loans", value: "loan" },
            { label: "Insurance", value: "insurance" },
            { label: "GST & ITR", value: "service" },
          ]}
        />
        <SoftSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
        <SoftSelect
          label="Sort"
          value={sort}
          onChange={setSort}
          options={[
            { label: "Latest updated", value: "latest" },
            { label: "Oldest first", value: "oldest" },
            { label: "Highest amount", value: "amount" },
          ]}
        />
      </AccountPanelToolbar>

      {error ? (
        <div className="rounded-2xl border border-[#fedf89] bg-[#fffaeb] px-4 py-3 text-[13px] font-bold text-[#b54708]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingCards />
      ) : filteredRecords.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecords.map((record) => {
            const timeline = buildApplicationTimeline(record);
            const activeStep =
              timeline.find((step) => step.status === "active") ||
              timeline.find((step) => step.status === "blocked") ||
              timeline.at(-1);
            return (
              <article
                key={record.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e2edf6] bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div>
                  <div className="flex h-7 items-center justify-between gap-2">
                    <span className="truncate text-[12px] font-black text-[#005ca8]">
                      {record.reference}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusTone(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div
                    className={`relative mt-3 flex h-28 w-full flex-col justify-between overflow-hidden rounded-xl bg-linear-to-br ${getApplicationAccent(record.category)} p-3 text-white shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                        {record.category} application
                      </div>
                      <ApplicationCategoryIcon
                        category={record.category}
                        className="h-4 w-4 text-white/85"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-[8px] tracking-widest opacity-80">
                        REF {record.reference}
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="font-mono text-[7px] uppercase opacity-50">
                          {record.category}
                        </div>
                        <div className="max-w-[58%] truncate text-right text-[11px] font-black italic tracking-wide opacity-90">
                          {record.stage}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="mt-4 min-h-10 text-[14px] font-bold leading-snug text-[#1a1d24]">
                    {record.title}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[12px] font-medium text-[#7a869a]">
                    {record.subtitle}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {record.tags.slice(0, 3).map((tag) => (
                      <span
                        key={`${record.id}-${tag}`}
                        className="rounded-md bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-bold text-[#4f46e5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2 border-b border-[#f3f7fa] pb-4">
                    {[
                      `Current: ${activeStep?.label || record.stage}`,
                      `Assigned: ${record.assignedTo}`,
                      `Updated: ${formatDisplayDate(record.updatedAt)}`,
                    ].map((item) => (
                      <li
                        key={`${record.id}-${item}`}
                        className="flex items-start gap-1.5 text-[12px] font-medium text-[#4a5568]"
                      >
                        <span className="mt-0.5 text-[10px] text-[#a0aec0]">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="my-3 grid grid-cols-2 gap-2 rounded-xl border border-[#f0f4f8] bg-[#fafcfe] py-3 text-center">
                    <div>
                      <span className="block text-[13px] font-bold text-[#1a1d24]">
                        {formatCurrency(record.amount)}
                      </span>
                      <span className="text-[10px] font-medium text-[#7a869a]">
                        Amount
                      </span>
                    </div>
                    <div className="border-l border-[#eef2f6]">
                      <span className="block text-[13px] font-bold text-[#1a1d24]">
                        {
                          timeline.filter((step) => step.status === "completed")
                            .length
                        }
                        /{timeline.length}
                      </span>
                      <span className="text-[10px] font-medium text-[#7a869a]">
                        Steps Done
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 text-left">
                    <div className="line-clamp-1 text-[12px] font-bold text-[#005ca8]">
                      {activeStep?.description || "Track every status update."}
                    </div>
                    <div className="text-[10px] font-medium text-[#9aa5b5]">
                      Current Tracking Note
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(record)}
                        className="rounded-lg border border-[#005ca8] bg-white py-2 text-center text-[12px] font-bold text-[#005ca8] transition-colors hover:bg-[#f4f9ff]"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(record)}
                        className="rounded-lg bg-[#005ca8] py-2 text-center text-[12px] font-bold text-white shadow-xs transition-colors hover:bg-[#004b87]"
                      >
                        Chat
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedApplication(record)}
                      className="block w-full pt-1 text-center text-[11px] font-bold text-[#005ca8] hover:underline"
                    >
                      View step-wise tracking
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e4edf5] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <FileSearch className="mx-auto h-10 w-10 text-[#195585]" />
          <h3 className="mt-5 text-[24px] font-extrabold text-[#07162d]">
            No applications match these filters
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] font-semibold leading-7 text-[#667085]">
            Submitted loans, insurance applications, GST requests, and ITR
            filing requests will appear here automatically. Adjust filters or
            start a new application.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-extrabold text-white no-underline"
          >
            Browse products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {selectedApplication ? (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      ) : null}
    </div>
  );
}

function OfferLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-[#005ca8] py-2 text-center text-[12px] font-bold text-white no-underline shadow-xs transition-colors hover:bg-[#004b87]"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg bg-[#005ca8] py-2 text-center text-[12px] font-bold text-white no-underline shadow-xs transition-colors hover:bg-[#004b87]"
    >
      {children}
    </Link>
  );
}

function MyOffersPanel() {
  const [reloadKey] = useState(0);
  const { user } = useCurrentUser();
  const [error, setError] = useState("");
  const [bank, setBank] = useState("all");
  const [search, setSearch] = useState("");
  const [match, setMatch] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cardType, setCardType] = useState("all");
  const [offers, setOffers] = useState<AccountOffer[]>([]);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      if (!active) return;
      setLoading(true);
      setError("");
      try {
        const cards = await fetchCreditCards();
        if (!active) return;
        setOffers(cards.map((card) => normalizeOffer(card, user)));
      } catch {
        if (!active) return;
        setOffers([]);
        setError("Offers could not be loaded right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [reloadKey, user]);

  const bankOptions = useMemo(
    () => [
      { label: "All banks", value: "all" },
      ...Array.from(new Set(offers.map((offer) => offer.bank))).map(
        (value) => ({
          label: value,
          value,
        }),
      ),
    ],
    [offers],
  );

  const typeOptions = useMemo(
    () => [
      { label: "All cards", value: "all" },
      ...Array.from(new Set(offers.map((offer) => offer.type))).map(
        (value) => ({
          label: value,
          value,
        }),
      ),
    ],
    [offers],
  );

  const filteredOffers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return offers
      .filter((offer) => {
        const matchesBank = bank === "all" || offer.bank === bank;
        const matchesType = cardType === "all" || offer.type === cardType;
        const matchesMode =
          match === "all" ||
          (match === "profile" && offer.profileMatch) ||
          (match === "featured" && offer.featured) ||
          (match === "no-fee" && offer.annualFee === 0);
        const haystack = [
          offer.title,
          offer.bank,
          offer.type,
          offer.network,
          offer.reward,
          offer.matchLabel,
        ]
          .join(" ")
          .toLowerCase();
        return (
          matchesBank &&
          matchesType &&
          matchesMode &&
          (!query || haystack.includes(query))
        );
      })
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [bank, cardType, match, offers, search]);

  return (
    <div className="grid gap-6 mt-4">
      <AccountPanelToolbar search={search} onSearch={setSearch}>
        <SoftSelect
          label="Bank"
          value={bank}
          onChange={setBank}
          options={bankOptions}
        />
        <SoftSelect
          label="Card type"
          value={cardType}
          onChange={setCardType}
          options={typeOptions}
        />
        <SoftSelect
          label="Show"
          value={match}
          onChange={setMatch}
          options={[
            { label: "All offers", value: "all" },
            { label: "Profile matches", value: "profile" },
            { label: "Featured", value: "featured" },
            { label: "No annual fee", value: "no-fee" },
          ]}
        />
      </AccountPanelToolbar>

      {error ? (
        <div className="rounded-2xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-[13px] font-bold text-[#b42318]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingCards />
      ) : filteredOffers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer) => (
            <article
              key={offer.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e2edf6] bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div>
                <div className="flex h-7 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {offer.image ? (
                      <BankLogoImage
                        src={offer.image}
                        alt={offer.bank}
                        className="h-6 w-auto max-w-24 object-contain"
                      />
                    ) : null}
                    <span className="truncate text-[12px] font-black text-[#005ca8]">
                      {offer.bank}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${
                      offer.profileMatch
                        ? "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]"
                        : "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]"
                    }`}
                  >
                    {offer.matchLabel}
                  </span>
                </div>

                <div className="relative mt-3 flex h-28 w-full flex-col justify-between overflow-hidden rounded-xl bg-linear-to-br from-[#0c2340] to-[#1d3557] p-3 text-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                      {offer.bank}
                    </div>
                    {offer.featured ? (
                      <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    ) : (
                      <div className="h-3.5 w-5 rounded-xs bg-amber-400/80" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-[8px] tracking-widest opacity-80">
                      **** **** **** 8832
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="font-mono text-[7px] opacity-50">
                        {offer.type || "CREDIT"}
                      </div>
                      <div className="text-[11px] font-black italic tracking-wide opacity-90">
                        {offer.network || "CARD"}
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="mt-4 min-h-10 text-[14px] font-bold leading-snug text-[#1a1d24]">
                  {offer.title}
                </h4>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(offer.tags.length ? offer.tags : [offer.type]).map(
                    (tag) => (
                      <span
                        key={`${offer.id}-${tag}`}
                        className="rounded-md bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-bold text-[#4f46e5]"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>

                <ul className="mt-4 space-y-2 border-b border-[#f3f7fa] pb-4">
                  {(offer.benefits.length
                    ? offer.benefits
                    : [offer.reward]
                  ).map((benefit) => (
                    <li
                      key={`${offer.id}-${benefit}`}
                      className="flex items-start gap-1.5 text-[12px] font-medium text-[#4a5568]"
                    >
                      <span className="mt-0.5 text-[10px] text-[#a0aec0]">
                        •
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="my-3 grid grid-cols-2 gap-2 rounded-xl border border-[#f0f4f8] bg-[#fafcfe] py-3 text-center">
                  <div>
                    <span className="block text-[13px] font-bold text-[#1a1d24]">
                      {formatCurrency(offer.annualFee)}
                    </span>
                    <span className="text-[10px] font-medium text-[#7a869a]">
                      Annual Fee
                    </span>
                  </div>
                  <div className="border-l border-[#eef2f6]">
                    <span className="block text-[13px] font-bold text-[#1a1d24]">
                      {offer.type || "Rewards"}
                    </span>
                    <span className="text-[10px] font-medium text-[#7a869a]">
                      Card Type
                    </span>
                  </div>
                </div>

                <div className="mb-4 text-left">
                  <div className="line-clamp-1 text-[12px] font-bold text-[#005ca8]">
                    {offer.welcomeBenefit}
                  </div>
                  <div className="text-[10px] font-medium text-[#9aa5b5]">
                    Welcome Benefit
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/credit-cards"
                      className="rounded-lg border border-[#005ca8] bg-white py-2 text-center text-[12px] font-bold text-[#005ca8] no-underline transition-colors hover:bg-[#f4f9ff]"
                    >
                      View Details
                    </Link>
                    <OfferLink href={offer.href}>Apply Now</OfferLink>
                  </div>
                  <Link
                    href="/credit-cards"
                    className="block w-full pt-1 text-center text-[11px] font-bold text-[#005ca8] no-underline hover:underline"
                  >
                    View Eligibility
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e4edf5] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <Gift className="mx-auto h-10 w-10 text-[#195585]" />
          <h3 className="mt-5 text-[24px] font-extrabold text-[#07162d]">
            No offers match these filters
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] font-semibold leading-7 text-[#667085]">
            Complete your profile and refresh this section to see better matched
            bank offers. You can also browse all credit cards directly.
          </p>
          <Link
            href="/credit-cards"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-extrabold text-white no-underline"
          >
            Explore credit cards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export function AccountDetailPanel({ slug = "overview" }: { slug?: string }) {
  const item = accountItemBySlug[slug];
  const title = item?.label || "Profile Overview";
  const description =
    item?.description ||
    "Manage your Fintaraa profile, applications, offers, documents, and preferences from one place.";

  return (
    <section className="bg-white/95 p-4 md:p-6">
      <div className="flex flex-col gap-4 border-b border-[#e4edf5] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
            Account workspace
          </p>
          <h2 className="mt-1 text-[30px] font-extrabold leading-tight text-[#07162d]">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[#667085]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-0">{renderPanel(slug)}</div>
    </section>
  );
}

function renderPanel(slug: string) {
  switch (slug) {
    case "edit-profile":
      return <EditProfileForm />;
    case "uploaded-documents":
      return <UploadedDocumentsPanel />;
    case "statements-letters":
      return <StatementsLettersPanel />;
    case "notification-preferences":
      return (
        <div className="grid gap-6">
          <div className="bg-linear-to-r from-[#195585] to-[#1375de] p-5 text-white">
            <Bell className="h-6 w-6 text-[#7ee3a2]" />
            <h3 className="mt-4 text-[22px] font-extrabold">
              Stay updated without noise
            </h3>
            <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-white/75">
              Choose alerts across application movement, payment reminders,
              policy communication, and security events.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              [
                "Application updates",
                "Status movement, lender requests, and document review.",
              ],
              [
                "Payment reminders",
                "EMI dates, mandate retries, and overdue nudges.",
              ],
              [
                "Policy and offers",
                "Personalised partner offers and product education.",
              ],
              [
                "Security alerts",
                "Login, consent, KYC, and account safety notices.",
              ],
            ].map(([pref, note]) => (
              <label
                key={pref}
                className="flex items-start justify-between gap-4 bg-linear-to-r from-[#f8fcff] to-white p-5"
              >
                <span className="flex gap-3">
                  <Bell className="mt-1 h-5 w-5 text-[#195585]" />
                  <span>
                    <span className="block text-[15px] font-extrabold text-[#07162d]">
                      {pref}
                    </span>
                    <span className="mt-1 block text-[12px] font-semibold leading-5 text-[#667085]">
                      {note}
                    </span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-5 w-5 shrink-0 accent-[#195585]"
                />
              </label>
            ))}
          </div>
        </div>
      );
    case "cibil-score":
      return (
        <EmptyState
          title="Credit score workbench"
          text="Your CIBIL score, score factors, report insights, and improvement actions will appear here after bureau consent."
        />
      );
    case "my-applications":
      return <AccountApplicationsPanel />;
    case "my-offers":
      return <MyOffersPanel />;
    case "emi-calculator":
      return (
        <EmptyState
          title="EMI calculator"
          text="Estimate monthly repayment, total interest, and affordability before choosing a product."
        />
      );
    case "logout":
      return <LogoutPanel />;
    default:
      return (
        <EmptyState
          title="Profile & Settings"
          text="Choose a section from the left to manage profile details, applications, offers, documents, and preferences."
        />
      );
  }
}
