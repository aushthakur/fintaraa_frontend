"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Search,
  LogOut,
  Clock3,
  FileText,
  Newspaper,
  PackageOpen,
  PlayCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  LifeBuoy,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { clearAuthSession } from "@/hooks/authStorage";
import { LogoutConfirmationModal } from "@/components/account/LogoutConfirmationModal";
import {
  fetchFaqs,
  createTicket,
  fetchTickets,
  type FaqItem,
  fetchKnowledge,
  type KnowledgeItem,
  type KnowledgeType,
  type SupportTicket,
} from "@/services/accountHelp";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";

const fallbackFaqs: FaqItem[] = [
  {
    id: "application",
    question: "How do I track my loan or card application?",
    answer:
      "Open My Applications from your account profile. Each application shows the current stage, lender requests, and next action required from your side.",
    categoryName: "Applications",
  },
  {
    id: "documents",
    question: "Which documents are usually required?",
    answer:
      "PAN, Aadhaar, income proof, bank statement, address proof, and product-specific documents may be requested depending on lender policy.",
    categoryName: "Documents",
  },
  {
    id: "support",
    question: "When will support respond to my ticket?",
    answer:
      "Most support requests are reviewed during business hours. Priority issues related to active applications or payments are routed first.",
    categoryName: "Support",
  },
  {
    id: "partners",
    question: "Does Fintaraa approve loans directly?",
    answer:
      "Fintaraa is a financial marketplace. Final approval, pricing, disbursal, and rejection decisions are taken by the lending or insurance partner.",
    categoryName: "Partners",
  },
];

const knowledgeSections: Array<{
  title: string;
  type: KnowledgeType;
  text: string;
  accent: string;
  icon: typeof BookOpen;
}> = [
  {
    title: "Blogs",
    type: "blog",
    text: "Fresh explainers on credit, loans, insurance, and money habits.",
    accent: "#0ea5e9",
    icon: Newspaper,
  },
  {
    title: "Articles",
    type: "article",
    text: "Short guides for documents, eligibility, fees, and repayment.",
    accent: "#22c55e",
    icon: FileText,
  },
  {
    title: "Videos",
    type: "video",
    text: "Quick visual lessons for product decisions and account actions.",
    accent: "#f97316",
    icon: PlayCircle,
  },
  {
    title: "Product Info",
    type: "product_info",
    text: "Understand loan, card, and insurance options before applying.",
    accent: "#6366f1",
    icon: PackageOpen,
  },
  {
    title: "Tutorials",
    type: "tutorial",
    text: "Step-by-step help for profile, uploads, score, and applications.",
    accent: "#14b8a6",
    icon: GraduationCap,
  },
];

const policyLinks = [
  {
    title: "Terms and Conditions",
    href: "/terms-and-conditions",
    text: "User responsibilities, service scope, partner roles, and marketplace terms.",
    color: "#0ea5e9",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    text: "How Fintaraa collects, uses, protects, and shares personal data.",
    color: "#22c55e",
  },
  {
    title: "Grievance Redressal Policy",
    href: "/grievance",
    text: "Escalation path, response timelines, and official grievance contact.",
    color: "#f97316",
  },
  {
    title: "Loan Disclosure & Disclaimer",
    href: "/loan-disclosure",
    text: "Indicative ranges, lender responsibility, fees, and repayment disclosures.",
    color: "#14b8a6",
  },
  {
    title: "Our Lending Partners",
    href: "/partners",
    text: "Institutions and lending partners powering eligible credit journeys.",
    color: "#6366f1",
  },
];

function formatDate(value?: string) {
  if (!value) return "Recently updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ContactSupportPanel() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Application support",
  });

  useEffect(() => {
    let active = true;
    fetchTickets()
      .then((data) => {
        if (active) setTickets(data);
      })
      .catch(() => {
        if (active) setTickets([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const submitTicket = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError("");
    if (!form.title.trim() || !form.description.trim()) {
      setSubmitError("Add a subject and description.");
      return;
    }
    if (!whatsappConsent) {
      setSubmitError("Please accept WhatsApp communication consent.");
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        tags: [form.category],
        ...buildWebsiteConsentPayload("website_account_support_ticket"),
      });
      setForm({ title: "", description: "", category: "Application support" });
      setWhatsappConsent(false);
      const data = await fetchTickets();
      setTickets(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5">
      <HelpHero
        icon={LifeBuoy}
        label="Support desk"
        title="We are here when your application needs attention"
        text="Raise a request, call support, or email the team with your registered mobile number and application reference."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {[
            {
              icon: Phone,
              title: "Call support",
              value: "+91 84482 82679",
              href: "tel:+918448282679",
              note: "Mon - Sat, 9:30 AM - 6:30 PM",
            },
            {
              icon: Mail,
              title: "Email support",
              value: "customercare@fintaraa.com",
              href: "mailto:customercare@fintaraa.com",
              note: "Attach screenshots or documents where relevant.",
            },
            {
              icon: MessageCircle,
              title: "Ticket updates",
              value: loading
                ? "Checking tickets..."
                : `${tickets.length} recent tickets`,
              href: "#recent-tickets",
              note: "Track status and response ownership from this account.",
            },
          ].map(({ icon: Icon, title, value, href, note }) => (
            <a
              key={title}
              href={href}
              className="group flex gap-3 bg-linear-to-br from-[#f8fcff] to-white p-4 text-[#07162d] no-underline shadow-[0_10px_26px_rgba(25,85,133,0.05)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#195585]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold">{title}</span>
                <span className="mt-1 block truncate text-[13px] font-semibold text-[#195585]">
                  {value}
                </span>
                <span className="mt-1 block text-[12px] font-medium leading-5 text-[#667085]">
                  {note}
                </span>
              </span>
            </a>
          ))}
        </div>

        <form
          onSubmit={submitTicket}
          className="grid gap-4 bg-white p-4 shadow-[0_12px_32px_rgba(25,85,133,0.06)]"
        >
          <div>
            <h3 className="text-[20px] font-bold text-[#07162d]">
              Raise a support ticket
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-6 text-[#667085]">
              Share the exact issue, product, and reference details so the team
              can route it correctly.
            </p>
          </div>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
            className="h-11 border-0 border-b border-[#cfddea] bg-transparent text-[14px] font-semibold text-[#07162d] outline-none focus:border-[#195585]"
          >
            <option>Application support</option>
            <option>Document verification</option>
            <option>Payment or EMI</option>
            <option>Account access</option>
            <option>Grievance</option>
          </select>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Subject"
            className="h-11 border-0 border-b border-[#cfddea] bg-transparent text-[14px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#195585]"
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Describe your issue"
            rows={4}
            className="resize-none border-0 border-b border-[#cfddea] bg-transparent py-3 text-[14px] font-medium leading-6 text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#195585]"
          />
          <WhatsAppConsent
            checked={whatsappConsent}
            onChange={(checked) => {
              setWhatsappConsent(checked);
              if (checked) setSubmitError("");
            }}
          />
          {submitError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
              {submitError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            <MessageCircle className="h-4 w-4" />
            {submitting ? "Submitting..." : "Submit ticket"}
          </button>
        </form>
      </div>

      <section id="recent-tickets" className="grid gap-3">
        <h3 className="text-[20px] font-bold text-[#07162d]">Recent tickets</h3>
        {tickets.length ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-3 bg-[#f8fcff] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-[15px] font-semibold text-[#07162d]">
                  {ticket.title}
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#667085]">
                  {formatDate(ticket.updatedAt || ticket.createdAt)} ·{" "}
                  {ticket.assigneeName || "Support team"}
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#079455]">
                {ticket.status}
              </span>
            </div>
          ))
        ) : (
          <SmallNotice text="No recent support tickets found for this account." />
        )}
      </section>
    </div>
  );
}

export function FaqPanel() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(fallbackFaqs[0].id);

  useEffect(() => {
    let active = true;
    fetchFaqs()
      .then((data) => {
        if (active) setFaqs(data);
      })
      .catch(() => {
        if (active) setFaqs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const source = faqs.length ? faqs : fallbackFaqs;
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(source.map((faq) => faq.categoryName || "General")),
      ),
    ],
    [source],
  );
  const visible = source.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" ||
      (faq.categoryName || "General") === activeCategory;
    const normalized = query.trim().toLowerCase();
    const matchesQuery =
      !normalized ||
      faq.question.toLowerCase().includes(normalized) ||
      faq.answer.toLowerCase().includes(normalized);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="grid gap-5">
      <HelpHero
        icon={HelpCircle}
        label={loading ? "Loading FAQ" : "FAQ"}
        title="Quick answers before you raise a ticket"
        text="Browse common questions around applications, document checks, lender decisions, payments, and account access."
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block max-w-md flex-1">
          <Search className="absolute left-0 top-3.5 h-4 w-4 text-[#98a2b3]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search FAQs"
            className="h-11 w-full border-0 border-b border-[#cfddea] bg-transparent pl-7 text-[14px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3] focus:border-[#195585]"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold ${
                activeCategory === category
                  ? "bg-[#195585] text-white"
                  : "bg-[#eef8ff] text-[#195585]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {visible.map((faq) => {
          const open = openId === faq.id;
          return (
            <button
              key={faq.id}
              type="button"
              onClick={() => setOpenId(open ? null : faq.id)}
              className="bg-white p-4 text-left shadow-[0_10px_26px_rgba(25,85,133,0.05)]"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#195585]">
                    {faq.categoryName || "General"}
                  </span>
                  <span className="mt-2 block text-[16px] font-semibold text-[#07162d]">
                    {faq.question}
                  </span>
                </span>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-[#195585] transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
              {open ? (
                <span className="mt-3 block text-[13px] font-medium leading-6 text-[#667085]">
                  {faq.answer}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function KnowledgeCenterPanel() {
  const [data, setData] = useState<Record<string, KnowledgeItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<KnowledgeType>("blog");

  useEffect(() => {
    let active = true;
    Promise.allSettled(
      knowledgeSections.map((section) => fetchKnowledge(section.type, 20)),
    )
      .then((results) => {
        if (!active) return;
        const next: Record<string, KnowledgeItem[]> = {};
        results.forEach((result, index) => {
          next[knowledgeSections[index].type] =
            result.status === "fulfilled" ? result.value : [];
        });
        setData(next);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-5">
      <HelpHero
        icon={BookOpen}
        label={loading ? "Loading content" : "Knowledge hub"}
        title="Learn before you apply"
        text="Read guides, explainers, videos, product notes, and tutorials designed around practical financial decisions."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {knowledgeSections.map((section) => {
          const items = data[section.type] || [];
          const Icon = section.icon;
          const active = section.type === activeType;
          return (
            <button
              key={section.type}
              type="button"
              onClick={() => setActiveType(section.type)}
              className={`min-h-34 p-4 text-left transition hover:-translate-y-0.5 ${
                active
                  ? "bg-[#07162d] text-white shadow-[0_18px_42px_rgba(7,22,45,0.18)]"
                  : "bg-white text-[#07162d] shadow-[0_10px_26px_rgba(25,85,133,0.05)]"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                      active ? "bg-white/12" : "bg-[#eef8ff]"
                    }`}
                    style={{ color: active ? "#fff" : section.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`mt-4 block text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                      active ? "text-white/60" : "text-[#667085]"
                    }`}
                  >
                    {items.length} updates
                  </span>
                  <span className="mt-1 block text-[18px] font-extrabold">
                    {section.title}
                  </span>
                </span>
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    active ? "bg-[#7ee3a2]" : "bg-[#d5e4f2]"
                  }`}
                />
              </span>
              <span
                className={`mt-3 block text-[12px] font-semibold leading-5 ${
                  active ? "text-white/70" : "text-[#667085]"
                }`}
              >
                {section.text}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5">
        {knowledgeSections.map((section) => {
          const items = data[section.type] || [];
          const slides = items.slice(0, 5);
          const Icon = section.icon;

          return (
            <section key={section.type} className="grid gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: section.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#07162d]">
                      {section.title}
                    </h3>
                    <p className="text-[12px] font-semibold text-[#667085]">
                      {section.text}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveType(section.type)}
                  className="shrink-0 text-[12px] font-extrabold text-[#195585]"
                >
                  View all
                </button>
              </div>

              <div className="flex snap-x gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {(slides.length
                  ? slides
                  : [
                      {
                        title: loading ? "Loading..." : "No updates yet.",
                        summary: section.text,
                      },
                    ]
                ).map((item, index) => {
                  const href =
                    item.linkUrl ||
                    (item.slug ? `/knowledge/${item.slug}` : undefined);
                  const card = (
                    <div className="group relative h-52 w-[min(86vw,25rem)] shrink-0 snap-start overflow-hidden bg-[#0f172a] shadow-[0_12px_34px_rgba(7,22,45,0.12)]">
                      {item.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImageUrl}
                          alt={item.title || section.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#eef8ff] to-[#f8fcff] px-6 text-center text-[13px] font-extrabold text-[#98a2b3]">
                          {loading ? "Loading..." : "No cover image"}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#07162d]/90 via-[#07162d]/55 to-transparent p-4 pt-16">
                        <p className="line-clamp-2 text-[15px] font-extrabold leading-5 text-white">
                          {item.title || `${section.title} #${index + 1}`}
                        </p>
                      </div>
                    </div>
                  );

                  return href ? (
                    <a
                      key={`${section.type}-slide-${item._id || item.slug || index}`}
                      href={href}
                      className="block no-underline"
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={`${section.type}-slide-${index}`}>{card}</div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-1.5">
                {(slides.length ? slides : [null]).map((_, index) => (
                  <span
                    key={`${section.type}-dot-${index}`}
                    className="h-1.5 w-5 rounded-full"
                    style={{
                      backgroundColor: index === 0 ? section.accent : "#dbe7f2",
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="bg-white p-4 shadow-[0_12px_32px_rgba(25,85,133,0.06)]">
        {knowledgeSections
          .filter((section) => section.type === activeType)
          .map((section) => {
            const items = data[section.type] || [];
            const Icon = section.icon;
            return (
              <div key={section.type}>
                <div className="flex flex-col gap-3 border-b border-[#e4edf5] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#195585]">
                      Knowledge hub
                    </p>
                    <h3 className="mt-1 text-[24px] font-extrabold text-[#07162d]">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-semibold leading-6 text-[#667085]">
                      {section.text}
                    </p>
                  </div>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: section.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  {(items.length
                    ? items
                    : [
                        {
                          title: loading ? "Loading..." : "No updates yet.",
                          summary: section.text,
                        },
                      ]
                  ).map((item, index) => {
                    const href =
                      item.linkUrl ||
                      (item.slug ? `/knowledge/${item.slug}` : undefined);
                    const row = (
                      <div className="grid gap-3 bg-[#f8fcff] p-3 transition hover:bg-[#eef8ff] sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center">
                        <div className="h-28 overflow-hidden bg-[#eef2f7] sm:h-20">
                          {item.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.coverImageUrl}
                              alt={item.title || section.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[11px] font-extrabold text-[#98a2b3]">
                              No cover
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[15px] font-extrabold text-[#07162d]">
                            {item.title || `${section.title} #${index + 1}`}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-[#667085]">
                            {item.summary || "Open this knowledge update."}
                          </p>
                          <p className="mt-1 text-[11px] font-bold text-[#98a2b3]">
                            {formatDate(item.publishedAt)}
                          </p>
                        </div>
                        <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[#195585] sm:block" />
                      </div>
                    );

                    return href ? (
                      <a
                        key={`${section.type}-row-${item._id || item.slug || index}`}
                        href={href}
                        className="block no-underline"
                      >
                        {row}
                      </a>
                    ) : (
                      <div key={`${section.type}-row-${index}`}>{row}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export function PoliciesPanel() {
  return (
    <div className="grid gap-5">
      <HelpHero
        icon={ShieldCheck}
        label="Legal documents"
        title="Policies, disclosures, and partner information"
        text="Review Fintaraa marketplace terms, privacy practices, grievance process, loan disclosures, and lending partner details."
      />
      <div className="grid gap-3">
        {policyLinks.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="group flex items-center gap-4 bg-white p-4 text-[#07162d] no-underline shadow-[0_10px_26px_rgba(25,85,133,0.05)] transition hover:-translate-y-0.5"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: policy.color }}
            >
              <FileText className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold">
                {policy.title}
              </span>
              <span className="mt-1 block text-[12px] font-medium leading-5 text-[#667085]">
                {policy.text}
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-[#195585] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
      <SmallNotice text="Legal pages are written for transparency and do not replace lender-specific agreements, sanction letters, or policy schedules." />
    </div>
  );
}

export function LogoutPanel() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setConfirmOpen(false);
    setDone(true);
    router.replace("/");
  };

  return (
    <div className="grid gap-5">
      <HelpHero
        icon={LogOut}
        label="Secure sign out"
        title="Logout from this device"
        text="Use this when you are on a shared system or want to end the current browser session."
      />
      <div className="bg-white p-5 shadow-[0_12px_32px_rgba(25,85,133,0.06)]">
        <AlertCircle className="h-7 w-7 text-[#f97316]" />
        <h3 className="mt-4 text-[22px] font-bold text-[#07162d]">
          {done ? "You have been signed out" : "Confirm logout"}
        </h3>
        <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-[#667085]">
          {done
            ? "Your local session token has been cleared from this browser."
            : "This will clear the saved session from this browser. You can login again anytime with your registered credentials."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-semibold text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <Link
            href="/account/profile"
            className="inline-flex h-10 items-center rounded-full bg-[#eef8ff] px-5 text-[13px] font-semibold text-[#195585] no-underline"
          >
            Back to profile
          </Link>
        </div>
      </div>

      <LogoutConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

function HelpHero({
  icon: Icon,
  label,
  title,
  text,
}: {
  icon: typeof HelpCircle;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <section className="grid gap-4 bg-linear-to-br from-[#07162d] via-[#195585] to-[#0f766e] p-4 text-white md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
          <Icon className="h-3.5 w-3.5 text-[#7ee3a2]" />
          {label}
        </div>
        <h3 className="mt-3 max-w-3xl text-[26px] font-bold leading-tight">
          {title}
        </h3>
        <p className="mt-2 max-w-3xl text-[14px] font-medium leading-6 text-white/74">
          {text}
        </p>
      </div>
      <div className="hidden gap-3 md:flex">
        {[
          [Clock3, "Timed response"],
          [ShieldCheck, "Secure"],
          [Sparkles, "Guided"],
        ].map(([BadgeIcon, badge]) => (
          <span
            key={badge as string}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-[12px] font-semibold text-white/75"
          >
            <BadgeIcon className="h-3.5 w-3.5" />
            {badge as string}
          </span>
        ))}
      </div>
    </section>
  );
}

function SmallNotice({ text }: { text: string }) {
  return (
    <div className="flex gap-3 bg-[#f8fcff] p-4 text-[13px] font-medium leading-6 text-[#667085]">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#12b76a]" />
      {text}
    </div>
  );
}
