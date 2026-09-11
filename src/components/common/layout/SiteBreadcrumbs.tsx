"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

type BreadcrumbItem = {
  label: string;
  href: string;
  current?: boolean;
};

const routeLabels: Record<string, string> = {
  about: "About",
  "about-us": "About Us",
  account: "Account",
  all: "All",
  app: "App",
  application: "Application",
  "application-status": "Application Status",
  apply: "Apply",
  banks: "Banks",
  "become-dsa": "Become DSA",
  blog: "Blog",
  careers: "Careers",
  categories: "Categories",
  "cibil-score": "CIBIL Score",
  "company-registration": "Company Registration",
  "contact-us": "Contact Us",
  "credit-card": "Credit Cards",
  "credit-cards": "Credit Cards",
  "delete-account": "Delete Account",
  eligibility: "Eligibility",
  "eligibility-results": "Eligibility Results",
  faqs: "FAQs",
  feedback: "Feedback",
  franchise: "Franchise",
  grievance: "Grievance",
  "gst-registration": "GST Registration",
  "itr-filing": "ITR Filing",
  "annual-compliance": "Annual Compliance",
  "tax-compliance": "Tax Compliance",
  "msme-registration": "MSME Registration",
  "project-report": "Project Report",
  "knowledge-hub": "Knowledge Hub",
  loan: "Loan",
  "loan-disclosure": "Loan Disclosure",
  login: "Login",
  offers: "Offers",
  partner: "Partner",
  partners: "Partners",
  "partners-by-product": "Partners By Product",
  press: "Press",
  "press-release": "Press Release",
  privacy: "Privacy",
  "privacy-policy": "Privacy Policy",
  products: "Products",
  profile: "Profile",
  "refer-and-earn": "Refer And Earn",
  report: "Report",
  sitemap: "Sitemap",
  support: "Support",
  terms: "Terms",
  "terms-and-conditions": "Terms And Conditions",
  testimonials: "Testimonials",
  tools: "Tools",
  "video-testimonials": "Video Testimonials",
  videos: "Videos",
};

const acronymMap: Record<string, string> = {
  Aadhaar: "Aadhaar",
  Dsa: "DSA",
  Emi: "EMI",
  Gst: "GST",
  Hdfc: "HDFC",
  Icici: "ICICI",
  Idfc: "IDFC",
  Itr: "ITR",
  Kyc: "KYC",
  Nbfc: "NBFC",
  Pan: "PAN",
  Rbi: "RBI",
  Sbi: "SBI",
};

const hiddenPrefixes = ["/account/profile", "/partner/profile"];

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const titleCase = (value: string) =>
  safeDecode(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w+/g, (word) => {
      const normalized =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return acronymMap[normalized] || normalized;
    });

const labelForSegment = (segment: string, previous?: string) => {
  if (previous === "blog" && segment === "all") return "All Blogs";
  if (previous === "partners" && segment === "all") return "All Partners";
  return routeLabels[segment] || titleCase(segment);
};

const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  if (cleanPath === "/") return [];

  const segments = cleanPath.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    items.push({
      label: labelForSegment(segment, segments[index - 1]),
      href,
      current: index === segments.length - 1,
    });
  });

  return items;
};

export function SiteBreadcrumbs() {
  const pathname = usePathname();

  if (
    !pathname ||
    hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return null;
  }

  const items = buildBreadcrumbs(pathname);
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-white px-4 py-3 md:px-6 lg:px-8">
      <ol className="mx-auto flex max-w-9xl items-center gap-2 overflow-x-auto whitespace-nowrap text-[12px] font-bold text-[#667085]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#b4bfcc]" />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="text-[#111827]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-[#667085] no-underline transition hover:text-[#4c1d95]"
                >
                  {index === 0 ? <Home className="h-3.5 w-3.5" /> : null}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
