import Image from "next/image";

const services = [
  {
    title: "Private Limited Company",
    text: "Incorporate Your Private Limited Company",
    image: "/assets/services/company/private-limited-icon.png",
  },
  {
    title: "LLP Registration",
    text: "Incorporate Your Private Limited Company",
    image: "/assets/services/company/llp-registration-icon.png",
  },
  {
    title: "One Person Company",
    text: "Incorporate Your Private Limited Company",
    image: "/assets/services/company/one-person-company-icon.png",
  },
  {
    title: "Trademark Registration",
    text: "Incorporate Your Private Limited Company",
    image: "/assets/services/company/trademark-registration-icon.png",
  },
];

const fields = [
  { label: "Full Name", placeholder: "Enter Name", type: "text" },
  { label: "Mobile Number", placeholder: "Enter Mobile Number", type: "tel" },
  { label: "Email Address", placeholder: "Enter Email", type: "email" },
  { label: "Business Type", placeholder: "Select Business Type", type: "select" },
  { label: "Service Requiered", placeholder: "Select Service", type: "select" },
  {
    label: "Brief Requirements",
    placeholder: "Write Your Requirements",
    type: "textarea",
  },
];

export function CompanyHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
            <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/*Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h1 className="max-w-4xl text-[36px] font-bold leading-tight tracking-[-0.02em] text-[#1a5fa8] md:text-[50px]">
            Company Formation &amp; Trademark Registration
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] font-medium leading-7 text-[#1f2937] md:text-[19px]">
            Start your business journey with easy we handle the legal, you
            focus on growth.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {services.map(({ title, text, image }) => (
              <div
                key={title}
                className="rounded-xl border border-[#e3e8ef] bg-white p-7 text-center shadow-[0_4px_18px_rgba(16,24,40,0.05)]"
              >
                <span className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d8ecff]">
                  <Image
                    src={image}
                    alt={title}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-14 w-14 object-contain"
                  />
                </span>
                <h3 className="mt-6 text-[20px] font-bold leading-7 text-[#111827]">
                  {title}
                </h3>
                <p className="mt-3 text-[13px] font-medium leading-5 text-[#9ca3af]">
                  {text}
                </p>
                <button
                  type="button"
                  aria-label={`Learn more about ${title}`}
                  className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#d8ecff] text-[#1a5fa8] transition hover:bg-[#c3e0fa]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md self-start">
          <div className="absolute -right-7 -top-7 h-full w-full rounded-2xl bg-[#005ca8]" />
          <div className="relative rounded-2xl bg-white p-8 shadow-[0_18px_45px_rgba(16,24,40,0.14)]">
            <h2 className="text-[22px] font-bold text-[#1f2937]">
              Tell Us Your Requirements
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-5 text-[#8b95a3]">
              We get touch with the best legal expert for you.
            </p>
            <form className="mt-6 grid gap-5">
              {fields.map(({ label, placeholder, type }) => (
                <label key={label} className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select className="h-12 rounded-lg border border-[#d9dfe8] bg-white px-4 text-[13px] font-medium text-[#8b95a3] outline-none focus:border-[#005ca8]">
                      <option>{placeholder}</option>
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      placeholder={placeholder}
                      className="min-h-20 rounded-lg border border-[#d9dfe8] px-4 py-3 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                    />
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="h-12 rounded-lg border border-[#d9dfe8] px-4 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="mx-auto mt-2 h-13 w-64 rounded-full bg-gradient-to-r from-[#1cb45c] to-[#28cf6c] text-[14px] font-bold text-white"
              >
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-[#a0a7b2]">
                🔒 Your information safe with us
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}