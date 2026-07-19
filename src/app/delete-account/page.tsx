import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const supportEmail = "customercare@fintaraa.com";
const requestMailHref =
  "mailto:customercare@fintaraa.com?subject=Fintaraa%20Account%20Deletion%20Request";

const fallbackMetadata: Metadata = {
  title: "Delete Fintaraa Account",
  description:
    "Request deletion of your Fintaraa account and eligible personal data.",
  alternates: {
    canonical: "/delete-account",
  },
};

const requestSteps = [
  "Email customercare@fintaraa.com from your registered email address, or mention your registered mobile number in the request.",
  "Use the subject line: Fintaraa Account Deletion Request.",
  "Our support team may verify account ownership before processing deletion.",
  "Eligible account and personal data deletion requests are processed within 30 business days, subject to legal and regulatory retention requirements.",
];

const deletedData = [
  "Account profile details held by Fintaraa",
  "Eligible personal information associated with the account",
  "Eligible uploaded documents held by Fintaraa",
  "Eligible credit information retained by Fintaraa after consent withdrawal",
  "App preferences and non-essential communication preferences",
];

const retainedData = [
  "Records required for legal, regulatory, tax, audit, fraud-prevention, security, or dispute-resolution purposes",
  "Information linked to pending applications or active loan, credit card, insurance, or financial product relationships",
  "Data retained by banks, NBFCs, insurers, credit bureaus, or other regulated partners under their own legal obligations",
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/delete-account", fallbackMetadata);
}

export default function DeleteAccountPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-[#e3ebf2] px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#195585]">
            Account Deletion
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="max-w-4xl text-[34px] font-extrabold leading-tight tracking-[-0.025em] text-[#07162d] sm:text-[42px] md:text-[48px]">
                Delete your Fintaraa account and data
              </h1>
              <p className="mt-3 max-w-4xl text-[15px] font-medium leading-7 text-[#5f7182] md:text-[16px]">
                Request deletion of your Fintaraa account and eligible personal
                data, subject to identity verification and applicable retention
                requirements.
              </p>
            </div>
            <a
              href={requestMailHref}
              className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-extrabold text-white no-underline transition hover:bg-[#0f4771]"
            >
              <Mail className="h-4 w-4" />
              Email deletion request
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <section className="border-b border-[#e4edf5] pb-10">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-6 w-6 text-[#195585]" />
                <h2 className="text-[30px] font-extrabold tracking-[-0.01em] text-[#07162d]">
                  How to request deletion
                </h2>
              </div>
              <div className="mt-7 grid gap-4">
                {requestSteps.map((step, index) => (
                  <div
                    key={step}
                    className="grid gap-4 border border-[#e4edf5] bg-white p-5 md:grid-cols-[3rem_1fr]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ff] text-[14px] font-extrabold text-[#195585]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-[16px] font-semibold leading-8 text-[#475467]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-8 py-10 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#12b76a]" />
                  <h2 className="text-[26px] font-extrabold text-[#07162d]">
                    Data eligible for deletion
                  </h2>
                </div>
                <ul className="mt-5 grid gap-3">
                  {deletedData.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-[#12b76a] bg-[#f6fef9] px-4 py-3 text-[15px] font-semibold leading-7 text-[#344054]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-[#f97316]" />
                  <h2 className="text-[26px] font-extrabold text-[#07162d]">
                    Data that may be retained
                  </h2>
                </div>
                <ul className="mt-5 grid gap-3">
                  {retainedData.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-[#f97316] bg-[#fff7ed] px-4 py-3 text-[15px] font-semibold leading-7 text-[#344054]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="border-t border-[#e4edf5] pt-10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#195585]" />
                <h2 className="text-[30px] font-extrabold tracking-[-0.01em] text-[#07162d]">
                  Permissions and data access
                </h2>
              </div>
              <p className="mt-5 max-w-5xl text-[17px] font-medium leading-9 text-[#475467]">
                Fintaraa does not access, collect, store, or share a
                user&apos;s SMS messages, call logs, contact lists, or personal
                photos. Device permissions are requested only with user consent
                and only when required for functionality such as document
                upload, OTP verification, service availability, branch mapping,
                video or voice verification, and transactional notifications.
              </p>
              <Link
                href="/privacy-policy#data-deletion"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[#195585] px-5 text-[13px] font-extrabold text-[#195585] no-underline"
              >
                View Privacy Policy deletion section
              </Link>
            </section>
          </div>

          <aside className="h-fit border border-[#d9e8f4] bg-[#f5fbff] p-6 lg:sticky lg:top-32">
            <Clock className="h-8 w-8 text-[#195585]" />
            <h2 className="mt-4 text-[24px] font-extrabold leading-tight text-[#07162d]">
              Processing timeline
            </h2>
            <p className="mt-4 text-[15px] font-semibold leading-7 text-[#475467]">
              Eligible deletion requests are processed within 30 business days
              after account ownership verification, subject to legal and
              regulatory retention requirements.
            </p>
            <div className="mt-6 border-t border-[#d9e8f4] pt-6">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#667085]">
                Contact
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-2 block break-all text-[18px] font-extrabold text-[#195585] no-underline"
              >
                {supportEmail}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
