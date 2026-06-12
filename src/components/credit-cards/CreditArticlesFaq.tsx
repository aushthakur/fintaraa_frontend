import Link from "next/link";
import { ChevronDown, FileText } from "lucide-react";
import { articleCards } from "./creditCardsData";

const faqs = [
  "What is a credit card?",
  "How does a credit card work?",
  "What CIBIL score is required?",
  "How can I apply online?",
  "Can I get a lifetime free card?",
  "How does the eligibility checker work?",
];

export function CreditArticlesFaq() {
  return (
    <>
      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-black">Learn & Make Informed Decisions</h2>
            <Link href="/blog" className="text-[12px] font-black text-[#005ca8] no-underline">
              Explore All Articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {articleCards.map((title) => (
              <article key={title} className="rounded border border-[#d7dfe8] bg-white p-6">
                <FileText className="h-6 w-6 text-[#005ca8]" />
                <h3 className="mt-8 min-h-12 text-[13px] font-black leading-5">
                  {title}
                </h3>
                <Link href="/blog" className="mt-6 block text-[12px] font-black text-[#005ca8] no-underline">
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[30px] font-black">Frequently Asked Questions (FAQ)</h2>
          <div className="mt-10 grid gap-4 text-left">
            {faqs.map((faq, index) => (
              <details key={faq} className="border border-[#d7dfe8] bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
                  {index + 1}. {faq}
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <p className="mt-3 text-[13px] font-medium leading-6 text-[#667085]">
                  Fintaraa helps you compare cards and check eligibility before
                  applying.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
