'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ShieldAlert, CheckCircle, ArrowLeft, Heart, Truck, ShieldCheck, Award } from 'lucide-react';
import './product-detail.css';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  rxRequired: boolean;
  imageUrl: string | null;
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();

  const isAdded = cart.some((item) => item.id === product.id);

  return (
    <div className="product-detail-layout container animate-fade-in">
      <Link href="/shop" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Shop</span>
      </Link>

      <div className="product-columns">
        {/* Left Column: Visual */}
        <div className="visual-column">
          <div className="detail-image-frame glass">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="detail-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80';
                }}
              />
            ) : (
              <div className="detail-image-placeholder">💊</div>
            )}
          </div>
        </div>

        {/* Right Column: Information & Controls */}
        <div className="info-column">
          <span className="detail-category">{product.category.name}</span>
          <h1 className="detail-title">{product.name}</h1>

          {product.rxRequired && (
            <div className="rx-warning-box">
              <ShieldAlert className="warning-icon" size={24} />
              <div>
                <h4>Prescription Required (Rx)</h4>
                <p>
                  You will need to upload a valid prescription during checkout or upload it to your dashboard profile to buy this medicine.
                </p>
              </div>
            </div>
          )}

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="detail-original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-actions">
            {product.stock > 0 ? (
              <button
                onClick={() => addToCart(product)}
                className={`btn btn-lg ${isAdded ? 'btn-secondary' : 'btn-primary'} add-to-cart-action-btn`}
              >
                <ShoppingCart size={18} />
                <span>{isAdded ? 'Added to Cart' : 'Add to Shopping Cart'}</span>
              </button>
            ) : (
              <button className="btn btn-lg btn-secondary add-to-cart-action-btn" disabled style={{ opacity: 0.5 }}>
                Out of Stock
              </button>
            )}
            
            <button className="btn btn-secondary wishlist-btn" title="Add to Wishlist">
              <Heart size={18} />
            </button>
          </div>

          <div className="divider"></div>

          {/* Logistics Trust signals */}
          <div className="logistics-grid">
            <div className="logistics-item">
              <Truck size={20} className="logistics-icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above $250</p>
              </div>
            </div>

            <div className="logistics-item">
              <ShieldCheck size={20} className="logistics-icon" />
              <div>
                <h4>Secure Checkouts</h4>
                <p>HMAC encrypted API verifications</p>
              </div>
            </div>

            <div className="logistics-item">
              <Award size={20} className="logistics-icon" />
              <div>
                <h4>Genuine Guarantee</h4>
                <p>100% sourced from certified distributors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
