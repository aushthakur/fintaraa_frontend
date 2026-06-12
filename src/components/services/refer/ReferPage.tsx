import Image from "next/image";
import {
  Copy,
  MessageCircle,
  Send,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa6";
import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";

const summary = [
  { value: "24", label: "Referred Total", icon: UserCheck },
  { value: "09", label: "Registered", icon: UserCheck },
  { value: "6", label: "Applied", icon: UserCheck },
  { value: "3", label: "Approved", icon: UserCheck },
  { value: "9", label: "₹2,500", icon: WalletCards },
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

export function ReferPage() {
  return (
    <main className="bg-white">
      <section className="relative px-4 py-8 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
        <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_23rem]">
          <div className="grid gap-8">
            <div className="rounded-xl border border-[#d7dfe8] bg-white p-8">
              <div className="grid gap-5 md:grid-cols-[1fr_0.85fr] md:items-center">
                <div>
                  <h1 className="text-[50px] font-black leading-tight tracking-[-0.03em] text-[#005ca8]">
                    Refer a friend
                    <span className="block text-[#55d87a]">earn ₹500</span>
                  </h1>
                  <p className="mt-8 text-[28px] font-semibold text-[#111827]">
                    When their loan is disbursed
                  </p>
                </div>
                <div className="relative min-h-64">
                  <Image
                    src="/assets/services/refer-hero.png"
                    alt="Refer a friend"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#d7dfe8] bg-white p-8">
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  ["Your Referral Link", "www.wayoneit.com"],
                  ["Your Referral Code", "WAYONE099"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <h2 className="text-[18px] font-black text-[#2a2f36]">
                      {label}
                    </h2>
                    <div className="mt-3 grid grid-cols-[1fr_auto]">
                      <input
                        readOnly
                        value={value}
                        className="h-12 border border-[#d7dfe8] px-6 text-[15px] font-semibold text-[#9ca3af] outline-none"
                      />
                      <button
                        type="button"
                        className="inline-flex h-12 items-center gap-2 bg-[#d8ecff] px-6 text-[15px] font-black text-[#005ca8]"
                      >
                        <Copy className="h-5 w-5" />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <h2 className="text-[18px] font-black text-[#2a2f36]">
                  Share via
                </h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {[
                    { label: "WhatsApp", icon: MessageCircle },
                    { label: "SMS", icon: Send },
                    { label: "Facebook", icon: FaFacebookF },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="inline-flex h-14 min-w-42 items-center justify-center gap-3 rounded bg-[#e8f7ff] px-6 text-[18px] font-black text-[#005ca8]"
                    >
                      <Icon className="h-7 w-7" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid rounded-xl border border-[#d7dfe8] bg-white p-8 md:grid-cols-5">
              {summary.map(({ value, label, icon: Icon }, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    index > 0 ? "md:border-l md:border-[#dce3eb]" : ""
                  }`}
                >
                  <Icon className="h-9 w-9 shrink-0 text-[#005ca8]" />
                  <span>
                    <span className="block text-[22px] font-black text-[#2a2f36]">
                      {value}
                    </span>
                    <span className="text-[15px] font-semibold text-[#9ca3af]">
                      {label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid h-fit gap-6">
            <div className="rounded-xl border border-[#d7dfe8] bg-white p-8 text-center">
              <h2 className="text-left text-[20px] font-black text-[#2a2f36]">
                Your Earnings
              </h2>
              <div className="mt-6 flex items-center justify-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d8ecff] text-[#005ca8]">
                  <WalletCards className="h-10 w-10" />
                </span>
                <span>
                  <span className="block text-[32px] font-black text-[#2a2f36]">
                    ₹2500
                  </span>
                  <span className="text-[15px] font-semibold text-[#9ca3af]">
                    Total Rewards Earned
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="mt-8 h-14 w-full rounded-full bg-[#13a653] text-[18px] font-black text-white shadow-[0_10px_20px_rgba(19,166,83,0.25)]"
              >
                Withdraw Earnings
              </button>
              <p className="mt-4 text-[14px] font-semibold text-[#9ca3af]">
                Min. withdraw amount is ₹500
              </p>
            </div>

            <div className="rounded-xl border border-[#d7dfe8] bg-white p-8">
              <h2 className="text-[28px] font-black text-[#2a2f36]">
                How it work?
              </h2>
              <div className="mt-6 grid gap-7">
                {howItWorks.map((item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] text-[16px] font-black text-[#005ca8]">
                      {index + 1}
                    </span>
                    <p className="text-[16px] font-semibold leading-6 text-[#9ca3af]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
          <h2 className="text-[28px] font-black text-[#111827]">
            Referral History
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-210 border-collapse text-left">
              <thead>
                <tr className="border-b border-[#dce3eb] text-[16px] text-[#2a2f36]">
                  {[
                    "Name",
                    "Phone",
                    "Status",
                    "Loan Amount",
                    "Reward",
                    "Reward Status",
                  ].map((head) => (
                    <th key={head} className="px-3 py-4 font-black">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => (
                  <tr
                    key={`${row[0]}-${index}`}
                    className="border-b border-[#dce3eb] text-[15px] font-semibold text-[#a0a7b2]"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${cell}-${cellIndex}`}
                        className={`px-3 py-4 ${
                          cell === "Reward Paid"
                            ? "font-black text-[#13a653]"
                            : cell === "Approved"
                              ? "font-black text-[#8ac300]"
                              : cell === "Registered"
                                ? "font-black text-[#005ca8]"
                                : ""
                        }`}
                      >
                        {cellIndex === 5 && cell !== "—" ? (
                          <span
                            className={`rounded px-3 py-2 ${
                              cell === "Paid"
                                ? "bg-[#c7f8d7] text-[#13a653]"
                                : "bg-[#eef7bf] text-[#8b9f00]"
                            }`}
                          >
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ServiceAppBanner />
    </main>
  );
}
