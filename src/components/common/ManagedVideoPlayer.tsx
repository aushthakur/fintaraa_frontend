"use client";

type ManagedVideoPlayerProps = {
  src?: string;
  youtubeUrl?: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
};

export const getYoutubeVideoId = (value?: string) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (
      ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
    ) {
      if (url.searchParams.get("v")) return url.searchParams.get("v") || "";
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] || "";
    }
  } catch {
    return "";
  }
  return "";
};

export function ManagedVideoPlayer({
  src,
  youtubeUrl,
  title,
  poster,
  autoPlay = false,
  className = "aspect-video w-full bg-black object-contain",
}: ManagedVideoPlayerProps) {
  const directSource = String(src || "").trim();
  const youtubeId =
    getYoutubeVideoId(youtubeUrl) || getYoutubeVideoId(directSource);

  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          youtubeId,
        )}?rel=0${autoPlay ? "&autoplay=1" : ""}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className={className}
      />
    );
  }

  if (!directSource) return null;
  return (
    <video
      src={directSource}
      autoPlay={autoPlay}
      controls
      playsInline
      controlsList="nodownload"
      poster={poster}
      className={className}
    />
  );
}
