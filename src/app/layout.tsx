import type { Metadata, Viewport } from "next";
import { Marcellus, Figtree, Amiri, Noto_Sans_Ethiopic } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    template: "%s | Sheikh Muhammed Ferej Megeno",
    default: "Sheikh Muhammed Ferej Megeno",
  },
  description: "Official scholar archive of Sheikh Muhammed Ferej Megeno — Islamic scholar, educator and AAOIFI-certified Sharia consultant.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
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


