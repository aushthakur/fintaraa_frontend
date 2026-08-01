"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
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
    createdAt: "",
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
  const [chatError, setChatError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userId = useMemo(() => getStoredUserId(), []);

  useEffect(() => {
    let active = true;
    if (!ticket?.id) {
      queueMicrotask(() => {
        if (!active) return;
        setDetail(null);
        setMessages([]);
        setChatError("");
      });
      return () => {
        active = false;
      };
    }
    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setChatError("");
      fetchTicketById(ticket.id)
        .then((data) => {
          if (!active) return;
          setDetail(data);
          setMessages(data?.interactions?.length ? data.interactions : []);
        })
        .catch((error) => {
          if (!active) return;
          setDetail(null);
          setMessages([]);
          setChatError(
            (error as Error)?.message?.replace(/^[^\w]+/, "") ||
              "Conversation could not be loaded.",
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [ticket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (ticket?.id) inputRef.current?.focus();
  }, [ticket?.id]);

  const selectedTitle =
    detail?.title || ticket?.title || "Support conversation";
  const assigneeId = detail?.assignee?.id || ticket?.assigneeId;
  const assigneeName =
    detail?.assignee?.name || ticket?.assigneeName || "Support";
  const displayMessages = ticket ? messages : starterMessages;
  const closed = (ticket?.status || "").toLowerCase() === "closed";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !ticket?.id || sending || closed) return;

    const optimistic: SupportInteraction = {
      id: `local-${Date.now()}`,
      content: trimmed,
      senderId: userId || "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setChatError("");
    setSending(true);
    try {
      const updated = await addTicketInteraction({
        ticketId: ticket.id,
        content: trimmed,
      });
      if (updated) {
        setDetail(updated);
        setMessages(updated.interactions || []);
        await onTicketUpdated();
      }
    } catch (error) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimistic.id),
      );
      setInput(trimmed);
      setChatError(
        (error as Error)?.message?.replace(/^[^\w]+/, "") ||
          "Message could not be sent. Please try again.",
      );
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <section className="flex min-h-[42rem] flex-col overflow-hidden rounded-3xl border border-[#dfeaf4] bg-white shadow-[0_20px_55px_rgba(25,85,133,0.10)]">
      <div className="flex flex-col gap-4 border-b border-[#e4edf5] bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#195585] text-white shadow-[0_10px_24px_rgba(25,85,133,0.22)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
              Ticket chat
            </p>
            <h2 className="mt-1 truncate text-[22px] font-extrabold text-[#07162d]">
              {selectedTitle}
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#667085]">
              {loading
                ? "Loading conversation..."
                : assigneeId
                  ? `Assigned to ${assigneeName}`
                  : "Waiting for a support specialist"}
            </p>
            {ticket?.id ? (
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                Ticket #{ticket.id.slice(-8)}
              </p>
            ) : null}
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#079455]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {ticket?.status || "Ready"}
        </span>
      </div>

      <div
        className="flex-1 space-y-4 overflow-y-auto bg-linear-to-b from-[#f8fcff] to-[#f3f8fc] p-5"
        aria-live="polite"
      >
        {!ticket ? (
          <Notice text="Choose a ticket from the left, or create a new one to start tracking a support request." />
        ) : !assigneeId ? (
          <Notice text="Your ticket is in the support queue. You can send a message now—it will be saved for the specialist who picks it up." />
        ) : null}

        {chatError ? <Notice text={chatError} tone="error" /> : null}

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
                  className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-[0_8px_22px_rgba(25,85,133,0.07)] ${
                    mine
                      ? "rounded-br-md bg-[#195585] text-white"
                      : "rounded-bl-md border border-[#e4edf5] bg-white text-[#07162d]"
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
                  {message.attachments?.length ? (
                    <div className="mt-2 grid gap-1">
                      {message.attachments.map((attachment, index) => (
                        <a
                          key={`${attachment.url}-${index}`}
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`truncate text-[11px] font-bold underline ${
                            mine ? "text-white/80" : "text-[#195585]"
                          }`}
                        >
                          {attachment.name || `Attachment ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <Notice text="No messages in this ticket yet. Start the conversation below." />
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={submit}
        className="border-t border-[#e4edf5] bg-white p-4"
      >
        {closed ? (
          <p className="mb-3 rounded-xl bg-[#f2f4f7] px-3 py-2 text-[12px] font-bold text-[#667085]">
            This ticket is closed. Create a new ticket if you need more help.
          </p>
        ) : null}
        <div className="flex items-end gap-3 rounded-2xl border border-[#cfdeeb] bg-[#fbfdff] p-2 transition focus-within:border-[#195585] focus-within:ring-4 focus-within:ring-[#195585]/10">
          <label className="block flex-1">
            <span className="sr-only">Support message</span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={2}
              maxLength={2000}
              aria-label="Support message"
              placeholder={
                ticket
                  ? "Write a message to the support team..."
                  : "Select a ticket to start a conversation"
              }
              disabled={!ticket || closed}
              className="min-h-14 w-full resize-none border-0 bg-transparent px-2 py-2 text-[14px] font-semibold leading-6 text-[#07162d] outline-none placeholder:text-[#98a2b3] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={!ticket || !input.trim() || sending || closed}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#195585] text-white shadow-[0_8px_18px_rgba(25,85,133,0.20)] transition hover:bg-[#12466f] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold text-[#98a2b3]">
          <span>Press Enter to send · Shift + Enter for a new line</span>
          <span>{input.length}/2000</span>
        </div>
      </form>
    </section>
  );
}

function Notice({
  text,
  tone = "info",
}: {
  text: string;
  tone?: "info" | "error";
}) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border p-4 text-[13px] font-semibold leading-6 ${
        tone === "error"
          ? "border-[#fecdca] bg-[#fef3f2] text-[#b42318]"
          : "border-[#e4edf5] bg-white text-[#667085]"
      }`}
    >
      <AlertCircle
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          tone === "error" ? "text-[#f04438]" : "text-[#f97316]"
        }`}
      />
      {text}
    </div>
  );
}
