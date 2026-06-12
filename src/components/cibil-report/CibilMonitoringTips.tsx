import Link from "next/link";

const tips = [
  "Pay EMIs and bills on time",
  "Keep credit utilization low",
  "Avoid multiple loan applications",
  "Maintain a balanced credit mix",
  "Do not close old credit cards abruptly",
];

export function CibilMonitoringTips() {
  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr]">
          <div>
            <h2 className="text-[28px] font-black text-[#111827]">
              Score History & Monitoring
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              Track your progress over the last 6 months.
            </p>
            <div className="mt-8 h-72 border-l border-b border-[#d7dfe8] bg-[linear-gradient(to_top,transparent_23%,#e5eaf0_24%,transparent_25%),linear-gradient(to_right,transparent_15%,#eef2f6_16%,transparent_17%)]">
              <svg viewBox="0 0 600 260" className="h-full w-full">
                <polyline
                  points="40,220 140,190 240,130 340,85 460,62 560,55"
                  fill="none"
                  stroke="#005ca8"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <p className="mt-4 bg-[#d9efff] px-4 py-3 text-[13px] font-semibold text-[#005ca8]">
              Great job! Your score improved by 32 points in the last 6 months.
            </p>
          </div>
          <aside className="border border-[#d7dfe8] bg-white p-6">
            <p className="text-[13px] font-black text-[#667085]">
              Expert Advice
            </p>
            <div className="mt-4 h-36 rounded bg-[#e8f4ff]" />
            <h3 className="mt-5 text-[18px] font-black text-[#111827]">
              Mastering Your CIBIL: A 10-Step Guide for Beginners
            </h3>
            <p className="mt-3 text-[13px] font-medium leading-6 text-[#667085]">
              Learn how to improve and maintain your credit health.
            </p>
            <Link href="/blog/improve-cibil-score-practical-steps" className="mt-5 block text-[13px] font-black text-[#005ca8] no-underline">
              Read full article →
            </Link>
          </aside>
        </div>

        <div className="mt-12 border-t border-[#d7dfe8] pt-8">
          <h2 className="text-[28px] font-black text-[#111827]">
            Personalized Improvement Tips
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-[#667085]">
            Track your progress over the last 6 months.
          </p>
          <div className="mt-6 divide-y divide-[#d7dfe8] border border-[#d7dfe8]">
            {tips.map((tip, index) => (
              <div key={tip} className="p-5">
                <p className="text-[14px] font-black text-[#111827]">
                  {index + 1}. {tip}
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#667085]">
                  Improve consistency and reduce risk signals in your report.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
