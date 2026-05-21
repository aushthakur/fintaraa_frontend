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
import { StatementsLettersPanel } from "@/components/account/StatementsLettersPanel";
import { UploadedDocumentsPanel } from "@/components/account/UploadedDocumentsPanel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { emitAuthChanged } from "@/lib/authEvents";
import { updateKycProfile, type CurrentUser } from "@/services/profile";

type EditProfileFieldKey =
  | "fullName"
  | "dateOfBirth"
  | "fatherName"
  | "panNumber"
  | "aadhaarNumber"
  | "email"
  | "mobile"
  | "currentAddress"
  | "city"
  | "state"
  | "pinCode"
  | "employmentType"
  | "employerName"
  | "professionOrJobTitle"
  | "monthlyIncome"
  | "workExperience"
  | "existingEmi"
  | "companyAddress"
  | "industry"
  | "accountHolderName"
  | "bankName"
  | "accountType"
  | "accountNumber"
  | "ifscCode"
  | "branchCity";

type EditProfileFormState = Record<EditProfileFieldKey, string>;

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
  employerName: "",
  professionOrJobTitle: "",
  monthlyIncome: "",
  workExperience: "",
  existingEmi: "",
  companyAddress: "",
  industry: "",
  accountHolderName: "",
  bankName: "",
  accountType: "",
  accountNumber: "",
  ifscCode: "",
  branchCity: "",
};

const cleanValue = (value: unknown) =>
  value === undefined || value === null ? "" : String(value).trim();

const firstValue = (...values: unknown[]) => {
  const match = values.find((value) => cleanValue(value));
  return cleanValue(match);
};

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

  return {
    fullName: firstValue(personal.fullName, user?.fullName, user?.name),
    dateOfBirth: firstValue(personal.dateOfBirth),
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
    currentAddress: firstValue(
      personal.address,
      address.currentAddress,
      address.address,
      address.street,
      user?.address,
    ),
    city: firstValue(personal.city, address.city, user?.city),
    state: firstValue(personal.state, address.state, user?.state),
    pinCode: firstValue(
      personal.pinCode,
      personal.pincode,
      address.pinCode,
      address.pincode,
      user?.pinCode,
      user?.pincode,
    ),
    employmentType: firstValue(
      employment.employmentType,
      employment.employerType,
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
    ),
    workExperience: firstValue(
      employment.workExperience,
      employment.businessVintage,
      employment.tenure,
    ),
    existingEmi: firstValue(employment.existingEmi, employment.emiPaid),
    companyAddress: firstValue(
      employment.companyAddress,
      employment.officeAddress,
      employment.businessAddress,
    ),
    industry: firstValue(employment.industry),
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
}: {
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-black text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold placeholder:transition-colors focus:border-transparent focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
        <span className="pointer-events-none absolute -bottom-1 left-0 h-2 w-2 scale-0 rounded-full bg-[#195585] opacity-0 transition-all duration-300 peer-focus:scale-100 peer-focus:opacity-100" />
      </div>
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
        placeholder: "DD/MM/YYYY",
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
    fields: [
      {
        key: "employmentType",
        label: "Employment type",
        placeholder: "Salaried",
      },
      {
        key: "employerName",
        label: "Employer / business name",
        placeholder: "Company name",
      },
      {
        key: "professionOrJobTitle",
        label: "Job title / profession",
        placeholder: "Product Manager",
      },
      {
        key: "monthlyIncome",
        label: "Monthly income",
        placeholder: "Rs75,000",
      },
      {
        key: "workExperience",
        label: "Work experience",
        placeholder: "5 years",
      },
      { key: "existingEmi", label: "Existing EMI", placeholder: "Rs12,000" },
      {
        key: "companyAddress",
        label: "Office / business address",
        placeholder: "Office address",
      },
      { key: "industry", label: "Industry", placeholder: "Financial services" },
    ] satisfies EditProfileField[],
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

  const saveLocalUser = (
    payload: Record<string, string | boolean | Record<string, string>>,
  ) => {
    if (typeof window === "undefined") return;
    const personalDetails = payload.personalDetails as Record<string, string>;
    const employmentDetails = payload.employmentDetails as Record<
      string,
      string
    >;
    const bankDetails = payload.bankDetails as Record<string, string>;
    const addressDetails = payload.addressDetails as Record<string, string>;
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
    setSaving(true);
    setStatus("Saving your profile securely...");

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
        currentAddress: form.currentAddress,
        address: form.currentAddress,
        city: form.city,
        state: form.state,
        country: "India",
        pinCode: form.pinCode,
        pincode: form.pinCode,
      },
      employmentDetails: {
        employmentType: form.employmentType,
        employerName: form.employerName,
        professionOrJobTitle: form.professionOrJobTitle,
        monthlyIncome: form.monthlyIncome,
        workExperience: form.workExperience,
        existingEmi: form.existingEmi,
        companyAddress: form.companyAddress,
        industry: form.industry,
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
                  className={`text-[12px] font-black uppercase tracking-[0.18em] ${
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
              <h3 className="mt-4 text-[19px] font-black">{title}</h3>
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
          ({ step, id, title, text, icon: Icon, fields }) => (
            <section key={title} id={id} className="scroll-mt-32 bg-white">
              <div className="flex flex-col gap-4 border-b border-[#e4edf5] pb-5 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#eef8ff] text-[#195585]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#195585]">
                      Step {step}
                    </p>
                    <h3 className="mt-1 text-[24px] font-black text-[#07162d]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#667085]">
                      {text}
                    </p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#079455]">
                  {loading ? "Syncing" : dirty ? "Editing" : "Synced"}
                </span>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {fields.map((field) => (
                  <FormField
                    type={"type" in field ? field.type : undefined}
                    key={field.label}
                    label={field.label}
                    value={form[field.key]}
                    placeholder={field.placeholder}
                    onChange={(value) => updateField(field.key, value)}
                  />
                ))}
              </div>
            </section>
          ),
        )}

        <div className="flex flex-col gap-3 bg-[#07162d] p-5 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[18px] font-black">Ready to update?</p>
            <p className="mt-1 text-[13px] font-semibold text-white/70">
              Review all details before saving. Partner verification may request
              supporting documents.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDraft}
              className="h-11 rounded-full bg-white/10 px-5 text-[13px] font-black text-white"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-white px-6 text-[13px] font-black text-[#195585]"
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
      <h3 className="mt-5 text-[24px] font-black text-[#07162d]">{title}</h3>
      <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
        {text}
      </p>
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
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#195585]">
            Account workspace
          </p>
          <h2 className="mt-1 text-[30px] font-black leading-tight text-[#07162d]">
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
            <h3 className="mt-4 text-[22px] font-black">
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
                    <span className="block text-[15px] font-black text-[#07162d]">
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
      return (
        <div className="grid gap-6">
          <div className="grid overflow-hidden bg-[#07162d] text-white md:grid-cols-[1fr_0.9fr]">
            <div className="p-6">
              <Gift className="h-8 w-8 text-[#7ee3a2]" />
              <h3 className="mt-5 max-w-lg text-[32px] font-black leading-tight">
                Use your referral code to invite friends and earn rewards
              </h3>
              <p className="mt-3 max-w-xl text-[14px] font-semibold leading-7 text-white/72">
                Share Fintaraa with friends who need loans, cards, or insurance.
                Rewards are tracked after eligible activity and partner
                validation.
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
            <div className="flex items-center gap-3">
              <Copy className="h-5 w-5 text-[#195585]" />
              <span className="text-[18px] font-black tracking-[0.16em] text-[#07162d]">
                FINTARA000
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex h-10 items-center gap-2 rounded-full bg-[#195585] px-4 text-[13px] font-black text-white">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0f766e] px-4 text-[13px] font-black text-white">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                "Referral Rewards",
                "Rs0",
                "Amount earned after eligible referrals.",
              ],
              [
                "Pending Referrals",
                "0 invites",
                "Friends awaiting reward events.",
              ],
              [
                "Rewarded",
                "0 users",
                "Completed referrals approved for payout.",
              ],
            ].map(([title, value, note]) => (
              <div
                key={title}
                className="bg-linear-to-br from-[#f8fcff] to-white p-5"
              >
                <p className="text-[13px] font-black text-[#195585]">{title}</p>
                <p className="mt-3 text-[28px] font-black text-[#07162d]">
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
            <p className="mt-3 text-[13px] font-black text-[#07162d]">
              0 points earned · 0 rewarded · 1 Point = Rs1
            </p>
            <p className="mt-2 text-[12px] font-semibold leading-6 text-[#667085]">
              Rewards are subject to eligibility, successful account opening or
              loan disbursement, and Fintaraa referral terms.
            </p>
          </div>
        </div>
      );
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
