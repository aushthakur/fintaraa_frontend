import {
  ClipboardCheck,
  FileText,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const stats = [
  { title: "Total Applications", value: "08", icon: LockKeyhole, active: true },
  { title: "Active Applications", value: "08", icon: ShieldCheck },
  { title: "Completed Applications", value: "08", icon: FileText },
];

const tabs = [
  "Home Loan",
  "Car Loan",
  "Personal Loan",
  "Loan Against Property",
  "Car Loan",
  "Car Loan",
  "Car Loan",
];

export function StatusHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[44px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[60px]">
              My Application Status
            </h1>
            <p className="mt-3 text-[22px] font-medium text-[#111827]">
              Track the status of all your loan, insurance & credit card
              applications in real time.
            </p>
          </div>
          <span className="hidden h-30 w-30 items-center justify-center rounded-3xl bg-[#e8f4ff] text-[#005ca8] md:flex">
            <ClipboardCheck className="h-16 w-16" />
          </span>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {stats.map(({ title, value, icon: Icon, active }) => (
            <article
              key={title}
              className={`flex min-h-30 items-center gap-6 rounded-xl border bg-white p-5 ${
                active ? "border-[#005ca8]" : "border-[#d7dfe8]"
              }`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                <Icon className="h-9 w-9" />
              </span>
              <div>
                <p className="text-[18px] font-medium text-[#2a2f36]">
                  {title}
                </p>
                <p className="mt-3 text-[28px] font-black text-[#2a2f36]">
                  {value}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex gap-5 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={`${tab}-${index}`}
              type="button"
              className={`h-13 shrink-0 rounded-xl border px-8 text-[16px] font-semibold ${
                index === 0
                  ? "border-[#13a653] bg-[#13a653] text-white"
                  : "border-[#13a653] bg-white text-[#2a2f36]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
