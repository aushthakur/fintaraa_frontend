export type BlogCategory =
  | "Loans"
  | "Credit Score"
  | "Insurance"
  | "Credit Cards"
  | "Financial Planning";

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string | BlogAuthor;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  accent: string;
  body: Array<{
    heading: string;
    content: string[];
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "choose-right-personal-loan",
    title: "How to Choose the Right Personal Loan Without Overpaying",
    excerpt:
      "Compare eligibility, APR, fees, tenure, and repayment comfort before accepting a personal loan offer.",
    category: "Loans",
    author: "Fintaraa Editorial",
    publishedAt: "2026-05-10",
    readTime: "6 min read",
    featured: true,
    tags: ["Personal Loan", "APR", "EMI"],
    accent: "#0ea5e9",
    body: [
      {
        heading: "Start with the total cost, not only the EMI",
        content: [
          "A low EMI can still be expensive if the tenure is stretched too far. Compare the annual percentage rate, processing fee, insurance bundling, foreclosure terms, and late payment charges before choosing an offer.",
          "Use EMI as an affordability signal, but use total interest and total payable amount as the final comparison point.",
        ],
      },
      {
        heading: "Check eligibility before applying everywhere",
        content: [
          "Multiple hard enquiries in a short period may affect your bureau profile. A marketplace flow helps you understand indicative fit before proceeding with a partner application.",
          "Keep PAN, income proof, bank statement, and address details ready so the lender can verify quickly.",
        ],
      },
      {
        heading: "Keep repayment flexible",
        content: [
          "Prefer offers that allow part-payment or foreclosure on reasonable terms. This gives you room to reduce interest if your income improves or a bonus arrives.",
        ],
      },
    ],
  },
  {
    slug: "improve-cibil-score-practical-steps",
    title: "Practical Ways to Improve Your CIBIL Score",
    excerpt:
      "A better score comes from consistent repayment, lower utilisation, and clean credit behaviour over time.",
    category: "Credit Score",
    author: "Fintaraa Credit Desk",
    publishedAt: "2026-05-06",
    readTime: "5 min read",
    featured: true,
    tags: ["CIBIL", "Credit Health", "Repayment"],
    accent: "#22c55e",
    body: [
      {
        heading: "Pay every obligation before the due date",
        content: [
          "Payment history is one of the strongest signals in your credit report. Even a small missed card bill or EMI can stay visible and reduce lender confidence.",
          "Set reminders for credit cards, EMIs, and BNPL dues. Where possible, keep auto-debit enabled with enough balance.",
        ],
      },
      {
        heading: "Control utilisation on credit cards",
        content: [
          "Using a high percentage of your available card limit can make your profile look stretched. Try keeping utilisation comfortably below the limit even when you pay in full.",
        ],
      },
      {
        heading: "Review report errors",
        content: [
          "If a closed loan still appears active or a repayment is incorrectly marked late, raise a dispute with the bureau and the lender with supporting proof.",
        ],
      },
    ],
  },
  {
    slug: "term-insurance-before-you-buy",
    title: "Term Insurance: What to Check Before You Buy",
    excerpt:
      "Understand cover amount, claim settlement, exclusions, riders, and premium commitment before choosing a policy.",
    category: "Insurance",
    author: "Fintaraa Insurance Team",
    publishedAt: "2026-04-28",
    readTime: "7 min read",
    tags: ["Term Insurance", "Protection", "Claims"],
    accent: "#f97316",
    body: [
      {
        heading: "Choose cover around responsibilities",
        content: [
          "A useful cover amount should reflect dependents, loans, education goals, household expenses, and inflation. Avoid selecting cover only because the premium looks affordable.",
        ],
      },
      {
        heading: "Read exclusions clearly",
        content: [
          "Every policy has specific exclusions and declaration requirements. Incorrect health, lifestyle, or income information can create issues during claims.",
        ],
      },
      {
        heading: "Keep nominees informed",
        content: [
          "A policy is useful only when nominees know it exists and can access claim support documents when needed.",
        ],
      },
    ],
  },
  {
    slug: "credit-card-selection-guide",
    title: "A Clear Guide to Selecting the Right Credit Card",
    excerpt:
      "The best card is not always the card with the highest reward rate. Match benefits to your real spending pattern.",
    category: "Credit Cards",
    author: "Fintaraa Cards Desk",
    publishedAt: "2026-04-20",
    readTime: "5 min read",
    tags: ["Credit Cards", "Rewards", "Fees"],
    accent: "#6366f1",
    body: [
      {
        heading: "Map rewards to your actual spend",
        content: [
          "Travel, fuel, grocery, and cashback cards can all be useful, but only when their reward categories match your regular expenses.",
        ],
      },
      {
        heading: "Compare fees and redemption rules",
        content: [
          "Annual fee waivers, reward caps, expiry rules, and redemption charges can change the actual value you receive from a card.",
        ],
      },
      {
        heading: "Use credit responsibly",
        content: [
          "Pay the full bill by the due date. Revolving balances on credit cards usually carry high finance charges.",
        ],
      },
    ],
  },
  {
    slug: "home-loan-eligibility-documents",
    title: "Home Loan Eligibility and Documents Checklist",
    excerpt:
      "Prepare income, property, banking, and KYC documents early to reduce back-and-forth during home loan processing.",
    category: "Loans",
    author: "Fintaraa Home Loan Team",
    publishedAt: "2026-04-12",
    readTime: "8 min read",
    tags: ["Home Loan", "Documents", "Eligibility"],
    accent: "#14b8a6",
    body: [
      {
        heading: "Eligibility depends on repayment comfort",
        content: [
          "Lenders consider income, existing obligations, bureau profile, age, employer or business stability, and property quality.",
        ],
      },
      {
        heading: "Keep property papers organized",
        content: [
          "Sale agreement, chain documents, approved plan, tax receipts, and builder documents can be requested depending on property type.",
        ],
      },
      {
        heading: "Compare more than interest rate",
        content: [
          "Processing fees, legal charges, technical valuation, prepayment terms, and reset frequency matter in the total decision.",
        ],
      },
    ],
  },
  {
    slug: "emergency-fund-before-loan",
    title: "Why an Emergency Fund Matters Before Taking Credit",
    excerpt:
      "A cash buffer can protect your score and reduce stress when income or expenses temporarily change.",
    category: "Financial Planning",
    author: "Fintaraa Money Guide",
    publishedAt: "2026-04-04",
    readTime: "4 min read",
    tags: ["Planning", "Emergency Fund", "Budget"],
    accent: "#eab308",
    body: [
      {
        heading: "Credit works best with a buffer",
        content: [
          "An emergency fund reduces the chance of missed EMIs when a medical expense, job change, or family need appears unexpectedly.",
        ],
      },
      {
        heading: "Start small and automate",
        content: [
          "Even one month of expenses saved separately can improve resilience. Build gradually toward three to six months based on dependents and income stability.",
        ],
      },
      {
        heading: "Keep it liquid",
        content: [
          "Emergency money should be easy to access and low risk. Avoid locking it into products with exit penalties or high volatility.",
        ],
      },
    ],
  },
  {
    slug: "business-loan-documents-cash-flow-checklist",
    title: "Business Loan Documents and Cash Flow Checks",
    excerpt:
      "Know the records lenders usually review before approving working capital or growth funding.",
    category: "Loans",
    author: "Fintaraa Business Loan Team",
    publishedAt: "2026-03-28",
    readTime: "6 min read",
    tags: ["Business Loan", "Documents", "Cash Flow"],
    accent: "#2563eb",
    body: [
      {
        heading: "Organize financial records first",
        content: [
          "Business loan review usually starts with banking, turnover, GST or ITR records, existing obligations, and repayment capacity.",
          "Clean documentation helps partners understand seasonality, margins, and actual cash flow instead of relying only on declared income.",
        ],
      },
      {
        heading: "Separate need from eligibility",
        content: [
          "The amount required for expansion may be different from the amount a lender is comfortable approving. Compare EMI impact before finalizing tenure.",
        ],
      },
      {
        heading: "Keep owner KYC ready",
        content: [
          "PAN, Aadhaar, business proof, address proof, and bank statements are commonly requested for proprietor, partner, or director verification.",
        ],
      },
    ],
  },
  {
    slug: "gold-loan-valuation-and-repayment-guide",
    title: "Gold Loan Valuation and Repayment Guide",
    excerpt:
      "Understand purity checks, loan-to-value, interest options, and closure terms before pledging gold.",
    category: "Loans",
    author: "Fintaraa Gold Loan Desk",
    publishedAt: "2026-03-22",
    readTime: "5 min read",
    tags: ["Gold Loan", "Valuation", "Repayment"],
    accent: "#d97706",
    body: [
      {
        heading: "Valuation decides eligible amount",
        content: [
          "Gold loan amount depends on purity, weight, prevailing rate, and partner loan-to-value policy. Decorative stones and non-gold parts are usually excluded.",
        ],
      },
      {
        heading: "Compare repayment structures",
        content: [
          "Some plans require regular EMI, while others allow interest servicing with principal closure at the end. Pick the structure that fits cash flow.",
        ],
      },
      {
        heading: "Check auction and renewal terms",
        content: [
          "Read overdue, renewal, part-release, and auction rules carefully so there is no confusion during repayment stress.",
        ],
      },
    ],
  },
  {
    slug: "health-insurance-coverage-checklist",
    title: "Health Insurance Coverage Checklist Before Buying",
    excerpt:
      "Compare waiting periods, room rent limits, network hospitals, exclusions, and claim support before choosing a plan.",
    category: "Insurance",
    author: "Fintaraa Insurance Team",
    publishedAt: "2026-03-18",
    readTime: "7 min read",
    tags: ["Health Insurance", "Coverage", "Claims"],
    accent: "#0f766e",
    body: [
      {
        heading: "Review limits beyond sum insured",
        content: [
          "A policy can look sufficient on sum insured but still include room rent, disease-wise, co-pay, or waiting period conditions.",
          "Compare these conditions with your city, hospital preference, and family health history.",
        ],
      },
      {
        heading: "Check hospital access",
        content: [
          "Network hospital availability matters during emergencies. Keep nearby hospital options and cashless claim process in mind.",
        ],
      },
      {
        heading: "Declare health details correctly",
        content: [
          "Accurate declarations reduce claim disputes. Share existing conditions, medication, surgeries, and lifestyle details honestly.",
        ],
      },
    ],
  },
  {
    slug: "car-insurance-claim-documents-guide",
    title: "Car Insurance Claim Documents Guide",
    excerpt:
      "Prepare claim intimation, RC, licence, policy copy, repair estimate, and photos for smoother vehicle claim processing.",
    category: "Insurance",
    author: "Fintaraa Motor Insurance Desk",
    publishedAt: "2026-03-12",
    readTime: "5 min read",
    tags: ["Car Insurance", "Claims", "Documents"],
    accent: "#0891b2",
    body: [
      {
        heading: "Intimate the claim early",
        content: [
          "After an accident or damage event, inform the insurer or assistance desk quickly. Delayed intimation can complicate inspection and approval.",
        ],
      },
      {
        heading: "Keep vehicle papers available",
        content: [
          "RC, driving licence, policy copy, repair estimate, and photos are commonly required. Theft and third-party incidents may need additional police documentation.",
        ],
      },
      {
        heading: "Understand cashless and reimbursement flow",
        content: [
          "Cashless garages can reduce upfront payment, while reimbursement claims require bills and payment proof after repairs.",
        ],
      },
    ],
  },
  {
    slug: "life-insurance-riders-explained",
    title: "Life Insurance Riders Explained Simply",
    excerpt:
      "Accidental death, critical illness, waiver of premium, and income riders can add protection when chosen carefully.",
    category: "Insurance",
    author: "Fintaraa Protection Desk",
    publishedAt: "2026-03-06",
    readTime: "6 min read",
    tags: ["Life Insurance", "Riders", "Protection"],
    accent: "#7c3aed",
    body: [
      {
        heading: "Riders should solve a real gap",
        content: [
          "Add-ons are useful when they match family risk, income dependency, health exposure, or loan obligations. Avoid adding riders only because premium difference looks small.",
        ],
      },
      {
        heading: "Read trigger conditions",
        content: [
          "Critical illness and disability riders have precise definitions, waiting periods, and exclusions. These decide whether a claim is payable.",
        ],
      },
      {
        heading: "Keep affordability stable",
        content: [
          "Protection works best when premiums remain comfortable across the full policy term, including riders and future renewals.",
        ],
      },
    ],
  },
];

export const blogCategories = [
  "All",
  ...Array.from(new Set(blogPosts.map((post) => post.category))),
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const latestBlogPosts = [...blogPosts].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);
