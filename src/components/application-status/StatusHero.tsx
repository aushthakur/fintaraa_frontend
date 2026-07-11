import { CheckCircle2, ClipboardList, Clock3 } from "lucide-react";

type StatusHeroProps = {
  totalApplications?: number;
  activeApplications?: number;
  completedApplications?: number;
};

const formatCount = (value?: number) =>
  String(Math.max(0, Number(value) || 0)).padStart(2, "0");

export function StatusHero({
  totalApplications = 0,
  activeApplications = 0,
  completedApplications = 0,
}: StatusHeroProps) {
  const stats = [
    {
      title: "Total",
      value: formatCount(totalApplications),
      icon: ClipboardList,
      tone: "bg-[#eaf4ff] text-[#005ca8]",
    },
    {
      title: "Active",
      value: formatCount(activeApplications),
      icon: Clock3,
      tone: "bg-[#fff7e8] text-[#b54708]",
    },
    {
      title: "Completed",
      value: formatCount(completedApplications),
      icon: CheckCircle2,
      tone: "bg-[#ecfdf3] text-[#027a48]",
    },
  ];

  return (
    <section className="border-b border-[#e7eef6] bg-[#f8fbff] px-4 py-7 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-9xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#667085]">
            Application tracker
          </p>
          <h1 className="mt-2 text-[34px] font-extrabold leading-tight tracking-[-0.02em] text-[#07162d] md:text-[46px]">
            Application Status
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-136">
          {stats.map(({ title, value, icon: Icon, tone }) => (
            <article
              key={title}
              className="flex items-center gap-3 bg-white px-4 py-3"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                  {title}
                </p>
                <p className="mt-1 text-[24px] font-extrabold leading-none text-[#07162d]">
                  {value}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
