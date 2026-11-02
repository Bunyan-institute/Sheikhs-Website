import type { Metadata } from "next";
import { Marcellus, Figtree, Amiri, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
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

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  weight: ["500", "600"],
  subsets: ["ethiopic"],
  variable: "--font-ethiopic-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sheikh Muhammed Ferej Megeno",
    default: "Sheikh Muhammed Ferej Megeno",
  },
  description: "Official scholar archive of Sheikh Muhammed Ferej Megeno — Islamic scholar, educator and AAOIFI-certified Sharia consultant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${marcellus.variable} ${figtree.variable} ${amiri.variable} ${notoEthiopic.variable} ${notoSerifEthiopic.variable}`}
    >
      <body className="min-h-screen bg-[#EDF4F0] text-[#0F241C] font-sans antialiased selection:bg-[#BF9A45]/30">
        {children}
      </body>
    </html>
  );
}
