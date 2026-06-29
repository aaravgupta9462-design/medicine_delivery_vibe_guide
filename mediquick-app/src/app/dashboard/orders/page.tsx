import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ShoppingBag, Calendar, MapPin, CheckCircle, Package, Truck, ArrowRight, DollarSign } from 'lucide-react';

export const revalidate = 0;

export default async function OrdersDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">DELIVERED</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">CANCELLED</span>;
      case 'PENDING':
        return <span className="badge badge-warning">PENDING</span>;
      case 'PROCESSING':
        return <span className="badge badge-primary">PROCESSING</span>;
      case 'SHIPPED':
        return <span className="badge badge-secondary">SHIPPED</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-success">PAID</span>;
      case 'FAILED':
        return <span className="badge badge-danger">FAILED</span>;
      default:
        return <span className="badge badge-warning">PENDING</span>;
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '24px' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>My Medicine Orders</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Monitor active deliveries, view payment receipts, and see order histories.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="checkout-empty card" style={{ margin: '40px auto 0 auto' }}>
          <ShoppingBag size={48} className="empty-icon animate-float" />
          <h3>No Orders Found</h3>
          <p>You haven't ordered any health products or medicines yet.</p>
          <Link href="/shop" className="btn btn-primary">
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="order-detail-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card-detail card">
              <div className="order-card-header">
                <div className="order-meta-info">
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>
                    Order ID: #{order.id.substring(order.id.length - 12).toUpperCase()}
                  </span>
                  <div className="order-date-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment</span>
                    {getPaymentBadge(order.paymentStatus)}
                  </div>
                </div>
              </div>

              <div className="order-address-box">
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} className="contact-icon" />
                  <span>Ship To</span>
                </h5>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{order.deliveryAddress}</p>
              </div>

              <div className="order-items-grid">
                <h5 style={{ fontSize: '0.9rem', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px' }}>
                  Ordered Items
                </h5>
                {order.orderItems.map((item) => (
                  <div key={item.id} className="order-item-detail-row">
                    <span className="order-item-name">
                      {item.product.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>x {item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="divider" style={{ margin: '16px 0 12px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Razorpay ID: <code>{order.razorpayOrderId || 'N/A'}</code>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Paid Amount:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
