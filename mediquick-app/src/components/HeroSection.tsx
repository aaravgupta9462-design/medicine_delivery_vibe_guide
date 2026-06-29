'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Shield, Award, Sparkles } from 'lucide-react';
import './hero.css';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Defer animation rendering to post-mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="hero-section">
      {/* Dynamic Background Particles (rendered only after mounting) */}
      {mounted && (
        <div className="hero-particles">
          <div className="particle cross-1 animate-float">✚</div>
          <div className="particle cross-2 animate-float" style={{ animationDelay: '-1.5s' }}>✚</div>
          <div className="particle cross-3 animate-float" style={{ animationDelay: '-3s' }}>✚</div>
          <div className="particle circle-1"></div>
          <div className="particle circle-2"></div>
        </div>
      )}

      <div className="container hero-container">
        <div className="hero-content animate-fade-up">
          <div className="hero-badge badge badge-primary">
            <Sparkles size={14} />
            <span>24/7 Verified Pharmacist Assistance</span>
          </div>

          <h1 className="hero-title">
            Your Health, <br />
            <span className="text-gradient">Delivered Fast.</span>
          </h1>

          <p className="hero-subtitle">
            Skip the queue. Search for medicines, upload prescriptions, and receive authentic wellness products at your doorstep in under 2 hours.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search-bar glass">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Search for insulin, vitamins, pain relief..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">
              <span>Find Medicines</span>
            </button>
          </form>

          <div className="hero-actions">
            <button onClick={() => router.push('/shop')} className="btn btn-primary btn-lg">
              <span>Shop All Products</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => router.push('/upload-prescription')} className="btn btn-secondary btn-lg">
              <span>Upload Prescription</span>
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <Shield size={18} className="trust-badge-icon" />
              <span>FDA Approved & 100% Genuine</span>
            </div>
            <div className="trust-item">
              <Award size={18} className="trust-badge-icon" />
              <span>Certified Pharmacists</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-scale-in">
          <div className="image-frame-glow"></div>
          <div className="image-frame glass">
            <img
              src="https://images.unsplash.com/photo-1607619056574-7b8d304b3b86?auto=format&fit=crop&w=800&q=80"
              alt="Medicines & Wellness Care"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
