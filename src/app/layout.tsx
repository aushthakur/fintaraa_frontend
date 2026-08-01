import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Providers } from "./providers";
import { Inter, Poppins } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AppShell } from "@/components/common/layout/AppShell";
import {
  absoluteUrl,
  defaultOgImage,
  defaultSeoDescription,
  indexRobots,
  siteName,
  siteUrl,
} from "@/services/seoConfig";
import { CALL_PHONE, COMPANY_NAME, OFFICE } from "@/data/company";
import { AnalyticsRouteTracker } from "@/components/analytics/AnalyticsRouteTracker";
import { EngagementTracker } from "@/components/analytics/EngagementTracker";
import { GlobalPopupManager } from "@/components/popups/GlobalPopupManager";

const readAnalyticsId = (
  value: string | undefined,
  pattern: RegExp,
): string | undefined => {
  const normalized = value?.trim();
  return normalized && pattern.test(normalized) ? normalized : undefined;
};

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
    default: "Fintaraa | Loans, Credit Cards and Insurance Marketplace",
    template: "%s | Fintaraa",
  },

  description: defaultSeoDescription,

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

  applicationName: siteName,
  category: "Financial Services",
  publisher: siteName,
  creator: siteName,
  alternates: { canonical: "/" },
  authors: [{ name: siteName, url: siteUrl }],
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: indexRobots,
  openGraph: {
    type: "website",
    siteName,
    title: "Fintaraa | Loans, Credit Cards and Insurance Marketplace",
    description: defaultSeoDescription,
    url: "/",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Fintaraa financial services marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintaraa | Loans, Credit Cards and Insurance Marketplace",
    description: defaultSeoDescription,
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityProjectId = readAnalyticsId(
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    /^[a-z0-9]{5,}$/i,
  );
  const gaMeasurementId = readAnalyticsId(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    /^G-[a-z0-9]{4,}$/i,
  );
  const gtmId = readAnalyticsId(
    process.env.NEXT_PUBLIC_GTM_ID,
    /^GTM-[a-z0-9]+$/i,
  );
  const metaPixelId = readAnalyticsId(
    process.env.NEXT_PUBLIC_META_PIXEL_ID,
    /^\d{5,30}$/,
  );
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: COMPANY_NAME,
      alternateName: siteName,
      url: siteUrl,
      logo: absoluteUrl("/assets/logo/logo.png"),
      email: "customercare@fintaraa.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: `+${CALL_PHONE.digits}`,
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: OFFICE.streetAddress,
        addressLocality: OFFICE.locality,
        addressRegion: OFFICE.region,
        postalCode: OFFICE.postalCode,
        addressCountry: "IN",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: siteName,
      url: siteUrl,
      image: absoluteUrl(defaultOgImage),
      description: defaultSeoDescription,
      areaServed: "IN",
      serviceType: [
        "Loans",
        "Credit Cards",
        "Insurance",
        "CIBIL Score",
        "GST Registration",
        "ITR Filing",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      publisher: {
        "@type": "Organization",
        name: siteName,
        logo: absoluteUrl("/assets/logo/logo.png"),
      },
    },
  ];

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${geistMono.variable} ${bodoni.variable} ${highlightSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          id="fintaraa-site-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col overflow-x-clip font-sans"
        suppressHydrationWarning
      >
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              title="Google Tag Manager"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <div id="modal-root" />
        <Suspense fallback={null}>
          <AnalyticsRouteTracker
            clarityProjectId={clarityProjectId}
            gaMeasurementId={gaMeasurementId}
            gtmId={gtmId}
            metaPixelId={metaPixelId}
          />
          <EngagementTracker clarityEnabled={Boolean(clarityProjectId)} />
          <GlobalPopupManager />
        </Suspense>
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
            `}
          </Script>
        ) : null}
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
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
                gtag('config', ${JSON.stringify(gaMeasurementId)});
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
                fbq('init', ${JSON.stringify(metaPixelId)});
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
