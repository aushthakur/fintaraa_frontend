import { cultureValues } from "./careersData";

export function CareersCulture() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[20px] font-black text-[#2a2f36]">
          Our Culture & Values
        </h2>
        <div className="mt-7 grid gap-5 md:grid-cols-5">
          {cultureValues.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-[#d7dfe8] bg-white p-6 text-center">
              <span className="mx-auto flex h-13 w-13 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-[13px] font-black">{title}</h3>
              <p className="mt-3 text-[11px] font-medium leading-5 text-[#8b95a3]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
