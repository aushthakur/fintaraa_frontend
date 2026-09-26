const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://fintaraa-frontend-2o45.onrender.com';

const pagesData = [
  // ─── 1. CORE APPLICATION & MAIN DISCOVERY PAGES ─────────────────────────────
  {
    category: 'Core Pages',
    name: 'Home Page',
    path: '/',
    description: "India's smartest loan and financial marketplace with instant eligibility, calculators, bank comparison, and real-time application tracking.",
    status: 'Active / Optimized',
    type: 'Landing Page'
  },
  {
    category: 'Core Pages',
    name: 'Products Marketplace',
    path: '/products',
    description: 'Comprehensive directory of all loan, insurance, credit card, and corporate compliance services.',
    status: 'Active',
    type: 'Marketplace'
  },
  {
    category: 'Core Pages',
    name: 'Bank Partners Directory',
    path: '/banks',
    description: 'Explore 35+ RBI regulated bank partners, NBFCs, and their retail credit portfolios.',
    status: 'Active',
    type: 'Directory'
  },
  {
    category: 'Core Pages',
    name: 'Partners All',
    path: '/partners/all',
    description: 'Comprehensive directory of all banking, NBFC, and financial institutional partners.',
    status: 'Active',
    type: 'Directory'
  },
  {
    category: 'Core Pages',
    name: 'Partners by Product',
    path: '/partners-by-product',
    description: 'Filtered banking and lending partners indexed by specific product categories.',
    status: 'Active',
    type: 'Directory'
  },
  {
    category: 'Core Pages',
    name: 'Calculators Hub',
    path: '/calculators',
    description: 'Suite of advanced financial calculation tools including EMI, loan eligibility, and affordability estimators.',
    status: 'Active',
    type: 'Tool Hub'
  },
  {
    category: 'Core Pages',
    name: 'CIBIL Credit Score Check',
    path: '/cibil-score',
    description: 'Free RBI-authorized credit bureau score check with detailed health report and improvement tips.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Core Pages',
    name: 'CIBIL Score Report',
    path: '/cibil-score/report',
    description: 'Detailed analysis of credit accounts, repayment history, credit utilization ratio, and score factors.',
    status: 'Active',
    type: 'Report Page'
  },
  {
    category: 'Core Pages',
    name: 'Offers & Deals Hub',
    path: '/offers',
    description: 'Exclusive cashback, zero-processing fee deals, and limited-period credit offers.',
    status: 'Active',
    type: 'Deals Hub'
  },
  {
    category: 'Core Pages',
    name: 'Knowledge Hub & Learning',
    path: '/knowledge-hub',
    description: 'Educational articles, borrow guides, credit advice, and regulatory financial disclosures.',
    status: 'Active',
    type: 'Knowledge Hub'
  },
  {
    category: 'Core Pages',
    name: 'Blog Main Directory',
    path: '/blog',
    description: 'Latest financial news, banking rate updates, RBI repo rate changes, and borrowing insights.',
    status: 'Active',
    type: 'Blog Hub'
  },
  {
    category: 'Core Pages',
    name: 'All Blog Articles',
    path: '/blog/all',
    description: 'Searchable archive of all published articles and borrowing guides.',
    status: 'Active',
    type: 'Blog Directory'
  },

  // ─── 2. REVAMPED & SPECIALIZED LOAN PRODUCT PAGES ────────────────────────────
  {
    category: 'Loan Products',
    name: 'Personal Loan',
    path: '/products/personal-loan',
    description: 'Instant paperless personal loans up to ₹50 Lakhs with 100% digital KYC and fast disbursal.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Instant Loan',
    path: '/products/instant-loan',
    description: 'Emergency 5-minute personal credit line with instant Aadhaar verification and same-day bank payout.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Home Loan',
    path: '/products/home-loan',
    description: 'Prime home financing starting at 8.35% p.a. for ready-to-move flats, resale apartments, and villas.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Housing Loan (Alias)',
    path: '/products/housing-loan',
    description: 'Dedicated residential housing finance with subsidized rates and extended 30-year tenures.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Loan Against Property (LAP)',
    path: '/products/loan-against-property',
    description: 'High-ticket secured mortgage financing up to ₹25 Crores (75% LTV) against residential/commercial property.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'LAP (Alias)',
    path: '/products/lap',
    description: 'Direct alias for Loan Against Property mortgage financing.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Balance Transfer + Top-Up Loan',
    path: '/products/balance-transfer-top-up-loan',
    description: 'Refinance existing high-interest home and mortgage loans to prime 8.35% rates + unlock top-up cash.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Balance Transfer Loan (Alias)',
    path: '/products/balance-transfer-loan',
    description: 'Debt refinancing program for residential and commercial mortgages.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Top-Up Loan',
    path: '/products/top-up-loan',
    description: 'Additional liquidity on existing home loans at base secured mortgage rates.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Construction Loan',
    path: '/products/construction-loan',
    description: 'Finance self-plot home construction, floor extensions, or commercial buildings with stage-wise tranche releases.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Education Loan',
    path: '/products/education-loan',
    description: 'Domestic and international study loans covering 100% tuition, living expenses, and travel without collateral.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Wedding Loan',
    path: '/products/wedding-loan',
    description: 'Custom wedding finance for venue bookings, bridal jewelry, catering, and destination celebrations.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Marriage Loan (Alias)',
    path: '/products/marriage-loan',
    description: 'Specialized marriage expense personal loan with flexible EMIs.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Home Renovation Loan',
    path: '/products/renovation-loan',
    description: 'Finance home remodeling, interior design, modular kitchens, painting, and structural extensions.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Medical & Healthcare Loan',
    path: '/products/medical-loan',
    description: 'Emergency medical financing for surgeries, hospitalizations, elective treatments, and specialized care.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Healthcare Loan (Alias)',
    path: '/products/healthcare-loan',
    description: 'Zero-advance medical emergency finance with rapid hospital approval.',
    status: 'Active / Revamped',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Business Loan',
    path: '/products/business-loan',
    description: 'Unsecured business expansion credit up to ₹1 Crore for MSMEs, traders, and manufacturing units.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Working Capital Loan',
    path: '/products/working-capital-loan',
    description: 'Short-term liquidity to manage operational expenses, vendor payouts, and seasonal cashflow cycles.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Overdraft Loan (OD)',
    path: '/products/od-loan',
    description: 'Revolving drop-line overdraft facility linked to business current account with interest on utilized amount.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'DOD Loan (Drop-line Overdraft)',
    path: '/products/dod-loan',
    description: 'Structured drop-line overdraft facility for expanding commercial enterprises.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Machinery & Equipment Loan',
    path: '/products/machinery-loan',
    description: 'Finance industrial machinery, automation tools, and commercial manufacturing equipment.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Industrial Loan',
    path: '/products/industrial-loan',
    description: 'Large-scale industrial plant, factory shed, and infrastructure project credit.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Commercial Purchases Loan',
    path: '/products/commercial-purchases-loan',
    description: 'Financing for acquiring commercial properties, office spaces, and retail complexes.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Solar Financing Loan',
    path: '/products/solar-loan',
    description: 'Government subsidized rooftop solar and commercial photovoltaic installation loans.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Agriculture & Farm Loan',
    path: '/products/agriculture-loan',
    description: 'Agricultural credit, tractor loans, solar pump financing, and farm mechanization support.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Gold Loan',
    path: '/products/gold-loan',
    description: 'Instant doorstep or branch liquidity pledged against gold jewelry at lowest interest rates.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Loan Against Securities (LAS)',
    path: '/products/loan-against-security',
    description: 'Instant credit line pledged against mutual funds, stocks, and insurance bonds without liquidation.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'New Car Loan',
    path: '/products/car-loan',
    description: 'Up to 100% on-road financing for new four-wheelers and electric vehicles (EVs).',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Used Car Loan',
    path: '/products/used-car-loan',
    description: 'Pre-owned car financing with free RC transfer and valuation assistance.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Two Wheeler Loan',
    path: '/products/two-wheeler-loan',
    description: 'Affordable two-wheeler and e-bike loans with minimal down payment.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Loan Against Car',
    path: '/products/loan-against-car',
    description: 'Refinance your existing car to unlock quick liquidity up to 150% of vehicle market value.',
    status: 'Active',
    type: 'Product Page'
  },
  {
    category: 'Loan Products',
    name: 'Loan Against Car Value',
    path: '/products/loan-against-car-value',
    description: 'Specialized vehicle equity monetization loan.',
    status: 'Active',
    type: 'Product Page'
  },

  // ─── 3. CREDIT CARD HUBS & CATEGORY PAGES ────────────────────────────────────
  {
    category: 'Credit Cards',
    name: 'Credit Cards Marketplace',
    path: '/credit-cards',
    description: 'Compare 50+ credit cards across lifetime-free, cashback, travel, and reward programs.',
    status: 'Active',
    type: 'Marketplace'
  },
  {
    category: 'Credit Cards',
    name: 'Credit Card (Alias)',
    path: '/credit-card',
    description: 'Credit cards directory and eligibility wizard.',
    status: 'Active',
    type: 'Marketplace'
  },
  {
    category: 'Credit Cards',
    name: 'Cashback Credit Cards',
    path: '/credit-cards/cashback',
    description: 'Best credit cards for flat cashbacks on groceries, utility bills, and online shopping.',
    status: 'Active',
    type: 'Category Hub'
  },
  {
    category: 'Credit Cards',
    name: 'Fuel Credit Cards',
    path: '/credit-cards/fuel',
    description: 'Cards offering fuel surcharge waivers and reward points at Indian Oil, HPCL, and BPCL.',
    status: 'Active',
    type: 'Category Hub'
  },
  {
    category: 'Credit Cards',
    name: 'Travel Credit Cards',
    path: '/credit-cards/travel',
    description: 'Airport lounge access cards, airline airmiles rewards, and low foreign currency markup cards.',
    status: 'Active',
    type: 'Category Hub'
  },
  {
    category: 'Credit Cards',
    name: 'Rewards Credit Cards',
    path: '/credit-cards/rewards',
    description: 'Accelerated reward points cards for lifestyle, dining, and weekend spends.',
    status: 'Active',
    type: 'Category Hub'
  },

  // ─── 4. INSURANCE PRODUCT PAGES ──────────────────────────────────────────────
  {
    category: 'Insurance',
    name: 'Health Insurance',
    path: '/products/health-insurance',
    description: 'Comprehensive cashless health cover, critical illness rider, and family floater policies.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Term Life Insurance',
    path: '/products/term-insurance',
    description: 'High-cover term life insurance with whole-life benefits and critical illness payout.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Life Insurance',
    path: '/products/life-insurance',
    description: 'Endowment, money-back, and wealth creation life insurance policies.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Car & Motor Insurance',
    path: '/products/car-insurance',
    description: 'Zero-depreciation comprehensive four-wheeler motor insurance with instant claim assistance.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Two Wheeler Bike Insurance',
    path: '/products/bike-insurance',
    description: 'Instant online bike insurance renewal with third-party and comprehensive covers.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Commercial Vehicle Insurance',
    path: '/products/vehicle-insurance',
    description: 'Fleet and commercial truck, bus, and taxi insurance policies.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Home & Property Insurance',
    path: '/products/home-insurance',
    description: 'Protection against fire, burglary, natural calamities, and structural damage for homes.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Commercial Property Insurance',
    path: '/products/property-insurance',
    description: 'Business premises, factory, and commercial warehouse asset protection.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Shop & Retail Insurance',
    path: '/products/shop-insurance',
    description: 'Retail shop package cover protecting cash in transit, stock, and burglary.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Stock & Inventory Insurance',
    path: '/products/stock-insurance',
    description: 'Coverage against warehouse fire, water damage, spoilage, and transit theft.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Machinery Breakdown Insurance',
    path: '/products/machinery-insurance',
    description: 'Protection against mechanical breakdown, electrical failure, and repair costs.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Critical Illness Insurance',
    path: '/products/critical-illness-insurance',
    description: 'Lump sum financial benefit on diagnosis of 36+ major critical conditions.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Personal Accident Insurance',
    path: '/products/personal-accident-insurance',
    description: 'Worldwide cover for accidental death, permanent total disability, and income loss.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Travel Insurance',
    path: '/products/travel-insurance',
    description: 'International travel cover for medical emergencies, flight delays, and lost baggage.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Retirement & Pension Plan',
    path: '/products/retirement-plan',
    description: 'Guaranteed lifetime annuity plans and tax-exempt retirement corpus builders.',
    status: 'Active',
    type: 'Insurance Page'
  },
  {
    category: 'Insurance',
    name: 'Group Corporate Insurance',
    path: '/products/group-insurance',
    description: 'Custom employee group health insurance (GMC) and group term life (GTL) covers.',
    status: 'Active',
    type: 'Insurance Page'
  },

  // ─── 5. CALCULATORS & INTERACTIVE TOOLS ──────────────────────────────────────
  {
    category: 'Calculators',
    name: 'EMI Calculator (Master)',
    path: '/calculators/emi-calculator',
    description: 'Universal loan EMI calculation tool with interactive amortization table and pie-chart visualizer.',
    status: 'Active',
    type: 'Interactive Tool'
  },
  {
    category: 'Calculators',
    name: 'Home Loan EMI Calculator',
    path: '/calculators/home-loan-calculator',
    description: 'Calculate monthly home loan EMIs, total interest outgo, and principal repayment schedules.',
    status: 'Active',
    type: 'Interactive Tool'
  },
  {
    category: 'Calculators',
    name: 'Personal Loan EMI Calculator',
    path: '/calculators/personal-loan-calculator',
    description: 'Determine instant personal loan EMIs across varying interest rates and repayment tenures.',
    status: 'Active',
    type: 'Interactive Tool'
  },
  {
    category: 'Calculators',
    name: 'Loan Eligibility Calculator',
    path: '/calculators/loan-eligibility-calculator',
    description: 'Assess maximum borrowing power based on monthly income, existing EMIs, and FOIR ratio.',
    status: 'Active',
    type: 'Interactive Tool'
  },
  {
    category: 'Calculators',
    name: 'Financial Tools Hub',
    path: '/tools',
    description: 'Quick directory of financial assessment tools, interest comparators, and calculators.',
    status: 'Active',
    type: 'Tool Hub'
  },

  // ─── 6. BUSINESS & CORPORATE COMPLIANCE SERVICES ─────────────────────────────
  {
    category: 'Business Services',
    name: 'Company Registration',
    path: '/company-registration',
    description: 'Online Private Limited (Pvt Ltd), LLP, One Person Company (OPC), and Partnership firm registration.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'GST Registration & Return Filing',
    path: '/gst-registration',
    description: 'Fast-track GSTIN allocation, monthly GSTR-1 & 3B return filing, and input tax credit (ITC) reconciliation.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'ITR Filing (Income Tax Return)',
    path: '/itr-filing',
    description: 'CA-assisted e-filing of ITR-1 to ITR-7 for salaried individuals, professionals, and corporate businesses.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'MSME / Udyam Registration',
    path: '/msme-registration',
    description: 'Official government Udyam MSME certification to unlock subsidized loan interest rates and subsidies.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'ROC Filing & MCA Compliance',
    path: '/roc-filing',
    description: 'Annual ROC filings (AOC-4, MGT-7), Director KYC (DIR-3), and statutory corporate compliance management.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'Annual Compliance Package',
    path: '/annual-compliance',
    description: 'Comprehensive annual compliance package for private limited companies and startups.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'Project Report for Bank Loan',
    path: '/project-report',
    description: 'CMA data preparation and detailed project reports (DPR) certified for bank term loan approvals.',
    status: 'Active',
    type: 'Service Page'
  },
  {
    category: 'Business Services',
    name: 'Tax Compliance Hub',
    path: '/tax-compliance',
    description: 'End-to-end corporate direct and indirect taxation services, TDS filing, and tax advisory.',
    status: 'Active',
    type: 'Service Page'
  },

  // ─── 7. PARTNER & DSA PORTALS ────────────────────────────────────────────────
  {
    category: 'Partner Ecosystem',
    name: 'Become a DSA Partner',
    path: '/become-dsa',
    description: 'Join Fintaraa as a certified Direct Selling Agent (DSA) partner and earn industry-best loan payout commissions.',
    status: 'Active',
    type: 'Partner Page'
  },
  {
    category: 'Partner Ecosystem',
    name: 'Franchise Opportunity',
    path: '/franchise',
    description: 'Own and operate a Fintaraa retail financial franchise in your city with tech stack and brand support.',
    status: 'Active',
    type: 'Partner Page'
  },
  {
    category: 'Partner Ecosystem',
    name: 'Partner Network Info',
    path: '/partner',
    description: 'Information about the Fintaraa institutional and distribution partner network.',
    status: 'Active',
    type: 'Partner Page'
  },
  {
    category: 'Partner Ecosystem',
    name: 'Partner Login',
    path: '/partner/login',
    description: 'Secure DSA portal for tracking lead status, commission disbursements, and partner CRM.',
    status: 'Active',
    type: 'Auth / Portal'
  },
  {
    category: 'Partner Ecosystem',
    name: 'Refer & Earn Program',
    path: '/refer-and-earn',
    description: 'Refer friends and family for loans or cards and earn cash rewards upon successful disbursal.',
    status: 'Active',
    type: 'Reward Program'
  },

  // ─── 8. COMPANY, SUPPORT & LEGAL ─────────────────────────────────────────────
  {
    category: 'Company & Support',
    name: 'About Fintaraa',
    path: '/about-us',
    description: 'About Fintaraa mission, executive leadership, technological vision, and pan-India financial presence.',
    status: 'Active',
    type: 'Company Page'
  },
  {
    category: 'Company & Support',
    name: 'Contact & Support Desk',
    path: '/contact-us',
    description: 'Customer care hotline, WhatsApp support, office headquarters location, and branch contacts.',
    status: 'Active',
    type: 'Support'
  },
  {
    category: 'Company & Support',
    name: 'Support Hub',
    path: '/support',
    description: 'Helpdesk ticketing, query resolution, and live customer assistance.',
    status: 'Active',
    type: 'Support'
  },
  {
    category: 'Company & Support',
    name: 'Application Status Tracker',
    path: '/application-status',
    description: 'Track real-time sanction status and disbursal milestone of your submitted loan application.',
    status: 'Active',
    type: 'User Tool'
  },
  {
    category: 'Company & Support',
    name: 'Careers at Fintaraa',
    path: '/careers',
    description: 'Explore career openings in fintech engineering, financial advisory, and risk management.',
    status: 'Active',
    type: 'Company Page'
  },
  {
    category: 'Company & Support',
    name: 'FAQs Center',
    path: '/faqs',
    description: 'Comprehensive answers to common borrowing, credit score, interest rate, and security questions.',
    status: 'Active',
    type: 'Help Center'
  },
  {
    category: 'Company & Support',
    name: 'Customer Feedback',
    path: '/feedback',
    description: 'Share your feedback, reviews, and suggestions to help us improve your financial experience.',
    status: 'Active',
    type: 'Feedback'
  },
  {
    category: 'Company & Support',
    name: 'Customer Testimonials',
    path: '/testimonials',
    description: 'Real borrower stories, reviews, and experiences from individuals and business owners across India.',
    status: 'Active',
    type: 'Social Proof'
  },
  {
    category: 'Company & Support',
    name: 'Video Testimonials',
    path: '/video-testimonials',
    description: 'Video interviews with successful entrepreneurs and homeowners financed through Fintaraa.',
    status: 'Active',
    type: 'Social Proof'
  },
  {
    category: 'Company & Support',
    name: 'Awards & Recognitions',
    path: '/awards-and-recognitions',
    description: 'Industry awards, fintech accolades, and regulatory excellence recognitions.',
    status: 'Active',
    type: 'Company Page'
  },
  {
    category: 'Company & Support',
    name: 'Press & Media',
    path: '/press',
    description: 'Media features, press mentions, and fintech thought leadership coverage.',
    status: 'Active',
    type: 'Media Page'
  },
  {
    category: 'Company & Support',
    name: 'Press Releases',
    path: '/press-release',
    description: 'Official corporate announcements, product launches, and company milestones.',
    status: 'Active',
    type: 'Media Page'
  },
  {
    category: 'Legal & Compliance',
    name: 'Privacy Policy',
    path: '/privacy-policy',
    description: 'Data protection policies, encryption standards, and user privacy guarantees.',
    status: 'Active',
    type: 'Legal'
  },
  {
    category: 'Legal & Compliance',
    name: 'Terms & Conditions',
    path: '/terms-and-conditions',
    description: 'User agreement, platform terms of service, and digital loan facilitation guidelines.',
    status: 'Active',
    type: 'Legal'
  },
  {
    category: 'Legal & Compliance',
    name: 'Grievance Redressal',
    path: '/grievance',
    description: 'Nodal grievance officer contact, dispute escalation matrix, and regulatory complaints protocol.',
    status: 'Active',
    type: 'Legal'
  },
  {
    category: 'Legal & Compliance',
    name: 'Loan & Statutory Disclosure',
    path: '/loan-disclosure',
    description: 'Mandatory RBI digital lending guidelines disclosure, APR calculations, and partner lender roster.',
    status: 'Active',
    type: 'Legal'
  },
  {
    category: 'Legal & Compliance',
    name: 'Delete Account Policy',
    path: '/delete-account',
    description: 'User profile and data deletion request process complying with data privacy laws.',
    status: 'Active',
    type: 'Legal'
  }
];

async function generateExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Fintaraa Platform';
  workbook.lastModifiedBy = 'Fintaraa Team';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Website Pages & URLs', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 1 }]
  });

  worksheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Category', key: 'category', width: 22 },
    { header: 'Page Name', key: 'name', width: 34 },
    { header: 'Live Page URL (Render)', key: 'url', width: 62 },
    { header: 'Relative Route', key: 'path', width: 34 },
    { header: 'Page Type', key: 'type', width: 18 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Page Description / Purpose', key: 'description', width: 75 },
  ];

  // Format Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Segoe UI' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF6424C7' } // Brand Purple
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  pagesData.forEach((item, index) => {
    const fullUrl = `${BASE_URL}${item.path}`;
    const row = worksheet.addRow({
      sno: index + 1,
      category: item.category,
      name: item.name,
      url: { text: fullUrl, hyperlink: fullUrl },
      path: item.path,
      type: item.type,
      status: item.status,
      description: item.description
    });

    row.height = 24;
    row.alignment = { vertical: 'middle' };
    row.font = { size: 10, name: 'Segoe UI' };

    // Set hyperlink styling on the URL column
    const urlCell = row.getCell('url');
    urlCell.font = { color: { argb: 'FF6424C7' }, underline: true, size: 10, name: 'Segoe UI' };

    // Align S.No and Status center
    row.getCell('sno').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('type').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('status').alignment = { vertical: 'middle', horizontal: 'center' };

    // Alternating zebra row shading
    if (index % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9F8FE' }
      };
    }

    // Add border
    ['sno', 'category', 'name', 'url', 'path', 'type', 'status', 'description'].forEach((colKey) => {
      row.getCell(colKey).border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    });
  });

  const outputFilePath = path.join(__dirname, 'Fintaraa_Website_Pages_Directory.xlsx');
  await workbook.xlsx.writeFile(outputFilePath);
  console.log(`Excel file successfully created at: ${outputFilePath}`);

  // Also create a CSV version for quick text inspection
  const csvContent = [
    ['S.No', 'Category', 'Page Name', 'Live Page URL', 'Relative Route', 'Page Type', 'Status', 'Description'].map(x => `"${x}"`).join(',')
  ];
  pagesData.forEach((item, index) => {
    const fullUrl = `${BASE_URL}${item.path}`;
    csvContent.push([
      index + 1,
      item.category,
      item.name,
      fullUrl,
      item.path,
      item.type,
      item.status,
      item.description.replace(/"/g, '""')
    ].map(x => `"${x}"`).join(','));
  });

  const csvFilePath = path.join(__dirname, 'Fintaraa_Website_Pages_Directory.csv');
  fs.writeFileSync(csvFilePath, csvContent.join('\n'));
  console.log(`CSV file successfully created at: ${csvFilePath}`);
}

generateExcel().catch(err => {
  console.error(err);
  process.exit(1);
});
