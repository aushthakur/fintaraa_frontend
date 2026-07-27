const reasons = [
  {
    title: "Expert Legal Guidance",
    text: "Get assistance from experienced experts who clarify every detail and help you make confident loan decisions.",
    points: ["Legal support at every stage", "Documentation made easy"],
  },
  {
    title: "Transparent Process",
    text: "Clear, simple and transparent process with no hidden fees or surprises. Know what you pay and why.",
    points: ["No hidden charges", "Full clarity from start to finish"],
  },
  {
    title: "Compliance-led Process",
    text: "All loans are processed through trusted partner guidelines and industry best practices for complete security.",
    points: ["RBI compliant partners", "Secure and verified loan process"],
  },
  {
    title: "End to End Support",
    text: "Our support team is with you from application to disbursal and after that whenever help is needed.",
    points: ["Real human support", "Quick response every time"],
  },
  {
    title: "Affordable & Competitive Pricing",
    text: "Best-in-class services at competitive pricing so you get maximum value from each financial decision.",
    points: ["Lowest processing fee options", "Best loan options, always"],
  },
];

const stats = [
  { value: "2M+", label: "Happy customers" },
  { value: "30+", label: "Partner banks & NBFCs" },
  { value: "₹50,000 Cr+", label: "Processed successfully" },
  { value: "24-48 hrs", label: "Average approval time" },
  { value: "4.8/5", label: "Customer rating" },
];

export function WhyChoose() {
  return (
    <section className="bg-white px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl bg-[#f7fbff] p-4 sm:p-6">
        <h2 className="mt-3 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[34px]">
          Why Choose <span className="text-[#075cde]">Fintaraa?</span>
        </h2>

        <div
          role="region"
          aria-label="Why choose Fintaraa"
          className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {reasons.map(({ title, text, points }) => (
            <article
              key={title}
              className="h-full rounded-xl border border-[#e2edf8] bg-white p-4"
            >
              <h3 className="text-[15px] font-bold leading-snug text-[#07162d]">
                {title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-5 text-[#61748f]">
                {text}
              </p>
              <div className="mt-3 grid gap-2">
                {points.slice(0, 1).map((point) => (
                  <span
                    key={point}
                    className="text-[12px] font-semibold text-[#0f7a4d]"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white p-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl px-2 py-3 text-center lg:p-4"
            >
              <p className="text-sm font-bold leading-none text-[#075cde] lg:text-[20px]">
                {value}
              </p>
              <p className="mt-2 text-[10px] font-semibold text-[#61748f] lg:text-[12px]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
