import React from 'react';
import Link from 'next/link';
import { HeartPulse, Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Link href="/" className="footer-logo">
            <HeartPulse className="footer-logo-icon" />
            <span>MediQuick</span>
          </Link>
          <p className="footer-description">
            Your premium health and medicine delivery companion. Bringing authentic healthcare products, prescription verification, and wellness advice right to your doorstep.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/shop">Shop Medicines</Link></li>
            <li><Link href="/upload-prescription">Upload Prescription</Link></li>
            <li><Link href="/login">Customer Login</Link></li>
            <li><Link href="/register">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-links-column">
          <h3>Product Categories</h3>
          <ul className="footer-links">
            <li><Link href="/shop?category=prescription-drugs">Prescription Drugs</Link></li>
            <li><Link href="/shop?category=supplements-vitamins">Supplements & Vitamins</Link></li>
            <li><Link href="/shop?category=personal-care">Personal Care</Link></li>
            <li><Link href="/shop?category=medical-devices">Medical Devices</Link></li>
          </ul>
        </div>

        <div className="footer-contact-column">
          <h3>Contact Support</h3>
          <ul className="contact-info">
            <li>
              <Phone size={16} className="contact-icon" />
              <span>+1 (800) 555-0199</span>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <span>support@mediquick.com</span>
            </li>
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>100 Health Plaza, Suite 400, New York, NY</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} MediQuick. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">FDA Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
