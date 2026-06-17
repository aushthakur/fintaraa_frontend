import {
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  ClipboardCheck,
  CreditCard,
  FileSignature,
  Handshake,
  Headphones,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Scale,
  ShieldCheck,
  User,
  UserCheck,
  WalletCards,
  Coins,
  FileText,
  Home,
} from "lucide-react";

export const dsaStats = [
  { value: "95", label: "Banks & NBFCs", icon: ShieldCheck },
  { value: "6.80K", label: "Active Partner", icon: ShieldCheck },
  { value: "\u20b9150 Cr", label: "Loans Disbursed", icon: ShieldCheck },
  { value: "24/7", label: "Partner Support", icon: ShieldCheck },
];

export const dsaSteps = [
  {
    title: "Register as Partner",
    text: "Fill the registration form and our team will get in touch with you.",
  },
  {
    title: "Get Training & Access",
    text: "Complete training and get access to the partner portal and tools.",
  },
  {
    title: "Submit Customer Leads",
    text: "Share customer details for loans, cards or insurance products.",
  },
  {
    title: "Earn Commission",
    text: "Get paid attractive commission on every successful approval.",
  },
];

export const dsaBenefits = [
  {
    title: "30+ Bank Tie-ups",
    text: "Loan up to \u20b940 Lakh. Interest from 10.50% p.a.",
    icon: Banknote,
  },
  {
    title: "High Commissions",
    text: "Earn some of the highest payouts in the industry.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Training Program",
    text: "Free product and sales training to help you succeed.",
    icon: ClipboardCheck,
  },
  {
    title: "Dedicated Support",
    text: "Personal relationship manager for all your queries.",
    icon: Headphones,
  },
  {
    title: "Faster Payouts",
    text: "Loan up to \u20b910 Cr. Interest from 8.40% p.a.",
    icon: WalletCards,
  },
  {
    title: "Marketing Material",
    text: "Loan up to \u20b91 Cr. Interest from 11.25% p.a.",
    icon: Megaphone,
  },
  {
    title: "Single Dashboard",
    text: "Lifetime free cards and exclusive rewards.",
    icon: LayoutDashboard,
  },
  {
    title: "Real-time Tracking",
    text: "Track every application status in real time.",
    icon: ChartNoAxesColumnIncreasing,
  },
];

export const commissionRows = [
  ["Personal Loan", "Up to 2%"],
  ["Home Loan", "Up to 3%"],
  ["Business Loan", "Up to 1%"],
  ["Credit Card", "Up to 9%"],
  ["Insurance", "Up to 4%"],
];

export const eligibleProfiles = [
  { title: "Loan Agents", icon: Landmark },
  { title: "Insurance advisors", icon: ShieldCheck },
  { title: "CA/ Tax Consultants", icon: FileText },
  { title: "Property Dealer", icon: Home },
  { title: "Freelancers", icon: User },
  { title: "Financial Consultants", icon: Coins },
  { title: "Entrepreneur", icon: Lightbulb },
  { title: "Existing DSAs", icon: Handshake },
];

export const formFields = [
  ["Full Name", "Enter Name", "text"],
  ["Mobile Number", "Enter Mobile Number", "tel"],
  ["Email Address", "Enter Email Address", "email"],
  ["City", "Select City", "select"],
  ["Profession", "Select Your Profession", "select"],
  ["Business Type", "Select Business Type", "select"],
];

export const partnerBenefits = [
  "30+ Bank & NBFC Partnerships",
  "Attractive & Timely Commissions",
  "End-to-end Training & Support",
  "Advanced Partner Dashboard",
];

export const whyChooseItems = [
  { title: "Expert Legal Support", icon: Scale },
  { title: "Transparent Process", icon: FileSignature },
  { title: "100% Compliances Assured", icon: ShieldCheck },
  { title: "End to End Support", icon: Headphones },
  { title: "Affordable Pricing", icon: BadgeCheck },
  { title: "Expert Legal Support", icon: Scale },
  { title: "Transparent Process", icon: FileSignature },
  { title: "100% Compliances Assured", icon: ShieldCheck },
  { title: "End to End Support", icon: Headphones },
  { title: "Affordable Pricing", icon: BadgeCheck },
];

export const dsaFaqs = [
  "How long does it take for the loan to be disbursed?",
  "Is there a penalty for prepaying the loan?",
  "Can I apply for a second loan while the first is active?",
  "What is the minimum and maximum loan amount?",
  "Do I need to provide any collateral or security?",
  "Will checking my eligibility affect my CIBIL score?",
  "Can I change my EMI date after the loan is disbursed?",
  "What happens if I miss an EMI payment?",
];

export const journeyItems = [
  { title: "Register", icon: UserCheck },
  { title: "Training", icon: ClipboardCheck },
  { title: "Submit Leads", icon: CreditCard },
  { title: "Bank Review", icon: Landmark },
  { title: "Approval", icon: CircleCheck },
  { title: "Commission", icon: Handshake },
];
