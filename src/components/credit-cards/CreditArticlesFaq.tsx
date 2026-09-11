import Link from "next/link";
import { FileText } from "lucide-react";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { articleCards } from "./creditCardsData";

export function CreditArticlesFaq() {
  return (
    <>
      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold">
              Learn & Make Informed Decisions
            </h2>
            <Link
              href="/blog"
              className="text-[12px] font-extrabold text-[#4c1d95] no-underline"
            >
              Explore All Articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {articleCards.map((title) => (
              <article
                key={title}
                className="rounded border border-[#d7dfe8] bg-white p-6"
              >
                <FileText className="h-6 w-6 text-[#4c1d95]" />
                <h3 className="mt-8 min-h-12 text-[13px] font-extrabold leading-5">
                  {title}
                </h3>
                <Link
                  href="/blog"
                  className="mt-6 block text-[12px] font-extrabold text-[#4c1d95] no-underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion lookupPathname="/credit-cards" />
    </>
  );
}
