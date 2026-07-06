import { ArrowRight, CheckCircle2 } from "lucide-react";
import { whyChooseItems } from "./dsaData";

export function DsaWhyChoose() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="grid gap-6 rounded-[28px] bg-[#0b5aa8] p-5 text-white md:p-7 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
          <div>
            <p className="text-[12px] font-black uppercase tracking-wide text-[#9ee6bd]">
              Why Choose Fintaraa?
            </p>
            <h2 className="mt-2 max-w-md text-[26px] font-extrabold leading-tight tracking-[-0.03em] md:text-[34px]">
              A partner program built for serious financial distributors
            </h2>
            <p className="mt-3 max-w-lg text-[14px] font-medium leading-6 text-white/78">
              Work with a structured referral process, clear request tracking,
              and product support across loans, cards, and insurance.
            </p>

            <div className="mt-6 rounded-[20px] bg-white/10 p-4">
              <div className="flex items-center gap-2 text-[13px] font-black text-white">
                <CheckCircle2 className="h-4 w-4 text-[#9ee6bd]" />
                Built for partner growth
              </div>
              <p className="mt-2 text-[12px] font-medium leading-5 text-white/72">
                Submit leads, track progress, coordinate documents, and manage
                customer updates with less manual follow-up.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {whyChooseItems.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[18px] bg-white p-4 text-[#1d2633]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ff] text-[#0b5aa8]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-extrabold">{title}</h3>
                    <p className="mt-1 text-[12px] font-medium leading-5 text-[#667085]">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <a
              href="#dsa-form"
              className="group flex min-h-30 items-center justify-between gap-4 rounded-[18px] bg-[#13a653] p-4 text-white no-underline transition hover:bg-[#0f8d46]"
            >
              <span>
                <span className="block text-[14px] font-extrabold">
                  Ready to partner?
                </span>
                <span className="mt-1 block text-[12px] font-medium leading-5 text-white/82">
                  Share your details and our partnership team will contact you.
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
