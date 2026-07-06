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

export const dsaOfferings = [
  {
    title: "Personal Loans",
    text: "Refer salaried and self-employed customers for quick loan matching.",
    icon: Banknote,
  },
  {
    title: "Business Loans",
    text: "Support MSMEs and business owners with working capital options.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Home Loans",
    text: "Assist customers with home purchase, balance transfer, and top-up needs.",
    icon: Home,
  },
  {
    title: "Loan Against Property",
    text: "Connect high-ticket secured loan customers with partner lenders.",
    icon: Landmark,
  },
  {
    title: "Credit Cards",
    text: "Offer cards across rewards, cashback, shopping, travel, and fuel use cases.",
    icon: CreditCard,
  },
  {
    title: "Insurance",
    text: "Refer protection products for health, life, travel, and business cover.",
    icon: ShieldCheck,
  },
];

export const whyChooseItems = [
  {
    title: "Transparent Process",
    text: "Every lead moves through clear stages, status updates, and documented next steps.",
    icon: FileSignature,
  },
  {
    title: "Compliance-first Support",
    text: "Customer consent, documents, and partner checks are handled with structured controls.",
    icon: ShieldCheck,
  },
  {
    title: "Dedicated Partner Desk",
    text: "Get help with product fitment, lender coordination, and payout queries.",
    icon: Headphones,
  },
  {
    title: "Simple Partner Onboarding",
    text: "Training, product guidance, and referral workflows are designed for quick adoption.",
    icon: BadgeCheck,
  },
  {
    title: "Professional Documentation",
    text: "Use organized request records and support notes for cleaner customer handling.",
    icon: Scale,
  },
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

export const dsaTestimonials = [
  {
    name: "Rohit Sharma",
    role: "Loan Consultant",
    location: "Jaipur",
    rating: 5,
    metric: "32 leads submitted",
    text: "Fintaraa helped me move from manual follow-ups to a clear partner flow. I can track every customer request and the team responds quickly when documents are pending.",
  },
  {
    name: "Neha Agarwal",
    role: "Insurance Advisor",
    location: "Indore",
    rating: 5,
    metric: "18 approvals assisted",
    text: "The training and product support made it easier to pitch loans and cards to my existing clients. Status visibility is the biggest advantage for my daily work.",
  },
  {
    name: "Amit Verma",
    role: "Financial Distributor",
    location: "Delhi NCR",
    rating: 4,
    metric: "Monthly payout cycle",
    text: "I joined for loan referrals, but the dashboard and bank coordination helped me expand into credit cards too. The process is transparent from lead to payout.",
  },
];
