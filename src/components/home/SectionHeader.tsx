import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold text-[#7a8494]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[20px] font-extrabold leading-tight text-[#101828] md:text-[24px]">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href="/products"
          className="shrink-0 text-[12px] font-bold text-[#09a34a] no-underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
