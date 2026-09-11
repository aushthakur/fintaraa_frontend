import Link from "next/link";
import type { Metadata } from "next";
import { knowledgePageConfigs } from "@/components/knowledge/knowledgePageConfig";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Knowledge Hub",
  description:
    "Explore Fintaraa blogs, press releases, customer testimonials, and video stories.",
  alternates: { canonical: "/knowledge-hub" },
  openGraph: {
    title: "Knowledge Hub | Fintaraa",
    description:
      "Blogs, media updates, testimonials, and video stories from Fintaraa.",
    url: "/knowledge-hub",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/knowledge-hub", fallbackMetadata);
}

export default function KnowledgeHubPage() {
  return (
    <main className="bg-white px-4 py-12 text-[#111625] md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#4c1d95]">
          Knowledge Hub
        </p>
        <h1 className="mt-3 text-[38px] font-extrabold tracking-tight text-[#07162d] md:text-[56px]">
          Fintaraa Insights, Media, and Customer Stories
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] font-semibold leading-7 text-[#667085]">
          Browse curated financial guides, press updates, client testimonials,
          and video stories from one place.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {knowledgePageConfigs.map((config) => (
            <Link
              key={config.hrefRoot}
              href={config.hrefRoot}
              className="rounded-2xl border border-[#e2edf6] bg-[#f8fbff] p-6 text-[#07162d] no-underline transition hover:-translate-y-0.5 hover:border-[#4c1d95] hover:bg-white"
            >
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#4c1d95]">
                {config.eyebrow}
              </p>
              <h2 className="mt-3 text-[22px] font-extrabold">
                {config.title}
              </h2>
              <p className="mt-3 text-[13px] font-semibold leading-6 text-[#667085]">
                {config.description}
              </p>
            </Link>
          ))}
          <Link
            href="/blog"
            className="rounded-2xl border border-[#e2edf6] bg-[#f8fbff] p-6 text-[#07162d] no-underline transition hover:-translate-y-0.5 hover:border-[#4c1d95] hover:bg-white"
          >
            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#4c1d95]">
              Financial Guides
            </p>
            <h2 className="mt-3 text-[22px] font-extrabold">Blogs</h2>
            <p className="mt-3 text-[13px] font-semibold leading-6 text-[#667085]">
              Read guides on loans, credit cards, insurance, CIBIL, documents,
              and responsible financial planning.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
