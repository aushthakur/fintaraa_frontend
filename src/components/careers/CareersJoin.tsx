import Image from "next/image";

export function CareersJoin() {
  return (
    <section id="join" className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-6 rounded-[16px] border border-[#d8dee7] bg-white p-5 shadow-[0_4px_14px_rgba(16,24,40,0.03)] md:grid-cols-[0.98fr_1.02fr] md:p-6">
        <div className="rounded-[12px] bg-[#eaf3ff] p-6 md:p-8">
          <p className="text-[16px] font-extrabold text-[#111827]">
            Don&apos;t See the Right Role?
          </p>
          <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0d64bf] md:text-[28px]">
            We&apos;d Love to Hear From You!
          </h2>
          <p className="mt-4 max-w-md text-[12px] font-medium leading-6 text-[#7d8794]">
            Share your details and resume with us. We&apos;ll reach out when a
            suitable opportunity comes up.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="relative h-62.5 w-77.5 max-w-full">
              <Image
                src="/assets/images/mail.png"
                alt="Apply with Fintaraa"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="p-1 md:p-2">
          <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#2b2f38]">
            Ready to Join Fintaraa?
          </h2>
          <p className="mt-2 text-[12px] font-medium text-[#8b95a3]">
            Apply for any open position and join our team.
          </p>
          <form className="mt-4 grid gap-4 md:grid-cols-2">
            {["Full Name", "Mobile Number", "Email Address"].map((label) => (
              <label key={label} className="grid gap-2">
                <span className="text-[12px] font-extrabold text-[#33393f]">
                  {label}
                </span>
                <input
                  placeholder={`Enter ${label}`}
                  className="h-10 border border-[#d9dfe8] px-3 text-[12px] outline-none placeholder:text-[#a0a7b2]"
                />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="text-[12px] font-extrabold text-[#33393f]">
                Position Applying For
              </span>
              <select className="h-10 border border-[#d9dfe8] bg-white px-3 text-[12px] text-[#8b95a3] outline-none">
                <option>Select Position</option>
              </select>
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-[12px] font-extrabold text-[#33393f]">
                Upload Resume (PDF)
              </span>
              <input type="file" className="h-10 border border-[#d9dfe8] px-3 py-2 text-[12px]" />
            </label>
            <button
              type="button"
              className="h-12 rounded-full bg-[#1cb45c] text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(28,180,92,0.2)] md:col-span-2"
            >
              Submit Application
            </button>
            <p className="text-center text-[11px] font-medium text-[#8b95a3] md:col-span-2">
              Your information is safe with us
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}