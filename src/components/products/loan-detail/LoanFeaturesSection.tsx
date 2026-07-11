import { iconPool } from "./LoanDetailConstants";

export function LoanFeaturesSection({
  loanType,
  featureItems,
}: {
  loanType: string;
  featureItems: string[];
}) {
  return (
    <section className="px-4 pb-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[22px] font-extrabold text-[#111827]">
          {loanType} <span className="text-[#13a653]">Features</span>
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {featureItems.map((item, index) => {
            const Icon = iconPool[index % iconPool.length];
            return (
              <div
                key={item}
                className="rounded-md border border-[#e1e7ef] bg-white p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-3 text-[12px] font-bold leading-5 text-[#344054]">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
