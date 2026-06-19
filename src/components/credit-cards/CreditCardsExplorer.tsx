import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

// Mock structured mock dataset reflecting the exact text strings in image_f134df.jpg
const cardsData = [
  {
    id: "1",
    bankName: "HDFC Bank",
    cardName: "HDFC Millennia Credit Card",
    logo: "/assets/banks/hdfc.png",
    cardBg: "bg-gradient-to-br from-[#0c2340] to-[#1d3557]",
    tags: ["Cashback", "Shopping"],
    bullets: [
      "5% Cashback on Online Spends",
      "1% Cashback on All Other Spends",
      "Dining & Lifestyle Benefits"
    ],
    annualFee: "₹1,000",
    rewardRate: "5%",
    welcomeText: "₹1,000 Amazon Voucher",
    welcomeSub: "Welcome Benefit"
  },
  {
    id: "2",
    bankName: "SBI Card",
    cardName: "SBI Cashback Credit Card",
    logo: "/assets/banks/sbi.png",
    cardBg: "bg-gradient-to-br from-[#00669e] to-[#003a66]",
    tags: ["Cashback", "Online"],
    bullets: [
      "5% Cashback on Online Spends",
      "1% Cashback on Other Spends",
      "No Cost EMI & More"
    ],
    annualFee: "₹999",
    rewardRate: "5%",
    welcomeText: "₹500 Cashback",
    welcomeSub: "Welcome Benefit"
  },
  {
    id: "3",
    bankName: "Axis Bank",
    cardName: "Axis Flipkart Credit Card",
    logo: "/assets/banks/axis.png",
    cardBg: "bg-gradient-to-br from-[#111] to-[#2b0016]",
    tags: ["Shopping", "Rewards"],
    bullets: [
      "5% Unlimited Cashback on Flipkart",
      "4% on Preferred Categories",
      "No Joining Fee"
    ],
    annualFee: "₹500",
    rewardRate: "5%",
    welcomeText: "₹500 Flipkart Voucher",
    welcomeSub: "Welcome Benefit"
  },
  {
    id: "4",
    bankName: "ICICI Bank",
    cardName: "ICICI Amazon Pay Credit Card",
    logo: "/assets/banks/icici.png",
    cardBg: "bg-gradient-to-br from-[#1c1917] to-[#442312]",
    tags: ["Cashback", "Amazon"],
    bullets: [
      "5% Cashback on Amazon",
      "2% on Amazon Pay Merchants",
      "1% on Other Spends"
    ],
    annualFee: "Lifetime Free",
    rewardRate: "5%",
    welcomeText: "₹750 Amazon Voucher",
    welcomeSub: "Welcome Benefit"
  }
];

const whyChooseItems = [
  { id: 1, title: "Best Card Recommendations", text: "AI-powered suggestions tailored for you", icon: "📊" },
  { id: 2, title: "100% Secure Process", text: "Your data is encrypted & kept safe", icon: "🔒" },
  { id: 3, title: "Trusted Banking Partners", text: "Partnered with top banks in India", icon: "🤝" },
  { id: 4, title: "Fast Approval Support", text: "Apply digitally with end-to-end assistance", icon: "⚡" },
  { id: 5, title: "No Hidden Charges", text: "Transparent information always", icon: "💎" }
];

export function CreditCardsExplorer() {
  return (
    <section className="bg-[#f8faff] px-4 py-8 md:px-6 lg:px-8 font-sans antialiased text-[#1a1d25]">
      <div className="mx-auto max-w-9xl">
        
        {/* Top Breadcrumb / Structural Grid wrapper */}
        <div className="grid gap-6 lg:grid-cols-[260px_1fr] items-start">
          
          {/* LEFT COLUMN: Sidebar Filters Panel */}
          <aside className="bg-white rounded-xl border border-[#e2edf6] p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f8]">
              <span className="text-[14px] font-bold text-[#1a1d25]">Filters</span>
              <button className="text-[12px] font-medium text-[#7a869a] hover:text-[#005ca8]">Clear All</button>
            </div>

            {/* Banks Segment Accordion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span>Banks</span>
                <ChevronUp className="h-4 w-4 text-[#7a869a]" />
              </div>
              
              {/* Mini Inside Search Filter */}
              <div className="relative flex items-center h-8 bg-[#f4f7fa] rounded-md px-2.5 border border-[#e2e8f0]">
                <Search className="h-3.5 w-3.5 text-[#9aa5b5] mr-2" />
                <input type="text" placeholder="Search Bank" className="w-full bg-transparent text-[12px] outline-none placeholder-[#9aa5b5]" />
              </div>

              <div className="space-y-2 text-[12px] font-medium text-[#4a5568]">
                {["HDFC Bank (28)", "SBI Card (22)", "ICICI Bank (18)", "Axis Bank (16)", "IDFC FIRST Bank (12)", "AU Small Finance (9)", "IndusInd Bank (8)"].map((bank) => (
                  <label key={bank} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0" />
                    <span>{bank}</span>
                  </label>
                ))}
              </div>
              <button className="text-[12px] font-bold text-[#005ca8] hover:underline">+ View More</button>
            </div>

            {/* Category Segment Accordion */}
            <div className="pt-4 border-t border-[#f0f4f8] space-y-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span>Category</span>
                <ChevronUp className="h-4 w-4 text-[#7a869a]" />
              </div>
              <div className="space-y-2 text-[12px] font-medium text-[#4a5568]">
                {["Cashback (32)", "Travel (28)", "Fuel (20)", "Rewards (26)", "Premium (18)", "Lifetime Free (14)", "Grocery (10)"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
              <button className="text-[12px] font-bold text-[#005ca8] hover:underline">+ View More</button>
            </div>

            {/* Annual Fee Slider Selector Block */}
            <div className="pt-4 border-t border-[#f0f4f8] space-y-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span>Annual Fee</span>
                <ChevronUp className="h-4 w-4 text-[#7a869a]" />
              </div>
              <div className="space-y-2 text-[12px] font-medium text-[#4a5568]">
                {["Lifetime Free (14)", "Under ₹500 (22)", "₹500 - ₹2500 (36)", "₹2500 - ₹5000 (18)", "Above ₹5000 (12)"].map((fee) => (
                  <label key={fee} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0" />
                    <span>{fee}</span>
                  </label>
                ))}
              </div>
              {/* Range Slider Track Graphic */}
              <div className="pt-2">
                <div className="h-1 bg-[#e2e8f0] rounded relative">
                  <div className="absolute left-0 right-1/4 h-full bg-[#005ca8] rounded" />
                  <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#005ca8]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#7a869a] mt-2">
                  <span>₹0</span>
                  <span>₹50,000+</span>
                </div>
                <button className="mt-3 w-full py-1.5 border border-[#cbd5e1] rounded text-[11px] font-bold text-[#4a5568] hover:bg-gray-50">
                  Apply
                </button>
              </div>
            </div>

            {/* Stacked Collapsed Headers */}
            {["Minimum Income", "Credit Score", "Reward Type", "Welcome Benefits"].map((header) => (
              <div key={header} className="pt-4 border-t border-[#f0f4f8] flex items-center justify-between text-[13px] font-bold cursor-pointer text-[#1a1d25]">
                <span>{header}</span>
                <ChevronDown className="h-4 w-4 text-[#7a869a]" />
              </div>
            ))}
          </aside>

          {/* RIGHT COLUMN: Product Output Deck & Results Header */}
          <div className="space-y-4">
            
            {/* Inner Dashboard Header Control */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-[#e2edf6]">
              <span className="text-[14px] font-bold text-[#1a1d25]">152 Cards Found</span>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-[#7a869a] font-medium">Sort By:</span>
                <div className="flex items-center bg-white border border-[#cbd5e1] rounded-lg px-3 py-1.5 font-bold cursor-pointer gap-2">
                  <span>Most Popular</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#4a5568]" />
                </div>
              </div>
            </div>

            {/* Core Product Cards Row Container Grid Layout */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cardsData.map((card) => (
                <article key={card.id} className="bg-white rounded-2xl border border-[#e2edf6] p-4 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
                  
                  {/* Top Inline Header Row */}
                  <div>
                    <div className="flex items-center justify-between gap-2 h-7">
                      <div className="relative w-24 h-6">
                        {/* Inline fallback header label if logo string asset path is custom or broken */}
                        <span className="text-[12px] font-black text-[#005ca8]">{card.bankName}</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] text-[#7a869a] font-medium cursor-pointer">
                        <input type="checkbox" className="rounded border-[#cbd5e1] text-[#005ca8] focus:ring-0" />
                        <span>Compare</span>
                      </label>
                    </div>

                    {/* Plastic Card Vector Aspect Graphics Representation Section */}
                    <div className={`mt-3 w-full h-28 rounded-xl ${card.cardBg} p-3 flex flex-col justify-between text-white relative shadow-sm overflow-hidden`}>
                      <div className="flex justify-between items-start">
                        <div className="text-[9px] font-semibold tracking-wider opacity-60 uppercase">{card.bankName}</div>
                        <div className="w-5 h-3.5 bg-amber-400/80 rounded-xs" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[8px] tracking-widest opacity-80 font-mono">•••• •••• •••• 8832</div>
                        <div className="flex justify-between items-end">
                          <div className="text-[7px] font-mono opacity-50">VAL THRU 08/30</div>
                          <div className="text-[11px] font-black italic tracking-wide opacity-90">VISA</div>
                        </div>
                      </div>
                    </div>

                    {/* Product Name Headings */}
                    <h3 className="mt-4 text-[14px] font-bold text-[#1a1d24] leading-snug min-h-10">
                      {card.cardName}
                    </h3>

                    {/* Meta Category Target Pill Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className="bg-[#eef2ff] text-[#4f46e5] text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Feature Lists Dot Bullets */}
                    <ul className="mt-4 space-y-2 border-b border-[#f3f7fa] pb-4">
                      {card.bullets.map((bullet, i) => (
                        <li key={i} className="text-[12px] text-[#4a5568] font-medium flex items-start gap-1.5">
                          <span className="text-[#a0aec0] mt-0.5 text-[10px]">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Matrix Block Section */}
                  <div>
                    <div className="grid grid-cols-2 gap-2 text-center py-3 bg-[#fafcfe] rounded-xl my-3 border border-[#f0f4f8]">
                      <div>
                        <span className="block text-[13px] font-bold text-[#1a1d24]">{card.annualFee}</span>
                        <span className="text-[10px] font-medium text-[#7a869a]">Annual Fee</span>
                      </div>
                      <div className="border-l border-[#eef2f6]">
                        <span className="block text-[13px] font-bold text-[#1a1d24]">{card.rewardRate}</span>
                        <span className="text-[10px] font-medium text-[#7a869a]">Reward Rate</span>
                      </div>
                    </div>

                    {/* Voucher Welcome Rewards Alert Area */}
                    <div className="mb-4 text-left">
                      <div className="text-[12px] font-bold text-[#005ca8]">{card.welcomeText}</div>
                      <div className="text-[10px] font-medium text-[#9aa5b5]">{card.welcomeSub}</div>
                    </div>

                    {/* Action Triggers Grid Footer */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 rounded-lg border border-[#005ca8] text-[12px] font-bold text-[#005ca8] bg-white hover:bg-[#f4f9ff] transition-colors">
                          View Details
                        </button>
                        <AuthRedirectLink
                          href="/credit-cards"
                          productSlug={card.cardName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                          className="py-2 rounded-lg bg-[#005ca8] hover:bg-[#004b87] text-center text-[12px] font-bold text-white shadow-xs transition-colors no-underline"
                        >
                          Apply Now
                        </AuthRedirectLink>
                      </div>
                      <button className="w-full text-center text-[11px] font-bold text-[#005ca8] hover:underline pt-1 block">
                        Check Eligibility
                      </button>
                    </div>
                  </div>

                </article>
              ))}
            </div>

            {/* Floating Live Card Comparison Tray Context Section matching image_f134df.jpg */}
            <div className="bg-white rounded-xl border border-[#e2edf6] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[14px] font-bold text-[#005ca8]">2/3 Cards Selected</span>
                </div>
                
                {/* Horizontal Thumbnails Collection preview row */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 rounded bg-slate-800 border border-slate-700 relative overflow-hidden flex items-center justify-center text-white text-[6px]">CARD A</div>
                  <div className="w-12 h-8 rounded bg-blue-900 border border-blue-800 relative overflow-hidden flex items-center justify-center text-white text-[6px]">CARD B</div>
                  <div className="w-12 h-8 rounded border-2 border-dashed border-[#cbd5e1] bg-gray-50 flex items-center justify-center text-[#cbd5e1] text-[16px] font-light">+</div>
                </div>
                <span className="text-[12px] text-[#7a869a] font-medium">Select up to 3 cards to compare</span>
              </div>

              <button className="bg-[#005ca8] hover:bg-[#004b87] px-6 py-2.5 rounded-lg text-[13px] font-bold text-white flex items-center gap-2 transition-colors">
                <span>Compare Now</span>
                <span>→</span>
              </button>
            </div>

            {/* Value Proposition Grid: "Why Choose Fintaraa" Bottom Row Section */}
            <div className="pt-6 space-y-4">
              <h4 className="text-[15px] font-bold text-[#1a1d25]">Why choose Fintaraa for Credit Cards ?</h4>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {whyChooseItems.map((item) => (
                  <div key={item.id} className="bg-white border border-[#e2edf6] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="text-[20px] mb-2">{item.icon}</div>
                    <div>
                      <h5 className="text-[12px] font-bold text-[#1a1d25] leading-tight mb-1">{item.title}</h5>
                      <p className="text-[10px] text-[#7a869a] font-medium leading-normal">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
