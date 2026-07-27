import Link from "next/link";
import {
  Sparkles,
  Landmark,
  ArrowRight,
  CreditCard,
  SearchCheck,
  ShieldCheck,
  CheckCircle2,
  BadgeIndianRupee,
} from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  formatRate,
  bankDirectory,
  loanProductDirectory,
} from "@/data/bankDirectory";

export function BankDirectorySection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const featuredProducts = loanProductDirectory.slice(0, 10);

  return (
    <section className="bg-white pb-16">
      <div className="overflow-hidden bg-[linear-gradient(135deg,#071f3e_0%,#075cde_58%,#07965a_135%)] px-4 py-12 text-white md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-9 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <h1 className="mt-3 max-w-4xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-[44px] lg:text-[54px]">
              Compare lenders before you choose a financial product
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] font-medium leading-7 text-white/80 md:text-[17px]">
              This directory brings Fintaraa&apos;s participating bank pages
              together in one place. Explore available loans and cards, review
              indicative rate ranges, understand eligibility, and continue with
              an assisted application.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-extrabold text-[#075cde] no-underline transition hover:bg-[#eef7ff]"
              >
                Compare all products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/eligibility-results"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-[13px] font-extrabold text-white no-underline backdrop-blur transition hover:bg-white/20"
              >
                Check eligibility
                <SearchCheck className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              [String(bankDirectory.length), "Bank partners"],
              [String(loanProductDirectory.length), "Loan categories"],
              ["100%", "Assisted journey"],
              ["One place", "To compare"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
              >
                <p className="text-[25px] font-extrabold">{value}</p>
                <p className="mt-1 text-[12px] font-bold text-white/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-9xl px-4 pt-11 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
              Explore by bank
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#07162d] md:text-[38px]">
              Find the right lending partner
            </h2>
            <p className="mt-3 max-w-3xl text-[14px] font-medium leading-6 text-[#61748f]">
              Open a bank page to see its product range, eligibility guidance,
              documents, and application options.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eff8f3] px-4 py-2 text-[12px] font-bold text-[#087a45]">
            <ShieldCheck className="h-4 w-4" />
            Secure, guided application support
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {bankDirectory.map((bank) => (
            <article
              key={bank.slug}
              className="group flex h-full flex-col rounded-3xl border border-[#e1eaf4] bg-white p-6 shadow-[0_14px_38px_rgba(16,44,69,0.06)] transition hover:-translate-y-1 hover:border-[#bdd7ef] hover:shadow-[0_20px_48px_rgba(16,44,69,0.11)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <BankLogoImage
                    src={bank.logo}
                    alt={bank.name}
                    className="h-10 w-28"
                    imageClassName="object-left"
                  />
                  <h3 className="mt-4 text-[20px] font-extrabold text-[#07162d]">
                    {bank.name}
                  </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7ff] text-[#005ca8]">
                  <Landmark className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f8fbff] p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#98a2b3]">
                    Starting from
                  </p>
                  <p className="mt-1 text-[18px] font-extrabold text-[#0b7a3b]">
                    {formatRate(bank.minRate)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f8fbff] p-3 text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#98a2b3]">
                    Indicative up to
                  </p>
                  <p className="mt-1 text-[18px] font-extrabold text-[#07162d]">
                    {formatRate(bank.maxRate)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-1 flex-wrap content-start gap-2">
                {bank.products.map((product) => (
                  <span
                    key={product}
                    className="rounded-full bg-[#f1f8ff] px-3 py-1 text-[11px] font-extrabold text-[#195585]"
                  >
                    {product}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link
                  href={`/banks/${bank.slug}`}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#cfe0ef] text-[12px] font-extrabold text-[#005ca8] no-underline transition hover:bg-[#f2f8ff]"
                >
                  <BadgeIndianRupee className="h-3.5 w-3.5" />
                  View products
                </Link>
                <Link
                  href={`/banks/${bank.slug}/credit-card`}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#075cde] text-[12px] font-extrabold text-white no-underline transition hover:bg-[#064fbf]"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Credit cards
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!compact ? (
          <div className="mt-12 rounded-3xl bg-[#f5f9fd] p-6 md:p-9">
            <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#075cde] shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[24px] font-extrabold text-[#102c45]">
                  How to use this directory
                </h3>
                <p className="mt-3 text-[13px] font-medium leading-6 text-[#61748f]">
                  Rate ranges are indicative. Your final eligibility, rate,
                  amount, and approval remain subject to the selected
                  lender&apos;s policy and assessment.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [
                    "1. Choose a bank",
                    "Review the lender and the products currently available.",
                  ],
                  [
                    "2. Compare details",
                    "Check indicative rates, eligibility, documents, and terms.",
                  ],
                  [
                    "3. Apply with support",
                    "Continue digitally and receive guided Fintaraa assistance.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#dfebf5] bg-white p-5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#0b9b58]" />
                    <h4 className="mt-3 text-[14px] font-extrabold text-[#102c45]">
                      {title}
                    </h4>
                    <p className="mt-2 text-[12px] font-medium leading-5 text-[#718399]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 border-t border-[#dce8f2] pt-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#54718d]">
                Popular loan pages
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/banks/hdfc-bank/${product.slug}`}
                    className="rounded-full border border-[#d6e4f0] bg-white px-3.5 py-2 text-[11px] font-bold text-[#355c7d] no-underline transition hover:border-[#9bc4e8] hover:text-[#075cde]"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
