import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import CheckoutClient from '@/components/CheckoutClient';
import './checkout-layout.css';

export const revalidate = 0;

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/login?callbackUrl=/checkout');
  }

  // Fetch full user record from SQLite to check pre-saved addresses/contacts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <header className="checkout-page-header">
          <h1 className="section-title">Order Checkout</h1>
          <p className="section-subtitle">
            Confirm your medicines, input delivery details, and make a secure keyless payment using the simulator.
          </p>
        </header>

        <CheckoutClient userInfo={user} />
      </div>
    </div>
  );
}
