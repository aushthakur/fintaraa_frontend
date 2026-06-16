"use client";
import { User, ShieldCheck, Clock } from "lucide-react";

export function CreditScoreBanner() {
  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 my-14">
      {/* Main Banner Container */}
      <div className="w-full rounded-[20px] bg-[#edf5fd] border border-[#d2e4ff] px-6 py-10 text-center">
        
        {/* Banner Title */}
        <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#0a0f1d] md:text-[32px]">
          Check your Credit Score in Minutes with <span className="text-[#195585] font-extrabold">Fintaraa</span>
        </h2>

        {/* Bureau Logos Section */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          {/* Experian */}
          <div className="flex h-11 w-28.5 items-center justify-center rounded-[10px] bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <span className="text-[14px] font-black text-purple-700 tracking-tight">
              <span className="text-[#e11d48] font-bold">●</span>experian
            </span>
          </div>

          {/* CRIF */}
          <div className="flex h-11 w-28.5 items-center justify-center rounded-[10px] bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <span className="text-[14px] font-extrabold italic text-blue-800 tracking-tighter">
              CRIF <span className="text-[8px] block not-italic font-bold text-gray-400 -mt-1">HIGH MARK</span>
            </span>
          </div>

          {/* EQUIFAX */}
          <div className="flex h-11 w-28.5 items-center justify-center rounded-[10px] bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <span className="text-[15px] font-black tracking-tight text-[#b91c1c] uppercase">
              Equifax
            </span>
          </div>

          {/* CIBIL */}
          <div className="flex h-11 w-28.5 items-center justify-center rounded-[10px] bg-white border border-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="text-center">
              <span className="text-[15px] font-black tracking-tight text-[#0284c7] block leading-none">
                CIBIL
              </span>
              <span className="text-[7px] font-bold text-gray-400 block tracking-normal mt-0.5">
                Part of TransUnion
              </span>
            </div>
          </div>
        </div>

        {/* Core Trust Badges Row */}
        <div className="mt-8 flex flex-col sm:flex-row md:flex-row items-center justify-center gap-3.5 max-w-5xl mx-auto">
          {/* Badge 1 */}
          <div className="flex w-full md:w-auto items-center justify-center gap-2.5 bg-white rounded-[10px] py-3 px-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-white">
            <User className="h-4.5 w-4.5 text-[#195585]" strokeWidth={2.2} />
            <span className="text-[13.5px] font-bold text-[#195585] tracking-tight">
              Authorised credit bureau data
            </span>
          </div>

          {/* Badge 2 */}
          <div className="flex w-full md:w-auto items-center justify-center gap-2.5 bg-white rounded-[10px] py-3 px-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-white">
            <ShieldCheck className="h-4.5 w-4.5 text-[#195585]" strokeWidth={2.2} />
            <span className="text-[13.5px] font-bold text-[#195585] tracking-tight">
              100% free and instant
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex w-full md:w-auto items-center justify-center gap-2.5 bg-white rounded-[10px] py-3 px-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-white">
            <Clock className="h-4.5 w-4.5 text-[#195585]" strokeWidth={2.2} />
            <span className="text-[13.5px] font-bold text-[#195585] tracking-tight">
              No hard enquiry | No spam
            </span>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-6 sm:mt-8">
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#0ea85f] px-9 text-[14.5px] font-bold text-white transition-all shadow-[0_4px_14px_rgba(14,168,95,0.2)] hover:bg-[#0c9352]">
            Check Credit Score Now
          </button>
        </div>

      </div>
    </div>
  );
}