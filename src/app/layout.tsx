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
  title: "Darlington Wosa Art & Frames Ltd",
  description: "Premium Art, Framing, and Creative Services",
  icons: {
    icon: [
      { url: "/object_logo.png", type: "image/png" },
    ],
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CharcoalDust } from "@/components/effects/CharcoalDust";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { ScrollToTop } from "@/components/effects/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} ${pinyonScript.variable} antialiased h-full`}>
      <body className="bg-brand-surface text-brand-black min-h-full flex flex-col font-sans">
        <LoadingScreen />
        <CharcoalDust />
        <Header />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
