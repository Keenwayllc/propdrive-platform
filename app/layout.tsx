import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif — used only for marketing headlines (never dashboard).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getpropdrive.com"),
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
    url: "https://getpropdrive.com",
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--background] text-[--foreground]">
        {children}
      </body>
    </html>
  );
}
