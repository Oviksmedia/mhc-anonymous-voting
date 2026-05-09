import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nurses Week 2026 | Maryland Healthcare",
  description: "Cast your anonymous vote for the Most Hardworking Nurse of 2026.",
  openGraph: {
    title: "Nurses Week 2026 | Anonymous Voting",
    description: "Cast your anonymous vote for the Most Hardworking Nurse of 2026.",
    url: "https://mhc-anonymous-voting.vercel.app/",
    siteName: "Maryland Healthcare",
    images: [
      {
        url: "https://mhc-anonymous-voting.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maryland Healthcare Nurses Week 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurses Week 2026 | Anonymous Voting",
    description: "Cast your anonymous vote for the Most Hardworking Nurse of 2026.",
    images: ["https://mhc-anonymous-voting.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
