import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, CreditCard, Landmark } from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  bankDirectory,
  formatRate,
  loanProductDirectory,
} from "@/data/bankDirectory";

export function BankDirectorySection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const featuredProducts = loanProductDirectory.slice(0, 8);

  return (
    <section className="bg-white px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
              Bank directory
            </p>
            <h2 className="mt-2 text-[30px] font-black tracking-tight text-[#07162d] md:text-[42px]">
              Banks, rates and available products
            </h2>
          </div>
          <Link
            href="/banks"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#075cde] px-5 text-[13px] font-extrabold text-white no-underline"
          >
            View bank pages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bankDirectory.map((bank) => (
            <article
              key={bank.slug}
              className="rounded-2xl border border-[#e6edf5] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <BankLogoImage
                    src={bank.logo}
                    alt={bank.name}
                    className="h-10 w-28"
                    imageClassName="object-left"
                  />
                  <h3 className="mt-4 text-[20px] font-black text-[#07162d]">
                    {bank.name}
                  </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7ff] text-[#005ca8]">
                  <Landmark className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f8fbff] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#98a2b3]">
                    Min interest
                  </p>
                  <p className="mt-1 text-[18px] font-black text-[#0b7a3b]">
                    {formatRate(bank.minRate)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f8fbff] p-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#98a2b3]">
                    Max interest
                  </p>
                  <p className="mt-1 text-[18px] font-black text-[#07162d]">
                    {formatRate(bank.maxRate)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
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
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-[#d8e5f2] text-[12px] font-extrabold text-[#005ca8] no-underline"
                >
                  <BadgeIndianRupee className="h-3.5 w-3.5" />
                  Products
                </Link>
                <Link
                  href={`/banks/${bank.slug}/credit-card`}
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-[#075cde] text-[12px] font-extrabold text-white no-underline"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Cards
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!compact ? (
          <div className="mt-10 border-t border-[#edf1f4] pt-8">
            <h3 className="text-center text-[18px] font-black uppercase tracking-[0.08em] text-[#3f4650]">
              Popular loan types by bank
            </h3>
            <p className="mx-auto mt-4 max-w-8xl text-center text-[15px] font-medium leading-8 text-[#8b95a3] md:text-[17px] md:leading-9">
              {featuredProducts.map((product, index) => (
                <span key={product.slug}>
                  <Link
                    href={`/banks/hdfc-bank/${product.slug}`}
                    className="text-[#7f8995] no-underline transition hover:text-[#00529b]"
                  >
                    {product.name} by HDFC Bank
                  </Link>
                  {index < featuredProducts.length - 1 ? (
                    <span className="px-2 text-[#ccd4dc]">/</span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
