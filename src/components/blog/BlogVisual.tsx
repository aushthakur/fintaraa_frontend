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
      className={`relative isolate overflow-hidden bg-[#07162d] ${
        compact ? "h-56" : "min-h-88"
      }`}
      style={
        {
          "--blog-accent": accent,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_82%_22%,var(--blog-accent),transparent_28%),linear-gradient(135deg,#07162d_0%,#195585_54%,#0f766e_100%)] opacity-95" />
      <div className="blog-orbit absolute -right-14 top-8 h-44 w-44 rounded-full border border-white/18" />
      <div className="blog-orbit-reverse absolute -bottom-16 left-8 h-52 w-52 rounded-full border border-white/14" />
      <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-white backdrop-blur">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div className="absolute bottom-6 right-6 grid gap-3">
        {[LineChart, BarChart3, Landmark].map((Icon, index) => (
          <div
            key={index}
            className="blog-float flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-white shadow-[0_14px_28px_rgba(0,0,0,0.16)] backdrop-blur"
            style={{ animationDelay: `${index * 0.55}s` }}
          >
            <Icon className="h-5 w-5" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">
          {category}
        </p>
        <h3
          className={`mt-2 max-w-xl font-black leading-tight ${
            compact ? "text-[18px]" : "text-[34px]"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
