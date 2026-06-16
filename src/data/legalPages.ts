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
      "How Fintaraa collects, uses, shares, and safeguards your information while delivering loan and financial service journeys.",
    updatedOn: "Last Updated: 15 June 2026",
    badges: [
      "IT Act 2000",
      "Consent Based",
      "Data Security",
    ],
    highlights: [
      "This policy applies to the website, apps, platforms, and services operated by Fintaraa, a brand and unit of Xpertserve Services Private Limited.",
      "We collect, process, store, share, and disclose information only as described in this policy and subject to applicable law and consent.",
      "You can request access, correction, deletion, or consent withdrawal, subject to legal retention, partner obligations, and regulatory requirements.",
    ],
    sections: [
      {
        title: "Introduction and Scope",
        body: "This Privacy Policy describes the privacy practices of Fintaraa, a brand and unit operated by Xpertserve Services Private Limited. It applies to the website at https://fintaraa.com/ together with related mobile applications, platforms, and services, including lending and financial product facilitation. The policy explains how we collect, store, use, process, share, and disclose personal and non-personal information when you access or use the Platform and Services, and it should be read together with our Terms of Use.",
      },
      {
        title: "Information We Collect",
        body: "We may collect information you provide directly through forms, registration, messages, customer service interactions, or device permissions, and we may also collect data automatically while you use the Platform. Personal information can include your name, address, email address, phone number, gender, date of birth, passwords, OTPs, GST identification number, identity verification details, payment instrument details, and transaction information received via SMS. Non-personal information can include browser type, device type, IP address, operating system, usage patterns, cookies, tracking technologies, and internet service provider details.",
      },
      {
        title: "Consent",
        body: "We obtain consent in writing or electronically before collecting, accessing, using, processing, storing, or sharing your information. By using the Platform or Services, or by providing information to us, you consent to our use of that information with affiliates, lenders, financial institutions, service providers, vendors, auditors, marketing agencies, technology vendors, and other authorized third parties for lawful business purposes such as service delivery, identity verification, compliance, risk assessment, credit assessment, analytics, fraud prevention, and marketing.",
      },
      {
        title: "How We Use Your Information",
        body: "We use your information to create and maintain accounts, develop and improve services, communicate updates and security notices, carry out identity and eligibility verification, perform credit assessment and onboarding, support analytics and internal research, comply with legal and regulatory requirements, resolve requests and complaints, detect and prevent fraud or unauthorized activity, and create aggregate or anonymized data that does not identify you personally.",
      },
      {
        title: "Disclosure and Sharing",
        body: "We do not disclose personal information except as set out in this policy or as agreed by you. We may share information with trusted service providers, contractors, and vendors; with affiliates, lenders, banks, NBFCs, credit information companies, and other financial institutions; with credit rating agencies, regulators, and auditors; when required by law or to protect rights, safety, fraud, security, or credit risk interests; in connection with reorganizations, mergers, acquisitions, or asset sales; and as aggregated, deidentified, or anonymized data that does not identify you personally.",
      },
      {
        title: "International Transfer of Information",
        body: "Your information may be transferred to, stored in, and processed in jurisdictions outside India, including where our servers or our service providers' servers are located, as well as within our affiliates, subsidiaries, and partners. We apply appropriate safeguards and require recipients to maintain protections consistent with this policy and Indian data protection laws. By using the Platform, you consent to such transfers.",
      },
      {
        title: "Cookies, Web Beacons, and Online Advertising",
        body: "We may automatically receive standard browsing information such as the URL you came from, the URL you visit next, your IP address, browser type, operating system, usage patterns, and internet service provider or mobile carrier. We may use temporary cookies, web beacons, pixels, and anonymous ad network tags to recognize returning users, analyze usage, improve services, and support aggregated reporting. We do not store personal information in cookies, and we do not link non-personal information from tracking tools to personal information without your permission.",
      },
      {
        title: "Third-Party Websites and Links",
        body: "The Platform may contain links to third-party websites. We do not control and are not responsible for the content, actions, or privacy practices of those websites. Information you provide to such third parties is governed by their own terms and privacy policies, and it is your responsibility to review them before sharing information.",
      },
      {
        title: "Communications, Testimonials, and Marketing",
        body: "We may keep records of telephone calls for administration, research, training, business intelligence, development, and quality assurance. With your consent, we may reproduce or publish testimonials and reviews. If you share information on public forums or blogs, it may be read and used by others. Where permitted by law, you authorize us and our partners to contact you by call or SMS regarding services and promotional offers, including if your number is registered on a Do-Not-Disturb registry. We may also conduct surveys for market research and use survey data only for research purposes unless otherwise permitted by this policy.",
      },
      {
        title: "Data Security, Retention, and Your Rights",
        body: "We use firewalls, transport layer security, encryption, secure access controls, intrusion detection systems, and other physical and electronic safeguards to protect your personal information. No method of transmission or storage is completely secure, so you should safeguard your user ID and password and notify us immediately of any unauthorized access or breach. We retain information only as long as necessary for the purposes described in this policy, for internal records, and as required or permitted by law. You may update your information, withdraw consent, and request correction of inaccurate or deficient information, subject to our policies and the status of the service availed.",
      },
      {
        title: "Opt-Out and Account Management",
        body: "We provide the opportunity to opt out of non-essential, promotional, or marketing communications from us or our partners. You may correct, update, deactivate, or remove your account information by using the Platform or by contacting support@fintaraa.com or the Grievance Officer details in this policy. You may unsubscribe from emails by using the unsubscribe link or by contacting the Grievance Officer.",
      },
      {
        title: "Modifications to this Policy",
        body: "This policy supersedes earlier versions. We may amend it at any time, and any updated policy will be posted on the Platform and take effect immediately upon posting. Material changes may be communicated by email or a prominent notice before they become effective. Your continued use of the Platform or Services after changes are posted means you accept the revised policy.",
      },
      {
        title: "Grievance Redressal",
        body: "If you have questions, concerns, or complaints regarding this policy or the Platform, you may contact our Grievance Officer at customercare@fintaraa.com. The company is Xpertserve Services Private Limited, operating as Fintaraa, and the website is https://fintaraa.com/. A grievance officer name, designation, and registered address are to be inserted by Fintaraa. On receipt of a complaint, the Grievance Officer or Nodal Officer will assign an acknowledgement ID and endeavour to redress the complaint within 15 working days, subject to the time taken by you to provide information and any third-party delay.",
      },
      {
        title: "Governing Law and Jurisdiction",
        body: "This policy is governed by the laws of India. Any dispute arising from or in connection with this policy is subject to the exclusive jurisdiction of the courts in Gurugram, Haryana, India.",
      },
      {
        title: "Severability",
        body: "Each provision of this policy should be interpreted so as to be valid under applicable law. If any provision is held invalid or unenforceable, only that provision is affected and the remaining provisions continue in force.",
      },
      {
        title: "Contact Us",
        body: "If you have any questions about this Privacy Policy, the Platform, or our Services, please contact customercare@fintaraa.com or write to our Grievance Officer using the details in Section 13.",
      },
      {
        title: "Data Storage Policy",
        body: "Fintaraa recognizes the importance of secure data storage and sets guidelines for retention, storage, and disposal throughout the data lifecycle. Data is classified as Confidential, Restricted, Internal, or Public. AWS cloud servers based in India are used to store data. Confidential and Restricted data must be encrypted at rest and in transit, KYC data is collected only as required by law and securely purged once processing is complete, access is controlled using RBAC and least privilege, backups are taken regularly, data disposal is secure and documented, third-party storage providers are subject to due diligence and contractual controls, incidents must be reported promptly, vendors must meet Fintaraa's security and localization requirements, and storage practices are subject to compliance reviews, audits, and employee awareness training.",
      },
      {
        title: "Consent Withdrawal Process",
        body: "You have the right to withdraw consent previously provided to Fintaraa regarding the use of your information, including consent for specific uses, storage, sharing with third parties and lending partners, and contact for any purpose. Requests may be sent to customercare@fintaraa.com or by calling 9873596789. We will acknowledge the request within 72 hours and take appropriate steps to respect your decision, with completion targeted within 60 working days. If there is no legal obligation to retain the data, it will be erased; however, data may be retained for compliance, legal rights, regulatory investigations, or where a lending partner or outsourced collections process requires continued processing. Credit information will be permanently deleted when the request is processed, and confirmation will be provided through the website or another suitable communication channel.",
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
