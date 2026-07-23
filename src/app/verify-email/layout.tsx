import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Darlington Wosa Art & Frames Ltd",
  description: "Verify your email address for your Darlington Wosa Art & Frames account to access all features.",
  openGraph: {
    title: "Verify Email | Darlington Wosa Art & Frames Ltd",
    description: "Verify your email address for your Darlington Wosa Art & Frames account.",
    url: "https://darlingtonwosaart.com/verify-email",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Email | Darlington Wosa Art & Frames Ltd",
    description: "Verify your email address for your Darlington Wosa Art & Frames account.",
    images: ["/object_logo.png"],
  },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
