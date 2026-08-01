import { Post } from "@/hooks/apiUtils";
import { buildWebsiteSourcePayload } from "@/lib/formConsent";
import { getWebsiteAttribution } from "@/services/attribution";
import type { ApplicationCategory } from "./flowRegistry";
import {
  getRequiredLoanProductMetadata,
  resolveLoanTypeForFlow,
} from "./loanProductContract";
import { buildCanonicalLoanPolicyDetails } from "./loanPolicyDetails";

type Payload = Record<string, any>;

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

type SubmittedApplicationRecord = {
  _id?: string;
  loanId?: string;
  insuranceId?: string;
  applicationId?: string;
  referenceId?: string;
};

export type ApplicationSubmissionResult = {
  referenceId: string;
  record: SubmittedApplicationRecord;
};

const insuranceTypeMap: Record<string, string> = {
  healthInsurance: "health",
  personalAccidentInsurance: "health",
  criticalIllnessInsurance: "health",
  petInsurance: "health",
  lifeInsurance: "life",
  termInsurance: "term",
  loanSurakshaInsurance: "term",
  groupInsurance: "health",
  vehicleInsurance: "vehicle",
  propertyInsurance: "property",
  shopInsurance: "shop",
  stockInsurance: "stock",
  machineInsurance: "machinery",
  machineryStockInsurance: "machinery",
  travelInsurance: "travel",
  cyberInsurance: "property",
  retirementPlanInsurance: "retirement",
};

const loanFileMap: Record<string, string> = {
  pan_card: "pan_card",
  aadhaar_card: "aadhaar_card",
  photo: "photo",
  itr_form_16: "itr_form_16",
  form_16ab: "form_16ab",
  salary_slip: "salary_slip",
  offer_letter: "offer_letter",
  relieving_letter: "relieving_letter",
  bank_statement: "bank_statement",
  gst_certificate: "gst_certificate",
  gst_returns: "gst_returns",
  shop_act: "shop_act",
  govt_license: "govt_license",
  bankStatementUrl: "bankStatementUrl",
  loanStatement: "bankStatementUrl",
  latestStatement: "bankStatementUrl",
  bankStatements: "bankStatementUrl",
  documents: "bankStatementUrl",
  salarySlipUrl: "salarySlipUrl",
  admitLetter: "admissionLetterUrl",
  admissionLetterUrl: "admissionLetterUrl",
  feeStructureUrl: "feeStructureUrl",
  rcCopyUrl: "rcCopyUrl",
  inspectionPhotos: "inspectionPhotosUrl",
  valuationSlip: "goldPhotosUrl",
  carInsuranceUrl: "carInsuranceUrl",
  lastMonthBankStatementUrl: "lastMonthBankStatementUrl",
  ownershipDocs: "propertyDocumentsUrl",
  propertyDocumentsUrl: "propertyDocumentsUrl",
  propertyOwnershipProofUrl: "propertyOwnershipProofUrl",
  plans: "renovationEstimateUrl",
  financials: "gstReturnsUrl",
  itrUrl: "itrUrl",
  gstReturnsUrl: "gstReturnsUrl",
  dpStatement: "dematStatementOrFdCopyUrl",
  proformaInvoiceOrQuotationUrl: "proformaInvoiceOrQuotationUrl",
  businessRegistrationCertificateUrl: "businessRegistrationCertificateUrl",
  inspectionPhotosUrl: "inspectionPhotosUrl",
  landDocs: "landDocumentsUrl",
  landDocumentsUrl: "landDocumentsUrl",
};

const insuranceFileMap: Record<string, string> = {
  kycDocs: "kycDocumentUrl",
  kycDocumentUrl: "kycDocumentUrl",
  healthReports: "healthReports",
  medicalReports: "medicalReports",
  medicalReportUpload: "medicalReportUpload",
  rcUpload: "rcBookUpload",
  rcBookUpload: "rcBookUpload",
  drivingLicenseUpload: "drivingLicenseUpload",
  ownershipDocs: "propertyDocuments",
  propertyDocuments: "propertyDocuments",
  stockValuationReport: "stockValuationReport",
  purchaseInvoice: "purchaseInvoice",
  maintenanceRecord: "maintenanceRecord",
  panKycProof: "panKycProof",
  shopLicense: "shopLicense",
  gstCertificate: "gstCertificate",
};

const toNumber = (value: any) => {
  if (value === null || value === undefined) return undefined;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (!cleaned) return undefined;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : undefined;
};

const normalizeName = (fullName?: string) => {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "Applicant";
  const lastName = parts.join(" ") || "User";
  return { firstName, lastName };
};

const normalizeDateOfBirth = (values: Payload) => {
  const provided = values.dateOfBirth || values.dob;
  if (provided) {
    const raw = String(provided).trim();
    const dayFirstMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const parsed = dayFirstMatch
      ? new Date(
          Date.UTC(
            Number(dayFirstMatch[3]),
            Number(dayFirstMatch[2]) - 1,
            Number(dayFirstMatch[1]),
          ),
        )
      : new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  const age = toNumber(values.applicantAge || values.age || values.currentAge);
  if (!age || age < 1 || age > 120) return undefined;
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear() - age, 0, 1)).toISOString();
};

const normalizeLoanEmploymentType = (value: unknown) => {
  const token = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (token === "salaried" || token === "salary") return "salaried";
  if (token.includes("professional")) {
    return token.includes("nonprofessional")
      ? "self_employed_non_professional"
      : "self_employed_professional";
  }
  if (
    token === "self" ||
    token.includes("selfemployed") ||
    token.includes("freelance") ||
    token.includes("business")
  ) {
    return "self_employed";
  }
  return value;
};

const removeEmpty = (input: Payload) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );

const isFileArray = (value: unknown): value is File[] =>
  typeof File !== "undefined" &&
  Array.isArray(value) &&
  value.every((item) => item instanceof File);

const serializeForPolicyDetails = (value: unknown): unknown => {
  if (typeof File !== "undefined" && value instanceof File) {
    return { name: value.name, size: value.size, type: value.type };
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => serializeForPolicyDetails(item))
      .filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    return removeEmpty(
      Object.fromEntries(
        Object.entries(value as Payload).map(([key, item]) => [
          key,
          serializeForPolicyDetails(item),
        ]),
      ),
    );
  }
  return value;
};

const rootApplicationFields = new Set([
  "status",
  "dataSource",
  "fullName",
  "name",
  "firstName",
  "lastName",
  "phone",
  "mobile",
  "email",
  "applicantAge",
  "age",
  "currentAge",
  "gender",
  "marriedStatus",
  "maritalStatus",
  "pan",
  "panNumber",
  "aadhaar",
  "aadhaarNumber",
  "address",
  "fullAddress",
  "street",
  "propertyAddress",
  "city",
  "state",
  "pincode",
  "pinCode",
  "employmentType",
  "employment",
  "jobType",
  "companyName",
  "employerName",
  "businessName",
  "monthlyIncome",
  "netIncome",
  "income",
  "salary",
  "annualIncome",
  "workExperience",
  "experience",
  "officeAddress",
  "companyAddress",
  "bankName",
  "accountType",
  "accountNumber",
  "ifscCode",
  "nomineeName",
  "nominee",
  "nomineeRelation",
  "occupation",
  "kycDocumentType",
  "loanAmount",
  "amount",
  "requestedAmount",
  "whatsappConsent",
  "communicationConsent",
  "rcLookup",
  "source",
  "platform",
  "sourcePlatform",
  "formSource",
]);

const buildPolicyDetails = (values: Payload, extra: Payload = {}) =>
  removeEmpty(
    Object.fromEntries(
      Object.entries({ ...values, ...extra })
        .filter(
          ([key, value]) =>
            !rootApplicationFields.has(key) &&
            !key.startsWith("__") &&
            !isFileArray(value),
        )
        .map(([key, value]) => [key, serializeForPolicyDetails(value)]),
    ),
  );

const appendPayload = (
  formData: FormData,
  key: string,
  value: unknown,
) => {
  if (value === undefined || value === null) return;
  if (typeof value === "object") formData.append(key, JSON.stringify(value));
  else formData.append(key, String(value));
};

const appendFiles = (
  formData: FormData,
  values: Payload,
  category: ApplicationCategory,
) => {
  const fileMap = category === "insurance" ? insuranceFileMap : loanFileMap;
  Object.entries(values).forEach(([key, value]) => {
    if (!isFileArray(value)) return;
    const uploadKey = fileMap[key];
    if (!uploadKey) return;
    value.forEach((file) => formData.append(uploadKey, file));
  });
};

const humanizeDocumentKey = (value: string) =>
  value
    .replace(/^__catalogLoanDocument:/, "Document ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const appendInsuranceFiles = (formData: FormData, values: Payload) => {
  const catalogMetadata =
    values.__loanDocumentCatalogMeta &&
    typeof values.__loanDocumentCatalogMeta === "object"
      ? values.__loanDocumentCatalogMeta
      : {};
  const manifest: Array<{
    key: string;
    label: string;
    catalogId?: string;
    catalogKey?: string;
    fileCount: number;
  }> = [];
  let remainingFiles = 50;

  Object.entries(values).forEach(([key, value]) => {
    if (!isFileArray(value) || key.startsWith("__") || remainingFiles <= 0) {
      return;
    }
    const selectedFiles = value.slice(0, remainingFiles);
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file) =>
      formData.append("insuranceDocuments", file),
    );
    const rawMeta = catalogMetadata[key];
    const meta =
      rawMeta && typeof rawMeta === "object"
        ? (rawMeta as Record<string, unknown>)
        : {};
    manifest.push({
      key: meta.key ? String(meta.key) : key,
      label: meta.label ? String(meta.label) : humanizeDocumentKey(key),
      catalogId: meta.id ? String(meta.id) : undefined,
      catalogKey: meta.key ? String(meta.key) : undefined,
      fileCount: selectedFiles.length,
    });
    remainingFiles -= selectedFiles.length;
  });

  if (manifest.length) {
    formData.append("insuranceDocumentManifest", JSON.stringify(manifest));
  }
};

const appendCatalogFiles = (formData: FormData, values: Payload) => {
  const storedMetadata =
    values.__loanDocumentCatalogMeta &&
    typeof values.__loanDocumentCatalogMeta === "object"
      ? values.__loanDocumentCatalogMeta
      : {};
  const metadata = {
    ...storedMetadata,
    ...(isFileArray(values.cibil_report) &&
    !Object.prototype.hasOwnProperty.call(storedMetadata, "cibil_report")
      ? {
          cibil_report: {
            key: "cibil_report",
            label: "CIBIL Report",
          },
        }
      : {}),
  };
  const manifest: Array<{
    id?: string;
    key?: string;
    label?: string;
    fileCount: number;
  }> = [];

  Object.entries(metadata).forEach(([valueKey, rawMeta]) => {
    const files = values[valueKey];
    if (!isFileArray(files) || files.length === 0) return;
    const meta =
      rawMeta && typeof rawMeta === "object"
        ? (rawMeta as Record<string, unknown>)
        : {};

    files.forEach((file) => formData.append("catalogDocuments", file));
    manifest.push({
      id: meta.id ? String(meta.id) : undefined,
      key: meta.key ? String(meta.key) : undefined,
      label: meta.label ? String(meta.label) : undefined,
      fileCount: files.length,
    });
  });

  if (manifest.length) {
    formData.append("catalogDocumentManifest", JSON.stringify(manifest));
  }
};

const appendCoApplicantFiles = (formData: FormData, values: Payload) => {
  if (!Array.isArray(values.coApplicants) || !values.coApplicants.length) return;

  values.coApplicants.slice(0, 10).forEach((coApplicant: Payload, index: number) => {
    (["aadhaarFile", "panFile", "bankStatementFile"] as const).forEach((key) => {
      const value = coApplicant?.[key];
      if (!isFileArray(value)) return;
      value.forEach((file) => formData.append(`coApplicant_${index}_${key}`, file));
    });

    if (!Array.isArray(coApplicant?.documents)) return;
    coApplicant.documents.slice(0, 20).forEach((document: Payload, documentIndex: number) => {
      const files = document?.files;
      if (!isFileArray(files)) return;
      files.forEach((file) =>
        formData.append(`coApplicant_${index}_extra_${documentIndex}_files`, file),
      );
    });
  });
};

export const buildLoanPayload = (
  flowKey: string,
  values: Payload,
  referrer?: string,
) => {
  const { firstName, lastName } = normalizeName(values.fullName || values.name);
  const loanType = resolveLoanTypeForFlow(flowKey);
  const productMetadata = getRequiredLoanProductMetadata(flowKey);
  const source = buildWebsiteSourcePayload("website_application_flow");
  const attribution = {
    ...getWebsiteAttribution(),
    ...(referrer ? { referrer } : {}),
  };
  const policyDetails = buildCanonicalLoanPolicyDetails({
    flowKey,
    loanType,
    values,
    metadata: {
      requestedProductName:
        productMetadata?.requestedProductName || values.requestedProductName,
      requestedProductSlug:
        productMetadata?.requestedProductSlug || values.requestedProductSlug,
      productVariant: productMetadata?.productVariant || values.productVariant,
      metaFlowKey: flowKey,
    },
  });

  return removeEmpty({
    status: "submitted",
    dataSource: source.source,
    formSource: values.formSource || source.formSource,
    whatsappConsent: Boolean(values.whatsappConsent),
    communicationConsent: values.communicationConsent,
    attribution,
    dsaReferralCode: attribution.dsaReferralCode,
    rcLookup: values.rcLookup,
    loanType,
    loanAmount:
      toNumber(values.loanAmount) ||
      toNumber(values.amount) ||
      toNumber(values.requestedAmount) ||
      toNumber(values.outstanding) ||
      toNumber(values.topupAmount) ||
      toNumber(values.estimate) ||
      toNumber(values.estimatedCost) ||
      toNumber(values.wcNeed) ||
      toNumber(values.requestedCreditLimit) ||
      toNumber(values.price) ||
      toNumber(values.totalCourseFee),
    firstName,
    lastName,
    dateOfBirth: normalizeDateOfBirth(values),
    gender: values.gender,
    marriedStatus: values.marriedStatus || values.maritalStatus,
    mobile: String(values.phone || values.mobile || "").replace(/\D/g, ""),
    email: values.email,
    panNumber: values.pan || values.panNumber,
    aadhaarNumber: values.aadhaar || values.aadhaarNumber,
    street: values.address || values.street || values.propertyAddress,
    city: values.city,
    state: values.state,
    pincode: values.pincode || values.pinCode,
    employmentType: normalizeLoanEmploymentType(
      values.employmentType || values.employment || values.jobType,
    ),
    companyName: values.companyName || values.employerName || values.businessName,
    monthlyIncome:
      toNumber(values.monthlyIncome) ||
      toNumber(values.netIncome) ||
      toNumber(values.income) ||
      toNumber(values.salary),
    workExperience: toNumber(values.workExperience || values.experience),
    officeAddress: values.officeAddress || values.companyAddress,
    bankName: values.bankName,
    accountType: values.accountType,
    accountNumber: values.accountNumber,
    ifscCode: values.ifscCode,
    policyDetails,
  });
};

export const buildInsurancePayload = (
  flowKey: string,
  values: Payload,
  referrer?: string,
) => {
  const { firstName, lastName } = normalizeName(
    values.fullName || values.name || values.firstName,
  );
  const source = buildWebsiteSourcePayload("website_application_flow");
  const attribution = getWebsiteAttribution();

  return removeEmpty({
    typeOfInsurance: insuranceTypeMap[flowKey] || "health",
    status: "submitted",
    dataSource: source.source,
    formSource: values.formSource || source.formSource,
    whatsappConsent: Boolean(values.whatsappConsent),
    communicationConsent: values.communicationConsent,
    attribution,
    dsaReferralCode: attribution.dsaReferralCode,
    rcLookup: values.rcLookup,
    firstName: values.firstName || firstName,
    lastName: values.lastName || lastName,
    age: toNumber(values.applicantAge || values.age || values.currentAge),
    gender: values.gender || "other",
    mobile: String(values.mobile || values.phone || "").replace(/\D/g, ""),
    email: values.email,
    fullAddress: values.address || values.fullAddress || values.propertyAddress,
    pincode: values.pincode || values.pinCode,
    city: values.city,
    state: values.state,
    nomineeName: values.nomineeName || values.nominee,
    nomineeRelation: values.nomineeRelation,
    occupation: values.occupation || "not_provided",
    annualIncome:
      toNumber(values.income) ||
      toNumber(values.annualIncome) ||
      toNumber(values.salary),
    kycDocumentType: (values.kycDocumentType || "pan").toLowerCase(),
    kycDocumentUrl: "pending_upload",
    policyDetails: buildPolicyDetails(values, {
      ...source,
      referrer,
      metaFlowKey: flowKey,
    }),
  });
};

export const submitApplication = async ({
  category,
  flowKey,
  values,
  referrer,
}: {
  category: ApplicationCategory;
  flowKey: string;
  values: Payload;
  referrer?: string;
}) => {
  const payload =
    category === "insurance"
      ? buildInsurancePayload(flowKey, values, referrer)
      : buildLoanPayload(flowKey, values, referrer);
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) =>
    appendPayload(formData, key, value),
  );
  if (category === "insurance") {
    appendInsuranceFiles(formData, values);
  } else {
    appendFiles(formData, values, category);
  }
  appendPayload(
    formData,
    "profileDocumentSelections",
    values.__loanProfileDocumentSelections,
  );
  if (category === "loan") {
    appendCatalogFiles(formData, values);
    appendCoApplicantFiles(formData, values);
  }

  const response = await Post<
    ApiEnvelope<SubmittedApplicationRecord> | SubmittedApplicationRecord
  >(
    category === "insurance" ? "insurancequery" : "loanquery",
    formData,
    25000,
  );
  const record: SubmittedApplicationRecord =
    response && typeof response === "object" && "data" in response
      ? (response as ApiEnvelope<SubmittedApplicationRecord>).data || {}
      : (response as SubmittedApplicationRecord);
  const referenceId = String(
    category === "insurance"
      ? record.insuranceId ||
          record.referenceId ||
          record.applicationId ||
          record._id ||
          ""
      : record.loanId ||
          record.referenceId ||
          record.applicationId ||
          record._id ||
          "",
  ).trim();

  if (!referenceId) {
    throw new Error(
      "Application was submitted, but its tracking ID was not returned. Please contact support.",
    );
  }

  return { referenceId, record };
};
