import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RatesProvider } from "@/components/RatesProvider";
import { adsenseClient, siteName, siteUrl, tagline } from "@/data/site";
import "./globals.css";

// Only the headings use a downloaded font. Body text uses the phone's own font, so
// the first screen appears without waiting for a font file on a slow connection.
const heading = Lexend({ variable: "--font-heading", subsets: ["latin"] });

const title = `Dollar, Gold and Petrol Rate Today in Pakistan | ${siteName}`;
const description =
  "Today's dollar rate, gold rate per tola, petrol and diesel price and AED, SAR, GBP to PKR in Pakistan. Updated every day from the State Bank, ECAP and OGRA.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${siteName}` },
  description,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName}: ${tagline}`,
    description,
    locale: "en_PK",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${siteName}: ${tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}: ${tagline}`,
    description,
    images: ["/og.png"],
  },
  ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f2a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1a33" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} h-full antialiased`}>
      {adsenseClient && (
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        </head>
      )}
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <RatesProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </RatesProvider>
      </body>
    </html>
  );
}
