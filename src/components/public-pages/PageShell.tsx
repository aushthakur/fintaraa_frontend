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
      <section className="border-b border-[#d9e8f4] bg-[#f5fbff] px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-9xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b9d8f3] bg-[#e9f2ff] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde] md:text-[11px]">
              <ShieldCheck className="h-4 w-4" />
              {eyebrow}
            </div>
            <h1 className="text-[30px] font-extrabold leading-[1.12] tracking-tight text-[#07162d] md:text-[46px] lg:text-[54px]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-[#5f7189] md:text-[17px]">
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
    <div className="h-full rounded-xl border border-[#d9e8f4] bg-white p-4 transition hover:border-[#9fc7ef] hover:shadow-[0_18px_48px_rgba(7,92,222,0.08)] md:p-5">
      <h3 className="text-[20px] font-extrabold leading-tight text-[#07162d] md:text-[22px]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-6 text-[#5f7189] md:text-[15px]">
        {text}
      </p>
      {href && (
        <div className="mt-5 flex items-center gap-2 text-[13px] font-extrabold text-[#075cde]">
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
      <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#5F5850]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-[#c9dced] bg-white px-4 text-[14px] outline-none transition focus:border-[#075cde] focus:ring-2 focus:ring-[#075cde]/10"
      />
    </label>
  );
}
