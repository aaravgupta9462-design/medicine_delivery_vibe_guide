import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Award, HeartPulse } from 'lucide-react';
import './auth.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-branding">
        <div className="auth-branding-overlay"></div>
        <div className="auth-branding-content">
          <Link href="/" className="auth-logo">
            <HeartPulse className="auth-logo-icon" />
            <span>MediQuick</span>
          </Link>
          
          <div className="auth-hero-text">
            <h2>Your Health, <br />Delivered Instantly.</h2>
            <p>Access genuine prescription drugs, daily supplements, and healthcare devices from certified pharmacies near you.</p>
          </div>

          <div className="auth-trust-signals">
            <div className="trust-card">
              <ShieldCheck className="trust-icon" />
              <div>
                <h4>100% Genuine Medicines</h4>
                <p>Direct from verified distributors</p>
              </div>
            </div>
            
            <div className="trust-card">
              <Truck className="trust-icon" />
              <div>
                <h4>Ultra Fast Delivery</h4>
                <p>Delivered to your doorstep under 2 hours</p>
              </div>
            </div>

            <div className="trust-card">
              <Award className="trust-icon" />
              <div>
                <h4>Certified Pharmacists</h4>
                <p>Expert prescription verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-form-wrapper">
        <div className="auth-form-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
