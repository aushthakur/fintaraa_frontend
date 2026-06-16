import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Zap,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function CibilPromo() {
  const features = [
    {
      icon: <Lock className="h-4 w-4 text-blue-600" />,
      title: "Secure & Private",
      desc: "Your data is 100% safe with bank-grade security",
    },
    {
      icon: <Zap className="h-4 w-4 text-blue-600" />,
      title: "Instant Results",
      desc: "Get your score in seconds",
    },
    {
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      title: "Detailed Report",
      desc: "Understand factors affecting your score",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-blue-600" />,
      title: "No Impact",
      desc: "Checking your score won't reduce it",
    },
  ];

  return (
    <section className="px-4 py-6 w-full max-w-9xl mx-auto">
      <div className="relative flex flex-col lg:flex-row items-center justify-between rounded-3xl bg-[#f4f8ff] overflow-hidden border border-blue-50/50">
        
        {/* Subtle Background Pattern (Right Side) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 mask-image-[linear-gradient(to_left,white,transparent)] z-0" />

        {/* --- LEFT COLUMN --- */}
        <div className="flex-1 px-5 sm:px-8 py-8 md:px-12 md:py-10 z-10 w-full lg:max-w-[60%]">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-[11px] font-bold text-blue-700 mb-6 border border-blue-200/50">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
            100% Free • No Impact on Score
          </div>

          {/* Typography */}
          <h2 className="text-[26px] sm:text-3xl md:text-[40px] font-extrabold leading-[1.1] text-[#111827] tracking-tight">
            Your Credit Health,
            <span className="block text-[#0b57d0] mt-1">Your Financial Freedom</span>
          </h2>
          
          <p className="mt-4 text-[14px] md:text-[15px] text-gray-500 font-medium max-w-120 leading-relaxed">
            Check your CIBIL score and report instantly. Know where you stand
            and unlock better loan & credit card offers.
          </p>

          {/* Features Row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
            {features.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-blue-50">
                  {item.icon}
                </div>
                <div className="flex flex-col mt-0.5">
                  <h4 className="text-[12px] font-bold text-gray-900 leading-none">{item.title}</h4>
                  <p className="text-[10px] font-medium text-gray-500 leading-tight mt-1.5 pr-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="relative w-full lg:w-[45%] flex shrink-0 items-end justify-center pt-4 sm:pt-8 pb-0 px-4 z-10 min-h-50 sm:min-h-75">
          
          {/* Decorative Star Left */}
          <div className="absolute top-[20%] left-[15%] text-blue-200 animate-pulse hidden sm:block">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
            </svg>
          </div>
          
          {/* Decorative Star Right */}
          <div className="absolute top-[25%] right-[25%] text-blue-200 animate-pulse delay-75 hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
            </svg>
          </div>

          {/* Floating Shield Graphic */}
          <div className="absolute top-[25%] right-[5%] z-0 h-20 w-16 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] items-center justify-center border border-white hidden sm:flex">
            <div className="bg-blue-500 rounded-lg p-2.5">
              <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Floating Chart Graphic */}
          <div className="absolute bottom-[10%] right-[2%] z-30 h-24 w-24 bg-transparent items-end justify-between gap-1.5 opacity-90 hidden sm:flex">
             {/* Trend line SVG */}
             <svg className="absolute top-2 left-0 w-full h-12 text-blue-400 drop-shadow-sm" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M 5 40 L 35 25 L 65 15 L 95 0" />
                <circle cx="95" cy="0" r="4" fill="currentColor" />
                <circle cx="65" cy="15" r="3" fill="currentColor" />
                <circle cx="35" cy="25" r="3" fill="currentColor" />
                <circle cx="5" cy="40" r="3" fill="currentColor" />
             </svg>
             {/* Bars */}
             <div className="w-4 h-[30%] bg-blue-300 rounded-t-sm rounded-b-sm opacity-70"></div>
             <div className="w-4 h-[50%] bg-blue-400 rounded-t-sm rounded-b-sm opacity-80"></div>
             <div className="w-4 h-[75%] bg-blue-500 rounded-t-sm rounded-b-sm"></div>
             <div className="w-4 h-full bg-emerald-400 rounded-t-sm rounded-b-sm"></div>
          </div>

          {/* Gauge & CTA Card Wrapper */}
          <div className="relative flex flex-col items-center w-full max-w-90 pb-4 sm:pb-6">
            
            {/* Speedometer Gauge Graphic */}
            <div className="relative w-48 sm:w-60 h-24 sm:h-30 -mb-8 sm:-mb-10 z-10">
              <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-sm">
                {/* Red Arc */}
                <path d="M 20 100 A 80 80 0 0 1 43.4 43.4" fill="none" stroke="#ef4444" strokeWidth="24" />
                {/* Yellow Arc */}
                <path d="M 43.4 43.4 A 80 80 0 0 1 100 20" fill="none" stroke="#f59e0b" strokeWidth="24" />
                {/* Yellow-Green Arc */}
                <path d="M 100 20 A 80 80 0 0 1 156.6 43.4" fill="none" stroke="#eab308" strokeWidth="24" />
                {/* Green Arc */}
                <path d="M 156.6 43.4 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" strokeWidth="24" />
                
                {/* Needle Base */}
                <circle cx="100" cy="100" r="12" fill="#1e3a8a" />
                <circle cx="100" cy="100" r="4" fill="#ffffff" />
                {/* Needle Pointer */}
                <path d="M 100 100 L 145 55" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>

            {/* CTA Card Overlapping Gauge */}
            <div className="relative z-20 w-[95%] sm:w-full rounded-3xl bg-white/95 backdrop-blur-sm p-5 pb-6 text-center shadow-[0_15px_40px_-10px_rgba(0,40,100,0.08)] border border-white">
              <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">
                Check Free CIBIL Score
              </h3>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                in just 2 minutes
              </p>
              
              <Link
                href="/cibil-score/report"
                className="mt-4 flex h-11.5 w-full items-center justify-center gap-2 rounded-lg bg-[#0b57d0] px-6 text-[14px] font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
              >
                Check My Score Now
                <span className="text-lg font-normal leading-none mb-0.5">→</span>
              </Link>

              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                Join 58 Million+ users who trust Fintaraa
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}