import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StructuredData } from "@/app/_components/StructuredData";
import { OrcidAuthFeedback } from "@/app/_components/OrcidAuthFeedback";
import { WikiFooter } from "@/app/_components/WikiFooter";
import { publicPageMetadata, SITE_DESCRIPTION, siteIdentityStructuredData } from "@/lib/search-discovery";
import "./globals.css";
import "./internal-concept-links.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "WikiBiome — The Human Microbiome Encyclopedia";
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wikibiome.com"),
  ...publicPageMetadata({ title, description: SITE_DESCRIPTION, path: "/" }),
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  icons: { icon: { url: "/favicon.svg?v=2", type: "image/svg+xml" } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData data={siteIdentityStructuredData()} marker="data-site-identity-schema" />
        <OrcidAuthFeedback />
        {children}
        <WikiFooter />
      </body>
    </html>
  );
}
