import {
  BadgeCheck,
  Building2,
  FileText,
  Handshake,
  ShieldCheck,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";

export const careerStats = [
  { title: "Trusted Brand", icon: ShieldCheck },
  { title: "Great Culture", icon: ShieldCheck },
  { title: "Career Growth", icon: ShieldCheck },
  { title: "Learning & Development", icon: ShieldCheck },
];

export const cultureValues = [
  {
    title: "Customer First",
    text: "We put customers at the heart of everything we do.",
    icon: UsersRound,
  },
  {
    title: "Innovation",
    text: "We embrace new ideas and technology to create better solutions.",
    icon: Building2,
  },
  {
    title: "Transparency",
    text: "We work with honesty, clarity and integrity.",
    icon: FileText,
  },
  {
    title: "Teamwork",
    text: "We believe in collaboration and respect.",
    icon: Handshake,
  },
  {
    title: "Growth Mindset",
    text: "We encourage learning, curiosity and continuous growth.",
    icon: Target,
  },
];

export const jobs = Array.from({ length: 6 }, (_, index) => ({
  title: "Relationship Manager",
  department: "Sales Department",
  location: index % 2 ? "New Delhi" : "New Delhi",
  experience: "1-2 Years",
  type: "Full Time",
  date: "30 May 2026",
}));

export const lifeImages = [
  "/assets/careers/life-1.jpg",
  "/assets/careers/life-2.jpg",
  "/assets/careers/life-3.jpg",
  "/assets/careers/life-4.jpg",
  "/assets/careers/life-5.jpg",
];

export const whyIcons = [
  { title: "Build Impact", icon: Trophy },
  { title: "Learn Fast", icon: BadgeCheck },
];
