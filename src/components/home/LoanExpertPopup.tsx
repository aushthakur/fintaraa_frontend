"use client";

import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import Modal from "@/components/common/Modal";
import { ContactConsultationForm } from "@/components/contact/ContactConsultationForm";

const OPEN_EVENT = "fintaraa:open-loan-expert";

export function openLoanExpertPopup() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function LoanExpertButton({
  className = "",
  label = "Connect with Loan Expert",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={openLoanExpertPopup}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-5 text-[14px] font-semibold text-white transition hover:bg-[#108e46] ${className}`}
    >
      <PhoneCall className="h-4 w-4" />
      {label}
    </button>
  );
}

export function LoanExpertPopupHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  return (
    <>
      <Modal
        isVisible={open}
        width="w-[90%] lg:w-[40%]"
        onClose={() => setOpen(false)}
      >
        <ContactConsultationForm />
      </Modal>
    </>
  );
}
