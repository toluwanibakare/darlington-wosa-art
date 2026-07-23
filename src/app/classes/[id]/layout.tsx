import type { Metadata } from "next";

const CLASS_TITLES: Record<string, string> = {
  'single-session': 'Single Session Art Class',
  'monthly-package': 'Monthly Art Package',
  'beginner-workshop': 'Beginner Art Workshop',
  'group-session': 'Group Art Session',
};

export function generateStaticParams() {
  return [
    { id: 'single-session' },
    { id: 'monthly-package' },
    { id: 'beginner-workshop' },
    { id: 'group-session' },
    { id: 'private-class' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = CLASS_TITLES[id] || 'Art Class';
  const description = `Details for ${title.toLowerCase()} at Darlington Wosa Art & Frames Ltd. Premium art education in Rivers State, Nigeria.`;
  return {
    title: `${title} | Darlington Wosa Art & Frames Ltd`,
    description,
    openGraph: {
      title: `${title} | Darlington Wosa Art & Frames Ltd`,
      description,
      url: `https://darlingtonwosa.art/classes/${id}`,
      siteName: "Darlington Wosa Art & Frames Ltd",
      locale: "en_NG",
      type: "website",
      images: [{ url: "/object_logo.png", width: 512, height: 512, alt: "Darlington Wosa Art & Frames Ltd" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Darlington Wosa Art & Frames Ltd`,
      description,
      images: ["/object_logo.png"],
    },
  };
}

export default function ClassDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
