import type { Metadata } from "next";
import Link from "next/link";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Sitemap",
  description: "Browse important Fintaraa website pages and services.",
};

const groups = [
  {
    title: "Products",
    links: [
      ["/products", "All Products"],
      ["/credit-cards", "Credit Cards"],
      ["/cibil-score", "CIBIL Score"],
      ["/offers", "Offers"],
    ],
  },
  {
    title: "Services",
    links: [
      ["/gst-registration", "GST Registration"],
      ["/itr-filing", "ITR Filing"],
      ["/company-registration", "Company Registration"],
      ["/application-status", "Application Status"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/about-us", "About Us"],
      ["/careers", "Careers"],
      ["/franchise", "Franchise"],
      ["/become-dsa", "Become DSA"],
      ["/partners", "Partners"],
      ["/contact-us", "Contact Us"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/privacy-policy", "Privacy Policy"],
      ["/terms-and-conditions", "Terms & Conditions"],
      ["/grievance", "Grievance Redressal"],
      ["/loan-disclosure", "Loan Disclosure"],
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/sitemap", fallbackMetadata);
}

export default function SitemapPage() {
  return (
    <main className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <section className="mx-auto max-w-9xl">
        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#005ca8]">
          Sitemap
        </p>
        <h1 className="mt-4 text-[38px] font-black tracking-[-0.02em] text-[#111827] md:text-[54px]">
          Find every important page
        </h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-[#e4edf6] bg-white p-5 shadow-[0_18px_48px_rgba(16,24,40,0.05)]"
            >
              <h2 className="text-[18px] font-black text-[#111827]">
                {group.title}
              </h2>
              <div className="mt-4 grid gap-2">
                {group.links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-xl px-3 py-2 text-[13px] font-bold text-[#475467] no-underline hover:bg-[#f3f7fb] hover:text-[#005ca8]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
