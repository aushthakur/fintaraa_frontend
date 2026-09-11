"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Download,
  Edit3,
  FileText,
  Folder,
  Home,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import {
  createStatementFolder,
  deleteStatementFolder,
  fetchStatementFolders,
  fetchStatements,
  statementUploadItems,
  updateStatementFolder,
  uploadStatement,
  type StatementDoc,
  type StatementFolder,
} from "@/services/accountDocuments";

const themeOptions = [
  { label: "Home Loan", color: "#e0f2fe", icon: "home" },
  { label: "Personal Loan", color: "#fef3c7", icon: "user" },
  { label: "Business Loan", color: "#dcfce7", icon: "briefcase" },
  { label: "Education", color: "#ede9fe", icon: "book" },
  { label: "Vehicle", color: "#fee2e2", icon: "truck" },
  { label: "Other", color: "#e2e8f0", icon: "archive" },
];

const iconMap = {
  archive: Archive,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  home: Home,
  truck: Truck,
  user: UserRound,
};

function formatDate(value?: string) {
  if (!value) return "Recently issued";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StatementsLettersPanel() {
  const [statements, setStatements] = useState<StatementDoc[]>([]);
  const [folders, setFolders] = useState<StatementFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folderError, setFolderError] = useState<string | null>(null);
  const [folderDraftName, setFolderDraftName] = useState("");
  const [folderDraftTheme, setFolderDraftTheme] = useState(themeOptions[0]);
  const [editingFolder, setEditingFolder] = useState<StatementFolder | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const labelByType = useMemo(() => {
    const map = new Map<string, string>();
    statementUploadItems.forEach((item) => map.set(item.key, item.label));
    return map;
  }, []);

  const groupedStatements = useMemo(() => {
    return statements.reduce<Record<string, StatementDoc[]>>((groups, item) => {
      const key = item.docType || "other";
      groups[key] = [...(groups[key] || []), item];
      return groups;
    }, {});
  }, [statements]);

  const orderedGroupKeys = useMemo(() => {
    const keys = statementUploadItems
      .map((item) => item.key)
      .filter((key) => groupedStatements[key]?.length);
    if (groupedStatements.other?.length) keys.push("other");
    return keys;
  }, [groupedStatements]);

  const latestByType = useMemo(() => {
    const map = new Map<string, StatementDoc>();
    statements.forEach((item) => {
      if (!item.docType || map.has(item.docType)) return;
      map.set(item.docType, item);
    });
    return map;
  }, [statements]);

  const visibleUploadItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return statementUploadItems;
    return statementUploadItems.filter((item) =>
      item.label.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setFoldersLoading(true);
      setError(null);
      setFolderError(null);
      const [statementResult, folderResult] = await Promise.allSettled([
        fetchStatements(),
        fetchStatementFolders(),
      ]);

      if (!active) return;

      if (statementResult.status === "fulfilled") {
        setStatements(statementResult.value);
        if (!statementResult.value.length) {
          setError("No statements or letters are available yet.");
        }
      } else {
        setError("Unable to load statements right now.");
      }

      if (folderResult.status === "fulfilled") {
        setFolders(folderResult.value);
        if (!folderResult.value.length) {
          setFolderError("No folders created yet.");
        }
      } else {
        setFolderError("Unable to load folders right now.");
      }

      setLoading(false);
      setFoldersLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const resetFolderDraft = () => {
    setFolderDraftName("");
    setFolderDraftTheme(themeOptions[0]);
    setEditingFolder(null);
  };

  const saveFolder = async () => {
    const name = folderDraftName.trim();
    if (!name) {
      setFolderError("Please enter a folder name.");
      return;
    }
    setFolderError(null);
    const payload = {
      name,
      themeColor: folderDraftTheme.color,
      themeIcon: folderDraftTheme.icon,
    };

    if (editingFolder) {
      const updated = await updateStatementFolder(editingFolder.id, payload);
      setFolders((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } else {
      const created = await createStatementFolder(payload);
      setFolders((prev) => [created, ...prev]);
    }
    resetFolderDraft();
  };

  const removeFolder = async (folder: StatementFolder) => {
    if (!window.confirm(`Delete ${folder.name} and its documents?`)) return;
    await deleteStatementFolder(folder.id);
    setFolders((prev) => prev.filter((item) => item.id !== folder.id));
  };

  const handleStatementUpload = async (
    item: (typeof statementUploadItems)[number],
    file?: File,
  ) => {
    if (!file) return;
    setUploadingType(item.key);
    try {
      const form = new FormData();
      form.append("statementFile", file);
      form.append("docType", item.key);
      form.append("title", item.label);
      form.append("fileName", file.name);
      const docs = await uploadStatement(form);
      setStatements(docs);
      setError(docs.length ? null : "No statements or letters are available yet.");
    } finally {
      setUploadingType(null);
    }
  };

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 bg-linear-to-br from-[#07162d] via-[#3b0764] to-[#0f766e] p-4 text-white lg:grid-cols-[1fr_0.78fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7ee3a2]" />
            Secure PDFs with audit trails
          </div>
          <h3 className="mt-3 text-[26px] font-bold leading-tight">
            Download ready
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-white/75">
            Sanction letters, repayment schedules, welcome kits, and account
            statements stay organized by loan type and can be shared instantly.
          </p>
        </div>
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search statements and letters"
            className="h-11 w-full rounded-full bg-white/10 pl-11 pr-4 text-[14px] font-semibold text-white outline-none ring-1 ring-white/15 placeholder:text-white/45 focus:bg-white/15 focus:ring-[#7ee3a2]"
          />
        </label>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h4 className="text-[20px] font-bold text-[#07162d]">
              Product folders
            </h4>
            <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-6 text-[#667085]">
              Organize documents by product type. Each folder can hold multiple
              images and a saved color theme.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#3b0764] px-4 text-[12px] font-semibold text-white"
            onClick={saveFolder}
          >
            <Plus className="h-4 w-4" />
            {editingFolder ? "Update folder" : "Add folder"}
          </button>
        </div>

        <div className="grid gap-3 bg-[#f8fcff] p-3.5 md:grid-cols-[1fr_1.2fr]">
          <input
            value={folderDraftName}
            onChange={(event) => setFolderDraftName(event.target.value)}
            placeholder="Folder name"
            className="h-11 border-0 border-b border-[#cfddea] bg-transparent text-[14px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#3b0764]"
          />
          <div className="flex gap-2 overflow-x-auto">
            {themeOptions.map((option) => {
              const Icon =
                iconMap[option.icon as keyof typeof iconMap] || Archive;
              const active = folderDraftTheme.label === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  className={`flex shrink-0 items-center gap-2 px-3 py-1.5 text-[12px] font-semibold transition ${
                    active ? "bg-[#07162d] text-white" : "bg-white text-[#07162d]"
                  }`}
                  onClick={() => setFolderDraftTheme(option)}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#07162d]"
                    style={{ backgroundColor: option.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {foldersLoading ? (
          <StatusRow text="Loading folders..." />
        ) : folderError ? (
          <StatusRow text={folderError} />
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          {folders.map((folder) => {
            const Icon =
              iconMap[folder.themeIcon as keyof typeof iconMap] || Archive;
            return (
              <article
                key={folder.id}
                className="bg-white p-3.5 shadow-[0_10px_26px_rgba(25,85,133,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#07162d]"
                    style={{ backgroundColor: folder.themeColor || "#e2e8f0" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="truncate text-[15px] font-semibold text-[#07162d]">
                      {folder.name}
                    </h5>
                    <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                      {folder.count ? `${folder.count} files` : "No files yet"}
                    </p>
                  </div>
                  <a
                    href={folder.latestUrl || "#"}
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-[#f8fcff] px-3 text-[12px] font-semibold text-[#07162d] no-underline"
                  >
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-2 rounded-full bg-[#eef8ff] px-3 text-[12px] font-semibold text-[#3b0764]"
                    onClick={() => {
                      setEditingFolder(folder);
                      setFolderDraftName(folder.name);
                      setFolderDraftTheme(
                        themeOptions.find(
                          (option) => option.icon === folder.themeIcon,
                        ) || {
                          label: folder.name,
                          color: folder.themeColor || "#e2e8f0",
                          icon: folder.themeIcon || "archive",
                        },
                      );
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-2 rounded-full bg-[#fff1f2] px-3 text-[12px] font-semibold text-[#be123c]"
                    onClick={() => removeFolder(folder)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h4 className="text-[20px] font-bold text-[#07162d]">
            Upload statements and letters
          </h4>
          <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-6 text-[#667085]">
            Select the exact document type before uploading so the file appears
            in the right group for download and partner review.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {visibleUploadItems.map((item) => {
            const latest = latestByType.get(item.key);
            const uploading = uploadingType === item.key;
            return (
              <label
                key={item.key}
                className="block cursor-pointer bg-linear-to-br from-[#f8fcff] to-white p-3.5 shadow-[0_8px_22px_rgba(25,85,133,0.045)] transition hover:-translate-y-0.5"
              >
                <input
                  type="file"
                  className="sr-only"
                  onChange={(event) =>
                    handleStatementUpload(item, event.target.files?.[0])
                  }
                />
                <FileText className="h-6 w-6 text-[#3b0764]" />
                <h5 className="mt-3 min-h-9 text-[14px] font-semibold leading-5 text-[#07162d]">
                  {item.label}
                </h5>
                <p className="mt-1.5 min-h-9 text-[12px] font-medium leading-5 text-[#667085]">
                  {latest
                    ? `${latest.title} · ${formatDate(latest.issuedOn)}`
                    : "No file uploaded yet."}
                </p>
                <span className="mt-3 inline-flex h-8 items-center gap-2 rounded-full bg-[#3b0764] px-3 text-[12px] font-semibold text-white">
                  <UploadCloud className="h-3.5 w-3.5" />
                  {uploading ? "Uploading..." : latest ? "Replace" : "Upload"}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <h4 className="text-[20px] font-bold text-[#07162d]">
          Available downloads
        </h4>
        {loading ? <StatusRow text="Loading statements..." /> : null}
        {!loading && error ? <StatusRow text={error} /> : null}
        <div className="grid gap-3">
          {orderedGroupKeys.map((key) => (
            <div key={key} className="grid gap-3">
              <h5 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#3b0764]">
                {labelByType.get(key) || "Other Documents"}
              </h5>
              {groupedStatements[key].map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 bg-white p-3.5 shadow-[0_8px_22px_rgba(25,85,133,0.045)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#3b0764]">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h6 className="text-[15px] font-semibold text-[#07162d]">
                        {item.title}
                      </h6>
                      <p className="mt-1 text-[12px] font-medium text-[#667085]">
                        {item.subtitle || item.fileName || "Official document"} ·{" "}
                        {formatDate(item.issuedOn)}
                        {item.size ? ` · ${item.size}` : ""}
                      </p>
                    </div>
                  </div>
                  <a
                    href={item.url || "#"}
                    target={item.url ? "_blank" : undefined}
                    rel={item.url ? "noreferrer" : undefined}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#3b0764] px-4 text-[12px] font-semibold text-white no-underline"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <p className="bg-[#f8fcff] p-3.5 text-[12px] font-medium leading-6 text-[#667085]">
        Disclaimer: Documents appear based on partner confirmation, disbursal,
        policy issuance, and regulatory availability. Downloaded files may carry
        lender-specific password rules or validity windows.
      </p>
    </div>
  );
}

function StatusRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#f8fcff] p-3.5 text-[13px] font-semibold text-[#3b0764]">
      <Folder className="h-4 w-4" />
      {text}
    </div>
  );
}
