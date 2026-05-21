import Image from "next/image";

const bankLogos = [
  { name: "HDFC Bank", src: "/assets/banks/hdfc.png" },
  { name: "ICICI Bank", src: "/assets/banks/icici.png" },
  { name: "Indian Bank", src: "/assets/banks/indian.png" },
  { name: "IDFC First Bank", src: "/assets/banks/idfc.png" },
  { name: "State Bank of India", src: "/assets/banks/sbi.png" },
  { name: "Punjab National Bank", src: "/assets/banks/pnb.png" },
  { name: "Kotak Mahindra Bank", src: "/assets/banks/kotak.png" },
];

const marqueeLogos = [...bankLogos, ...bankLogos, ...bankLogos];

function LogoMarquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex w-max gap-4 py-2 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {marqueeLogos.map((bank, index) => (
          <div
            key={`${bank.name}-${index}-${reverse ? "reverse" : "forward"}`}
            className="flex h-18 w-44 shrink-0 items-center justify-center"
          >
            <Image
              width={140}
              height={48}
              unoptimized
              sizes="176px"
              src={bank.src}
              alt={bank.name}
              className="max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersStrip() {
  return (
    <section className="py-12">
      <div className="mx-auto">
        <h2 className="text-center text-[20px] font-extrabold text-[#101828]">
          Our Trusted Partner Banks & NBFCs
        </h2>
        <div className="relative mt-8 overflow-hidden rounded-2xl bg-white py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white to-transparent" />
          <LogoMarquee />
          <LogoMarquee reverse />
        </div>
      </div>
    </section>
  );
}
