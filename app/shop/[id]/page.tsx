import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SAREES } from '@/lib/sarees';
import ProductDetail from '@/components/shop/ProductDetail';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

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
  if (SOFT_LAUNCH) redirect('/home');
  const { id } = await params;
  const saree = SAREES.find((s) => s.id === id);
  if (!saree) notFound();
  return <ProductDetail saree={saree} />;
}
