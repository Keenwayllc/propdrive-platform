import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif — self-hosted Fraunces (undercasetype/Fraunces).
// Variable across weight + optical size; high opsz is unlocked for headlines
// via the .font-display utility in globals.css.
const fraunces = localFont({
  variable: "--font-fraunces",
  display: "swap",
  src: [
    { path: "./fonts/Fraunces-Variable.ttf", style: "normal", weight: "100 900" },
    { path: "./fonts/Fraunces-Italic-Variable.ttf", style: "italic", weight: "100 900" },
  ],
});

// Explicit viewport: device-width, pinch-zoom preserved for a11y (no
// maximum-scale lock), `cover` so content can use iPhone safe-area insets,
// and a cream theme-color to tint the mobile browser chrome.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f2",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PropDrive — The real estate lead platform built for agents",
    template: "%s | PropDrive",
  },
  description:
    "PropDrive helps real estate agents capture, manage, and convert leads with property listings, a built-in CRM, branding tools, and AI-powered features.",
  openGraph: {
    title: "PropDrive — The real estate lead platform built for agents",
    description:
      "Property listings, lead CRM, branding editor, and AI tools for modern real estate agents.",
    url: SITE_URL,
    siteName: "PropDrive",
    type: "website",
    images: [
      {
        url: "/hero/hero-banner.png",
        width: 2048,
        height: 1152,
        alt: "PropDrive — luxury Los Angeles real estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropDrive — The real estate lead platform built for agents",
    description:
      "Property listings, lead CRM, branding editor, and AI tools for modern real estate agents.",
    images: ["/hero/hero-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google Analytics 4 loads only when a measurement ID is set, so the site
  // works untouched until an owner adds NEXT_PUBLIC_GA_ID in Vercel.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--background] text-[--foreground]">
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
