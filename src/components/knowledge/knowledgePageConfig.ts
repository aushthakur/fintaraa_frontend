import type { WebsiteKnowledgeType } from "@/services/websiteKnowledge";

export type KnowledgePageConfig = {
  type: WebsiteKnowledgeType;
  sectionKey: string;
  hrefRoot: string;
  eyebrow: string;
  title: string;
  description: string;
  listingTitle: string;
  detailLabel: string;
  primaryAction: string;
  fallbackImage: string;
  hideListingIntro?: boolean;
};

export const pressReleaseConfig: KnowledgePageConfig = {
  type: "press_release",
  sectionKey: "media_press_release",
  hrefRoot: "/press-release",
  eyebrow: "Media Center",
  title: "Fintaraa Press Releases",
  description:
    "Company updates, product launches, partner announcements, and market insights from Fintaraa.",
  listingTitle: "Latest Press Releases",
  detailLabel: "Press Release",
  primaryAction: "Read Release",
  fallbackImage: "/assets/images/media1.png",
  hideListingIntro: true,
};

export const videoTestimonialsConfig: KnowledgePageConfig = {
  type: "video",
  sectionKey: "video_testimonials",
  hrefRoot: "/video-testimonials",
  eyebrow: "Customer Videos",
  title: "Video Testimonials",
  description:
    "Real customer stories on loans, credit cards, insurance, and guided financial journeys with Fintaraa.",
  listingTitle: "Featured Video Stories",
  detailLabel: "Video Story",
  primaryAction: "Watch Story",
  fallbackImage: "/assets/images/testimonials/video-1.jpg",
  hideListingIntro: true,
};

export const clientTestimonialsConfig: KnowledgePageConfig = {
  type: "testimonial",
  sectionKey: "client_testimonials",
  hrefRoot: "/testimonials",
  eyebrow: "Customer Trust",
  title: "Client Testimonials",
  description:
    "Customer experiences from across India, covering assisted loan discovery, credit cards, insurance, and documentation support.",
  listingTitle: "Customer Success Stories",
  detailLabel: "Customer Story",
  primaryAction: "Read Story",
  fallbackImage: "/assets/images/testimonials/client-1.jpg",
  hideListingIntro: true,
};

export const knowledgePageConfigs = [
  pressReleaseConfig,
  videoTestimonialsConfig,
  clientTestimonialsConfig,
] as const;
