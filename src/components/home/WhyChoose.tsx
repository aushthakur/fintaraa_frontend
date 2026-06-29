import Image from "next/image";
import {
  BadgeCheck,
  Clock3,
  FileCheck2,
  Headphones,
  IndianRupee,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
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

export function WhyChoose() {
  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl bg-[#f7fbff] p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#075cde]">
              The Fintaraa advantage
            </p>
            <h2 className="mt-3 max-w-3xl text-[30px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[40px]">
              Why Choose <span className="text-[#075cde]">Fintaraa?</span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-[#61748f]">
              We simplify your loan journey with expert guidance, transparent
              processes and complete peace of mind.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
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
            </div>
          </div>

          <div className="hidden rounded-2xl bg-white p-8 text-center lg:block">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#e9f2ff] text-[#075cde]">
              <ShieldCheck className="h-16 w-16" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#61748f]">
              {["Regulated", "People first", "Transparent", "Secure"].map(
                (item) => (
                  <span key={item} className="rounded-xl bg-white px-3 py-2">
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-4">
          {reasons.map(({ number, title, text, points, icon: Icon, image }) => (
            <article
              key={title}
              className="grid overflow-hidden rounded-xl border border-[#e2edf8] bg-white md:grid-cols-[96px_1fr_300px]"
            >
              <div className="flex items-center justify-center border-b border-[#eef4fb] bg-white p-5 md:border-b-0 md:border-r">
                <span className="text-[26px] font-bold text-[#075cde]">
                  {number}
                </span>
              </div>
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#e9f2ff] text-[#075cde]">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#07162d]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#61748f]">
                    {text}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {points.map((point) => (
                      <span
                        key={point}
                        className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#0f7a4d]"
                      >
                        <BadgeCheck className="h-4 w-4" />
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative min-h-[160px] bg-white">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain p-5"
                  unoptimized
                />
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

        <div className="mt-6 rounded-xl bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f2ff] text-[#075cde]">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-[#07162d]">
                  Our Promise to You: Secure. Reliable. Always.
                </p>
                <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-6 text-[#61748f]">
                  We show the best options for you, protect your privacy, and
                  support you when you need us.
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {["No spam", "Unbiased options", "Always here"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#075cde]"
                >
                  <FileCheck2 className="h-4 w-4" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
