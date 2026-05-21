"use client";

import { AlertTriangle, ChevronRight, Clock3, Inbox } from "lucide-react";
import type { SupportTicket } from "@/services/accountHelp";

function statusColor(status?: string) {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("progress")) return "#f59e0b";
  if (normalized.includes("resolved") || normalized.includes("closed")) {
    return "#10b981";
  }
  if (normalized.includes("pending")) return "#06b6d4";
  if (normalized.includes("new") || normalized.includes("open")) return "#6366f1";
  return "#94a3b8";
}

function formatDate(value?: string) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SupportTicketList({
  tickets,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
}: {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  selectedId?: string;
  onSelect: (ticket: SupportTicket) => void;
  onRetry: () => void;
}) {
  return (
    <section className="bg-white p-5 shadow-[0_18px_45px_rgba(25,85,133,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-black text-[#07162d]">
            Open tickets
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-[#667085]">
            Updated from your support desk
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="h-9 rounded-full bg-[#eef8ff] px-4 text-[12px] font-black text-[#195585]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <StateCard icon={Clock3} title="Fetching tickets..." text="Please wait while we load recent support requests." />
        ) : error ? (
          <StateCard icon={AlertTriangle} title="Unable to load tickets" text={error} />
        ) : tickets.length === 0 ? (
          <StateCard icon={Inbox} title="No open tickets" text="Create a ticket and it will appear here." />
        ) : (
          tickets.map((ticket) => {
            const color = statusColor(ticket.status);
            const selected = selectedId === ticket.id;
            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelect(ticket)}
                className={`group relative overflow-hidden p-4 text-left shadow-[0_10px_26px_rgba(25,85,133,0.05)] transition hover:-translate-y-0.5 ${
                  selected ? "bg-[#eef8ff]" : "bg-[#f8fcff]"
                }`}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 w-1"
                  style={{ backgroundColor: color }}
                />
                <span className="flex items-start justify-between gap-3 pl-2">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-black text-[#07162d]">
                      {ticket.title}
                    </span>
                    <span className="mt-2 block text-[12px] font-semibold text-[#667085]">
                      {ticket.priority ? `Priority: ${ticket.priority}` : "Priority: Normal"} ·{" "}
                      {ticket.assigneeName || "No agent assigned yet"}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#667085]">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(ticket.updatedAt || ticket.createdAt)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]"
                      style={{ backgroundColor: `${color}22`, color }}
                    >
                      {ticket.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#98a2b3] group-hover:text-[#195585]" />
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

function StateCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 bg-[#f8fcff] p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#195585]" />
      <div>
        <p className="text-[14px] font-black text-[#07162d]">{title}</p>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
          {text}
        </p>
      </div>
    </div>
  );
}
