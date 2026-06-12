const cards = [
  "India's largest consumer credit marketplace",
  "India's largest consumer credit marketplace",
  "India's largest consumer credit marketplace",
];

export function AboutVision() {
  return (
    <section className="px-4 pb-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[27px] font-black text-[#2a2f36]">Our Vision</h2>
        <p className="mt-5 max-w-6xl text-[22px] font-medium leading-[1.7] text-[#9aa0a6] md:text-[26px]">
          My Fintaraa has built with the vision to create a financially stable
          and financially aware society. We are making loans a planned decision
          and we are reshaping the orthodox mindset of people that money does
          not grow on trees. Money does grow on trees, you just need to plant
          the correct seed at the right time. With the current growth trend of
          My Fintaraa, we believe that the day of achievement of your target is
          not too far.
        </p>

        <div className="relative mt-16">
          <div className="h-86 rounded-xl bg-[linear-gradient(rgba(19,166,83,0.54),rgba(19,166,83,0.54)),url('/assets/about/team.jpg')] bg-cover bg-center shadow-[0_10px_25px_rgba(16,24,40,0.12)]" />
          <div className="-mt-18 grid gap-6 px-6 md:grid-cols-3 md:px-10">
            {cards.map((title, index) => (
              <article
                key={`${title}-${index}`}
                className="rounded-xl border border-[#c8f0d8] bg-white p-8 shadow-[0_10px_22px_rgba(16,24,40,0.08)]"
              >
                <span className="block h-20 w-20 rounded-xl bg-[#d1d5db]" />
                <h3 className="mt-7 text-[20px] font-semibold leading-7 text-[#111827]">
                  {title}
                </h3>
                <p className="mt-6 text-[15px] font-medium leading-8 text-[#9aa0a6]">
                  Fintaraa is India&apos;s largest digital consumer credit
                  marketplace, offering wide choice and ease of comparison.
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
