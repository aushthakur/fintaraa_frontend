import { ArrowRight, ShieldCheck } from "lucide-react";
import { franchiseSteps, investmentRows, returnRows } from "./franchiseData";

function DataTable({
  title,
  subtitle,
  headers,
  rows,
}: {
  title: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="rounded-xl border border-[#d9e2ec] bg-white p-6">
      <h3 className="text-center text-[18px] font-extrabold text-[#111827]">
        {title}
      </h3>
      <p className="mt-1 text-center text-[12px] font-semibold text-[#8b95a3]">
        {subtitle}
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-105 border-collapse text-[13px]">
          <thead className="border-b border-[#dce3eb] text-[#4c1d95]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="pb-3 text-left font-extrabold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-[#dce3eb]">
                {row.map((cell, index) => (
                  <td
                    key={cell}
                    className={`py-4 ${
                      index === 1
                        ? "font-extrabold text-[#111827]"
                        : "font-semibold text-[#667085]"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FranchiseModel() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[18px] font-bold text-[#222]">
          Understanding Our Franchise Model
        </h2>

        {/* 6-step horizontal flow with arrows */}
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="grid min-w-190 grid-cols-6 gap-2">
            {franchiseSteps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <span className="mx-auto flex h-13.5 w-13.5 items-center justify-center rounded-xl bg-[#EEF6FF]">
                  <ShieldCheck className="h-10 w-10 text-[#4c1d95]" />
                </span>
                {index < franchiseSteps.length - 1 ? (
                  <ArrowRight
                    className="
  absolute
  -right-6.5
  top-2.5
  h-8.5
  w-8.5
  text-[#4c1d95]
  "
                  />
                ) : null}
                <h3 className="mt-4 text-[12px] font-extrabold leading-5 text-[#111827]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11px] font-medium leading-5 text-[#667085]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Two tables */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <DataTable
            title="Investment Required"
            subtitle="Choose the franchise model that suits you"
            headers={["Franchise Model", "Investment Range"]}
            rows={investmentRows}
          />
          <DataTable
            title="Expected Returns"
            subtitle="High earning potential & attractive margins"
            headers={["Monthly Business", "Estimated Monthly Earnings*"]}
            rows={returnRows}
          />
        </div>
      </div>
    </section>
  );
}
