import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { ShoppingBag, Upload, Pill, Plus, Clipboard, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const prescriptions = await prisma.prescription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // Helpers for formatting statuses in UI
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'badge-success';
      case 'CANCELLED':
        return 'badge-danger';
      case 'PENDING':
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'badge-success';
      case 'FAILED':
        return 'badge-danger';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div>
      <div className="welcome-banner">
        <h1>Hello, {session.user.name || 'Member'}!</h1>
        <p>
          Welcome to your health dashboard. Here you can track active medicine orders, view uploaded clinical prescriptions, and manage accounts.
        </p>
      </div>

      <div className="dashboard-actions-grid">
        <div className="action-card card-gradient">
          <div className="action-icon-box">
            <Pill size={24} />
          </div>
          <h3>Order Medicine</h3>
          <p>Search and order OTC health products and prescription drugs directly from certified partners.</p>
          <Link href="/shop" className="btn btn-primary">
            <span>Search Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="action-card card">
          <div className="action-icon-box" style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-secondary)' }}>
            <Upload size={24} />
          </div>
          <h3>Upload Prescription</h3>
          <p>Quickly upload your scanned doctor prescription image. Our clinical staff verifies it in minutes.</p>
          <Link href="/upload-prescription" className="btn btn-secondary">
            <span>Upload Document</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
        {/* Recent Orders List */}
        <div className="recent-activity-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="dashboard-section-title" style={{ margin: 0 }}>Recent Orders</h3>
            <Link href="/dashboard/orders" className="order-link" style={{ fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders placed yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link href="/dashboard/orders" className="order-link">
                          #{order.id.substring(order.id.length - 8)}
                        </Link>
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="recent-activity-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="dashboard-section-title" style={{ margin: 0 }}>Prescription Actions</h3>
            <Link href="/dashboard/prescriptions" className="order-link" style={{ fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>

          {prescriptions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No prescriptions uploaded yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx) => (
                    <tr key={rx.id}>
                      <td>{new Date(rx.createdAt).toLocaleDateString()}</td>
                      <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rx.notes || 'No description'}
                      </td>
                      <td>
                        <span className={`badge ${rx.status === 'APPROVED' ? 'badge-success' : rx.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
