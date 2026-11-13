import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SAREES } from '@/lib/sarees';
import ProductDetail from '@/components/shop/ProductDetail';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const saree = SAREES.find((s) => s.id === id);
  if (!saree) return { title: 'Not found · House Of GnanRudh' };
  return {
    title: `${saree.name} · House Of GnanRudh`,
    description: saree.story,
  };
}

export function generateStaticParams() {
  return SAREES.map((s) => ({ id: s.id }));
}

export default async function ProductPage({ params }: Props) {
  // Soft-launch gate lives in middleware.ts + lib/soft-launch.ts; the
  // old server-side redirect here fired before the middleware's
  // product-detail allow-list could take effect, so individual saree
  // pages 404-redirected during the soft-launch even when their URLs
  // were already whitelisted.
  const { id } = await params;
  const saree = SAREES.find((s) => s.id === id);
  if (!saree) notFound();
  return <ProductDetail saree={saree} />;
}
