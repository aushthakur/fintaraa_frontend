

export type ProductUseCase = {
  id: string;
  title: string;
  headline: string;
  badge: string;
  image: string;
  alt: string;
  amount: string;
  tenure: string;
  rate: string;
  desc: string;
  benefits: string[];
  smartTip: string;
};

export type ProductEligibilityDetail = {
  categoryTitle: string;
  categorySubtitle: string;
  iconName: "building" | "briefcase" | "home" | "car" | "coins" | "tractor";
  items: { label: string; desc: string }[];
};

export type ProductDocumentDetail = {
  categoryTitle: string;
  categorySubtitle: string;
  items: { title: string; desc: string }[];
};

export type ProductFeatureDetail = {
  title: string;
  desc: string;
  highlight: string;
  accent: string;
};

export type ProductHeroSlide = {
  image: string;
  alt: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  chips: string[];
  ctaText: string;
};

export type ProductRangeSpec = {
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  stepAmount: number;
  rate: number;
  minTenure: number;
  maxTenure: number;
  defaultTenure: number;
  rateBadge: string;
  amountBadge: string;
};

export type ProductContentConfig = {
  slug: string;
  title: string;
  categoryLabel: string;
  range: ProductRangeSpec;
  slides: ProductHeroSlide[];
  useCasesTitle: string;
  useCasesSubtitle: string;
  useCases: ProductUseCase[];
  eligibilityTitle: string;
  eligibilitySubtitle: string;
  eligibility: {
    column1: ProductEligibilityDetail;
    column2: ProductEligibilityDetail;
  };
  features: ProductFeatureDetail[];
  documents: {
    column1: ProductDocumentDetail;
    column2: ProductDocumentDetail;
  };
};

export const productContentMap: Record<string, ProductContentConfig> = {
  "home-loan": {
    slug: "home-loan",
    title: "Home Loan",
    categoryLabel: "Home & Property",
    range: {
      minAmount: 500000,
      maxAmount: 100000000,
      defaultAmount: 5000000,
      stepAmount: 100000,
      rate: 8.35,
      minTenure: 5,
      maxTenure: 30,
      defaultTenure: 20,
      rateBadge: "From 8.35%* p.a.",
      amountBadge: "Up to ₹100 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/home-loan-01-desktop.webp",
        alt: "Modern luxury home in India with family",
        badge: "🏠 Lowest Repo-Linked Interest Rates",
        title: "Finance Your Dream Home with RBI Repo-Linked Rates",
        highlight: "Sanctions in 48 Hours",
        description:
          "Unlock competitive home financing from 50+ prime Indian banks with zero hidden charges, 30-year flexible tenures, and door-step legal assistance.",
        chips: ["From 8.35%* p.a.", "Tenure up to 30 Yrs", "Zero Foreclosure Fee"],
        ctaText: "Check Pre-Approved Home Loan",
      },
      {
        image: "/assets/personal-loan/hero-slide-3.jpg",
        alt: "Happy Indian family stepping into new home",
        badge: "✨ PMAY & Tax Benefits under Sec 24(b)",
        title: "Save Up to ₹3.5 Lakhs Yearly on Income Tax",
        highlight: "Interest Deduction Benefits",
        description:
          "Enjoy maximum tax exemption under Section 24(b) and Section 80C along with transparent doorstep property valuation and title verification.",
        chips: ["Sec 24(b) Deduction", "80C Principal Relief", "Doorstep Legal Check"],
        ctaText: "Calculate Tax & EMI",
      },
    ],
    useCasesTitle: "Home Financing Solutions for Every",
    useCasesSubtitle: "Property Goal",
    useCases: [
      {
        id: "ready-flat",
        title: "Ready-to-Move Apartments & Flats",
        headline: "Instant Disbursal for Ready Gated Community Homes",
        badge: "Zero Builder Risk",
        image: "/assets/personal-loan/usecase-home.jpg",
        alt: "Modern apartment balcony view",
        amount: "Up to ₹50 Crore",
        tenure: "5 to 30 Years",
        rate: "From 8.35%* p.a.",
        desc: "Buying a ready-to-move apartment eliminates construction delays and GST overheads. Get direct bank sanctions with approved builder project tie-ups.",
        benefits: [
          "No GST on ready property purchases",
          "Pre-approved builder projects for instant 24-hr sanction",
          "Up to 90% Loan-to-Value (LTV) funding",
          "Tax benefit on interest up to ₹2 Lakhs p.a.",
        ],
        smartTip: "Choose pre-approved builder titles to waive technical property valuation fees.",
      },
      {
        id: "plot-construction",
        title: "Plot Purchase + Home Construction",
        headline: "Finance Land Acquisition & Custom Architectural Building",
        badge: "Combined Funding",
        image: "/assets/loan-banners/rendered/home-loan-01-desktop.webp",
        alt: "Home construction site in India",
        amount: "Up to ₹25 Crore",
        tenure: "5 to 30 Years",
        rate: "From 8.40%* p.a.",
        desc: "Acquire residential plots and construct your custom multi-story dream home with staged tranche disbursals linked to actual construction progress.",
        benefits: [
          "Combined plot purchase and construction sanction letter",
          "Pay interest only on disbursed amounts during construction",
          "Architect-certified stage-wise fund release",
          "Tenures up to 30 years keep EMIs minimal",
        ],
        smartTip: "Ensure approved municipal sanction layout plans before applying to speed up stage-1 disbursal.",
      },
    ],
    eligibilityTitle: "Home Loan Eligibility Guidelines",
    eligibilitySubtitle: "Simple criteria based on income, age, and property title legality.",
    eligibility: {
      column1: {
        categoryTitle: "For Salaried Individuals",
        categorySubtitle: "Employees of MNCs, Corporates, Govt & Public Sector",
        iconName: "building",
        items: [
          { label: "Age", desc: "21 to 65 years at loan tenure completion." },
          { label: "Net Salary", desc: "Minimum ₹25,000/mo for Metros, ₹20,000/mo for Tier-2." },
          { label: "Experience", desc: "Minimum 1 year total work experience with 6 months in current firm." },
          { label: "CIBIL Score", desc: "720+ preferred for prime interest rates starting 8.35%." },
        ],
      },
      column2: {
        categoryTitle: "For Self-Employed & Business Owners",
        categorySubtitle: "Proprietors, Partners, Directors & Professionals",
        iconName: "briefcase",
        items: [
          { label: "Age", desc: "23 to 70 years at loan maturity." },
          { label: "Business Vintage", desc: "Minimum 3 years of audited business operations with positive net profit." },
          { label: "Income Proof", desc: "2 Years ITR with Computation of Income and CA-certified balance sheet." },
          { label: "CIBIL Score", desc: "730+ for highest LTV up to 85% of property value." },
        ],
      },
    },
    features: [
      { title: "Repo Rate Linked Interest (EBLR)", desc: "Rates benchmarked directly to RBI Repo rate for transparent rate cuts.", highlight: "Repo Linked", accent: "#8b5cf6" },
      { title: "Tenure Up to 30 Years", desc: "Lower your monthly EMI footprint with extended 360-month repayment schedules.", highlight: "30-Year Tenure", accent: "#0ea5e9" },
      { title: "Zero Foreclosure & Part-Payment Fee", desc: "Prepay floating-rate home loans anytime without penalty charges.", highlight: "Zero Penalty", accent: "#10b981" },
      { title: "Doorstep Legal & Technical Vetting", desc: "Full legal title search and property valuation managed by bank-empaneled experts.", highlight: "Doorstep Service", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "KYC & Income Proof",
        categorySubtitle: "Standard personal documentation required",
        items: [
          { title: "Identity & Address", desc: "PAN Card, Aadhaar Card, Passport, or Voter ID" },
          { title: "Salaried Income", desc: "3 months salary slips, 6 months bank statements, Form 16" },
          { title: "Self-Employed Income", desc: "2 years ITR with computation, P&L, balance sheet, 12-mo bank statement" },
        ],
      },
      column2: {
        categoryTitle: "Property Documents",
        categorySubtitle: "Real estate legal paper checklist",
        items: [
          { title: "Title Deed", desc: "Registered sale deed, allotment letter, or mother deed chain" },
          { title: "Approved Map", desc: "Sanctioned building plan from local municipal corporation" },
          { title: "NOC & Encumbrance", desc: "Encumbrance Certificate (EC) for past 13-30 years & Builder NOC" },
        ],
      },
    },
  },

  "balance-transfer-top-up-loan": {
    slug: "balance-transfer-top-up-loan",
    title: "Balance Transfer + Top-Up Loan",
    categoryLabel: "Home & Property",
    range: {
      minAmount: 1000000,
      maxAmount: 100000000,
      defaultAmount: 6000000,
      stepAmount: 100000,
      rate: 8.35,
      minTenure: 5,
      maxTenure: 30,
      defaultTenure: 20,
      rateBadge: "From 8.35%* p.a.",
      amountBadge: "Up to ₹100 Cr + Extra Top-Up",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/balance-transfer-loan-01-desktop.webp",
        alt: "Balance transfer home loan savings",
        badge: "📉 Slashed Monthly EMI",
        title: "Transfer Existing Home Loan & Reduce Interest Rates",
        highlight: "Get Unrestricted Top-Up Cash",
        description:
          "Switch high-interest home loans to prime RBI repo-linked rates starting at 8.35%. Get an additional high-ticket top-up loan at home loan interest rates.",
        chips: ["Rates from 8.35%*", "Save Lakhs in Interest", "High Top-Up Limit"],
        ctaText: "Calculate Savings & Switch",
      },
    ],
    useCasesTitle: "Why Consider a Home Loan Balance Transfer +",
    useCasesSubtitle: "Top-Up?",
    useCases: [
      {
        id: "rate-reduction",
        title: "Slash High Interest Outflow",
        headline: "Save Up to ₹15+ Lakhs Over Remaining Loan Tenure",
        badge: "Instant Rate Drop",
        image: "/assets/loan-banners/rendered/balance-transfer-loan-01-desktop.webp",
        alt: "Financial savings chart",
        amount: "Up to ₹50 Cr",
        tenure: "Up to 30 Years",
        rate: "From 8.35%* p.a.",
        desc: "If your current lender charges 9.5% or above, transferring to a 8.35% prime repo-linked lender slashes your total interest burden dramatically.",
        benefits: [
          "Direct interest reduction of up to 1.5% to 2.5%",
          "Option to either reduce monthly EMI or shorten loan tenure",
          "Seamless door-step document pickup & NOC transfer",
          "Zero foreclosure fee on existing floating rate home loan",
        ],
        smartTip: "Keep existing tenure same after transfer to drastically cut remaining principal burden.",
      },
      {
        id: "top-up-liquidity",
        title: "High-Ticket Top-Up Capital",
        headline: "Borrow Additional Funds at Home Loan Interest Rates",
        badge: "Lowest Interest Top-Up",
        image: "/assets/personal-loan/usecase-home.jpg",
        alt: "Luxury interior renovation",
        amount: "Up to ₹1 Cr Top-Up",
        tenure: "Same as Home Loan",
        rate: "From 8.50%* p.a.",
        desc: "Unlike personal loans charging 11%+ interest, top-up loans are available at home loan rates (~8.5%) with zero end-use restrictions.",
        benefits: [
          "Fund home renovation, business expansion, or child's higher education",
          "Longer repayment tenure of up to 20 years keeps EMIs extremely low",
          "Single unified monthly installment for base loan and top-up",
          "Disbursal straight to your savings account within 72 hours of NOC",
        ],
        smartTip: "Use top-up funds to pay off high-cost 36% credit card or personal debts.",
      },
    ],
    eligibilityTitle: "Balance Transfer Eligibility Criteria",
    eligibilitySubtitle: "Requirements for smooth lender switching and top-up approval.",
    eligibility: {
      column1: {
        categoryTitle: "Existing Loan Track Record",
        categorySubtitle: "Repayment history on current home loan",
        iconName: "building",
        items: [
          { label: "Existing EMIs", desc: "Minimum 12 consecutive EMI payments made without default." },
          { label: "Property Construction", desc: "Property must be fully constructed or registered (ready stage)." },
          { label: "CIBIL Score", desc: "730+ for instant sanction of top-up amount up to 100% of original loan." },
        ],
      },
      column2: {
        categoryTitle: "Income & Property Fit",
        categorySubtitle: "Financial stability and collateral equity",
        iconName: "briefcase",
        items: [
          { label: "LTV Margin", desc: "Combined home loan + top-up must stay within 80% of current property valuation." },
          { label: "FOIR", desc: "Total monthly obligations under 55% of net monthly income." },
          { label: "Title Cleanliness", desc: "Original title deeds safely held with current bank." },
        ],
      },
    },
    features: [
      { title: "8.35% Base Benchmark Rate", desc: "Switch to lowest floating repo-linked rates in the market.", highlight: "8.35% Rate", accent: "#8b5cf6" },
      { title: "Top-Up at Home Loan Rates", desc: "Access high-ticket cash liquidity at 8.50% instead of 12% personal loan rates.", highlight: "Cheap Top-Up", accent: "#0ea5e9" },
      { title: "Complete Document Retrieval Assist", desc: "Fintaraa helps obtain List of Documents (LOD) & Foreclosure letter from current bank.", highlight: "Assisted Switch", accent: "#10b981" },
      { title: "Tax Exemption Retention", desc: "Retain Section 24(b) interest deduction benefits on transferred home loan.", highlight: "Tax Benefits", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Existing Bank Documents",
        categorySubtitle: "Documents from current home loan lender",
        items: [
          { title: "Foreclosure Letter", desc: "Official statement with principal balance and bank bank account for payout" },
          { title: "List of Documents (LOD)", desc: "List of original property deeds held by current lender" },
          { title: "12-Month Track Record", desc: "Loan account statement showing clean 12 EMI debits" },
        ],
      },
      column2: {
        categoryTitle: "Income & KYC Proof",
        categorySubtitle: "Standard borrower identification",
        items: [
          { title: "KYC Details", desc: "PAN, Aadhaar, recent photo" },
          { title: "Income Proof", desc: "Latest 3 months salary slips or 2 years business ITR & bank statement" },
          { title: "Property Proof", desc: "Copy of sale deed and latest property tax paid receipt" },
        ],
      },
    },
  },

  "loan-against-property": {
    slug: "loan-against-property",
    title: "Loan Against Property (LAP)",
    categoryLabel: "Home & Property",
    range: {
      minAmount: 1000000,
      maxAmount: 250000000,
      defaultAmount: 10000000,
      stepAmount: 500000,
      rate: 8.90,
      minTenure: 3,
      maxTenure: 20,
      defaultTenure: 15,
      rateBadge: "From 8.90%* p.a.",
      amountBadge: "Up to ₹25 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/loan-against-property-02-desktop.webp",
        alt: "Commercial property owner in modern building",
        badge: "🏢 High Loan-To-Value (LTV) Sanctions",
        title: "Unlock High-Ticket Capital Against Residential or Commercial Property",
        highlight: "Keep Property Ownership Intact",
        description:
          "Mortgage fully constructed residential homes, commercial shops, or office units to raise up to ₹25 Crore at low secured interest rates starting at 8.90% p.a.",
        chips: ["From 8.90%* p.a.", "Tenure up to 20 Yrs", "Up to 75% LTV"],
        ctaText: "Check Property Loan Eligibility",
      },
    ],
    useCasesTitle: "Versatile Business & Personal Uses of",
    useCasesSubtitle: "Loan Against Property",
    useCases: [
      {
        id: "business-expansion",
        title: "Business Growth & Capital Expenditure",
        headline: "Inject Large Scale Capital into Operations or New Outlets",
        badge: "Business Growth",
        image: "/assets/loan-banners/rendered/loan-against-property-02-desktop.webp",
        alt: "Business owner office",
        amount: "Up to ₹25 Crore",
        tenure: "Up to 20 Years",
        rate: "From 8.90%* p.a.",
        desc: "Rather than taking high-cost unsecured business loans with short 3-year tenures, LAP offers 15-to-20 year repayment terms with half the monthly EMI burden.",
        benefits: [
          "Fund raw material purchases, machinery, or international business entry",
          "Lower interest rate compared to unsecured business financing",
          "Comfortable EMIs spread across up to 240 months",
          "Property usage rights stay 100% with the title owner",
        ],
        smartTip: "Mortgage commercial shops or office units for higher LTV allocations up to 75%.",
      },
    ],
    eligibilityTitle: "Loan Against Property Eligibility",
    eligibilitySubtitle: "Property types and borrower financial health evaluation.",
    eligibility: {
      column1: {
        categoryTitle: "Eligible Property Types",
        categorySubtitle: "Property status accepted by partner banks",
        iconName: "home",
        items: [
          { label: "Residential", desc: "Self-occupied or rented flats, independent houses, villas." },
          { label: "Commercial", desc: "Office spaces, retail shops, commercial buildings with clear title." },
          { label: "Industrial Plot", desc: "Select industrial units with municipal approval and clear access road." },
          { label: "Construction Status", desc: "Property must be 100% constructed with completion certificate." },
        ],
      },
      column2: {
        categoryTitle: "Borrower Financials",
        categorySubtitle: "Income and business vintage requirements",
        iconName: "briefcase",
        items: [
          { label: "Age Limit", desc: "23 to 70 years at loan maturity." },
          { label: "Business Vintage", desc: "Minimum 3 years active business or 2 years salaried employment." },
          { label: "Net Income", desc: "Sufficient cash flow to service requested LAP monthly installment." },
          { label: "CIBIL Score", desc: "700+ for standard processing; 750+ for maximum LTV." },
        ],
      },
    },
    features: [
      { title: "Up to 75% Property LTV", desc: "Unlock maximum cash value based on current fair market valuation.", highlight: "75% LTV", accent: "#8b5cf6" },
      { title: "20-Year Flexible Repayment", desc: "Keep monthly EMIs low compared to 3-5 year personal/business loans.", highlight: "20-Year Tenure", accent: "#0ea5e9" },
      { title: "Overdraft (OD) Facility Available", desc: "Pay interest only on withdrawn amounts with drop-line overdraft options.", highlight: "LAP Overdraft", accent: "#10b981" },
      { title: "Residential & Commercial Collateral", desc: "Accepts self-occupied homes, rented shops, office units, and plots.", highlight: "Multi-Property", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Property Title Documents",
        categorySubtitle: "Ownership and legal paperwork",
        items: [
          { title: "Registered Deed", desc: "Original sale deed, gift deed, or partition deed with complete parent chain" },
          { title: "Sanctioned Plan", desc: "Approved building map & municipal completion/occupancy certificate (CC/OC)" },
          { title: "Tax & EC Receipts", desc: "Past 13 to 30 years Encumbrance Certificate & latest property tax receipt" },
        ],
      },
      column2: {
        categoryTitle: "Financial & KYC Checklist",
        categorySubtitle: "Borrower profile documentation",
        items: [
          { title: "Identity Proof", desc: "PAN, Aadhaar Card, Passport, Partnership Deed/MOA for firms" },
          { title: "Financial Statements", desc: "3 years audited ITR, P&L statement, Balance sheet, 12-month bank statements" },
        ],
      },
    },
  },

  "construction-loan": {
    slug: "construction-loan",
    title: "Construction Loan",
    categoryLabel: "Home & Property",
    range: {
      minAmount: 500000,
      maxAmount: 100000000,
      defaultAmount: 4000000,
      stepAmount: 100000,
      rate: 8.40,
      minTenure: 5,
      maxTenure: 30,
      defaultTenure: 20,
      rateBadge: "From 8.40%* p.a.",
      amountBadge: "Up to ₹10 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/home-loan-01-desktop.webp",
        alt: "Residential home construction in progress",
        badge: "🏗️ Staged Construction Tranche Disbursal",
        title: "Build Your Custom Independent Home on Owned Plot",
        highlight: "Pay Interest Only as Building Progresses",
        description:
          "Finance stage-by-stage residential home construction with pre-approved architect estimates, 30-year flexible tenures, and competitive rates from 8.40% p.a.",
        chips: ["From 8.40%* p.a.", "Stage-Wise Release", "Up to 30 Yrs"],
        ctaText: "Check Construction Sanction Limit",
      },
    ],
    useCasesTitle: "Construction Loan Options for Every",
    useCasesSubtitle: "Building Stage",
    useCases: [
      {
        id: "self-construction",
        title: "Self-Construction on Owned Land",
        headline: "Build Independent Duplex or Villa Step-by-Step",
        badge: "Custom Building",
        image: "/assets/loan-banners/rendered/home-loan-01-desktop.webp",
        alt: "Villa construction",
        amount: "Up to ₹10 Crore",
        tenure: "5 to 30 Years",
        rate: "From 8.40%* p.a.",
        desc: "Disbursement happens in 4 to 5 tranches (Plinth, Slab, Masonry, Finishing) following physical verification by bank engineers.",
        benefits: [
          "Pre-sanction letter issued upfront for entire estimated building cost",
          "Pay Pre-EMI interest only on actual released funds",
          "Full tax exemption under Section 24(b) once construction finishes",
          "Tenures up to 30 years keep EMIs light after handover",
        ],
        smartTip: "Maintain certified architect bills and site photos for instant tranche approval.",
      },
    ],
    eligibilityTitle: "Construction Loan Eligibility Rules",
    eligibilitySubtitle: "Land title verification and structural estimate requirements.",
    eligibility: {
      column1: {
        categoryTitle: "Plot & Plan Eligibility",
        categorySubtitle: "Land and building approvals required",
        iconName: "home",
        items: [
          { label: "Plot Ownership", desc: "Plot must be fully owned or purchased simultaneously with loan." },
          { label: "Municipal Plan", desc: "Approved building plan from municipal body / Gram Panchayat (where permitted)." },
          { label: "Architect Estimate", desc: "Detailed construction estimate certified by a registered Civil Engineer/Architect." },
        ],
      },
      column2: {
        categoryTitle: "Borrower Financials",
        categorySubtitle: "Income and age guidelines",
        iconName: "building",
        items: [
          { label: "Age", desc: "21 to 65 years at loan completion." },
          { label: "Monthly Income", desc: "Minimum ₹25,000 net monthly salary or 2-yr business ITR." },
          { label: "CIBIL Score", desc: "720+ for instant tranche release." },
        ],
      },
    },
    features: [
      { title: "Stage-Wise Tranche Release", desc: "Funds released as Foundation, Slab, Brickwork & Finishing complete.", highlight: "Staged Release", accent: "#8b5cf6" },
      { title: "Pre-EMI Interest Relief", desc: "Pay interest only on funds disbursed during building phase.", highlight: "Pre-EMI Only", accent: "#0ea5e9" },
      { title: "30-Year Extended Tenure", desc: "Convert to regular full EMI only after house construction completes.", highlight: "30-Yr Horizon", accent: "#10b981" },
      { title: "Architect Valuation Support", desc: "Doorstep site inspection by empaneled structural engineers.", highlight: "Empaneled Check", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Construction & Land Papers",
        categorySubtitle: "Technical verification documents",
        items: [
          { title: "Plot Sale Deed", desc: "Registered land purchase deed and mother title chain" },
          { title: "Approved Map", desc: "Blueprints sanctioned by local municipal development authority" },
          { title: "Cost Estimate", desc: "Architect-certified itemized construction budget" },
        ],
      },
      column2: {
        categoryTitle: "KYC & Income Proof",
        categorySubtitle: "Borrower identity documents",
        items: [
          { title: "Personal KYC", desc: "PAN Card, Aadhaar Card, Passport/Voter ID" },
          { title: "Financials", desc: "Latest 3-mo pay slips & 6-mo bank statement or 2-yr ITR" },
        ],
      },
    },
  },

  "commercial-purchases-loan": {
    slug: "commercial-purchases-loan",
    title: "Commercial Property Loan",
    categoryLabel: "Home & Property",
    range: {
      minAmount: 1500000,
      maxAmount: 200000000,
      defaultAmount: 15000000,
      stepAmount: 500000,
      rate: 9.15,
      minTenure: 3,
      maxTenure: 15,
      defaultTenure: 12,
      rateBadge: "From 9.15%* p.a.",
      amountBadge: "Up to ₹20 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/commercial-purchases-loan-01-desktop.webp",
        alt: "Commercial office space in business district",
        badge: "🏢 Retail Shops, Offices & Warehouses",
        title: "Buy Commercial Office Space, Showrooms & Shops",
        highlight: "Up to 75% LTV Commercial Financing",
        description:
          "Expand your business footprint or earn high rental yields with dedicated commercial property loans. Rates starting from 9.15% p.a. with tenures up to 15 years.",
        chips: ["From 9.15%* p.a.", "Tenure up to 15 Yrs", "Up to 75% LTV"],
        ctaText: "Check Commercial Loan Offers",
      },
    ],
    useCasesTitle: "Commercial Real Estate Purchase Use Cases",
    useCasesSubtitle: "Designed for business owners, corporate entities & investors.",
    useCases: [
      {
        id: "office-purchase",
        title: "Self-Occupied Office & Showroom",
        headline: "Own Your Business Premises Instead of Paying Heavy Monthly Rent",
        badge: "Asset Building",
        image: "/assets/loan-banners/rendered/commercial-purchases-loan-01-desktop.webp",
        alt: "Modern office interior",
        amount: "Up to ₹20 Crore",
        tenure: "Up to 15 Years",
        rate: "From 9.15%* p.a.",
        desc: "Convert monthly rental expenses into long-term commercial property equity with tax-deductible interest benefits for your business firm.",
        benefits: [
          "Financing for ready-to-move & under-construction commercial units",
          "Property appreciation builds substantial business net worth",
          "Interest paid is deductible as legitimate business operating expense",
          "Flexible repayment tenures up to 15 years",
        ],
        smartTip: "Route rental income through current accounts to boost bank eligibility.",
      },
    ],
    eligibilityTitle: "Commercial Loan Eligibility Guidelines",
    eligibilitySubtitle: "Requirements for business firms and individual investors.",
    eligibility: {
      column1: {
        categoryTitle: "Business Entities",
        categorySubtitle: "Proprietorships, Partnerships, Pvt Ltd, LLPs",
        iconName: "briefcase",
        items: [
          { label: "Vintage", desc: "Minimum 3 years operational history with positive net profits." },
          { label: "Turnover", desc: "Annual turnover of ₹30 Lakhs+ reflecting clean current account banking." },
          { label: "CIBIL Rank / Score", desc: "CMR score of 1 to 3 or individual CIBIL of 720+." },
        ],
      },
      column2: {
        categoryTitle: "Salaried Investors",
        categorySubtitle: "High net-worth individuals buying for rental yield",
        iconName: "building",
        items: [
          { label: "Net Salary", desc: "Minimum ₹75,000/month net takeaway." },
          { label: "Age", desc: "25 to 65 years at loan completion." },
          { label: "CIBIL Score", desc: "730+ required." },
        ],
      },
    },
    features: [
      { title: "Up to 75% Commercial LTV", desc: "Finance up to 75% of agreement value or market valuation.", highlight: "75% LTV", accent: "#8b5cf6" },
      { title: "Tax Deductible Operating Expense", desc: "Interest payments written off against business taxable revenues.", highlight: "Tax Saving", accent: "#0ea5e9" },
      { title: "Rental Discounting (LRD) Option", desc: "Monetize existing commercial lease agreements for instant cash.", highlight: "LRD Eligible", accent: "#10b981" },
      { title: "15-Year Repayment Horizon", desc: "Spreads out commercial capital expenditure over 180 months.", highlight: "15-Yr Tenure", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Business & Financial Papers",
        categorySubtitle: "Firm registration and banking proofs",
        items: [
          { title: "Business KYC", desc: "GST Certificate, PAN of firm, MOA/AOA or Partnership Deed" },
          { title: "Audited Financials", desc: "3 years ITR, CA-certified P&L statement, Balance sheet, Audit report" },
          { title: "Banking", desc: "12 months current account bank statements" },
        ],
      },
      column2: {
        categoryTitle: "Commercial Property Papers",
        categorySubtitle: "Legal title verification",
        items: [
          { title: "Agreement to Sell", desc: "Draft sale agreement with builder/seller showing total consideration" },
          { title: "Approved Commercial Layout", desc: "Commercial zone municipal approval map and OC" },
        ],
      },
    },
  },

  "business-loan": {
    slug: "business-loan",
    title: "Business Loan",
    categoryLabel: "Business Loans",
    range: {
      minAmount: 100000,
      maxAmount: 10000000,
      defaultAmount: 1500000,
      stepAmount: 50000,
      rate: 11.99,
      minTenure: 1,
      maxTenure: 5,
      defaultTenure: 3,
      rateBadge: "From 11.99%* p.a.",
      amountBadge: "Collateral-free up to ₹1 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/business-loan-02-desktop.webp",
        alt: "Successful Indian entrepreneur in modern warehouse",
        badge: "💼 Collateral-Free Business Capital",
        title: "Unsecured Business Loans up to ₹1 Crore",
        highlight: "Fast Disbursal in 48 Hours",
        description:
          "Fuel business expansion, stock seasonal inventory, or upgrade machinery with zero asset hypothecation. Simple GST and bank statement based approval.",
        chips: ["From 11.99%* p.a.", "Zero Collateral", "Tenure up to 5 Yrs"],
        ctaText: "Check Business Sanction",
      },
    ],
    useCasesTitle: "Tailored Financing for Every Business",
    useCasesSubtitle: "Growth Requirement",
    useCases: [
      {
        id: "working-capital-need",
        title: "Working Capital & Cash Flow Management",
        headline: "Bridge Vendor Payment Gaps & Manage Operational Payroll",
        badge: "Cashflow Booster",
        image: "/assets/loan-banners/rendered/business-loan-02-desktop.webp",
        alt: "Business owner at desk",
        amount: "Up to ₹1 Crore",
        tenure: "1 to 5 Years",
        rate: "From 11.99%* p.a.",
        desc: "Ensure seamless operational cash flow during peak sales cycles, pay supplier invoices early for cash discounts, and manage employee salaries.",
        benefits: [
          "Zero asset mortgage required",
          "GST return and bank banking statement based instant limit",
          "Direct credit to company current account within 48 hours",
          "Tax deductible interest expense under Income Tax Act",
        ],
        smartTip: "Submit 12 months of clean GST returns to unlock preferential interest rates.",
      },
    ],
    eligibilityTitle: "Business Loan Eligibility Criteria",
    eligibilitySubtitle: "Simple evaluation based on business turnover and GST returns.",
    eligibility: {
      column1: {
        categoryTitle: "Business Profile",
        categorySubtitle: "Minimum operational standards",
        iconName: "briefcase",
        items: [
          { label: "Business Vintage", desc: "Minimum 2 years of continuous business operations." },
          { label: "Annual Turnover", desc: "Minimum ₹20 Lakhs annual turnover reported in GST/ITR." },
          { label: "Business Type", desc: "Proprietorship, Partnership, Pvt Ltd, LLP, or Public Ltd." },
          { label: "CIBIL / CMR", desc: "Individual CIBIL 700+ or CIBIL Rank (CMR) 1 to 4." },
        ],
      },
      column2: {
        categoryTitle: "Promoter Profile",
        categorySubtitle: "Age and background criteria",
        iconName: "building",
        items: [
          { label: "Promoter Age", desc: "24 to 65 years at loan maturity." },
          { label: "Banking Track", desc: "No cheque bounces or NACH bounce in 6-mo bank statement." },
          { label: "Ownership Proof", desc: "Owned office or residence proof required." },
        ],
      },
    },
    features: [
      { title: "100% Unsecured Capital", desc: "Borrow up to ₹1 Crore without pledging land, machinery, or FD.", highlight: "Zero Collateral", accent: "#8b5cf6" },
      { title: "Banking & GST Based Sanction", desc: "Algorithms analyze GST returns and bank cash flow for instant approval.", highlight: "GST Approved", accent: "#0ea5e9" },
      { title: "Flexible 1 to 5 Year Tenures", desc: "Structure monthly installments to match your seasonal revenue cycles.", highlight: "1 to 5 Yrs", accent: "#10b981" },
      { title: "Overdraft (OD) Line Option", desc: "Pay interest only on funds withdrawn from your sanctioned credit limit.", highlight: "OD Option", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Business Proofs",
        categorySubtitle: "Entity verification documents",
        items: [
          { title: "Registration", desc: "GST Certificate, Shop & Establishment license, MSME Udyam" },
          { title: "GST Returns", desc: "Latest 12 months GST 3B & 1A returns" },
          { title: "Banking", desc: "Latest 12 months current account bank statements (PDF format)" },
        ],
      },
      column2: {
        categoryTitle: "Financial Statements & KYC",
        categorySubtitle: "Audited balance sheet paperwork",
        items: [
          { title: "2-Yr Financials", desc: "Audited P&L statement, Balance sheet, Computation of Income, CA report" },
          { title: "Promoter KYC", desc: "PAN Card & Aadhaar Card of all partners/directors" },
        ],
      },
    },
  },

  "working-capital-loan": {
    slug: "working-capital-loan",
    title: "Working Capital Loan",
    categoryLabel: "Business Loans",
    range: {
      minAmount: 500000,
      maxAmount: 150000000,
      defaultAmount: 2500000,
      stepAmount: 100000,
      rate: 10.99,
      minTenure: 1,
      maxTenure: 3,
      defaultTenure: 1,
      rateBadge: "From 10.99%* p.a.",
      amountBadge: "Up to ₹15 Crore Cash Credit / OD",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/working-capital-loan-01-desktop.webp",
        alt: "Manufacturing inventory warehouse",
        badge: "🔄 Revolving Credit Line / Cash Credit",
        title: "Maintain Smooth Inventory & Supplier Payment Cycles",
        highlight: "Pay Interest Only on Utilized Limit",
        description:
          "Bridge receivables gaps, procure bulk raw materials, and optimize liquidity with revolving Cash Credit (CC) and Overdraft (OD) working capital limits.",
        chips: ["From 10.99%* p.a.", "Pay Interest on Usage", "Annual Renewal"],
        ctaText: "Calculate Working Capital Limit",
      },
    ],
    useCasesTitle: "Working Capital Uses for Growing",
    useCasesSubtitle: "Enterprises",
    useCases: [
      {
        id: "inventory-purchase",
        title: "Bulk Inventory & Raw Material Procurement",
        headline: "Negotiate Cash Discounts from Suppliers with Ready Funds",
        badge: "Supplier Advantage",
        image: "/assets/loan-banners/rendered/working-capital-loan-01-desktop.webp",
        alt: "Warehouse stock management",
        amount: "Up to ₹15 Crore",
        tenure: "Revolving 12 Months",
        rate: "From 10.99%* p.a.",
        desc: "Procure raw materials in bulk during discount windows without locking up operating equity.",
        benefits: [
          "Revolving facility renewed annually",
          "Pay interest strictly on daily utilized balance, not full limit",
          "Saves up to 5-10% through upfront cash payment discounts to vendors",
          "Combined Cash Credit & Bank Guarantee (BG) limits available",
        ],
        smartTip: "Deposit daily sales proceeds back into the CC account to reduce net daily interest.",
      },
    ],
    eligibilityTitle: "Working Capital Eligibility Criteria",
    eligibilitySubtitle: "Calculated using inventory turnover, debtors, and current ratio.",
    eligibility: {
      column1: {
        categoryTitle: "Operational Metrics",
        categorySubtitle: "Financial ratios evaluated by lenders",
        iconName: "briefcase",
        items: [
          { label: "Turnover Method", desc: "Limit calculated as 20% to 25% of projected annual sales turnover." },
          { label: "Current Ratio", desc: "Ideal current ratio of 1.33:1 reflecting healthy short-term solvency." },
          { label: "Stock & Debtors", desc: "Hypothecation of stock & book debts under 90 days." },
        ],
      },
      column2: {
        categoryTitle: "Firm Profile",
        categorySubtitle: "Entity vintage and banking track",
        iconName: "building",
        items: [
          { label: "Vintage", desc: "Minimum 3 years audited business operations." },
          { label: "Banking Track", desc: "Clean current account banking with strong monthly summation." },
          { label: "CIBIL / CMR", desc: "CIBIL score 720+ or CMR 1 to 4." },
        ],
      },
    },
    features: [
      { title: "Pay Interest Only on Usage", desc: "Calculated daily on actual utilized balance, zero interest on unused limit.", highlight: "Daily Interest", accent: "#8b5cf6" },
      { title: "Revolving 12-Month Limits", desc: "Sanctioned for 1 year with hassle-free annual renewal based on performance.", highlight: "Annual Renewal", accent: "#0ea5e9" },
      { title: "Cash Credit (CC) & Overdraft (OD)", desc: "Tailored structure combining book debt financing and inventory hypothecation.", highlight: "CC/OD Hybrid", accent: "#10b981" },
      { title: "Non-Fund Based Limits Available", desc: "Add Bank Guarantee (BG) and Letter of Credit (LC) for international trade.", highlight: "LC / BG Limits", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Financial & Ratio Statements",
        categorySubtitle: "Working capital audit documents",
        items: [
          { title: "Stock & Debtor Audit", desc: "Latest Monthly Stock Statement and Debtors Aging Report" },
          { title: "3-Yr Financials", desc: "Audited P&L, Balance sheet, CA audit report, tax audit form 3CA/3CB" },
        ],
      },
      column2: {
        categoryTitle: "Banking & GST Records",
        categorySubtitle: "Real-time cashflow verification",
        items: [
          { title: "Current Account", desc: "12 months bank statement for all operational current accounts" },
          { title: "GST Returns", desc: "12 months GSTR-3B & GSTR-1 filings" },
        ],
      },
    },
  },

  "machinery-loan": {
    slug: "machinery-loan",
    title: "Machinery Loan",
    categoryLabel: "Business Loans",
    range: {
      minAmount: 500000,
      maxAmount: 100000000,
      defaultAmount: 5000000,
      stepAmount: 100000,
      rate: 9.50,
      minTenure: 2,
      maxTenure: 7,
      defaultTenure: 5,
      rateBadge: "From 9.50%* p.a.",
      amountBadge: "Up to 90% Machinery Cost",
    },
    slides: [
      {
        image: "/assets/insurance-banners/source/machinery-protection.png",
        alt: "Industrial CNC machinery in modern factory",
        badge: "⚙️ Equipment & Plant Modernization",
        title: "Finance CNC, Medical, Printing & Heavy Industrial Equipment",
        highlight: "Hypothecate Equipment as Collateral",
        description:
          "Upgrade manufacturing capacity or acquire imported machinery with up to 90% LTV equipment financing. Competitive rates starting at 9.50% p.a. with 7-year tenures.",
        chips: ["From 9.50%* p.a.", "Up to 90% LTV", "Tenure up to 7 Yrs"],
        ctaText: "Check Machinery Loan Rate",
      },
    ],
    useCasesTitle: "Industrial Machinery Financing for",
    useCasesSubtitle: "Manufacturing Sector",
    useCases: [
      {
        id: "plant-upgrade",
        title: "CNC & Precision Machine Installation",
        headline: "Scale Manufacturing Output with Cutting-Edge Machinery",
        badge: "Capacity Booster",
        image: "/assets/insurance-banners/source/machinery-protection.png",
        alt: "Industrial machinery",
        amount: "Up to ₹10 Crore",
        tenure: "2 to 7 Years",
        rate: "From 9.50%* p.a.",
        desc: "Purchase new or imported machinery. The machine itself acts as primary collateral, eliminating the need to mortgage personal property.",
        benefits: [
          "Up to 90% funding of invoice cost including GST & custom duties",
          "Tax depreciation benefits claimed directly by your business firm",
          "Extended 7-year tenure keeps monthly equipment EMIs manageable",
          "Direct proforma invoice payment to machine manufacturer",
        ],
        smartTip: "Include installation and custom clearance costs in proforma invoice for full loan coverage.",
      },
    ],
    eligibilityTitle: "Machinery Loan Eligibility Criteria",
    eligibilitySubtitle: "Technical and financial criteria evaluated by equipment lenders.",
    eligibility: {
      column1: {
        categoryTitle: "Equipment Criteria",
        categorySubtitle: "Machine specification guidelines",
        iconName: "briefcase",
        items: [
          { label: "Machine Type", desc: "New CNC, offset printing, medical imaging, textile, plastic molding, packaging equipment." },
          { label: "Manufacturer", desc: "Procured from reputed OEM (Original Equipment Manufacturer) or authorized distributor." },
          { label: "Collateral", desc: "Hypothecation of the machinery being purchased." },
        ],
      },
      column2: {
        categoryTitle: "Manufacturer / Firm Vintage",
        categorySubtitle: "Business operational track record",
        iconName: "building",
        items: [
          { label: "Vintage", desc: "Minimum 2 years active manufacturing operations." },
          { label: "Cash Accrual", desc: "Positive Net Cash Accruals (PAT + Depreciation) to service EMI." },
          { label: "CIBIL / CMR", desc: "Score 700+ or CMR 1 to 4." },
        ],
      },
    },
    features: [
      { title: "Up to 90% Machine Cost Financed", desc: "Minimal margin money required; covers machine price, GST, and shipping.", highlight: "90% Funding", accent: "#8b5cf6" },
      { title: "No Separate Land Property Required", desc: "Hypothecation of purchased equipment serves as primary collateral.", highlight: "Equipment Security", accent: "#0ea5e9" },
      { title: "100% Tax Depreciation Relief", desc: "Claim annual capital asset depreciation under Section 32 of Income Tax Act.", highlight: "Tax Benefits", accent: "#10b981" },
      { title: "Repayment up to 84 Months", desc: "Long 7-year amortization matches machine useful production life.", highlight: "7-Year Tenure", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Machinery Technical Documents",
        categorySubtitle: "Vendor and specification paperwork",
        items: [
          { title: "Proforma Invoice", desc: "Official price quote from OEM/Dealer with GST breakup and machine model" },
          { title: "Technical Spec Sheet", desc: "Machine brochure, power rating, and production capacity details" },
        ],
      },
      column2: {
        categoryTitle: "Business Financial Papers",
        categorySubtitle: "Standard entity KYC & financials",
        items: [
          { title: "Entity KYC", desc: "GST registration, Udyam MSME certificate, PAN Card of firm" },
          { title: "Financials", desc: "2 years audited ITR, P&L, balance sheet, 6-mo bank statement" },
        ],
      },
    },
  },

  "od-loan": {
    slug: "od-loan",
    title: "Overdraft (OD) Loan",
    categoryLabel: "Business Loans",
    range: {
      minAmount: 200000,
      maxAmount: 50000000,
      defaultAmount: 2000000,
      stepAmount: 100000,
      rate: 10.50,
      minTenure: 1,
      maxTenure: 5,
      defaultTenure: 1,
      rateBadge: "From 10.50%* p.a.",
      amountBadge: "Up to ₹5 Crore Drop-line OD",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/od-loan-01-desktop.webp",
        alt: "Overdraft credit limit dashboard",
        badge: "💳 Pre-Approved Credit Limit Buffer",
        title: "Sanctioned Overdraft Buffer for Urgent Business Expenses",
        highlight: "Zero Interest When Unused",
        description:
          "Approved credit line linked directly to your business current account. Withdraw cash anytime, repay freely, and pay interest strictly for the exact days utilized.",
        chips: ["From 10.50%* p.a.", "Pay on Utilization", "Zero Prepayment Fee"],
        ctaText: "Check Overdraft Limit",
      },
    ],
    useCasesTitle: "Smart Cash Flow Protection with",
    useCasesSubtitle: "Overdraft (OD) Line",
    useCases: [
      {
        id: "emergency-buffer",
        title: "Unforeseen Business Emergency Buffer",
        headline: "Never Miss Vendor Payments or Cheque Clearances",
        badge: "Instant Liquidity",
        image: "/assets/loan-banners/rendered/od-loan-01-desktop.webp",
        alt: "Financial management",
        amount: "Up to ₹5 Crore",
        tenure: "Revolving 12-Month",
        rate: "From 10.50%* p.a.",
        desc: "Maintain a standby credit buffer. If cash stays in your account, your interest cost is exactly ₹0.",
        benefits: [
          "Zero interest charged on sanctioned but un-drawn limit",
          "Automated sweep-in & sweep-out linked to current account",
          "Prevents cheque bounces and Maintains 100% vendor trust",
          "Drop-line OD option gradually reduces principal over 36-60 months",
        ],
        smartTip: "Link your primary current account to automatically offset daily closing balances against OD.",
      },
    ],
    eligibilityTitle: "Overdraft Eligibility Criteria",
    eligibilitySubtitle: "Assessed on monthly current account turnover & banking credits.",
    eligibility: {
      column1: {
        categoryTitle: "Banking Track",
        categorySubtitle: "Current account transaction volume",
        iconName: "briefcase",
        items: [
          { label: "Account Vintage", desc: "Minimum 1 year active current account with prime bank." },
          { label: "Monthly Summation", desc: "Average Monthly Balance (AMB) & credit summation of ₹3 Lakhs+." },
          { label: "Cheque Bounces", desc: "Zero inward outward cheque returns due to financial insufficiency." },
        ],
      },
      column2: {
        categoryTitle: "Business Profile",
        categorySubtitle: "Turnover & CIBIL standards",
        iconName: "building",
        items: [
          { label: "Vintage", desc: "Minimum 2 years active business operations." },
          { label: "CIBIL Score", desc: "720+ required for unsecured OD up to ₹50 Lakhs." },
          { label: "Property Security", desc: "Secured OD available for limits above ₹50 Lakhs at lower interest." },
        ],
      },
    },
    features: [
      { title: "Zero Interest When Un-drawn", desc: "You only pay interest for the exact hours/days cash is withdrawn.", highlight: "Zero Idle Fee", accent: "#8b5cf6" },
      { title: "Unlimited Withdrawals & Repayments", desc: "Deposit collections back anytime to instantly reset your credit limit.", highlight: "Flexible Reuse", accent: "#0ea5e9" },
      { title: "Drop-Line OD Structure Available", desc: "Limit reduces step-by-step each month to ensure gradual debt payoff.", highlight: "Drop-Line Option", accent: "#10b981" },
      { title: "Unsecured OD up to ₹50 Lakhs", desc: "No collateral required for established current account holders.", highlight: "Unsecured Buffer", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Banking & GST Proofs",
        categorySubtitle: "Transaction track records",
        items: [
          { title: "Current Bank Statement", desc: "12 months bank statement of primary operational account (PDF)" },
          { title: "GST Returns", desc: "Latest 12 months GST-3B filings" },
        ],
      },
      column2: {
        categoryTitle: "Business KYC & Financials",
        categorySubtitle: "Standard entity registration",
        items: [
          { title: "Firm Registration", desc: "GST certificate, PAN Card of firm/promoter, Partnership deed/MOA" },
          { title: "Financials", desc: "2 years ITR with computation & balance sheet" },
        ],
      },
    },
  },

  "agriculture-loan": {
    slug: "agriculture-loan",
    title: "Agriculture & Farming Loan",
    categoryLabel: "Business Loans",
    range: {
      minAmount: 100000,
      maxAmount: 20000000,
      defaultAmount: 1000000,
      stepAmount: 50000,
      rate: 7.00,
      minTenure: 1,
      maxTenure: 7,
      defaultTenure: 3,
      rateBadge: "From 7.00%* p.a.",
      amountBadge: "Kisan Credit Card (KCC) & Farm Equipment",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/agriculture-loan-01-desktop.webp",
        alt: "Indian farmer in lush agricultural field",
        badge: "🌾 Kisan Credit Card & Farm Equipment",
        title: "Finance Crop Cycles, Solar Pumps & Heavy Tractors",
        highlight: "Seasonal Bullet & Half-Yearly Repayment",
        description:
          "Tailored financing for Indian farmers and agri-entrepreneurs. Repay EMIs aligned directly with post-harvest crop selling cycles. Rates from 7.00% p.a.",
        chips: ["From 7.00%* p.a.", "Harvest EMI Alignment", "Tractor & Solar Pump"],
        ctaText: "Check Agri Loan Eligibility",
      },
    ],
    useCasesTitle: "Agri-Financing for Farm Productivity &",
    useCasesSubtitle: "Infrastructure",
    useCases: [
      {
        id: "crop-cycle",
        title: "Kisan Crop Cycle & Input Finance",
        headline: "Purchase Seeds, Fertilizers, Micro-Irrigation & Pesticides",
        badge: "Seasonal Harvest EMI",
        image: "/assets/loan-banners/rendered/agriculture-loan-01-desktop.webp",
        alt: "Farmer in agricultural field",
        amount: "Up to ₹50 Lakhs",
        tenure: "1 to 3 Years",
        rate: "From 7.00%* p.a.",
        desc: "Kisan Credit Card (KCC) mechanism allows farmers to draw funds for seasonal sowing and pay back principal + interest after harvesting crop yields.",
        benefits: [
          "Repayment structured on Kharif & Rabi crop selling months",
          "Low interest starting at 7.00% p.a. with interest subvention benefits",
          "Covers seeds, labor charges, diesel, fertilizers & drip irrigation",
          "Minimal land revenue documentation required",
        ],
        smartTip: "Repay interest on time to avail 3% prompt repayment interest subvention.",
      },
    ],
    eligibilityTitle: "Agriculture Loan Eligibility Criteria",
    eligibilitySubtitle: "Landholding ownership and agricultural income guidelines.",
    eligibility: {
      column1: {
        categoryTitle: "Landholding Farmer",
        categorySubtitle: "Owner-cultivators and tenant farmers",
        iconName: "tractor",
        items: [
          { label: "Land Proof", desc: "Owner of agricultural land (7/12 extract, 8A, Khasra/Khatoni)." },
          { label: "Tenant / Sharecropper", desc: "Oral lessees & tenant farmers with valid cropping agreement." },
          { label: "Age", desc: "18 to 70 years." },
        ],
      },
      column2: {
        categoryTitle: "Agri-Business & Allied Activities",
        categorySubtitle: "Dairy, Poultry, Fishery & Agri-Clinics",
        iconName: "briefcase",
        items: [
          { label: "Allied Sectors", desc: "Dairy farmers, poultry owners, goat farming, cold storage units." },
          { label: "Income Proof", desc: "Milk supply receipts, agri-trading bank statements, or crop sales bills." },
          { label: "CIBIL Score", desc: "680+ acceptable." },
        ],
      },
    },
    features: [
      { title: "Harvest-Linked Repayment", desc: "Pay EMIs semi-annually or annually when crops are harvested and sold in Mandi.", highlight: "Crop-Synced EMI", accent: "#8b5cf6" },
      { title: "Subsidized 7.00% Interest Rate", desc: "Concessional rates for agricultural producers with prompt repayment rewards.", highlight: "7% KCC Rate", accent: "#0ea5e9" },
      { title: "Tractor & Machinery Funding", desc: "Finance new tractors, harvesters, solar pumps, and tiller equipment up to 85% LTV.", highlight: "Tractor Finance", accent: "#10b981" },
      { title: "Zero Prepayment Charges", desc: "Prepay loan balances anytime after receiving crop harvest payments without penalty.", highlight: "Zero Penalty", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Land Revenue Records",
        categorySubtitle: "Agricultural title verification",
        items: [
          { title: "7/12 & Khasra Extract", desc: "Latest certified land title record from Tehsildar/Patwari" },
          { title: "No-Dues Certificate", desc: "NOC from local primary agricultural co-operative society (PACS)" },
        ],
      },
      column2: {
        categoryTitle: "Farmer KYC & Bank Details",
        categorySubtitle: "Personal identification",
        items: [
          { title: "Personal KYC", desc: "Aadhaar Card, Voter ID, PAN Card / Form 60" },
          { title: "Banking Proof", desc: "Passbook copy / 6-mo bank statement of savings account" },
        ],
      },
    },
  },

  "car-loan": {
    slug: "car-loan",
    title: "New Car Loan",
    categoryLabel: "Vehicle Loans",
    range: {
      minAmount: 100000,
      maxAmount: 20000000,
      defaultAmount: 1000000,
      stepAmount: 50000,
      rate: 8.75,
      minTenure: 1,
      maxTenure: 8,
      defaultTenure: 5,
      rateBadge: "From 8.75%* p.a.",
      amountBadge: "Up to 100% On-Road Price",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/car-loan-01-desktop.webp",
        alt: "Brand new SUV luxury car in showroom",
        badge: "🚘 100% On-Road Price Financing",
        title: "Drive Home Your Dream Car with Instant Sanctions",
        highlight: "Zero Downpayment Options for Prime Applicants",
        description:
          "Finance any new sedan, SUV, or Electric Vehicle (EV) with 100% on-road price funding (covering registration & insurance). Tenures up to 8 years starting at 8.75% p.a.",
        chips: ["From 8.75%* p.a.", "100% On-Road Funding", "Tenure up to 8 Yrs"],
        ctaText: "Calculate Car EMI & Apply",
      },
    ],
    useCasesTitle: "Car Loan Features for Every",
    useCasesSubtitle: "Vehicle Category",
    useCases: [
      {
        id: "electric-vehicle",
        title: "Electric Vehicles (EV) & Luxury SUVs",
        headline: "Special Reduced Rates for Green EV Car Purchases",
        badge: "EV Special Rate",
        image: "/assets/loan-banners/rendered/car-loan-01-desktop.webp",
        alt: "Electric SUV charging",
        amount: "Up to ₹2 Crore",
        tenure: "1 to 8 Years",
        rate: "From 8.75%* p.a.",
        desc: "Save up to 0.50% on interest rates when purchasing approved Electric Vehicles (EVs) along with tax benefits under Section 80EEB.",
        benefits: [
          "100% on-road funding covering ex-showroom, RTO tax, and 3-yr insurance",
          "Extended 8-year (96 months) repayment tenure for lower EMIs",
          "Direct dealer disbursal within 24 hours of digital approval",
          "Pre-approved limits for existing corporate salaried professionals",
        ],
        smartTip: "Opt for 100% on-road price funding to keep personal savings intact.",
      },
    ],
    eligibilityTitle: "New Car Loan Eligibility Criteria",
    eligibilitySubtitle: "Simple evaluation for salaried and self-employed applicants.",
    eligibility: {
      column1: {
        categoryTitle: "Salaried Applicants",
        categorySubtitle: "Corporate & Government employees",
        iconName: "building",
        items: [
          { label: "Age Limit", desc: "21 to 65 years at loan completion." },
          { label: "Net Salary", desc: "Minimum ₹20,000/month net takeaway." },
          { label: "Work Experience", desc: "Minimum 1 year total experience with 6 months in current organization." },
          { label: "CIBIL Score", desc: "700+ for standard rates; 750+ for 100% on-road price." },
        ],
      },
      column2: {
        categoryTitle: "Self-Employed & Businesses",
        categorySubtitle: "Proprietors, Directors, Professionals",
        iconName: "briefcase",
        items: [
          { label: "Age Limit", desc: "21 to 70 years." },
          { label: "Income Proof", desc: "2 years ITR showing net income sufficient for requested car EMI." },
          { label: "Business Vintage", desc: "Minimum 2 years active business operations." },
          { label: "CIBIL Score", desc: "720+ required." },
        ],
      },
    },
    features: [
      { title: "Up to 100% On-Road Funding", desc: "Covers ex-showroom price, state RTO registration fees, and multi-year insurance.", highlight: "Zero Downpayment", accent: "#8b5cf6" },
      { title: "Extended 8-Year Repayments", desc: "Spread car cost over 96 months to minimize monthly budget impact.", highlight: "8-Yr Tenure", accent: "#0ea5e9" },
      { title: "EV Discounted Interest Rates", desc: "Special interest concessions for purchasing Electric Cars under green initiatives.", highlight: "EV Discount", accent: "#10b981" },
      { title: "Direct Showroom Disbursal", desc: "Sanction letter sent straight to car dealership for immediate delivery.", highlight: "Fast Delivery", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Personal KYC & Income",
        categorySubtitle: "Standard borrower papers",
        items: [
          { title: "Personal KYC", desc: "PAN Card, Aadhaar Card, Passport, or Driving License" },
          { title: "Income Proof", desc: "3 months salary slips & 6-mo bank statement or 2 years ITR" },
        ],
      },
      column2: {
        categoryTitle: "Vehicle Quotation",
        categorySubtitle: "Car dealer paperwork",
        items: [
          { title: "Proforma Invoice", desc: "Official price quotation from authorized car dealership showing on-road cost" },
        ],
      },
    },
  },

  "used-car-loan": {
    slug: "used-car-loan",
    title: "Used / Pre-Owned Car Loan",
    categoryLabel: "Vehicle Loans",
    range: {
      minAmount: 100000,
      maxAmount: 5000000,
      defaultAmount: 600000,
      stepAmount: 25000,
      rate: 11.25,
      minTenure: 1,
      maxTenure: 5,
      defaultTenure: 3,
      rateBadge: "From 11.25%* p.a.",
      amountBadge: "Up to 85% of Car Valuation",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/used-car-loan-02-desktop.webp",
        alt: "Certified pre-owned luxury car inspection",
        badge: "🚘 Certified Pre-Owned Vehicle Loans",
        title: "Buy Pre-Owned Cars with Free Valuation & RC Transfer Assist",
        highlight: "Up to 85% Car Valuation Funding",
        description:
          "Finance certified pre-owned sedans and hatchbacks from dealers or individual sellers. Free doorstep vehicle valuation and hassle-free RTO RC transfer assistance.",
        chips: ["From 11.25%* p.a.", "Up to 85% Valuation", "RC Transfer Assist"],
        ctaText: "Check Used Car Loan Limit",
      },
    ],
    useCasesTitle: "Pre-Owned Car Financing Solutions",
    useCasesSubtitle: "Coverage for certified dealer & direct seller purchases.",
    useCases: [
      {
        id: "certified-preowned",
        title: "Certified Dealer & Direct Seller Used Cars",
        headline: "Upgrade to a Premium Sedan or SUV at Half the New Car Cost",
        badge: "RC Transfer Assist",
        image: "/assets/loan-banners/rendered/used-car-loan-02-desktop.webp",
        alt: "Preowned car inspection",
        amount: "Up to ₹50 Lakhs",
        tenure: "1 to 5 Years",
        rate: "From 11.25%* p.a.",
        desc: "Get digital loan sanctions for cars up to 10 years old. Free technical valuation determines maximum loan eligibility.",
        benefits: [
          "Up to 85% loan allocation based on bank empaneled technical valuation",
          "Coverage for vehicles purchased from Spinny, Cars24, or individual sellers",
          "Assisted RTO ownership transfer and hypothecation endorsement",
          "Tenures up to 5 years (60 months)",
        ],
        smartTip: "Choose cars under 5 years old for maximum loan-to-value percentage.",
      },
    ],
    eligibilityTitle: "Used Car Loan Eligibility Criteria",
    eligibilitySubtitle: "Guidelines based on vehicle age and applicant financial health.",
    eligibility: {
      column1: {
        categoryTitle: "Vehicle Eligibility",
        categorySubtitle: "Pre-owned car condition criteria",
        iconName: "car",
        items: [
          { label: "Vehicle Age", desc: "Car age must not exceed 10 years at loan completion." },
          { label: "Car Type", desc: "Hatchbacks, Sedans, MUVs, SUVs for personal or business use." },
          { label: "Valuation Check", desc: "Must pass bank empaneled physical vehicle inspection." },
        ],
      },
      column2: {
        categoryTitle: "Borrower Profile",
        categorySubtitle: "Income and CIBIL standards",
        iconName: "building",
        items: [
          { label: "Salaried Income", desc: "Minimum ₹20,000 net monthly income." },
          { label: "Self-Employed ITR", desc: "2 years ITR showing stable net profit." },
          { label: "CIBIL Score", desc: "700+ required for fast sanction." },
        ],
      },
    },
    features: [
      { title: "Up to 85% Valuation Financed", desc: "Loan amount calculated on professional fair market vehicle valuation.", highlight: "85% Valuation", accent: "#8b5cf6" },
      { title: "Free Doorstep Inspection", desc: "Empaneled technical evaluator inspects engine, body & RC authenticity.", highlight: "Free Valuation", accent: "#0ea5e9" },
      { title: "Assisted RTO Ownership Transfer", desc: "End-to-end support for NOC, Form 29/30 & RC hypothecation update.", highlight: "RC Support", accent: "#10b981" },
      { title: "Repayment up to 5 Years", desc: "Flexible tenures spread repayment over 12 to 60 months.", highlight: "5-Yr Tenure", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Car RC & Insurance Papers",
        categorySubtitle: "Vehicle registration documents",
        items: [
          { title: "Registration Certificate (RC)", desc: "Clear copy of original RC book / Smart card" },
          { title: "Valid Insurance Policy", desc: "Active comprehensive motor insurance copy" },
          { title: "Form 29 & 30", desc: "Signed RTO transfer forms from existing owner" },
        ],
      },
      column2: {
        categoryTitle: "Borrower KYC & Income",
        categorySubtitle: "Personal documentation",
        items: [
          { title: "Personal KYC", desc: "PAN Card, Aadhaar Card, Passport/Voter ID" },
          { title: "Income Proof", desc: "3 months pay slips & 6-mo bank statement or 2-yr ITR" },
        ],
      },
    },
  },

  "two-wheeler-loan": {
    slug: "two-wheeler-loan",
    title: "Two-Wheeler Loan",
    categoryLabel: "Vehicle Loans",
    range: {
      minAmount: 20000,
      maxAmount: 500000,
      defaultAmount: 100000,
      stepAmount: 5000,
      rate: 9.99,
      minTenure: 1,
      maxTenure: 4,
      defaultTenure: 2,
      rateBadge: "From 9.99%* p.a.",
      amountBadge: "Up to 95% On-Road Price",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/two-wheeler-loan-02-desktop.webp",
        alt: "Modern electric scooter and commuter motorcycle",
        badge: "🛵 Instant Two-Wheeler Approvals",
        title: "Ride Your Favorite Motorcycle or EV Scooter Today",
        highlight: "Approval in 15 Minutes with Aadhaar OTP",
        description:
          "Instant digital sanctions for sports bikes, scooters, and electric two-wheelers. Up to 95% on-road price funding with minimal documentation.",
        chips: ["From 9.99%* p.a.", "15-Minute Approval", "Up to 95% Funding"],
        ctaText: "Check Bike Loan Approval",
      },
    ],
    useCasesTitle: "Two-Wheeler Loan Options for Every",
    useCasesSubtitle: "Commuter & Rider",
    useCases: [
      {
        id: "ev-scooter",
        title: "Electric Scooters & Daily Motorcycles",
        headline: "Instant Paperless Financing for EV Scooters & Superbikes",
        badge: "15-Min Disbursal",
        image: "/assets/loan-banners/rendered/two-wheeler-loan-02-desktop.webp",
        alt: "Electric scooter charging",
        amount: "Up to ₹5 Lakhs",
        tenure: "1 to 4 Years",
        rate: "From 9.99%* p.a.",
        desc: "Get instant showroom sanctions using basic Aadhaar OTP e-KYC. Special lower rates for electric two-wheelers.",
        benefits: [
          "Up to 95% on-road price funding covering insurance & helmet accessories",
          "Instant digital approval in under 15 minutes",
          "Low EMI starting at just ₹1,999/month",
          "Flexible 12 to 48 months tenure options",
        ],
        smartTip: "Use Aadhaar OTP e-KYC for instant instant approval at bike dealership.",
      },
    ],
    eligibilityTitle: "Two-Wheeler Loan Eligibility Criteria",
    eligibilitySubtitle: "Fast-track approval criteria for all working individuals.",
    eligibility: {
      column1: {
        categoryTitle: "Applicant Requirements",
        categorySubtitle: "Salaried, self-employed & gig workers",
        iconName: "car",
        items: [
          { label: "Age Limit", desc: "18 to 65 years." },
          { label: "Minimum Monthly Income", desc: "₹12,000/month net takeaway." },
          { label: "KYC Status", desc: "Active mobile number linked with Aadhaar Card for e-KYC." },
          { label: "CIBIL Score", desc: "650+ acceptable; zero credit score first-time borrowers eligible." },
        ],
      },
      column2: {
        categoryTitle: "Documentation & Delivery",
        categorySubtitle: "Immediate vehicle release",
        iconName: "building",
        items: [
          { label: "Address Proof", desc: "Aadhaar Card, Electricity Bill, or Rental Agreement." },
          { label: "Showroom Proforma", desc: "Quotations from any authorized dealer across India." },
        ],
      },
    },
    features: [
      { title: "Up to 95% On-Road Funding", desc: "Covers bike ex-showroom price, RTO registration charges, and insurance.", highlight: "95% Funding", accent: "#8b5cf6" },
      { title: "15-Minute Instant Approval", desc: "Fully digital processing using instant Aadhaar OTP & PAN verification.", highlight: "15-Min Approval", accent: "#0ea5e9" },
      { title: "Low EMI Starts ₹1,999/mo", desc: "Budget-friendly monthly installments tailored for first-time buyers.", highlight: "Low EMI", accent: "#10b981" },
      { title: "EV Scooter Concessions", desc: "Discounted interest rates for electric two-wheeler buyers.", highlight: "EV Discount", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Basic KYC Documents",
        categorySubtitle: "Digital verification only",
        items: [
          { title: "Identity & Address", desc: "Aadhaar Card & PAN Card (Mandatory)" },
          { title: "Banking", desc: "60 days bank statement or UPI banking mandate setup" },
        ],
      },
      column2: {
        categoryTitle: "Dealer Invoice",
        categorySubtitle: "Showroom paperwork",
        items: [
          { title: "Proforma Invoice", desc: "On-road price quotation from authorized two-wheeler dealership" },
        ],
      },
    },
  },

  "loan-against-car": {
    slug: "loan-against-car",
    title: "Loan Against Car",
    categoryLabel: "Vehicle Loans",
    range: {
      minAmount: 100000,
      maxAmount: 2500000,
      defaultAmount: 500000,
      stepAmount: 25000,
      rate: 11.99,
      minTenure: 1,
      maxTenure: 4,
      defaultTenure: 3,
      rateBadge: "From 11.99%* p.a.",
      amountBadge: "Up to 150% of Car Valuation",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/loan-against-car-02-desktop.webp",
        alt: "Car owner holding car keys with cash liquidity",
        badge: "🚘 Keep Driving Your Car While Raising Cash",
        title: "Unlock Instant Cash Liquidity Against Your Existing Car",
        highlight: "You Continue Driving Your Car 100%",
        description:
          "Mortgage your owned car to get up to 150% of its current market valuation in cash. Minimal documentation, instant approval, and you never surrender your vehicle.",
        chips: ["From 11.99%* p.a.", "Keep Driving Car", "Up to 150% Value"],
        ctaText: "Check Car Liquidity Sanction",
      },
    ],
    useCasesTitle: "Cash Liquidity from Your Owned",
    useCasesSubtitle: "Vehicle",
    useCases: [
      {
        id: "car-refinance",
        title: "Emergency Business or Personal Cash",
        headline: "Borrow Cash Without Selling Your Vehicle or Pledging Gold",
        badge: "Drive Your Car",
        image: "/assets/loan-banners/rendered/loan-against-car-02-desktop.webp",
        alt: "Car key handover",
        amount: "Up to ₹25 Lakhs",
        tenure: "1 to 4 Years",
        rate: "From 11.99%* p.a.",
        desc: "If you own a fully paid-off car (or one with minimal remaining EMIs), refinance it to get instant cash disbursed within 24 hours.",
        benefits: [
          "Borrow up to 150% of the car's current fair market valuation",
          "Zero operational disruption—you continue driving your car daily",
          "Lower interest rate compared to 16%+ unsecured micro loans",
          "Prepay early without hidden foreclosure penalties",
        ],
        smartTip: "Ensure active motor insurance to get maximum 150% LTV allocation.",
      },
    ],
    eligibilityTitle: "Loan Against Car Eligibility Guidelines",
    eligibilitySubtitle: "Vehicle condition and owner eligibility checklist.",
    eligibility: {
      column1: {
        categoryTitle: "Car Condition",
        categorySubtitle: "Vehicle ownership status",
        iconName: "car",
        items: [
          { label: "Car Age", desc: "Vehicle age must not exceed 8 years." },
          { label: "Hypothecation", desc: "Car must be fully paid-off or existing loan NOC obtained." },
          { label: "Inspection", desc: "Must pass basic doorstep technical inspection." },
        ],
      },
      column2: {
        categoryTitle: "Owner Profile",
        categorySubtitle: "Income and KYC criteria",
        iconName: "building",
        items: [
          { label: "Ownership", desc: "RC must be registered in applicant's or spouse's name." },
          { label: "Income Proof", desc: "Minimum net monthly income of ₹20,000." },
          { label: "CIBIL Score", desc: "680+ acceptable." },
        ],
      },
    },
    features: [
      { title: "Up to 150% Car Value Disbursed", desc: "High loan-to-value allocation based on current fair market valuation.", highlight: "150% LTV", accent: "#8b5cf6" },
      { title: "100% Retain Vehicle Usage", desc: "No physical vehicle custody taken; you keep driving your car normally.", highlight: "Keep Driving", accent: "#0ea5e9" },
      { title: "Disbursal within 24 Hours", desc: "Fast digital processing with door-step inspection & RC RTO endorsement.", highlight: "24-Hr Cash", accent: "#10b981" },
      { title: "Tenures up to 48 Months", desc: "Repay comfortably over 1 to 4 years with structured monthly EMIs.", highlight: "4-Yr Tenure", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Car RC & Insurance Papers",
        categorySubtitle: "Vehicle paperwork required",
        items: [
          { title: "Original RC Book", desc: "Car Registration Certificate smart card copy" },
          { title: "Valid Insurance", desc: "Comprehensive motor insurance policy copy" },
          { title: "RTO Form 34", desc: "Hypothecation endorsement form for bank lien entry" },
        ],
      },
      column2: {
        categoryTitle: "Personal KYC & Income",
        categorySubtitle: "Borrower identity documents",
        items: [
          { title: "Personal KYC", desc: "PAN Card, Aadhaar Card, Passport/Voter ID" },
          { title: "Income Proof", desc: "3 months pay slips & 6-mo bank statement or 2-yr ITR" },
        ],
      },
    },
  },

  "gold-loan": {
    slug: "gold-loan",
    title: "Gold Loan",
    categoryLabel: "Asset Loans",
    range: {
      minAmount: 20000,
      maxAmount: 10000000,
      defaultAmount: 300000,
      stepAmount: 10000,
      rate: 8.95,
      minTenure: 1,
      maxTenure: 3,
      defaultTenure: 1,
      rateBadge: "From 8.95%* p.a.",
      amountBadge: "Up to 75% Gold Value",
    },
    slides: [
      {
        image: "/assets/loan-png/gold_loan.png",
        alt: "Gold jewelry purity appraisal",
        badge: "💰 Instant Doorstep / Branch Gold Sanction",
        title: "Unlock Instant Cash Against Gold Jewelry in 30 Minutes",
        highlight: "High Valuation with Insured Vault Storage",
        description:
          "Pledge 18k to 24k gold ornaments for instant cash. Zero income proof or CIBIL requirements. Rates starting at 8.95% p.a. with free insured vault protection.",
        chips: ["From 8.95%* p.a.", "30-Min Disbursal", "Insured Storage"],
        ctaText: "Calculate Gold Loan Value",
      },
    ],
    useCasesTitle: "Gold Financing Uses for Instant",
    useCasesSubtitle: "Liquidity Needs",
    useCases: [
      {
        id: "instant-cash",
        title: "Emergency Liquidity & Business Capital",
        headline: "Instant Cash Disbursal Without Income Proof or CIBIL Checks",
        badge: "Zero CIBIL Needed",
        image: "/assets/loan-png/gold_loan.png",
        alt: "Gold ornaments valuation",
        amount: "Up to ₹1 Crore",
        tenure: "1 to 36 Months",
        rate: "From 8.95%* p.a.",
        desc: "Gold loans provide immediate capital evaluated purely on gold weight and purity (18K to 24K). Gold remains 100% safe in bank vaults.",
        benefits: [
          "Zero income proof or credit score requirements",
          "Cash disbursed in 30 minutes at branch or doorstep",
          "Free 100% insured bank vault storage with seal tag",
          "Bullet payment option: Pay interest monthly, principal at maturity",
        ],
        smartTip: "Opt for bullet interest scheme to keep monthly cash outflow under ₹800 per lakh.",
      },
    ],
    eligibilityTitle: "Gold Loan Eligibility Guidelines",
    eligibilitySubtitle: "Simple evaluation based on gold purity and weight.",
    eligibility: {
      column1: {
        categoryTitle: "Gold Ornaments Criteria",
        categorySubtitle: "Acceptable gold specifications",
        iconName: "coins",
        items: [
          { label: "Purity Range", desc: "18 Karat to 24 Karat gold jewelry, bangles, chains, coins." },
          { label: "Valuation LTV", desc: "Up to 75% of net gold weight market value (excluding stones)." },
          { label: "Ownership", desc: "Gold must belong to applicant or family member." },
        ],
      },
      column2: {
        categoryTitle: "Borrower Requirements",
        categorySubtitle: "Basic age and KYC guidelines",
        iconName: "building",
        items: [
          { label: "Age Limit", desc: "18 to 75 years." },
          { label: "Income Proof", desc: "NOT REQUIRED." },
          { label: "CIBIL Score", desc: "NOT REQUIRED (Ideal for first-time or low credit score borrowers)." },
        ],
      },
    },
    features: [
      { title: "30-Minute Instant Disbursal", desc: "Gold appraised and cash transferred to bank account in 30 minutes.", highlight: "30-Min Disbursal", accent: "#8b5cf6" },
      { title: "Zero Income Proof / CIBIL Required", desc: "Approved strictly based on gold collateral value.", highlight: "No Income Proof", accent: "#0ea5e9" },
      { title: "100% Insured Bank Vault Storage", desc: "Gold stored in triple-locked bank vaults with free insurance coverage.", highlight: "Insured Storage", accent: "#10b981" },
      { title: "Bullet Interest Repayment Scheme", desc: "Pay interest monthly and settle principal total at the end of tenure.", highlight: "Bullet Payment", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Basic Identity Proof",
        categorySubtitle: "Minimal paperwork required",
        items: [
          { title: "Identity Proof", desc: "PAN Card, Aadhaar Card, Passport, or Voter ID" },
          { title: "Address Proof", desc: "Aadhaar Card, Electricity Bill, or Driving License" },
        ],
      },
      column2: {
        categoryTitle: "Gold Appraisals",
        categorySubtitle: "Empaneled assayer valuation",
        items: [
          { title: "Assayer Certificate", desc: "Generated digitally at branch/doorstep by bank appraiser" },
        ],
      },
    },
  },

  "loan-against-security": {
    slug: "loan-against-security",
    title: "Loan Against Securities / Mutual Funds",
    categoryLabel: "Asset Loans",
    range: {
      minAmount: 50000,
      maxAmount: 50000000,
      defaultAmount: 1000000,
      stepAmount: 50000,
      rate: 9.50,
      minTenure: 1,
      maxTenure: 3,
      defaultTenure: 1,
      rateBadge: "From 9.50%* p.a.",
      amountBadge: "Up to 80% Portfolio Value",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/loan-against-security-01-desktop.webp",
        alt: "Investment portfolio dashboard with mutual fund units",
        badge: "📈 Retain Investment Compounding Returns",
        title: "Pledge Mutual Funds, Shares & Bonds for Instant Overdraft",
        highlight: "Zero Lock-In Loss of Portfolio Growth",
        description:
          "Unlock cash liquidity without redeeming mutual fund units or selling long-term shares. Digital lien marking via CAMS/KFintech with rates from 9.50% p.a.",
        chips: ["From 9.50%* p.a.", "Digital Lien in 15 Mins", "Keep SIP Compounding"],
        ctaText: "Check Portfolio Loan Limit",
      },
    ],
    useCasesTitle: "Why Borrow Against Securities Instead of",
    useCasesSubtitle: "Redeeming?",
    useCases: [
      {
        id: "retain-compounding",
        title: "Retain Long-Term Portfolio Growth & SIPs",
        headline: "Get Cash Liquidity Without Paying Capital Gains Tax or Exit Load",
        badge: "Zero Exit Load",
        image: "/assets/loan-banners/rendered/loan-against-security-01-desktop.webp",
        alt: "Mutual fund portfolio chart",
        amount: "Up to ₹5 Crore",
        tenure: "1 to 36 Months",
        rate: "From 9.50%* p.a.",
        desc: "Redeeming mutual funds triggers short-term/long-term capital gains tax and breaks compounding. Pledging units gives you cash overdraft while your investments continue earning market returns.",
        benefits: [
          "Instant digital lien marking via CAMS / KFintech OTP",
          "Pay interest strictly on daily overdraft usage balance",
          "Avoids capital gains tax and exit load penalties",
          "Your mutual funds & shares continue building compounding wealth",
        ],
        smartTip: "Pledge Equity Mutual Funds for up to 50% LTV and Debt Funds for up to 80% LTV.",
      },
    ],
    eligibilityTitle: "Loan Against Securities Eligibility",
    eligibilitySubtitle: "Accepted security types and LTV allocation rules.",
    eligibility: {
      column1: {
        categoryTitle: "Eligible Securities",
        categorySubtitle: "Dematerialized investments accepted",
        iconName: "coins",
        items: [
          { label: "Mutual Funds", desc: "Equity & Debt Mutual Funds registered with CAMS/KFintech." },
          { label: "Approved Stocks", desc: "Group A & B demat shares listed on NSE/BSE." },
          { label: "Bonds / SGBs", desc: "Sovereign Gold Bonds (SGB), Corporate Bonds, RBI Bonds." },
        ],
      },
      column2: {
        categoryTitle: "Borrower Guidelines",
        categorySubtitle: "Age and demat account criteria",
        iconName: "building",
        items: [
          { label: "Age Limit", desc: "18 to 70 years." },
          { label: "Demat / Folio", desc: "Investments held in single or joint name with NSDL/CDSL or AMCs." },
          { label: "CIBIL Score", desc: "650+ acceptable." },
        ],
      },
    },
    features: [
      { title: "Digital Lien Marking in 15 Minutes", desc: "Paperless online lien setup via CAMS, KFintech, NSDL & CDSL OTP.", highlight: "Instant Lien", accent: "#8b5cf6" },
      { title: "Zero Tax & Exit Load Loss", desc: "Avoid triggering Capital Gains Tax (LTCG/STCG) or mutual fund exit load.", highlight: "Tax Shield", accent: "#0ea5e9" },
      { title: "Pay Interest Strictly on Usage", desc: "Overdraft limit format allows zero interest cost when balance is ₹0.", highlight: "OD Overdraft", accent: "#10b981" },
      { title: "Up to 80% LTV Allocation", desc: "Borrow up to 50% on Equity Funds and up to 80% on Debt Funds/Bonds.", highlight: "High LTV", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "Investment & Demat Proofs",
        categorySubtitle: "Digital portfolio verification",
        items: [
          { title: "CAS Statement", desc: "Consolidated Account Statement (CAS) from CAMS/KFintech/NSDL" },
          { title: "Demat Client Master", desc: "CMR copy showing Demat account ID (for shares)" },
        ],
      },
      column2: {
        categoryTitle: "Borrower KYC",
        categorySubtitle: "Basic identity paperwork",
        items: [
          { title: "Personal KYC", desc: "PAN Card, Aadhaar Card, Passport/Voter ID" },
          { title: "Bank Mandate", desc: "Cancelled cheque / bank statement for OD account linkage" },
        ],
      },
    },
  },
};

export const getProductContentConfig = (
  slug: string,
  humanizedTitle?: string
): ProductContentConfig => {
  if (productContentMap[slug]) {
    return productContentMap[slug];
  }

  const title = humanizedTitle || slug.replace(/-/g, " ").toUpperCase();
  return {
    slug,
    title,
    categoryLabel: "Loans & Financing",
    range: {
      minAmount: 50000,
      maxAmount: 10000000,
      defaultAmount: 500000,
      stepAmount: 25000,
      rate: 9.99,
      minTenure: 1,
      maxTenure: 7,
      defaultTenure: 3,
      rateBadge: "From 9.99%* p.a.",
      amountBadge: "Up to ₹1 Crore",
    },
    slides: [
      {
        image: "/assets/loan-banners/rendered/instant-loan-01-desktop.webp",
        alt: `${title} assistance banner`,
        badge: "⚡ Guided Digital Disbursal",
        title: `Tailored ${title} Solutions`,
        highlight: "Sanctions in 24 Hours",
        description: `Compare competitive rates, transparent processing terms, and fast digital approvals for ${title} across 50+ partner banks.`,
        chips: ["Competitive Rates", "Minimal Paperwork", "Quick Disbursal"],
        ctaText: `Check ${title} Eligibility`,
      },
    ],
    useCasesTitle: `Key Benefits & Features of`,
    useCasesSubtitle: title,
    useCases: [
      {
        id: "primary-benefit",
        title: `${title} Financing`,
        headline: `Fulfill Your ${title} Needs with Transparent Terms`,
        badge: "",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1600",
        alt: `${title} overview`,
        amount: "Tailored Limit",
        tenure: "1 to 7 Years",
        rate: "From 9.99%* p.a.",
        desc: `Access structured borrowing options tailored to your income profile, liquidity goals, and preferred repayment timeline for ${title}.`,
        benefits: [
          "Transparent interest rate calculations with zero hidden costs",
          "Digital document verification and assisted bank application",
          "Flexible tenure options keep monthly EMIs comfortable",
          "Soft credit check ensures zero impact on your CIBIL score",
        ],
        smartTip: "Compare offers from multiple partner lenders to secure the lowest processing fee.",
      },
    ],
    eligibilityTitle: `${title} Eligibility Criteria`,
    eligibilitySubtitle: "Clear guidelines based on income, age, and document verification.",
    eligibility: {
      column1: {
        categoryTitle: "Salaried Individuals",
        categorySubtitle: "Corporate, Public Sector & Govt Employees",
        iconName: "building",
        items: [
          { label: "Age Limit", desc: "21 to 60 years at loan maturity." },
          { label: "Minimum Salary", desc: "₹25,000/month net takeaway." },
          { label: "CIBIL Score", desc: "700+ for best interest rate offers." },
        ],
      },
      column2: {
        categoryTitle: "Self-Employed & Business",
        categorySubtitle: "Proprietors, Partners, Directors",
        iconName: "briefcase",
        items: [
          { label: "Age Limit", desc: "23 to 65 years." },
          { label: "Business Vintage", desc: "Minimum 2 years of active business operations." },
          { label: "Income Proof", desc: "2 years ITR with audited financials or bank statements." },
        ],
      },
    },
    features: [
      { title: "Competitive Rates", desc: "Interest rates benchmarked to prime lender guidelines.", highlight: "Lowest Rates", accent: "#8b5cf6" },
      { title: "Flexible Repayment", desc: "Tenure horizons up to 84 months keep EMIs manageable.", highlight: "Flexible EMI", accent: "#0ea5e9" },
      { title: "Digital Paperless Journey", desc: "Apply online with Aadhaar e-KYC and digital bank statements.", highlight: "100% Digital", accent: "#10b981" },
      { title: "Multi-Lender Choice", desc: "Compare multiple partner offers on a single transparent dashboard.", highlight: "50+ Lenders", accent: "#f59e0b" },
    ],
    documents: {
      column1: {
        categoryTitle: "KYC Documents",
        categorySubtitle: "Personal identification paperwork",
        items: [
          { title: "Identity & Address", desc: "PAN Card, Aadhaar Card, Passport, or Voter ID" },
          { title: "Income Proof", desc: "3 months pay slips or 2 years ITR" },
        ],
      },
      column2: {
        categoryTitle: "Banking Records",
        categorySubtitle: "Financial verification paperwork",
        items: [
          { title: "Bank Statement", desc: "Latest 6 months bank statement showing income credit" },
        ],
      },
    },
  };
};
