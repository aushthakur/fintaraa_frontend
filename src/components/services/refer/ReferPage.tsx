import Image from "next/image";
import {
  Copy,
  Mail,
  UserCheck,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";

const summary: Array<{ value: string; label: string; icon: LucideIcon }> = [
  { value: "24", label: "Referred Total", icon: UserCheck },
  { value: "09", label: "Registered", icon: UserCheck },
  { value: "6", label: "Applied", icon: UserCheck },
  { value: "3", label: "Approved", icon: UserCheck },
  { value: "9", label: "₹2,500", icon: Camera },
];

const history = [
  ["Raju", "9876543210", "Reward Paid", "₹ 1,20,000", "₹ 500", "Paid"],
  ["Raju", "9876543210", "Approved", "₹ 1,20,000", "₹ 500", "Pending"],
  ["Raju", "9876543210", "Registered", "₹ 1,20,000", "₹ 500", "—"],
  ["Raju", "9876543210", "Registered", "₹ 1,20,000", "₹ 500", "—"],
  ["Raju", "9876543210", "Registered", "₹ 1,20,000", "₹ 500", "—"],
];

const howItWorks = [
  "Share your link or code with your friends",
  "They sign up using your link",
  "They submit and complete their application",
  "When their loan is approved & disbursed",
  "Reward is credited to your account",
];

const shareButtons = [
  { label: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
  { label: "SMS", icon: Mail, color: "#005ca8" },
  { label: "Facebook", icon: FaFacebookF, color: "#1877F2" },
];

export function ReferPage() {
  return (
    <main className="bg-white text-[#1f2937]">
      <section className="relative overflow-hidden px-4 py-6 md:px-6 lg:px-8">
        {/* Blue diamond accents top-left, matching site-wide hero pattern */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
          <div
            className="absolute hidden bg-[#dceefc] md:block"
            style={{
              width: "55px",
              height: "90px",
              top: "-20px",
              left: "-15px",
              borderRadius: "5px",
              transform: "rotate(140deg)",
            }}
          />
          <div
            className="absolute hidden bg-[#dceefc] md:block"
            style={{
              width: "60px",
              height: "120px",
              top: "-80px",
              left: "40px",
              borderRadius: "5px",
              transform: "rotate(140deg)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-9xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            {/* LEFT COLUMN */}
            <div className="grid gap-5">
              {/* Hero card */}
              <div className="grid gap-4 rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-8">
                <div>
                  <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#005ca8] md:text-[42px]">
                    Refer a friend
                    <span className="block text-[#4ade80]">earn ₹500</span>
                  </h1>
                  <p className="mt-5 text-[17px] font-semibold text-[#1f2937] md:text-[19px]">
                    When their loan is disbursed
                  </p>
                </div>
                <div className="relative min-h-[200px] md:min-h-[230px]">
                  <Image
                    src="/assets/refer/image.png"
                    alt="Refer a friend illustration"
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              {/* Referral link + code + share card */}
              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    ["Your Referral Link", "www.wayoneit.com"],
                    ["Your Referral Code", "WAYONE099"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <h2 className="text-[15px] font-extrabold text-[#1f2937]">
                        {label}
                      </h2>
                      <div className="mt-3 flex overflow-hidden rounded-[8px] border border-[#dde3ea]">
                        <input
                          readOnly
                          value={value}
                          className="h-11 min-w-0 flex-1 border-0 bg-white px-4 text-[13px] font-medium text-[#98a2b3] outline-none"
                        />
                        <button
                          type="button"
                          className="inline-flex h-11 shrink-0 items-center gap-1.5 bg-[#dbeeff] px-4 text-[13px] font-bold text-[#0d64bf]"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <h2 className="text-[15px] font-extrabold text-[#1f2937]">
                    Share via
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {shareButtons.map(({ label, icon: Icon, color }) => (
                      <button
                        key={label}
                        type="button"
                        className="inline-flex h-12 min-w-[148px] items-center justify-center gap-2.5 rounded-[8px] bg-[#eaf6ff] px-5 text-[14px] font-bold text-[#1f2937]"
                      >
                        <Icon className="h-5 w-5 shrink-0" style={{ color }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats summary card */}
              <div className="grid grid-cols-2 gap-y-5 rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] sm:grid-cols-3 md:grid-cols-5 md:p-7">
                {summary.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="h-6 w-6 shrink-0 text-[#0d64bf]" />
                    <span>
                      <span className="block text-[17px] font-extrabold text-[#1f2937]">
                        {value}
                      </span>
                      <span className="text-[12px] font-medium leading-4 text-[#667085]">
                        {label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Referral history table */}
              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8">
                <h2 className="text-[20px] font-extrabold text-[#1f2937]">
                  Referral History
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#e3e8ef] text-[14px] text-[#1f2937]">
                        {[
                          "Name",
                          "Phone",
                          "Status",
                          "Loan Amount",
                          "Reward",
                          "Reward Status",
                        ].map((head) => (
                          <th key={head} className="px-3 py-3 font-extrabold">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row, index) => (
                        <tr
                          key={`${row[0]}-${index}`}
                          className="border-b border-[#eef1f5] text-[13.5px] font-medium text-[#98a2b3]"
                        >
                          {row.map((cell, cellIndex) => {
                            const isStatus = cellIndex === 2;
                            const isRewardStatus =
                              cellIndex === 5 && cell !== "—";
                            return (
                              <td
                                key={`${cell}-${cellIndex}`}
                                className={`px-3 py-3.5 ${
                                  isStatus && cell === "Reward Paid"
                                    ? "font-bold text-[#1cb45c]"
                                    : isStatus && cell === "Approved"
                                      ? "font-bold text-[#a3c400]"
                                      : isStatus && cell === "Registered"
                                        ? "font-bold text-[#0d64bf]"
                                        : ""
                                }`}
                              >
                                {isRewardStatus ? (
                                  <span
                                    className={`rounded-[4px] px-2.5 py-1 text-[12px] font-semibold ${
                                      cell === "Paid"
                                        ? "bg-[#cdf3da] text-[#1cb45c]"
                                        : "bg-[#eef3bd] text-[#a3a300]"
                                    }`}
                                  >
                                    {cell}
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="grid h-fit gap-5">
              {/* Earnings card */}
              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-7">
                <h2 className="text-[16px] font-extrabold text-[#1f2937]">
                  Your Earnings
                </h2>
                <div className="mt-5 flex items-center gap-4">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fde9c8]">
                    <Image
                      src="/assets/refer/badge.png"
                      alt="Rewards badge"
                      fill
                      unoptimized
                      className="rounded-full object-contain p-2"
                    />
                  </span>
                  <span>
                    <span className="block text-[26px] font-extrabold text-[#1f2937]">
                      ₹2500
                    </span>
                    <span className="text-[13px] font-medium text-[#98a2b3]">
                      Total Rewards Earned
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-6 h-12 w-full rounded-full bg-[#1cb45c] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(28,180,92,0.25)]"
                >
                  Withdraw Earnings
                </button>
                <p className="mt-3 text-center text-[12px] font-medium text-[#98a2b3]">
                  Min. withdraw amount is ₹500
                </p>
              </div>

              {/* How it works card */}
              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-7">
                <h2 className="text-[19px] font-extrabold text-[#1f2937]">
                  How it work?
                </h2>
                <div className="mt-5 grid gap-5">
                  {howItWorks.map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dbeeff] text-[13px] font-extrabold text-[#0d64bf]">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-[13.5px] font-medium leading-5 text-[#475467]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ServiceAppBanner />
    </main>
  );
}