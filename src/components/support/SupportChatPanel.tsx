"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Paperclip,
  Send,
  UserRound,
} from "lucide-react";
import {
  addTicketInteraction,
  fetchTicketById,
  type SupportInteraction,
  type SupportTicket,
  type SupportTicketDetail,
} from "@/services/accountHelp";

const starterMessages: SupportInteraction[] = [
  {
    id: "system-welcome",
    content:
      "Select a ticket to view the conversation. If no agent is assigned yet, you can still prepare the next message here.",
    senderId: "support",
    createdAt: new Date().toISOString(),
  },
];

function getStoredUserId() {
  if (typeof window === "undefined") return "";
  const keys = ["user", "authUser", "employee", "admin"];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const id = parsed?._id || parsed?.id || parsed?.userId;
      if (id) return String(id);
    } catch {
      continue;
    }
  }
  return "";
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SupportChatPanel({
  ticket,
  onTicketUpdated,
}: {
  ticket?: SupportTicket | null;
  onTicketUpdated: () => Promise<void> | void;
}) {
  const [detail, setDetail] = useState<SupportTicketDetail | null>(null);
  const [messages, setMessages] =
    useState<SupportInteraction[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const userId = useMemo(() => getStoredUserId(), []);

  useEffect(() => {
    let active = true;
    if (!ticket?.id) {
      return;
    }
    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      fetchTicketById(ticket.id)
        .then((data) => {
          if (!active) return;
          setDetail(data);
          setMessages(data?.interactions?.length ? data.interactions : []);
        })
        .catch(() => {
          if (!active) return;
          setDetail(null);
          setMessages([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [ticket?.id]);

  const selectedTitle =
    detail?.title || ticket?.title || "Support conversation";
  const assigneeId = detail?.assignee?.id || ticket?.assigneeId;
  const assigneeName =
    detail?.assignee?.name || ticket?.assigneeName || "Support";
  const displayMessages = ticket ? messages : starterMessages;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !ticket?.id) return;

    const optimistic: SupportInteraction = {
      id: `local-${Date.now()}`,
      content: trimmed,
      senderId: userId || "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    if (!userId || !assigneeId) return;

    setSending(true);
    try {
      const updated = await addTicketInteraction({
        ticketId: ticket.id,
        content: trimmed,
        initiator: userId,
        receiver: assigneeId,
      });
      if (updated) {
        setDetail(updated);
        setMessages(updated.interactions || []);
        await onTicketUpdated();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="flex min-h-168 flex-col bg-white shadow-[0_18px_45px_rgba(25,85,133,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#e4edf5] p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#195585] text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
              Ticket chat
            </p>
            <h2 className="mt-1 text-[22px] font-extrabold text-[#07162d]">
              {selectedTitle}
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#667085]">
              {loading
                ? "Loading conversation..."
                : `Assigned to ${assigneeName}`}
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#079455]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {ticket?.status || "Ready"}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fcff] p-5">
        {!ticket ? (
          <Notice text="Choose a ticket from the left, or create a new one to start tracking a support request." />
        ) : !assigneeId ? (
          <Notice text="No agent is assigned yet. Messages you type are shown locally until the ticket is picked up by support." />
        ) : null}

        {displayMessages.length ? (
          displayMessages.map((message) => {
            const mine =
              message.senderId === userId || message.senderId === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#195585] text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                ) : null}
                <div
                  className={`max-w-[78%] p-3 shadow-[0_8px_22px_rgba(25,85,133,0.06)] ${
                    mine ? "bg-[#195585] text-white" : "bg-white text-[#07162d]"
                  }`}
                >
                  <p className="text-[13px] font-semibold leading-6">
                    {message.content || "Attachment sent"}
                  </p>
                  <p
                    className={`mt-2 text-[10px] font-semibold ${
                      mine ? "text-white/58" : "text-[#98a2b3]"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <Notice text="No messages in this ticket yet. Start the conversation below." />
        )}
      </div>

      <form onSubmit={submit} className="border-t border-[#e4edf5] p-4">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#195585]"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <label className="group relative block flex-1">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={1}
              placeholder={
                ticket
                  ? "Type your message..."
                  : "Select a ticket to start a conversation"
              }
              disabled={!ticket}
              className="peer min-h-11 w-full resize-none border-0 border-b border-[#cfddea] bg-transparent py-2 text-[14px] font-semibold leading-6 text-[#07162d] outline-none placeholder:text-[#98a2b3] disabled:opacity-60"
            />
            <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 peer-focus:scale-x-100" />
          </label>
          <button
            type="submit"
            disabled={!ticket || !input.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#195585] text-white disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="flex gap-3 bg-white p-4 text-[13px] font-semibold leading-6 text-[#667085]">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f97316]" />
      {text}
    </div>
  );
}
