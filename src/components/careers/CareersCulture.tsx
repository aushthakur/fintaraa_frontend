import { cultureValues } from "./careersData";

export function CareersCulture() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[20px] font-extrabold text-[#2b2f38]">
          Our Culture & Values
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {cultureValues.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-[#d9e1ea] bg-white px-4 py-5 text-center shadow-[0_4px_14px_rgba(16,24,40,0.03)]"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf5ff] text-[#6d28d9]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[13px] font-extrabold text-[#2b2f38]">
                {title}
              </h3>
              <p className="mt-2 text-[11px] font-medium leading-5 text-[#8b95a3]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
