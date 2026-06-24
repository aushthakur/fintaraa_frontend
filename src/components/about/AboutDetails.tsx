import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  CreditCard,
  HandCoins,
  ShieldCheck,
} from "lucide-react";

const companyStats = [
  { label: "Bank and NBFC partners", value: "30+" },
  { label: "Product categories", value: "20+" },
  { label: "Application support", value: "End-to-end" },
  { label: "Customer-first guidance", value: "100%" },
];

const services = [
  {
    title: "Loans",
    text: "Home loans, personal loans, business loans, loan against property, vehicle loans and other secured or unsecured credit products.",
    icon: HandCoins,
  },
  {
    title: "Credit Cards",
    text: "Cards for cashback, rewards, travel, fuel and lifestyle benefits, with comparison support before application.",
    icon: CreditCard,
  },
  {
    title: "Insurance",
    text: "Assisted discovery for health, life, vehicle, property and business insurance requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Documentation Support",
    text: "Guidance on KYC, income documents, bank statements and lender-specific application requirements.",
    icon: ClipboardCheck,
  },
];

const principles = [
  "Transparent comparison of available financial products",
  "Eligibility-first approach before customers apply",
  "Clear documentation guidance to reduce delays",
  "Secure handling of customer information",
  "Assisted coordination from enquiry to approval",
  "Practical advice suited to Indian borrowers and families",
];

export function AboutDetails() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#195585]">
              <Building2 className="h-3.5 w-3.5 text-[#12b76a]" />
              Company Profile
            </span>
            <h2 className="mt-4 text-[28px] font-black tracking-[-0.02em] text-[#07162d] md:text-[36px]">
              A guided financial marketplace for Indian customers.
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-8 text-[#667085] md:text-[17px]">
              Fintaraa helps customers compare and apply for financial products
              with clearer information, faster coordination and practical
              support. The platform brings loans, credit cards, insurance and
              financial services into one assisted journey so customers can make
              decisions with confidence.
            </p>
            <p className="mt-4 text-[15px] font-medium leading-8 text-[#667085] md:text-[17px]">
              Our role is to simplify the steps that usually slow customers
              down: understanding eligibility, comparing lender options,
              preparing documents, submitting applications and tracking the next
              action until closure.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {companyStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#e4edf5] bg-[#f8fcff] p-5"
              >
                <div className="text-[26px] font-black text-[#0d64bf]">
                  {item.value}
                </div>
                <p className="mt-2 text-[13px] font-bold leading-5 text-[#667085]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#e4edf5] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.03)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#12b76a]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[17px] font-black text-[#07162d]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
                {text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[#f8fcff] p-6 ring-1 ring-[#e4edf5] md:p-8">
          <h2 className="text-[22px] font-black text-[#07162d]">
            How We Work
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#edf3f8]"
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#12b76a]" />
                <p className="text-[13px] font-bold leading-6 text-[#475467]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
