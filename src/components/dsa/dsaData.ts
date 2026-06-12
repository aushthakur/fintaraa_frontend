import {
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  Building2,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  ClipboardCheck,
  CreditCard,
  FileSignature,
  Handshake,
  Headphones,
  Landmark,
  Megaphone,
  Scale,
  ShieldCheck,
  UserCheck,
  WalletCards,
} from "lucide-react";

export const dsaStats = [
  { value: "95", label: "Banks & NBFCs", icon: ShieldCheck },
  { value: "6,800K", label: "Active Partner", icon: ShieldCheck },
  { value: "₹150 Cr", label: "Loans Disbursed", icon: ShieldCheck },
  { value: "24/7", label: "Partner Support", icon: ShieldCheck },
];

export const dsaSteps = [
  {
    title: "Register as Partner",
    text: "Fill the application form and our team will get in touch with you.",
  },
  {
    title: "Get Training & Access",
    text: "Complete training and get access to our partner portal and tools.",
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
    text: "Loan up to ₹10 Cr interest from 10.50% p.a.",
    icon: Banknote,
  },
  {
    title: "High Commissions",
    text: "Earn some of the highest payouts in the industry.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Training Program",
    text: "Free product & sales training to help you succeed.",
    icon: ClipboardCheck,
  },
  {
    title: "Dedicated Support",
    text: "Personal relationship manager for all your queries.",
    icon: Headphones,
  },
  {
    title: "Faster Payouts",
    text: "Loan up to ₹10 Cr interest from 8.40% p.a.",
    icon: WalletCards,
  },
  {
    title: "Marketing Material",
    text: "Loan up to ₹1 Cr interest from 11.25% p.a.",
    icon: Megaphone,
  },
  {
    title: "Single Dashboard",
    text: "Lifetime free cards exclusive rewards.",
    icon: Building2,
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
  ["Credit Card", "Up to 0%"],
  ["Insurance", "Up to 4%"],
];

export const eligibleProfiles = [
  { title: "Loan Agents", icon: ShieldCheck },
  { title: "Insurance advisors", icon: ShieldCheck },
  { title: "CA/ Tax Consultants", icon: ShieldCheck },
  { title: "Property Dealer", icon: ShieldCheck },
  { title: "Freelancers", icon: ShieldCheck },
  { title: "Financial Consultants", icon: ShieldCheck },
  { title: "Entrepreneur", icon: ShieldCheck },
  { title: "Existing DSAs", icon: ShieldCheck },
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
  { title: "Expert Legal Expert", icon: Scale },
  { title: "Transparent Process", icon: FileSignature },
  { title: "100% Compliances Assured", icon: ShieldCheck },
  { title: "End to End Support", icon: Headphones },
  { title: "Affordable Pricing", icon: BadgeCheck },
  { title: "Expert Legal Expert", icon: Scale },
  { title: "Transparent Process", icon: FileSignature },
  { title: "100% Compliances Assured", icon: ShieldCheck },
  { title: "End to End Support", icon: Headphones },
  { title: "Affordable Pricing", icon: BadgeCheck },
];

export const dsaFaqs = [
  "How do I become a Fintaraa DSA partner?",
  "Is there a penalty or joining lock-in?",
  "Can I submit leads for more than one product?",
  "What is the minimum and maximum commission amount?",
  "Do I need to provide any collateral or security?",
  "Will Fintaraa provide training and support?",
  "Can I track every customer application?",
  "When will I receive my payout?",
];

export const journeyItems = [
  { title: "Register", icon: UserCheck },
  { title: "Training", icon: ClipboardCheck },
  { title: "Submit Leads", icon: CreditCard },
  { title: "Bank Review", icon: Landmark },
  { title: "Approval", icon: CircleCheck },
  { title: "Commission", icon: Handshake },
];
