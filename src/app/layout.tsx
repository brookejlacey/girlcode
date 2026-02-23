import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Girl Code | Fractional Tech Leadership & Consulting",
  description:
    "45+ years of combined engineering experience. Fractional CTO, technical consulting, media, and app development. Built by women who ship.",
  keywords: [
    "fractional CTO",
    "technical consulting",
    "women in tech",
    "app development",
    "Girl Code",
  ],
  openGraph: {
    title: "Girl Code | Fractional Tech Leadership & Consulting",
    description:
      "45+ years of combined engineering experience. Fractional CTO, technical consulting, media, and app development.",
    url: "https://girlcode.technology",
    siteName: "Girl Code",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
