"use client";

import { CheckCircle2, HelpCircle, Star } from "lucide-react";
import type { BankSeoPageData, BankSeoTab } from "@/services/bankSeoPages";

export function BankTabContentSection({
  page,
  tab,
}: {
  page: BankSeoPageData;
  tab: BankSeoTab;
}) {
  const bullets = tab.bullets?.length
    ? tab.bullets
    : tab.key.includes("why")
      ? page.whyApply
      : [];
  const content = tab.content || [];
  const hasContent = Boolean(
    tab.title || tab.content?.length || bullets.length,
  );
  const fallbackTitle = tab.key.includes("review")
    ? `${page.bankName} customer reviews`
    : `${tab.label} for ${page.bankName} ${page.productName}`;

  return (
    <section className="bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="rounded-2xl border border-[#e3ebf3] bg-white p-5 shadow-[0_12px_34px_rgba(16,24,40,0.04)] md:p-8">
          <div className="max-w-3xl">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#4c1d95]">
              {tab.label}
            </p>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#07162d] md:text-[30px]">
              {tab.title || fallbackTitle}
            </h2>
            {tab.content?.length || tab.description ? (
              <p className="mt-3 text-[14px] font-semibold leading-7 text-[#667085] md:text-[15px]">
                {tab.description || tab.content?.[0]}
              </p>
            ) : null}
          </div>

          {content.length > 1 ? (
            <div className="mt-6 grid gap-3 text-[14px] font-semibold leading-7 text-[#536273]">
              {content.slice(tab.description ? 0 : 1).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ) : null}

          {bullets.length ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {bullets.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl bg-[#f8fbff] p-4 text-[13px] font-bold leading-6 text-[#344054]"
                >
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#13a653]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : null}

          {tab.key.includes("review") ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {["Easy application", "Clear guidance", "Quick support"].map(
                (item) => (
                  <div key={item} className="rounded-xl bg-[#f8fbff] p-4">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-bold text-[#07162d]">
                      {item}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-[#667085]">
                      Reviews are collected from assisted customer journeys and
                      partner follow-ups.
                    </p>
                  </div>
                ),
              )}
            </div>
          ) : null}

          {tab.key.includes("review") || !hasContent ? null : tab.content
              ?.length || bullets.length ? null : (
            <div className="mt-7 rounded-xl bg-[#f8fbff] p-5 text-[13px] font-semibold leading-6 text-[#667085]">
              Content for this tab can be managed from the bank SEO page admin.
            </div>
          )}

          {tab.key.includes("review") || hasContent ? null : (
            <div className="mt-7 flex gap-3 rounded-xl bg-[#f8fbff] p-5 text-[13px] font-semibold leading-6 text-[#667085]">
              <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#4c1d95]" />
              <span>
                Details for this section will appear here after they are added
                in admin.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
