"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
} from "lucide-react";

export function SubmissionSuccessNotice({
  message,
  referenceId,
  referenceLabel = "Application ID",
}: {
  message: string;
  referenceId: string;
  referenceLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
    >
      <div className="flex items-start gap-2.5">
        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold leading-5">{message}</p>
          <div className="mt-3 flex flex-col gap-3 rounded-lg border border-emerald-200/80 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                {referenceLabel}
              </p>
              <p className="mt-1 break-all font-mono text-[14px] font-extrabold text-[#12352a]">
                {referenceId}
              </p>
            </div>
            <button
              type="button"
              onClick={copyReference}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-extrabold text-emerald-800 transition-colors hover:bg-emerald-100"
              aria-label={`Copy ${referenceLabel}`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy ID"}
            </button>
          </div>
          <Link
            href={`/application-status?applicationId=${encodeURIComponent(referenceId)}`}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold text-emerald-800 no-underline hover:underline"
          >
            Track this application
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
