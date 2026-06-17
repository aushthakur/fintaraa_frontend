import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-8 md:px-6 lg:px-8 md:pt-10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        <div
          className="absolute hidden md:block bg-[#dfeefe] opacity-70"
          style={{
            width: "46px",
            height: "78px",
            top: "-8px",
            left: "-24px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        <div
          className="absolute hidden md:block bg-[#dfeefe] opacity-70"
          style={{
            width: "50px",
            height: "96px",
            top: "-72px",
            left: "20px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-9xl">
        <h1 className="text-[36px] font-black leading-[1.02] tracking-[-0.06em] text-[#2b2f38] md:text-[48px] lg:text-[60px]">
          About
          <span className="block text-[#0d64bf]">Fintaraa</span>
        </h1>
        <p className="mt-5 text-[18px] font-extrabold leading-7 text-[#2b2f38] md:text-[24px]">
          Quick. Hassle-Free. Clear. Affordable.
        </p>
        <p className="mt-4 max-w-6xl text-[15px] font-medium leading-8 text-[#9aa0a6] md:text-[18px] md:leading-9">
          Using data and technology innovations, we help you choose the most
          suited offers across loans and cards. Our algorithm-based technology
          platform provides you with access to multiple personal credit offers,
          ease of comparison of multiple offers available and unbiased advice.
          From application to disbursal, Fintaraa will accompany you at each
          step, till the disbursal of loan or issuance of credit card.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/about-us"
            className="inline-flex h-12 w-[200px] items-center justify-center rounded-full bg-[#1cb45c] text-[14px] font-semibold text-white no-underline shadow-[0_14px_28px_rgba(28,180,92,0.2)] transition hover:bg-[#16954d]"
          >
            About
          </Link>
          <Link
            href="/careers"
            className="inline-flex h-12 items-center justify-center px-4 text-[14px] font-semibold text-[#0d64bf] no-underline"
          >
            Career
          </Link>
        </div>
      </div>
    </section>
  );
}
