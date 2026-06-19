"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchCareerJobs,
  JobPosting,
  submitCareerApplication,
} from "@/services/careers";

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CareersJoin() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    experience: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    const loadJobs = async () => {
      setLoadingJobs(true);
      try {
        const result = await fetchCareerJobs();
        if (!active) return;
        setJobs(result);
        const stored = sessionStorage.getItem("careerJobId") || "";
        if (stored && result.some((job) => job._id === stored)) {
          setSelectedJobId(stored);
        }
      } catch {
        if (active) setJobs([]);
      } finally {
        if (active) setLoadingJobs(false);
      }
    };

    const onSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) setSelectedJobId(detail.id);
    };

    loadJobs();
    window.addEventListener("career-job-selected", onSelected);
    return () => {
      active = false;
      window.removeEventListener("career-job-selected", onSelected);
    };
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => job._id === selectedJobId),
    [jobs, selectedJobId],
  );

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameRegex.test(form.name.trim())) {
      setError("Enter a valid full name.");
      return;
    }
    if (!mobileRegex.test(form.phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("phone", form.phone.trim());
    payload.append("email", form.email.trim());
    payload.append("location", form.location.trim());
    payload.append("experience", form.experience.trim());
    payload.append("coverLetter", form.coverLetter.trim());
    payload.append("jobId", selectedJobId);
    payload.append("jobTitle", selectedJob?.title || "Open Role");
    payload.append("resume", resume);

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await submitCareerApplication(payload);
      setSuccess(
        "Application submitted successfully. Our team will review it.",
      );
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        experience: "",
        coverLetter: "",
      });
      setResume(null);
    } catch (err) {
      setError((err as Error).message || "Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="join" className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-6 rounded-2xl border border-[#d8dee7] bg-white p-5 shadow-[0_4px_14px_rgba(16,24,40,0.03)] md:grid-cols-[0.98fr_1.02fr] md:p-6">
        <div className="rounded-xl bg-[#eaf3ff] p-6 md:p-8">
          <p className="text-[16px] font-extrabold text-[#111827]">
            Don&apos;t See the Right Role?
          </p>
          <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.03em] text-[#0d64bf] md:text-[28px]">
            We&apos;d Love to Hear From You!
          </h2>
          <p className="mt-4 max-w-md text-[12px] font-medium leading-6 text-[#7d8794]">
            Share your details and resume with us. We&apos;ll reach out when a
            suitable opportunity comes up.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="relative h-full w-full">
              <Image
                src="/assets/images/mail.png"
                alt="Apply with Fintaraa"
                width={100}
                unoptimized
                height={100}
                className="object-contain w-fit"
              />
            </div>
          </div>
        </div>

        <div className="p-1 md:p-2">
          <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#2b2f38]">
            Ready to Join Fintaraa?
          </h2>
          <p className="mt-2 text-[12px] font-medium text-[#8b95a3]">
            Apply for any open position and join our team.
          </p>
          <form onSubmit={submit} className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Full Name", "Enter full name"],
              ["phone", "Mobile Number", "Enter mobile number"],
              ["email", "Email Address", "Enter email address"],
              ["location", "Current Location", "Enter city"],
              ["experience", "Experience", "Example: 2 years"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="grid gap-2">
                <span className="text-[12px] font-extrabold text-[#33393f]">
                  {label}
                </span>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    updateField(key as keyof typeof form, event.target.value)
                  }
                  placeholder={placeholder}
                  className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[12px] outline-none placeholder:text-[#a0a7b2] focus:border-[#0d64bf]"
                />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="text-[12px] font-extrabold text-[#33393f]">
                Position Applying For
              </span>
              <select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                className="h-10 rounded-lg border border-[#d9dfe8] bg-white px-3 text-[12px] text-[#475467] outline-none focus:border-[#0d64bf]"
              >
                <option value="">
                  {loadingJobs ? "Loading positions..." : "Open Application"}
                </option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-[12px] font-extrabold text-[#33393f]">
                Cover Letter
              </span>
              <textarea
                value={form.coverLetter}
                onChange={(event) =>
                  updateField("coverLetter", event.target.value)
                }
                placeholder="Briefly tell us why you are a good fit"
                rows={3}
                className="rounded-lg border border-[#d9dfe8] px-3 py-2 text-[12px] outline-none placeholder:text-[#a0a7b2] focus:border-[#0d64bf]"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-[12px] font-extrabold text-[#33393f]">
                Upload Resume (PDF/DOC)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setResume(event.target.files?.[0] || null)}
                className="h-10 rounded-lg border border-[#d9dfe8] px-3 py-2 text-[12px]"
              />
            </label>
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700 md:col-span-2">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="rounded-lg bg-[#e8f8ef] px-3 py-2 text-[12px] font-bold text-[#12904b] md:col-span-2">
                {success}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1cb45c] text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(28,180,92,0.2)] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit Application
            </button>
            <p className="text-center text-[11px] font-medium text-[#8b95a3] md:col-span-2">
              Your information is safe with us
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
