import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type JobPosting = {
  _id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  employmentType: string;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  salaryRange?: string;
  openingsCount?: number;
  applicationDeadline?: string;
  summary?: string;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchCareerJobs = async () => {
  const response = await Fetch<ApiEnvelope<JobPosting[]>>(
    "careers/jobs",
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response) || [];
};

export const submitCareerApplication = async (payload: FormData) => {
  const response = await Post<ApiEnvelope<unknown>>(
    "careers/applications",
    payload,
    20000,
    true,
  );
  return unwrap(response);
};
