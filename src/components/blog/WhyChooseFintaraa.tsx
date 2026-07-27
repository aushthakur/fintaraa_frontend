const featureItems = [
  "Expert Legal Expert",
  "Transparent Process",
  "Compliance-led Process",
  "End to End Support",
  "Affordable Pricing",
  "Expert Legal Expert",
  "Transparent Process",
  "Compliance-led Process",
  "End to End Support",
  "Affordable Pricing",
];

export function WhyChooseFintaraa() {
  return (
    <section className="bg-[#004E96] px-6 py-10 md:px-12 lg:px-16 text-white font-sans antialiased relative">
      <div className="mx-auto max-w-9xl">
        {/* Top Header Block Row */}
        <div className="mb-8">
          <h2 className="text-[24px] md:text-[28px] font-extrabold tracking-tight">
            Why Choose Fintaraa?
          </h2>
        </div>

        {/* 2-Row x 5-Column Compact Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {featureItems.map((label, index) => (
            <div
              key={`${label}-${index}`}
              className="flex min-h-16 items-center rounded-2xl border border-white/10 bg-white p-4 shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <span className="text-[13px] font-bold text-[#005ca8] leading-tight select-none">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
