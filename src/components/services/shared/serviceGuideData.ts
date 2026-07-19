import type {
  ServiceGuideBlock,
  ServiceGuideConfig,
} from "./ServiceInformationGuide";

const paragraphs = (...items: string[]): ServiceGuideBlock => ({
  kind: "paragraphs",
  items,
});
const bullets = (items: string[], title?: string): ServiceGuideBlock => ({
  kind: "bullets",
  title,
  items,
});
const cards = (
  items: Array<{ title: string; text: string }>,
): ServiceGuideBlock => ({ kind: "cards", items });
const steps = (items: string[]): ServiceGuideBlock => ({
  kind: "steps",
  items,
});
const table = (columns: string[], rows: string[][]): ServiceGuideBlock => ({
  kind: "table",
  columns,
  rows,
});
const note = (text: string): ServiceGuideBlock => ({ kind: "note", text });
const faq = (
  items: Array<{ question: string; answer: string }>,
): ServiceGuideBlock => ({ kind: "faq", items });

export const itrFilingGuide: ServiceGuideConfig = {
  guideTitle: "ITR Filing Guide",
  knowledgeLabel: "Income-tax knowledge guide",
  supportLabel: "Get ITR Assistance",
  officialLabel: "Official e-Filing Portal",
  officialUrl: "https://www.incometax.gov.in/iec/foportal/",
  disclaimer:
    "This is a practical overview, not tax advice. Form eligibility, due dates and filing rules can change by assessment year; confirm the latest position on the Income Tax e-Filing Portal.",
  sections: [
    {
      id: "itr-overview",
      label: "What is ITR Filing?",
      shortLabel: "Overview",
      title: "What is an Income Tax Return?",
      summary:
        "An Income Tax Return reports income, deductions, taxes paid and the resulting tax liability or refund for an assessment year.",
      icon: "overview",
      blocks: [
        paragraphs(
          "ITR filing brings income from applicable sources into the prescribed return form and reconciles it with tax already paid through TDS, TCS, advance tax or self-assessment tax.",
          "The return is complete only after it is successfully submitted and verified through an available verification method. The correct form depends on taxpayer status, residential status and the nature of income—not income amount alone.",
        ),
        bullets(
          [
            "Report taxable and exempt income correctly",
            "Claim eligible deductions and tax credits",
            "Compute tax payable or refund due",
            "Create an official income and filing record",
          ],
          "What a return brings together",
        ),
      ],
    },
    {
      id: "itr-who-should-file",
      label: "Who Should File?",
      shortLabel: "Eligibility",
      title: "Who may need to file an ITR?",
      summary:
        "Income limits are only one test; specified transactions, assets, losses, refunds and taxpayer category can also make filing relevant or mandatory.",
      icon: "eligibility",
      blocks: [
        cards([
          {
            title: "Individuals & HUFs",
            text: "Filing depends on total income, chosen tax regime and other conditions prescribed for the relevant year.",
          },
          {
            title: "Business & professionals",
            text: "Proprietors, partners and professionals should assess business income, presumptive taxation and audit-related rules.",
          },
          {
            title: "Capital gains or multiple incomes",
            text: "Property, securities, virtual digital assets, foreign income or multiple income heads can affect the applicable form.",
          },
          {
            title: "Refund or loss claims",
            text: "A return may be needed to claim excess tax refund or carry forward eligible losses, subject to applicable timelines.",
          },
        ]),
        note(
          "Do not decide filing eligibility only from salary or bank credits. Review all income heads and the mandatory-filing conditions applicable to the assessment year.",
        ),
      ],
    },
    {
      id: "itr-form-selection",
      label: "Choose the Right ITR",
      shortLabel: "ITR Form",
      title: "Choosing the correct ITR form",
      summary:
        "Using an inapplicable form can cause validation issues or make the return defective, so income sources must be mapped before filing.",
      icon: "report",
      blocks: [
        table(
          ["Common form", "Broad use", "Important caution"],
          [
            ["ITR-1", "Eligible resident individuals with specified, relatively simple income", "Not available where any exclusion in the notified form applies"],
            ["ITR-2", "Individuals or HUFs not having income from business or profession", "Often relevant for capital gains or more complex non-business income"],
            ["ITR-3", "Individuals or HUFs with income from business or profession", "Requires business/professional schedules and financial details as applicable"],
            ["ITR-4", "Eligible presumptive-income cases subject to notified conditions", "Not a universal form for every small business or professional"],
          ],
        ),
        note(
          "This table is directional. Always check the current assessment year's form instructions and exclusions before selecting a return.",
        ),
      ],
    },
    {
      id: "itr-documents",
      label: "Documents & Data",
      shortLabel: "Documents",
      title: "Information to collect before filing",
      summary:
        "A clean filing starts by reconciling identity, income, tax-credit and bank information before entering the return.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "PAN, Aadhaar and active e-Filing login details",
            "Form 16 / 16A and other TDS certificates",
            "AIS, TIS and Form 26AS reconciliation",
            "Bank interest certificates and account details",
            "Capital-gain statements and property records, if applicable",
            "Business accounts, invoices and expense records, if applicable",
            "Deduction, donation and eligible investment proofs",
            "Advance-tax and self-assessment-tax challans",
          ],
          "Practical filing checklist",
        ),
        note(
          "ITR forms are generally annexure-less, but supporting records should be retained because they may be required for verification, processing or a later query.",
        ),
      ],
    },
    {
      id: "itr-process",
      label: "Filing Process",
      shortLabel: "Process",
      title: "How online ITR filing works",
      summary:
        "The filing flow moves from profile and form selection to data review, tax payment, submission and verification.",
      icon: "process",
      blocks: [
        steps([
          "Sign in to the official e-Filing Portal with the taxpayer's valid credentials.",
          "Select the assessment year, filing mode and taxpayer status.",
          "Choose the applicable ITR form and review pre-filled information.",
          "Complete the relevant income, deduction, tax-paid and disclosure schedules.",
          "Reconcile the computation and pay any remaining self-assessment tax, if applicable.",
          "Validate the return, preview the final data and submit it.",
          "Complete e-Verification or follow the permitted ITR-V process within the prescribed time.",
          "Save the acknowledgement and monitor processing or notices on the portal.",
        ]),
      ],
    },
    {
      id: "itr-verification",
      label: "e-Verification",
      shortLabel: "Verify",
      title: "Why ITR verification matters",
      summary:
        "Uploading a return is not the final step; an unverified return can be treated as invalid if verification is not completed in time.",
      icon: "compliance",
      blocks: [
        cards([
          { title: "Aadhaar OTP", text: "Available where the Aadhaar-linked mobile and portal conditions are satisfied." },
          { title: "Bank / Demat EVC", text: "An electronic verification code may be available through a validated account." },
          { title: "Net banking", text: "Eligible banks can redirect the taxpayer securely to the e-Filing account." },
          { title: "Digital signature", text: "A registered DSC may be mandatory or preferred for specified taxpayer categories." },
        ]),
        note(
          "Use the verification option shown for your profile and keep the acknowledgement. The portal displays the current verification timeline and available methods.",
        ),
      ],
    },
    {
      id: "itr-status-refund",
      label: "Status & Refund",
      shortLabel: "Status",
      title: "Track return processing and refund status",
      summary:
        "The e-Filing dashboard shows whether a return is pending verification, verified, under processing, processed or requires action.",
      icon: "status",
      blocks: [
        steps([
          "Open the e-Filing dashboard and go to filed returns or return status.",
          "Select the relevant assessment year and acknowledgement number.",
          "Check for pending verification, processing results, defects or portal communications.",
          "If a refund is determined, confirm that the nominated bank account is valid and pre-validated.",
        ]),
        bullets([
          "Review notices and intimations inside the portal",
          "Keep contact and bank details current",
          "Use the official refund-status service for updates",
          "Respond within the date stated in any communication",
        ]),
      ],
    },
    {
      id: "itr-faqs",
      label: "ITR FAQs",
      shortLabel: "FAQs",
      title: "Frequently asked ITR filing questions",
      summary: "Straight answers to common questions that arise before and after filing.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Can I file an ITR if tax is already deducted?", answer: "Yes. TDS is tax credit, not a substitute for filing where a return is required. The return reconciles income, deductions and the tax already deducted." },
          { question: "Is Form 16 enough to prepare my return?", answer: "Not always. Bank interest, capital gains, property income, other TDS records and AIS/TIS entries may also need review." },
          { question: "Can the wrong ITR form be corrected?", answer: "Depending on the stage and applicable timeline, a revised or otherwise permitted return may be available. Review the portal options and current law promptly." },
          { question: "When will an income-tax refund arrive?", answer: "There is no guaranteed universal timeline. Processing, verification, bank validation and any mismatch or query can affect the credit." },
          { question: "Should documents be uploaded with the ITR?", answer: "ITR forms are generally filed without attachments, but the supporting evidence should be retained and produced if required." },
        ]),
      ],
    },
  ],
};

export const companyRegistrationGuide: ServiceGuideConfig = {
  guideTitle: "Company Registration Guide",
  knowledgeLabel: "Business formation guide",
  supportLabel: "Get Registration Help",
  officialLabel: "Official MCA Portal",
  officialUrl: "https://www.mca.gov.in/content/mca/global/en/home.html",
  disclaimer:
    "This guide is general information. Entity suitability, forms, government fees and approval requirements vary; verify the latest MCA rules and take professional advice for your structure.",
  sections: [
    {
      id: "company-overview",
      label: "What is Registration?",
      shortLabel: "Overview",
      title: "What is company registration?",
      summary:
        "Company registration creates a legally recognised entity through the Ministry of Corporate Affairs incorporation process.",
      icon: "overview",
      blocks: [
        paragraphs(
          "An incorporated company has a legal identity distinct from its shareholders, subject to the Companies Act and its constitutional documents. The incorporation certificate records the Corporate Identity Number and date from which the entity exists.",
          "Registration is different from merely choosing a trade name, obtaining GST registration or filing a trademark. Each serves a separate legal or tax purpose.",
        ),
        bullets([
          "Separate legal identity for an incorporated entity",
          "Defined ownership and governance structure",
          "Constitution through MoA and AoA",
          "Ongoing MCA and statutory compliance responsibilities",
        ]),
      ],
    },
    {
      id: "company-structure",
      label: "Choose a Structure",
      shortLabel: "Structure",
      title: "Choose the right business structure",
      summary:
        "Ownership, liability, funding plans, governance and compliance capacity should drive the structure—not just registration cost.",
      icon: "business",
      blocks: [
        cards([
          { title: "Private Limited Company", text: "Common for scalable businesses seeking a share-based ownership structure and potential external investment." },
          { title: "One Person Company", text: "A company form designed for an eligible single member, with prescribed nominee and compliance conditions." },
          { title: "Limited Liability Partnership", text: "Combines a partnership-style arrangement with a separate legal identity and limited liability framework." },
          { title: "Partnership / Proprietorship", text: "These are not incorporated as companies through SPICe+; their formation, liability and registrations follow different rules." },
        ]),
        note("Consider expected owners, capital needs, decision rights, tax profile and annual compliance before finalising the entity."),
      ],
    },
    {
      id: "company-documents",
      label: "Documents Required",
      shortLabel: "Documents",
      title: "Company incorporation document checklist",
      summary:
        "The exact list depends on the proposed company, subscribers, directors, registered office and whether any person is foreign-resident.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "PAN and identity proof of Indian subscribers/directors",
            "Address proof matching the filing requirements",
            "Recent proof for the registered office address",
            "Owner NOC and premises proof where applicable",
            "Proposed names and main business-object details",
            "Subscriber shareholding and director information",
            "Digital signatures for proposed signatories",
            "Additional notarised/apostilled records for foreign participants, where applicable",
          ],
          "Typical information set",
        ),
      ],
    },
    {
      id: "company-name-dsc",
      label: "Name & DSC",
      shortLabel: "Name / DSC",
      title: "Name reservation and digital signatures",
      summary:
        "A strong filing starts with a compliant proposed name and valid digital signatures for the people signing the incorporation forms.",
      icon: "certificate",
      blocks: [
        cards([
          { title: "Proposed name", text: "The name should be distinctive, relevant and not conflict with restricted words or existing names and trademarks." },
          { title: "Digital Signature Certificate", text: "Incorporation documents are filed electronically and require valid DSCs for the prescribed signatories." },
          { title: "Business objects", text: "The main objects should clearly describe the intended activity and align with the name and incorporation documents." },
          { title: "Registered office", text: "Provide a valid address and supporting premises records in the form and timeline applicable to the filing." },
        ]),
      ],
    },
    {
      id: "company-process",
      label: "SPICe+ Process",
      shortLabel: "Process",
      title: "Company incorporation through SPICe+",
      summary:
        "SPICe+ combines name reservation and incorporation information with linked forms and registrations.",
      icon: "process",
      blocks: [
        steps([
          "Compare entity options and finalise the proposed ownership and director structure.",
          "Obtain the required Digital Signature Certificates and create the MCA filing access.",
          "Prepare proposed names, business objects and SPICe+ Part A details.",
          "Complete SPICe+ Part B with capital, subscriber, director and registered-office information.",
          "Prepare linked constitutional and registration forms, including e-MoA/e-AoA and AGILE-PRO-S as applicable.",
          "Affix digital signatures, perform professional certification where required and submit with the applicable fees/stamp duty.",
          "Respond to any resubmission query within the permitted time.",
          "Download the incorporation certificate and complete the post-incorporation checklist.",
        ]),
      ],
    },
    {
      id: "company-after-registration",
      label: "After Incorporation",
      shortLabel: "Next Steps",
      title: "What to do after company registration",
      summary:
        "Incorporation is the start of compliance, not the end; operational and corporate records must be activated promptly.",
      icon: "compliance",
      blocks: [
        bullets([
          "Open and validate the company's bank account",
          "Bring in subscribed capital and preserve evidence",
          "Issue share certificates and update statutory registers",
          "Appoint the first auditor within the applicable framework",
          "Assess commencement, GST, labour and local registrations",
          "Set up books, invoicing, payroll and tax processes",
          "Create a board, ROC and tax compliance calendar",
          "Protect the brand separately through trademark filing if required",
        ]),
      ],
    },
    {
      id: "company-trademark",
      label: "Company vs Trademark",
      shortLabel: "Trademark",
      title: "Company registration does not automatically protect a brand",
      summary:
        "MCA name approval and trademark rights are separate checks administered under different legal systems.",
      icon: "compliance",
      blocks: [
        table(
          ["Registration", "Primary purpose", "What it does not replace"],
          [
            ["Company incorporation", "Creates the legal entity and approved corporate name", "Trademark search and brand protection"],
            ["Trademark application", "Seeks protection for a mark in selected classes", "Company incorporation or business licences"],
            ["GST registration", "Creates an indirect-tax identity where applicable", "Entity creation or ownership rights in a brand"],
          ],
        ),
      ],
    },
    {
      id: "company-faqs",
      label: "Registration FAQs",
      shortLabel: "FAQs",
      title: "Company registration FAQs",
      summary: "Useful answers before choosing and incorporating an entity.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Is a private limited company right for every business?", answer: "No. It offers a structured corporate form but also brings governance and annual filing duties. Compare it with LLP, OPC and non-company structures first." },
          { question: "Does name approval guarantee incorporation?", answer: "No. The incorporation forms, documents, eligibility and professional certification must still satisfy the Registrar." },
          { question: "Can a home address be used as registered office?", answer: "It may be possible where valid address proof, premises evidence and owner consent satisfy the applicable requirements." },
          { question: "Is GST included automatically?", answer: "The integrated filing may support linked registrations, but GST liability and activation depend on the information, eligibility and approval process." },
          { question: "How long does incorporation take?", answer: "There is no fixed guarantee. Name issues, document quality, stamp duty, resubmission and MCA processing can change the timeline." },
        ]),
      ],
    },
  ],
};

export const annualComplianceGuide: ServiceGuideConfig = {
  guideTitle: "Annual Compliance Guide",
  knowledgeLabel: "Corporate compliance guide",
  supportLabel: "Get Compliance Help",
  officialLabel: "Official MCA Portal",
  officialUrl: "https://www.mca.gov.in/content/mca/global/en/home.html",
  disclaimer:
    "This is a general company-compliance overview. Forms, due dates, fees and exemptions depend on entity type and current MCA notifications; verify the latest requirements for the company.",
  sections: [
    {
      id: "annual-overview",
      label: "What is Annual Compliance?",
      shortLabel: "Overview",
      title: "What is annual company compliance?",
      summary:
        "Annual compliance is the recurring set of corporate, financial, tax and record-keeping duties that continue after incorporation.",
      icon: "overview",
      blocks: [
        paragraphs(
          "Every registered entity has a compliance cycle based on its legal form, financial year, activity and events. For a company, this commonly includes financial statements, annual return, board/shareholder records and director-related filings.",
          "A dormant or loss-making company may still have filing duties. Zero business activity does not automatically close the entity or remove statutory responsibilities.",
        ),
        bullets([
          "Maintain accurate books and statutory records",
          "Hold and document required meetings",
          "Prepare and approve financial statements",
          "File applicable MCA and tax returns on time",
        ]),
      ],
    },
    {
      id: "annual-applicable-filings",
      label: "Key MCA Filings",
      shortLabel: "Filings",
      title: "Common annual MCA filings",
      summary:
        "The exact form and certification route depends on company category, size, listing status and current MCA rules.",
      icon: "report",
      blocks: [
        table(
          ["Area", "Common form / record", "Purpose"],
          [
            ["Financial statements", "AOC-4 family, as applicable", "Files adopted financial statements and prescribed attachments"],
            ["Annual return", "MGT-7 or MGT-7A, as applicable", "Reports company, capital, member and governance information"],
            ["Director KYC", "DIR-3 KYC / web service, as applicable", "Maintains prescribed KYC details for DIN holders"],
            ["Auditor matters", "ADT forms, when applicable", "Records appointment, changes or other auditor-related events"],
          ],
        ),
        note("Form names are not a complete checklist. Entity-specific, event-based and beneficial-ownership filings may also apply."),
      ],
    },
    {
      id: "annual-calendar",
      label: "Compliance Calendar",
      shortLabel: "Calendar",
      title: "Build a practical annual compliance calendar",
      summary:
        "A useful calendar links each due date to its prerequisite meeting, document owner and approval—not just a reminder notification.",
      icon: "compliance",
      blocks: [
        cards([
          { title: "Monthly / periodic", text: "Bookkeeping, tax deposits, payroll, GST or TDS returns and bank reconciliation as applicable." },
          { title: "Quarterly", text: "Board review, tax statements, advance-tax assessment and management reporting where relevant." },
          { title: "Year-end", text: "Close accounts, collect balances, prepare financial statements and support the statutory audit." },
          { title: "Post-AGM / annual filing", text: "Complete the prescribed ROC filings using adopted records and valid digital signatures." },
        ]),
      ],
    },
    {
      id: "annual-documents",
      label: "Documents Required",
      shortLabel: "Documents",
      title: "Records needed for annual compliance",
      summary:
        "Organised books and governance records reduce filing delays and avoid last-minute mismatch corrections.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "Updated books, ledgers and trial balance",
            "Bank statements and reconciliations",
            "Sales, purchase, expense and asset records",
            "Share capital and member details",
            "Director disclosures and KYC information",
            "Board/AGM notices, attendance and minutes",
            "Previous ROC filings and incorporation records",
            "Tax returns, challans and reconciliation workings",
          ],
          "Core annual file",
        ),
      ],
    },
    {
      id: "annual-process",
      label: "Compliance Process",
      shortLabel: "Process",
      title: "End-to-end annual filing workflow",
      summary:
        "Good annual compliance follows the underlying accounts and approvals before the e-forms are prepared.",
      icon: "process",
      blocks: [
        steps([
          "Confirm company status, category, financial year and all applicable filings.",
          "Review the prior-year filings, open events and statutory registers.",
          "Close and reconcile books, taxes, bank accounts and related-party balances.",
          "Prepare financial statements and complete the statutory audit where applicable.",
          "Hold the required board and shareholder approvals with proper records.",
          "Prepare the applicable e-forms and supporting attachments.",
          "Complete DSC and professional certification checks before submission.",
          "Save challans, acknowledgements and update the next compliance calendar.",
        ]),
      ],
    },
    {
      id: "annual-delays",
      label: "Delay & Non-filing",
      shortLabel: "Delays",
      title: "What happens when annual filings are delayed?",
      summary:
        "Delay can create additional fees and may affect the company, its officers and future corporate actions.",
      icon: "compliance",
      blocks: [
        cards([
          { title: "Additional filing cost", text: "Late forms may attract additional government fees that increase with delay under the applicable framework." },
          { title: "Director impact", text: "Persistent defaults can have consequences for directors or DIN-related compliance in specified situations." },
          { title: "Transaction friction", text: "Lenders, investors and counterparties may question outdated MCA records or unresolved non-compliance." },
          { title: "Strike-off is not a shortcut", text: "Stopping operations does not itself close a company; a lawful closure or strike-off process is required." },
        ]),
        note("Resolve missed filings after checking the company's current master data, notices, filing status and available legal route."),
      ],
    },
    {
      id: "annual-records",
      label: "Records & Governance",
      shortLabel: "Records",
      title: "Maintain evidence behind every filing",
      summary:
        "ROC forms should agree with the company's books, registers, resolutions, audited records and shareholder information.",
      icon: "documents",
      blocks: [
        bullets([
          "Keep signed financial statements and audit reports",
          "Preserve notices, consents, attendance and minutes",
          "Update member, director, charge and asset registers",
          "Record share issue and transfer documentation",
          "Maintain DSC control and filing approval evidence",
          "Archive SRNs, challans and filed-form copies",
        ]),
      ],
    },
    {
      id: "annual-faqs",
      label: "Compliance FAQs",
      shortLabel: "FAQs",
      title: "Annual compliance FAQs",
      summary: "Common questions from active and inactive companies.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Does a company with no revenue need annual filing?", answer: "Usually, incorporation creates continuing compliance duties even without revenue. The exact forms and audit/tax position depend on the entity and facts." },
          { question: "Are AOC-4 and MGT-7 the only annual forms?", answer: "No. They are common company filings, but director KYC, auditor, beneficial ownership, event-based and tax filings may also apply." },
          { question: "Can annual forms be filed before accounts are approved?", answer: "The filing sequence must follow the applicable preparation, audit and approval requirements. Do not file unsupported or inconsistent data." },
          { question: "What if a previous year's filing is pending?", answer: "Review the entire filing history and dependencies first. Some current filings may require earlier records or corrections to be completed." },
          { question: "How do I close an inactive company?", answer: "Use the applicable strike-off, liquidation or other closure route after resolving liabilities and required filings; simply abandoning the company is not closure." },
        ]),
      ],
    },
  ],
};

export const taxComplianceGuide: ServiceGuideConfig = {
  guideTitle: "Tax Compliance Guide",
  knowledgeLabel: "Business tax guide",
  supportLabel: "Get Tax Assistance",
  officialLabel: "Official e-Filing Portal",
  officialUrl: "https://www.incometax.gov.in/iec/foportal/",
  disclaimer:
    "This content is general information, not tax advice. Rates, forms, thresholds and due dates depend on the taxpayer and period; verify current law and portal guidance before acting.",
  sections: [
    {
      id: "tax-overview",
      label: "What is Tax Compliance?",
      shortLabel: "Overview",
      title: "What is business tax compliance?",
      summary:
        "Tax compliance is the connected process of calculating, paying, reporting and reconciling taxes supported by reliable books and evidence.",
      icon: "overview",
      blocks: [
        paragraphs(
          "Compliance is wider than filing an annual return. Depending on the business, it may include TDS/TCS, advance tax, income-tax returns, tax audit, information statements, GST coordination and responses to portal communications.",
          "The strongest process starts with accurate transactions and reconciliations. A return prepared from incomplete books can produce tax-credit mismatches, incorrect deductions or avoidable notices.",
        ),
        bullets([
          "Map every applicable tax and filing obligation",
          "Maintain complete transaction-level records",
          "Deposit and report tax within the applicable cycle",
          "Reconcile portal data before final submission",
        ]),
      ],
    },
    {
      id: "tax-applicability",
      label: "Tax Responsibilities",
      shortLabel: "Applicability",
      title: "Common direct-tax responsibilities",
      summary:
        "The applicable set changes with entity type, income, payments, turnover, transactions and audit requirements.",
      icon: "eligibility",
      blocks: [
        cards([
          { title: "Income-tax return", text: "Reports taxable income, eligible deductions, taxes paid and final liability or refund for the relevant period." },
          { title: "TDS / TCS", text: "Requires timely deduction or collection, deposit, statement filing and certificate issuance where provisions apply." },
          { title: "Advance tax", text: "Estimated tax may need to be paid in instalments where the prescribed liability test is met." },
          { title: "Tax audit & forms", text: "Specified businesses, professionals or transactions may require audit reports or additional statutory forms." },
        ]),
        note("Applicability should be reviewed at the start of the year and again when turnover, activities or payment types change."),
      ],
    },
    {
      id: "tax-tds",
      label: "TDS / TCS Compliance",
      shortLabel: "TDS / TCS",
      title: "Build a clean TDS and TCS process",
      summary:
        "Correct section mapping, timing, deposit and statement data all matter; fixing only the return does not correct the underlying transaction.",
      icon: "money",
      blocks: [
        steps([
          "Identify payments or receipts that may attract deduction or collection provisions.",
          "Validate PAN, residency, threshold and rate information for the relevant transaction.",
          "Deduct or collect tax at the correct event and account for it in the books.",
          "Deposit the tax using the correct TAN, period, section and challan details.",
          "Prepare and validate the applicable quarterly statement.",
          "Reconcile defaults, challans and deductee records before issuing certificates.",
        ]),
        note("TDS rules are transaction-specific. Review the provision and current rate instead of applying one standard percentage to all vendors."),
      ],
    },
    {
      id: "tax-reconciliation",
      label: "Tax Reconciliation",
      shortLabel: "Reconcile",
      title: "Reconcile books with tax portals",
      summary:
        "A periodic reconciliation catches missing credits, duplicate income, incorrect PAN data and challan errors before filing.",
      icon: "calculator",
      blocks: [
        table(
          ["Reconciliation", "Compare", "Typical issue found"],
          [
            ["TDS credit", "Books / certificates vs Form 26AS and AIS", "Missing or incorrect deductor reporting"],
            ["Income", "Ledgers and bank data vs AIS/TIS", "Duplicate, omitted or misclassified entries"],
            ["Tax payments", "Challans vs portal credit", "Wrong PAN/TAN, year, section or amount"],
            ["Turnover", "Financial statements vs GST and tax returns", "Period or classification differences"],
          ],
        ),
      ],
    },
    {
      id: "tax-documents",
      label: "Documents Required",
      shortLabel: "Documents",
      title: "Tax compliance record checklist",
      summary:
        "A structured tax file should connect every reported figure with books, statements, challans and supporting evidence.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "PAN, TAN and authorised portal access details",
            "Books, trial balance and financial statements",
            "Bank, loan and investment statements",
            "Sales, purchase and expense ledgers",
            "TDS/TCS workings, challans and filed statements",
            "Form 26AS, AIS and TIS reconciliation",
            "Prior returns, audit reports and carried-forward items",
            "Notices, orders and earlier response records",
          ],
          "Core document set",
        ),
      ],
    },
    {
      id: "tax-notices",
      label: "Tax Notice Support",
      shortLabel: "Notices",
      title: "How to respond to a tax notice",
      summary:
        "A notice should be verified, classified and answered against the exact issue and deadline stated on the official portal.",
      icon: "compliance",
      blocks: [
        steps([
          "Verify the communication on the official portal and note the section, year and response deadline.",
          "Identify whether it is an information request, mismatch, defect, demand, assessment or other proceeding.",
          "Reconcile the notice with the filed return, books, tax credits and earlier correspondence.",
          "Prepare an issue-wise response with indexed supporting documents and clear computations.",
          "Submit through the correct portal workflow and retain the acknowledgement.",
          "Track subsequent communications, hearing dates, orders or rectification/appeal options.",
        ]),
        note("Do not ignore a notice or reply only by email/phone unless the official communication specifically prescribes that channel."),
      ],
    },
    {
      id: "tax-workflow",
      label: "Compliance Workflow",
      shortLabel: "Workflow",
      title: "A reliable recurring tax workflow",
      summary:
        "Assign owners and evidence to each obligation so compliance does not depend on memory at the due date.",
      icon: "process",
      blocks: [
        cards([
          { title: "1. Applicability map", text: "List tax types, forms, periods, thresholds, owners and dependencies for the business." },
          { title: "2. Monthly close", text: "Lock books only after bank, vendor, payroll and tax-control accounts are reconciled." },
          { title: "3. Review & approval", text: "Document computation review, management approval and payment authorisation." },
          { title: "4. Filing archive", text: "Store returns, challans, acknowledgements, workings and portal communications by period." },
        ]),
      ],
    },
    {
      id: "tax-faqs",
      label: "Tax Compliance FAQs",
      shortLabel: "FAQs",
      title: "Tax compliance FAQs",
      summary: "Quick answers to recurring business tax questions.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Are income-tax return and GST return the same?", answer: "No. They belong to different tax systems and report different information, though turnover and transaction data should reconcile where relevant." },
          { question: "Can a nil TDS statement still be required?", answer: "The answer depends on the applicable statement, transaction and portal rules. Review the quarter's deduction obligation and current filing guidance." },
          { question: "What if AIS information is incorrect?", answer: "Reconcile it with your evidence and use the available feedback or correction route. Do not blindly include or ignore an entry without analysis." },
          { question: "Can a tax notice be revised after submission?", answer: "Response options depend on the proceeding and portal state. If an error is found, review whether an additional submission, rectification or other legal route is available." },
          { question: "How often should tax reconciliation be done?", answer: "High-volume businesses should reconcile periodically rather than wait for year-end. The ideal cycle depends on transaction volume and filing frequency." },
        ]),
      ],
    },
  ],
};

export const msmeRegistrationGuide: ServiceGuideConfig = {
  guideTitle: "MSME / Udyam Guide",
  knowledgeLabel: "Enterprise registration guide",
  supportLabel: "Get Udyam Help",
  officialLabel: "Official Udyam Portal",
  officialUrl: "https://udyamregistration.gov.in/",
  disclaimer:
    "Udyam registration on the government portal is free, paperless and self-declaration based. This private assistance guide is optional; always use and verify details on the official portal.",
  sections: [
    {
      id: "msme-overview",
      label: "What is Udyam?",
      shortLabel: "Overview",
      title: "What is MSME / Udyam Registration?",
      summary:
        "Udyam is the Government of India registration framework for eligible micro, small and medium enterprises.",
      icon: "overview",
      blocks: [
        paragraphs(
          "An enterprise files online on the official Udyam portal using self-declared information and linked government data. On completion, it receives a permanent Udyam Registration Number and an electronic certificate with a dynamic QR code.",
          "The official portal states that registration is free, paperless and does not require document uploads. Fintaraa can help organise information, but it is not the government registration authority.",
        ),
        bullets([
          "One registration can include multiple manufacturing or service activities",
          "The registration number is permanent",
          "The certificate is issued online",
          "Renewal is not ordinarily required under the current framework",
        ]),
      ],
    },
    {
      id: "msme-classification",
      label: "MSME Classification",
      shortLabel: "Classification",
      title: "Current MSME classification limits",
      summary:
        "Classification uses a composite test of investment and turnover; both limits for the category must be satisfied.",
      icon: "money",
      blocks: [
        table(
          ["Category", "Investment limit", "Turnover limit"],
          [
            ["Micro", "Not exceeding ₹2.5 crore", "Not exceeding ₹10 crore"],
            ["Small", "Not exceeding ₹25 crore", "Not exceeding ₹100 crore"],
            ["Medium", "Not exceeding ₹125 crore", "Not exceeding ₹500 crore"],
          ],
        ),
        note("These revised limits apply from 1 April 2025 according to the official Udyam portal. Verify the portal for any later notification or classification update."),
      ],
    },
    {
      id: "msme-eligibility",
      label: "Who Can Register?",
      shortLabel: "Eligibility",
      title: "Who can apply for Udyam Registration?",
      summary:
        "A person intending to establish a qualifying micro, small or medium enterprise may file, subject to identity and enterprise-data requirements.",
      icon: "eligibility",
      blocks: [
        cards([
          { title: "Proprietorship", text: "Uses the proprietor's Aadhaar and the enterprise's applicable PAN/GST-linked information." },
          { title: "Partnership / HUF", text: "Uses the managing partner's or karta's Aadhaar along with entity information." },
          { title: "Company / LLP", text: "The organisation or authorised signatory provides Aadhaar together with PAN and GSTIN as applicable." },
          { title: "Manufacturing and services", text: "One registration can record eligible manufacturing, service or both types of activities." },
        ]),
        note("An enterprise should not file multiple Udyam registrations merely for different activities; activities can be included in one registration."),
      ],
    },
    {
      id: "msme-information",
      label: "Information Required",
      shortLabel: "Information",
      title: "Information to keep ready",
      summary:
        "The portal is paperless, but the data entered must accurately match Aadhaar, PAN, GST and enterprise records.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "Aadhaar and name of the prescribed proprietor/partner/karta/signatory",
            "Enterprise PAN and GSTIN where applicable",
            "Legal and trade name of the enterprise",
            "Business address, bank and contact information",
            "Date of commencement and organisation type",
            "Plant/unit locations and number of persons employed",
            "NIC activity codes for manufacturing or services",
            "Prior UAM/EM-II or registration information, if relevant",
          ],
          "Prepare accurate data—no upload checklist",
        ),
      ],
    },
    {
      id: "msme-process",
      label: "Registration Process",
      shortLabel: "Process",
      title: "How Udyam Registration works",
      summary:
        "The official flow verifies identity and enterprise data before generating the registration and online certificate.",
      icon: "process",
      blocks: [
        steps([
          "Open only the official Udyam Registration portal and choose the correct new-registration option.",
          "Enter the prescribed Aadhaar number and name, provide consent and complete OTP verification.",
          "Validate PAN and the organisation type; provide GSTIN where applicable.",
          "Complete enterprise name, address, commencement, bank and contact details.",
          "Add plant/unit locations, employment data and accurate NIC activity codes.",
          "Review the self-declaration carefully and submit using the available verification flow.",
          "Save the Udyam Registration Number and download the electronic certificate.",
        ]),
      ],
    },
    {
      id: "msme-certificate",
      label: "Certificate & Verification",
      shortLabel: "Certificate",
      title: "Udyam certificate and online verification",
      summary:
        "The e-certificate records the enterprise identity and classification and carries a dynamic QR code for portal-based verification.",
      icon: "certificate",
      blocks: [
        cards([
          { title: "Permanent identity", text: "The Udyam Registration Number is the enterprise's permanent identifier under the framework." },
          { title: "Dynamic QR code", text: "The certificate QR code links to the official portal record and enterprise details." },
          { title: "Online print / verify", text: "Use the official portal services to print the certificate or verify a registration number." },
          { title: "No renewal", text: "The official portal currently states that registration does not require renewal." },
        ]),
      ],
    },
    {
      id: "msme-updates-benefits",
      label: "Updates & Benefits",
      shortLabel: "After Udyam",
      title: "Keep Udyam details current and assess scheme eligibility",
      summary:
        "Registration can support MSME identification, but it does not automatically approve a loan, subsidy, tender or tax benefit.",
      icon: "compliance",
      blocks: [
        bullets([
          "Update enterprise information through the official portal when required",
          "Check automatic classification updates linked to government data",
          "Use the certificate for eligible lender, tender or scheme processes",
          "Review each benefit's separate eligibility and application conditions",
          "Avoid agents claiming mandatory government registration charges",
          "Do not share Aadhaar OTP or portal credentials with unverified persons",
        ]),
        note("Udyam registration is an enterprise identity, not a guarantee of finance or government incentives."),
      ],
    },
    {
      id: "msme-faqs",
      label: "Udyam FAQs",
      shortLabel: "FAQs",
      title: "MSME / Udyam FAQs",
      summary: "Important answers before using the registration portal.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Is Udyam Registration free?", answer: "Yes. The official Government of India portal states that the registration process is free. Private assistance, if chosen, is a separate optional service." },
          { question: "Do I need to upload documents?", answer: "The official registration is paperless and self-declaration based, with no document or proof upload for registration. Entered data must still be correct." },
          { question: "Can one business have more than one Udyam?", answer: "The official framework says an enterprise should not file more than one registration, though multiple activities may be included in it." },
          { question: "Is PAN or GSTIN compulsory?", answer: "PAN and GSTIN-linked requirements apply according to organisation type and GST applicability. Follow the fields and rules shown on the official portal." },
          { question: "Does Udyam guarantee a business loan?", answer: "No. A lender independently evaluates eligibility, repayment capacity, credit profile, documents and the relevant loan policy." },
        ]),
      ],
    },
  ],
};

export const projectReportGuide: ServiceGuideConfig = {
  guideTitle: "Project Report Guide",
  knowledgeLabel: "Business planning guide",
  supportLabel: "Get Report Assistance",
  officialLabel: "SIDBI Official Website",
  officialUrl: "https://www.sidbi.in/",
  disclaimer:
    "This guide explains common project-report practice. Every bank, scheme and investor can request a different format, appraisal period or evidence set; confirm the recipient's latest checklist.",
  sections: [
    {
      id: "report-overview",
      label: "What is a Project Report?",
      shortLabel: "Overview",
      title: "What is a business project report?",
      summary:
        "A project report explains the proposed business, funding requirement, execution plan and expected financial performance in one structured document.",
      icon: "overview",
      blocks: [
        paragraphs(
          "Banks and scheme authorities use a project report to understand what will be built or expanded, how much it will cost, how it will operate and whether the projected cash flow can support repayment.",
          "A credible report is based on promoter inputs, quotations, capacity assumptions, market evidence and transparent calculations. It should not be a generic template filled with unsupported growth numbers.",
        ),
        bullets([
          "Defines the business and implementation plan",
          "Explains project cost and funding sources",
          "Presents operating and financial assumptions",
          "Tests viability, break-even and repayment capacity",
        ]),
      ],
    },
    {
      id: "report-when-needed",
      label: "When is it Needed?",
      shortLabel: "Use Cases",
      title: "When do you need a project report?",
      summary:
        "The report's depth and format should match the decision it is meant to support.",
      icon: "eligibility",
      blocks: [
        cards([
          { title: "Bank term loan", text: "Supports appraisal of machinery, premises, setup, expansion and the proposed repayment plan." },
          { title: "Working-capital proposal", text: "Explains the operating cycle, inventory, receivables, creditors and assessed fund requirement." },
          { title: "Government-linked scheme", text: "Maps the project to scheme conditions, promoter contribution, eligible cost and prescribed format." },
          { title: "Investor / internal planning", text: "Helps evaluate unit economics, milestones, funding runway and alternative scenarios." },
        ]),
      ],
    },
    {
      id: "report-sections",
      label: "Report Sections",
      shortLabel: "Sections",
      title: "What a professional project report contains",
      summary:
        "The narrative, project cost and financial model should tell the same story and use the same assumptions.",
      icon: "report",
      blocks: [
        table(
          ["Section", "What it covers", "Key evidence"],
          [
            ["Promoter & business", "Background, structure, experience and proposed activity", "KYC, registrations and experience profile"],
            ["Market & operations", "Customers, competition, capacity, process and location", "Research, orders, licences and operational plan"],
            ["Project cost", "Assets, setup, pre-operative expenses and working capital", "Quotations, estimates and contribution proof"],
            ["Financial projections", "Revenue, costs, profit, cash flow and balance sheet", "Assumption sheet and historical financials"],
            ["Viability & repayment", "Break-even, ratios, sensitivity and debt servicing", "Loan terms and scenario analysis"],
          ],
        ),
      ],
    },
    {
      id: "report-inputs",
      label: "Information Required",
      shortLabel: "Inputs",
      title: "Inputs needed to prepare the report",
      summary:
        "Quality inputs make projections defensible and reduce follow-up questions during appraisal.",
      icon: "documents",
      blocks: [
        bullets(
          [
            "Promoter profile, KYC and ownership structure",
            "Business model, products, pricing and target customers",
            "Location, capacity and implementation schedule",
            "Machinery, equipment and setup quotations",
            "Historical financial statements for an existing business",
            "Sales volume, cost, salary and overhead assumptions",
            "Requested loan, own contribution and other funding sources",
            "Existing loans, collateral and scheme details, if applicable",
          ],
          "Project information checklist",
        ),
      ],
    },
    {
      id: "report-projections",
      label: "Financial Projections",
      shortLabel: "Financials",
      title: "Build realistic financial projections",
      summary:
        "A strong model explains each assumption and connects sales, capacity, costs, working capital, tax and loan repayment.",
      icon: "calculator",
      blocks: [
        cards([
          { title: "Revenue build-up", text: "Project volume, price and capacity utilisation separately instead of applying one unexplained growth rate." },
          { title: "Cost structure", text: "Separate variable costs, fixed overheads, depreciation, finance cost and one-time setup expenses." },
          { title: "Cash-flow timing", text: "Model inventory, credit to customers, supplier terms, tax payments and capital expenditure timing." },
          { title: "Repayment capacity", text: "Compare projected cash accruals with interest and principal under the proposed loan schedule." },
        ]),
        note("Avoid forcing projections to meet a desired ratio. State assumptions transparently and show a downside case where the project is sensitive."),
      ],
    },
    {
      id: "report-bank-ready",
      label: "Bank-ready Checklist",
      shortLabel: "Bank-ready",
      title: "What makes a project report bank-ready?",
      summary:
        "A bank-ready report is consistent, evidence-backed and easy for an appraiser to trace from assumption to repayment.",
      icon: "bank",
      blocks: [
        bullets([
          "Requested facility matches the stated use of funds",
          "Project cost agrees with quotations and contribution",
          "Historical data reconciles with returns and statements",
          "Projected capacity is operationally achievable",
          "Working-capital assumptions reflect the business cycle",
          "Debt servicing remains visible in the cash flow",
          "Licences, risks and mitigations are disclosed",
          "All tables use the same period and assumptions",
        ]),
      ],
    },
    {
      id: "report-process",
      label: "Preparation Process",
      shortLabel: "Process",
      title: "How a project report is prepared",
      summary:
        "The process should include discovery, evidence review, modelling, consistency checks and a final lender-format review.",
      icon: "process",
      blocks: [
        steps([
          "Confirm the report purpose, lender or scheme and requested facility.",
          "Collect promoter, business, quotation, historical and funding inputs.",
          "Document the operating model, market, capacity and implementation schedule.",
          "Prepare project cost, means of finance and working-capital assessment.",
          "Build projected profit and loss, balance sheet and cash-flow statements.",
          "Calculate break-even, debt-service and other appraisal ratios as relevant.",
          "Run cross-statement checks and test key downside assumptions.",
          "Review the draft with the promoter and finalise the recipient's format.",
        ]),
      ],
    },
    {
      id: "report-faqs",
      label: "Project Report FAQs",
      shortLabel: "FAQs",
      title: "Project report FAQs",
      summary: "Common questions before commissioning a bank or scheme report.",
      icon: "faq",
      blocks: [
        faq([
          { question: "Does a project report guarantee loan approval?", answer: "No. It supports appraisal, but the lender independently reviews eligibility, credit history, contribution, collateral, cash flow and policy conditions." },
          { question: "Can one report be used for every bank?", answer: "The core analysis may be reusable, but banks and schemes can require different forms, ratios, projection periods and supporting documents." },
          { question: "How many years of projections are needed?", answer: "Use the period requested by the recipient and long enough to show stabilisation and repayment. There is no one universal period for every proposal." },
          { question: "Can a new business prepare projections without past accounts?", answer: "Yes, but the assumptions should be supported by quotations, market evidence, capacity plans, promoter experience and a clear implementation schedule." },
          { question: "What if actual quotations change later?", answer: "Update the project cost and financing model before submission or sanction so contribution and loan requirements remain consistent." },
        ]),
      ],
    },
  ],
};

export const serviceGuidesBySlug: Record<string, ServiceGuideConfig> = {
  "annual-compliance": annualComplianceGuide,
  "tax-compliance": taxComplianceGuide,
  "msme-registration": msmeRegistrationGuide,
  "project-report": projectReportGuide,
  "company-registration": companyRegistrationGuide,
  "itr-filing": itrFilingGuide,
};
