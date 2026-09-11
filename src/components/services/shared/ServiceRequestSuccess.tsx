"use client";

import { CheckCircle2, ClipboardCheck, Clock3 } from "lucide-react";
import type { ServiceRequestRecord } from "@/services/serviceRequests";

export function ServiceRequestSuccess({
  request,
  title,
  message,
}: {
  request: ServiceRequestRecord;
  title: string;
  message: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-[#bfe8d0] bg-white shadow-[0_16px_42px_rgba(16,24,40,0.08)]"
    >
      <div className="relative bg-linear-to-r from-[#e8f8ef] via-white to-[#e8f4ff] px-5 py-5 md:px-6">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#1cb45c]/10" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1cb45c] text-white shadow-[0_14px_28px_rgba(28,180,92,0.25)]">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[13px] font-extrabold uppercase tracking-wide text-[#128545]">
                Request Created Successfully
              </p>
              <h3 className="mt-1 text-[20px] font-extrabold text-[#1f2937] md:text-[22px]">
                {title}
              </h3>
              <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#667085] md:text-[15px]">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-5 py-4 md:grid-cols-3 md:px-6">
        <div className="flex items-start gap-3 rounded-xl bg-[#f8fbff] p-3">
          <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#4c1d95]" />
          <div>
            <p className="text-[13px] font-extrabold text-[#1f2937]">
              Current Stage
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              {request.currentStage}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-[#f8fbff] p-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#4c1d95]" />
          <div>
            <p className="text-[13px] font-extrabold text-[#1f2937]">
              What happens next?
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-5 text-[#667085]">
              Our executive will review your details and contact you shortly.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-[#f8fbff] p-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1cb45c]" />
          <div>
            <p className="text-[13px] font-extrabold text-[#1f2937]">
              Track anytime
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-5 text-[#667085]">
              Open request tracking whenever you need the latest status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
