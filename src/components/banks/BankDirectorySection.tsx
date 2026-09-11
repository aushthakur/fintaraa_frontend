import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
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
import {
  trustedPartners,
  type TrustedPartnerCapability,
} from "@/data/trustedPartners";

const capabilityLabels: Record<TrustedPartnerCapability, string> = {
  loan: "Loans",
  insurance: "Insurance",
  "credit-card": "Credit Cards",
  "credit-bureau": "Credit Health",
};

const coreBanksBySlug = new Map(
  bankDirectory.map((bank) => [bank.slug, bank] as const),
);

const directoryBanks = trustedPartners
  .filter((partner) => partner.type === "Bank" || partner.type === "NBFC")
  .map((partner) => {
    const coreBank = coreBanksBySlug.get(partner.slug);
    return {
      name: partner.name,
      slug: partner.slug,
      logo: partner.logo,
      minRate: coreBank?.minRate,
      maxRate: coreBank?.maxRate,
      products:
        coreBank?.products ||
        partner.categories.map((category) => capabilityLabels[category]),
      type: partner.type,
    };
  });

export function BankDirectorySection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const featuredProducts = loanProductDirectory.slice(0, 10);

  return (
    <section className="bg-white pb-16">
      <div className="overflow-hidden bg-[linear-gradient(135deg,#071f3e_0%,#5b21b6_58%,#07965a_135%)] px-4 py-12 text-white md:px-6 md:py-16 lg:px-8">
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
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-extrabold text-[#5b21b6] no-underline transition hover:bg-[#eef7ff]"
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
              [String(directoryBanks.length), "Lending partners"],
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
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#4c1d95]">
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {directoryBanks.map((bank) => {
            const hasConfiguredRates =
              typeof bank.minRate === "number" &&
              typeof bank.maxRate === "number";

            return (
              <article
                key={bank.slug}
                className="group flex h-full min-h-65 flex-col rounded-2xl border border-[#e1eaf4] bg-white p-5 shadow-[0_10px_28px_rgba(16,44,69,0.055)] transition hover:-translate-y-0.5 hover:border-[#bdd7ef] hover:shadow-[0_16px_36px_rgba(16,44,69,0.09)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <BankLogoImage
                    src={bank.logo}
                    alt={bank.name}
                    className="h-8 w-24"
                    imageClassName="object-left"
                  />
                  <span className="rounded-full bg-[#f1f7fb] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#56738c]">
                    {bank.type}
                  </span>
                </div>

                <h3 className="mt-4 min-h-12 text-[17px] font-extrabold leading-6 text-[#07162d]">
                  {bank.name}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#f7fafc] px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f3fb] text-[#5b21b6]">
                      <BadgeIndianRupee className="h-4 w-4" />
                    </span>
                    <p className="text-[10px] font-bold text-[#7890a2]">
                      {hasConfiguredRates ? "Rates from" : "Rate details"}
                    </p>
                  </div>
                  <p className="text-[13px] font-extrabold text-[#0b7a3b]">
                    {hasConfiguredRates
                      ? formatRate(bank.minRate as number)
                      : "On request"}
                  </p>
                </div>

                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                  {bank.products.slice(0, 2).map((product) => (
                    <span
                      key={product}
                      className="rounded-full border border-[#e9d5ff] bg-[#f8fbfd] px-2.5 py-1 text-[10px] font-bold text-[#4f6f88]"
                    >
                      {product}
                    </span>
                  ))}
                  {bank.products.length > 2 ? (
                    <span className="rounded-full bg-[#edf6fc] px-2.5 py-1 text-[10px] font-extrabold text-[#5b21b6]">
                      +{bank.products.length - 2}
                    </span>
                  ) : null}
                </div>

                <Link
                  href={`/banks/${bank.slug}`}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-4 text-[11px] font-extrabold text-white no-underline transition hover:bg-[#064fbf]"
                >
                  Explore partner
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </div>

        {!compact ? (
          <div className="mt-12 rounded-3xl bg-[#f5f9fd] p-6 md:p-9">
            <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#5b21b6] shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[24px] font-extrabold text-[#3b0764]">
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
                    <h4 className="mt-3 text-[14px] font-extrabold text-[#3b0764]">
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
                    className="rounded-full border border-[#d6e4f0] bg-white px-3.5 py-2 text-[11px] font-bold text-[#355c7d] no-underline transition hover:border-[#9bc4e8] hover:text-[#5b21b6]"
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
