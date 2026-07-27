import type { LucideIcon } from "lucide-react";
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Building2,
  Car,
  Factory,
  GraduationCap,
  Home,
  Landmark,
  Tractor,
} from "lucide-react";

export type LoanProductDirectoryItem = {
  name: string;
  slug: string;
  minRate: number;
  maxRate: number;
  amount: string;
  icon: LucideIcon;
};

export type BankDirectoryItem = {
  name: string;
  slug: string;
  logo: string;
  minRate: number;
  maxRate: number;
  products: string[];
};

export const loanProductDirectory: LoanProductDirectoryItem[] = [
  { name: "Personal Loan", slug: "personal-loan", minRate: 10.5, maxRate: 24, amount: "Rs. 50,000 - Rs. 40 lakh", icon: BadgeIndianRupee },
  { name: "Education Loan", slug: "education-loan", minRate: 8.15, maxRate: 14, amount: "Course-cost based", icon: GraduationCap },
  { name: "Vehicle Loan", slug: "vehicle-loan", minRate: 8.75, maxRate: 13.5, amount: "Vehicle-value based", icon: Car },
  { name: "Gold Loan", slug: "gold-loan", minRate: 8.75, maxRate: 16, amount: "Gold-value based", icon: BadgeIndianRupee },
  { name: "Loan Against Car", slug: "loan-against-car", minRate: 11.5, maxRate: 20, amount: "Car-value based", icon: Car },
  { name: "Car Loan", slug: "car-loan", minRate: 8.9, maxRate: 13, amount: "On-road price based", icon: Car },
  { name: "Loan Against Car Value", slug: "loan-against-car-value", minRate: 11.25, maxRate: 19.5, amount: "Car-valuation based", icon: Car },
  { name: "Instant Loan", slug: "instant-loan", minRate: 11.99, maxRate: 30, amount: "Profile based", icon: BadgeIndianRupee },
  { name: "Loan Against Property", slug: "loan-against-property", minRate: 9.25, maxRate: 15, amount: "Property-value based", icon: Building2 },
  { name: "Renovation Loan", slug: "renovation-loan", minRate: 10.75, maxRate: 22, amount: "Project-estimate based", icon: Home },
  { name: "Working Capital Loan", slug: "working-capital-loan", minRate: 12, maxRate: 24, amount: "Turnover based", icon: BriefcaseBusiness },
  { name: "Loan Against Security", slug: "loan-against-security", minRate: 9.5, maxRate: 16, amount: "Security-value based", icon: Landmark },
  { name: "Machinery Loan", slug: "machinery-loan", minRate: 10.5, maxRate: 18, amount: "Invoice based", icon: Factory },
  { name: "Home Loan", slug: "home-loan", minRate: 7.1, maxRate: 10.5, amount: "Property and income based", icon: Home },
  { name: "Business Loan", slug: "business-loan", minRate: 11.25, maxRate: 24, amount: "Rs. 1 lakh - Rs. 1 crore", icon: BriefcaseBusiness },
  { name: "DOD Loan", slug: "dod-loan", minRate: 11, maxRate: 19, amount: "Limit assessment based", icon: Landmark },
  { name: "OD Loan", slug: "od-loan", minRate: 10.75, maxRate: 18.5, amount: "Limit assessment based", icon: Landmark },
  { name: "Industrial Loan", slug: "industrial-loan", minRate: 10.5, maxRate: 18, amount: "Project based", icon: Factory },
  { name: "Commercial Purchases Loan", slug: "commercial-purchases-loan", minRate: 10.75, maxRate: 18.5, amount: "Asset based", icon: Building2 },
  { name: "Balance Transfer Loan", slug: "balance-transfer-loan", minRate: 8.5, maxRate: 14, amount: "Outstanding-loan based", icon: Landmark },
  { name: "Top Up Loan", slug: "top-up-loan", minRate: 9.5, maxRate: 16, amount: "Existing-loan based", icon: BadgeIndianRupee },
  { name: "Two Wheeler Loan", slug: "two-wheeler-loan", minRate: 9.5, maxRate: 18, amount: "Vehicle-value based", icon: Car },
  { name: "Used Car Loan", slug: "used-car-loan", minRate: 10.25, maxRate: 16, amount: "Used-car valuation based", icon: Car },
  { name: "Agriculture Loan", slug: "agriculture-loan", minRate: 8.5, maxRate: 15, amount: "Farm profile based", icon: Tractor },
];

export const bankDirectory: BankDirectoryItem[] = [
  {
    name: "SBI Card",
    slug: "sbi-card",
    logo: "/assets/banks/sbi-logo.png",
    minRate: 7.1,
    maxRate: 24,
    products: ["Home Loan", "Personal Loan", "Education Loan", "Gold Loan", "Credit Cards"],
  },
  {
    name: "HDFC Bank",
    slug: "hdfc-bank",
    logo: "/assets/banks/hdfc.png",
    minRate: 7.1,
    maxRate: 24,
    products: ["Home Loan", "Personal Loan", "Business Loan", "Credit Cards", "LAP"],
  },
  {
    name: "ICICI Bank",
    slug: "icici-bank",
    logo: "/assets/banks/icici.png",
    minRate: 7.25,
    maxRate: 24.5,
    products: ["Home Loan", "Personal Loan", "Car Loan", "Credit Cards", "Business Loan"],
  },
  {
    name: "Axis Bank",
    slug: "axis-bank",
    logo: "/assets/banks/axis-bank.png",
    minRate: 7.45,
    maxRate: 25,
    products: ["Personal Loan", "Car Loan", "Credit Cards", "Business Loan", "Home Loan"],
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak-mahindra-bank",
    logo: "/assets/banks/kotak.png",
    minRate: 7.35,
    maxRate: 24.75,
    products: ["Personal Loan", "Home Loan", "Credit Cards", "Business Loan", "Gold Loan"],
  },
  {
    name: "IndusInd Bank",
    slug: "indusind-bank",
    logo: "/assets/banks/indusind.png",
    minRate: 7.55,
    maxRate: 25.25,
    products: ["Personal Loan", "Credit Cards", "Vehicle Loan", "Business Loan", "LAP"],
  },
  {
    name: "IDFC FIRST Bank",
    slug: "idfc-first-bank",
    logo: "/assets/banks/idfc.png",
    minRate: 7.3,
    maxRate: 24.25,
    products: ["Personal Loan", "Credit Cards", "Home Loan", "Business Loan", "Vehicle Loan"],
  },
];

export const formatRate = (value: number) => `${value.toFixed(2)}%`;
