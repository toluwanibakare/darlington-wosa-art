import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Darlington Wosa Art & Frames Ltd",
  description: "Read reviews from clients of Darlington Wosa Art & Frames Ltd. See why our custom portraiture, framing, and art classes are trusted by collectors and students.",
  openGraph: {
    title: "Reviews | Darlington Wosa Art & Frames Ltd",
    description: "Read reviews from clients of Darlington Wosa Art & Frames Ltd. See why our custom portraiture and framing services are trusted by collectors.",
    url: "https://darlingtonwosaart.com/reviews",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviews | Darlington Wosa Art & Frames Ltd",
    description: "See why our custom portraiture, framing, and art classes are trusted by collectors and students.",
    images: ["/object_logo.png"],
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
