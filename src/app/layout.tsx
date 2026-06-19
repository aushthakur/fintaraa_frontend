import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { Inter, Poppins } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AppShell } from "@/components/common/layout/AppShell";

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

const poppins = Poppins({
  variable: "--font-poppins",
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
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${geistMono.variable} ${bodoni.variable} ${highlightSerif.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col overflow-x-clip font-sans"
        suppressHydrationWarning
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <div id="modal-root" />
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `}
          </Script>
        ) : null}
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        {metaPixelId ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}
      </body>
    </html>
  );
}
