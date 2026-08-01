"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, PlusCircle, Sparkles } from "lucide-react";
import {
  createTicket,
  SUPPORT_TICKET_CATEGORIES,
} from "@/services/accountHelp";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";

export function SupportTicketForm({
  onCreated,
}: {
  onCreated: () => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: SUPPORT_TICKET_CATEGORIES[0].value as string,
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Add a subject and description.");
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent.");
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        tags: [form.category],
        ...buildWebsiteConsentPayload("website_support_ticket"),
      });
      setForm({
        title: "",
        description: "",
        category: SUPPORT_TICKET_CATEGORIES[0].value,
      });
      setWhatsappConsent(false);
      setCreated(true);
      await onCreated();
    } catch (submitError) {
      setError(
        (submitError as Error)?.message?.replace(/^[^\w]+/, "") ||
          "Ticket could not be created. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-5 sm:p-7"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
        <Sparkles className="h-3.5 w-3.5" />
        New ticket
      </div>
      <h2 className="mt-4 text-[24px] font-extrabold text-[#07162d]">
        Create a support ticket
      </h2>
      <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
        Add the product, issue, and reference number if available. Clear details
        help the support team route your request faster.
      </p>

      <div className="mt-6 grid gap-5">
        <BottomField
          label="Subject"
          placeholder="Example: Need help with document verification"
          value={form.title}
          onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
        />

        <label className="group block pt-2">
          <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085] transition group-focus-within:text-[#195585]">
            Category
          </span>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
            className="mt-1 h-12 w-full border-0 border-b border-[#cfddea] bg-transparent text-[15px] font-semibold text-[#07162d] outline-none focus:border-[#195585]"
          >
            {SUPPORT_TICKET_CATEGORIES.map((category, index) => (
              <option
                key={`${category.label}-${index}`}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="group relative block pt-2">
          <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
            Description
          </span>
          <div className="relative mt-1">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={4}
              className="peer w-full resize-none border-0 border-b border-[#cfddea] bg-transparent px-0 py-3 text-[15px] font-semibold leading-7 text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:placeholder:text-[#c8d5e1]"
              placeholder="Describe the issue, application ID, product, and expected help"
            />
            <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
          </div>
        </label>
      </div>

      <WhatsAppConsent
        checked={whatsappConsent}
        className="mt-5"
        onChange={(checked) => {
          setWhatsappConsent(checked);
          if (checked) setError("");
        }}
      />

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-[#07162d] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] font-semibold leading-6 text-white/72">
          {created
            ? "Ticket submitted. Your recent tickets were refreshed."
            : "You can continue the conversation once a ticket appears in the list."}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[13px] font-extrabold text-[#195585] disabled:opacity-60"
        >
          {submitting ? (
            <MessageCircle className="h-4 w-4" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          {submitting ? "Creating..." : "Create ticket"}
        </button>
      </div>
    </form>
  );
}

function BottomField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
      </div>
    </label>
  );
}
