"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import {
  Zap,
  Bell,
  Copy,
  Gift,
  Share2,
  Landmark,
  UserRound,
  Building2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { accountItemBySlug } from "@/data/accountProfile";
import {
  FaqPanel,
  LogoutPanel,
  PoliciesPanel,
  ContactSupportPanel,
  KnowledgeCenterPanel,
} from "@/components/account/HelpLegalPanels";
import { emitAuthChanged } from "@/lib/authEvents";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updateKycProfile, type CurrentUser } from "@/services/profile";
import { StatementsLettersPanel } from "@/components/account/StatementsLettersPanel";
import { UploadedDocumentsPanel } from "@/components/account/UploadedDocumentsPanel";

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

function ReferEarnPanel() {
  const { user } = useCurrentUser();
  const [status, setStatus] = useState("");
  const referralCode =
    String(user?.referralCode || user?.referral_code || "")
      .trim()
      .toUpperCase() || "FINTARA000";

  const getInviteLink = () => {
    if (typeof window === "undefined") return "https://fintaraa.com/login";
    return `${window.location.origin}/login?ref=${encodeURIComponent(referralCode)}`;
  };

  const getShareText = () =>
    [
      "Join Fintaraa and get started in minutes!",
      "",
      `Use my referral code ${referralCode} to explore loans, credit cards, insurance, and smarter financial tools.`,
      `Apply here: ${getInviteLink()}`,
    ].join("\n");

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setStatus("Referral code copied.");
    } catch {
      setStatus("Could not copy code. Please copy it manually.");
    }
  };

  const shareInvite = async () => {
    const text = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join Fintaraa",
          text,
          url: getInviteLink(),
        });
        setStatus("Invite shared successfully.");
        return;
      }
      await navigator.clipboard.writeText(text);
      setStatus("Invite message copied.");
    } catch {
      setStatus("Share was cancelled.");
    }
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("Opening WhatsApp share.");
  };

  return (
    <div className="grid gap-6">
      <div className="grid overflow-hidden bg-[#07162d] text-white md:grid-cols-[1fr_0.9fr]">
        <div className="p-6">
          <Gift className="h-8 w-8 text-[#7ee3a2]" />
          <h3 className="mt-5 max-w-lg text-[32px] font-extrabold leading-tight">
            Use your referral code to invite friends and earn rewards
          </h3>
          <p className="mt-3 max-w-xl text-[14px] font-semibold leading-7 text-white/72">
            Share Fintaraa with friends who need loans, cards, or insurance.
            Rewards are tracked after eligible activity and partner validation.
          </p>
        </div>
        <div className="relative min-h-64">
          <Image
            src="/assets/refer/image.png"
            alt="Refer and earn rewards"
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-dashed border-[#cfddea] p-4 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={copyReferral}
          className="flex w-fit items-center gap-3 text-left"
          aria-label="Copy referral code"
        >
          <Copy className="h-5 w-5 text-[#195585]" />
          <span className="text-[18px] font-extrabold tracking-[0.16em] text-[#07162d]">
            {referralCode}
          </span>
        </button>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={shareInvite}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#195585] px-4 text-[13px] font-extrabold text-white"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            type="button"
            onClick={shareOnWhatsApp}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0f766e] px-4 text-[13px] font-extrabold text-white shadow-[0_10px_22px_rgba(15,118,110,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0d9488]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>
      </div>

      {status ? (
        <p className="-mt-3 text-[12px] font-semibold text-[#195585]">
          {status}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Referral Rewards",
            "Rs0",
            "Amount earned after eligible referrals.",
          ],
          ["Pending Referrals", "0 invites", "Friends awaiting reward events."],
          ["Rewarded", "0 users", "Completed referrals approved for payout."],
        ].map(([title, value, note]) => (
          <div
            key={title}
            className="bg-linear-to-br from-[#f8fcff] to-white p-5"
          >
            <p className="text-[13px] font-extrabold text-[#195585]">{title}</p>
            <p className="mt-3 text-[28px] font-extrabold text-[#07162d]">
              {value}
            </p>
            <p className="mt-2 text-[12px] font-semibold leading-5 text-[#667085]">
              {note}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#f8fcff] p-5">
        <Zap className="h-5 w-5 text-[#195585]" />
        <p className="mt-3 text-[13px] font-extrabold text-[#07162d]">
          0 points earned · 0 rewarded · 1 Point = Rs1
        </p>
        <p className="mt-2 text-[12px] font-semibold leading-6 text-[#667085]">
          Rewards are subject to eligibility, successful account opening or loan
          disbursement, and Fintaraa referral terms.
        </p>
      </div>
    </div>
  );
}

export function AccountDetailPanel({ slug = "overview" }: { slug?: string }) {
  const item = accountItemBySlug[slug];
  const title = item?.label || "Profile Overview";
  const description =
    item?.description ||
    "Manage your Fintaraa profile, documents, applications, preferences, support, and legal information from one place.";

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
    case "contact-support":
      return <ContactSupportPanel />;
    case "policies":
      return <PoliciesPanel />;
    case "cibil-score":
      return (
        <EmptyState
          title="Credit score workbench"
          text="Your CIBIL score, score factors, report insights, and improvement actions will appear here after bureau consent."
        />
      );
    case "my-applications":
      return (
        <EmptyState
          title="Applications tracker"
          text="Track loan, card, and insurance applications across submitted, in-review, approved, and closed stages."
        />
      );
    case "my-offers":
      return (
        <EmptyState
          title="Saved and pre-approved offers"
          text="Eligible partner offers, saved products, and expiring offers will be organised here."
        />
      );
    case "emi-calculator":
      return (
        <EmptyState
          title="EMI calculator"
          text="Estimate monthly repayment, total interest, and affordability before choosing a product."
        />
      );
    case "refer-earn":
      return <ReferEarnPanel />;
    case "faq":
      return <FaqPanel />;
    case "knowledge-center":
      return <KnowledgeCenterPanel />;
    case "logout":
      return <LogoutPanel />;
    default:
      return (
        <EmptyState
          title="Profile & Settings"
          text="Choose a section from the left to manage account, activity, documents, preferences, support, and policies."
        />
      );
  }
}
