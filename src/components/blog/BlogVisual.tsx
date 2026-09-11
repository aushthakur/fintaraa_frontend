import type { CSSProperties } from "react";
import { BarChart3, Landmark, LineChart, ShieldCheck } from "lucide-react";

export function BlogVisual({
  title,
  category,
  accent,
  compact = false,
}: {
  title: string;
  category: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-xl border border-[#b9d8e8] bg-[#e8f7ff] ${
        compact ? "h-56" : "min-h-88"
      }`}
      style={
        {
          "--blog-accent": accent,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e8f7ff_0%,#ffffff_52%,#e7fff3_100%)]" />
      <div className="absolute -right-14 top-8 h-44 w-44 rounded-full border border-[#4c1d95]/15 bg-white/40" />
      <div className="absolute -bottom-16 left-8 h-52 w-52 rounded-full border border-[#13a653]/15 bg-white/35" />
      <div
        className="absolute right-10 top-10 h-20 w-20 rounded-xl opacity-20"
        style={{ backgroundColor: "var(--blog-accent)" }}
      />
      <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4c1d95] shadow-[0_12px_28px_rgba(0,92,168,0.12)]">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div className="absolute bottom-6 right-6 grid gap-3">
        {[LineChart, BarChart3, Landmark].map((Icon, index) => (
          <div
            key={index}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4c1d95] shadow-[0_12px_28px_rgba(0,92,168,0.10)]"
          >
            <Icon className="h-5 w-5" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-[#111827]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4c1d95]">
          {category}
        </p>
        <h3
          className={`mt-2 max-w-xl font-extrabold leading-tight ${
            compact ? "text-[18px]" : "text-[34px]"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
