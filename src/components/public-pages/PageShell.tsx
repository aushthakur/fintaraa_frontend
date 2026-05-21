import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <main className="bg-white">
      <section className="border-b border-[#E7E4DB] bg-[#FBFAF6] px-4 py-16">
        <div className="mx-auto max-w-9xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C2410C]/20 bg-[#FFF7ED] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#C2410C]">
              <ShieldCheck className="h-4 w-4" />
              {eyebrow}
            </div>
            <h1 className="text-[42px] font-black leading-[1.06] tracking-[-1.4px] text-[#1A1612] md:text-[62px]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] italic leading-[1.75] text-[#7A756E]">
              {description}
            </p>
          </div>
        </div>
      </section>
      {children}
    </main>
  );
}

export function PremiumCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="h-full rounded-2xl border border-[#E7E4DB] bg-white p-6 transition hover:border-[#C2410C]/40 hover:shadow-[0_20px_60px_rgba(26,22,18,0.07)]">
      <h3 className="text-[24px] font-black text-[#1A1612]">{title}</h3>
      <p className="mt-3 text-[14px] leading-7 text-[#6E675F]">{text}</p>
      {href && (
        <div className="mt-5 flex items-center gap-2 text-[13px] font-black text-[#C2410C]">
          Open <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full no-underline">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#5F5850]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-[#D1CEC4] bg-white px-4 text-[14px] outline-none transition focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/10"
      />
    </label>
  );
}
