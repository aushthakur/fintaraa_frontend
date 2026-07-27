import { Delete, Fetch, Post, Put } from "@/hooks/apiUtils";

export type DocumentCatalogItem = {
  id: string;
  key: string;
  label: string;
  required?: boolean;
  numberLabel?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type UploadedDocument = {
  docType: string;
  fileUrl: string;
  number?: string;
  password?: string;
  issuer?: string;
  verified?: boolean;
  referenceId?: string;
  issuedOn?: string;
};

export type StatementDoc = {
  id: string;
  docType?: string;
  title: string;
  subtitle?: string;
  size?: string;
  issuedOn?: string;
  url?: string;
  fileName?: string;
};

export type StatementFolder = {
  id: string;
  name: string;
  themeColor?: string;
  themeIcon?: string;
  count?: number;
  latestUrl?: string;
  latestTitle?: string;
  updatedAt?: string;
  createdAt?: string;
};

const unwrapList = (response: unknown, key: string) => {
  const value = response as Record<string, unknown>;
  const data = value?.data as Record<string, unknown> | unknown[] | undefined;
  const nestedData = data as Record<string, unknown> | undefined;

  return (
    nestedData?.result ||
    nestedData?.[key] ||
    data ||
    value?.[key] ||
    response
  );
};

const mapCatalogItem = (item: Record<string, unknown>): DocumentCatalogItem => ({
  id: String(item?._id || item?.id || `${item?.key || "doc"}`),
  key: String(item?.key || item?.docType || "document"),
  label: String(item?.label || item?.title || "Document"),
  required: Boolean(item?.required),
  numberLabel: item?.numberLabel ? String(item.numberLabel) : undefined,
  isActive:
    typeof item?.isActive === "boolean" ? Boolean(item.isActive) : undefined,
  sortOrder:
    typeof item?.sortOrder === "number" ? Number(item.sortOrder) : undefined,
});

const mapStatement = (item: Record<string, unknown>): StatementDoc => ({
  id: String(item?._id || item?.id || `${item?.title || "doc"}`),
  docType: item?.docType ? String(item.docType) : undefined,
  title: String(item?.title || item?.name || "Document"),
  subtitle: item?.sub || item?.subtitle || item?.description
    ? String(item?.sub || item?.subtitle || item?.description)
    : undefined,
  size: item?.size || item?.fileSize ? String(item?.size || item?.fileSize) : undefined,
  issuedOn: item?.issuedOn || item?.date || item?.createdAt
    ? String(item?.issuedOn || item?.date || item?.createdAt)
    : undefined,
  url: item?.url || item?.link ? String(item?.url || item?.link) : undefined,
  fileName: item?.fileName ? String(item.fileName) : undefined,
});

const mapFolder = (item: Record<string, unknown>): StatementFolder => ({
  id: String(item?._id || item?.id || `${item?.name || "folder"}`),
  name: String(item?.name || "Folder"),
  themeColor: item?.themeColor ? String(item.themeColor) : undefined,
  themeIcon: item?.themeIcon ? String(item.themeIcon) : undefined,
  count: typeof item?.count === "number" ? Number(item.count) : undefined,
  latestUrl: item?.latestUrl ? String(item.latestUrl) : undefined,
  latestTitle: item?.latestTitle ? String(item.latestTitle) : undefined,
  updatedAt: item?.updatedAt ? String(item.updatedAt) : undefined,
  createdAt: item?.createdAt ? String(item.createdAt) : undefined,
});

export const fallbackDocumentCatalog: DocumentCatalogItem[] = [
  { id: "pan_card", key: "pan_card", label: "Pan Card", required: true, numberLabel: "PAN Number" },
  { id: "aadhaar_card", key: "aadhaar_card", label: "Aadhaar Card", required: true, numberLabel: "Aadhaar Number" },
  { id: "photo", key: "photo", label: "Photo", required: true },
  { id: "itr_form_16", key: "itr_form_16", label: "ITR / Form 16", required: true, numberLabel: "Document Number" },
  { id: "salary_slip", key: "salary_slip", label: "Salary Slip", required: true, numberLabel: "Document Number" },
  { id: "offer_letter", key: "offer_letter", label: "Offer Letter", required: true, numberLabel: "Document Number" },
  { id: "relieving_letter", key: "relieving_letter", label: "Relieving Letter", required: true, numberLabel: "Document Number" },
  { id: "bank_statement", key: "bank_statement", label: "Bank Statement", required: true, numberLabel: "Account Number" },
  { id: "gst_certificate", key: "gst_certificate", label: "GST Certificate", required: true, numberLabel: "GST Number" },
  { id: "gst_returns", key: "gst_returns", label: "GST Returns", required: true, numberLabel: "GSTIN" },
  { id: "shop_act", key: "shop_act", label: "Shop Act", required: true, numberLabel: "Document Number" },
  { id: "govt_license", key: "govt_license", label: "Govt License", required: true, numberLabel: "License Number" },
  { id: "form_16ab", key: "form_16ab", label: "Form 16A&B", required: true, numberLabel: "Form 16A&B" },
];

export const statementUploadItems = [
  { key: "bank_letter", label: "Bank Related Letter" },
  { key: "sanction_document", label: "Loan Sanction Documents" },
  { key: "repayment_schedule", label: "Repayment Schedule" },
  { key: "welcome_kit", label: "Welcome Kit" },
  { key: "account_statement", label: "Account Statement" },
  { key: "foreclosure_letter", label: "Foreclosure Letter" },
  { key: "noc_letter", label: "NOC Letter" },
  { key: "disbursement_letter", label: "Disbursement Letter" },
];

export const fetchDocumentCatalog = async (): Promise<DocumentCatalogItem[]> => {
  const response = await Fetch<unknown>(
    "documents/document-catalog",
    { pagination: false },
    10000,
    true,
    false,
  );
  const list = unwrapList(response, "documents");
  return Array.isArray(list)
    ? list.map((item) => mapCatalogItem(item as Record<string, unknown>))
    : [];
};

export const fetchDocuments = async (): Promise<UploadedDocument[]> => {
  const response = await Fetch<unknown>(
    "user/digilocker",
    undefined,
    10000,
    true,
    false,
  );
  const docs = unwrapList(response, "documents");
  return Array.isArray(docs) ? (docs as UploadedDocument[]) : [];
};

export const uploadDocument = async (
  formData: FormData,
): Promise<UploadedDocument[]> => {
  const response = await Post<unknown>("user/digilocker-sync", formData, 15000);
  const docs = unwrapList(response, "documents");
  return Array.isArray(docs) ? (docs as UploadedDocument[]) : [];
};

export const deleteDocument = async (
  docType: string,
): Promise<UploadedDocument[]> => {
  const response = await Delete<unknown>(`user/digilocker/${docType}`);
  const docs = unwrapList(response, "documents");
  return Array.isArray(docs) ? (docs as UploadedDocument[]) : [];
};

export const fetchStatements = async (): Promise<StatementDoc[]> => {
  const response = await Fetch<unknown>(
    "documents/statements",
    undefined,
    10000,
    true,
    false,
  );
  const list = unwrapList(response, "statements");
  return Array.isArray(list)
    ? list.map((item) => mapStatement(item as Record<string, unknown>))
    : [];
};

export const uploadStatement = async (
  formData: FormData,
): Promise<StatementDoc[]> => {
  const response = await Post<unknown>("documents/statements", formData, 20000);
  const list = unwrapList(response, "statements");
  return Array.isArray(list)
    ? list.map((item) => mapStatement(item as Record<string, unknown>))
    : [];
};

export const fetchStatementFolders = async (): Promise<StatementFolder[]> => {
  const response = await Fetch<unknown>(
    "documents/statement-folders",
    undefined,
    10000,
    true,
    false,
  );
  const list = unwrapList(response, "folders");
  return Array.isArray(list)
    ? list.map((item) => mapFolder(item as Record<string, unknown>))
    : [];
};

export const createStatementFolder = async (payload: {
  name: string;
  themeColor?: string;
  themeIcon?: string;
}): Promise<StatementFolder> => {
  const response = await Post<unknown>("documents/statement-folders", payload);
  const item = unwrapList(response, "folder");
  return mapFolder(item as Record<string, unknown>);
};

export const updateStatementFolder = async (
  id: string,
  payload: { name?: string; themeColor?: string; themeIcon?: string },
): Promise<StatementFolder> => {
  const response = await Put<unknown>(
    `documents/statement-folders/${id}`,
    payload,
  );
  const item = unwrapList(response, "folder");
  return mapFolder(item as Record<string, unknown>);
};

export const deleteStatementFolder = async (id: string) => {
  await Delete<unknown>(`documents/statement-folders/${id}`);
};
