import {
  Calculator,
  BadgePercent,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Car,
  Fuel,
  ChartPie,
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
  Gem,
  Landmark,
  UtensilsCrossed,
  Building2,
  // PiggyBank,
  // Banknote,
  // RotateCcw,
  // HandCoins,
  // Sparkles,
  // Wallet,
  // ScrollText,
  // Tent,
  // Trees,
  BarChart3,
} from "lucide-react";

export const heroStats = [
  { value: "50+", label: "Bank and NBFC partners" },
  { value: "24h", label: "Fast assisted processing" },
  { value: "30%", label: "Average EMI saving" },
  { value: "24/7", label: "Digital support" },
];

export const productSections = [
  {
    title: "Get Instant Loan (Get Money in 5 Minutes -Complete Digital Process)",
    cta: "View All",
    tag: "Cashback Offers",
    products: [
      {
        title: "ICICI Bank",
        text: "Quick instant loans",
        logo: "/assets/banks/icici-logo.png",
        tone: "orange",
      },
      {
        title: "Kotak Bank",
        text: "Fast approval loans",
        logo: "/assets/banks/kotak-logo.png",
        tone: "blue",
      },
      {
        title: "SBI Bank",
        text: "Instant disbursal",
        logo: "/assets/banks/sbi-logo.png",
        tone: "sky",
      },
      {
        title: "HDFC Bank",
        text: "Instant approval",
        logo: "/assets/banks/hdfc.png",
        tone: "red",
      },
      {
        title: "Axis Bank",
        text: "Quick loan disbursal",
        logo: "/assets/banks/axis-bank.png",
        tone: "pink",
      },
      {
        title: "Yes Bank",
        text: "Fast digital loans",
        logo: "/assets/banks/yes-bank.png",
        tone: "green",
      },
      {
        title: "IndusInd Bank",
        text: "Instant cash loans",
        logo: "/assets/banks/indusind.png",
        tone: "amber",
      },
      // {
      //   title: "IDFC First Bank",
      //   text: "Quick personal loans",
      //   logo: "/assets/banks/idfc.png",
      //   tone: "brown",
      // },
      // {
      //   title: "Bajaj Finserv",
      //   text: "Instant loan approval",
      //   logo: "/assets/banks/bajaj.png",
      //   tone: "gold",
      // },
      // {
      //   title: "Bank of Baroda",
      //   text: "Fast disbursal loans",
      //   logo: "/assets/banks/Bank-of-Baroda.png",
      //   tone: "orange",
      // },
    ],
  },
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
        title: "Education Loan",
        text: "Quick funds for your everyday needs.",
        icon: GraduationCap,
        tone: "green",
      },
      {
        title: "Gold Loan",
        text: "Instant loan against your gold assets.",
        icon: Gem,
        tone: "gold",
      },
      {
        title: "Loan Against Property",
        text: "Unlock funds from your property value.",
        icon: Landmark,
        tone: "blue",
      },
      // {
      //   title: "Working Capital Loan",
      //   text: "Manage business cash flow effectively.",
      //   icon: Banknote,
      //   tone: "sky",
      // },
      // {
      //   title: "Equipment Loan",
      //   text: "Finance machinery & equipment purchases.",
      //   icon: Building2,
      //   tone: "brown",
      // },
      // {
      //   title: "Overdraft Facility",
      //   text: "Flexible overdraft against your account.",
      //   icon: PiggyBank,
      //   tone: "violet",
      // },
    ],
  },
  {
    title: "Explore Insurance Plans",
    subtitle:
      "Get Money in 5 Minutes -Complete Digital Process",
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
        text: "Financial protection for your family's future.",
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
        title: "Property Insurance",
        text: "Secure your home or property against risks & loss.",
        icon: Home,
        tone: "red",
      },
      {
        title: "Travel Insurance",
        text: "Stay covered during domestic & international trips.",
        icon: Plane,
        tone: "blue",
      },
      // {
      //   title: "Two-Wheeler Insurance",
      //   text: "Protect your bike or scooter from damage & theft.",
      //   icon: Tent,
      //   tone: "orange",
      // },
      // {
      //   title: "Critical Illness Insurance",
      //   text: "Lump sum cover for major health conditions.",
      //   icon: HeartPulse,
      //   tone: "gold",
      // },
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
      {
        title: "Dining Cards",
        text: "Exclusive discounts & offers at restaurants.",
        icon: UtensilsCrossed,
        tone: "red",
      },
      // {
      //   title: "Business Cards",
      //   text: "Expense management & corporate benefits.",
      //   icon: BriefcaseBusiness,
      //   tone: "brown",
      // },
      // {
      //   title: "Student Cards",
      //   text: "Build credit history with student-friendly perks.",
      //   icon: GraduationCap,
      //   tone: "pink",
      // },
      // {
      //   title: "Premium Cards",
      //   text: "Exclusive lifestyle, concierge & luxury benefits.",
      //   icon: Gem,
      //   tone: "gold",
      // },
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
      {
        title: "Investment Advisory",
        text: "Expert guidance for mutual funds & investments.",
        icon: BarChart3,
        tone: "brown",
      },
      // {
      //   title: "Pension Planning",
      //   text: "Secure your retirement with smart pension plans.",
      //   icon: Trees,
      //   tone: "green",
      // },
    ],
  },
  {
    title: "Other financial services",
    cta: "View All",
    products: [
      {
        title: "CIBIL Score Check",
        text: "Check your credit score instantly.",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "ITR Filing",
        text: "Professional income tax return filing.",
        icon: ReceiptText,
        tone: "orange",
      },
      {
        title: "GST Registration & Return Filing",
        text: "Complete GST compliance solutions.",
        icon: FileCheck2,
        tone: "orange",
      },
      {
        title: "MSME Registration",
        text: "Register your MSME business easily.",
        icon: BriefcaseBusiness,
        tone: "orange",
      },
      {
        title: "Annual Compliance",
        text: "Stay compliant with annual requirements.",
        icon: Calculator,
        tone: "orange",
      },
      {
        title: "Project Report",
        text: "Get detailed project reports.",
        icon: FileCheck2,
        tone: "orange",
      },
      {
        title: "Company Registration",
        text: "Register Pvt Ltd, LLP & OPC companies.",
        icon: Building2,
        tone: "orange",
      },
      // {
      //   title: "Trademark Registration",
      //   text: "Protect your brand with trademark filing.",
      //   icon: ScrollText,
      //   tone: "orange",
      // },
      // {
      //   title: "Loan Calculator",
      //   text: "Calculate EMI, tenure & interest easily.",
      //   icon: Calculator,
      //   tone: "orange",
      // },
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