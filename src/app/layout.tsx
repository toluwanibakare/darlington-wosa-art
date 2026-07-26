import type { Metadata } from "next";
import { Poppins, Pinyon_Script } from "next/font/google";
import "./globals.css";

const poppinsDisplay = Poppins({
  weight: ["800"],
  variable: "--font-display",
  subsets: ["latin"],
});

const poppinsSans = Poppins({
  weight: ["200", "400", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://darlingtonwosa.art"),
  title: "Darlington Wosa Art & Frames Ltd",
  description: "Premium Art, Framing, and Creative Services — Darlington Wosa Art & Frames Ltd, Rivers State, Nigeria. Custom portraiture, museum-grade framing, and art education since 2018.",
  icons: {
    icon: [
      { url: "/logo_white.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa. Based in Rivers State, Nigeria.",
    url: "https://darlingtonwosa.art",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/logo_white.png",
        width: 1200,
        height: 630,
        alt: "Darlington Wosa Art & Frames Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darlington Wosa Art & Frames Ltd",
    description: "Premium handcrafted portraiture, bespoke museum-grade framing, and art education by Darlington Wosa.",
    images: ["/logo_white.png"],
  },
};

import { ThemeProvider } from "@/components/providers";
import { CartProvider, CartDrawer } from "@/components/shop";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
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
    <html lang="en" className={`${poppinsDisplay.variable} ${poppinsSans.variable} ${pinyonScript.variable} antialiased h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()`
        }} />
      </head>
      <body className="bg-brand-surface text-brand-black min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <CartProvider>
            <LoadingScreen />
            <CharcoalDust />
            <HeaderWrapper />
            <main className="flex-1 flex flex-col w-full overflow-x-hidden">
              {children}
            </main>
            <ConditionalFooter />
            <ScrollToTop />
            <StarPaintDust />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
