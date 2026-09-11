"use client";

import { ChevronDown } from "lucide-react";
import { Children, type ReactNode, useId, useState } from "react";

type LoadMoreResultGridProps = {
  increment?: number;
  children: ReactNode;
  initialCount?: number;
};

export function LoadMoreResultGrid({
  children,
  increment = 6,
  initialCount = 6,
}: LoadMoreResultGridProps) {
  const items = Children.toArray(children);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const gridId = useId();

  const shownCount = Math.min(visibleCount, items.length);
  const remainingCount = Math.max(0, items.length - shownCount);
  const nextCount = Math.min(increment, remainingCount);

  return (
    <>
      <div id={gridId} className="grid gap-4 lg:grid-cols-3">
        {items.slice(0, shownCount)}
      </div>

      {remainingCount > 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            aria-controls={gridId}
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + increment, items.length),
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#bfd7ed] bg-white px-6 text-[13px] font-extrabold text-[#4c1d95] transition-colors hover:border-[#4c1d95] hover:bg-[#f4f9ff]"
          >
            Load {nextCount} more
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="text-[11px] font-bold text-[#7a8699]">
            Showing {shownCount} of {items.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
