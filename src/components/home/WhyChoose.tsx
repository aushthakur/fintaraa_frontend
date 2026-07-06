import {
  BadgeCheck,
  Clock3,
  Headphones,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  // Star,
  Tags,
  ThumbsUp,
  UserCheck,
  UsersRound,
} from "lucide-react";

const reasons = [
  {
    number: "01",
    title: "Expert Legal Guidance",
    text: "Get assistance from experienced experts who clarify every detail and help you make confident loan decisions.",
    points: ["Legal support at every stage", "Documentation made easy"],
    icon: UserCheck,
    image: "/assets/services/company/private-limited-icon.png",
  },
  {
    number: "02",
    title: "Transparent Process",
    text: "Clear, simple and transparent process with no hidden fees or surprises. Know what you pay and why.",
    points: ["No hidden charges", "Full clarity from start to finish"],
    icon: RefreshCw,
    image: "/assets/services/itr-hero.png",
  },
  {
    number: "03",
    title: "100% Compliances Assured",
    text: "All loans are processed through trusted partner guidelines and industry best practices for complete security.",
    points: ["RBI compliant partners", "Secure and verified loan process"],
    icon: ShieldCheck,
    image: "/assets/images/security.png",
  },
  {
    number: "04",
    title: "End to End Support",
    text: "Our support team is with you from application to disbursal and after that whenever help is needed.",
    points: ["Real human support", "Quick response every time"],
    icon: Headphones,
    image: "/assets/images/help-desk 1.png",
  },
  {
    number: "05",
    title: "Affordable & Competitive Pricing",
    text: "Best-in-class services at competitive pricing so you get maximum value from each financial decision.",
    points: ["Lowest processing fee options", "Best loan options, always"],
    icon: Tags,
    image: "/assets/images/coin-bag.png",
  },
];

const stats = [
  { value: "2M+", label: "Happy customers", icon: UsersRound },
  { value: "30+", label: "Partner banks & NBFCs", icon: BadgeCheck },
  { value: "₹50,000 Cr+", label: "Processed successfully", icon: IndianRupee },
  { value: "24-48 hrs", label: "Average approval time", icon: Clock3 },
  { value: "4.8/5", label: "Customer rating", icon: ThumbsUp },
];

// const miniTestimonials = [
//   {
//     name: "Neha V.",
//     text: "Eligibility was clear and the team helped me compare my options quickly.",
//   },
//   {
//     name: "Amit J.",
//     text: "The document checklist and callback support kept the application moving.",
//   },
// ];

export function WhyChoose() {
  return (
    <section className="bg-white px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl bg-[#f7fbff] p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            {/* <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#075cde]">
              The Fintaraa advantage
            </p> */}
            <h2 className="mt-3 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[34px]">
              Why Choose <span className="text-[#075cde]">Fintaraa?</span>
            </h2>
            {/* <p className="mt-3 max-w-2xl text-[14px] font-medium leading-6 text-[#61748f]">
              We simplify your loan journey with expert guidance, transparent
              processes and complete peace of mind.
            </p> */}
            {/* <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Trusted by 2M+ customers",
                "RBI compliant & secure",
                "Your data is 100% safe",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#075cde]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {item}
                </span>
              ))}
            </div> */}
          </div>

          {/* <div className="hidden rounded-2xl bg-white p-5 lg:block">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f2ff] text-[#075cde]">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] font-semibold text-[#61748f]">
              {["Regulated", "People first", "Transparent", "Secure"].map(
                (item) => (
                  <span key={item} className="rounded-xl bg-white px-3 py-2">
                    {item}
                  </span>
                ),
              )}
            </div>
          </div> */}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {reasons.map(({ number, title, text, points, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-[#e2edf8] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e9f2ff] text-[#075cde]">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[20px] font-bold text-[#075cde]">
                  {number}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-bold leading-snug text-[#07162d]">
                {title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-5 text-[#61748f]">
                {text}
              </p>
              <div className="mt-3 grid gap-2">
                {points.slice(0, 1).map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#0f7a4d]"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3 rounded-xl bg-white p-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-white p-4">
              <Icon className="h-5 w-5 text-[#075cde]" />
              <p className="mt-3 text-[20px] font-bold leading-none text-[#075cde]">
                {value}
              </p>
              <p className="mt-1 text-[12px] font-semibold text-[#61748f]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* <div className="mt-6 grid gap-3 md:grid-cols-2">
          {miniTestimonials.map((item) => (
            <div key={item.name} className="rounded-xl bg-white p-4">
              <div className="flex items-center gap-2 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-[13px] font-semibold leading-6 text-[#61748f]">
                &quot;{item.text}&quot;
              </p>
              <p className="mt-2 text-[12px] font-bold text-[#07162d]">
                {item.name}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
