"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserPlus,
  X,
  Camera,
} from "lucide-react";
import {
  fetchDocumentCatalog,
  fallbackDocumentCatalog,
  type DocumentCatalogItem,
} from "@/services/accountDocuments";
import {
  fetchPersonCibil,
  fetchPersonCibilPdf,
} from "@/services/applicationLookups";

type CoApplicantFile = File[] | null;

export type CoApplicantDocument = {
  key: string;
  label: string;
  files: File[];
};

export type CoApplicant = {
  name?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  gender?: string;
  aadhaarFile?: CoApplicantFile;
  panFile?: CoApplicantFile;
  bankStatementFile?: CoApplicantFile;
  documents?: CoApplicantDocument[];
  cibil?: any;
  cibilPdfReport?: any;
  cibilPdfLastFetchedAt?: string;
};

const fixedDocuments: Array<{
  key: "aadhaarFile" | "panFile" | "bankStatementFile";
  label: string;
  helper: string;
}> = [
  { key: "aadhaarFile", label: "Aadhaar", helper: "Front/back image or PDF" },
  { key: "panFile", label: "PAN", helper: "Identity proof" },
  {
    key: "bankStatementFile",
    label: "Bank Statement",
    helper: "Latest statement or salary account proof",
  },
];

const emptyApplicant = (): CoApplicant => ({
  gender: "male",
  documents: [],
});

const inputClass =
  "h-11 w-full rounded-xl border border-[#dce9f7] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none transition placeholder:text-[#9aa8b8] focus:border-[#4c1d95] focus:ring-2 focus:ring-[#e5f1ff]";

const isValidPan = (value?: string) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
    String(value || "")
      .trim()
      .toUpperCase(),
  );

const normalizeMobile = (value?: string) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(-10);

const extractCibilScore = (data: any) =>
  data?.cibilScore ||
  data?.data?.cibilScore ||
  data?.report?.data?.credit_score ||
  data?.data?.report?.data?.credit_score ||
  data?.report?.data?.score ||
  data?.report?.cibil_score ||
  data?.data?.report?.cibil_score ||
  data?.score ||
  null;

const getCibilPdfLink = (report: any) =>
  report?.data?.credit_report_link ||
  report?.data?.creditReportLink ||
  report?.credit_report_link ||
  report?.creditReportLink ||
  report?.report?.data?.credit_report_link ||
  report?.report?.credit_report_link ||
  report?.pdfUrl ||
  null;

const fileLabel = (files?: CoApplicantFile | File[]) => {
  if (!files || !files.length) return "No file uploaded";
  if (files.length === 1) return files[0]?.name || "1 file selected";
  return `${files.length} files selected`;
};

const openLocalFile = (file?: File) => {
  if (!file || typeof window === "undefined") return;
  const url = URL.createObjectURL(file);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
};

export function CoApplicantsSection({
  value,
  onChange,
  error,
}: {
  value?: CoApplicant[];
  onChange: (value: CoApplicant[]) => void;
  error?: string;
}) {
  const applicants = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );
  const [documentCatalog, setDocumentCatalog] = useState<DocumentCatalogItem[]>(
    [],
  );
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [openSelectorIndex, setOpenSelectorIndex] = useState<number | null>(
    null,
  );
  const [fetchingCibilIndex, setFetchingCibilIndex] = useState<number | null>(
    null,
  );
  const [cibilError, setCibilError] = useState("");

  useEffect(() => {
    let active = true;
    fetchDocumentCatalog()
      .then((items) => {
        if (!active) return;
        const activeItems = items
          .filter((item) => item?.label)
          .filter((item) => item.isActive !== false)
          .sort((a, b) => {
            const sortOrder = (a.sortOrder || 0) - (b.sortOrder || 0);
            if (sortOrder !== 0) return sortOrder;
            return a.label.localeCompare(b.label);
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

  const updateAt = (index: number, patch: Partial<CoApplicant>) => {
    onChange(
      applicants.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const addApplicant = () => onChange([...applicants, emptyApplicant()]);
  const removeApplicant = (index: number) =>
    onChange(applicants.filter((_, itemIndex) => itemIndex !== index));

  const toggleExtraDocument = (index: number, doc: DocumentCatalogItem) => {
    const current = applicants[index];
    const docs = current.documents || [];
    const exists = docs.some((item) => item.key === doc.key);
    updateAt(index, {
      documents: exists
        ? docs.filter((item) => item.key !== doc.key)
        : [...docs, { key: doc.key, label: doc.label, files: [] }],
    });
  };

  const selectAllExtraDocuments = (index: number) => {
    const current = applicants[index];
    const existing = new Map(
      (current.documents || []).map((doc) => [doc.key, doc]),
    );
    updateAt(index, {
      documents: documentCatalog.map((doc) => ({
        key: doc.key,
        label: doc.label,
        files: existing.get(doc.key)?.files || [],
      })),
    });
  };

  const clearAllExtraDocuments = (index: number) =>
    updateAt(index, { documents: [] });

  const updateExtraFiles = (index: number, key: string, files: File[]) => {
    const current = applicants[index];
    updateAt(index, {
      documents: (current.documents || []).map((doc) =>
        doc.key === key
          ? { ...doc, files: [...(doc.files || []), ...files] }
          : doc,
      ),
    });
  };

  const removeExtraFile = (index: number, key: string, fileIndex: number) => {
    const current = applicants[index];
    updateAt(index, {
      documents: (current.documents || []).map((doc) =>
        doc.key === key
          ? {
              ...doc,
              files: doc.files.filter((_, index) => index !== fileIndex),
            }
          : doc,
      ),
    });
  };

  const fetchCibilForApplicant = async (index: number) => {
    const current = applicants[index];
    const name = String(current?.name || "").trim();
    const panNumber = String(current?.pan || "")
      .trim()
      .toUpperCase();
    const mobile = normalizeMobile(current?.mobile);
    const gender = current?.gender || "male";

    if (!name || !isValidPan(panNumber) || mobile.length !== 10) {
      setCibilError(
        `Enter valid name, PAN, and 10-digit mobile for co-applicant ${index + 1}.`,
      );
      return;
    }

    setFetchingCibilIndex(index);
    setCibilError("");
    try {
      const payload = { name, panNumber, mobile, gender };
      const cibilResponse = await fetchPersonCibil(payload);
      let pdfResponse: any = null;
      try {
        pdfResponse = await fetchPersonCibilPdf(payload);
      } catch {
        pdfResponse = null;
      }

      const cibilData = cibilResponse?.data || cibilResponse;
      const pdfData = pdfResponse?.data || pdfResponse;
      const cibilPdfReport =
        pdfData?.report || pdfData?.cachedReport || pdfData || null;

      updateAt(index, {
        name,
        pan: panNumber,
        mobile,
        gender,
        cibil: cibilData,
        cibilPdfReport,
        cibilPdfLastFetchedAt: cibilPdfReport
          ? pdfData?.lastFetchedAt || new Date().toISOString()
          : current.cibilPdfLastFetchedAt,
      });

      if (!getCibilPdfLink(cibilPdfReport)) {
        setCibilError("CIBIL fetched, but PDF link was not returned.");
      }
    } catch (err: any) {
      setCibilError(
        err?.message ||
          err?.error ||
          "Failed to fetch CIBIL for this co-applicant.",
      );
    } finally {
      setFetchingCibilIndex(null);
    }
  };

  return (
    <div className="col-span-full rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#64748b]">
            Co-Applicants
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-[#0f172a]">
            Add, edit, and preview supporting KYC files
          </h3>
          <p className="mt-1 text-sm font-medium leading-5 text-[#475569]">
            Saved with your application so the team can review every
            co-borrower, CIBIL snapshot, and selected document together.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            {applicants.length} applicant{applicants.length === 1 ? "" : "s"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
              applicants.length
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {applicants.length ? "Configured" : "Empty"}
          </span>
          <button
            type="button"
            onClick={addApplicant}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#3b0764] px-4 text-[12px] font-extrabold text-white shadow-sm transition hover:bg-[#083d62]"
          >
            <Plus className="h-4 w-4" />
            Add co-applicant
          </button>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-6 text-center">
          <UserPlus className="mx-auto h-7 w-7 text-[#64748b]" />
          <p className="mt-2 text-[14px] font-extrabold text-[#0f172a]">
            No co-applicant added yet
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">
            Add one when income or ownership will be considered jointly.
          </p>
          <button
            type="button"
            onClick={addApplicant}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#3b0764] px-4 text-[12px] font-extrabold text-white"
          >
            <Plus className="h-4 w-4" />
            Add first co-applicant
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {applicants.map((applicant, index) => {
            const pdfLink = getCibilPdfLink(applicant.cibilPdfReport);
            return (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                      Co-applicant {index + 1}
                    </div>
                    {extractCibilScore(applicant.cibil) ? (
                      <p className="mt-1 text-[12px] font-extrabold text-[#15803d]">
                        CIBIL: {extractCibilScore(applicant.cibil)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[12px] font-bold text-[#64748b]">
                        CIBIL not fetched
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={fetchingCibilIndex === index}
                      onClick={() => fetchCibilForApplicant(index)}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-[11px] font-extrabold text-slate-700 transition hover:border-[#3b0764] hover:text-[#3b0764] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {fetchingCibilIndex === index ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      {fetchingCibilIndex === index
                        ? "Fetching"
                        : "Fetch CIBIL"}
                    </button>
                    {pdfLink ? (
                      <a
                        href={pdfLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-[#e8f2fb] px-3 text-[11px] font-extrabold text-[#3b0764] no-underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeApplicant(index)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-[11px] font-extrabold text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Name
                    </span>
                    <input
                      className={inputClass}
                      placeholder="Co-applicant name"
                      value={applicant.name || ""}
                      onChange={(event) =>
                        updateAt(index, { name: event.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Email
                    </span>
                    <input
                      className={inputClass}
                      placeholder="name@email.com"
                      value={applicant.email || ""}
                      onChange={(event) =>
                        updateAt(index, { email: event.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Mobile
                    </span>
                    <input
                      className={inputClass}
                      placeholder="10 digit mobile"
                      value={applicant.mobile || ""}
                      maxLength={10}
                      onChange={(event) =>
                        updateAt(index, {
                          mobile: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      PAN
                    </span>
                    <input
                      className={inputClass}
                      placeholder="ABCDE1234F"
                      value={applicant.pan || ""}
                      maxLength={10}
                      onChange={(event) =>
                        updateAt(index, {
                          pan: event.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, ""),
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Gender
                    </span>
                    <select
                      className={inputClass}
                      value={applicant.gender || "male"}
                      onChange={(event) =>
                        updateAt(index, { gender: event.target.value })
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 rounded-2xl border border-[#e2e8f0] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-extrabold text-[#0f172a]">
                        Select documents
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                        Default KYC documents plus extra selected documents.
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSelectorIndex((current) =>
                            current === index ? null : index,
                          )
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-[11px] font-extrabold text-slate-700 transition hover:border-[#3b0764] hover:text-[#3b0764]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Select
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            openSelectorIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSelectorIndex === index ? (
                        <>
                          <button
                            type="button"
                            aria-label="Close document selector"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setOpenSelectorIndex(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="text-sm font-extrabold text-slate-800">
                                Co-Applicant Documents
                              </div>
                              <div className="flex gap-2 text-xs font-extrabold">
                                <button
                                  type="button"
                                  onClick={() => selectAllExtraDocuments(index)}
                                  className="text-[#3b0764] hover:underline"
                                >
                                  All
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => clearAllExtraDocuments(index)}
                                  className="text-slate-500 hover:underline"
                                >
                                  None
                                </button>
                              </div>
                            </div>
                            <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
                              {catalogLoading ? (
                                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Loading documents...
                                </div>
                              ) : null}
                              {!catalogLoading &&
                              documentCatalog.length === 0 ? (
                                <div className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                                  No document options found.
                                </div>
                              ) : null}
                              {!catalogLoading &&
                                documentCatalog.map((doc) => {
                                  const selected = (
                                    applicant.documents || []
                                  ).some((item) => item.key === doc.key);
                                  return (
                                    <label
                                      key={`${index}-${doc.key}`}
                                      className="flex cursor-pointer items-center gap-2 rounded-xl p-2 hover:bg-slate-50"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() =>
                                          toggleExtraDocument(index, doc)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 accent-[#3b0764]"
                                      />
                                      <span className="text-sm font-semibold text-slate-700">
                                        {doc.label}
                                      </span>
                                    </label>
                                  );
                                })}
                            </div>
                            {(applicant.documents || []).length ? (
                              <div className="mt-3 border-t border-slate-200 pt-3 text-xs font-bold text-slate-500">
                                {(applicant.documents || []).length} selected
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {(applicant.documents || []).length > 0 ? (
                    <p className="mt-2 text-[12px] font-bold text-[#64748b]">
                      {(applicant.documents || []).length} extra document
                      {(applicant.documents || []).length === 1 ? "" : "s"}{" "}
                      selected
                    </p>
                  ) : null}

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {fixedDocuments.map((doc) => {
                      const files = applicant[doc.key] || [];
                      const hasFile = Boolean(files?.length);
                      return (
                        <div
                          key={doc.key}
                          className="rounded-2xl border border-[#e2e8f0] bg-white p-3"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]">
                              {hasFile ? (
                                <FileText className="h-6 w-6 text-[#3b0764]" />
                              ) : (
                                <UploadCloud className="h-6 w-6" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[12px] font-extrabold text-[#0f172a]">
                                  {doc.label}
                                </p>
                                {hasFile ? (
                                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                                    Uploaded
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                                {doc.helper}
                              </p>
                              <p className="mt-2 truncate text-[12px] font-bold text-[#334155]">
                                {fileLabel(files)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#5b21b6] px-3 text-[11px] font-extrabold text-white">
                              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                              Take photo
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(event) =>
                                  updateAt(index, {
                                    [doc.key]: Array.from(
                                      event.target.files || [],
                                    ),
                                  })
                                }
                              />
                            </label>
                            <label className="inline-flex h-9 cursor-pointer items-center rounded-full bg-[#3b0764] px-3 text-[11px] font-extrabold text-white">
                              {hasFile ? "Replace file" : "Browse files"}
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                multiple
                                onChange={(event) =>
                                  updateAt(index, {
                                    [doc.key]: Array.from(
                                      event.target.files || [],
                                    ),
                                  })
                                }
                              />
                            </label>
                            {hasFile ? (
                              <button
                                type="button"
                                onClick={() => openLocalFile(files?.[0])}
                                className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-[11px] font-extrabold text-slate-700"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                            ) : null}
                            {hasFile ? (
                              <button
                                type="button"
                                onClick={() =>
                                  updateAt(index, { [doc.key]: null })
                                }
                                className="h-9 rounded-full bg-red-50 px-3 text-[11px] font-extrabold text-red-700"
                              >
                                Clear
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}

                    {(applicant.documents || []).map((doc) => (
                      <div
                        key={doc.key}
                        className="rounded-2xl border border-[#e2e8f0] bg-white p-3"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]">
                            {doc.files?.length ? (
                              <FileText className="h-6 w-6 text-[#3b0764]" />
                            ) : (
                              <UploadCloud className="h-6 w-6" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[12px] font-extrabold text-[#0f172a]">
                                {doc.label}
                              </p>
                              {doc.files?.length ? (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                                  {doc.files.length} file
                                  {doc.files.length === 1 ? "" : "s"}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                              Extra document
                            </p>
                            <p className="mt-2 truncate text-[12px] font-bold text-[#334155]">
                              {fileLabel(doc.files)}
                            </p>
                          </div>
                        </div>
                        {doc.files?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {doc.files.map((file, fileIndex) => (
                              <button
                                key={`${file.name}-${fileIndex}`}
                                type="button"
                                onClick={() =>
                                  removeExtraFile(index, doc.key, fileIndex)
                                }
                                className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-extrabold text-[#334155]"
                              >
                                {file.name}{" "}
                                <X className="ml-1 inline h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#5b21b6] px-3 text-[11px] font-extrabold text-white">
                            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                            Take photo
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={(event) =>
                                updateExtraFiles(
                                  index,
                                  doc.key,
                                  Array.from(event.target.files || []),
                                )
                              }
                            />
                          </label>
                          <label className="inline-flex h-9 cursor-pointer items-center rounded-full bg-[#3b0764] px-3 text-[11px] font-extrabold text-white">
                            {doc.files?.length ? "Add more files" : "Browse files"}
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              multiple
                              onChange={(event) =>
                                updateExtraFiles(
                                  index,
                                  doc.key,
                                  Array.from(event.target.files || []),
                                )
                              }
                            />
                          </label>
                          {doc.files?.length ? (
                            <button
                              type="button"
                              onClick={() => openLocalFile(doc.files?.[0])}
                              className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-[11px] font-extrabold text-slate-700"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              toggleExtraDocument(index, doc as any)
                            }
                            className="h-9 rounded-full bg-red-50 px-3 text-[11px] font-extrabold text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addApplicant}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#ddd6fe] bg-white px-4 text-[12px] font-extrabold text-[#3b0764]"
          >
            <Plus className="h-4 w-4" />
            Add co-applicant
          </button>
        </div>
      )}

      {cibilError ? (
        <p className="mt-3 text-[12px] font-bold text-red-600">{cibilError}</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-[12px] font-bold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
