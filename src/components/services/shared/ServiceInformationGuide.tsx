"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  IndianRupee,
  Info,
  Landmark,
  ListChecks,
  SearchCheck,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export type ServiceGuideIcon =
  | "overview"
  | "eligibility"
  | "documents"
  | "process"
  | "status"
  | "certificate"
  | "compliance"
  | "money"
  | "business"
  | "report"
  | "calculator"
  | "bank"
  | "faq";

type GuideCard = { title: string; text: string };
type GuideFaq = { question: string; answer: string };

export type ServiceGuideBlock =
  | { kind: "paragraphs"; items: string[] }
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "cards"; items: GuideCard[] }
  | { kind: "steps"; items: string[] }
  | { kind: "table"; columns: string[]; rows: string[][] }
  | { kind: "note"; text: string }
  | { kind: "faq"; items: GuideFaq[] };

export type ServiceGuideSection = {
  id: string;
  label: string;
  shortLabel: string;
  title: string;
  summary: string;
  icon: ServiceGuideIcon;
  blocks: ServiceGuideBlock[];
};

export type ServiceGuideConfig = {
  guideTitle: string;
  knowledgeLabel: string;
  supportLabel: string;
  officialLabel: string;
  officialUrl: string;
  disclaimer: string;
  sections: ServiceGuideSection[];
};

const iconMap: Record<ServiceGuideIcon, LucideIcon> = {
  overview: BookOpenCheck,
  eligibility: UserCheck,
  documents: FileCheck2,
  process: ListChecks,
  status: SearchCheck,
  certificate: Download,
  compliance: ShieldCheck,
  money: IndianRupee,
  business: Building2,
  report: FileText,
  calculator: Calculator,
  bank: Landmark,
  faq: CircleHelp,
};

function GuideBlock({ block }: { block: ServiceGuideBlock }) {
  if (block.kind === "paragraphs") {
    return (
      <div className="grid gap-4">
        {block.items.map((item) => (
          <p
            key={item}
            className="text-[13px] font-medium leading-7 text-[#526b80] sm:text-[14px]"
          >
            {item}
          </p>
        ))}
      </div>
    );
  }

  if (block.kind === "bullets") {
    return (
      <div className="rounded-2xl bg-[#f1f8ff] p-4 sm:p-5">
        {block.title ? (
          <h3 className="mb-3 text-[14px] font-extrabold text-[#17354d]">
            {block.title}
          </h3>
        ) : null}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {block.items.map((item) => (
            <p
              key={item}
              className="flex items-start gap-2.5 text-[12px] font-semibold leading-5 text-[#526b80]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#13a653]" />
              {item}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (block.kind === "cards") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {block.items.map((item, index) => (
          <article
            key={item.title}
            className={`rounded-2xl border p-4 sm:p-5 ${
              index % 2 === 0
                ? "border-[#cfe2f1] bg-[#f4faff]"
                : "border-[#cfe8da] bg-[#f4fbf7]"
            }`}
          >
            <h3 className="text-[14px] font-extrabold text-[#17354d]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] font-medium leading-6 text-[#657d90]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    );
  }

  if (block.kind === "steps") {
    return (
      <div className="grid gap-3">
        {block.items.map((item, index) => (
          <article
            key={item}
            className="flex items-start gap-4 rounded-2xl border border-[#dfe8ef] bg-white p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#075cde] text-[12px] font-extrabold text-white">
              {index + 1}
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8295a5]">
                Step {index + 1}
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-6 text-[#3f586c]">
                {item}
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (block.kind === "table") {
    return (
      <div className="overflow-x-auto rounded-2xl border border-[#dce7ef]">
        <table className="w-full min-w-155 border-collapse text-left">
          <thead className="bg-[#eaf4ff]">
            <tr>
              {block.columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#31516b]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3ebf1] bg-white">
            {block.rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td
                    key={`${cell}-${index}`}
                    className="px-4 py-3 text-[12px] font-medium leading-5 text-[#526b80]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.kind === "note") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-[#f0dfb5] bg-[#fffaf0] p-4 text-[12px] font-semibold leading-5 text-[#745f2e]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#c28b16]" />
        <p>{block.text}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#e2eaf0] overflow-hidden rounded-2xl border border-[#dce7ef] bg-white">
      {block.items.map((item, index) => (
        <details key={item.question} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[13px] font-extrabold text-[#17354d] marker:content-none sm:px-5">
            {item.question}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf5fb] text-[#075cde] transition group-open:rotate-90">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </summary>
          <p className="px-4 pb-4 text-[12px] font-medium leading-6 text-[#657d90] sm:px-5">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function ServiceInformationGuide({
  config,
  formAnchor,
}: {
  config: ServiceGuideConfig;
  formAnchor: string;
}) {
  const [activeId, setActiveId] = useState(config.sections[0].id);
  const active =
    config.sections.find((section) => section.id === activeId) ||
    config.sections[0];
  const ActiveIcon = iconMap[active.icon];

  const selectTab = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <section className="bg-[#f7fafc] pb-10 md:pb-14">
      <div
        className="sticky z-[49] border-y border-[#d8e6f0] bg-[#eaf4ff]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"
        style={{ top: "var(--site-header-height, 8.25rem)" }}
      >
        <div className="mx-auto flex max-w-9xl items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {config.sections.map((section) => {
            const selected = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => selectTab(section.id)}
                aria-pressed={selected}
                className={`h-10 shrink-0 rounded-full px-4 text-[11px] font-extrabold transition sm:px-5 sm:text-[12px] ${
                  selected
                    ? "bg-[#075cde] text-white"
                    : "border border-[#d6e3ec] bg-white text-[#36546b] hover:border-[#8db9d6] hover:text-[#075cde]"
                }`}
              >
                <span className="sm:hidden">{section.shortLabel}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto grid max-w-9xl items-start gap-5 px-4 pt-7 sm:px-6 md:pt-9 lg:grid-cols-[245px_minmax(0,1fr)] lg:px-8">
        <aside
          className="hidden rounded-2xl border border-[#dce7ef] bg-white p-3 lg:sticky lg:block"
          style={{ top: "calc(var(--site-header-height, 8.25rem) + 5.25rem)" }}
        >
          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#7890a2]">
              Quick links
            </p>
            <h2 className="mt-1 text-[16px] font-extrabold text-[#17354d]">
              {config.guideTitle}
            </h2>
          </div>
          <nav aria-label={`${config.guideTitle} sections`} className="grid gap-1">
            {config.sections.map((section) => {
              const Icon = iconMap[section.icon];
              const selected = section.id === activeId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => selectTab(section.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[11px] font-bold leading-4 transition ${
                    selected
                      ? "bg-[#e9f3ff] text-[#075cde]"
                      : "text-[#526b80] hover:bg-[#f5f8fa] hover:text-[#075cde]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1">{section.label}</span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </nav>
          <a
            href={`#${formAnchor}`}
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-3 text-[11px] font-extrabold text-white no-underline transition hover:bg-[#0f8f45]"
          >
            {config.supportLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </aside>

        <article className="min-w-0 rounded-2xl border border-[#dce7ef] bg-white p-5 sm:p-7 md:p-8">
          <div className="flex items-start gap-4 border-b border-[#e5edf3] pb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
              <ActiveIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#075cde]">
                {config.knowledgeLabel}
              </p>
              <h2 className="mt-1 text-[23px] font-extrabold leading-tight tracking-[-0.02em] text-[#17354d] sm:text-[28px]">
                {active.title}
              </h2>
              <p className="mt-2 text-[13px] font-medium leading-6 text-[#718598] sm:text-[14px]">
                {active.summary}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            {active.blocks.map((block, index) => (
              <GuideBlock key={`${active.id}-${block.kind}-${index}`} block={block} />
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-[#e5edf3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[10px] font-medium leading-5 text-[#8295a5]">
              {config.disclaimer}
            </p>
            <a
              href={config.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold text-[#075cde] no-underline hover:underline"
            >
              {config.officialLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
