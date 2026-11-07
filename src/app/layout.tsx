import type { Metadata, Viewport } from "next";
import { Marcellus, Figtree, Amiri, Noto_Sans_Ethiopic } from "next/font/google";
import { getSiteUrl, getScholarEntity, getOrganizationEntity, buildWebsiteSchema, buildHreflangAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import "@/styles/globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D3E2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Sheikh Muhammed Ferej Megeno",
    default: "Sheikh Muhammed Ferej Megeno | Official Scholar Platform",
  },
  description: "Official scholar archive of Sheikh Muhammed Ferej Megeno — Islamic scholar, educator and AAOIFI-certified Sharia consultant.",
  alternates: buildHreflangAlternates("/"),
  openGraph: {
    type: "website",
    siteName: "Sheikh Muhammed Ferej Megeno | Official Archive",
    title: "Sheikh Muhammed Ferej Megeno",
    description: "Official scholar archive of Sheikh Muhammed Ferej Megeno — Islamic scholar, educator and AAOIFI-certified Sharia consultant.",
    url: siteUrl,
    images: [
      {
        url: "/images/sheikh-portrait.jpg",
        width: 1200,
        height: 1200,
        alt: "Sheikh Muhammed Ferej Megeno",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheikh Muhammed Ferej Megeno",
    description: "Official scholar archive of Sheikh Muhammed Ferej Megeno — Islamic scholar, educator and AAOIFI-certified Sharia consultant.",
    images: ["/images/sheikh-portrait.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] }
      : undefined,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${marcellus.variable} ${figtree.variable} ${amiri.variable} ${notoEthiopic.variable}`}
    >
      <body className="min-h-screen bg-[#EDF4F0] text-[#0F241C] font-sans antialiased selection:bg-[#BF9A45]/30">
        <JsonLd data={[getScholarEntity(), getOrganizationEntity(), buildWebsiteSchema()]} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // The installed app is admin-only: if it ever lands on a public page, go back to the admin.
              try {
                var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
                if (standalone && !location.pathname.startsWith('/admin')) location.replace('/admin');
              } catch (e) {}
              if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !location.pathname.startsWith('/admin')) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) {
                    if (!regs[i].scope.includes('/admin')) {
                      regs[i].unregister();
                    }
                  }
                });
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}


