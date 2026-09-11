"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";
import type { ServiceRequestRecord } from "@/services/serviceRequests";

const formatDate = (value?: string) => {
  if (!value) return "Not updated yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated yet";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ServiceRequestProgress({
  request,
  loading,
  showQueryId = true,
}: {
  request: ServiceRequestRecord | null;
  loading?: boolean;
  showQueryId?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#dce9f7] bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.05)]">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#4c1d95]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading latest progress...
        </div>
      </div>
    );
  }

  if (!request) return null;

  const currentItem = request.timeline?.[request.currentStageIndex];
  const latestFollowUps = (request.followUpHistory || []).slice(-3).reverse();

  return (
    <div className="rounded-2xl border border-[#dce9f7] bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.05)] md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-[13px] font-extrabold uppercase tracking-wide text-[#4c1d95]">
            Progress
          </p>
          <h3 className="mt-1 text-[20px] font-extrabold text-[#1f2937]">
            {request.currentStage}
          </h3>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085] md:text-[15px]">
            {currentItem?.remarks ||
              "Our team will update remarks as the case moves."}
          </p>
        </div>
        {showQueryId ? (
          <div
            data-service-query-id={request.queryId}
            className="rounded-xl bg-[#eef7ff] px-4 py-3 text-[13px] font-bold text-[#4c1d95]"
          >
            Query ID: {request.queryId}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-[#edf2f7] bg-[#fbfdff] p-3">
          <p className="text-[12px] font-extrabold text-[#98a2b3]">
            Assigned Executive
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#1f2937]">
            {request.assignedExecutive || "Pending assignment"}
          </p>
        </div>
        <div className="rounded-xl border border-[#edf2f7] bg-[#fbfdff] p-3">
          <p className="text-[12px] font-extrabold text-[#98a2b3]">
            Updated By
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#1f2937]">
            {currentItem?.updatedBy || "System"}
          </p>
        </div>
        <div className="rounded-xl border border-[#edf2f7] bg-[#fbfdff] p-3">
          <p className="text-[12px] font-extrabold text-[#98a2b3]">
            Last Updated
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#1f2937]">
            {formatDate(currentItem?.updatedAt || request.updatedAt)}
          </p>
        </div>
        <div className="rounded-xl border border-[#edf2f7] bg-[#fbfdff] p-3">
          <p className="text-[12px] font-extrabold text-[#98a2b3]">
            Next Follow-up
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#1f2937]">
            {request.followUpStatus === "cancelled"
              ? "Cancelled"
              : formatDate(request.followUpAt)}
          </p>
          {request.followUpNote ? (
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
              {request.followUpNote}
            </p>
          ) : null}
        </div>
      </div>

      {latestFollowUps.length ? (
        <div className="mt-6 rounded-xl border border-[#e5edf6] bg-[#f8fbff] p-4">
          <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#1f2937]">
            <CalendarClock className="h-4 w-4 text-[#4c1d95]" />
            Latest follow-up updates
          </div>
          <div className="mt-3 grid gap-2">
            {latestFollowUps.map((followUp, index) => (
              <div
                key={`${followUp.updatedAt || followUp.scheduledAt || "follow-up"}:${index}`}
                className="rounded-lg border border-[#e8eef5] bg-white px-3 py-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-extrabold text-[#344054]">
                    {formatDate(followUp.scheduledAt)}
                  </p>
                  <span className="rounded-full bg-[#eef7ff] px-2.5 py-1 text-[11px] font-extrabold capitalize text-[#4c1d95]">
                    {followUp.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                  {followUp.note || "Follow-up schedule updated"}
                  {followUp.assignedExecutive
                    ? ` · ${followUp.assignedExecutive}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {request.timeline?.map((item, index) => {
          const completed = item.status === "completed";
          const active = item.status === "active";
          return (
            <div key={item.stage} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  completed
                    ? "bg-[#1cb45c] text-white"
                    : active
                      ? "bg-[#4c1d95] text-white"
                      : "bg-[#e8eef5] text-[#98a2b3]"
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : active ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <span className="text-[11px] font-extrabold">
                    {index + 1}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1 border-b border-[#edf2f7] pb-3">
                <p className="text-[14px] font-extrabold text-[#1f2937]">
                  {item.stage}
                </p>
                <p className="mt-1 text-[13px] font-semibold leading-5 text-[#8b95a3]">
                  {item.remarks || "Awaiting update"} ·{" "}
                  {formatDate(item.updatedAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
