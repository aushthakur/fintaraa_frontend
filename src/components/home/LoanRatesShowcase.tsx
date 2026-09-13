"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const loanTypes = [
  { id: "home", label: "Home Loan" },
  { id: "personal", label: "Personal Loan" },
  { id: "car", label: "Car Loan" },
  { id: "education", label: "Education Loan" },
  { id: "gold", label: "Gold Loan" },
  { id: "business", label: "Business Loan" },
  { id: "lap", label: "Loan Against Property" },
  { id: "vehicle", label: "Vehicle Loan" },
];

const bankData: Record<string, { name: string; logo: string; min: string; max: string; slug: string }[]> = {
  home: [
    { name: "Punjab National Bank", logo: "/assets/banks/Punjab-National-Bank.png", min: "7.10", max: "10.50", slug: "pnb" },
    { name: "Union Bank of India", logo: "/assets/banks/union-bank.png", min: "7.10", max: "10.50", slug: "union-bank" },
    { name: "Indian Bank", logo: "/assets/banks/indian-bank.png", min: "7.10", max: "10.50", slug: "indian-bank" },
    { name: "Federal Bank", logo: "/assets/banks/Federal-Bank.png", min: "7.10", max: "10.50", slug: "federal-bank" },
    { name: "UCO Bank", logo: "/assets/banks/UCO-Bank.png", min: "7.10", max: "10.50", slug: "uco-bank" },
    { name: "South Indian Bank", logo: "/assets/banks/south-indian-bank.png", min: "7.10", max: "10.50", slug: "south-indian-bank" },
    { name: "Yes Bank", logo: "/assets/banks/yes-bank.png", min: "7.10", max: "10.50", slug: "yes-bank" },
    { name: "Canara Bank", logo: "/assets/banks/canara-bank.png", min: "7.10", max: "10.50", slug: "canara-bank" },
    { name: "Bank of India", logo: "/assets/banks/bank-of-india.png", min: "7.10", max: "10.50", slug: "bank-of-india" },
    { name: "Central Bank of India", logo: "/assets/banks/Central-Bank-of-India.png", min: "7.10", max: "10.50", slug: "central-bank" },
    { name: "Bandhan Bank", logo: "/assets/banks/Bandhan-Bank.png", min: "7.10", max: "10.50", slug: "bandhan-bank" },
    { name: "Punjab & Sind Bank", logo: "/assets/banks/Punjab-&-Sind-Bank.png", min: "7.10", max: "10.50", slug: "punjab-sind-bank" },
    { name: "IDBI Bank", logo: "/assets/banks/IDBI-Bank.png", min: "7.10", max: "10.50", slug: "idbi-bank" },
    { name: "IndusInd Bank", logo: "/assets/banks/IndusInd-Bank.png", min: "7.10", max: "10.50", slug: "indusind-bank" },
    { name: "Bajaj Finserv", logo: "/assets/banks/bajaj-finserv.png", min: "7.10", max: "10.50", slug: "bajaj-finserv" },
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "7.15", max: "11.00", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "7.20", max: "11.50", slug: "icici-bank" },
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "7.10", max: "10.75", slug: "sbi" },
  ],
  personal: [
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "10.50", max: "21.00", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "10.75", max: "19.00", slug: "icici-bank" },
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "11.00", max: "15.00", slug: "sbi" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "10.49", max: "22.00", slug: "axis-bank" },
    { name: "Kotak Bank", logo: "/assets/banks/Kotak-Mahindra-Bank.png", min: "10.99", max: "24.00", slug: "kotak-bank" },
    { name: "IndusInd Bank", logo: "/assets/banks/IndusInd-Bank.png", min: "10.49", max: "26.00", slug: "indusind-bank" },
    { name: "Bajaj Finserv", logo: "/assets/banks/bajaj-finserv.png", min: "11.00", max: "35.00", slug: "bajaj-finserv" },
    { name: "Federal Bank", logo: "/assets/banks/Federal-Bank.png", min: "11.49", max: "17.99", slug: "federal-bank" },
    { name: "Punjab National Bank", logo: "/assets/banks/Punjab-National-Bank.png", min: "11.75", max: "16.50", slug: "pnb" },
    { name: "IDFC First", logo: "/assets/banks/idfc.png", min: "10.49", max: "23.00", slug: "idfc-first" },
  ],
  car: [
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "8.75", max: "12.45", slug: "sbi" },
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "8.80", max: "13.00", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "9.00", max: "13.50", slug: "icici-bank" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "8.70", max: "13.00", slug: "axis-bank" },
    { name: "Kotak Bank", logo: "/assets/banks/Kotak-Mahindra-Bank.png", min: "8.75", max: "14.00", slug: "kotak-bank" },
    { name: "Bank of Baroda", logo: "/assets/banks/Bank-of-Baroda.png", min: "8.70", max: "11.90", slug: "bank-of-baroda" },
    { name: "Union Bank of India", logo: "/assets/banks/union-bank.png", min: "8.70", max: "11.50", slug: "union-bank" },
    { name: "Canara Bank", logo: "/assets/banks/canara-bank.png", min: "8.70", max: "11.55", slug: "canara-bank" },
  ],
  education: [
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "8.15", max: "11.15", slug: "sbi" },
    { name: "Bank of Baroda", logo: "/assets/banks/Bank-of-Baroda.png", min: "8.15", max: "11.00", slug: "bank-of-baroda" },
    { name: "Punjab National Bank", logo: "/assets/banks/Punjab-National-Bank.png", min: "8.15", max: "11.00", slug: "pnb" },
    { name: "Canara Bank", logo: "/assets/banks/canara-bank.png", min: "8.40", max: "11.25", slug: "canara-bank" },
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "9.50", max: "14.00", slug: "hdfc-bank" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "13.70", max: "15.20", slug: "axis-bank" },
  ],
  gold: [
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "7.50", max: "9.00", slug: "sbi" },
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "8.75", max: "17.73", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "10.00", max: "16.50", slug: "icici-bank" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "17.00", max: "17.00", slug: "axis-bank" },
    { name: "Federal Bank", logo: "/assets/banks/Federal-Bank.png", min: "8.50", max: "11.50", slug: "federal-bank" },
    { name: "Bandhan Bank", logo: "/assets/banks/Bandhan-Bank.png", min: "9.00", max: "12.00", slug: "bandhan-bank" },
  ],
  business: [
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "10.75", max: "22.50", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "10.85", max: "19.00", slug: "icici-bank" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "11.00", max: "20.00", slug: "axis-bank" },
    { name: "Kotak Bank", logo: "/assets/banks/Kotak-Mahindra-Bank.png", min: "14.00", max: "26.00", slug: "kotak-bank" },
    { name: "Bajaj Finserv", logo: "/assets/banks/bajaj-finserv.png", min: "9.75", max: "30.00", slug: "bajaj-finserv" },
    { name: "IndusInd Bank", logo: "/assets/banks/IndusInd-Bank.png", min: "10.49", max: "22.00", slug: "indusind-bank" },
    { name: "IDFC First", logo: "/assets/banks/idfc.png", min: "10.50", max: "24.00", slug: "idfc-first" },
  ],
  lap: [
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "9.50", max: "11.00", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "9.85", max: "12.00", slug: "icici-bank" },
    { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", min: "9.90", max: "12.50", slug: "axis-bank" },
    { name: "Kotak Bank", logo: "/assets/banks/Kotak-Mahindra-Bank.png", min: "9.15", max: "13.00", slug: "kotak-bank" },
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "9.15", max: "11.30", slug: "sbi" },
    { name: "Punjab National Bank", logo: "/assets/banks/Punjab-National-Bank.png", min: "9.25", max: "11.75", slug: "pnb" },
    { name: "Bank of Baroda", logo: "/assets/banks/Bank-of-Baroda.png", min: "9.15", max: "11.00", slug: "bank-of-baroda" },
  ],
  vehicle: [
    { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", min: "8.75", max: "12.45", slug: "sbi" },
    { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", min: "8.80", max: "13.00", slug: "hdfc-bank" },
    { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", min: "9.00", max: "13.50", slug: "icici-bank" },
    { name: "Union Bank of India", logo: "/assets/banks/union-bank.png", min: "8.70", max: "11.50", slug: "union-bank" },
    { name: "Canara Bank", logo: "/assets/banks/canara-bank.png", min: "8.70", max: "11.55", slug: "canara-bank" },
    { name: "Bank of Baroda", logo: "/assets/banks/Bank-of-Baroda.png", min: "8.70", max: "11.90", slug: "bank-of-baroda" },
  ],
};

const headlineRates: Record<string, string> = {
  home: "7.10", personal: "10.49", car: "8.70", education: "8.15",
  gold: "7.50", business: "9.75", lap: "9.15", vehicle: "8.70",
};

export function LoanRatesShowcase() {
  const [activeTab, setActiveTab] = useState("home");
  const [search, setSearch] = useState("");

  const banks = useMemo(() => {
    const list = bankData[activeTab] ?? [];
    if (!search.trim()) return list;
    return list.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search]);

  const activeLoan = loanTypes.find((l) => l.id === activeTab);

  return (
    <section className="bg-white py-12 sm:py-16" aria-label="Loan rates from partner banks">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="text-[24px] sm:text-[32px] font-semibold text-gray-900 tracking-tight">
            {activeLoan?.label ?? "Home Loans"} from{" "}
            <span style={{ color: "#6424C7" }}>{headlineRates[activeTab]}%*</span>{" "}
            Only with{" "}
            <span style={{ color: "#6424C7" }}>Fintaraa</span>
          </h2>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <p className="text-[13px] text-gray-500 font-medium">Lowest Interest Rates*</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeLoan?.label.toLowerCase() ?? "loan"} offers or banks…`}
                className="w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-[12.5px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#6424C7] focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
            <Link
              href={`/products/${activeTab}-loan`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-medium text-white transition-all hover:shadow-md hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #6424C7, #9b5de5)" }}
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Loan type tabs */}
        <div className="flex overflow-x-auto pb-1 scrollbar-none mb-6 border-b border-gray-100">
          <div className="flex flex-nowrap gap-0">
            {loanTypes.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                className="shrink-0 px-4 py-2.5 text-[12.5px] font-medium border-b-2 transition-all duration-200 whitespace-nowrap"
                style={{
                  borderBottomColor: activeTab === tab.id ? "#6424C7" : "transparent",
                  color: activeTab === tab.id ? "#6424C7" : "#6b7280",
                  background: "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bank cards grid */}
        {banks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5.5">
            {banks.map((bank) => (
              <Link
                key={bank.slug}
                href={`/lenders/${bank.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-5.5 transition-all duration-300 hover:border-[#6424C7]/40 hover:shadow-[0_14px_35px_-10px_rgba(100,36,199,0.18)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Big Bank Logo */}
                  <div className="relative h-14 sm:h-18 lg:h-20 w-full mb-2.5 sm:mb-3.5 flex items-center justify-center">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 160px, 240px"
                    />
                  </div>

                  {/* Bank Name */}
                  <h3 className="text-center text-[12px] sm:text-[13.5px] lg:text-[14px] font-semibold text-gray-800 mb-2.5 sm:mb-3.5 leading-snug line-clamp-1 group-hover:text-[#6424C7] transition-colors">
                    {bank.name}
                  </h3>

                  {/* Rate row */}
                  <div className="w-full rounded-xl bg-gray-50/90 border border-gray-100/90 py-2 px-1.5 sm:py-2.5 sm:px-3 flex items-center justify-around mb-3 sm:mb-4">
                    <div className="text-center flex-1">
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Min</p>
                      <p className="text-[13.5px] sm:text-[16px] lg:text-[17px] font-bold text-gray-900 leading-none">
                        {bank.min}<span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">%</span>
                      </p>
                    </div>
                    <div className="h-6 sm:h-7 w-px bg-gray-200" />
                    <div className="text-center flex-1">
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Max</p>
                      <p className="text-[13.5px] sm:text-[16px] lg:text-[17px] font-bold text-gray-900 leading-none">
                        {bank.max}<span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">%</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Apply button */}
                <span
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-[#6424C7] py-2 sm:py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#6424C7] transition-all duration-200 group-hover:bg-[#6424C7] group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(100,36,199,0.25)]"
                >
                  Apply Now <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[13px] text-gray-400">
            No banks found for &quot;{search}&quot;.
          </div>
        )}

        {/* Rate disclaimer */}
        <p className="mt-6 text-[10.5px] text-gray-400 text-center">
          * Interest rates are indicative and subject to change. Final rates depend on credit profile, lender policies &amp; applicable charges.
        </p>
      </div>
    </section>
  );
}
