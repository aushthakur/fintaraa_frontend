"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { BankLogoImage } from '@/components/common/BankLogoImage';

// Interfaces for structured mockup data
interface CreditCardData {
  id: string;
  name: string;
  subtext: string;
  imageSrc: string;
  loungeAccess: string;
  rewards: string;
  viewDetailsUrl: string;
  applyUrl: string;
}

interface BankData {
  name: string;
  logoSrc: string;
  description: string;
  viewAllUrl: string;
  cards: CreditCardData[];
}

// 1. Mock Data mapped closely to your layout
const bankTabs: string[] = [
  "SBI Bank", 
  "HDFC Bank", 
  "IDFC Bank", 
  "One Card Bank", 
  "Bank Of Baroda", 
  "Axix Bank", 
  "PNB Bank"
];

const mockBankData: Record<string, BankData> = {
  "SBI Bank": {
    name: "SBI Bank Credit Cards",
    logoSrc: "/assets/banks/sbi-logo.png", // Replace with your actual asset path
    description: "Choose from a wide range of credit cards by HDFC Bank with exciting rewards, cashback and travel benefits.",
    viewAllUrl: "/credit-cards/sbi",
    cards: [
      {
        id: "sbi-1",
        name: "Millennia Credit Card",
        subtext: "5X Rewards on online spends & more.",
        imageSrc: "/assets/cards/sbi-card-mock.png", // Replace with your actual asset path
        loungeAccess: "4 Lounge Access",
        rewards: "5X Rewards",
        viewDetailsUrl: "/details/millennia",
        applyUrl: "/apply/millennia"
      },
      {
        id: "sbi-2",
        name: "Millennia Credit Card",
        subtext: "5X Rewards on online spends & more.",
        imageSrc: "/assets/cards/sbi-card-mock.png",
        loungeAccess: "4 Lounge Access",
        rewards: "5X Rewards",
        viewDetailsUrl: "/details/millennia",
        applyUrl: "/apply/millennia"
      },
      {
        id: "sbi-3",
        name: "Millennia Credit Card",
        subtext: "5X Rewards on online spends & more.",
        imageSrc: "/assets/cards/sbi-card-mock.png",
        loungeAccess: "4 Lounge Access",
        rewards: "5X Rewards",
        viewDetailsUrl: "/details/millennia",
        applyUrl: "/apply/millennia"
      }
    ]
  },
  // Other banks can be populated here to hook up dynamically to tabs
};

export function MajorBankCreditCards() {
  const [activeTab, setActiveTab] = useState<string>("SBI Bank");

  // Fallback if data doesn't exist for a tab yet
  const activeBankData = mockBankData[activeTab] || mockBankData["SBI Bank"];

  return (
    <section className="bg-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-[20px] font-bold text-[#111111] md:text-[24px]">
            Credit Cards by Major Banks
          </h2>
          <a 
            href="/all-banks" 
            className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] transition-colors hover:text-[#067e36] no-underline"
          >
            View all banks
            <span className="text-[14px]">➔</span>
          </a>
        </div>

        {/* Bank Tabs Pills */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {bankTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "border-[#08a045] bg-[#08a045] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Main Display Container */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          
          {/* Sub-header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Bank Logo Image */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e73be]/10 text-[#1e73be] text-xl font-bold">
                {/* Fallback clean styling or raw <img /> */}
                <BankLogoImage
                  src="/assets/banks/sbi-logo.png"
                  alt={activeBankData.name}
                  className="h-10 w-10"
                />
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-[#111111]">
                  {activeBankData.name}
                </h3>
                <p className="mt-0.5 text-[12px] text-gray-400 max-w-xl leading-relaxed">
                  {activeBankData.description}
                </p>
              </div>
            </div>
            
            <a 
              href={activeBankData.viewAllUrl} 
              className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] self-start sm:self-center hover:underline"
            >
              View all {activeTab} cards
              <span className="text-[14px]">➔</span>
            </a>
          </div>

          {/* Cards Display Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeBankData.cards.map((card) => (
              <article 
                key={card.id} 
                className="flex flex-col justify-between rounded-[20px] border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  {/* Card Graphic Container */}
                  <Image
                    width={300}
                    height={180}
                    src="/assets/banks/visa-card.png"    
                    alt={card.name}
                    className="h-auto w-full rounded-lg object-cover"
                  />

                  {/* Meta Text */}
                  <h4 className="mt-4 text-[16px] font-bold text-[#111111]">
                    {card.name}
                  </h4>
                  <p className="mt-1 text-[12px] text-gray-400">
                    {card.subtext}
                  </p>

                  {/* Highlights / Key Benefits Grid */}
                  <div className="mt-4 border-t border-gray-50 pt-3">
                    <div className="text-[11px] font-bold tracking-wide uppercase text-gray-800">
                      Key Benefits
                    </div>
                    <div className="mt-2 flex justify-between text-[12px]">
                      <span className="text-gray-400 font-normal">{card.loungeAccess}</span>
                      <span className="text-gray-400 font-normal">{card.rewards}</span>
                    </div>
                  </div>
                </div>

                {/* Call To Actions */}
                <div className="mt-6 flex items-center justify-between gap-4 pt-2">
                  <a 
                    href={card.viewDetailsUrl} 
                    className="flex items-center gap-1 text-[13px] font-medium text-[#08a045] hover:underline"
                  >
                    View Details
                    <span className="text-[13px]">➔</span>
                  </a>
                  
                  <a 
                    href={card.applyUrl} 
                    className="inline-flex h-9.5 items-center justify-center rounded-full bg-[#08a045] px-6 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#067e36]"
                  >
                    Apply Now
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
