"use client";

import Image from "next/image";
import { 
  UserCheck, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle, 
  Tag 
} from "lucide-react";

const featureItems = [
  { id: 1, label: "Expert Legal Expert", icon: UserCheck },
  { id: 2, label: "Transparent Process", icon: RefreshCw },
  { id: 3, label: "100% Compliances Assured", icon: ShieldCheck },
  { id: 4, label: "End to End Support", icon: HelpCircle },
  { id: 5, label: "Affordable Pricing", icon: Tag },
  // Second row duplicate row matching image_e39d7d.png precisely
  { id: 6, label: "Expert Legal Expert", icon: UserCheck },
  { id: 7, label: "Transparent Process", icon: RefreshCw },
  { id: 8, label: "100% Compliances Assured", icon: ShieldCheck },
  { id: 9, label: "End to End Support", icon: HelpCircle },
  { id: 10, label: "Affordable Pricing", icon: Tag },
];

export function WhyChooseFintaraa() {
  return (
    <section className="bg-[#004E96] px-6 py-10 md:px-12 lg:px-16 text-white font-sans antialiased relative">
      <div className="mx-auto max-w-9xl">
        
        {/* Top Header Block Row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[24px] md:text-[28px] font-black tracking-tight">
            Why Choose Fintaraa?
          </h2>
          
          {/* Right Corner: Floating 3D Security Shield Graphic */}
          <div className="relative w-24 h-20 hidden sm:block">
            <Image
              src="/assets/blogs/security-shield-trust.png" // Replace with your shield illustration path
              alt="Security Shield Trust Illustration"
              fill
              className="object-contain object-right"
            />
          </div>
        </div>

        {/* 2-Row x 5-Column Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-white/10 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                {/* Clean Custom Outlined Blue Icon */}
                <div className="shrink-0 text-[#005ca8]">
                  <Icon className="h-5 w-5 stroke-2" />
                </div>
                
                {/* Left-Aligned Double-Line/Single-line text label */}
                <span className="text-[13px] font-bold text-[#005ca8] leading-tight select-none">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}