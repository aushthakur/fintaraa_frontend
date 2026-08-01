import {
  CheckCircle2,
  Clock3,
  Headphones,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export function SupportHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-[#06141F] to-[#195585] px-4 py-12 text-white md:px-6 lg:px-8">
      <div className="absolute -right-16 top-8 h-56 w-56 rounded-full border border-white/10 blog-orbit" />
      <div className="absolute -bottom-24 left-16 h-72 w-72 rounded-full border border-white/10 blog-orbit-reverse" />
      <div className="relative mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/80">
            <Headphones className="h-4 w-4 text-[#7ee3a2]" />
            Support & Service Desk
          </div>
          <h1 className="mt-5 max-w-4xl text-[42px] font-bold leading-[1.02] tracking-[-0.02em] md:text-[56px]">
            Ticket support with clean, guided follow-up.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] font-semibold leading-8 text-white/74">
            Raise tickets, track status, and continue the conversation with the
            Fintaraa support team for applications, documents, repayments,
            insurance, cards, and account help.
          </p>
        </div>

        <div className="grid gap-3">
          {[
            [MessageCircle, "Chat-style ticket updates"],
            [Clock3, "Timed support follow-ups"],
            [ShieldCheck, "Secure account context"],
            [CheckCircle2, "Clear next actions"],
          ].map(([Icon, text], index) => (
            <div
              key={text as string}
              className="blog-float flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur"
              style={{ animationDelay: `${index * 0.25}s` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12 text-[#7ee3a2]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[14px] font-semibold text-white/82">
                {text as string}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
