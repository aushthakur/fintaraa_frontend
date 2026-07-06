"use client";

import { useEffect, useState } from "react";
import { Headphones, PhoneCall } from "lucide-react";
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
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-5 text-[14px] font-semibold text-white transition hover:bg-[#108e46] ${className}`}
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden h-12 items-center gap-2 rounded-full bg-[#13a653] px-5 text-[13px] font-bold text-white shadow-[0_12px_32px_rgba(19,166,83,0.28)] transition hover:bg-[#108e46] lg:inline-flex"
      >
        <Headphones className="h-4 w-4" />
        Loan Expert
      </button>

      <Modal
        isVisible={open}
        width="w-[90%] lg:w-[35%]"
        onClose={() => setOpen(false)}
      >
        <ContactConsultationForm />
      </Modal>
    </>
  );
}
