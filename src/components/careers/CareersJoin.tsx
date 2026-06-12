import { MailCheck } from "lucide-react";

export function CareersJoin() {
  return (
    <section id="join" className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-6 rounded-xl border border-[#d7dfe8] bg-white p-6 md:grid-cols-[1fr_1fr]">
        <div className="rounded bg-[#e8f4ff] p-8">
          <p className="text-[16px] font-black text-[#111827]">
            Don&apos;t See the Right Role?
          </p>
          <h2 className="mt-4 text-[26px] font-black text-[#005ca8]">
            We&apos;d Love to Hear From You!
          </h2>
          <p className="mt-4 text-[13px] font-medium leading-6 text-[#667085]">
            Share your details and resume with us. We&apos;ll reach out when a
            suitable opportunity comes up.
          </p>
          <div className="mt-10 flex justify-center">
            <MailCheck className="h-40 w-40 text-[#13a653]" />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-[21px] font-black text-[#2a2f36]">
            Ready to Join Fintaraa?
          </h2>
          <p className="mt-2 text-[12px] font-medium text-[#8b95a3]">
            Apply for any open position and join our team.
          </p>
          <form className="mt-5 grid gap-4 md:grid-cols-2">
            {["Full Name", "Mobile Number", "Email Address"].map((label) => (
              <label key={label} className="grid gap-2">
                <span className="text-[12px] font-black">{label}</span>
                <input placeholder={`Enter ${label}`} className="h-10 border border-[#d9dfe8] px-3 text-[12px] outline-none" />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="text-[12px] font-black">Position Applying For</span>
              <select className="h-10 border border-[#d9dfe8] bg-white px-3 text-[12px] text-[#8b95a3] outline-none">
                <option>Select Position</option>
              </select>
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-[12px] font-black">Upload Resume (PDF)</span>
              <input type="file" className="h-10 border border-[#d9dfe8] px-3 py-2 text-[12px]" />
            </label>
            <button type="button" className="h-12 rounded-full bg-[#13a653] text-[13px] font-black text-white md:col-span-2">
              Submit Application
            </button>
            <p className="text-center text-[11px] font-semibold text-[#8b95a3] md:col-span-2">
              Your information is safe with us
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
