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
  referenceLabel = "Application Number",
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
      className="rounded-xl bg-emerald-50 px-4 py-4 text-[#12352a] sm:px-5"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold leading-6 text-[#153d2e]">
            {message}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5d756c]">
                {referenceLabel}
              </p>
              <p className="mt-1 break-all font-mono text-[15px] font-extrabold tracking-wide text-[#102a20]">
                {referenceId}
              </p>
            </div>
            <button
              type="button"
              onClick={copyReference}
              className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4c1d95] px-3 text-[11px] font-extrabold text-white transition-colors hover:bg-[#004d8d]"
              aria-label={`Copy ${referenceLabel}`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy Number"}
            </button>
          </div>
          <Link
            href={`/application-status?applicationId=${encodeURIComponent(referenceId)}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-extrabold text-emerald-800 no-underline hover:text-emerald-950 hover:underline"
          >
            Track this application
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
