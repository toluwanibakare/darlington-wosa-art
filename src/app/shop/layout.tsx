import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Darlington Wosa Art & Frames Ltd",
  description: "Browse the Darlington Wosa Art & Frames shop. Purchase original artwork, premium prints, framing supplies, and art merchandise.",
  openGraph: {
    title: "Shop | Darlington Wosa Art & Frames Ltd",
    description: "Browse the Darlington Wosa Art & Frames shop. Purchase original artwork, premium prints, framing supplies, and art merchandise.",
    url: "https://darlingtonwosaart.com/shop",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Darlington Wosa Art & Frames Ltd",
    description: "Original artwork, premium prints, framing supplies, and art merchandise by Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
