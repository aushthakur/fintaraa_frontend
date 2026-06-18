import Image from "next/image";

interface BankLogo {
  name: string;
  src: string;
}

const tabs = ["Loan", "Insurance", "Credit Card", "Credit Bureau"];

const bankLogos: BankLogo[] = [
  { name: "Bank of Baroda", src: "/assets/banks/Bank-of-Baroda1.png" },
  { name: "State Bank of India", src: "/assets/banks/Sbi1.png" },
  { name: "Shriram Finance", src: "/assets/banks/Shriram.png" },
  { name: "IndusInd Bank", src: "/assets/banks/Indusind.png" },
  { name: "Bajaj Finserv", src: "/assets/banks/Bajaj.png" },
  { name: "Kotak Mahindra Bank", src: "/assets/banks/Kotak-Mahindra-Bank.png" },
  { name: "IndusInd Bank Alt", src: "/assets/banks/Indusind.png" },
  { name: "Shriram Finance Alt", src: "/assets/banks/Shriram.png" },
  { name: "Bajaj Finserv Alt", src: "/assets/banks/Bajaj.png" },
  { name: "Kotak Mahindra Bank Alt", src: "/assets/banks/Kotak-Mahindra-Bank.png" },
  { name: "State Bank of India Alt", src: "/assets/banks/Sbi1.png" },
  { name: "Bank of Baroda Alt", src: "/assets/banks/Bank-of-Baroda1.png" },
];

export function CreditPartners() {
  return (
    <section className="px-4 py-12 md:px-8 lg:px-16 bg-white font-sans">
      <div className="mx-auto max-w-9xl">
        
        {/* Header Section with Title, Filters, and Action link */}
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <h2 className="text-[24px] font-black text-[#22252a] tracking-tight">
            Our Trusted Partner Banks & NBFCs
          </h2>
          
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`h-10 rounded-xl border px-6 text-[13px] font-bold transition-all ${
                  index === 0
                    ? "border-[#0fae5e] bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-white shadow-sm"
                    : "border-[#b3c5d4] bg-white text-[#4a525d] hover:border-[#0fae5e] hover:text-[#0fae5e]"
                }`}
              >
                {tab}
              </button>
            ))}
            
            <a 
              href="/partners" 
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0fae5e] hover:underline ml-2 whitespace-nowrap"
            >
              View all Partners <span className="text-[14px]">→</span>
            </a>
          </div>
        </div>

        {/* 2 Rows x 6 Columns Layout Engine */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bankLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex h-20 items-center justify-center rounded-xl border border-[#e3ebf3] bg-white p-4 shadow-[0_4px_16px_rgba(22,34,50,0.03)] hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative w-full h-full max-w-32.5">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="(min-width: 1024px) 128px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
