"use client";

import { animate, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselDirection = "previous" | "next";

type MoveInfiniteCarouselOptions = {
  direction: CarouselDirection;
  track: HTMLDivElement | null;
  trackWidth: number;
  x: MotionValue<number>;
  onPauseChange: (paused: boolean) => void;
};

export function moveInfiniteCarousel({
  direction,
  track,
  trackWidth,
  x,
  onPauseChange,
}: MoveInfiniteCarouselOptions) {
  const firstCard = track?.firstElementChild as HTMLElement | null;
  const loopWidth = trackWidth / 3;

  if (!track || !firstCard || !loopWidth) return;

  const trackStyles = window.getComputedStyle(track);
  const parsedGap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap);
  const step = firstCard.getBoundingClientRect().width + (parsedGap || 0);
  const delta = direction === "previous" ? step : -step;
  let currentX = x.get();

  while (currentX > 0) currentX -= loopWidth;
  while (currentX < -loopWidth) currentX += loopWidth;

  let targetX = currentX + delta;

  if (targetX > 0) {
    currentX -= loopWidth;
    targetX = currentX + delta;
  } else if (targetX < -loopWidth) {
    currentX += loopWidth;
    targetX = currentX + delta;
  }

  x.set(currentX);
  onPauseChange(true);
  animate(x, targetX, {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
    onComplete: () => onPauseChange(false),
  });
}

export function CarouselNavigation({
  label,
  onPrevious,
  onNext,
  disabled = false,
}: {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  const buttonClassName =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#5b21b6] shadow-[0_8px_22px_rgba(7,22,45,0.1)] transition hover:border-[#5b21b6] hover:bg-[#5b21b6] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <button
        type="button"
        aria-label={`Previous ${label}`}
        className={buttonClassName}
        onClick={onPrevious}
        disabled={disabled}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Next ${label}`}
        className={buttonClassName}
        onClick={onNext}
        disabled={disabled}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
