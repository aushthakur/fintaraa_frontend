"use client";

import Image from "next/image";

export function NewsletterSubscription() {
  return (
    <section className="bg-[#e8f3fe] px-6 py-10 md:px-12 lg:px-16 border-y border-[#dce6f0] font-sans antialiased">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-[auto_1fr_320px] items-center">
        
        {/* Left Aspect: Illustration Frame Asset */}
        <div className="relative w-36 h-24 bg-white rounded-xl shadow-xs border border-[#e1ecf7] flex items-center justify-center p-2 mx-auto md:mx-0">
          <Image
            src="/assets/blogs/newsletter-envelope.png" // Replace with your actual envelope/airplane illustration path
            alt="Newsletter Paper Airplane Envelope Illustration"
            width={128}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Center Aspect: Text Heading Layout Content */}
        <div className="text-center md:text-left space-y-1">
          <h4 className="text-[15px] font-bold text-[#000000] tracking-tight">
            Enjoyed this article?
          </h4>
          <h3 className="text-[22px] font-black text-[#005ca8] tracking-tight">
            Subscribe to our Newsletter
          </h3>
          <p className="text-[12px] font-medium leading-relaxed text-[#8f9ca9] max-w-md">
            Join 10,000+ readers who get the best financial of tips, guides, loan offers & market updates.
          </p>
        </div>

        {/* Right Aspect: Newsletter Action Form inputs */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2d3142] pl-0.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              className="h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-[13px] text-[#1a1d25] placeholder-[#a0aec0] shadow-2xs outline-none focus:border-[#005ca8] transition-colors"
              required
            />
          </div>
          
          <button
            type="submit"
            className="h-11 w-full rounded-full bg-[#0ea243] hover:bg-[#0c8e3a] text-[14px] font-bold text-white shadow-sm transition-colors tracking-wide"
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}