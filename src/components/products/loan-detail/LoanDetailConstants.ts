import {
  Banknote,
  BadgeIndianRupee,
  ShieldCheck,
  FileCheck2,
  WalletCards,
  CircleCheck,
} from "lucide-react";

export const loanStats = [
  ["24-Hours", "Processing Time"],
  ["50+", "Bank & NBFC Partners"],
  ["100%", "Digital Assistance"],
  ["Up to ₹1 Crore", "Maximum Loan Amount"],
];

export const bankRows = [
  {
    name: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    rate: "10.75% p.a.",
    fee: "Up to 2%",
    amount: "Up to ₹1 Cr",
    tenure: "7 Years",
    rating: "4.5",
  },
  {
    name: "ICICI Bank",
    logo: "/assets/banks/icici.png",
    rate: "10.99% p.a.",
    fee: "Up to 2.5%",
    amount: "Up to ₹1 Cr",
    tenure: "7 Years",
    rating: "4.5",
  },
  {
    name: "PNB",
    logo: "/assets/banks/pnb.png",
    rate: "11.25% p.a.",
    fee: "Up to 1%",
    amount: "₹50 Lac",
    tenure: "5 Years",
    rating: "4.3",
  },
  {
    name: "SBI",
    logo: "/assets/banks/sbi.png",
    rate: "11.45% p.a.",
    fee: "Up to 1.5%",
    amount: "₹50 Lac",
    tenure: "7 Years",
    rating: "4.4",
  },
  {
    name: "Kotak",
    logo: "/assets/banks/kotak.png",
    rate: "11.99% p.a.",
    fee: "Up to 2%",
    amount: "Up to ₹1 Cr",
    tenure: "7 Years",
    rating: "4.2",
  },
];

export const verificationSteps = [
  ["Step 01", "Tell Us Your Requirement"],
  ["Step 02", "Verify Mobile Number"],
  ["Step 03", "Complete KYC Details"],
  ["Step 04", "Get Partner Assistance"],
];

export const fieldClass =
  "h-12 w-full rounded-xl border border-[#d6dce5] bg-white px-4 text-[14px] font-semibold text-[#1f2937] outline-none placeholder:text-[#98a2b3] focus:border-[#0b64a8] focus:ring-4 focus:ring-[#0b64a8]/10";

export const iconPool = [
  BadgeIndianRupee,
  ShieldCheck,
  FileCheck2,
  Banknote,
  WalletCards,
  CircleCheck,
];

export const defaultFaqs = [
  "How long does it take for the loan to be disbursed?",
  "Is there a penalty for prepaying the loan?",
  "Can I apply for a second loan while the first is active?",
  "What is the minimum and maximum loan amount?",
  "Do I need to provide any collateral or security?",
  "Will checking my eligibility affect my CIBIL score?",
  "Can I change my EMI date after the loan is disbursed?",
  "What happens if I miss an EMI payment?",
];
