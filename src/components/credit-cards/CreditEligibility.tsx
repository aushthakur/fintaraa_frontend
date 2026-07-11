import Image from "next/image";
import { ShieldCheck, Lock, Star, Building2 } from "lucide-react";

export function CreditEligibility() {
  return (
    <section className="relative px-4 py-12 md:px-8 lg:px-16 bg-[#fafbfe] font-sans">
      {/* Decorative Top-Left Background Shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#e3effc] opacity-60 rounded-br-full -z-10" />
      <div className="absolute top-12 left-0 w-16 h-16 bg-[#d2e5f9] opacity-40 rounded-br-full -z-10" />

      <div className="mx-auto max-w-9xl grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start pt-6">
        
        {/* Left Column: Heading, Value Props & Illustration */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-[30px] font-bold leading-[1.16] text-[#005ca8] md:text-[38px]">
              Check your <br />
              <span className="text-[#05437a]">credit card eligibility</span>
            </h2>
            <p className="mt-3 text-[14px] md:text-[15px] font-medium text-[#7c8b9e] max-w-md">
              Just 4 simple steps to turn your dream home into reality.
            </p>

            {/* Feature List with Titles and Descriptions */}
            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#005ca8] text-[#005ca8]">
                  <span className="text-[10px] font-bold">✓</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#2d3142]">No Impact on your CIBIL Score</h4>
                  <p className="text-[12px] text-[#8c9ba5] font-medium">We do a soft check only</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#005ca8] text-[#005ca8]">
                  <span className="text-[10px] font-bold">👤</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#2d3142]">Personalized results</h4>
                  <p className="text-[12px] text-[#8c9ba5] font-medium">Based on your profile & credit score</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#005ca8] text-[#005ca8]">
                  <span className="text-[10px] font-bold">🏆</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#2d3142]">Best Cards top benefits</h4>
                  <p className="text-[12px] text-[#8c9ba5] font-medium">Compare & apply in just a few clicks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Illustration Image Section */}
          <div className="mt-8 flex justify-center opacity-0 md:opacity-100 lg:justify-end align-bottom lg:pl-6 ms-auto">
            <Image
              src="/assets/images/eligibility-illustration1.png" // Update this path with your asset URL
              alt="Credit Card Eligibility Illustration"
              width={340}
              height={220}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>

          {/* Trust Highlights Banner (Bottom Left) */}
          <div className="mt-12 border border-[#e2eaf2] bg-white p-4 max-w-xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-between text-[12px]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#005ca8] shrink-0" />
                <div>
                  <div className="font-bold text-[#2d3142]">Your data is 100% secure</div>
                  <div className="text-[10px] text-[#9ca7b6]">we use bank-level encryption</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-x border-[#e9eff5] pt-3 sm:pt-0 sm:px-3">
                <Star className="h-5 w-5 text-[#005ca8] shrink-0" />
                <div>
                  <div className="font-bold text-[#2d3142]">Trusted by 10 Lakh+ Users</div>
                  <div className="text-[10px] text-[#9ca7b6]">we use bank-level encryption</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-t sm:border-t-0 pt-3 sm:pt-0">
                <Building2 className="h-5 w-5 text-[#005ca8] shrink-0" />
                <div>
                  <div className="font-bold text-[#2d3142]">Partnered with Top Banks</div>
                  <div className="text-[10px] text-[#9ca7b6]">For the best offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form Block wrapped in Geometric Border Frame */}
        {/* Added pr-6 pb-6 to give space so the offset blue div is never cropped */}
        <div className="relative w-full max-w-lg justify-self-center lg:justify-self-end mt-6 lg:mt-0 pr-6 pb-6">
          
          {/* Solid Blue Offset Background Layer matching the hero form */}
          <div className="absolute max-w-1/2 inset-0 translate-x-1/1 h-[102%] -translate-y-4 bg-[#00529c]" />

          {/* Core Interactive White Form Card */}
          <div className="relative z-10  border border-[#e8eff6] bg-white p-6 sm:p-9">
            
            {/* Step Counter Bubble Strip matching image_fd1584.png */}
            <div className="mb-8 flex items-center justify-between relative">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  {/* Step Bubble */}
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold z-10 ${
                    index === 0 
                      ? "bg-[#005ca8] text-white" 
                      : "bg-[#e1f0ff] text-white"
                  }`}>
                    {step}
                  </span>
                  
                  {/* Connecting Line Segments */}
                  {index === 0 && (
                    <span className="h-0.75 flex-1 -mx-0.5 bg-linear-to-r from-[#005ca8] to-[#e1f0ff]" />
                  )}
                  {index > 0 && index < 3 && (
                    <span className="h-0.75 flex-1 -mx-0.5 bg-[#e1f0ff]" />
                  )}
                </div>
              ))}
            </div>

            {/* Section Summary Headings */}
            <h3 className="text-[20px] font-bold text-[#1a1d24] inline-block border-b-2 border-[#005ca8] pb-1">
              Basic Details
            </h3>
            <p className="mt-2 text-[13px] text-[#7c8b9e] font-medium">
              Let&apos;s start with some basic information
            </p>

            {/* Structured Form Body Inputs */}
            <form className="mt-6 space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2d3142]">Full Name (as per PAN)</label>
                <input 
                  type="text"
                  placeholder="Enter Full Name" 
                  className="h-11 rounded-lg border border-[#e2eaf2] px-4 text-[13px] text-[#2d3142] placeholder-[#b0bac9] bg-[#fafcfe] focus:border-[#005ca8] focus:bg-white outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2d3142]">Mobile Number</label>
                <div className="flex h-11 rounded-lg border border-[#e2eaf2] bg-[#fafcfe] overflow-hidden focus-within:border-[#005ca8] focus-within:bg-white transition-colors">
                  <div className="flex items-center justify-center bg-[#eef5fc] px-4 text-[13px] font-medium text-[#4a5568] border-r border-[#e2eaf2]">
                    +91
                  </div>
                  <input 
                    type="tel"
                    placeholder="Enter Mobile Number" 
                    className="w-full px-4 text-[13px] text-[#2d3142] placeholder-[#b0bac9] bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2d3142]">Email Address(Optional)</label>
                <input 
                  type="email"
                  placeholder="Enter Email ID" 
                  className="h-11 rounded-lg border border-[#e2eaf2] px-4 text-[13px] text-[#2d3142] placeholder-[#b0bac9] bg-[#fafcfe] focus:border-[#005ca8] focus:bg-white outline-none transition-colors"
                />
              </div>

              {/* Submit CTA Trigger */}
              <div className="pt-2 text-center">
                <button 
                  type="button" 
                  className="inline-flex items-center justify-center h-11 w-full sm:w-52 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] hover:brightness-110 transition-all text-[14px] font-bold text-white shadow-sm gap-2"
                >
                  Continue <span>→</span>
                </button>
              </div>

              {/* Secure Bottom Footer Notice */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#9ca7b6] font-medium">
                <Lock className="h-3 w-3" />
                <span>Your information is safe & encrypted</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
