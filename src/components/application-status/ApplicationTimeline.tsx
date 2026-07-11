import Link from "next/link";
import { Info } from "lucide-react";

const timeline = [
  {
    title: "Submitted",
    text: "Your application has been submitted successfully.",
    done: true,
  },
  {
    title: "Under Review",
    text: "Your application is under review.",
    done: true,
  },
  {
    title: "Sent to Partner Bank",
    text: "Your application has been sent to HDFC Bank for further processing.",
  },
  {
    title: "Documents Required",
    text: "Additional documents are required to proceed further.",
    action: true,
  },
  { title: "Approved", text: "Your application will be approved soon." },
];

export function ApplicationTimeline() {
  return (
    <section className="px-4 pb-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[28px] font-extrabold text-[#2a2f36]">
          Application Timeline
        </h2>
        <div className="mt-8 rounded-xl border border-[#d7dfe8] bg-white p-8">
          <div className="relative grid gap-9">
            <div className="absolute left-6 top-7 h-[calc(100%-3.5rem)] w-1 bg-[#dff0ff]" />
            {timeline.map(({ title, text, done, action }, index) => (
              <div
                key={title}
                className="relative grid gap-4 pl-20 md:grid-cols-[1fr_auto]"
              >
                <span
                  className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full text-[20px] font-extrabold text-white ${
                    done ? "bg-[#005ca8]" : "bg-[#dff0ff]"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#111827]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[20px] font-medium text-[#9aa0a6]">
                    {text}
                  </p>
                  {action ? (
                    <Link
                      href="/account/profile/edit-profile"
                      className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-[#13a653] px-7 text-[13px] font-extrabold text-[#13a653] no-underline"
                    >
                      Upload Document
                    </Link>
                  ) : null}
                </div>
                <p className="text-[20px] font-medium text-[#9aa0a6]">
                  12 May 2025, 10:30 AM
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[#b5d9f6] bg-[#e8f4ff] p-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-4 text-[14px] font-semibold text-[#005ca8]">
            <Info className="h-5 w-5 shrink-0" />
            You will receive SMS, WhatsApp & push notifications on your
            registered mobile number at every status update.
          </p>
          <Link
            href="/support"
            className="inline-flex h-13 items-center justify-center rounded-full border border-[#13a653] px-8 text-[17px] font-extrabold text-[#13a653] no-underline"
          >
            Need help? Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
