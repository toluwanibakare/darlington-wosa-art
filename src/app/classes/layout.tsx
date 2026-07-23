import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Art Classes | Darlington Wosa Art & Frames Ltd",
  description: "Join art classes taught by Darlington Wosa. Learn pencil sketching, charcoal portraiture, and hyper-realistic drawing techniques. Online and in-studio sessions in Rivers State, Nigeria.",
  openGraph: {
    title: "Art Classes | Darlington Wosa Art & Frames Ltd",
    description: "Join art classes taught by Darlington Wosa. Learn pencil sketching, charcoal portraiture, and hyper-realistic drawing techniques. Online and in-studio sessions available.",
    url: "https://darlingtonwosaart.com/classes",
    siteName: "Darlington Wosa Art & Frames Ltd",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Classes | Darlington Wosa Art & Frames Ltd",
    description: "Learn pencil sketching, charcoal portraiture, and hyper-realistic drawing techniques with Darlington Wosa.",
    images: ["/object_logo.png"],
  },
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
