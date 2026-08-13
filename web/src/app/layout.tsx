import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const headingFont = Montserrat({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const SITE_URL = "https://jaureautomotriz.com";
const TITLE = "JAURE | Ingeniería Automotriz";
const DESCRIPTION =
  "Centro Automotriz Integral: diagnóstico, mantenimiento, llantas, suspensión, frenos, alineación y balanceo. Ingeniería que protege tu inversión.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.json",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "JAURE Ingeniería Automotriz",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/og-jaure.jpg", width: 1200, height: 630, alt: "JAURE Ingeniería Automotriz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-jaure.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
