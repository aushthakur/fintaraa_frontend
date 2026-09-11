"use client";

import Link from "next/link";
import {
  HeartPulse,
  Umbrella,
  Car,
  ShieldCheck,
  Store,
  Plane,
  ArrowRight,
} from "lucide-react";

interface InsuranceItem {
  id: string;
  name: string;
  metric: string;
  detail: string;
  href: string;
  icon: typeof HeartPulse;
  accentColor: string;
  glowColor: string;
}

const insuranceList: InsuranceItem[] = [
  {
    id: "health",
    name: "Health Insurance",
    metric: "From ₹450/mo",
    detail: "Cashless treatment at 10,000+ network hospitals with zero room rent cap",
    href: "/products/health-insurance",
    icon: HeartPulse,
    accentColor: "#f43f5e",
    glowColor: "rgba(244,63,94,0.15)",
  },
  {
    id: "life",
    name: "Life Insurance",
    metric: "Guaranteed Payout",
    detail: "Financial security for your family's future with tax savings u/s 80C",
    href: "/products/life-insurance",
    icon: Umbrella,
    accentColor: "#818cf8",
    glowColor: "rgba(129,140,248,0.15)",
  },
  {
    id: "motor",
    name: "Motor Insurance",
    metric: "Instant Renewal",
    detail: "Zero inspection paperless policy with 24/7 roadside assistance",
    href: "/products/motor-insurance",
    icon: Car,
    accentColor: "#fb923c",
    glowColor: "rgba(251,146,60,0.15)",
  },
  {
    id: "term",
    name: "Term Insurance",
    metric: "₹1 Cr from ₹490/mo",
    detail: "Maximum life protection cover at affordable disciplined premiums",
    href: "/products/term-insurance",
    icon: ShieldCheck,
    accentColor: "#34d399",
    glowColor: "rgba(52,211,153,0.15)",
  },
  {
    id: "travel",
    name: "Travel Insurance",
    metric: "From ₹250/trip",
    detail: "Overseas medical emergency, flight delay & baggage loss coverage",
    href: "/products/travel-insurance",
    icon: Plane,
    accentColor: "#38bdf8",
    glowColor: "rgba(56,189,248,0.15)",
  },
  {
    id: "shop",
    name: "Shop & Business",
    metric: "Custom Cover",
    detail: "Protect commercial property, equipment, machinery & stock inventory",
    href: "/products/shop-insurance",
    icon: Store,
    accentColor: "#a78bfa",
    glowColor: "rgba(167,139,250,0.15)",
  },
];

export function InsuranceMarketplace() {
  return (
    <section
      id="insurance"
      className="scroll-mt-20"
      aria-label="Protect What Matters"
      style={{
        background: "#ffffff",
        padding: "40px 0",
      }}
    >
      <style>{`
        @keyframes ins-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .ins-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .ins-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: var(--card-glow);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .ins-card:hover {
          transform: translateY(-4px);
          border-color: var(--card-accent);
          box-shadow: 0 8px 24px rgba(0,0,0,0.07);
        }
        .ins-card:hover::before {
          opacity: 1;
        }
        .ins-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ins-card:hover .ins-icon-wrap {
          animation: ins-float 2s ease-in-out infinite;
        }
        .ins-separator {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
          opacity: 0.25;
        }
        .ins-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--card-accent);
          text-decoration: none;
          transition: gap 0.2s ease;
          margin-top: 2px;
        }
        .ins-cta:hover { gap: 10px; }
        .ins-view-all:hover {
          background: rgba(91,33,182,0.08) !important;
          border-color: rgba(91,33,182,0.5) !important;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>



        {/* Section Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 36,
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

          <Link
            href="/products?category=Insurance"
            className="ins-view-all"
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

        {/* Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          position: "relative",
          zIndex: 1,
        }}>
          {insuranceList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="ins-card"
                style={{
                  "--card-accent": item.accentColor,
                  "--card-glow": item.glowColor,
                } as React.CSSProperties}
              >
                {/* Icon */}
                <div
                  className="ins-icon-wrap"
                  style={{
                    background: item.glowColor,
                    border: `1.5px solid ${item.accentColor}33`,
                  }}
                >
                  <Icon style={{ width: 22, height: 22, color: item.accentColor }} />
                </div>

                {/* Name + Metric */}
                <div>
                  <h3 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: item.accentColor,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}>
                    {item.metric}
                  </p>
                </div>

                {/* Separator */}
                <div
                  className="ins-separator"
                  style={{ "--card-accent": item.accentColor } as React.CSSProperties}
                />

                {/* Detail */}
                <p style={{
                  fontSize: 12,
                  color: "#64748b",
                  lineHeight: 1.65,
                  fontWeight: 400,
                }}>
                  {item.detail}
                </p>

                {/* CTA */}
                <Link
                  href={item.href}
                  className="ins-cta"
                  style={{ "--card-accent": item.accentColor } as React.CSSProperties}
                >
                  Compare Plans
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
