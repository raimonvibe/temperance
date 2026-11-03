import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const caps = Cinzel({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-caps" });

const description =
  "and in knowledge, self-control; and in self-control, perseverance; and in perseverance, godliness. — 2 Peter 1:6";

// Share images need an absolute URL. Set NEXT_PUBLIC_SITE_URL to the live domain;
// on Vercel the production domain is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Icons, favicon and share images come from the file conventions in this folder
// (favicon.ico, icon.png, apple-icon.png, opengraph-image.jpg, twitter-image.jpg).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Temperance",
  description,
  appleWebApp: { title: "Temperance", capable: true, statusBarStyle: "default" },
  openGraph: { type: "website", siteName: "Temperance", title: "Temperance", description, url: "/" },
  twitter: { card: "summary_large_image", title: "Temperance", description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efdf" },
    { media: "(prefers-color-scheme: dark)", color: "#13100c" },
  ],
};

// Runs before first paint so the saved (or system) theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${caps.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
