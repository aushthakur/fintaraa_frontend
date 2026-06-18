"use client";

import Image from "next/image";

export function NewsletterSubscription() {
  return (
    <section className="bg-[#e8f3fe] px-4 py-8 border-y border-[#dce6f0] font-sans antialiased sm:px-6 sm:py-10 md:px-12 md:py-12">
      <div className="mx-auto max-w-9xl grid gap-6 md:grid-cols-[auto_1fr_320px] lg:gap-8 items-center">
        
        {/* Left Aspect: Illustration Frame Asset - responsive size */}
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 md:w-36 md:h-24 bg-white rounded-xl shadow-xs border border-[#e1ecf7] flex items-center justify-center p-2 mx-auto md:mx-0">
          <Image
            src="/assets/blogs/newsletter-envelope.png"
            alt="Newsletter Paper Airplane Envelope Illustration"
            width={128}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Center Aspect: Text Heading Layout Content - responsive text */}
        <div className="text-center md:text-left space-y-1 sm:space-y-1.5">
          <h4 className="text-sm font-bold text-[#000000] tracking-tight sm:text-[14px] md:text-[15px] lg:text-base">
            Enjoyed this article?
          </h4>
          <h3 className="text-lg font-black text-[#005ca8] tracking-tight sm:text-xl md:text-[20px] lg:text-2xl xl:text-[26px]">
            Subscribe to our Newsletter
          </h3>
          <p className="text-[11px] font-medium leading-relaxed text-[#8f9ca9] max-w-md sm:text-xs md:text-sm lg:text-[14px]">
            Join 10,000+ readers who get the best financial of tips, guides, loan offers & market updates.
          </p>
        </div>

        {/* Right Aspect: Newsletter Action Form inputs - responsive sizing */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5 sm:space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2d3142] pl-0.5 sm:text-[13px] md:text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              className="h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-xs text-[#1a1d25] placeholder-[#a0aec0] shadow-2xs outline-none focus:border-[#005ca8] transition-colors sm:h-10 sm:text-[13px] md:text-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            className="h-10 w-full rounded-full bg-[#0ea243] hover:bg-[#0c8e3a] text-xs font-bold text-white shadow-sm transition-colors tracking-wide sm:h-11 sm:text-sm md:text-[14px]"
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}