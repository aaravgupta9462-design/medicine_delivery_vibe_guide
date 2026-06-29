import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';
import { FileText, Calendar, Clock, ShieldAlert, Award, FileUp } from 'lucide-react';

export const revalidate = 0;

export default async function PrescriptionsDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) return null;

  const prescriptions = await prisma.prescription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="dashboard-section-title" style={{ margin: 0 }}>My Prescriptions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Check approval statuses for restricted medicines. Certified pharmacists inspect uploads.
          </p>
        </div>
        <Link href="/upload-prescription" className="btn btn-primary">
          <FileUp size={16} />
          <span>Upload Prescription</span>
        </Link>
      </header>

      {prescriptions.length === 0 ? (
        <div className="checkout-empty card" style={{ margin: '40px auto 0 auto' }}>
          <FileText size={48} className="empty-icon animate-float" />
          <h3>No Prescriptions Found</h3>
          <p>You haven't uploaded any medical prescriptions yet.</p>
          <Link href="/upload-prescription" className="btn btn-primary">
            Upload Prescription Image
          </Link>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '24px' }}>
          {prescriptions.map((rx) => (
            <div key={rx.id} className="card-gradient" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>Uploaded {new Date(rx.createdAt).toLocaleDateString()}</span>
                </span>
                
                <span className={`badge ${rx.status === 'APPROVED' ? 'badge-success' : rx.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                  {rx.status}
                </span>
              </div>

              {/* Base64 preview frame */}
              <div className="glass-light" style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '16px', border: '1px solid var(--border-default)' }}>
                {rx.imageUrl.startsWith('data:image/') ? (
                  <img 
                    src={rx.imageUrl} 
                    alt="Prescription Scan" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                    <span>Clinical Image Data File</span>
                  </div>
                )}
              </div>

              {rx.notes && (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '16px', fontSize: '0.85rem' }}>
                  <h5 style={{ color: 'white', marginBottom: '4px' }}>Review Notes</h5>
                  <p style={{ color: 'var(--text-secondary)' }}>{rx.notes}</p>
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Verified by: {rx.verifiedBy || 'Pending pharmacist assign'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
