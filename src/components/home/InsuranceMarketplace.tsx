"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const marqueeInsurances = [
  {
    title: "Health Insurance",
    subtitle: "From ₹450/mo",
    description: "Cashless treatment at 10,000+ network hospitals with zero room rent cap",
    href: "/products/health-insurance",
    image: "/assets/insurance/health.jpg"
  },
  {
    title: "Life Insurance",
    subtitle: "Guaranteed Payout",
    description: "Financial security for your family's future with tax savings u/s 80C",
    href: "/products/life-insurance",
    image: "/assets/insurance/life.jpg"
  },
  {
    title: "Motor Insurance",
    subtitle: "Instant Renewal",
    description: "Zero inspection paperless policy with 24/7 roadside assistance",
    href: "/products/motor-insurance",
    image: "/assets/insurance/car.jpg"
  },
  {
    title: "Term Insurance",
    subtitle: "₹1 Cr from ₹490/mo",
    description: "Maximum life protection cover at affordable disciplined premiums",
    href: "/products/term-insurance",
    image: "/assets/insurance/term.jpg"
  },
  {
    title: "Travel Insurance",
    subtitle: "From ₹250/trip",
    description: "Overseas medical emergency, flight delay & baggage loss coverage",
    href: "/products/travel-insurance",
    image: "/assets/insurance/travel.jpg"
  }
];

export function InsuranceMarketplace() {
  return (
    <section
      id="insurance"
      className="scroll-mt-20 overflow-hidden"
      aria-label="Protect What Matters"
      style={{
        background: "#ffffff",
        padding: "40px 0",
      }}
    >


      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>
        {/* Section Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
          position: "relative",
          zIndex: 1,
        }}>
          <div>
            <p style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7c3aed",
              marginBottom: 6,
              fontWeight: 500,
            }}>
              Coverage for every stage of life
            </p>
            <h2 style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}>
              Protect What Matters
            </h2>
            <p style={{
              marginTop: 6,
              fontSize: 13,
              color: "#64748b",
              fontWeight: 400,
              maxWidth: 480,
            }}>
              Compare health, life, motor, travel and commercial plans — all in one place.
            </p>
            <div style={{
              marginTop: 10,
              height: 1,
              background: "linear-gradient(90deg, #7c3aed, rgba(124,58,237,0))",
              width: 160,
            }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/products?category=Insurance"
              className="hover:bg-[#5b21b6]/10 hover:border-[#5b21b6]/50"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                fontWeight: 500,
                color: "#5b21b6",
                textDecoration: "none",
                border: "1px solid rgba(91,33,182,0.25)",
                borderRadius: 100,
                padding: "7px 16px",
                background: "rgba(91,33,182,0.06)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              View all plans <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Puzzle Grid Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 mt-4 relative z-10">
        <div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{ gridAutoRows: "minmax(280px, 320px)" }}
        >
          {marqueeInsurances.map((item, index) => {
            let gridClass = "";
            if (index === 0) gridClass = "md:col-span-2 md:row-span-1"; // 2 cols wide
            else if (index === 1) gridClass = "md:col-span-1 md:row-span-1"; // 1 col wide
            else if (index === 2) gridClass = "md:col-span-1 md:row-span-1"; // 1 col wide
            else if (index === 3) gridClass = "md:col-span-2 md:row-span-1"; // 2 cols wide
            else if (index === 4) gridClass = "md:col-span-2 md:row-span-1"; // 2 cols wide
            
            return (
              <div key={item.title} className={`group/card relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl ${gridClass}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover/card:opacity-95" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 text-white">
                  <h3 className="text-[18px] sm:text-[22px] font-bold leading-tight mb-1">{item.title}</h3>
                  <p className="text-[13px] sm:text-[14px] font-semibold text-white mb-2">{item.subtitle}</p>
                  <p className="text-[12px] sm:text-[13px] text-gray-200 line-clamp-2 mb-4 max-w-[85%]">{item.description}</p>
                  <Link
                    href={item.href}
                    className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-white transition hover:text-[#c4b5fd]"
                  >
                    Compare Plans <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
