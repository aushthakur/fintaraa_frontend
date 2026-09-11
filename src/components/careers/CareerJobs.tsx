"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { fetchCareerJobs, JobPosting } from "@/services/careers";

const formatDeadline = (value?: string) => {
  if (!value) return "Open";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Open";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function CareerJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchCareerJobs();
        if (active) setJobs(result);
      } catch (err) {
        if (active) setError((err as Error).message || "Unable to load jobs.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadJobs();
    return () => {
      active = false;
    };
  }, []);

  const selectJob = (job: JobPosting) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("careerJobId", job._id);
      window.dispatchEvent(
        new CustomEvent("career-job-selected", {
          detail: { id: job._id, title: job.title },
        }),
      );
      document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="open-positions" className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-4 md:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-46 animate-pulse rounded-[14px] border border-[#d8dee7] bg-white p-4"
            >
              <div className="h-5 w-1/2 rounded bg-[#eef3f8]" />
              <div className="mt-4 h-4 w-3/4 rounded bg-[#eef3f8]" />
              <div className="mt-6 h-12 rounded bg-[#eef3f8]" />
            </div>
          ))
        ) : error ? (
          <div className="rounded-[14px] border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-700 md:col-span-2">
            {error}
          </div>
        ) : jobs.length ? (
          jobs.map((job) => (
            <article
              key={job._id}
              className="rounded-[14px] border border-[#d8dee7] bg-white p-4 shadow-[0_4px_14px_rgba(16,24,40,0.03)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#2b2f38]">
                  {job.title}
                </h3>
                <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#33393f]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Apply before
                  <span className="font-bold">
                    {formatDeadline(job.applicationDeadline)}
                  </span>
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
                {job.summary ||
                  job.responsibilities?.[0] ||
                  "Manage customer journeys and support Fintaraa operations."}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <span className="rounded-full bg-[#edf5ff] px-5 py-2 text-[11px] font-semibold text-[#6d28d9]">
                    {job.experience}
                  </span>
                  <span className="rounded-full bg-[#edf5ff] px-5 py-2 text-[11px] font-semibold text-[#6d28d9]">
                    {job.employmentType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => selectJob(job)}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#1cb45c] px-8 text-[13px] font-semibold text-white no-underline shadow-[0_10px_20px_rgba(28,180,92,0.2)]"
                >
                  Apply Now
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[14px] border border-[#d8dee7] bg-[#f8fbff] p-6 text-center text-[13px] font-semibold text-[#667085] md:col-span-2">
            No open positions right now. You can still submit your resume below.
          </div>
        )}
      </div>
    </section>
  );
}
