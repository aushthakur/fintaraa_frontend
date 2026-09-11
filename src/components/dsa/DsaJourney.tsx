import { journeyItems } from "./dsaData";

export function DsaJourney() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-8 bg-[#edf6ff] p-8 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <h2 className="text-[24px] font-extrabold text-[#4c1d95]">
            Your Journey to
            <span className="block text-[#111827]">Partner Income Growth</span>
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-[#344054]">
            Register, complete onboarding, submit customer leads and track every
            application from one partner workflow.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {journeyItems.map(({ title, icon: Icon }) => (
              <span
                key={title}
                className="flex items-center gap-2 text-[12px] font-extrabold text-[#4c1d95]"
              >
                <Icon className="h-4 w-4" />
                {title}
              </span>
            ))}
          </div>
          <a
            href="#dsa-form"
            className="mt-6 inline-flex h-10 items-center justify-center bg-[#4c1d95] px-5 text-[12px] font-extrabold text-white no-underline"
          >
            Start Your Application Now
          </a>
        </div>
        <div className="rounded bg-white p-5 shadow-[0_18px_40px_rgba(0,92,168,0.12)]">
          <div className="mb-4 flex items-center gap-2 text-[12px] font-extrabold text-[#4c1d95]">
            Partner Dashboard
          </div>
          <div className="grid gap-3">
            <div className="h-12 rounded bg-[#f1f5f9]" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded bg-[#f1f5f9]" />
              <div className="h-16 rounded bg-[#f1f5f9]" />
            </div>
            <div className="h-10 rounded bg-[#4c1d95]" />
          </div>
        </div>
      </div>
    </section>
  );
}
