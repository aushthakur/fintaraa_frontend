import {
  BadgePercent,
  Banknote,
  CarFront,
  Fuel,
  Gift,
  Plane,
  ShoppingBag,
  Sparkles,
  WalletCards,
} from "lucide-react";

export const cardCategories = [
  { title: "Cashback Cards", icon: BadgePercent },
  { title: "Travel Cards", icon: Plane },
  { title: "Fuel Cards", icon: Fuel },
  { title: "Rewards Cards", icon: Gift },
  { title: "Lifetime Free Cards", icon: Sparkles },
  { title: "Beginners Cards", icon: WalletCards },
  { title: "Self-Employed Cards", icon: Banknote },
  { title: "Super-Premium Cards", icon: ShoppingBag },
];

export const creditCards = [
  { bank: "HDFC Bank", title: "HDFC Millennia Credit Card", logo: "/assets/banks/hdfc.png" },
  { bank: "SBI Card", title: "SBI Cashback Credit Card", logo: "/assets/banks/sbi.png" },
  { bank: "Axis Bank", title: "Axis Flipkart Credit Card", logo: "/assets/banks/pnb.png" },
  { bank: "ICICI Bank", title: "ICICI Amazon Pay Credit Card", logo: "/assets/banks/icici.png" },
];

export const partnerBanks = [
  "/assets/banks/hdfc.png",
  "/assets/banks/sbi.png",
  "/assets/banks/icici.png",
  "/assets/banks/indian.png",
  "/assets/banks/pnb.png",
  "/assets/banks/kotak.png",
  "/assets/banks/idfc.png",
];

export const articleCards = [
  "Best Cashback Credit Cards in India May 2024",
  "How to Choose the Right Credit Card?",
  "Credit Card Fees Explained",
  "Tips to Improve Your Credit Score",
];

export const benefits = [
  { title: "Best Recommendations", icon: WalletCards },
  { title: "100% Secure Process", icon: BadgePercent },
  { title: "Trusted Banking Partners", icon: Sparkles },
  { title: "Fast Approval Support", icon: CarFront },
  { title: "No Hidden Charges", icon: Banknote },
];
