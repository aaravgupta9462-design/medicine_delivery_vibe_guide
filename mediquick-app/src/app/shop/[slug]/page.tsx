import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ProductDetail from './ProductDetail';

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <ProductDetail product={product} />
    </div>
  );
}
