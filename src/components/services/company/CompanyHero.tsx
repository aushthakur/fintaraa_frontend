import { ArrowRight, Building2, FileText, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Private Limited Company",
    text: "Incorporate Your Private Limited Company",
    icon: Building2,
  },
  {
    title: "LLP Registration",
    text: "Incorporate Your Private Limited Company",
    icon: FileText,
  },
  {
    title: "One Person Company",
    text: "Incorporate Your Private Limited Company",
    icon: ShieldCheck,
  },
  {
    title: "Trademark Registration",
    text: "Incorporate Your Private Limited Company",
    icon: FileText,
  },
];

const fields = [
  { label: "Full Name", placeholder: "Enter Name", type: "text" },
  { label: "Mobile Number", placeholder: "Enter Mobile Number", type: "tel" },
  { label: "Email Address", placeholder: "Enter Email", type: "email" },
  { label: "Business Type", placeholder: "Select Business Type", type: "select" },
  { label: "Service Required", placeholder: "Select Service", type: "select" },
  {
    label: "Brief Requirements",
    placeholder: "Write Your Requirements",
    type: "textarea",
  },
];

export function CompanyHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h1 className="max-w-4xl text-[40px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[58px]">
            Company Formation & Trademark Registration
          </h1>
          <p className="mt-5 max-w-2xl text-[20px] font-medium leading-7 text-[#111827]">
            Start your business journey with easy we handle the legal, you focus
            on growth.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {services.map(({ title, text, icon: Icon }) => (
              <div
                key={String(title)}
                className="rounded border border-[#d9e2ec] bg-white p-8 text-center shadow-[0_8px_20px_rgba(16,24,40,0.08)]"
              >
                <span className="mx-auto flex h-22 w-22 items-center justify-center rounded-full bg-[#d8ecff] text-[#00a3ff]">
                  <Icon className="h-10 w-10" />
                </span>
                <h3 className="mt-8 text-[24px] font-black leading-7 text-[#111827]">
                  {title}
                </h3>
                <p className="mt-5 text-[15px] font-semibold leading-6 text-[#9ca3af]">
                  {text}
                </p>
                <span className="mx-auto mt-7 flex h-10 w-10 items-center justify-center rounded-full bg-[#d8ecff] text-[#005ca8]">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md self-start">
          <div className="absolute -right-9 -top-9 h-full w-full rounded bg-[#005ca8]" />
          <div className="relative rounded bg-white p-8 shadow-[0_18px_45px_rgba(16,24,40,0.14)]">
            <h2 className="text-[24px] font-black text-[#2a2f36]">
              Tell Us Your Requirements
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#8b95a3]">
              We get touch with the best legal expert for you.
            </p>
            <form className="mt-6 grid gap-5">
              {fields.map(({ label, placeholder, type }) => (
                <label key={label} className="grid gap-2">
                  <span className="text-[13px] font-black text-[#2a2f36]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-11 border border-[#d9dfe8] bg-white px-4 text-[12px] font-semibold text-[#8b95a3] outline-none">
                      <option>{placeholder}</option>
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      placeholder={placeholder}
                      className="min-h-20 border border-[#d9dfe8] px-4 py-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2]"
                    />
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-11 border border-[#d9dfe8] px-4 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2]"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="mx-auto mt-2 h-13 w-64 rounded-full bg-[#13a653] text-[13px] font-black text-white"
              >
                Submit Inquiry
              </button>
              <p className="text-center text-[11px] font-semibold text-[#a0a7b2]">
                Your information is safe with us
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
