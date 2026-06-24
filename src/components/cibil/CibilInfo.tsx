"use client";

import React from "react";
import Image from "next/image";

export function CibilInfo() {
  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8 w-full h-auto">
      {/* Grid container with top-aligned content tracking image_9f1a1d.png */}
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        
        {/* Left Column: Verbatim Copy Content Info */}
        <div className="flex flex-col justify-start">
          <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-bold text-[#1d2939] tracking-tight">
            What is Credit Score
          </h2>
          
          <div className="mt-6 flex flex-col gap-4 text-[14px] md:text-[15px] font-medium leading-relaxed text-gray-500/90 max-w-2xl">
            <p>
              A credit score is a 3-digit number that shows how you have managed credit in 
              the past. It helps banks and NBFCs understand how likely you are to repay a 
              loan.
            </p>
            <p>
              In India, it is commonly called a CIBIL score, provided by TransUnion CIBIL. The 
              score usually ranges from 300 to 900.
            </p>
            <p>
              Your credit score is calculated using information shared by lenders, such as EMI 
              payments, credit card bill payments, and new loan or credit card applications.
            </p>
            <p>
              Reserve Bank of India requires lenders to share updated credit information with 
              all credit bureaus every 15 days so that your latest credit record stays up to 
              date.
            </p>
          </div>
        </div>

        {/* Right Column: Interaction Controls & Gauge Image Asset Frame */}
        <div className="flex flex-col items-end w-full lg:max-w-105 lg:justify-self-end">
          {/* Fixed Gauge Image Node Slot - Replaced the component with your graphic target layout */}
          <div className="w-full flex justify-center lg:justify-end pr-0 sm:pr-2">
            <div className="relative w-full max-w-150 aspect-[16/10]">
              <Image
                src="/assets/images/cibil-score-quality.png"
                alt="Credit Score CIBIL Range Gauge Status Meter"
                fill
                unoptimized
                priority
                className="object-contain object-right"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
