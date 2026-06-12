import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { jobs } from "./careersData";

export function CareerJobs() {
  return (
    <section id="open-positions" className="px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-5 md:grid-cols-2">
        {jobs.map((job, index) => (
          <article key={`${job.title}-${index}`} className="rounded-xl border border-[#d7dfe8] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[22px] font-black text-[#2a2f36]">
                {job.title}
              </h3>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-[#111827]">
                <CalendarDays className="h-4 w-4" />
                Apply before
                <span className="font-black">{job.date}</span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-[12px] font-black text-[#2a2f36]">
              <span className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            </div>
            <p className="mt-4 text-[12px] font-medium leading-5 text-[#667085]">
              Manage client relationships and drive loan & insurance business
              by understanding customer needs.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <span className="rounded-full bg-[#e8f4ff] px-5 py-2 text-[11px] font-black text-[#005ca8]">
                  {job.experience}
                </span>
                <span className="rounded-full bg-[#e8f4ff] px-5 py-2 text-[11px] font-black text-[#005ca8]">
                  {job.type}
                </span>
              </div>
              <Link href="#join" className="inline-flex h-10 items-center justify-center rounded-full bg-[#13a653] px-9 text-[13px] font-black text-white no-underline">
                Apply Now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
