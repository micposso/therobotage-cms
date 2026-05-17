import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { WaitlistProvider } from "@/context/WaitlistContext";
import HomepagePopup from "@/components/HomepagePopup/HomepagePopup";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'),
  title: {
    default: "The Robot Age",
    template: "%s — The Robot Age",
  },
  description: "Robotic literacy education, research, and certification for designers, strategists, and leaders who work alongside robots.",
  openGraph: {
    title: "The Robot Age",
    description: "Robotic literacy education, research, and certification for designers, strategists, and leaders who work alongside robots.",
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
    siteName: "The Robot Age",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/home.png'],
  },
  alternates: {
    canonical: 'https://therobotage.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable}`}>
      <head>
        {process.env.NODE_ENV === 'production' && <>
          {/* GTM Consent Mode defaults — must run before GTM loads */}
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:2000});
            try{var c=JSON.parse(localStorage.getItem('tra-cookie-consent')||'null');if(c&&c.version===1){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied'});}}catch(e){}
          `}} />
          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PNSS5LF8');` }} />
          {/* End Google Tag Manager */}
        </>}
      </head>
      <body>
        {process.env.NODE_ENV === 'production' && (
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PNSS5LF8" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}
        <WaitlistProvider>{children}</WaitlistProvider>
        <HomepagePopup />
        <CookieBanner />
      </body>
    </html>
  );
}
