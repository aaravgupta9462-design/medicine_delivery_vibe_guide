'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FileUp, Clipboard, ShieldCheck, HelpCircle, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import './prescription.css';

export default function PrescriptionUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('You must be signed in to upload a prescription.');
      return;
    }

    if (!imageFile) {
      setError('Please upload a prescription image.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageFile,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to upload prescription. Please try again.');
      } else {
        setSuccess('Prescription uploaded successfully for pharmacist verification!');
        setNotes('');
        setImageFile(null);
        setTimeout(() => {
          router.push('/dashboard/prescriptions');
        }, 1500);
      }
    } catch (err: unknown) {
      setError('An error occurred while uploading. Please check your network.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="upload-page-wrapper">
        <div className="container upload-loading">
          <div className="spinner"></div>
          <p>Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page-wrapper">
      <div className="container upload-container">
        {/* Left Side: Guidelines & Trust */}
        <div className="upload-guidelines-column">
          <header className="upload-header">
            <span className="badge badge-primary upload-badge">Rx Verification</span>
            <h1 className="section-title">Upload Prescription</h1>
            <p className="section-subtitle">
              Order prescription-restricted drugs safely by sharing your clinical prescriptions.
            </p>
          </header>

          <div className="guidelines-card card">
            <h3>How it works</h3>
            <ul className="guideline-list">
              <li>
                <span className="step-num">1</span>
                <div>
                  <h4>Submit your order</h4>
                  <p>Upload a clear photo or scan of your signed doctor prescription.</p>
                </div>
              </li>
              <li>
                <span className="step-num">2</span>
                <div>
                  <h4>Pharmacist Verification</h4>
                  <p>Our certified clinical pharmacists review the prescription items and dosages.</p>
                </div>
              </li>
              <li>
                <span className="step-num">3</span>
                <div>
                  <h4>Quick Dispatch</h4>
                  <p>Once verified, the order status will update, and dispatch proceeds immediately.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="upload-trust-box glass-light">
            <ShieldCheck size={24} className="trust-icon" />
            <div>
              <h4>100% HIPAA Compliant & Secure</h4>
              <p>Your medical documentation is encrypted end-to-end and shared only with medical reviewers.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="upload-form-column">
          {session ? (
            <div className="upload-form-box card-gradient">
              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <div className="auth-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="auth-alert" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-accent)', borderColor: 'rgba(34, 197, 94, 0.25)' }}>
                    <CheckCircle size={18} />
                    <span>{success}</span>
                  </div>
                )}

                {/* Drag Drop or File Upload Box */}
                <div className="form-group">
                  <label className="form-label">Upload Document (Image / PNG / JPG, max 2MB)</label>
                  <div className="file-uploader-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="prescription-file-input"
                      className="hidden-file-input"
                    />
                    
                    {imageFile ? (
                      <div className="image-preview-container">
                        <img src={imageFile} alt="Prescription preview" className="image-preview" />
                        <button 
                          type="button" 
                          onClick={() => setImageFile(null)} 
                          className="btn btn-danger btn-sm remove-file-btn"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="prescription-file-input" className="file-upload-label">
                        <Upload size={32} className="upload-arrow-icon" />
                        <span>Select Prescription Image</span>
                        <span className="file-size-info">Supported file types: PNG, JPG, JPEG</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">
                    Notes or Instructions (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Add matching orders, specific timings, or instructions for the pharmacist..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  className="btn btn-primary auth-submit-btn btn-lg"
                  type="submit"
                  disabled={loading || !imageFile}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Uploading document...</span>
                    </>
                  ) : (
                    <span>Submit Prescription</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="login-prompt-card card">
              <AlertCircle size={40} className="empty-icon" />
              <h3>Sign In Required</h3>
              <p>You need to have an active MediQuick account to securely upload medical documentation.</p>
              <div className="login-prompt-actions">
                <Link href="/login?callbackUrl=/upload-prescription" className="btn btn-primary">
                  Sign In / Register
                </Link>
                <Link href="/shop" className="btn btn-secondary">
                  Browse OTC Catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
