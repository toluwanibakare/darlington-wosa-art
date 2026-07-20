import type { Metadata } from "next";
import { Cinzel, Montserrat, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://darlingtonwosaart.com"),
  title: "Darlington Wosa Art & Frames Ltd",
  description: "Premium Art, Framing, and Creative Services — Darlington Wosa Art & Frames Ltd, Rivers State, Nigeria. Custom portraiture, museum-grade framing, and art education since 2018.",
  icons: {
    icon: [
      { url: "/object_logo.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa. Based in Rivers State, Nigeria.",
    url: "https://darlingtonwosaart.com",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/object_logo.png",
        width: 512,
        height: 512,
        alt: "Darlington Wosa Art & Frames Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

import { ThemeProvider } from "@/components/providers";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { CharcoalDust } from "@/components/effects/CharcoalDust";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { ScrollToTop } from "@/components/effects/ScrollToTop";
import { StarPaintDust } from "@/components/effects/StarPaintDust";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} ${pinyonScript.variable} antialiased h-full`} suppressHydrationWarning>
      <body className="bg-brand-surface text-brand-black min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <LoadingScreen />
          <CharcoalDust />
          <HeaderWrapper />
          <main className="flex-1 flex flex-col w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <StarPaintDust />
        </ThemeProvider>
      </body>
    </html>
  );
}
