import { dsaOfferings } from "./dsaData";

export function DsaOfferings() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="max-w-3xl">
          <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#33393f] md:text-[28px]">
            Products you can offer as a Fintaraa partner
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dsaOfferings.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[18px] border border-[#e3eaf3] bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ff] text-[#6d28d9]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#22272e]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[#7d8794]">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
