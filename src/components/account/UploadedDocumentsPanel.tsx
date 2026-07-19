"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Camera,
} from "lucide-react";
import {
  deleteDocument,
  fallbackDocumentCatalog,
  fetchDocumentCatalog,
  fetchDocuments,
  uploadDocument,
  type DocumentCatalogItem,
  type UploadedDocument,
} from "@/services/accountDocuments";

type DocState = {
  fileUrl?: string;
  number?: string;
  password?: string;
  fileName?: string;
  uploaded?: boolean;
  showPassword?: boolean;
};

const requiredDocKeys = new Set(["pan_card", "aadhaar_card"]);

function isImageUrl(url?: string) {
  if (!url) return false;
  return /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(url.split("?")[0]);
}

function fileNameFromUrl(url?: string) {
  if (!url) return "Uploaded document";
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] || url);
  } catch {
    return "Uploaded document";
  }
}

export function UploadedDocumentsPanel() {
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState<DocumentCatalogItem[]>([]);
  const [library, setLibrary] = useState<UploadedDocument[]>([]);
  const [docUploads, setDocUploads] = useState<Record<string, DocState>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const catalogItems = useMemo(() => {
    const source = catalog.length ? catalog : fallbackDocumentCatalog;
    return source
      .filter((item) => item.label && item.isActive !== false)
      .map((item) => ({
        ...item,
        required: requiredDocKeys.has(item.key) ? true : item.required,
      }))
      .sort((a, b) => {
        const order = (a.sortOrder || 0) - (b.sortOrder || 0);
        return order || a.label.localeCompare(b.label);
      });
  }, [catalog]);

  const visibleDocs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return catalogItems;
    return catalogItems.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [catalogItems, search]);

  const uploadedCount = library.length;

  const syncDocUploads = (docs: UploadedDocument[]) => {
    const next: Record<string, DocState> = {};
    docs.forEach((doc) => {
      if (!doc?.docType) return;
      next[doc.docType] = {
        fileUrl: doc.fileUrl,
        number: doc.number,
        fileName: doc.referenceId || fileNameFromUrl(doc.fileUrl),
        uploaded: Boolean(doc.fileUrl),
        password: "",
        showPassword: false,
      };
    });
    setDocUploads((prev) => ({ ...prev, ...next }));
  };

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setCatalogLoading(true);
      setError(null);
      try {
        const [catalogData, docsData] = await Promise.allSettled([
          fetchDocumentCatalog(),
          fetchDocuments(),
        ]);

        if (!active) return;

        if (catalogData.status === "fulfilled") {
          setCatalog(catalogData.value);
        }

        if (docsData.status === "fulfilled") {
          setLibrary(docsData.value);
          syncDocUploads(docsData.value);
        } else {
          setError("Could not fetch documents. Please check login and API.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setCatalogLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const updateDocField = (
    key: string,
    field: keyof DocState,
    value: unknown,
  ) => {
    setDocUploads((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };

  const handleUpload = async (item: DocumentCatalogItem, file?: File) => {
    if (!file) return;
    setUploadingKey(item.key);
    try {
      const existing = docUploads[item.key] || {};
      const form = new FormData();
      form.append("digiLockerFiles", file);
      form.append("defaultDocType", item.key);
      form.append("name", item.label);
      if (existing.number) form.append("docNumber", existing.number);
      if (existing.password) form.append("docPassword", existing.password);

      const docs = await uploadDocument(form);
      setLibrary(docs);
      syncDocUploads(docs);
      setDocUploads((prev) => ({
        ...prev,
        [item.key]: {
          ...(prev[item.key] || {}),
          uploaded: true,
          fileName: file.name,
          password: "",
          showPassword: false,
        },
      }));
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async (item: DocumentCatalogItem) => {
    const existing = docUploads[item.key] || {};
    if (!existing.fileUrl && !existing.uploaded) {
      setError(`Please upload ${item.label} before saving details.`);
      return;
    }

    setSavingKey(item.key);
    setError(null);
    try {
      const form = new FormData();
      form.append(
        "documents",
        JSON.stringify([
          {
            docType: item.key,
            number: existing.number,
            password: existing.password,
            referenceId: existing.fileName || item.label,
          },
        ]),
      );
      form.append("defaultDocType", item.key);
      form.append("name", item.label);

      const docs = await uploadDocument(form);
      setLibrary(docs);
      syncDocUploads(docs);
      updateDocField(item.key, "password", "");
      updateDocField(item.key, "showPassword", false);
    } finally {
      setSavingKey(null);
    }
  };

  const handleDelete = async (item: DocumentCatalogItem) => {
    if (!window.confirm(`Remove ${item.label}?`)) return;
    const docs = await deleteDocument(item.key);
    setLibrary(docs);
    setDocUploads((prev) => {
      const next = { ...prev };
      delete next[item.key];
      return next;
    });
  };

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden bg-[#07162d] text-white">
        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              <ShieldCheck className="h-3.5 w-3.5 text-[#7ee3a2]" />
              Secure document vault
            </div>
            <h3 className="mt-3 text-[26px] font-bold leading-tight">
              Documents Upload
            </h3>
            <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-white/72">
              Upload all your documents to proceed faster with approvals. Keep
              PAN, Aadhaar, income proof, and bank documents ready for partner
              verification.
            </p>
            <p className="mt-3 text-[13px] font-semibold text-[#7ee3a2]">
              Uploaded {uploadedCount} file{uploadedCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-3">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search or select document"
                className="h-11 w-full rounded-full bg-white/10 pl-11 pr-4 text-[14px] font-semibold text-white outline-none ring-1 ring-white/15 placeholder:text-white/45 focus:bg-white/15 focus:ring-[#7ee3a2]"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-[#07162d]"
                onClick={() => setSearch("")}
              >
                <Plus className="h-4 w-4" />
                Add document
              </button>
              <span className="text-[12px] font-bold text-white/55">
                {catalogLoading ? "Loading catalog..." : "Pick a document type"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
          {catalogItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="shrink-0 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white/80 transition hover:bg-white hover:text-[#195585]"
              onClick={() => setSearch(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <StatusRow text="Fetching documents..." />
      ) : error ? (
        <StatusRow intent="error" text={error} />
      ) : visibleDocs.length === 0 ? (
        <StatusRow text="No documents match your search." />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleDocs.map((item) => {
          const state = docUploads[item.key] || {};
          const isUploading = uploadingKey === item.key;
          const isSaving = savingKey === item.key;
          const isUploaded = Boolean(state.uploaded || state.fileUrl);
          const showPassword = Boolean(state.showPassword);

          return (
            <article key={item.key} className="p-4 border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#eef8ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#195585]">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <h4 className="mt-2 text-[18px] font-bold text-[#07162d]">
                    {item.label}
                  </h4>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    item.required
                      ? "bg-[#fff7ed] text-[#c2410c]"
                      : "bg-[#ecfdf3] text-[#079455]"
                  }`}
                >
                  {item.required ? "Required" : "Optional"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#195585] px-3 text-[12px] font-bold text-white">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Take photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) =>
                      handleUpload(item, event.target.files?.[0])
                    }
                  />
                </label>
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#c7d7e8] bg-white px-3 text-[12px] font-bold text-[#195585]">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  Browse files
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={(event) =>
                      handleUpload(item, event.target.files?.[0])
                    }
                  />
                </label>
              </div>

              <div className="mt-3 bg-white/85 p-3 ring-1 ring-[#e4edf5]">
                {state.fileUrl ? (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-[#eef8ff] text-[#195585]">
                      {isImageUrl(state.fileUrl) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={state.fileUrl}
                          alt={state.fileName || item.label}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-[#07162d]">
                        {state.fileName || item.label}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                        Tap to replace document
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 border border-dashed border-[#c7d7e8] bg-[#f8fcff] p-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#07162d]">
                      {isUploading
                        ? "Uploading..."
                        : isUploaded
                          ? state.fileName || "Uploaded"
                          : "Drag & drop file here"}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                      {isUploaded ? "Tap to replace" : "or click to browse"}
                    </p>
                  </div>
                  <UploadCloud className="h-6 w-6 text-[#195585]" />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <BottomInput
                  label={item.numberLabel || "Document Number"}
                  value={state.number || ""}
                  placeholder={`Enter ${item.numberLabel || "number"}`}
                  onChange={(value) =>
                    updateDocField(item.key, "number", value)
                  }
                />
                <label className="group block pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#667085] transition group-focus-within:text-[#195585]">
                    Password if required
                  </span>
                  <div className="relative mt-1 flex h-11 items-center gap-2 border-b border-[#cfddea]">
                    <Lock className="h-4 w-4 text-[#98a2b3]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={state.password || ""}
                      onChange={(event) =>
                        updateDocField(item.key, "password", event.target.value)
                      }
                      placeholder="Enter password"
                      className="peer h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:placeholder:text-[#c8d5e1]"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="text-[#98a2b3] transition hover:text-[#195585]"
                      onClick={() =>
                        updateDocField(item.key, "showPassword", !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-[#195585] px-4 text-[12px] font-semibold text-white disabled:opacity-60"
                  onClick={() => handleSave(item)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Details"}
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-[#fff1f2] px-4 text-[12px] font-semibold text-[#be123c]"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="bg-[#f8fcff] p-3.5 text-[12px] font-medium leading-6 text-[#667085]">
        Disclaimer: Uploaded documents are used only for verification,
        compliance, and partner fulfilment. Passwords are submitted only when a
        lender or document issuer requires them to open a protected file.
      </p>
    </div>
  );
}

function BottomInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group block pt-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#667085] transition group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="peer h-11 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[14px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:placeholder:text-[#c8d5e1]"
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 peer-focus:scale-x-100" />
      </div>
    </label>
  );
}

function StatusRow({
  text,
  intent = "info",
}: {
  text: string;
  intent?: "info" | "error";
}) {
  const isError = intent === "error";
  const Icon = isError ? AlertTriangle : FileText;
  return (
    <div
      className={`flex items-center gap-3 p-3.5 text-[13px] font-semibold ${
        isError ? "bg-[#fff1f2] text-[#b42318]" : "bg-[#f8fcff] text-[#195585]"
      }`}
    >
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}
