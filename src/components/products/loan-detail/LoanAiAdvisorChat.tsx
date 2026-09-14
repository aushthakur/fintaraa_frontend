"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  keyPoints?: string[];
  ctaText?: string;
  ctaHref?: string;
  timestamp: string;
}

interface KnowledgeItem {
  keywords: string[];
  title: string;
  response: string;
  keyPoints: string[];
  suggestedAction?: { text: string; href: string };
}

// Logical SEO-based frontend knowledge base for instant matching
const LOAN_AI_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    keywords: ["how much", "salary", "eligibility", "maximum loan", "limit", "amount", "calculate", "multiplier"],
    title: "Maximum Loan Eligibility Based on Salary",
    response:
      "In India, institutional banks calculate your personal loan eligibility using your FOIR (Fixed Obligation to Income Ratio) and net monthly in-hand salary. As a general rule, lenders approve loan amounts ranging from **15x to 25x your net monthly salary**.",
    keyPoints: [
      "₹25,000 monthly salary: Eligible for ₹3.5 Lakh to ₹5 Lakh",
      "₹50,000 monthly salary: Eligible for ₹7.5 Lakh to ₹12 Lakh",
      "₹1,00,000 monthly salary: Eligible for ₹15 Lakh to ₹25 Lakh",
      "Existing loan EMIs + credit card dues should not exceed 50% of your net monthly earnings (FOIR limit).",
    ],
    suggestedAction: { text: "Calculate Your Monthly EMI", href: "#emi-calculator" },
  },
  {
    keywords: ["cibil", "credit score", "650", "680", "700", "750", "score", "bureau", "bad score", "low score"],
    title: "CIBIL Score Requirements for Personal Loans",
    response:
      "A CIBIL score of **750 or higher** is considered prime by all major Indian lenders, qualifying you for the lowest starting interest rates from 10.49%* p.a. However, having a score below 750 does not automatically mean rejection.",
    keyPoints: [
      "750 – 900: Instant pre-approved offers, lowest interest rates (10.49%* p.a.), maximum tenure up to 7 years.",
      "700 – 749: High approval probability at 11.5% to 14.5% p.a. with standard bank documentation.",
      "650 – 699: Approved by leading NBFCs or fintech lenders with slightly higher rates (15% – 19% p.a.).",
      "Below 650: Adding an earning co-applicant (spouse/parent) significantly boosts approval odds.",
    ],
    suggestedAction: { text: "Check Detailed Eligibility Tiers", href: "#eligibility" },
  },
  {
    keywords: ["company", "category", "super cat", "cat a", "cat b", "employer", "tcs", "google", "genpact", "infosys", "startup", "unlisted"],
    title: "How Employer Categorization Affects Loan Pricing",
    response:
      "Leading Indian banks maintain proprietary employer category tiers (Super Cat A, Cat A, Cat B, and Cat C). Your company's classification directly determines your interest rate, sanctioned ticket size, and documentation requirements.",
    keyPoints: [
      "Category 1 / Super Cat A (Fortune 500 MNCs, listed blue-chips, top IT, PSU): Lowest rates from 10.49%* p.a., loan amounts up to ₹1 Crore, zero processing fee offers.",
      "Category B & C (Mid-sized private limited firms, SME enterprises): Interest rates typically start from 12.5% to 16.0% p.a.",
      "Unlisted / Startups: Sanctioned based on 6 months salary bank statement and individual credit track record.",
    ],
    suggestedAction: { text: "Compare 50+ Partner Bank Rates", href: "#bank-comparison" },
  },
  {
    keywords: ["flat", "reducing", "flat rate", "reducing balance", "interest trap", "difference", "rate"],
    title: "Reducing Balance vs Flat Interest Rate Trap",
    response:
      "A common borrower mistake is choosing a loan advertising an '8% flat rate'. Under a flat rate, interest is calculated on the entire original principal for the entire loan tenure, even after you have paid off 80% of the loan.",
    keyPoints: [
      "An advertised 8% flat rate is actually equal to ~14.5% to 15.0% reducing balance rate!",
      "Fintaraa only lists reducing balance loans, where each monthly EMI reduces the principal and subsequent interest charges.",
      "Part-payments on a reducing balance loan immediately lower future interest outflows.",
    ],
    suggestedAction: { text: "Read the Interest Calculation Guide", href: "#seo-guide" },
  },
  {
    keywords: ["tax", "deduction", "section 80c", "section 24", "section 24b", "section 80e", "section 37", "income tax", "save tax"],
    title: "Income Tax Deductions on Personal Loans",
    response:
      "While personal loans have unrestricted end-use and no default tax exemption, Indian Income Tax Act allows substantial deductions if funds are deployed for specific legitimate purposes.",
    keyPoints: [
      "Section 24(b) - Home Renovation: Claim up to ₹30,000 (self-occupied) or up to ₹2,00,000 (rented property) on interest paid for house repairs or remodeling.",
      "Section 80E - Higher Education: Full interest deduction with no upper limit for up to 8 years when paying tuition for self, spouse, or children.",
      "Section 37(1) - Business Expense: 100% of the interest paid is deductible as a business expenditure if invested into working capital or equipment.",
    ],
    suggestedAction: { text: "Review Tax Exemption Sections", href: "#seo-guide" },
  },
  {
    keywords: ["foreclosure", "prepayment", "pre-closure", "charges", "rbi", "penalty", "lock-in", "early closure"],
    title: "RBI Rules on Personal Loan Foreclosure and Prepayments",
    response:
      "The Reserve Bank of India (RBI) mandates strict borrower protections regarding pre-closure and foreclosure penalties on retail personal loans.",
    keyPoints: [
      "Floating rate personal loans: 0% foreclosure penalty as per RBI guidelines.",
      "Fixed rate personal loans: Most partner lenders charge 0% foreclosure after 12 regular EMIs have been serviced.",
      "Part-payments: Lenders permit up to 25% of the outstanding balance to be prepaid each financial year with zero penalty fees.",
    ],
    suggestedAction: { text: "View Transparent Fee Schedule", href: "#fees-and-charges" },
  },
  {
    keywords: ["document", "documents", "paperwork", "digilocker", "kyc", "salary slip", "bank statement", "aadhaar", "pan"],
    title: "Required Documents for Instant 100% Paperless Approval",
    response:
      "Through DigiLocker e-KYC and RBI-licensed Account Aggregator network, Fintaraa enables a 100% digital, paperless loan journey without requiring physical branch visits.",
    keyPoints: [
      "Proof of Identity & Address: PAN card and Aadhaar card (auto-authenticated via mobile OTP in 10 seconds).",
      "Income Proof for Salaried: Latest 3 months salary slips showing basic salary, HRA, and deductions.",
      "Bank Verification: Latest 3 to 6 months salary account bank statements verified securely via Account Aggregator without uploading unencrypted PDF passwords.",
    ],
    suggestedAction: { text: "Check Document Checklist", href: "#documents" },
  },
  {
    keywords: ["self employed", "business", "itr", "turnover", "gst", "proprietorship", "doctor", "ca"],
    title: "Personal Loan Eligibility for Self-Employed & Business Owners",
    response:
      "Self-employed individuals, doctors, chartered accountants, and business owners can access unsecured personal loans up to ₹1 Crore based on annual audited turnover and filed Income Tax Returns.",
    keyPoints: [
      "Minimum Business Vintage: At least 2 to 3 years in the same business operations.",
      "Income Proof: Last 2 financial years filed ITR with Computation of Income, Balance Sheet, and P&L statement.",
      "Bank Statements: Last 6 to 12 months operative current and savings accounts.",
      "Business Proof: GST certificate, MSME Udyam registration, or Shop & Establishment certificate.",
    ],
    suggestedAction: { text: "Review Self-Employed Criteria", href: "#eligibility" },
  },
  {
    keywords: ["tenure", "period", "years", "months", "time", "how long", "repayment"],
    title: "Personal Loan Repayment Tenure Options",
    response:
      "Personal loans through Fintaraa offer flexible repayment horizons ranging from **1 Year (12 months) up to 7 Years (84 months)**, giving you complete freedom to structure an EMI that matches your monthly cashflow.",
    keyPoints: [
      "Shorter tenures (1 to 2 years): Higher monthly EMI, but lowest overall interest outflow.",
      "Longer tenures (3 to 7 years): Lower monthly installment, maintaining a healthy debt-to-income ratio (FOIR).",
      "You can prepay principal or close the loan early whenever you receive annual appraisal bonuses or financial windfalls.",
    ],
    suggestedAction: { text: "Test Different Tenures", href: "#emi-calculator" },
  },
  {
    keywords: ["emergency", "medical", "urgent", "instant", "fast", "speed", "24 hours", "disbursal", "same day"],
    title: "Instant Disbursal for Emergency & Medical Needs",
    response:
      "For urgent situations such as medical emergencies, unplanned hospital deposits, or urgent cash needs, Fintaraa offers priority digital routing with disbursal within 24 hours directly into your bank account.",
    keyPoints: [
      "Instant in-principle sanction in 2 minutes via digital soft check.",
      "Zero physical documentation or branch visit required.",
      "Disbursal directly to your savings account with zero end-use restrictions.",
    ],
    suggestedAction: { text: "Check Medical Loan Details", href: "#life-goals" },
  },
];

const INITIAL_SUGGESTION_CHIPS = [
  "How much loan can I get on my salary?",
  "Can I get a loan with 680 CIBIL score?",
  "How does company category affect interest rate?",
  "Flat rate vs Reducing balance difference?",
  "Can I claim tax deduction under Section 24b?",
  "What are RBI rules on foreclosure charges?",
  "What documents are needed for self-employed?",
  "How fast is disbursal for medical emergencies?",
];

export function LoanAiAdvisorChat({
  productName = "Personal Loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: {
  productName?: string;
  applyHref?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I am your **Fintaraa Loan AI Advisor**. Ask me anything without hesitation about ${productName} eligibility, CIBIL scores, company category rates, tax deductions, or EMI calculations. How can I help you today?`,
      keyPoints: [
        "100% unbiased financial answers based on RBI regulations & 50+ bank policies",
        "Instant calculations of eligibility, reducing vs flat rates, and document requirements",
        "Zero CIBIL impact inquiries and instant assistance",
      ],
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Ref strictly for the internal chat log to prevent window scroll jumping
  const chatLogContainerRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the inner chat log to the bottom, never the outer window
  const scrollToInnerBottom = () => {
    if (chatLogContainerRef.current) {
      chatLogContainerRef.current.scrollTo({
        top: chatLogContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToInnerBottom();
  }, [messages, isTyping]);

  const findBestAnswer = (query: string): KnowledgeItem => {
    const lower = query.toLowerCase();

    // Score knowledge items by matched keywords
    let bestMatch: KnowledgeItem | null = null;
    let maxScore = 0;

    for (const item of LOAN_AI_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && maxScore > 0) {
      return bestMatch;
    }

    // Default intelligent fallback
    return {
      keywords: [],
      title: `Information Regarding Your ${productName} Query`,
      response: `Thank you for asking about **"${query}"**. Personal loans through Fintaraa are unsecured credit facilities up to **₹1 Crore** with starting interest rates from **10.49%* p.a.** on a reducing balance basis. Approvals are determined by your CIBIL score (750+ preferred), monthly income, employer category, and Fixed Obligation to Income Ratio (FOIR under 50%).`,
      keyPoints: [
        "Loans available from ₹50,000 up to ₹1 Crore with zero collateral required.",
        "Repayment tenures range from 1 to 7 years (12 to 84 months).",
        "Paperless digital verification via DigiLocker e-KYC and Account Aggregator.",
        "Compare pre-approved quotes across 50+ partner banks without impacting your CIBIL score.",
      ],
      suggestedAction: { text: "Check Pre-Approved Bank Offers", href: "#bank-comparison" },
    };
  };

  const handleSendMessage = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    // Simulate AI thinking and responsive typing
    setTimeout(() => {
      const match = findBestAnswer(trimmed);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: match.response,
        keyPoints: match.keyPoints,
        ctaText: match.suggestedAction?.text,
        ctaHref: match.suggestedAction?.href,
        timestamp: "Just now",
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }, 550);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: `Conversation cleared. What else would you like to know about ${productName}s? Pick a prompt below or type your specific question!`,
        keyPoints: [
          "Ask about salary multiplier & loan eligibility calculations",
          "Ask about CIBIL score requirements & sub-prime options",
          "Ask about company categorization & partner bank interest rates",
        ],
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <section
      id="ai-advisor"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full max-w-7xl mx-auto px-4 pt-10 pb-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100 overflow-visible"
      aria-label="Fintaraa Loan AI Assistant"
    >
      {/* Header with Title & Intro */}
      <div className="max-w-2xl sm:max-w-3xl mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6424C7] to-purple-500 text-white shadow-[0_8px_20px_rgba(100,36,199,0.28)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Ask Fintaraa AI About Loans
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full select-none shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Ask anything without hesitation. Get instant, unbiased financial clarity on CIBIL thresholds, company categorization, tax deductions, and reducing vs flat rate traps.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-8 pr-2 sm:pr-28 md:pr-48">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2 select-none">
          <HelpCircle className="h-3.5 w-3.5 text-[#6424C7]" />
          <span>Popular Questions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {INITIAL_SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={(e) => {
                // Prevent any default focus jumping that might trigger page scroll
                e.preventDefault();
                handleSendMessage(chip);
              }}
              className="rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#6424C7] hover:border-purple-200/80 border border-slate-200/70 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer select-none active:scale-[0.98] shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Relative Wrapper with Girl Pointing Down Illustration at Top-Right */}
      <div className="relative">
        
        {/* Girl illustration perched on top right, pointing fingers down into the chat terminal */}
        <div className="absolute -top-24 sm:-top-32 md:-top-40 right-2 sm:right-6 md:right-10 w-28 sm:w-36 md:w-48 pointer-events-none z-20 select-none">
          <div className="relative">
            {/* Playful Floating Speech Bubble */}
            <div className="absolute -top-6 sm:-top-8 -left-12 sm:-left-16 bg-white/95 backdrop-blur-md border border-purple-200/90 rounded-2xl px-3 py-1 text-[11px] font-black text-[#6424C7] shadow-md flex items-center gap-1.5 whitespace-nowrap animate-bounce [animation-duration:3s]">
              <span>Ask me anything! 👇</span>
            </div>

            <Image
              src="/assets/hero/hero_girlmobileview.png"
              alt="Fintaraa Loan Advisor pointing down to chat window"
              width={1145}
              height={1374}
              className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(100,36,199,0.25)]"
              priority
            />
          </div>
        </div>

        {/* Enhanced ChatGPT-style Terminal Container */}
        <div className="relative rounded-3xl border border-purple-200/80 bg-white shadow-[0_16px_48px_-12px_rgba(100,36,199,0.14)] overflow-hidden flex flex-col min-h-[460px] max-h-[640px]">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md px-5 py-3 select-none">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800">Fintaraa Loan Model v2.4</span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                • Trained on RBI Fair Lending Norms &amp; 50+ Bank Policies
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#6424C7] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Internal Message Log (Only this container scrolls internally, NEVER the window) */}
          <div
            ref={chatLogContainerRef}
            tabIndex={-1}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 [scrollbar-width:thin] focus:outline-none"
          >
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 sm:gap-4 ${
                    isAi ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* AI Avatar */}
                  {isAi && (
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6424C7] to-purple-600 text-white shadow-sm mt-0.5">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isAi
                        ? "bg-white border border-slate-200/90 text-slate-800 shadow-2xs"
                        : "bg-gradient-to-r from-[#6424C7] to-[#7c3aed] text-white shadow-md"
                    }`}
                  >
                    {/* Message Text with simple bold parser */}
                    <div className="font-normal text-xs sm:text-sm">
                      {msg.text.split(/(\*\*.*?\*\*)/g).map((chunk, i) => {
                        if (chunk.startsWith("**") && chunk.endsWith("**")) {
                          return (
                            <strong key={i} className="font-bold">
                              {chunk.slice(2, -2)}
                            </strong>
                          );
                        }
                        return chunk;
                      })}
                    </div>

                    {/* Structured Key Points (if present) */}
                    {msg.keyPoints && msg.keyPoints.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                        {msg.keyPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6424C7] shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Action & Copy Footer */}
                    {isAi && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        {msg.ctaText && msg.ctaHref ? (
                          <a
                            href={msg.ctaHref}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6424C7] hover:text-[#521eb0] transition-colors"
                          >
                            <span>{msg.ctaText}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <AuthRedirectLink
                            href={applyHref}
                            productSlug="personal-loan"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6424C7] hover:text-[#521eb0] transition-colors"
                          >
                            <span>Check Free Pre-Approved Offers</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </AuthRedirectLink>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {!isAi && (
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 shadow-sm mt-0.5">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6424C7] to-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#6424C7] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-[#6424C7] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-[#6424C7] animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar (ChatGPT Styled) */}
          <div className="border-t border-slate-200/80 bg-white p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputQuery);
              }}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 focus-within:border-[#6424C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-[#6424C7] shrink-0" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any question about loans without hesitation (e.g. Can I get a loan with 680 CIBIL score?)..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  inputQuery.trim() && !isTyping
                    ? "bg-[#6424C7] text-white hover:bg-[#521eb0] shadow-sm active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </form>
            <div className="mt-2 text-center text-[10.5px] text-slate-400 font-medium select-none">
              Fintaraa AI provides instant informational insights. Formal loan approvals are subject to bank underwriting.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
