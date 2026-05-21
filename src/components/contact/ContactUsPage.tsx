"use client";

import { FormEvent, useState } from "react";
import {
  Building2,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Mail,
  Send,
  Phone,
  MapPin,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const contactCards = [
  {
    title: "Call Fintaraa",
    value: "+91 84482 82679",
    text: "Speak with our support team for applications, documents, and partner follow-ups.",
    href: "tel:+918448282679",
    icon: Phone,
    tone: "bg-[#eef8ff] text-[#195585]",
  },
  {
    title: "Email Support",
    value: "support@fintaraa.com",
    text: "Share your registered mobile number and application reference for faster routing.",
    href: "mailto:support@fintaraa.com",
    icon: Mail,
    tone: "bg-[#ecfdf3] text-[#079455]",
  },
  {
    title: "Business Office",
    value: "Gurugram, Haryana",
    text: "Fintaraa Financial Services Pvt. Ltd. assists customers across India digitally.",
    href: "#office",
    icon: MapPin,
    tone: "bg-[#fff7ed] text-[#c2410c]",
  },
];

const supportTracks = [
  "Loan application assistance",
  "Credit card and insurance queries",
  "Document verification help",
  "Partner status follow-up",
  "Privacy or grievance routing",
  "Business and DSA enquiries",
];

export function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden px-4 py-14 md:px-6 lg:px-8">
        <div className="blog-grid-pulse absolute inset-0 opacity-[0.16]" />
        <div className="relative mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#195585] shadow-[0_10px_28px_rgba(25,85,133,0.08)]">
              <Headphones className="h-4 w-4 text-[#12b76a]" />
              Contact Fintaraa
            </div>
            <h1 className="mt-5 max-w-4xl text-[42px] font-black leading-[1.02] tracking-[-0.02em] text-[#07162d] md:text-[64px]">
              Get clear support for every financial step.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] font-semibold leading-8 text-[#475467]">
              Whether you need help with loan eligibility, credit card options,
              insurance, uploaded documents, or an existing application, our
              team will route your request to the right desk.
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["30 min", "Typical first review"],
                ["Secure", "Document handling"],
                ["Mon-Sat", "9:30 AM - 6:30 PM"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="bg-white/90 p-4 shadow-[0_12px_30px_rgba(25,85,133,0.07)]"
                >
                  <p className="text-[22px] font-black text-[#195585]">
                    {value}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#07162d] p-6 text-white shadow-[0_24px_70px_rgba(25,85,133,0.18)]">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15 blog-orbit" />
            <div className="absolute -bottom-16 left-8 h-52 w-52 rounded-full border border-white/10 blog-orbit-reverse" />
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-[#7ee3a2]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="mt-8 max-w-md text-[34px] font-black leading-tight">
                Trusted assistance for loans, cards, insurance, and documents.
              </h2>
              <div className="mt-8 grid gap-3">
                {supportTracks.slice(0, 4).map((track, index) => (
                  <div
                    key={track}
                    className="blog-float flex items-center gap-3 bg-white/10 p-3 backdrop-blur"
                    style={{ animationDelay: `${index * 0.25}s` }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#7ee3a2]" />
                    <span className="text-[13px] font-semibold text-white/82">
                      {track}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="grid h-fit gap-4 lg:sticky lg:top-28">
            {contactCards.map(
              ({ icon: Icon, title, value, text, href, tone }) => (
                <a
                  key={title}
                  href={href}
                  className="group flex gap-4 bg-white p-5 text-[#07162d] no-underline shadow-[0_14px_36px_rgba(25,85,133,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(25,85,133,0.12)]"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-black">
                      {title}
                    </span>
                    <span className="mt-1 block text-[14px] font-black text-[#195585]">
                      {value}
                    </span>
                    <span className="mt-2 block text-[13px] font-medium leading-6 text-[#667085]">
                      {text}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#195585]" />
                </a>
              ),
            )}

            <div
              id="office"
              className="bg-white p-5 shadow-[0_14px_36px_rgba(25,85,133,0.07)]"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#195585]" />
                <h2 className="text-[18px] font-black text-[#07162d]">
                  Registered contact
                </h2>
              </div>
              <p className="mt-4 text-[13px] font-semibold leading-7 text-[#667085]">
                Fintaraa Financial Services Pvt. Ltd.
                <br />
                Unit No. 402, 4th Floor, Tower A, Spaze I-Tech Park,
                <br />
                Sector 49, Gurugram, Haryana - 122018
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 shadow-[0_18px_48px_rgba(25,85,133,0.09)] md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[30px] font-black leading-tight text-[#07162d]">
                  Tell us how we can help
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-7 text-[#667085]">
                  Add the product, city, and application reference if available.
                  This helps our team respond with the right context.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <ContactField label="Full name" placeholder="Rahul Sharma" />
              <ContactField
                label="Mobile number"
                placeholder="+91 98765 43210"
                type="tel"
              />
              <ContactField
                label="Email address"
                placeholder="rahul.sharma@example.com"
                type="email"
              />
              <ContactField label="City" placeholder="Gurugram" />
              <ContactField label="Product" placeholder="Personal Loan" />
              <ContactField label="Application ref" placeholder="Optional" />
            </div>

            <label className="group relative mt-6 block pt-2">
              <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
                Message
              </span>
              <div className="relative mt-1">
                <textarea
                  rows={3}
                  className="peer w-full resize-none border-0 border-b border-[#cfddea] bg-transparent px-0 py-3 text-[15px] font-semibold leading-7 text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold placeholder:transition-colors focus:border-transparent focus:placeholder:text-[#c8d5e1]"
                  placeholder="Write your query, issue, or requirement"
                />
                <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
                <span className="pointer-events-none absolute -bottom-1 left-0 h-2 w-2 scale-0 rounded-full bg-[#195585] opacity-0 shadow-[0_0_0_5px_rgba(25,85,133,0.10)] transition-all duration-300 peer-focus:scale-100 peer-focus:opacity-100" />
              </div>
            </label>

            <div className="mt-7 flex flex-col gap-4 bg-[#07162d] p-5 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[17px] font-black">
                  {submitted ? "Request captured" : "Ready to send?"}
                </p>
                <p className="mt-1 text-[13px] font-semibold leading-6 text-white/68">
                  {submitted
                    ? "This form UI is ready. Connect the submit action to your support API when available."
                    : "Your information is used only to respond to this query and support your Fintaraa journey."}
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[13px] font-black text-[#195585]"
              >
                <Send className="h-4 w-4" />
                Submit request
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl bg-white p-6 shadow-[0_18px_48px_rgba(25,85,133,0.08)]">
          <h2 className="text-[24px] font-black text-[#07162d]">
            What can we help with?
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {supportTracks.map((track) => (
              <div
                key={track}
                className="flex items-center gap-3 bg-[#f8fcff] p-4"
              >
                <MessageCircle className="h-4 w-4 text-[#195585]" />
                <span className="text-[13px] font-semibold text-[#344054]">
                  {track}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          type={type}
          className="peer h-12 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-semibold text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold placeholder:transition-colors focus:border-transparent focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
        <span className="pointer-events-none absolute -bottom-1 left-0 h-2 w-2 scale-0 rounded-full bg-[#195585] opacity-0 shadow-[0_0_0_5px_rgba(25,85,133,0.10)] transition-all duration-300 peer-focus:scale-100 peer-focus:opacity-100" />
      </div>
    </label>
  );
}
