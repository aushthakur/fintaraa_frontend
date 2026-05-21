import {
  Archive,
  BarChart2,
  BookOpen,
  FileText,
  Folder,
  Gift,
  HelpCircle,
  LogOut,
  MessageCircle,
  Sliders,
  UserCheck,
} from "lucide-react";

export type AccountMenuItem = {
  label: string;
  slug: string;
  icon: typeof BarChart2;
  description: string;
  action?: "logout";
};

export type AccountMenuSection = {
  title: string;
  items: AccountMenuItem[];
};

export const profileCompletion = {
  percent: 72,
  completed: 18,
  total: 25,
};

export const profileUser = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  mobile: "+91 98765 43210",
  customerId: "FTAA-582914",
  kycStatus: "KYC pending",
};

export const accountMenuSections: AccountMenuSection[] = [
  {
    title: "Account",
    items: [
      {
        label: "My Applications",
        slug: "my-applications",
        icon: FileText,
        description: "Track status across loans, cards, and insurance.",
      },
      {
        label: "My Offers",
        slug: "my-offers",
        icon: Gift,
        description: "View pre-approved and saved offers from partners.",
      },
      {
        label: "Refer & Earn",
        slug: "refer-earn",
        icon: Gift,
        description: "Invite friends and earn referral rewards.",
      },
      {
        label: "Edit Profile",
        slug: "edit-profile",
        icon: UserCheck,
        description: "Update personal, professional, and bank details.",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        label: "Notification preferences",
        slug: "notification-preferences",
        icon: Sliders,
        description: "Choose the alerts you want to receive.",
      },
    ],
  },
  {
    title: "Activity & Documents",
    items: [
      {
        label: "Statements & Letters",
        slug: "statements-letters",
        icon: Archive,
        description: "Download sanction letters, schedules, and summaries.",
      },
      {
        label: "Uploaded Documents",
        slug: "uploaded-documents",
        icon: Folder,
        description: "Review and manage KYC and income documents.",
      },
    ],
  },
  {
    title: "Help & Legal",
    items: [
      {
        label: "Contact & Support",
        slug: "contact-support",
        icon: HelpCircle,
        description: "Ways to reach our customer care team.",
      },
      {
        label: "FAQ",
        slug: "faq",
        icon: MessageCircle,
        description: "Quick answers to common questions.",
      },
      {
        label: "Knowledge Center",
        slug: "knowledge-center",
        icon: BookOpen,
        description: "Blogs, videos, and tutorials to learn more.",
      },
      {
        label: "Policies",
        slug: "policies",
        icon: FileText,
        description: "Terms, privacy, grievance, and partner disclosures.",
      },
      {
        label: "Logout",
        slug: "logout",
        icon: LogOut,
        description: "Securely sign out from this device.",
        action: "logout",
      },
    ],
  },
];

export const flatAccountItems = accountMenuSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);

export const accountItemBySlug = Object.fromEntries(
  flatAccountItems.map((item) => [item.slug, item]),
);
