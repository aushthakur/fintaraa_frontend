import Image from "next/image";

type BankLogo = {
  name: string;
  src: string;
};

const bankLogos = [
  { name: "UCO Bank", src: "/assets/banks/UCO-Bank.png" },
  { name: "Indian Bank", src: "/assets/banks/indian-bank.png" },
  { name: "Yes Bank", src: "/assets/banks/yes-bank.png" },
  { name: "Bank of India", src: "/assets/banks/bank-of-india.png" },
  { name: "Bandhan Bank", src: "/assets/banks/Bandhan-Bank.png" },
  { name: "Kotak Mahindra Bank", src: "/assets/banks/Kotak-Mahindra-Bank.png" },
  { name: "South Indian Bank", src: "/assets/banks/south-indian-bank.png" },
  { name: "State Bank of India", src: "/assets/banks/State-Bank-of-India.png" },
  { name: "Canara Bank", src: "/assets/banks/canara-bank.png" },
  {
    name: "Central Bank of India",
    src: "/assets/banks/Central-Bank-of-India.png",
  },
  {
    name: "Punjab National Bank",
    src: "/assets/banks/Punjab-National-Bank.png",
  },
  { name: "Federal Bank", src: "/assets/banks/Federal-Bank.png" },
  { name: "IDBI Bank", src: "/assets/banks/IDBI-Bank.png" },
  { name: "HDFC Bank", src: "/assets/banks/HDFC-Bank.png" },
  { name: "Axis Bank", src: "/assets/banks/axis-bank.png" },
  { name: "Union Bank", src: "/assets/banks/union-bank.png" },
  { name: "Punjab & Sind Bank", src: "/assets/banks/Punjab-&-Sind-Bank.png" },
  { name: "ICICI Bank", src: "/assets/banks/ICICI-Bank.png" },
  { name: "Bank of Baroda", src: "/assets/banks/Bank-of-Baroda.png" },
  { name: "IndusInd Bank", src: "/assets/banks/IndusInd-Bank.png" },
] satisfies BankLogo[];

const midpoint = Math.ceil(bankLogos.length / 2);
const logoRows = [bankLogos.slice(0, midpoint), bankLogos.slice(midpoint)];

function LogoMarquee({
  logos,
  reverse = false,
}: {
  logos: BankLogo[];
  reverse?: boolean;
}) {
  const marqueeLogos = [...logos, ...logos, ...logos];

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
            className="flex h-18 w-44 shrink-0 items-center justify-center rounded-xl bg-white px-4"
          >
            <Image
              width={140}
              height={48}
              unoptimized
              src={bank.src}
              alt={bank.name}
              className="max-w-full object-contain"
              style={{ width: "auto", height: "auto" }}
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
          <LogoMarquee logos={logoRows[0]} />
          <LogoMarquee logos={logoRows[1]} reverse />
        </div>
      </div>
    </section>
  );
}
