import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { jobs } from "./careersData";

export function CareerJobs() {
  return (
    <section id="open-positions" className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-2">
        {jobs.map((job, index) => (
          <article
            key={`${job.title}-${index}`}
            className="rounded-[14px] border border-[#d8dee7] bg-white p-4 shadow-[0_4px_14px_rgba(16,24,40,0.03)]"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#2b2f38]">
                {job.title}
              </h3>
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#33393f]">
                <CalendarDays className="h-3.5 w-3.5" />
                Apply before
                <span className="font-bold">{job.date}</span>
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-[11px] font-semibold text-[#4b5563]">
              <span className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5" />
                {job.department}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {job.location}
              </span>
            </div>
            <p className="mt-3 max-w-xl text-[11px] font-medium leading-5 text-[#7d8794]">
              Manage client relationships and drive loan & insurance business
              by understanding customer needs.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-3">
                <span className="rounded-full bg-[#edf5ff] px-5 py-2 text-[11px] font-semibold text-[#0d64bf]">
                  {job.experience}
                </span>
                <span className="rounded-full bg-[#edf5ff] px-5 py-2 text-[11px] font-semibold text-[#0d64bf]">
                  {job.type}
                </span>
              </div>
              <Link
                href="#join"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1cb45c] px-8 text-[13px] font-semibold text-white no-underline shadow-[0_10px_20px_rgba(28,180,92,0.2)]"
              >
                Apply Now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
