import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import CategoriesGrid from '@/components/CategoriesGrid';
import ProductImage from '@/components/ProductImage';
import { ShieldCheck, Truck, Clock, Award, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import './home.css';

// Opt out of caching so database changes reflect immediately on page load
export const revalidate = 0;

export default async function HomePage() {
  const categories = await prisma.category.findMany();
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    include: {
      category: true,
    },
  });

  return (
    <div className="homepage-wrapper">
      {/* Hero Header */}
      <HeroSection />

      {/* Trust Badges Bar */}
      <section className="trust-badges-section glass-light">
        <div className="container trust-badges-container">
          <div className="trust-badge-item">
            <ShieldCheck size={28} className="trust-badge-icon" />
            <div>
              <h3>100% Authentic</h3>
              <p>Direct from registered pharmacy networks</p>
            </div>
          </div>
          <div className="trust-badge-item">
            <Truck size={28} className="trust-badge-icon" />
            <div>
              <h3>Under 2 Hour Delivery</h3>
              <p>Free delivery on orders above $250</p>
            </div>
          </div>
          <div className="trust-badge-item">
            <Clock size={28} className="trust-badge-icon" />
            <div>
              <h3>24/7 Availability</h3>
              <p>Certified clinical support anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <CategoriesGrid categories={categories} />

      {/* Featured Products Section */}
      <section className="section featured-products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Medicines & Products</h2>
              <p className="section-subtitle">
                Highly requested prescription drugs and household healthcare items checked and certified by experts.
              </p>
            </div>
            <Link href="/shop" className="btn btn-secondary">
              <span>View All Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4 products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card card">
                <div className="product-image-container">
                  {product.rxRequired && (
                    <span className="badge badge-rx rx-badge">Rx Required</span>
                  )}
                  {product.imageUrl ? (
                    <ProductImage 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">💊</div>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-category-name">{product.category.name}</span>
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="product-name-title">{product.name}</h3>
                  </Link>
                  <p className="product-excerpt">{product.description?.substring(0, 70)}...</p>
                  
                  <div className="product-price-row">
                    <div className="price-block">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="btn btn-secondary btn-sm add-cart-btn">
                      <span>Detail</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box card-gradient">
            <div className="cta-content">
              <span className="badge badge-success cta-badge">Clinical Support</span>
              <h2>Need a Doctor's Prescription?</h2>
              <p>
                Have a prescription from your clinic? Upload a photo or scan now. Our certified pharmacists will review and verify your order within minutes.
              </p>
              <div className="cta-actions">
                <Link href="/upload-prescription" className="btn btn-primary btn-lg">
                  <span>Upload Prescription Image</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/shop" className="btn btn-secondary btn-lg">
                  <span>Browse Catalog</span>
                </Link>
              </div>
            </div>
            <div className="cta-visual">
              <img 
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80" 
                alt="Doctor consultation" 
                className="cta-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
