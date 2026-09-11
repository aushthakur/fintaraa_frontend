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
    <div className="mb-5 flex items-center justify-between gap-4">
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
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] px-3 text-[12px] font-bold leading-none text-[#5b21b6] no-underline transition hover:bg-[#d9eaff] md:bg-transparent md:px-0"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
