import type { ServiceRequestType } from "@/services/serviceRequests";

export type BusinessServiceConfig = {
  slug: string;
  serviceType: ServiceRequestType;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  formTitle: string;
  formDescription: string;
  primaryLabel: string;
  primaryPlaceholder: string;
  primaryOptions: string[];
  secondaryLabel: string;
  secondaryPlaceholder: string;
  secondaryOptions: string[];
  serviceCards: Array<{
    title: string;
    text: string;
    rows: string[];
  }>;
  benefits: string[];
  trustPoints: Array<{ title: string; text: string }>;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  trackingTitle: string;
  trackingIdLabel: string;
};

export const annualComplianceConfig: BusinessServiceConfig = {
  slug: "annual-compliance",
  serviceType: "annual_compliance",
  title: "Annual Compliance Made Simple",
  description:
    "Keep company filings, statutory records and annual deadlines organised with expert-led compliance support.",
  image: "/assets/services/annual-compliance-service.png",
  imageAlt: "Annual business compliance planning and filing support",
  formTitle: "Get Annual Compliance Support",
  formDescription:
    "Share a few business details and our compliance expert will prepare the right filing checklist.",
  primaryLabel: "Business Structure",
  primaryPlaceholder: "Select business structure",
  primaryOptions: [
    "Private Limited Company",
    "LLP",
    "One Person Company",
    "Partnership Firm",
    "Other",
  ],
  secondaryLabel: "Compliance Requirement",
  secondaryPlaceholder: "Select compliance requirement",
  secondaryOptions: [
    "Complete Annual Compliance",
    "ROC Annual Filing",
    "Director KYC",
    "Statutory Registers & Minutes",
    "Compliance Consultation",
  ],
  serviceCards: [
    {
      title: "Annual ROC Filings",
      text: "Prepare and complete the core annual filings applicable to your entity.",
      rows: [
        "AOC-4 financial statement filing",
        "MGT-7 / MGT-7A annual return",
        "DIR-3 KYC assistance",
        "Due-date and document checklist",
      ],
    },
    {
      title: "Corporate Compliance Support",
      text: "Maintain essential governance records and handle event-based requirements.",
      rows: [
        "Board meeting and minutes guidance",
        "Statutory register support",
        "Event-based ROC filing assistance",
        "Compliance status review",
      ],
    },
  ],
  benefits: [
    "Deadline-focused filing",
    "Expert document review",
    "Clear compliance calendar",
    "End-to-end status updates",
  ],
  trustPoints: [
    {
      title: "Expert-led Review",
      text: "Your filing scope and documents are reviewed before preparation.",
    },
    {
      title: "Structured Checklist",
      text: "Know what is required, what is pending and what happens next.",
    },
    {
      title: "Deadline Tracking",
      text: "Important annual due dates remain visible throughout the process.",
    },
  ],
  submitLabel: "Request Compliance Support",
  successTitle: "Your annual compliance request is submitted.",
  successMessage:
    "Our compliance team will review your business details and share the applicable filing checklist.",
  trackingTitle: "Track Your Annual Compliance Request",
  trackingIdLabel: "Compliance Query ID",
};

export const taxComplianceConfig: BusinessServiceConfig = {
  slug: "tax-compliance",
  serviceType: "tax_compliance",
  title: "Reliable Tax Compliance Support",
  description:
    "Get guided help for tax filings, notices, reconciliations and deadline management for your business.",
  image: "/assets/services/tax-compliance-service.png",
  imageAlt: "Business tax compliance review and filing assistance",
  formTitle: "Talk to a Tax Compliance Expert",
  formDescription:
    "Tell us the support you need and an expert will help you understand the documents and next steps.",
  primaryLabel: "Applicant Type",
  primaryPlaceholder: "Select applicant type",
  primaryOptions: [
    "Individual / Professional",
    "Proprietorship",
    "Partnership / LLP",
    "Private Limited Company",
    "Other",
  ],
  secondaryLabel: "Tax Requirement",
  secondaryPlaceholder: "Select tax requirement",
  secondaryOptions: [
    "TDS Return Filing",
    "Tax Notice Assistance",
    "Advance Tax Review",
    "Tax Audit Support",
    "PAN / TAN Assistance",
    "General Tax Consultation",
  ],
  serviceCards: [
    {
      title: "Returns & Periodic Compliance",
      text: "Stay current with recurring direct-tax and business filing responsibilities.",
      rows: [
        "TDS return preparation and filing",
        "Advance tax working support",
        "PAN and TAN assistance",
        "Tax compliance calendar",
      ],
    },
    {
      title: "Notice & Review Support",
      text: "Understand tax notices and prepare a structured response with expert guidance.",
      rows: [
        "Notice and communication review",
        "Document reconciliation",
        "Response preparation assistance",
        "Tax audit coordination",
      ],
    },
  ],
  benefits: [
    "Tax expert assistance",
    "Accurate document review",
    "Deadline reminders",
    "Transparent request tracking",
  ],
  trustPoints: [
    {
      title: "Requirement Review",
      text: "We first identify the filing, notice or compliance scope involved.",
    },
    {
      title: "Secure Documentation",
      text: "Only the information relevant to your request is collected and reviewed.",
    },
    {
      title: "Clear Communication",
      text: "Receive practical updates without confusing tax terminology.",
    },
  ],
  submitLabel: "Request Tax Support",
  successTitle: "Your tax compliance request is submitted.",
  successMessage:
    "A tax compliance expert will review your requirement and contact you with the relevant document list.",
  trackingTitle: "Track Your Tax Compliance Request",
  trackingIdLabel: "Tax Query ID",
};

export const msmeRegistrationConfig: BusinessServiceConfig = {
  slug: "msme-registration",
  serviceType: "msme_registration",
  title: "MSME / Udyam Registration",
  description:
    "Register your enterprise on the Udyam portal and get guided support for business details, verification and certification.",
  image: "/assets/services/msme-registration-service.png",
  imageAlt: "MSME owner completing Udyam business registration",
  formTitle: "Start Your MSME Registration",
  formDescription:
    "Share your enterprise type and requirement to receive a tailored registration checklist.",
  primaryLabel: "Enterprise Type",
  primaryPlaceholder: "Select enterprise type",
  primaryOptions: [
    "Proprietorship",
    "Partnership Firm",
    "LLP",
    "Private Limited Company",
    "One Person Company",
    "Other",
  ],
  secondaryLabel: "MSME Requirement",
  secondaryPlaceholder: "Select MSME requirement",
  secondaryOptions: [
    "New Udyam Registration",
    "Update Udyam Details",
    "Download / Verify Certificate",
    "Udyam Re-registration",
    "MSME Consultation",
  ],
  serviceCards: [
    {
      title: "New Udyam Registration",
      text: "Complete MSME registration with guided business classification and verification.",
      rows: [
        "Enterprise information checklist",
        "NIC activity selection support",
        "Udyam application assistance",
        "Certificate generation guidance",
      ],
    },
    {
      title: "Post-registration Assistance",
      text: "Keep enterprise details accurate and make better use of your MSME identity.",
      rows: [
        "Udyam detail updates",
        "Certificate verification support",
        "Registration correction guidance",
        "MSME benefit orientation",
      ],
    },
  ],
  benefits: [
    "Paperless guidance",
    "Business activity support",
    "Application tracking",
    "Expert registration help",
  ],
  trustPoints: [
    {
      title: "Guided Classification",
      text: "Get help selecting the enterprise and business activity information.",
    },
    {
      title: "Document Clarity",
      text: "Receive a simple checklist based on your business structure.",
    },
    {
      title: "Application Updates",
      text: "Track your request from submission through certificate assistance.",
    },
  ],
  submitLabel: "Start MSME Registration",
  successTitle: "Your MSME registration request is submitted.",
  successMessage:
    "Our registration team will review your enterprise details and guide you through the Udyam process.",
  trackingTitle: "Track Your MSME Registration",
  trackingIdLabel: "MSME Query ID",
};

export const projectReportConfig: BusinessServiceConfig = {
  slug: "project-report",
  serviceType: "project_report",
  title: "Bank-ready Project Reports",
  description:
    "Get a structured project report for loan applications, government schemes, funding discussions and business planning.",
  image: "/assets/services/project-report-service.png",
  imageAlt: "Business team reviewing a professional financial project report",
  formTitle: "Request a Project Report",
  formDescription:
    "Tell us the business stage and report purpose so our team can plan the right financial format.",
  primaryLabel: "Business Stage",
  primaryPlaceholder: "Select business stage",
  primaryOptions: [
    "New Business / Startup",
    "Existing Business",
    "Business Expansion",
    "New Manufacturing Unit",
    "Other",
  ],
  secondaryLabel: "Report Purpose",
  secondaryPlaceholder: "Select report purpose",
  secondaryOptions: [
    "Bank Loan / DPR",
    "MUDRA / PMEGP Scheme",
    "Investor or Funding Discussion",
    "Feasibility Assessment",
    "Internal Business Planning",
  ],
  serviceCards: [
    {
      title: "Loan & Funding Reports",
      text: "Present the project, funding need and repayment potential in a structured format.",
      rows: [
        "Project cost and means of finance",
        "Projected profit and loss",
        "Cash-flow and balance-sheet estimates",
        "Break-even and repayment analysis",
      ],
    },
    {
      title: "Business Planning Reports",
      text: "Build a practical view of operations, market opportunity and financial viability.",
      rows: [
        "Business and promoter profile",
        "Market and operational overview",
        "Financial assumptions",
        "Risk and viability summary",
      ],
    },
  ],
  benefits: [
    "Custom financial estimates",
    "Professional report structure",
    "Bank-oriented presentation",
    "Draft review before delivery",
  ],
  trustPoints: [
    {
      title: "Requirement Discovery",
      text: "The report structure is aligned to your business and intended use.",
    },
    {
      title: "Financial Modelling",
      text: "Key projections are organised using your inputs and stated assumptions.",
    },
    {
      title: "Quality Review",
      text: "A draft review helps resolve gaps before the final report is delivered.",
    },
  ],
  submitLabel: "Request Project Report",
  successTitle: "Your project report request is submitted.",
  successMessage:
    "Our business advisory team will review your purpose and contact you for the financial inputs required.",
  trackingTitle: "Track Your Project Report Request",
  trackingIdLabel: "Project Report Query ID",
};

export const companyRegistrationConfig: BusinessServiceConfig = {
  slug: "company-registration",
  serviceType: "company_registration",
  title: "Company Formation & Trademark Registration",
  description:
    "Start and protect your business with guided incorporation, documentation, ROC filing and trademark support.",
  image: "/assets/services/company-registration-service.png",
  imageAlt: "Entrepreneurs completing company registration and incorporation",
  formTitle: "Start Your Company Registration",
  formDescription:
    "Select the entity and service you need to receive a clear registration and document checklist.",
  primaryLabel: "Business Structure",
  primaryPlaceholder: "Select business structure",
  primaryOptions: [
    "Private Limited Company",
    "Limited Liability Partnership (LLP)",
    "One Person Company (OPC)",
    "Partnership Firm",
    "Proprietorship",
    "Not Sure Yet",
  ],
  secondaryLabel: "Service Required",
  secondaryPlaceholder: "Select service required",
  secondaryOptions: [
    "Private Limited Company Registration",
    "LLP Registration",
    "One Person Company Registration",
    "Partnership Registration",
    "Trademark Registration",
    "ROC Filing Support",
    "Entity Selection Consultation",
  ],
  serviceCards: [
    {
      title: "Business Incorporation",
      text: "Choose and register an entity suited to your ownership, liability and growth plans.",
      rows: [
        "Private Limited Company registration",
        "LLP and OPC incorporation",
        "Name and document guidance",
        "Application and filing coordination",
      ],
    },
    {
      title: "Trademark & ROC Support",
      text: "Protect your business identity and keep essential corporate filings organised.",
      rows: [
        "Trademark application assistance",
        "Brand name and class guidance",
        "ROC filing support",
        "Post-incorporation checklist",
      ],
    },
  ],
  benefits: [
    "Entity selection guidance",
    "Expert document review",
    "Transparent filing workflow",
    "Public status tracking",
  ],
  trustPoints: [
    {
      title: "Right Entity Guidance",
      text: "Understand the practical differences between Pvt Ltd, LLP and OPC.",
    },
    {
      title: "Document Assistance",
      text: "Receive a structure-specific checklist before the filing is prepared.",
    },
    {
      title: "End-to-end Updates",
      text: "Track your request from initial review through filing support.",
    },
  ],
  submitLabel: "Start Company Registration",
  successTitle: "Your company registration request is submitted.",
  successMessage:
    "Our registration team will review your selected entity and contact you with the applicable document checklist.",
  trackingTitle: "Track Your Company Registration",
  trackingIdLabel: "Company Query ID",
};
