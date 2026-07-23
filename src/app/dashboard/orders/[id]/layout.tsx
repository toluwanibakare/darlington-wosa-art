export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function OrderDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
