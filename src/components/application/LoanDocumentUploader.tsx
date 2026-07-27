"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  FileText,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import {
  fetchDocuments,
  fetchDocumentCatalog,
  type UploadedDocument,
  fallbackDocumentCatalog,
  type DocumentCatalogItem,
} from "@/services/accountDocuments";

type DocumentDefinition = {
  key: string;
  label: string;
  helper: string;
  multiple?: boolean;
  catalogId?: string;
  catalogKey?: string;
};

type LoanDocumentUploaderProps = {
  category?: "loan" | "insurance";
  flowKey: string;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

const GENERIC_DOCUMENTS: DocumentDefinition[] = [
  {
    key: "pan_card",
    label: "PAN Card",
    helper: "Clear PAN image or PDF.",
  },
  {
    key: "aadhaar_card",
    label: "Aadhaar Card",
    helper: "Front and back combined in one PDF or image.",
  },
  {
    key: "photo",
    label: "Applicant Photograph",
    helper: "Recent passport-size photograph.",
  },
  {
    key: "salary_slip",
    label: "Latest Salary Slip",
    helper: "Most recent salary slip.",
  },
  {
    key: "bank_statement",
    label: "Bank Statement",
    helper: "Latest bank statement in PDF or image format.",
  },
  {
    key: "itr_form_16",
    label: "ITR / Form 16",
    helper: "Latest available income-tax document.",
  },
  {
    key: "form_16ab",
    label: "Form 16A & 16B",
    helper: "Latest available Form 16A or Form 16B.",
  },
  {
    key: "offer_letter",
    label: "Offer Letter",
    helper: "Current employment offer or appointment letter.",
  },
  {
    key: "relieving_letter",
    label: "Relieving Letter",
    helper: "Previous employer relieving letter, if applicable.",
  },
  {
    key: "gst_certificate",
    label: "GST Certificate",
    helper: "Current GST registration certificate.",
  },
  {
    key: "gst_returns",
    label: "GST Returns",
    helper: "Latest filed GST return.",
  },
  {
    key: "shop_act",
    label: "Shop Act / Establishment Certificate",
    helper: "Valid shop and establishment registration.",
  },
  {
    key: "govt_license",
    label: "Government License",
    helper: "Relevant business or professional license.",
  },
];

const SPECIAL_DOCUMENTS: DocumentDefinition[] = [
  {
    key: "bankStatementUrl",
    label: "Existing Loan Statement",
    helper: "Latest statement for the existing loan account.",
  },
  {
    key: "admissionLetterUrl",
    label: "Admission Letter",
    helper: "Admission confirmation issued by the institute.",
  },
  {
    key: "feeStructureUrl",
    label: "Course Fee Structure",
    helper: "Official course fee schedule.",
  },
  {
    key: "rcCopyUrl",
    label: "Vehicle RC Copy",
    helper: "Clear front and back RC copy.",
  },
  {
    key: "goldPhotosUrl",
    label: "Gold Photographs",
    helper: "Clear photographs of the gold articles.",
    multiple: true,
  },
  {
    key: "carInsuranceUrl",
    label: "Vehicle Insurance",
    helper: "Current vehicle insurance policy.",
  },
  {
    key: "inspectionPhotosUrl",
    label: "Vehicle Inspection Photos",
    helper: "Clear front, rear, side and interior vehicle photographs.",
    multiple: true,
  },
  {
    key: "lastMonthBankStatementUrl",
    label: "Latest Month Bank Statement",
    helper: "Latest salary-account bank statement.",
  },
  {
    key: "propertyDocumentsUrl",
    label: "Property Documents",
    helper: "Title deed, allotment letter, registry or related papers.",
    multiple: true,
  },
  {
    key: "propertyOwnershipProofUrl",
    label: "Property Ownership Proof",
    helper: "Registry, title deed or ownership certificate.",
  },
  {
    key: "landDocumentsUrl",
    label: "Land Ownership Documents",
    helper: "7/12, RTC, Khasra/Khatauni, title or other land records.",
    multiple: true,
  },
  {
    key: "renovationEstimateUrl",
    label: "Renovation Estimate",
    helper: "Contractor or architect estimate.",
  },
  {
    key: "itrUrl",
    label: "Latest ITR",
    helper: "Latest filed income-tax return.",
  },
  {
    key: "gstReturnsUrl",
    label: "Business GST Returns",
    helper: "Latest available GST returns.",
  },
  {
    key: "dematStatementOrFdCopyUrl",
    label: "Demat Statement / FD Copy",
    helper: "Latest security holding statement or FD receipt.",
  },
  {
    key: "proformaInvoiceOrQuotationUrl",
    label: "Machinery Quotation",
    helper: "Vendor quotation or proforma invoice.",
  },
  {
    key: "businessRegistrationCertificateUrl",
    label: "Business Registration Certificate",
    helper: "Certificate of incorporation or business registration.",
  },
];

const INSURANCE_DOCUMENTS: DocumentDefinition[] = [
  {
    key: "medicalReports",
    label: "Medical Reports",
    helper: "Recent prescriptions, test reports or medical records.",
    multiple: true,
  },
  {
    key: "rcUpload",
    label: "Vehicle RC",
    helper: "Clear front and back copy of the registration certificate.",
    multiple: true,
  },
  {
    key: "inspectionPhotos",
    label: "Vehicle Photographs",
    helper: "Clear front, rear, side and interior vehicle photographs.",
    multiple: true,
  },
  {
    key: "ownershipDocs",
    label: "Ownership Documents",
    helper: "Ownership proof, invoice, lease, tax receipt or asset list.",
    multiple: true,
  },
  {
    key: "passportUpload",
    label: "Passport",
    helper: "Clear passport identity page for each traveller.",
    multiple: true,
  },
  {
    key: "petMedicalRecords",
    label: "Pet Medical Records",
    helper: "Vaccination certificate and recent veterinary records.",
    multiple: true,
  },
];

const catalog = [
  ...GENERIC_DOCUMENTS,
  ...SPECIAL_DOCUMENTS,
  ...INSURANCE_DOCUMENTS,
];
const catalogByKey = new Map(
  catalog.map((document) => [document.key, document]),
);

const CATALOG_UPLOAD_PREFIX = "__catalogLoanDocument:";
const INTERNAL_CATALOG_META_KEY = "__loanDocumentCatalogMeta";
const INTERNAL_PROFILE_SELECTIONS_KEY = "__loanProfileDocumentSelections";

const normalizeCatalogToken = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

const catalogUploadAliases: Record<string, string> = {
  aadhaarcard: "aadhaar_card",
  adharcard: "aadhaar_card",
  applicantphoto: "photo",
  bankstatement: "bank_statement",
  latest1yrbanking: "bank_statement",
  latest3monthssalaryslip: "salary_slip",
  latest3yearsitrwithcomputation: "itr_form_16",
  latest3yrform16bothaandbothb: "form_16ab",
  gstcertificate: "gst_certificate",
  gstreturn3blast1year: "gst_returns",
  pancard: "pan_card",
  propertypaperwithallpreviouschain: "propertyDocumentsUrl",
  allrunnnigloanstatementandcreditcardbill: "bankStatementUrl",
  allrunnningloanstatementandcreditcardbill: "bankStatementUrl",
  allrunningloanstatementandcreditcardbill: "bankStatementUrl",
};

const resolveCatalogUploadKey = (item: DocumentCatalogItem) => {
  const keyToken = normalizeCatalogToken(item.key);
  const labelToken = normalizeCatalogToken(item.label);
  const alias =
    catalogUploadAliases[keyToken] || catalogUploadAliases[labelToken];
  if (alias) return alias;

  const exactKey = catalog.find(
    (document) =>
      normalizeCatalogToken(document.key) === keyToken ||
      normalizeCatalogToken(document.key) === labelToken,
  )?.key;
  return exactKey || `${CATALOG_UPLOAD_PREFIX}${item.id}`;
};

const findProfileDocument = (
  document: DocumentDefinition,
  profileDocuments: UploadedDocument[],
) => {
  const documentTokens = new Set(
    [document.key, document.catalogKey, document.label]
      .filter(Boolean)
      .map((value) => normalizeCatalogToken(String(value))),
  );

  return profileDocuments.find((profileDocument) => {
    if (!profileDocument?.fileUrl || !profileDocument?.docType) return false;
    const profileToken = normalizeCatalogToken(profileDocument.docType);
    const normalizedProfileKey =
      catalogUploadAliases[profileToken] ||
      catalog.find((item) => normalizeCatalogToken(item.key) === profileToken)
        ?.key;

    return (
      documentTokens.has(profileToken) || normalizedProfileKey === document.key
    );
  });
};

const defaultsByFlow: Record<string, string[]> = {
  personalLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
  ],
  homeLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
    "propertyDocumentsUrl",
  ],
  businessLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "itr_form_16",
    "gst_certificate",
    "gst_returns",
    "businessRegistrationCertificateUrl",
  ],
  vehicleLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
    "rcCopyUrl",
    "inspectionPhotosUrl",
  ],
  twoWheelerLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
    "rcCopyUrl",
  ],
  usedCarLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "rcCopyUrl",
    "carInsuranceUrl",
    "inspectionPhotosUrl",
  ],
  goldLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "goldPhotosUrl",
  ],
  educationLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "admissionLetterUrl",
    "feeStructureUrl",
  ],
  instantLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "lastMonthBankStatementUrl",
  ],
  loanAgainstProperty: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "propertyDocumentsUrl",
  ],
  renovationLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "propertyOwnershipProofUrl",
    "renovationEstimateUrl",
  ],
  workingCapitalLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "itrUrl",
    "gstReturnsUrl",
    "gst_certificate",
    "businessRegistrationCertificateUrl",
  ],
  loanAgainstSecurity: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "dematStatementOrFdCopyUrl",
  ],
  loanAgainstCarValue: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "rcCopyUrl",
    "carInsuranceUrl",
    "inspectionPhotosUrl",
  ],
  machineryLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "govt_license",
    "proformaInvoiceOrQuotationUrl",
  ],
  balanceTransferLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
    "bankStatementUrl",
  ],
  topUpLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "salary_slip",
    "bank_statement",
    "bankStatementUrl",
  ],
  agricultureLoan: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "bank_statement",
    "itr_form_16",
    "gst_certificate",
    "govt_license",
    "landDocumentsUrl",
  ],
  healthInsurance: ["pan_card", "aadhaar_card", "photo", "medicalReports"],
  groupInsurance: ["pan_card", "aadhaar_card", "photo", "medicalReports"],
  lifeInsurance: ["pan_card", "aadhaar_card", "photo", "medicalReports"],
  retirementPlanInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "medicalReports",
  ],
  vehicleInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "rcUpload",
    "inspectionPhotos",
  ],
  propertyInsurance: ["pan_card", "aadhaar_card", "photo", "ownershipDocs"],
  shopInsurance: ["pan_card", "aadhaar_card", "photo", "ownershipDocs"],
  stockInsurance: ["pan_card", "aadhaar_card", "photo", "ownershipDocs"],
  machineInsurance: ["pan_card", "aadhaar_card", "photo", "ownershipDocs"],
  machineryStockInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "ownershipDocs",
  ],
  travelInsurance: ["pan_card", "aadhaar_card", "photo", "passportUpload"],
  termInsurance: ["pan_card", "aadhaar_card", "photo", "medicalReports"],
  loanSurakshaInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "medicalReports",
  ],
  personalAccidentInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "medicalReports",
  ],
  criticalIllnessInsurance: [
    "pan_card",
    "aadhaar_card",
    "photo",
    "medicalReports",
  ],
  cyberInsurance: ["pan_card", "aadhaar_card", "photo"],
  petInsurance: ["pan_card", "aadhaar_card", "photo", "petMedicalRecords"],
};

const INTERNAL_SELECTED_KEY = "__selectedLoanDocumentTypes";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedFileTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const unique = (values: string[]) => Array.from(new Set(values));

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function LoanDocumentUploader({
  category = "loan",
  flowKey,
  values,
  onChange,
}: LoanDocumentUploaderProps) {
  const [documentToAdd, setDocumentToAdd] = useState("");
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [documentCatalog, setDocumentCatalog] = useState<DocumentCatalogItem[]>(
    [],
  );
  const [profileDocuments, setProfileDocuments] = useState<UploadedDocument[]>(
    [],
  );
  const [catalogLoading, setCatalogLoading] = useState(true);
  const defaultKeys =
    defaultsByFlow[flowKey] ||
    (category === "insurance"
      ? defaultsByFlow.healthInsurance
      : defaultsByFlow.personalLoan);
  const additionalKeys = Array.isArray(values[INTERNAL_SELECTED_KEY])
    ? values[INTERNAL_SELECTED_KEY].map(String)
    : [];
  const uploadedKeys = catalog
    .filter(
      (document) =>
        Array.isArray(values[document.key]) && values[document.key].length,
    )
    .map((document) => document.key);
  const activeKeys = unique([
    ...defaultKeys,
    ...additionalKeys,
    ...uploadedKeys,
  ]);
  const catalogOptions = useMemo(
    () =>
      documentCatalog
        .filter((item) => item.isActive !== false)
        .map((item) => {
          const resolvedKey = resolveCatalogUploadKey(item);
          const fallback = catalogByKey.get(resolvedKey);
          return {
            id: item.id,
            document: {
              ...(fallback || {
                key: resolvedKey,
                label: item.label,
                helper: `Upload ${item.label}.`,
              }),
              key: resolvedKey,
              label: item.label || fallback?.label || "Document",
              helper:
                item.numberLabel ||
                fallback?.helper ||
                `Upload ${item.label || "document"}.`,
              catalogId: item.id,
              catalogKey: item.key,
            } satisfies DocumentDefinition,
          };
        }),
    [documentCatalog],
  );
  const modelDocuments = useMemo(() => {
    const seenKeys = new Set<string>();
    return catalogOptions
      .map(({ document }) => document)
      .filter((document) => {
        if (seenKeys.has(document.key)) return false;
        seenKeys.add(document.key);
        return true;
      });
  }, [catalogOptions]);
  const resolvedCatalogByKey = useMemo(
    () =>
      new Map([
        ...catalog.map(
          (document) =>
            [document.key, document] as [string, DocumentDefinition],
        ),
        ...modelDocuments.map(
          (document) =>
            [document.key, document] as [string, DocumentDefinition],
        ),
      ]),
    [modelDocuments],
  );
  const activeDocuments = activeKeys
    .map((key) => resolvedCatalogByKey.get(key))
    .filter((document): document is DocumentDefinition => Boolean(document));

  const addableDocumentCount = catalogOptions.filter(
    ({ document }) => !activeKeys.includes(document.key),
  ).length;
  const profileDocumentByKey = new Map(
    activeDocuments
      .map(
        (document) =>
          [
            document.key,
            findProfileDocument(document, profileDocuments),
          ] as const,
      )
      .filter((entry): entry is [string, UploadedDocument] =>
        Boolean(entry[1]),
      ),
  );
  const profileSelectionSignature = JSON.stringify(
    activeDocuments.flatMap((document) => {
      const profileDocument = profileDocumentByKey.get(document.key);
      if (!profileDocument?.fileUrl) return [];
      return [
        {
          targetKey: document.key,
          docType: profileDocument.docType,
          fileUrl: profileDocument.fileUrl,
          catalogId: document.catalogId,
          catalogKey: document.catalogKey,
          label: document.label,
        },
      ];
    }),
  );

  useEffect(() => {
    let active = true;
    fetchDocumentCatalog()
      .then((items) => {
        if (!active) return;
        const activeItems = items
          .filter((item) => item?.key && item?.label)
          .filter((item) => item.isActive !== false)
          .sort((a, b) => {
            const order = (a.sortOrder || 0) - (b.sortOrder || 0);
            return order || a.label.localeCompare(b.label);
          });
        setDocumentCatalog(
          activeItems.length ? activeItems : fallbackDocumentCatalog,
        );
      })
      .catch(() => {
        if (active) setDocumentCatalog(fallbackDocumentCatalog);
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchDocuments()
      .then((documents) => {
        if (active) setProfileDocuments(documents);
      })
      .catch(() => {
        if (active) setProfileDocuments([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const currentSelections = Array.isArray(
      values[INTERNAL_PROFILE_SELECTIONS_KEY],
    )
      ? values[INTERNAL_PROFILE_SELECTIONS_KEY]
      : [];
    if (JSON.stringify(currentSelections) === profileSelectionSignature) return;
    onChange(
      INTERNAL_PROFILE_SELECTIONS_KEY,
      JSON.parse(profileSelectionSignature),
    );
  }, [onChange, profileSelectionSignature, values]);

  const addDocument = () => {
    if (!documentToAdd) return;
    const selectedDocument = catalogOptions.find(
      (option) => option.id === documentToAdd,
    )?.document;
    if (!selectedDocument || activeKeys.includes(selectedDocument.key)) return;
    onChange(
      INTERNAL_SELECTED_KEY,
      unique([...additionalKeys, selectedDocument.key]),
    );
    if (
      selectedDocument?.catalogId &&
      selectedDocument.key.startsWith(CATALOG_UPLOAD_PREFIX)
    ) {
      const currentMeta =
        values[INTERNAL_CATALOG_META_KEY] &&
        typeof values[INTERNAL_CATALOG_META_KEY] === "object"
          ? values[INTERNAL_CATALOG_META_KEY]
          : {};
      onChange(INTERNAL_CATALOG_META_KEY, {
        ...currentMeta,
        [selectedDocument.key]: {
          id: selectedDocument.catalogId,
          key: selectedDocument.catalogKey,
          label: selectedDocument.label,
        },
      });
    }
    setDocumentToAdd("");
  };

  const removeAdditionalDocument = (key: string) => {
    onChange(
      INTERNAL_SELECTED_KEY,
      additionalKeys.filter((item) => item !== key),
    );
    onChange(key, []);
    if (key.startsWith(CATALOG_UPLOAD_PREFIX)) {
      const currentMeta =
        values[INTERNAL_CATALOG_META_KEY] &&
        typeof values[INTERNAL_CATALOG_META_KEY] === "object"
          ? values[INTERNAL_CATALOG_META_KEY]
          : {};
      const nextMeta = { ...currentMeta };
      delete nextMeta[key];
      onChange(INTERNAL_CATALOG_META_KEY, nextMeta);
    }
    setFileErrors((current) => ({ ...current, [key]: "" }));
  };

  const applyFiles = (document: DocumentDefinition, selectedFiles: File[]) => {
    const invalidType = selectedFiles.find(
      (file) => file.type && !allowedFileTypes.has(file.type),
    );
    if (invalidType) {
      setFileErrors((current) => ({
        ...current,
        [document.key]:
          "Only PDF, JPG, PNG, WEBP, HEIC or HEIF files are allowed.",
      }));
      return;
    }
    const oversized = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileErrors((current) => ({
        ...current,
        [document.key]: "Each file must be 10 MB or smaller.",
      }));
      return;
    }

    const nextFiles = document.multiple
      ? selectedFiles.slice(0, 10)
      : selectedFiles.slice(0, 1);
    onChange(document.key, nextFiles);
    setFileErrors((current) => ({ ...current, [document.key]: "" }));
  };

  const removeFile = (documentKey: string, fileIndex: number) => {
    const currentFiles = Array.isArray(values[documentKey])
      ? values[documentKey]
      : [];
    onChange(
      documentKey,
      currentFiles.filter((_: File, index: number) => index !== fileIndex),
    );
  };

  return (
    <div className="col-span-full grid gap-4">
      <div className="rounded-xl border border-[#dce9f7] bg-[#f7fbff] p-4">
        <div>
          <p className="text-[13px] font-extrabold text-[#0f172a]">
            Add another document
          </p>
          <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
            {category === "insurance" ? "Insurance" : "Loan"}-specific documents
            are already open below. Select any additional document to create its
            separate upload box.
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <select
            aria-label="Select document type"
            value={documentToAdd}
            onChange={(event) => setDocumentToAdd(event.target.value)}
            className="h-10 min-w-0 flex-1 rounded-lg border border-[#cddff0] bg-white px-3 text-[11px] font-bold text-[#344054] outline-none focus:border-[#005ca8] focus:ring-2 focus:ring-[#e5f1ff]"
          >
            <option value="">Select document type</option>
            {catalogOptions.map(({ id, document }) => {
              const alreadyAdded = activeKeys.includes(document.key);
              const savedInProfile = Boolean(
                findProfileDocument(document, profileDocuments),
              );
              return (
                <option key={id} value={id} disabled={alreadyAdded}>
                  {document.label}
                  {alreadyAdded
                    ? " — Already added"
                    : savedInProfile
                      ? " — Saved in profile"
                      : ""}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            disabled={!documentToAdd || catalogLoading}
            onClick={addDocument}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#005ca8] px-4 text-[10px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Document
          </button>
        </div>
        {catalogLoading ? (
          <p className="mt-2 text-[9px] font-bold text-[#64748b]">
            Loading Document Catalogue...
          </p>
        ) : (
          <p className="mt-2 text-[9px] font-semibold text-[#64748b]">
            {`${catalogOptions.length} document types synced from Admin Document Catalogue. ${addableDocumentCount} available to add.`}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeDocuments.map((document) => {
          const files = Array.isArray(values[document.key])
            ? (values[document.key] as File[])
            : [];
          const profileDocument = profileDocumentByKey.get(document.key);
          const hasFiles = files.length > 0;
          const hasProfileDocument = Boolean(profileDocument?.fileUrl);
          const hasDocument = hasFiles || hasProfileDocument;
          const isDefault = defaultKeys.includes(document.key);

          return (
            <section
              key={document.key}
              className={`rounded-xl border p-3.5 transition ${
                hasDocument
                  ? "border-none bg-emerald-50/40"
                  : "border-[#dce9f7] bg-white"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  title={
                    hasProfileDocument && !hasFiles
                      ? "Saved document ready"
                      : hasFiles
                        ? "Document selected"
                        : "Document required"
                  }
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    hasDocument
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#edf5ff] text-[#005ca8]"
                  }`}
                >
                  {hasDocument ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : (
                    <FileText className="h-4.5 w-4.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-1.5">
                    <h3 className="text-[12px] font-bold leading-4 text-[#0f172a]">
                      {document.label}
                    </h3>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] text-[#64748b]">
                    {document.helper}
                  </p>
                </div>
                {!isDefault ? (
                  <button
                    type="button"
                    aria-label={`Remove ${document.label}`}
                    onClick={() => removeAdditionalDocument(document.key)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {files.length ? (
                <div className="mt-3 grid gap-1.5">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-white px-2.5 py-1.5"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-extrabold text-[#334155]">
                          {file.name}
                        </p>
                        <p className="text-[9px] font-semibold text-[#94a3b8]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => removeFile(document.key, index)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : profileDocument?.fileUrl ? (
                <a
                  href={profileDocument.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 text-left no-underline"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="min-w-0 flex-1 truncate text-[9px] font-extrabold text-emerald-800">
                    Saved document ready
                  </span>
                  <span className="max-w-[45%] truncate text-[8px] font-semibold text-[#64748b]">
                    {profileDocument.referenceId || profileDocument.docType}
                  </span>
                </a>
              ) : null}

              <div className="mt-3">
                <label className="inline-flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#9fc7e9] bg-white px-3 text-[10px] font-extrabold text-[#005ca8] transition hover:border-[#005ca8] hover:bg-[#f7fbff]">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  {hasDocument ? "Replace file" : "Choose file"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
                    multiple={Boolean(document.multiple)}
                    className="sr-only"
                    onChange={(event) => {
                      applyFiles(
                        document,
                        Array.from(event.target.files || []),
                      );
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              {document.multiple ? (
                <p className="mt-1.5 text-[9px] font-semibold text-[#64748b]">
                  Up to 10 files can be selected.
                </p>
              ) : null}
              {fileErrors[document.key] ? (
                <p className="mt-1.5 text-[9px] font-bold text-red-600">
                  {fileErrors[document.key]}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
