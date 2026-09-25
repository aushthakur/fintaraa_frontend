"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const carouselDestinations = [
  {
    id: "us",
    title: "United States",
    subtitle: "Ivy League & STEM",
    highlight: "Up to ₹1.5 Cr • 3-Yr OPT",
    image: "/assets/education-hero/us-campus.jpg",
    flag: "🇺🇸",
  },
  {
    id: "intl",
    title: "Canada & Europe",
    subtitle: "SDS & Public Unis",
    highlight: "Zero Collateral up to ₹75L",
    image: "/assets/education-hero/intl-campus.jpg",
    flag: "🇨🇦",
  },
  {
    id: "uk",
    title: "United Kingdom",
    subtitle: "Russell Group Unis",
    highlight: "100% Living + Tuition",
    image: "/assets/education-hero/uk-london.jpg",
    flag: "🇬🇧",
  },
];

export function EducationHeroBackground() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % carouselDestinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeRightCard = carouselDestinations[activeIdx];
  const activeLeftCard = carouselDestinations[(activeIdx + 1) % carouselDestinations.length];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Custom keyframe animations */}
      <style>{`
        @keyframes floatLeftMain {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes floatLeftSub {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          50% { transform: translateY(10px) rotate(0deg); }
        }
        @keyframes floatRightMain {
          0%, 100% { transform: translateY(0px) rotate(1.2deg); }
          50% { transform: translateY(-10px) rotate(-0.8deg); }
        }
        @keyframes floatRightSub {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(12px) rotate(0.5deg); }
        }
        @keyframes ribbonFlow {
          0%, 100% { transform: translateX(0px) scale(1); opacity: 0.5; }
          50% { transform: translateX(20px) scale(1.04); opacity: 0.8; }
        }
        .edu-float-left-main {
          animation: floatLeftMain 5.2s ease-in-out infinite;
        }
        .edu-float-left-sub {
          animation: floatLeftSub 6.8s ease-in-out infinite;
        }
        .edu-float-right-main {
          animation: floatRightMain 5.8s ease-in-out infinite;
        }
        .edu-float-right-sub {
          animation: floatRightSub 7.2s ease-in-out infinite;
        }
        .edu-ribbon-anim {
          animation: ribbonFlow 10s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .edu-float-left-main, .edu-float-left-sub, .edu-float-right-main, .edu-float-right-sub, .edu-ribbon-anim {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Layer 1: Soft White to Lavender Gradient & Ambient Glows ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 via-slate-50/20 to-white" />

      {/* Left Radial Lavender Glow */}
      <div
        className="absolute top-1/3 left-[-5%] w-[550px] h-[450px] rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(91, 33, 182, 0.08) 50%, transparent 75%)",
        }}
      />

      {/* Right Radial Lavender Glow */}
      <div
        className="absolute top-1/4 right-[-5%] w-[600px] h-[500px] rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(91, 33, 182, 0.09) 50%, transparent 75%)",
        }}
      />

      {/* ── Layer 2: Flowing SVG Ribbon Lines ── */}
      <svg
        className="absolute top-6 left-0 w-full h-[400px] text-purple-300/30 edu-ribbon-anim"
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 180 C 300 40, 600 320, 1000 100 C 1250 -20, 1450 250, 1600 160"
          stroke="url(#ribbonGrad1)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M -120 230 C 250 80, 650 360, 1050 140 C 1300 10, 1480 300, 1650 200"
          stroke="url(#ribbonGrad2)"
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <defs>
          <linearGradient id="ribbonGrad1" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5b21b6" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="ribbonGrad2" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="1" stopColor="#c084fc" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── 2 FLOATING CARDS ON THE LEFT SIDE OF THE FORM ── */}
      <div className="hidden lg:block">
        {/* Card 1 (Upper Left of Form): Primary Student Portrait Card */}
        <div className="absolute top-[35px] left-[43%] xl:left-[47%] 2xl:left-[50%] w-[185px] xl:w-[210px] rounded-2xl border-2 border-white bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(91,33,182,0.14)] backdrop-blur-md edu-float-left-main z-10">
          <div className="relative h-[165px] xl:h-[190px] w-full rounded-xl overflow-hidden bg-slate-100">
            <Image
              src="/assets/education-hero/student-portrait.jpg"
              alt="Indian Student Study Abroad"
              fill
              sizes="210px"
              className="object-cover object-top"
              priority
            />
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[8.5px] font-semibold text-[#5b21b6] shadow-xs backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Pre-Visa</span>
            </div>
          </div>
          <div className="p-1">
            <p className="text-[10px] font-medium text-slate-800 leading-tight">Global Student Merit</p>
            <p className="text-[9px] text-[#5b21b6] font-medium mt-0.5">IIT • IIM • Global Admits</p>
          </div>
        </div>

        {/* Card 2 (Lower Left of Form): Secondary Destination Card */}
        <div className="absolute top-[280px] left-[45%] xl:left-[49%] 2xl:left-[52%] w-[175px] xl:w-[195px] rounded-2xl border border-white/90 bg-white/90 p-1.5 shadow-[0_12px_32px_rgba(91,33,182,0.1)] backdrop-blur-md edu-float-left-sub z-10 transition-all duration-700">
          <div className="relative h-[100px] xl:h-[115px] w-full rounded-xl overflow-hidden">
            <Image
              key={activeLeftCard.id}
              src={activeLeftCard.image}
              alt={activeLeftCard.title}
              fill
              sizes="195px"
              className="object-cover transition-opacity duration-700"
            />
            <div className="absolute top-1.5 left-1.5 rounded-lg bg-black/50 px-1.5 py-0.5 text-[8.5px] text-white backdrop-blur-xs font-medium flex items-center gap-1">
              <span>{activeLeftCard.flag}</span>
              <span>{activeLeftCard.title}</span>
            </div>
          </div>
          <div className="p-1">
            <p className="text-[9.5px] font-semibold text-slate-800 line-clamp-1">{activeLeftCard.subtitle}</p>
            <p className="text-[8.5px] text-[#5b21b6] font-medium mt-0.5">{activeLeftCard.highlight}</p>
          </div>
        </div>
      </div>

      {/* ── 2 FLOATING CARDS ON THE RIGHT SIDE OF THE FORM ── */}
      <div className="hidden xl:block">
        {/* Card 3 (Right Top): Destination Card Floating Right of Form */}
        <div className="absolute top-[30px] right-[1.5%] 2xl:right-[4%] w-[195px] 2xl:w-[220px] rounded-2xl border border-white bg-white/90 p-2 shadow-[0_16px_40px_rgba(91,33,182,0.12)] backdrop-blur-md edu-float-right-main z-10 transition-all duration-700">
          <div className="relative h-[115px] 2xl:h-[130px] w-full rounded-xl overflow-hidden">
            <Image
              key={activeRightCard.id}
              src={activeRightCard.image}
              alt={activeRightCard.title}
              fill
              sizes="220px"
              className="object-cover transition-opacity duration-700"
            />
            <div className="absolute top-2 left-2 rounded-lg bg-[#5b21b6] px-2 py-0.5 text-[9.5px] text-white font-medium flex items-center gap-1 shadow-xs">
              <span>{activeRightCard.flag}</span>
              <span>{activeRightCard.title}</span>
            </div>
          </div>
          <div className="p-1.5">
            <p className="text-[10.5px] font-semibold text-slate-900 line-clamp-1">{activeRightCard.subtitle}</p>
            <p className="text-[9.5px] text-emerald-700 font-medium mt-0.5">{activeRightCard.highlight}</p>
          </div>
        </div>

        {/* Card 4 (Right Bottom): UK / London Destination Card Floating Right of Form */}
        <div className="absolute top-[280px] right-[2.5%] 2xl:right-[5.5%] w-[190px] 2xl:w-[210px] rounded-2xl border border-white/90 bg-white/85 p-2 shadow-[0_12px_32px_rgba(91,33,182,0.09)] backdrop-blur-md edu-float-right-sub z-10">
          <div className="relative h-[110px] 2xl:h-[120px] w-full rounded-xl overflow-hidden">
            <Image
              src="/assets/education-hero/uk-london.jpg"
              alt="UK Education Loan"
              fill
              sizes="210px"
              className="object-cover"
            />
            <div className="absolute top-2 left-2 rounded-lg bg-black/50 px-2 py-0.5 text-[9.5px] text-white backdrop-blur-xs font-medium flex items-center gap-1">
              <span>🇬🇧</span>
              <span>UK & London</span>
            </div>
          </div>
          <div className="p-1.5">
            <p className="text-[10px] font-semibold text-slate-800">CAS & Visa Proof</p>
            <p className="text-[9px] text-[#5b21b6] font-medium mt-0.5">100% Tuition & Living</p>
          </div>
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="hidden lg:flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-2 pointer-events-auto z-30">
        {carouselDestinations.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            aria-label={`Go to ${d.title}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIdx ? "w-6 bg-[#5b21b6]" : "w-2 bg-purple-200 hover:bg-purple-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
