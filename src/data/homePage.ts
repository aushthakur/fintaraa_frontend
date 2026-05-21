import {
  Calculator,
  BadgePercent,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Car,
  Fuel,
  Coins,
  Crown,
  ChartPie,
  HandCoins,
  FileCheck2,
  HeartPulse,
  GraduationCap,
  Home,
  Plane,
  QrCode,
  Repeat2,
  Smartphone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  PackageCheck,
  Store,
  Umbrella,
  WalletCards,
} from "lucide-react";

export const heroStats = [
  { value: "50+", label: "Bank and NBFC partners" },
  { value: "24h", label: "Fast assisted processing" },
  { value: "30%", label: "Average EMI saving" },
  { value: "24/7", label: "Digital support" },
];

export const productSections = [
  {
    title: "Explore Loan Options",
    subtitle:
      "Choose from a wide range of loan solutions tailored to your needs.",
    cta: "View All Loans",
    products: [
      {
        title: "Personal Loan",
        text: "Quick funds for your everyday needs.",
        icon: BadgeIndianRupee,
        tone: "pink",
      },
      {
        title: "Home Loan",
        text: "Finance your dream home with easy EMIs.",
        icon: Home,
        tone: "orange",
      },
      {
        title: "Business Loan",
        text: "Quick funds for your business needs.",
        icon: BriefcaseBusiness,
        tone: "amber",
      },
      {
        title: "Vehicle Loan",
        text: "Quick funds for your everyday needs.",
        icon: Car,
        tone: "red",
      },
      {
        title: "Instant Loan",
        text: "Quick funds for your everyday needs.",
        icon: HandCoins,
        tone: "yellow",
      },
      {
        title: "Education Loan",
        text: "Quick funds for your everyday needs.",
        icon: GraduationCap,
        tone: "green",
      },
      {
        title: "Gold Loan",
        text: "Quick funds for your everyday needs.",
        icon: Coins,
        tone: "gold",
      },
    ],
  },
  {
    title: "Explore Insurance Plans",
    subtitle:
      "Secure what matters most with our wide range of insurance plans.",
    cta: "View All Insurance",
    products: [
      {
        title: "Health Insurance",
        text: "Cover medical expenses and emergencies.",
        icon: HeartPulse,
        tone: "rose",
      },
      {
        title: "Life Insurance",
        text: "Financial protection for your family’s future.",
        icon: Umbrella,
        tone: "brown",
      },
      {
        title: "Shop Insurance",
        text: "Protect your shop from unexpected risks & losses.",
        icon: Store,
        tone: "olive",
      },
      {
        title: "Stock Insurance",
        text: "Quick funds for your everyday needs.",
        icon: PackageCheck,
        tone: "pink",
      },
      {
        title: "Term Insurance",
        text: "Quick funds for your everyday needs.",
        icon: ShieldCheck,
        tone: "sky",
      },
      {
        title: "Travel Insurance",
        text: "Quick funds for your everyday needs.",
        icon: Plane,
        tone: "violet",
      },
      {
        title: "Property Insurance",
        text: "Secure your home or property against risks & loss.",
        icon: Home,
        tone: "red",
      },
    ],
  },
  {
    title: "Explore Credit Card Options",
    subtitle:
      "Pick cards for travel, fuel, shopping, cashback, and premium rewards.",
    cta: "View All Cards",
    products: [
      {
        title: "Travel Cards",
        text: "Miles, lounge access, and trip benefits.",
        icon: Plane,
        tone: "orange",
      },
      {
        title: "Fuel Cards",
        text: "Save more on fuel spends and surcharges.",
        icon: Fuel,
        tone: "blue",
      },
      {
        title: "Cashback Cards",
        text: "Earn value back on everyday purchases.",
        icon: WalletCards,
        tone: "green",
      },
      {
        title: "Shopping Cards",
        text: "Rewards and offers for online shopping.",
        icon: ShoppingBag,
        tone: "yellow",
      },
      {
        title: "Premium Cards",
        text: "Lifestyle privileges and curated benefits.",
        icon: Crown,
        tone: "violet",
      },
      {
        title: "Rewards Cards",
        text: "Earn points and benefits on regular spends.",
        icon: BadgePercent,
        tone: "rose",
      },
      {
        title: "Balance Transfer",
        text: "Shift card dues into easier repayment options.",
        icon: Repeat2,
        tone: "sky",
      },
    ],
  },
  {
    title: "Explore Additional Services",
    subtitle:
      "Useful financial tools and services for a smoother money journey.",
    cta: "View All Services",
    products: [
      {
        title: "Credit Score",
        text: "Check your score and understand key factors.",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "ITR Filing",
        text: "Get organised help for income tax filing.",
        icon: ReceiptText,
        tone: "green",
      },
      {
        title: "Balance Transfer",
        text: "Move eligible balances to better terms.",
        icon: Repeat2,
        tone: "blue",
      },
      {
        title: "Digital Payments",
        text: "Manage payments with secure digital options.",
        icon: QrCode,
        tone: "red",
      },
      {
        title: "Financial Planning",
        text: "Plan goals, budgets, and credit decisions.",
        icon: ChartPie,
        tone: "violet",
      },
      {
        title: "Document Help",
        text: "Organise KYC, income, and bank documents.",
        icon: FileCheck2,
        tone: "yellow",
      },
      {
        title: "Mobile App Support",
        text: "Get help managing your Fintaraa app account.",
        icon: Smartphone,
        tone: "sky",
      },
    ],
  },
];

export const partners = [
  "SBI",
  "ICICI Bank",
  "Kotak",
  "HDFC Bank",
  "Axis Bank",
  "IndusInd Bank",
  "IDFC First",
  "Bajaj Finserv",
  "Yes Bank",
  "AU Small Finance",
];

export const reasons = [
  "Personalized loan matching",
  "Transparent EMI comparison",
  "Eligibility in 30 seconds",
  "Partner-backed fulfilment",
  "Secure document handling",
  "Dedicated expert support",
];

export const steps = [
  {
    label: "Step - 01",
    title: "Fill Basic Details",
    text: "Share your requirement, income range, and location.",
  },
  {
    label: "Step - 02",
    title: "Check Offers",
    text: "Compare eligible partner offers with clear EMI details.",
  },
  {
    label: "Step - 03",
    title: "Get Support",
    text: "Complete documents and move your application forward.",
  },
];

export const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Business Owner",
    text: "The comparison was simple and the team helped me understand the right working-capital option.",
  },
  {
    name: "Neha Verma",
    role: "Salaried Professional",
    text: "I checked eligibility quickly and got a cleaner personal loan offer than my existing bank quote.",
  },
  {
    name: "Amit Jain",
    role: "Consultant",
    text: "Fintaraa made the documentation steps clear and kept the process moving without confusion.",
  },
];

export const insights = [
  {
    title: "Choosing the Right Home Loan for your Dream House",
    category: "Home Loan",
  },
  {
    title: "5 Practical Tips to Improve your CIBIL Score Quickly",
    category: "Credit Score",
  },
  {
    title: "Understanding Term Insurance Before You Buy",
    category: "Insurance",
  },
];
