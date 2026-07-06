import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jyotish AI — AI Palm Reading & Astrology Platform",
  description: "Unlock your destiny written in your hands. Get advanced AI-powered insights about your personality, career, relationships, health, and future timeline.",
  keywords: "palm reading, ai palm reading, astrology, horoscope, destiny, future predictions, zodiac, remedies",
  openGraph: {
    title: "Jyotish AI — AI Palm Reading & Astrology Platform",
    description: "Unlock your destiny written in your hands. Get advanced AI-powered insights about your personality, career, relationships, health, and future timeline.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1321747096144593"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans bg-midnight text-white antialiased selection:bg-gold/30 selection:text-gold overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

