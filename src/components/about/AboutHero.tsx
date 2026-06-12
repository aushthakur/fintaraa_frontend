import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-8 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-5 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto max-w-9xl">
        <h1 className="text-[42px] font-black leading-tight tracking-[-0.03em] text-[#2a2f36] md:text-[56px]">
          About
          <span className="block text-[#005ca8]">Fintaraa</span>
        </h1>
        <p className="mt-5 text-[24px] font-black leading-8 text-[#2a2f36]">
          Quick. Hassle-Free. Clear. Affordable.
        </p>
        <p className="mt-7 max-w-6xl text-[20px] font-medium leading-10 text-[#9aa0a6] md:text-[27px] md:leading-[1.75]">
          Using data and technology innovations, we help you choose the most
          suited offers across loans and cards. Our algorithm-based technology
          platform provides you with access to multiple personal credit offers,
          ease of comparison of multiple offers available and unbiased advice.
          From application to disbursal, Fintaraa will accompany you at each
          step, till the disbursal of loan or issuance of credit card.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-8">
          <Link
            href="/about-us"
            className="inline-flex h-16 w-72 items-center justify-center rounded-full bg-[#19b85a] text-[22px] font-semibold text-white no-underline"
          >
            About
          </Link>
          <Link
            href="/careers"
            className="inline-flex h-16 items-center justify-center px-8 text-[22px] font-semibold text-[#005ca8] no-underline"
          >
            Career
          </Link>
        </div>
      </div>
    </section>
  );
}
