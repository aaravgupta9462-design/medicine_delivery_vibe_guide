import React, { Suspense } from 'react';
import prisma from '@/lib/db';
import ShopCatalog from '@/components/ShopCatalog';
import './shop.css';

export const revalidate = 0;

async function ShopLoader() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <ShopCatalog
      initialProducts={products}
      categories={categories}
    />
  );
}

export default function ShopPage() {
  return (
    <div className="shop-page-wrapper">
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <header className="shop-header">
          <h1 className="section-title">MediQuick Pharmacy</h1>
          <p className="section-subtitle">
            Search our comprehensive pharmacy inventory. Upload prescriptions for prescription items. All deliveries are verified.
          </p>
        </header>

        <Suspense fallback={
          <div className="shop-loading-state">
            <div className="spinner"></div>
            <p>Loading pharmacy inventory...</p>
          </div>
        }>
          <ShopLoader />
        </Suspense>
      </div>
    </div>
  );
}
