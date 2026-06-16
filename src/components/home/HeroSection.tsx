// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ChartPie,
//   Headphones,
//   UsersRound,
//   Phone,
//   ShieldCheck,
//   ChartNoAxesColumnIncreasing,
// } from "lucide-react";

// const featureCards = [
//   {
//     icon: ShieldCheck,
//     title: "Secure & Trusted",
//     text: "Bank-grade security to protect your data and money.",
//   },
//   {
//     title: "Grow Your Wealth",
//     icon: ChartNoAxesColumnIncreasing,
//     text: "Smart investment options to help you build your future.",
//   },
//   {
//     icon: ChartPie,
//     title: "Track & Plan",
//     text: "Easy budgeting tools to keep you in control.",
//   },
// ];

// const trustStats = [
//   {
//     value: "256-bit",
//     icon: ShieldCheck,
//     label: "Bank-level Security",
//   },
//   {
//     value: "2M+",
//     icon: UsersRound,
//     label: "Happy Customers",
//   },
//   {
//     value: "99.9%",
//     icon: ShieldCheck,
//     label: "Uptime & Reliability",
//   },
//   {
//     value: "24/7",
//     icon: Headphones,
//     label: "Customer Support",
//   },
// ];

// export function HeroSection() {
//   return (
//     <section className="relative isolate bg-[linear-gradient(180deg,#f8fbff_0%,#F7FAFD)] pl-4 pt-4 md:pl-6 lg:pl-8">
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_22%,rgba(25,85,133,0.08),transparent_28%),radial-gradient(circle_at_16%_34%,rgba(18,183,106,0.08),transparent_22%)]" />
//       </div>

//       <div className="relative mx-auto grid w-full max-w-9xl items-center lg:min-h-162.5 lg:grid-cols-[minmax(0,0.39fr)_minmax(0,0.60fr)]">
//         <div className="relative z-10 min-w-0 pt-4 lg:pt-0">
//           <h1 className="max-w-2xl text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-[#2a2b2f] md:text-[42px] xl:text-[50px]">
//             Get the Best Loan,
//             <span className="block sm:whitespace-nowrap">
//               Insurance & Credit Card-
//             </span>
//             <span className="block text-[#4bd96f]">Fast & Free</span>
//           </h1>
//           <p className="mt-4 max-w-xl text-[18px] font-semibold leading-7 text-[#8a8f99]">
//             Compare offers from 30+ banks and NBFCs.
//             <br />
//             Apply in minutes.
//           </p>

//           <div className="mt-7 flex flex-wrap items-center gap-2">
//             <Link
//               href="/products"
//               className="inline-flex h-14 items-center justify-center rounded-full border border-[#12b76a] px-7 text-[15px] font-extrabold text-[#12b76a] no-underline shadow-[0_12px_26px_rgba(18,183,106,0.10)] transition hover:-translate-y-0.5 hover:bg-[#ecfdf3]"
//             >
//               View All Products
//             </Link>
//             <Link
//               href="/login"
//               className="inline-flex h-14 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-8 text-[15px] font-extrabold text-white no-underline shadow-[0_16px_32px_rgba(18,183,106,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0ea85f]"
//             >
//               Check Eligibility Free
//             </Link>
//           </div>

//           <div className="mt-16 grid gap-5 sm:grid-cols-3 lg:max-w-xl">
//             {featureCards.map(({ title, text, icon: Icon }) => (
//               <div key={title}>
//                 <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-white text-[#2357ff] shadow-[0_14px_34px_rgba(25,85,133,0.10)] ring-1 ring-[#e6eef8]">
//                   <Icon className="h-7 w-7" strokeWidth={2.6} />
//                 </div>
//                 <h3 className="mt-5 text-[16px] font-bold text-[#08275d]">
//                   {title}
//                 </h3>
//                 <p className="mt-3 text-[12px] text-[#667085]">{text}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="relative min-w-0 min-h-72 md:min-h-110 lg:h-132.5">
//           <Image
//             src="/assets/refer/header.png"
//             alt="Smart banking services with Fintaraa app"
//             unoptimized
//             width={1200}
//             height={900}
//             className="h-full w-full object-contain object-center lg:object-bottom-right"
//           />
//         </div>
//       </div>

//       {/* Wrapper box that controls the absolute layout boundaries */}
//       <div className="relative z-10 ml-auto max-w-4xl pb-6 sm:pb-8 lg:pb-6 mr-10">
//         {/* White Stats Card */}
//         <div className="grid grid-cols-1 items-center rounded-[28px] bg-white px-8 py-5 shadow-[0_15px_40px_rgba(25,85,133,0.06)] ring-1 ring-[#e7eff8] sm:grid-cols-2 lg:grid-cols-4 lg:py-6">
//           {trustStats.map(({ value, label, icon: Icon }, index) => (
//             <div
//               key={label}
//               className={`relative flex items-center gap-3.5 py-3 pl-4 pr-2
//               ${index > 0 ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-10 lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-[#e2e8f0]" : ""}
//               ${index === trustStats.length - 1 ? "mb-10 sm:mb-0" : ""}
//             `}
//             >
//               {/* Icon Styling: Perfectly matched blue stroke weight */}
//               <Icon
//                 className="h-7 w-7 shrink-0 text-[#2557ff]"
//                 strokeWidth={1.8}
//               />

//               <div className="flex flex-col justify-center">
//                 {/* Main Value */}
//                 <p className="text-[20px] font-bold tracking-tight text-[#0a2540] leading-tight">
//                   {value}
//                 </p>
//                 {/* Label Subtext */}
//                 <p className="mt-0.5 text-[12px] font-medium tracking-normal text-[#6b7280] whitespace-nowrap">
//                   {label}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Absolute Positioned "Talk to Loan Expert" Button */}
//         <button
//           onClick={() => {
//             /* Add click handler action here */
//           }}
//           className="absolute bottom-0 right-4 z-20 flex h-12 translate-y-1/2 transform items-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(16,163,89,0.35)] hover:brightness-105 hover:shadow-[0_16px_32px_rgba(16,163,89,0.45)] active:translate-y-0 sm:right-6 lg:right-4"
//         >
//           <Phone className="h-4 w-4 fill-white text-white" />
//           <span>Talk to Loan Expert</span>
//         </button>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { Headphones, UsersRound, ShieldCheck } from "lucide-react";

const trustStats = [
  {
    value: "256-bit",
    icon: ShieldCheck,
    label: "Bank-level Security",
  },
  {
    value: "2M+",
    icon: UsersRound,
    label: "Happy Customers",
  },
  {
    value: "99.9%",
    icon: ShieldCheck,
    label: "Uptime & Reliability",
  },
  {
    value: "24/7",
    icon: Headphones,
    label: "Customer Support",
  },
];

export function HeroSection() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-9xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Side */}
          <div className="flex flex-col">
            <h1 className="text-[38px] font-extrabold leading-[1.12] tracking-tight text-[#212529] md:text-[46px] lg:text-[52px]">
              Get the Best Loan,
              <br />
              Insurance & Credit Card-
              <span className="block mt-2 font-extrabold text-[#12b76a]">
                Fast & Free
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] font-medium leading-relaxed text-[#8a94a6]">
              Compare offers from 30+ banks and NBFCs.
              <br />
              Apply in minutes.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#12b76a] px-7 text-[15px] font-bold text-[#12b76a] no-underline transition-colors hover:bg-emerald-50/40"
              >
                View All Products
              </Link>

              <Link
                href="/eligibility"
                className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-8 text-[15px] font-bold text-white no-underline transition-colors hover:bg-[#0ea85f]"
              >
                Check Eligibility Free
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex justify-end align-top pb-10">
            {/* Image */}
            <div className="w-full rounded-xl border -mt-6 border-gray-300 bg-[#fafbfc] px-4 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="relative w-full aspect-720/280">
                <Image
                  src="/assets/refer/header.png"
                  alt="Banking services application view dashboard"
                  fill
                  priority
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Trust Stats Card */}
            <div className="absolute -bottom-10 left-1/3  hidden min-w-max -translate-x-1/2 md:block">
              <div className="rounded-2xl border-y-2 border-indigo-50 bg-white px-5 py-4 ">
                <div className="grid grid-cols-4 items-center gap-4">
                  {trustStats.map(({ value, label, icon: Icon }, index) => (
                    <div
                      key={label}
                      className={`relative flex items-center gap-3 px-4 ${
                        index > 0
                          ? "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-center text-[#2557ff]">
                        <Icon className="h-6 w-6 shrink-0" strokeWidth={1.8} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold leading-none text-slate-900">
                          {value}
                        </span>

                        <span className="mt-1 whitespace-nowrap text-[11px] font-semibold text-gray-400">
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
