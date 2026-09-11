import { journeyItems } from "./franchiseData";

export function FranchiseJourney() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-8 rounded-2xl bg-[#edf6ff] p-8 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <h2 className="text-[24px] font-extrabold leading-tight text-[#4c1d95]">
            Your Journey to
            <span className="block text-[#111827]">
              Franchise Business Growth
            </span>
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-[#344054]">
            Create your partner profile, complete onboarding and start serving
            customers through a guided Fintaraa partner workflow.
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
            href="#franchise-form"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#4c1d95] px-6 text-[12px] font-extrabold text-white no-underline transition-opacity hover:opacity-90"
          >
            Start Your Application Now
          </a>
        </div>

        {/* Mock app/form card */}
        <div className="rounded-xl bg-white p-5 shadow-[0_18px_40px_rgba(0,92,168,0.12)]">
          <div className="mb-4 text-[12px] font-extrabold text-[#4c1d95]">
            Partner Application
          </div>
          <div className="grid gap-3">
            <div className="h-10 rounded-lg bg-[#f1f5f9]" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded-lg bg-[#f1f5f9]" />
              <div className="h-14 rounded-lg bg-[#f1f5f9]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded-lg bg-[#f1f5f9]" />
              <div className="h-14 rounded-lg bg-[#f1f5f9]" />
            </div>
            <div className="h-10 rounded-full bg-[#4c1d95]" />
          </div>
        </div>
      </div>
    </section>
  );
}
