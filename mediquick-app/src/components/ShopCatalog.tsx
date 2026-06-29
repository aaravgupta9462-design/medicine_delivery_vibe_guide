'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ShoppingCart, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ShopCatalog({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, cart } = useCart();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [rxOnly, setRxOnly] = useState(searchParams.get('rx') === 'true');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  // Sync search state if url param changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) setSearch(urlSearch);

    const urlCategory = searchParams.get('category');
    if (urlCategory !== null) setSelectedCategory(urlCategory);
  }, [searchParams]);

  // Apply filters on client side for premium instant updates
  useEffect(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category.slug === selectedCategory);
    }

    if (rxOnly) {
      result = result.filter((p) => p.rxRequired);
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, rxOnly, initialProducts]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setRxOnly(false);
    router.push('/shop');
  };

  const isAddedToCart = (id: string) => {
    return cart.some((item) => item.id === id);
  };

  return (
    <div className="shop-layout">
      {/* Sidebar Filters */}
      <aside className="shop-filters glass">
        <h3 className="filters-title">Filter Products</h3>
        
        <div className="filter-group">
          <label className="form-label">Category</label>
          <div className="category-options">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`category-opt-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`category-opt-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        <div className="filter-group rx-filter-toggle">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rxOnly}
              onChange={(e) => setRxOnly(e.target.checked)}
              className="rx-checkbox"
            />
            <span>Show Prescription Only (Rx)</span>
          </label>
        </div>

        <button onClick={handleClearFilters} className="btn btn-secondary clear-filters-btn">
          <RefreshCw size={14} />
          <span>Reset All Filters</span>
        </button>
      </aside>

      {/* Main Catalog View */}
      <div className="shop-catalog-content">
        <div className="search-row">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search for brand names, molecules, supplements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input search-input-field"
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <div className="results-count">
            <span>Showing {filteredProducts.length} medicines</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state card">
            <Info size={40} className="empty-icon" />
            <h3>No Products Found</h3>
            <p>We couldn't find any products matching your search or filters. Try clearing your filters to see our full range.</p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid-3 shop-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card card">
                <div className="product-image-container">
                  {product.rxRequired && (
                    <span className="badge badge-rx rx-badge">Rx Required</span>
                  )}
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80';
                      }}
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
                  <p className="product-excerpt">{product.description?.substring(0, 80)}...</p>

                  <div className="product-price-row">
                    <div className="price-block">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/shop/${product.slug}`} className="btn btn-secondary btn-sm">
                        Info
                      </Link>
                      
                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          className={`btn btn-sm ${isAddedToCart(product.id) ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ gap: '4px' }}
                        >
                          <ShoppingCart size={14} />
                          <span>{isAddedToCart(product.id) ? 'Added' : 'Add'}</span>
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5 }}>
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
