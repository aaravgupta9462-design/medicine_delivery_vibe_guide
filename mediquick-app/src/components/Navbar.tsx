'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { HeartPulse, ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import './navbar.css';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo">
          <HeartPulse className="logo-icon" />
          <span>MediQuick</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link href="/shop" className="nav-link">Shop Medicines</Link>
          <Link href="/upload-prescription" className="nav-link">Upload Prescription</Link>
          
          <div className="navbar-actions">
            <Link href="/checkout" className="cart-trigger">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {session ? (
              <div className="user-menu-wrapper">
                <Link href="/dashboard" className="btn btn-secondary nav-dashboard-btn">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="btn btn-outline signout-btn"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary nav-login-btn">
                <User size={16} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="mobile-controls">
          <Link href="/checkout" className="cart-trigger">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass animate-scale-in">
          <div className="container mobile-menu-links">
            <Link href="/shop" className="mobile-nav-link" onClick={toggleMobileMenu}>Shop Medicines</Link>
            <Link href="/upload-prescription" className="mobile-nav-link" onClick={toggleMobileMenu}>Upload Prescription</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="mobile-nav-link mobile-dashboard-link" onClick={toggleMobileMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    toggleMobileMenu();
                  }} 
                  className="btn btn-danger mobile-signout-btn"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary mobile-login-btn" onClick={toggleMobileMenu}>
                <User size={16} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
