"use client";
import Link from "next/link";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { productHref } from "@/lib/productRouting";

// Soft, clean color palette configurations mirroring the design circles
const toneClass: Record<string, string> = {
  amber: "bg-[#fff3df] text-[#f79009]",
  blue: "bg-[#e4f4ff] text-[#195585]",
  brown: "bg-[#fff3e5] text-[#a36a19]",
  gold: "bg-[#fff3c6] text-[#d4a42f]",
  green: "bg-[#e9f2ff] text-[#075cde]",
  orange: "bg-[#fff4eb] text-[#f28c28]",
  pink: "bg-[#ffe4f2] text-[#f1129d]",
  red: "bg-[#ffe1e4] text-[#ef1010]",
  sky: "bg-[#dff0ff] text-[#1b76a6]",
};

const bankCards = [
  {
    title: "ICICI Bank",
    logo: "/assets/banks/icici-logo.png",
    tone: "orange",
  },
  {
    title: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    tone: "red",
  },
  {
    title: "SBI Bank",
    logo: "/assets/banks/sbi-logo.png",
    tone: "sky",
  },
  {
    title: "Kotak Bank",
    logo: "/assets/banks/kotak-logo.png",
    tone: "blue",
  },
  {
    title: "Axis Bank",
    logo: "/assets/banks/axis-bank.png",
    tone: "green",
  },
  {
    title: "Bajaj Finserv",
    logo: "/assets/banks/bajaj.png",
    tone: "gold",
  },
  {
    title: "IndusInd Bank",
    logo: "/assets/banks/indusind.png",
    tone: "pink",
  },
  {
    title: "IDFC First",
    logo: "/assets/banks/idfc.png",
    tone: "brown",
  },
  {
    title: "Yes Bank",
    logo: "/assets/banks/yes-bank.png",
    tone: "amber",
  },
  {
    title: "PNP Bank",
    logo: "/assets/banks/pnb.png",
    tone: "orange",
  },
];

export function LoanOtherProducts() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-[#111827]">
            Explore Other Products
          </h2>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-[14px] font-bold text-[#075cde] no-underline transition-colors hover:text-[#004b93]"
          >
            View All
            <span className="text-[15px] font-light">→</span>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {bankCards.map((bank) => (
            <Link
              key={bank.title}
              href={productHref(bank.title)}
              className="group relative flex min-h-36 flex-col items-center justify-center rounded-xl border border-gray-200/70 bg-white px-3 py-6 text-center no-underline transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.02)] sm:px-4"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  toneClass[bank.tone] || "bg-[#fff2ec] text-[#ff7643]"
                }`}
              >
                <BankLogoImage
                  src={bank.logo}
                  alt={bank.title}
                  className="h-12 w-12"
                />
              </div>
              <h3 className="mt-5 text-[14px] font-bold tracking-tight text-[#0f172a]">
                {bank.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
