import Image from "next/image";
import Link from "next/link";
import { CircleCheck, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { howToAvail, offerHighlights } from "./offersData";

const detailStats = [
  { label: "Valid Till", value: "30 May, 2026", icon: LockKeyhole },
  { label: "Offers Type", value: "Bank Offer", icon: ShieldCheck },
  { label: "Application On", value: "Home Loan", icon: FileText },
];

const detailLists = [
  { title: "Offer Highlights", rows: offerHighlights },
  { title: "How to Avail", rows: howToAvail },
];

export function OfferDetail() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="rounded-[12px] border border-[#49a7ff] bg-[#eaf4ff] p-6 shadow-[0_4px_18px_rgba(73,167,255,0.14)]">
          <div className="grid gap-8 md:grid-cols-[1fr_267px] md:items-center">
            <div className="relative min-h-[260px] md:min-h-[280px]">
              <Image
                src="/assets/banks/hdfc.png"
                alt="HDFC Bank"
                width={214}
                height={64}
                className="h-auto w-[214px] object-contain object-left"
                priority
              />

              <span className="absolute right-40 top-1 rounded-[7px] border border-[#d6dce6] bg-white px-4 py-1.5 text-[12px] font-medium text-[#0d64bf] shadow-[0_3px_10px_rgba(16,24,40,0.06)]">
                Exclusive Offer
              </span>

              <h2 className="mt-10 text-[60px] font-extrabold tracking-[-0.04em] text-[#111827] md:text-[50px]">
                Zero Processing Fee
              </h2>
              <p className="mt-3 text-[18px] font-medium text-[#2b2f38] md:text-[20px]">
                on Home Loan
              </p>
              <p className="mt-5 max-w-2xl text-[18px] font-medium leading-7 text-[#9aa0a6] md:text-[20px]">
                Apply through Fintaraa and get Zero Processing Fee with HDFC
                Bank.
              </p>
            </div>

            <div className="relative mx-auto h-[267px] w-[267px] md:h-[267px] md:w-[267px]">
              <Image
                src="/assets/offers/offer.png"
                alt="Offer illustration"
                fill
                unoptimized
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 bg-white p-8 md:grid-cols-3">
          {detailStats.map(({ label, value, icon: Icon }) => (
            <div
              key={String(label)}
              className="flex items-center gap-4 rounded-xl border border-[#d7dfe8] bg-white p-5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded bg-[#e8f4ff] text-[#005ca8]">
                <Icon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-[12px] font-semibold">{label}</span>
                <span className="mt-2 block text-[20px] font-black text-[#111827]">
                  {value}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-10 bg-white px-8 pb-8 md:grid-cols-[1fr_1fr_auto] md:items-end">
          {detailLists.map(({ title, rows }) => (
            <div key={title}>
              <h3 className="text-[22px] font-black">{title}</h3>
              <div className="mt-5 grid gap-4">
                {rows.map((row) => (
                  <p
                    key={row}
                    className="flex items-center gap-2 text-[13px] font-semibold text-[#8b95a3]"
                  >
                    <CircleCheck className="h-4 w-4 text-[#005ca8]" />
                    {row}
                  </p>
                ))}
              </div>
            </div>
          ))}
          <Link
            href="/login?product=offer"
            className="inline-flex h-13 min-w-60 items-center justify-center rounded-full bg-[#13a653] text-[14px] font-black text-white no-underline"
          >
            Apply Now
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#b5d9f6] bg-[#e8f4ff] p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] font-semibold text-[#005ca8]">
            Cashback will be credited within 7 working days after successful
            disbursement of the loan.
          </p>
          <Link
            href="/support"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#13a653] px-6 text-[13px] font-black text-[#13a653] no-underline"
          >
            Need help? Contact Support
          </Link>
        </div>

        <div className="mt-10 grid gap-8 rounded-xl border border-[#b5d9f6] bg-[#e8f4ff] p-8 md:grid-cols-[0.45fr_1fr_0.8fr] md:items-center">
          <div className="relative min-h-40 w-40">
            <Image
              src="/assets/offers/wallet.png"
              alt="Cashback wallet"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <h2 className="text-[36px] font-black leading-tight text-[#005ca8]">
            Get Cashback in your Fintaraa Wallet or UPI
            <span className="mt-3 block text-[18px] font-semibold text-[#111827]">
              Easy, Fast & Hassle-free
            </span>
          </h2>
          <div className="grid gap-4 text-[17px] font-semibold text-[#111827]">
            <p>₹ Guaranteed Cashback</p>
            <p>₹ Instant Wallet Credit</p>
            <p>▣ Withdraw to UPI Anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
