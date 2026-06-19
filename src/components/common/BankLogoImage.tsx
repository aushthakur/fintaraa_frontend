import Image from "next/image";

interface BankLogoImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}

export function BankLogoImage({
  src,
  alt,
  className = "h-8 w-28",
  imageClassName = "",
  priority = false,
  sizes = "112px",
  unoptimized = false,
}: BankLogoImageProps) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={`object-contain ${imageClassName}`.trim()}
      />
    </span>
  );
}
