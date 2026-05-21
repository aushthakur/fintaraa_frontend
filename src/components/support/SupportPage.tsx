"use client";

import { SupportHero } from "@/components/support/SupportHero";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { SupportChatPanel } from "@/components/support/SupportChatPanel";
import { fetchTickets, type SupportTicket } from "@/services/accountHelp";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { SupportTicketList } from "@/components/support/SupportTicketList";
import {
  FileText,
  Headphones,
  PlusCircle,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

const quickStats = [
  { label: "Service desk", value: "Live", icon: Headphones },
  { label: "Ticket history", value: "Synced", icon: FileText },
  { label: "Secure context", value: "Protected", icon: ShieldCheck },
  { label: "Follow-ups", value: "Timed", icon: TimerReset },
];

export function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets();
      setTickets(data);
      setSelectedTicket((current) => {
        if (current && data.some((ticket) => ticket.id === current.id)) {
          return data.find((ticket) => ticket.id === current.id) || current;
        }
        return data[0] || null;
      });
      if (!data.length) setError("No open tickets right now.");
    } catch {
      setError("Unable to load tickets right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadTickets();
    });
  }, [loadTickets]);

  const activeCount = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          !["closed", "resolved"].some((status) =>
            ticket.status.toLowerCase().includes(status),
          ),
      ).length,
    [tickets],
  );

  return (
    <main className="bg-gray-100">
      <SupportHero />

      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-4">
          {quickStats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white p-4 shadow-[0_12px_30px_rgba(25,85,133,0.07)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#195585]">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[18px] font-extrabold text-[#07162d]">
                  {label === "Ticket history" ? tickets.length : value}
                </span>
                <span className="text-[12px] font-semibold text-[#667085]">
                  {label === "Ticket history" ? `${activeCount} active` : label}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-9xl flex-col gap-3 bg-[#195585] p-4 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#7ee3a2]">
              Need help now?
            </p>
            <h2 className="mt-1 text-[22px] font-extrabold">
              Create a support ticket from the top workspace
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-6 text-white/70">
              Share your issue once, then track updates and continue the chat
              from your ticket history.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[13px] font-extrabold text-[#195585]"
          >
            <PlusCircle className="h-4 w-4" />
            Create ticket
          </button>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl items-start gap-6 xl:grid-cols-[25rem_minmax(0,1fr)]">
          <div className="grid gap-5 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pr-1 scrollbar-thin">
            <SupportTicketList
              tickets={tickets}
              loading={loading}
              error={error}
              selectedId={selectedTicket?.id}
              onSelect={setSelectedTicket}
              onRetry={loadTickets}
            />
          </div>

          <div className="xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto scrollbar-thin">
            <SupportChatPanel
              ticket={selectedTicket}
              onTicketUpdated={loadTickets}
            />
          </div>
        </div>
      </section>

      <Modal
        isVisible={createOpen}
        onClose={() => setCreateOpen(false)}
        width="w-[calc(100%-2rem)] max-w-3xl"
        hidePadding
      >
        <SupportTicketForm
          onCreated={async () => {
            await loadTickets();
            setCreateOpen(false);
          }}
        />
      </Modal>
    </main>
  );
}
