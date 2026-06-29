import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import './categories.css';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
  // Fallback icon selector based on category slug
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'prescription-drugs':
        return '💊';
      case 'supplements-vitamins':
        return '🌿';
      case 'personal-care':
        return '🧴';
      case 'baby-care':
        return '🍼';
      case 'medical-devices':
        return '🩺';
      case 'first-aid':
        return '🩹';
      default:
        return '📦';
    }
  };

  return (
    <section className="section categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Browse our fully stocked catalog of genuine medical products, daily hygiene items, and wellness supplements.
            </p>
          </div>
          <Link href="/shop" className="btn btn-secondary">
            <span>Browse All Shop</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-3 categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/shop?category=${category.slug}`} 
              className="category-card card-gradient"
            >
              <div className="category-icon-wrapper">
                <span className="category-emoji-icon">{getCategoryIcon(category.slug)}</span>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <span className="category-link-text">
                <span>View Products</span>
                <ArrowRight size={14} className="arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
