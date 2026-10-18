import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./globals.css";

const fairview = localFont({
  src: "../../public/fonts/Fairview_Regular.otf",
  variable: "--font-display-source",
  display: "swap",
});

const ibmPlexSansBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  fallback: ["sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://learn.therobotage.com"),
  title: {
    default: "The Robot Age — Learn",
    template: "%s — The Robot Age",
  },
  description: "Cohort-based credentials in Robot Experience Design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fairview.variable} ${ibmPlexSansBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
