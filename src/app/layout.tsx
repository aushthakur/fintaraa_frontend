import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/common/layout/Navbar";
import Footer from "@/components/common/layout/Footer";

export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const highlightSerif = Cormorant_Garamond({
  variable: "--font-highlight-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fintaraa — Loans, Credit Cards and Insurance Marketplace",
    template: "%s | Fintaraa",
  },

  description:
    "Fintaraa helps customers discover and apply for responsible loans, credit cards, insurance, and financial products from regulated partners with transparent eligibility, documentation, and support.",

  keywords: [
    "Fintaraa",
    "Loans",
    "Personal Loan",
    "Business Loan",
    "Credit Cards",
    "Insurance",
    "Financial Marketplace",
    "Loan Eligibility",
    "Digital Lending",
    "Responsible Credit",
    "Banking Partners",
    "NBFC Partners",
    "Financial Services",
    "Loan Application",
    "Credit Products",
    "Insurance Products",
  ],

  publisher: "Fintaraa",
  creator: "Rishabh Gupta",
  alternates: { canonical: "/" },
  authors: [{ name: "Rishabh Gupta" }],
  metadataBase: new URL("https://fintaraa.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${bodoni.variable} ${highlightSerif.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <div className="min-h-screen overflow-hidden">{children}</div>
          <Footer />
        </Providers>
        <div id="modal-root" />
      </body>
    </html>
  );
}
