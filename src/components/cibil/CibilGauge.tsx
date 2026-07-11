export function CibilGauge({ score = 782 }: { score?: number }) {
  return (
    <div className="relative mx-auto h-52 w-72">
      <div className="absolute inset-x-4 top-10 h-36 rounded-t-full border-22 border-b-0 border-[#22c55e]" />
      <div className="absolute left-4 top-10 h-36 w-36 rounded-tl-full border-l-22 border-t-22 border-[#ef4444]" />
      <div className="absolute left-16 top-10 h-28 w-28 rounded-tl-full border-l-18 border-t-18 border-[#facc15]" />
      <div className="absolute right-16 top-10 h-28 w-28 rounded-tr-full border-r-18 border-t-18 border-[#84cc16]" />
      <div className="absolute left-1/2 top-20 h-1 w-24 origin-left -rotate-90 rounded bg-[#111827]" />
      <div className="absolute inset-x-0 bottom-7 text-center">
        <p className="text-[28px] font-extrabold text-[#111827]">{score}</p>
        <p className="text-[12px] font-semibold text-[#667085]">Out of 900</p>
      </div>
      <p className="absolute left-2 top-25 -rotate-72 text-[11px] font-extrabold">
        POOR
      </p>
      <p className="absolute left-15 top-5 -rotate-28 text-[11px] font-extrabold">
        FAIR
      </p>
      <p className="absolute left-31 top-0 text-[11px] font-extrabold">GOOD</p>
      <p className="absolute right-1 top-25 rotate-72 text-[11px] font-extrabold">
        EXCELLENT
      </p>
    </div>
  );
}
