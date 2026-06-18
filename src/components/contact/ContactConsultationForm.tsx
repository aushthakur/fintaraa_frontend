"use client";

import { FormEvent, useState } from "react";

const loanTypes = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Credit Card",
];

export function ContactConsultationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[18px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(16,24,40,0.05)] md:px-7"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" placeholder="Enter Name" />
        <Field label="Mobile Number" placeholder="Enter Mobile Number" />
        <Field label="Email Address" placeholder="Enter Email Address" />
        <Field label="City" placeholder="Enter City" />

        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-[#344054]">
            Loan Type
          </span>
          <select className="h-10 w-full rounded-none border border-[#e5e7eb] bg-white px-3 text-[13px] text-[#667085] outline-none">
            <option>Select Loan Type</option>
            {loanTypes.map((loanType) => (
              <option key={loanType}>{loanType}</option>
            ))}
          </select>
        </label>

        <Field label="Loan Amount" placeholder="Enter Loan Amount" />
      </div>

      <label className="mt-4 block">
        <span className="mb-1 block text-[12px] font-semibold text-[#344054]">
          Message ( Optional)
        </span>
        <textarea
          rows={4}
          placeholder="Tell us about requirements"
          className="w-full resize-none rounded-none border border-[#e5e7eb] px-3 py-2 text-[13px] outline-none placeholder:text-[#c2c8d0]"
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#16b654] px-7 text-[15px] font-semibold text-white shadow-[0_14px_28px_rgba(22,182,84,0.24)]"
      >
        Request Call Back
      </button>

      <p className="mt-2 text-center text-[11px] text-[#98a2b3]">
        {submitted ? "Request captured. We will contact you shortly." : "Your information is safe with us"}
      </p>
    </form>
  );
}

function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-[#344054]">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-none border border-[#e5e7eb] px-3 text-[13px] outline-none placeholder:text-[#c2c8d0]"
      />
    </label>
  );
}
