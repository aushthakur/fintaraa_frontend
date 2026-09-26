"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Gift,
  BadgePercent,
  Plane,
  Fuel,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  Percent,
  SlidersHorizontal,
  Coins,
  Compass,
  Zap,
} from "lucide-react";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import {
  PageMotionProvider,
  SectionReveal,
} from "@/components/common/motion/SectionReveal";

export type CategorySlug = "rewards" | "cashback" | "travel" | "fuel";

interface CategoryContent {
  slug: CategorySlug;
  categoryName: string;
  badge: string;
  h1: string;
  subtitle: string;
  icon: typeof Gift;
  accentColor: string;
  bgGradient: string;
  heroHighlights: { title: string; desc: string }[];
  guideTitle: string;
  guideSections: { title: string; body: string; points?: string[] }[];
  comparisonFactors: { title: string; description: string }[];
  eligibilityPoints: string[];
  docPoints: string[];
  faqs: { question: string; answer: string }[];
  relatedCategories: { title: string; href: string; icon: typeof Gift; desc: string }[];
}

const categoryDataMap: Record<CategorySlug, CategoryContent> = {
  rewards: {
    slug: "rewards",
    categoryName: "Rewards",
    badge: "Points, Vouchers & Milestones",
    h1: "Best Rewards Credit Cards in India",
    subtitle:
      "Earn accelerated reward points on your everyday purchases, shopping, and dining. Redeem points for flights, luxury merchandise, gift cards, or statement credit with zero hassle.",
    icon: Gift,
    accentColor: "#7c3aed",
    bgGradient: "from-[#4c1d95] via-[#5b21b6] to-[#6d28d9]",
    heroHighlights: [
      { title: "Up to 10X Accelerated Rewards", desc: "Multiply earnings on partnered dining, electronics & retail merchants." },
      { title: "Milestone Annual Vouchers", desc: "Unlock bonus shopping or travel vouchers upon reaching annual spending targets." },
      { title: "Flexible Point Redemption", desc: "Convert earned points into air miles, luxury catalog gifts, or cash credit." },
      { title: "Zero Expiry Options", desc: "Select credit cards offer evergreen reward points that never expire." },
    ],
    guideTitle: "How Reward Credit Cards Work & How to Maximize Points",
    guideSections: [
      {
        title: "Understanding Base vs. Accelerated Reward Points",
        body: "Standard reward credit cards offer base reward points (typically 1 to 4 points per ₹100 or ₹150 spent). Premium and co-branded reward cards partner with major merchants (Amazon, Flipkart, Apple, Taj Hotels, airlines) to provide accelerated multipliers ranging from 5X to 10X reward points on specific categories.",
        points: [
          "Base points apply across universal merchant category codes (MCCs).",
          "Accelerated points maximize returns on planned discretionary spendings.",
          "Check capping limits on monthly accelerated reward point accruals.",
        ],
      },
      {
        title: "Reward Point Valuation & Redemption Catalogues",
        body: "The monetary value of 1 Reward Point varies significantly by issuer and redemption channel. In Indian credit cards, 1 Reward Point generally ranges from ₹0.20 (for statement credit/cash) to ₹1.00 or higher (when transferred to airline frequent flyer programs or hotel loyalty schemes).",
        points: [
          "Transferring points to air miles (e.g., Club Vistara, KrisFlyer) usually yields maximum value per point.",
          "Brand vouchers (Amazon, Flipkart, BookMyShow) offer predictable value with immediate redemption.",
          "Statement credit conversion provides direct cashback offset but at a lower per-point valuation.",
        ],
      },
      {
        title: "Milestone Bonuses & Annual Fee Waivers",
        body: "Most reward cards structure their highest value propositions around spending milestones. Reaching quarterly or annual threshold spends (e.g., ₹1 Lakh per quarter or ₹4 Lakhs per annum) can unlock fee waivers and bonus vouchers worth ₹2,000 to ₹10,000.",
      },
    ],
    comparisonFactors: [
      { title: "Net Return on Spend", description: "Calculate effective return percentage (total value of points earned divided by total spend)." },
      { title: "Redemption Fee & Minimum Threshold", description: "Review if the bank charges a nominal redemption fee per transaction and check minimum redeemable point balances." },
      { title: "Expiry Policy", description: "Opt for cards with 2-3 year validity or lifetime non-expiring reward points." },
      { title: "Annual Fee vs Benefit Value", description: "Ensure the annual milestone perks outweigh the card's recurring membership fee." },
    ],
    eligibilityPoints: [
      "Age: 21 to 65 years (Indian Resident).",
      "Employment: Salaried with verified monthly salary or Self-Employed with filed ITRs.",
      "Credit Score: Preferably 720+ for entry/mid-tier cards, and 750+ for premium reward cards.",
      "Income Criteria: Minimum ₹20,000/month for entry-tier; ₹50,000 - ₹1,50,000/month for super-premium cards.",
    ],
    docPoints: [
      "Identity Proof: Aadhaar Card, PAN Card, Passport, or Voter ID.",
      "Address Proof: Aadhaar, Utility Bills (last 2 months), or Rental Agreement.",
      "Income Proof: Last 3 months' salary slips & bank statements (Salaried) or last 2 years' ITR with computation (Self-employed).",
    ],
    faqs: [
      {
        question: "How do I calculate the cash value of credit card reward points?",
        answer:
          "Divide the monetary value of the voucher or statement credit by the number of points required. For instance, if 4,000 points yield a ₹1,000 voucher, the value per point is ₹0.25 (25 paise).",
      },
      {
        question: "Can I transfer my credit card reward points to someone else?",
        answer:
          "Generally, reward points are non-transferable between different cardholders. However, some banks allow pooling points across multiple cards owned by the same primary holder or transferring points directly to partnered airline loyalty accounts registered in your name.",
      },
      {
        question: "Do credit card reward points expire?",
        answer:
          "Most Indian banks set an expiration period of 2 to 3 years from the date of accrual. Premium cards (such as HDFC Infinia or Axis Magnus) often offer reward points with lifetime validity.",
      },
      {
        question: "Are reward points earned on utility and government transactions?",
        answer:
          "Effective recent regulatory and issuer updates, several banks have capped or excluded reward points on rent payments, fuel, wallet loads, and government utility transactions. Always check the card's specific exclusions.",
      },
    ],
    relatedCategories: [
      { title: "Cashback Cards", href: "/credit-cards/cashback", icon: BadgePercent, desc: "Direct statement credit discounts on every swipe." },
      { title: "Travel Cards", href: "/credit-cards/travel", icon: Plane, desc: "Complimentary airport lounge access and low forex markup." },
      { title: "Fuel Cards", href: "/credit-cards/fuel", icon: Fuel, desc: "1% fuel surcharge waivers and pump rewards." },
    ],
  },
  cashback: {
    slug: "cashback",
    categoryName: "Cashback",
    badge: "Direct Statement Credit & Savings",
    h1: "Best Cashback Credit Cards in India",
    subtitle:
      "Get guaranteed cashback on online shopping, grocery delivery, dining, food orders, and utility bill payments. Enjoy direct statement credits without dealing with complicated reward catalogues.",
    icon: BadgePercent,
    accentColor: "#2563eb",
    bgGradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]",
    heroHighlights: [
      { title: "5% Unlimited Online Cashback", desc: "Earn elevated percentage returns across top e-commerce & merchant platforms." },
      { title: "Direct Statement Credit", desc: "Cashback is automatically credited to your monthly credit card statement." },
      { title: "Utility & Bill Payment Savings", desc: "Enjoy consistent 2% to 5% savings on electricity, DTH, broadband & phone recharges." },
      { title: "Zero Complicated Math", desc: "Simple, transparent percentage cash returns on every domestic transaction." },
    ],
    guideTitle: "Maximizing Your Returns with Cashback Credit Cards",
    guideSections: [
      {
        title: "Direct Statement Credit vs. Merchant Wallet Cash",
        body: "Cashback credit cards are beloved for their sheer simplicity. Unlike reward point cards that require browsing redemption catalogs, cashback cards credit your savings directly to your monthly bill statement, reducing the total amount payable on your billing cycle.",
        points: [
          "Automatic settlement at the end of each billing cycle.",
          "Eliminates redemption processing fees and expiry concerns.",
          "Clear percentage transparency on every eligible transaction.",
        ],
      },
      {
        title: "Merchant-Specific Cashback vs. Universal Flat Cashback",
        body: "Co-branded cashback cards (like ICICI Amazon Pay or Axis Flipkart) offer 5% flat cashback on their respective flagship partner ecosystems and 1% to 1.5% on other transactions. Universal cashback cards (like SBI Cashback) offer up to 5% across almost all online merchants without brand lock-in.",
        points: [
          "Choose co-branded cards if the bulk of your monthly spend is concentrated with one merchant.",
          "Choose universal cashback cards if you shop across diverse multi-category e-commerce sites.",
        ],
      },
      {
        title: "Understanding Monthly Cashback Capping Limits",
        body: "Issuers typically place monthly caps on maximum cashback earnings in elevated categories (e.g., max ₹5,000 per billing cycle on 5% categories). Understanding these thresholds ensures you allocate card spends effectively without hitting diminished returns.",
      },
    ],
    comparisonFactors: [
      { title: "Cashback Percentage by Category", description: "Compare online shopping (5%), offline retail (1%), and utility bill payments (2%-5%)." },
      { title: "Monthly Capping Limit", description: "Verify the maximum allowable cashback you can earn per monthly billing statement." },
      { title: "Annual Fee Break-Even", description: "Ensure your projected annual cashback comfortably exceeds the card's annual renewal fee." },
      { title: "Category Exclusions", description: "Review exclusions such as gold purchases, fuel, rent, and wallet top-ups." },
    ],
    eligibilityPoints: [
      "Age: 21 to 60 years.",
      "Employment: Salaried with monthly income from ₹15,000/month or Self-Employed professionals.",
      "Credit Score: 700+ recommended for quick digital sanction.",
      "Active Banking Relationship: Existing bank accounts facilitate pre-approved or instant card issuance.",
    ],
    docPoints: [
      "Identity Proof: PAN Card and Aadhaar Card.",
      "Address Proof: Aadhaar, Electricity Bill, or Passport.",
      "Income Proof: 3 months' bank account statement with regular salary credits or recent ITR.",
    ],
    faqs: [
      {
        question: "How is cashback credited to my account?",
        answer:
          "In most modern cashback cards, the total eligible cashback earned during a billing cycle is automatically adjusted against your card statement balance in the next billing cycle.",
      },
      {
        question: "Is cashback taxable in India?",
        answer:
          "Cashback earned as a rebate or discount on personal credit card spending is generally treated as a discount on purchases and is not classified as taxable income under the Indian Income Tax Act.",
      },
      {
        question: "Do cashback cards offer lounge access?",
        answer:
          "Certain premium cashback cards include complimentary domestic airport lounge access, while entry-level cashback cards prioritize higher spend rebates over luxury travel perks.",
      },
      {
        question: "What happens if I return an item bought with a cashback card?",
        answer:
          "If an order is refunded or cancelled, the proportional cashback credited for that transaction will be reversed in your subsequent billing cycle.",
      },
    ],
    relatedCategories: [
      { title: "Rewards Cards", href: "/credit-cards/rewards", icon: Gift, desc: "Milestone vouchers and flexible catalog redemptions." },
      { title: "Travel Cards", href: "/credit-cards/travel", icon: Plane, desc: "Complimentary airport lounge access and zero forex markup." },
      { title: "Fuel Cards", href: "/credit-cards/fuel", icon: Fuel, desc: "1% fuel surcharge waivers and fuel reward points." },
    ],
  },
  travel: {
    slug: "travel",
    categoryName: "Travel",
    badge: "Airport Lounges & Forex Savings",
    h1: "Best Travel & Airport Lounge Credit Cards",
    subtitle:
      "Elevate every journey with complimentary domestic and international airport lounge access, discounted airfare, air mile transfers, travel insurance, and reduced foreign currency markup fees.",
    icon: Plane,
    accentColor: "#0891b2",
    bgGradient: "from-[#0e7490] via-[#0891b2] to-[#06b6d4]",
    heroHighlights: [
      { title: "Complimentary Lounge Access", desc: "Enjoy domestic and international airport lounge visits via DreamFolks / Priority Pass." },
      { title: "Low Forex Markup Fees", desc: "Save significantly on international transactions with reduced 0% to 2% forex markups." },
      { title: "Air Miles Transfer Ratios", desc: "Convert earned points to airline loyalty programs with leading international carriers." },
      { title: "Comprehensive Travel Insurance", desc: "Complimentary air accident, lost baggage, and flight delay coverage." },
    ],
    guideTitle: "Everything You Need to Know About Travel Credit Cards",
    guideSections: [
      {
        title: "Airport Lounge Access: Domestic vs International Mechanics",
        body: "Travel credit cards provide complimentary visits to airport lounges across India and worldwide. Domestic lounge access is typically processed through bank-linked Visa, Mastercard, or RuPay networks, or DreamFolks passes. International lounge access is enabled through Priority Pass or DragonPass memberships.",
        points: [
          "Check whether lounge visits are unconditional or tied to quarterly spend thresholds (e.g., ₹35,000 - ₹50,000 in previous quarter).",
          "Review guest access policies; primary cards usually cover the primary cardholder, while ultra-premium cards include free guest entries.",
        ],
      },
      {
        title: "Foreign Exchange (Forex) Markup Optimization",
        body: "Standard credit cards levy a 3.5% + GST markup fee on all foreign currency transactions (overseas shopping, hotel bookings, or international online payments). Specialized travel credit cards reduce this markup to 0% to 2%, saving frequent international travelers thousands of rupees per trip.",
      },
      {
        title: "Co-Branded Airline Cards vs. Multi-Partner Travel Cards",
        body: "Co-branded airline cards (such as Axis Vistara or Air India SBI) provide direct tier upgrades, free ticket vouchers, and accelerated miles on a single airline. Multi-partner travel cards (such as Axis Atlas or HDFC Infinia) offer versatile point-transfer flexibility across multiple global airline and hotel chains.",
      },
    ],
    comparisonFactors: [
      { title: "Lounge Access Frequency & Terms", description: "Verify number of complimentary quarterly domestic and annual international visits." },
      { title: "Forex Markup Rate", description: "Look for cards offering 0% to 2% markup rather than standard 3.5% rates." },
      { title: "Air Mile Conversion Partners", description: "Evaluate airline and hotel transfer ratios and partner network depth." },
      { title: "Travel Insurance Cover", description: "Review accidental air insurance and lost passport/baggage compensation limits." },
    ],
    eligibilityPoints: [
      "Age: 21 to 65 years.",
      "Employment: Salaried executive or Self-Employed business owner with strong financial history.",
      "Credit Score: 740+ recommended for premium travel and lounge cards.",
      "Income Requirement: Typically ₹50,000/month for mid-tier travel cards up to ₹1,50,000+/month for super-premium cards.",
    ],
    docPoints: [
      "Identity Proof: Passport, PAN Card, or Aadhaar Card.",
      "Address Proof: Passport, Aadhaar, or Bank Statement.",
      "Financial Proof: Form 16, latest 3 months' salary slips, or 2 years' ITR.",
    ],
    faqs: [
      {
        question: "How do I access airport lounges using my credit card?",
        answer:
          "Present your physical or digital credit card (or linked Priority Pass/DreamFolks QR) at the lounge reception. A nominal authorization charge (₹2 on Visa/Mastercard or ₹25 on RuPay) is deducted and immediately refunded to authenticate the card.",
      },
      {
        question: "What is spend-based lounge access criteria?",
        answer:
          "Several Indian banks now require cardholders to spend a minimum amount (e.g., ₹10,000 to ₹50,000) in the preceding calendar quarter to unlock complimentary lounge access passes for the subsequent quarter.",
      },
      {
        question: "Can I bring a guest into the airport lounge with me?",
        answer:
          "Standard cards charge guest entry at prevailing lounge walk-in rates. However, premium cards like HDFC Infinia or Axis Olympus include complimentary guest visits.",
      },
      {
        question: "What is foreign currency markup on credit cards?",
        answer:
          "Forex markup is the conversion charge applied by credit card issuers when you make a purchase in a currency other than Indian Rupee (INR). Travel cards offer reduced or zero forex markup rates to lower your overseas expenses.",
      },
    ],
    relatedCategories: [
      { title: "Rewards Cards", href: "/credit-cards/rewards", icon: Gift, desc: "Accelerated points and milestone vouchers." },
      { title: "Cashback Cards", href: "/credit-cards/cashback", icon: BadgePercent, desc: "Direct statement credits on shopping and groceries." },
      { title: "Fuel Cards", href: "/credit-cards/fuel", icon: Fuel, desc: "Surcharge waivers and petrol savings." },
    ],
  },
  fuel: {
    slug: "fuel",
    categoryName: "Fuel",
    badge: "1% Surcharge Waiver & Fuel Points",
    h1: "Best Fuel Surcharge Credit Cards in India",
    subtitle:
      "Save money on daily commuting and road trips with 1% fuel surcharge waivers across Indian oil pumps, accelerated rewards on petrol/diesel, and free fuel redemption benefits.",
    icon: Fuel,
    accentColor: "#059669",
    bgGradient: "from-[#065f46] via-[#047857] to-[#059669]",
    heroHighlights: [
      { title: "1% Fuel Surcharge Waiver", desc: "Enjoy complete waiver of the 1% fuel surcharge across authorized petrol pumps across India." },
      { title: "Up to 5% Value Back in Fuel", desc: "Earn elevated rewards redeemable directly for free petrol/diesel liters at partnered pumps." },
      { title: "Co-Branded Oil PSU Partnerships", desc: "Strategic tie-ups with IndianOil (IOCL), Bharat Petroleum (BPCL), and HPCL." },
      { title: "Low Annual Fee & Fee Waivers", desc: "Accessible annual fees easily waived off on modest annual card spends." },
    ],
    guideTitle: "How Fuel Credit Cards Work & How to Maximize Fuel Savings",
    guideSections: [
      {
        title: "How the 1% Fuel Surcharge Waiver Works",
        body: "When you purchase fuel using a regular credit card, merchant acquiring banks levy a 1% surcharge plus GST. Fuel credit cards automatically waive off this 1% surcharge on eligible transactions (typically between ₹400 and ₹5,000), up to a designated monthly ceiling (usually ₹100 to ₹250 per billing cycle).",
        points: [
          "Always ensure your transaction value falls within the eligible ₹400 - ₹5,000 band.",
          "GST levied on the surcharge is non-refundable by regulation, but the core surcharge is 100% reversed.",
        ],
      },
      {
        title: "Co-Branded vs. Generic Surcharge Waiver Cards",
        body: "Generic credit cards provide only the 1% surcharge waiver without extra points. In contrast, co-branded fuel cards (such as SBI BPCL Octane, ICICI HPCL Super Saver, or Axis IndianOil) reward you with 4% to 5% effective value-back in reward points when refueling at the partnered oil marketing company's fuel stations.",
      },
      {
        title: "Redeeming Fuel Points for Free Petrol",
        body: "Earned fuel reward points can be converted directly into fuel liters at partnered pump POS terminals or redeemed for digital fuel vouchers on the issuer's rewards portal.",
      },
    ],
    comparisonFactors: [
      { title: "Partner Oil Network", description: "Choose a card partnered with the fuel station brand most accessible on your daily commute (IOCL, BPCL, or HPCL)." },
      { title: "Effective Value-Back Rate", description: "Compare accelerated reward points on fuel (ranges from 2.5% to 7.25% on top cards)." },
      { title: "Monthly Surcharge Cap", description: "Check maximum monthly surcharge waiver limits (typically ₹100 to ₹250/month)." },
      { title: "Non-Fuel Spends Value", description: "Evaluate rewards on grocery, utility, and dining spends to ensure versatile card utility." },
    ],
    eligibilityPoints: [
      "Age: 21 to 65 years.",
      "Employment: Salaried with monthly income from ₹15,000/month or Self-Employed individuals.",
      "Credit Score: 700+ recommended.",
      "Vehicle Ownership: Recommended for daily vehicle owners, fleet operators, and frequent commuters.",
    ],
    docPoints: [
      "Identity Proof: PAN Card, Aadhaar Card, or Driver's License.",
      "Address Proof: Aadhaar Card, Utility Bill, or Passport.",
      "Income Proof: Salary slip or latest ITR with bank statement.",
    ],
    faqs: [
      {
        question: "How does the fuel surcharge waiver appear on my statement?",
        answer:
          "The fuel transaction is billed along with the 1% surcharge initially. Within 2 to 3 working days, a separate credit entry equivalent to the 1% surcharge is posted to your credit card statement.",
      },
      {
        question: "Is there a minimum or maximum transaction amount for fuel surcharge waiver?",
        answer:
          "Yes, most banks require fuel transactions to be between ₹400 and ₹5,000 to qualify for the 1% surcharge waiver. Transactions below ₹400 or above ₹5,000 will incur the standard surcharge.",
      },
      {
        question: "Can I use a co-branded fuel card at any petrol pump?",
        answer:
          "Yes, the card works at any petrol pump and offers standard 1% surcharge waiver. However, the accelerated 4%-5% fuel reward points are only accrued when swiped at the specific partner brand's stations (e.g., BPCL for BPCL cards).",
      },
      {
        question: "Can I redeem my fuel reward points at the petrol pump directly?",
        answer:
          "Yes, many partnered pumps allow instant reward redemption directly on the bank POS terminal, deducting points to pay for fuel in real-time.",
      },
    ],
    relatedCategories: [
      { title: "Rewards Cards", href: "/credit-cards/rewards", icon: Gift, desc: "Milestone vouchers and points." },
      { title: "Cashback Cards", href: "/credit-cards/cashback", icon: BadgePercent, desc: "Direct statement credits on shopping." },
      { title: "Travel Cards", href: "/credit-cards/travel", icon: Plane, desc: "Lounge access and low forex rates." },
    ],
  },
};

export function CreditCardCategoryPage({ slug }: { slug: CategorySlug }) {
  const content = categoryDataMap[slug] || categoryDataMap.rewards;
  const Icon = content.icon;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([content.categoryName]);

  const scrollToCards = () => {
    document
      .getElementById("cards-explorer-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fintaraa.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Credit Cards",
        item: "https://fintaraa.com/credit-cards",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${content.categoryName} Cards`,
        item: `https://fintaraa.com/credit-cards/${content.slug}`,
      },
    ],
  };

  return (
    <PageMotionProvider>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-white text-[#1a1d25] font-sans antialiased">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-[#edf2f7] bg-[#f8fafc] px-4 py-3 text-[12px] md:px-8 lg:px-16">
          <div className="mx-auto flex max-w-9xl items-center gap-2 text-[#64748b]">
            <Link href="/" className="hover:text-[#4c1d95] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/credit-cards" className="hover:text-[#4c1d95] transition-colors">
              Credit Cards
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#4c1d95]">{content.categoryName} Cards</span>
          </div>
        </div>

        {/* Category Hero Section */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${content.bgGradient} px-4 py-12 text-white md:px-8 md:py-16 lg:px-16`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <div className="mx-auto max-w-9xl relative z-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-medium backdrop-blur-md">
                  <Icon className="h-3.5 w-3.5 text-white" />
                  <span>{content.badge}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-white">
                  {content.h1}
                </h1>
                <p className="text-[14px] leading-relaxed text-white/90 sm:text-[15px] max-w-2xl">
                  {content.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={scrollToCards}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13px] font-semibold text-[#4c1d95] shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Compare {content.categoryName} Cards
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/login?referrer=%2Fcredit-cards&product=credit-card"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    Check Card Eligibility
                  </Link>
                </div>
              </div>

              {/* Highlights 2x2 Grid */}
              <div className="lg:col-span-5 grid gap-3 sm:grid-cols-2">
                {content.heroHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white mb-2.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h2 className="text-[13px] font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/80">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category Quick Selector */}
        <section className="border-b border-[#e2e8f0] bg-white px-4 py-4 md:px-8 lg:px-16">
          <div className="mx-auto max-w-9xl flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[12px] font-medium text-[#64748b] shrink-0">
              Browse Categories:
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {[
                { slug: "rewards", label: "Rewards", href: "/credit-cards/rewards", icon: Gift },
                { slug: "cashback", label: "Cashback", href: "/credit-cards/cashback", icon: BadgePercent },
                { slug: "travel", label: "Travel & Lounge", href: "/credit-cards/travel", icon: Plane },
                { slug: "fuel", label: "Fuel Surcharge", href: "/credit-cards/fuel", icon: Fuel },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = tab.slug === content.slug;
                return (
                  <Link
                    key={tab.slug}
                    href={tab.href}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                      isActive
                        ? "bg-[#4c1d95] text-white shadow-sm"
                        : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#1e293b]"
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Filterable Cards Explorer */}
        <section id="cards-explorer-section" className="scroll-mt-16 bg-white py-6">
          <div className="mx-auto max-w-9xl px-4 md:px-8 lg:px-16 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#f1f5f9] pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a] sm:text-[22px]">
                  Available {content.categoryName} Credit Cards
                </h2>
                <p className="text-[13px] text-[#64748b] mt-0.5">
                  Filter by partner bank, annual fee tier, rewards, and eligibility.
                </p>
              </div>
              <Link
                href="/credit-cards"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4c1d95] hover:underline"
              >
                View all 50+ credit cards
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <CreditCardsExplorer
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </section>

        {/* In-Depth Educational Guide Section */}
        <section className="border-t border-[#edf2f7] bg-[#f8fafc] px-4 py-12 md:px-8 md:py-16 lg:px-16">
          <div className="mx-auto max-w-9xl">
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <span className="inline-block rounded-full bg-[#ede9fe] px-3 py-1 text-[11px] font-semibold text-[#4c1d95]">
                Financial Guide
              </span>
              <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[28px]">
                {content.guideTitle}
              </h2>
              <p className="mt-2 text-[14px] text-[#64748b]">
                Make an informed decision with clear breakdowns on features, fees, and value calculations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {content.guideSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-[15px] font-bold text-[#1e293b]">
                    {sec.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#475569]">
                    {sec.body}
                  </p>
                  {sec.points && (
                    <ul className="mt-4 space-y-2 border-t border-[#f1f5f9] pt-3 text-[12px] text-[#64748b]">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7c3aed] mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Compare Factors */}
        <section className="bg-white px-4 py-12 md:px-8 md:py-16 lg:px-16">
          <div className="mx-auto max-w-9xl">
            <h2 className="text-[20px] font-bold text-[#0f172a] sm:text-[24px] mb-6">
              Key Factors to Compare Before Applying
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.comparisonFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#e2e8f0] bg-[#fafafa] p-5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ede9fe] text-[12px] font-bold text-[#4c1d95] mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1e293b]">
                    {factor.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#64748b]">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility & Documentation Tabs / Grid */}
        <section className="border-t border-[#edf2f7] bg-[#f8fafc] px-4 py-12 md:px-8 md:py-16 lg:px-16">
          <div className="mx-auto max-w-9xl grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ede9fe] text-[#4c1d95]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0f172a]">
                  Eligibility Criteria for {content.categoryName} Cards
                </h2>
              </div>
              <ul className="space-y-3 text-[13px] text-[#475569]">
                {content.eligibilityPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669] mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ede9fe] text-[#4c1d95]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0f172a]">
                  Required Documents
                </h2>
              </div>
              <ul className="space-y-3 text-[13px] text-[#475569]">
                {content.docPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2563eb] mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white px-4 py-12 md:px-8 md:py-16 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-[20px] font-bold text-[#0f172a] sm:text-[26px]">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Got questions about {content.categoryName.toLowerCase()} credit cards? We have answers.
              </p>
            </div>

            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#e2e8f0] bg-[#fafafa] p-5"
                >
                  <h3 className="text-[14px] font-semibold text-[#1e293b]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#475569]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Categories Navigation */}
        <section className="border-t border-[#edf2f7] bg-[#f8fafc] px-4 py-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-9xl">
            <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">
              Explore Other Credit Card Categories
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {content.relatedCategories.map((rel, idx) => {
                const RelIcon = rel.icon;
                return (
                  <Link
                    key={idx}
                    href={rel.href}
                    className="group flex items-start gap-3.5 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:border-[#4c1d95] hover:shadow-md transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#4c1d95] group-hover:bg-[#ede9fe] transition-colors">
                      <RelIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[13px] font-bold text-[#1e293b] group-hover:text-[#4c1d95]">
                        <span>{rel.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-1 text-[11px] text-[#64748b]">
                        {rel.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* App Banner */}
        <AppDownloadBanner />
      </main>
    </PageMotionProvider>
  );
}
