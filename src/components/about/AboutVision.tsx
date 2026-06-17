const cards = [
  "India's largest consumer credit marketplace",
  "India's largest consumer credit marketplace",
  "India's largest consumer credit marketplace",
];

export function AboutVision() {
  return (
    <section className="px-4 pb-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[18px] font-extrabold text-[#2b2f38] md:text-[22px]">
          Our Vision
        </h2>
        <p className="mt-4 max-w-6xl text-[14px] font-medium leading-8 text-[#9aa0a6] md:text-[18px] md:leading-9">
          My Fintaraa has built with the vision to create a financially stable
          and financially aware society. We are making loans a planned decision
          and we are reshaping the orthodox mindset of people that money does
          not grow on trees. Money does grow on trees, you just need to plant
          the correct seed at the right time. With the current growth trend of
          My Fintaraa, we believe that the day of achievement of your target is
          not too far.
        </p>

        <div className="relative mt-10">
          <div className="h-[250px] rounded-[10px] bg-[linear-gradient(rgba(57,193,111,0.6),rgba(57,193,111,0.6)),url('/assets/images/hero1.png')] bg-cover bg-center shadow-[0_10px_25px_rgba(16,24,40,0.12)] md:h-[280px]" />
          <div className="-mt-18 grid gap-5 px-4 md:grid-cols-3 md:px-8">
            {cards.map((title, index) => (
              <article
                key={`${title}-${index}`}
                className="rounded-[12px] border border-[#cfeede] bg-white p-5 shadow-[0_10px_22px_rgba(16,24,40,0.08)] md:p-6"
              >
                <span className="block h-14 w-14 rounded-[10px] bg-[#d1d5db]" />
                <h3 className="mt-5 text-[16px] font-medium leading-6 text-[#111827]">
                  {title}
                </h3>
                <p className="mt-4 text-[12px] font-medium leading-6 text-[#9aa0a6]">
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
