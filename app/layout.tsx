import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { weddingData } from "./wedding-data";

const headingFont = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-anhthuvanhieu.vercel.app"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: weddingData.site.title,
    template: `%s | ${weddingData.bride.name} & ${weddingData.groom.name}`,
  },

  description: weddingData.site.description,
  applicationName: "Wedding Invitation",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: weddingData.site.title,
    title: weddingData.site.title,
    description: weddingData.site.description,
    images: [
      {
        url: weddingData.media.ogImage,
        width: 1200,
        height: 630,
        alt: `Thiệp cưới ${weddingData.bride.name} và ${weddingData.groom.name}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: weddingData.site.title,
    description: weddingData.site.description,
    images: [weddingData.media.ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  icons: {
    icon: "/favicon.ico",
  },

  category: "wedding",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3C3D0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
