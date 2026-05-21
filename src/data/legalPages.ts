export type LegalPageKey = "terms" | "privacy" | "grievance";

export type LegalPageContent = {
  title: string;
  subtitle: string;
  updatedOn: string;
  badges: string[];
  highlights: string[];
  sections: {
    title: string;
    body: string;
  }[];
};

export const legalPages: Record<LegalPageKey, LegalPageContent> = {
  terms: {
    title: "Terms and Conditions",
    subtitle:
      "How you use Fintaraa to discover, apply for, and manage responsible credit, loans, and insurance in partnership with regulated lenders.",
    updatedOn: "Updated: 01 Mar 2025",
    badges: ["Eligibility 18+", "KYC & Bureau Checks", "Fair Usage"],
    highlights: [
      "Transparent comparison of loans, credit, and insurance sourced from banks, NBFCs, and insurers registered with Indian regulators.",
      "One-time and recurring consents empower bureau pulls, KYC verification, fraud checks, and offer personalisation with clear revocation paths.",
      "You remain accountable for the accuracy of disclosures, repayments, and the safe custody of your device and credentials.",
    ],
    sections: [
      {
        title: "Purpose and Scope of Service",
        body: "Fintaraa operates a digital marketplace that introduces you to loan, credit card, and insurance offers from regulated partners. The application streamlines discovery, pre-qualification, and fulfilment while keeping you in control of disclosures and consent. These terms apply to every touchpoint: browsing offers, initiating or completing applications, document uploads, servicing requests, grievance submissions, and use of educational content. By continuing, you acknowledge that Fintaraa is a facilitator and that binding contracts are executed directly between you and the selected lender or insurer.",
      },
      {
        title: "Eligibility and Responsible Use",
        body: "You confirm you are at least 18 years old, competent to contract under Indian law, and using the app for yourself or on behalf of an entity with proper authorisation. You agree to provide accurate, current, and complete information including identity, income, employment, liabilities, and contact details. Misrepresentation or misuse of promotional offers, referral programs, or identity credentials can lead to suspension, rejection of applications, reporting to authorities, and civil remedies. Always review product-specific eligibility, rate disclosures, and repayment obligations before accepting an offer.",
      },
      {
        title: "KYC, Bureau, and Verification Checks",
        body: "To generate personalised offers and comply with anti-money-laundering obligations, you authorise Fintaraa and its partners to perform identity verification, bureau pulls (CIBIL, Experian, CRIF, or others), fraud risk checks, device fingerprinting, and video or audio KYC where applicable. You may be asked to submit Officially Valid Documents, PAN, selfies, live videos, bank statements, salary slips, or GST filings. Verification outcomes may influence eligibility, pricing, tenure, and approval speed. We retain verification artefacts securely and only for the duration required by law and partner policy.",
      },
      {
        title: "Loan Discovery, Offers, and Acceptance",
        body: "Pre-qualified ranges shown in the app are indicative and subject to full underwriting by the lender. Before accepting, you will see a product fact sheet with principal, tenure, rate, fees, insurance add-ons, repayment dates, foreclosure rules, and late payment charges. Your acceptance of the final Key Fact Statement or digitally signed agreement creates a binding contract with the lender. Fintaraa may receive facilitation fees from partners; these do not increase your payable amount and are disclosed on request.",
      },
      {
        title: "Insurance and Protection Services",
        body: "Insurance products, including credit protection, health, and term covers, are offered through licensed insurer partners or authorised intermediaries. Illustrations describe coverage, exclusions, claim triggers, premium frequency, cooling-off options, and cancellation rules. You should read the policy wording and prospectus carefully before paying premiums. Issuance is at the sole discretion of the insurer, and claim servicing timelines follow regulator-approved processes. Fintaraa simplifies discovery and documentation but does not adjudicate claims.",
      },
      {
        title: "Fees, Charges, and Taxes",
        body: "Certain services may attract processing fees, convenience fees for payments, document retrieval charges, or fees levied by lending partners. All amounts are shown inclusive of applicable taxes where required. Late payment fees, interest on overdue amounts, cheque bounce charges, and foreclosure fees are governed by your final agreement with the lender. You are responsible for timely repayments through the authorised channels listed in your repayment schedule and for keeping proof of payments.",
      },
      {
        title: "Consent, Communications, and Notifications",
        body: "By interacting with the platform, you consent to receive transactional alerts, servicing messages, e-mandate updates, OTPs, and account health nudges via SMS, email, WhatsApp, in-app notifications, or phone calls. Marketing communication is optional and can be withdrawn through in-app settings or by writing to our support desk. Critical communications related to repayment, KYC, fraud risk, and regulatory notices may continue even if you opt out of marketing to ensure safety and compliance.",
      },
      {
        title: "Data Security and Use of Information",
        body: "We implement encryption in transit and at rest, role-based access controls, masking of identifiers, and periodic vulnerability assessments. Collected information is used to provide services, personalise offers, meet compliance obligations, improve fraud detection, and generate anonymised insights. We do not sell personal data. Retention follows legal and partner-specific timelines; upon expiry we archive or delete records unless a dispute, audit, or legal requirement necessitates preservation.",
      },
      {
        title: "Third-Party Services and Disclaimers",
        body: "The platform integrates payment gateways, e-sign providers, credit bureaus, and data-verification utilities. Each third-party service is governed by its own terms and privacy notices, which you should review before use. Network delays, outages, or partner system downtime may affect availability; Fintaraa is not liable for losses arising from technical interruptions, provided we act with reasonable care. We do not guarantee approval, rate, or product availability; final decisions rest with the partner.",
      },
      {
        title: "Responsible Borrowing and Financial Health",
        body: "Credit is a powerful tool when used responsibly. Review affordability before accepting an offer; avoid over-leverage by keeping EMI obligations within your monthly budget and maintaining an emergency fund. Consider insurance that protects repayment ability in the event of job loss, illness, or disability. We provide calculators, reminders, and education to help you stay current on dues and monitor your credit profile.",
      },
      {
        title: "Termination, Suspension, and Account Safety",
        body: "We may suspend or terminate access if we detect misuse, suspicious activity, repeated payment failures, or non-compliance with law. You should secure your device, OTPs, PINs, and biometric access. Notify us immediately of unauthorised access, lost devices, or suspected fraud so we can assist with session termination and partner notifications. Account deletion requests will be honoured subject to settlement of pending dues and completion of regulatory retention periods.",
      },
      {
        title: "Governing Law, Dispute Resolution, and Notices",
        body: "These terms are governed by Indian law. Disputes will first be handled through our grievance redressal mechanism; unresolved issues may be escalated to the designated nodal officer or competent courts within the applicable jurisdiction. Notices may be served electronically through the app, registered email, or SMS. Continued use after updates constitutes acceptance of revised terms; material changes will be communicated through prominent notices.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle:
      "How Fintaraa collects, uses, shares, and safeguards your information while delivering loan, credit, and insurance journeys.",
    updatedOn: "Updated: 01 Mar 2025",
    badges: [
      "Encryption at Rest",
      "Purpose-Limited Use",
      "User-Controlled Opt-outs",
    ],
    highlights: [
      "We collect only what is needed to verify identity, assess eligibility, and present relevant offers; sensitive data is encrypted and minimised.",
      "Sharing occurs strictly with regulated partners, processors, and support vendors bound by confidentiality and security controls.",
      "You can access, correct, withdraw marketing consent, and request deletion subject to legal retention requirements and outstanding obligations.",
    ],
    sections: [
      {
        title: "What We Collect",
        body: "We gather identifiers (name, address, contact), device signals, demographic information, employment details, declared income, liabilities, bureau data, repayment behaviour, geolocation (when permitted), and documents such as PAN, Aadhaar masked copies, bank statements, salary slips, GST filings, or utility bills. We also collect interaction data, screens viewed, buttons tapped, and session timestamps, to improve journey performance, detect anomalies, and design fair offers.",
      },
      {
        title: "How We Use Your Data",
        body: "Data powers onboarding, KYC, bureau checks, risk scoring, eligibility models, offer personalisation, fraud monitoring, communication, and customer support. Aggregated or anonymised data informs product design and operational performance. We avoid intrusive profiling; automated decisions are combined with explainable factors and, where required, manual review by partners. Your information is never sold; monetisation occurs through partner facilitation fees and anonymised insights that do not identify you.",
      },
      {
        title: "Consent and Lawful Bases",
        body: "We rely on explicit consent for bureau pulls, KYC, and marketing; contractual necessity for servicing and repayments; and legitimate interest for security, fraud prevention, and product improvement. You can withdraw marketing consent anytime via in-app controls or by emailing support. Withdrawing consent for core services may limit or end access if it prevents verification, underwriting, or servicing obligations required by law.",
      },
      {
        title: "Sharing with Partners and Vendors",
        body: "Information is shared with banks, NBFCs, insurers, payment gateways, e-sign providers, credit bureaus, analytics vendors, and customer support partners strictly on a need-to-know basis. Every partner is bound by confidentiality, data protection clauses, and regulator-mandated security standards. We prohibit downstream reuse beyond agreed purposes and conduct periodic vendor assessments to validate controls.",
      },
      {
        title: "Security Controls",
        body: "We apply encryption in transit (TLS) and at rest, segregate production environments, enforce role-based access, rotate keys, and maintain audit trails. Background checks for staff, least-privilege access, device compliance, and secure coding standards reduce operational risk. Penetration tests, vulnerability assessments, and incident response runbooks are executed regularly with post-incident communication protocols.",
      },
      {
        title: "Cookies, SDKs, and Device Signals",
        body: "Session cookies and mobile SDKs capture performance metrics, crash diagnostics, attribution data, and optional geolocation to detect fraud or pre-fill city and branch details. You can disable location access through device settings; essential telemetry for security and availability may still be captured to protect the service. We avoid invasive tracking and do not permit behavioural advertising inside regulated journeys.",
      },
      {
        title: "Data Retention and Deletion",
        body: "Retention aligns with legal mandates, partner contracts, and dispute windows. KYC artefacts, repayment records, and consent logs may be stored for several years to satisfy regulatory or audit requirements. When retention expires, data is securely deleted or anonymised. You may request deletion of marketing profiles or unlinked telemetry where laws allow; we will confirm actions and limitations transparently.",
      },
      {
        title: "Your Rights and Controls",
        body: "You may access and correct personal information, update contact details, change consent preferences, object to marketing, and request clarification of automated decisions. Verification may be required before fulfilling requests. Responses are provided within reasonable timelines; if we need more time due to complexity, we will inform you with reasons and expected dates.",
      },
      {
        title: "Cross-Border Transfers",
        body: "Data is stored in India unless a specialised processor with equivalent safeguards is engaged. If cross-border processing is required, for example, for analytics or secure back-ups, we use contractual clauses, encryption, and access restrictions to maintain protection standards consistent with Indian law and global best practices.",
      },
      {
        title: "Children and Vulnerable Users",
        body: "Our services are built for adults who can legally contract. We do not knowingly collect data from minors. If we learn a minor has submitted information, we will delete it except where retention is required for fraud prevention or legal defence. Caregivers seeking removal can contact our grievance officer.",
      },
      {
        title: "Policy Updates and Notifications",
        body: "We refine this policy as regulations evolve or new features launch. Material changes will be highlighted in-app and via email where available. Continued use after publication signifies acceptance of updates. You are encouraged to review the effective date and summary of changes presented at the top of the policy.",
      },
      {
        title: "Contact and Escalation",
        body: "For privacy questions or data rights, write to support@fintaraa.com. Unresolved concerns may be escalated to the grievance officer listed below or to relevant authorities where applicable. We will collaborate with partners to address cross-entity requests and provide clear closure notes.",
      },
    ],
  },
  grievance: {
    title: "Grievance Redressal Policy",
    subtitle:
      "Our structured process for receiving, acknowledging, investigating, and resolving complaints across loans, insurance, payments, and data rights.",
    updatedOn: "Updated: 01 Mar 2025",
    badges: ["Acknowledgement SLA", "Nodal Officer", "Regulatory Escalation"],
    highlights: [
      "Complaints can be raised in-app, by email, or phone; every ticket receives a unique reference ID and acknowledgement timeline.",
      "We collaborate with lending and insurance partners to resolve product-specific issues while keeping you informed of progress and next steps.",
      "If dissatisfied, you may escalate to our nodal officer or applicable regulators after internal timelines lapse.",
    ],
    sections: [
      {
        title: "Objective and Applicability",
        body: "This policy ensures that every concern, delayed disbursal, EMI disputes, claim servicing, data handling, or staff behaviour, is logged, acknowledged, and resolved transparently. It applies to all customers, prospective customers, borrowers, co-applicants, guarantors, and insured members who interact with Fintaraa or its partner journeys on the app, web, or assisted channels.",
      },
      {
        title: "How to Raise a Complaint",
        body: "You may submit a grievance via the in-app help desk, by emailing support@fintaraa.com, or by calling our helpline. Include your registered mobile number, application ID, product type, issue description, and supporting documents such as screenshots or payment proofs. For security, avoid sharing OTPs or full card details. On submission, we will generate a unique ticket ID for tracking.",
      },
      {
        title: "Acknowledgement Timelines",
        body: "We acknowledge complaints within 24 business hours with your ticket ID, assigned team, and expected timelines. Service requests such as statement copies may be fulfilled immediately, while complex matters involving partners or regulators may require additional time. If delays occur, we will provide interim updates at least every three business days until closure.",
      },
      {
        title: "Investigation and Coordination",
        body: "Our support and risk teams review logs, payment traces, underwriting notes, call recordings (where available), and partner system statuses. For lending or insurance-specific issues, we route the ticket to the relevant partner while staying your single point of contact. We may request clarifying details or consent to liaise with the partner on your behalf. Each step is recorded in the ticket trail for transparency.",
      },
      {
        title: "Resolution and Closure Notes",
        body: "Closure includes the outcome, any monetary adjustments, actions taken (such as mandate re-try, statement reissue, claim status confirmation), and preventive steps to avoid recurrence. If you disagree with the resolution, respond within seven days so we can reassess with additional context. Tickets with no response after two reminders may be closed with a documented rationale.",
      },
      {
        title: "Escalation Matrix",
        body: "If a ticket remains unresolved beyond the communicated timeline or the response is unsatisfactory, escalate to the Grievance Officer at support@fintaraa.com with your ticket ID. Unresolved grievances may then be referred to the Nodal Officer, whose details are published on our website and within the help section. Regulatory escalation to the Reserve Bank of India or the Insurance Ombudsman may be available for specific product categories after internal steps are exhausted.",
      },
      {
        title: "Protection from Retaliation and Fair Treatment",
        body: "We prohibit retaliation against anyone raising concerns in good faith. Your complaint will not impact eligibility decisions unless it is linked to fraud or misuse. Investigations are handled objectively, respecting confidentiality while allowing necessary disclosures to partners or auditors. If a complaint involves staff misconduct, an independent panel reviews the matter.",
      },
      {
        title: "Record Keeping and Audit",
        body: "All grievances, actions, and communications are retained for audit and regulatory reporting. Metrics such as turnaround time, root cause categories, and recurrence inform product and process improvements. Periodic audits validate adherence to SLAs and the robustness of remediation measures.",
      },
      {
        title: "Assisted Support and Accessibility",
        body: "We aim to make the process inclusive. Support is offered in English and major Indian languages during business hours, with translation support where feasible. If you have accessibility needs, notify us so we can arrange alternative communication formats or assisted device guidance.",
      },
      {
        title: "Regulatory and Compliance Alignment",
        body: "Our redressal practices align with RBI's guidelines for digital lending partners, insurer grievance regulations, IT security advisories, and data protection principles. We periodically update this policy to incorporate new rules, partner mandates, or technology enhancements that improve customer experience and safety.",
      },
      {
        title: "Continuous Improvement and Feedback",
        body: "Feedback on the grievance process itself is welcome. We review dissatisfaction patterns to refine scripts, training, escalation triggers, and monitoring dashboards. High-severity incidents trigger post-mortems with actionable follow-ups and timelines that are monitored at leadership forums.",
      },
    ],
  },
};
