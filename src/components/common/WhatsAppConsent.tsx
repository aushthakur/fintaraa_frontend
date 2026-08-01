import { WHATSAPP_CONSENT_TEXT } from "@/lib/formConsent";

type WhatsAppConsentProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
};

export function WhatsAppConsent({
  checked,
  onChange,
  error,
  className = "",
}: WhatsAppConsentProps) {
  return (
    <div className={className}>
      <label className="flex w-full max-w-full cursor-pointer items-start gap-3 rounded-xl border border-[#dce9f7] bg-[#f8fbff] px-3 py-3 text-left">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#b8c7d8] text-[#005ca8] focus:ring-[#005ca8]"
        />
        <span className="min-w-0 wrap-break-word text-[12px] font-semibold leading-5 text-[#475467]">
          {WHATSAPP_CONSENT_TEXT}
        </span>
      </label>
      {error ? (
        <p className="mt-1.5 text-[11px] font-bold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
