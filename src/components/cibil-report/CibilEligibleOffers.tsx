import Image from "next/image";
import Link from "next/link";

const rows = [
  ["HDFC Bank", "/assets/banks/hdfc.png", "Up to ₹40 Lakh", "10.49% onwards"],
  ["ICICI Bank", "/assets/banks/icici.png", "Up to ₹25 Lakh", "10.99% onwards"],
  ["Kotak", "/assets/banks/kotak.png", "Up to ₹20 Lakh", "11.25% onwards"],
];

export function CibilEligibleOffers() {
  return (
    <section className="bg-[#f2f9ff] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-black text-[#111827]">
              Loans You Are Eligible For
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              Based on your CIBIL score - 782
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-full border border-[#13a653] px-6 py-3 text-[13px] font-black text-[#13a653] no-underline"
          >
            High Approval Chances
          </Link>
        </div>
        <div className="mt-7 overflow-x-auto rounded bg-white">
          <table className="w-full min-w-180 border-collapse text-left text-[13px]">
            <thead>
              <tr>
                {["Personal Loan", "Home Loan", "Car Loan", "Credit Card"].map((head) => (
                  <th key={head} className="px-5 py-4 font-black text-[#005ca8]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([bank, logo, amount, rate]) => (
                <tr key={bank} className="border-t border-[#e5eaf0]">
                  <td className="px-5 py-4">
                    <Image
                      src={logo}
                      alt={bank}
                      width={110}
                      height={34}
                      className="object-contain object-left"
                      style={{ width: "112px", height: "auto" }}
                    />
                  </td>
                  <td className="px-5 py-4 font-semibold">{amount}</td>
                  <td className="px-5 py-4 font-semibold">{rate}</td>
                  <td className="px-5 py-4">
                    <Link
                      href="/login?product=credit-card"
                      className="rounded-full bg-[#13a653] px-5 py-2 text-[12px] font-black text-white no-underline"
                    >
                      Apply Now →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 text-center">
          <Link href="/products" className="text-[13px] font-black text-[#005ca8] no-underline">
            View more loan offers ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
