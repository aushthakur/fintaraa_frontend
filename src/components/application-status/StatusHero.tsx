import Image from "next/image";
import {
  BriefcaseBusiness,
  Car,
  CreditCard,
  FileText,
  Home,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Umbrella,
  UserRound,
} from "lucide-react";

type StatusHeroProps = {
  totalApplications?: number;
  activeApplications?: number;
  completedApplications?: number;
};

const formatCount = (value?: number) =>
  String(Math.max(0, Number(value) || 0)).padStart(2, "0");

const productTabs = [
  { label: "Home Loan", icon: Home, active: true },
  { label: "Car Loan", icon: Car },
  { label: "Personal Loan", icon: UserRound },
  { label: "Loan Against Property", icon: Landmark },
  { label: "Business Loan", icon: BriefcaseBusiness },
  { label: "Credit Card", icon: CreditCard },
  { label: "Insurance", icon: Umbrella },
];

export function StatusHero({
  totalApplications = 0,
  activeApplications = 0,
  completedApplications = 0,
}: StatusHeroProps) {
  const stats = [
    {
      title: "Total Applications",
      value: formatCount(totalApplications),
      icon: LockKeyhole,
      active: true,
    },
    {
      title: "Active Applications",
      value: formatCount(activeApplications),
      icon: ShieldCheck,
    },
    {
      title: "Completed Applications",
      value: formatCount(completedApplications),
      icon: FileText,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8fbff] px-4 pb-8 pt-7 md:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/*Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
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
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-5xl">
            <h1 className="text-[34px] font-black leading-[1.08] tracking-normal text-[#005ca8] sm:text-[44px] lg:text-[56px]">
              My Application Status
            </h1>
            <p className="mt-4 max-w-4xl text-[16px] font-semibold leading-7 text-[#344054] md:text-[20px]">
              Track the status of all your loan, insurance & credit card
              applications in real time.
            </p>
          </div>
          <div className="hidden h-28 w-36 shrink-0 items-center justify-center md:flex lg:h-32 lg:w-44">
            <Image
              src="/assets/images/application-status.png"
              alt="Application status illustration"
              width={176}
              height={128}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {stats.map(({ title, value, icon: Icon, active }) => (
            <article
              key={title}
              className={`flex min-h-28 items-center gap-5 rounded-2xl border bg-white p-5 shadow-[0_14px_36px_rgba(16,24,40,0.06)] transition ${
                active ? "border-[#005ca8]" : "border-[#d7dfe8]"
              }`}
            >
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                  active
                    ? "bg-[#005ca8] text-white"
                    : "bg-[#e8f4ff] text-[#005ca8]"
                }`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-5 text-[#344054] md:text-[17px]">
                  {title}
                </p>
                <p className="mt-2 text-[30px] font-black leading-none text-[#101828]">
                  {value}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex gap-3 overflow-x-auto pb-1">
          {productTabs.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              aria-pressed={Boolean(active)}
              className={`inline-flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-[14px] font-black transition md:h-13 md:px-6 md:text-[15px] ${
                active
                  ? "border-[#13a653] bg-[#13a653] text-white shadow-[0_12px_28px_rgba(19,166,83,0.22)]"
                  : "border-[#b7e2c8] bg-white text-[#344054] hover:border-[#13a653] hover:text-[#0b7f3b]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
