'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, MapPin, CreditCard, ChevronRight, ShieldAlert, 
  Trash2, Plus, Minus, CheckCircle, Loader2, AlertTriangle, Sparkles 
} from 'lucide-react';
import './checkout.css';

interface UserInfo {
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
}

export default function CheckoutClient({ userInfo }: { userInfo: UserInfo }) {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, hasRxRequired } = useCart();

  const [address, setAddress] = useState(userInfo.address || '');
  const [city, setCity] = useState(userInfo.city || '');
  const [phone, setPhone] = useState(userInfo.phone || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Sandbox Simulator Modal State
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatingOrder, setSimulatingOrder] = useState<any>(null);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!address || !city || !phone) {
      setError('Please provide your complete delivery address and contact number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
          deliveryAddress: `${address}, ${city}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      if (data.isMock) {
        // Trigger Sandbox Simulator Modal
        setSimulatingOrder(data);
        setSimulatorOpen(true);
        setLoading(false);
      } else {
        // Trigger Real Razorpay Checkout
        triggerRazorpay(data);
      }
    } catch (err: unknown) {
      setError('An error occurred during checkout initialization.');
      console.error(err);
      setLoading(false);
    }
  };

  // Real Razorpay dynamic script loader and widget trigger
  const triggerRazorpay = (orderData: any) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
        amount: Math.round(orderData.amount * 100),
        currency: 'USD',
        name: 'MediQuick Pharmacy',
        description: 'Secure Medicine Delivery Order',
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          // Send signature validation request
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push('/dashboard/orders?success=true');
            } else {
              setError('Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Error during verification:', verifyErr);
            setError('An error occurred verifying payment.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userInfo.name || '',
          email: userInfo.email,
          contact: phone,
        },
        theme: {
          color: '#2563eb',
        },
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    
    script.onerror = () => {
      setError('Failed to load Razorpay SDK. Try simulating success.');
      // Force sandbox simulation as fallback since SDK failed
      setSimulatingOrder(orderData);
      setSimulatorOpen(true);
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  // Simulate payment callback for Sandbox Modal
  const handleSimulatePayment = async (success: boolean) => {
    if (!simulatingOrder) return;
    
    setLoading(true);
    setSimulatorOpen(false);

    if (!success) {
      setError('Payment simulation cancelled by user.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: simulatingOrder.orderId,
          razorpayOrderId: simulatingOrder.razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 12)}`,
          razorpaySignature: 'mock_signature',
        }),
      });

      if (res.ok) {
        clearCart();
        router.push('/dashboard/orders');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Payment simulation verification failed.');
      }
    } catch (err: unknown) {
      setError('An error occurred validating payment simulation.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty card">
        <ShoppingBag size={48} className="empty-icon animate-float" />
        <h3>Your Cart is Empty</h3>
        <p>Browse our catalog of prescription and OTC medicines to add items to your cart.</p>
        <button onClick={() => router.push('/shop')} className="btn btn-primary">
          Shop Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-grid container">
      {/* Left Column: Cart Summary & Info */}
      <div className="checkout-cart-column">
        <h2 className="column-title">Review Order Items</h2>
        
        {hasRxRequired && (
          <div className="rx-alert-box animate-fade-in">
            <ShieldAlert size={20} className="rx-alert-icon" />
            <div>
              <h4>Prescription Item Added</h4>
              <p>One or more items require a prescription. Please make sure you upload it in the portal to avoid shipment holds.</p>
            </div>
          </div>
        )}

        <div className="cart-list card">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-row">
              <div className="item-img-frame">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="item-image" />
                ) : (
                  <span>💊</span>
                )}
              </div>
              <div className="item-details">
                <Link href={`/shop/${item.slug}`}>
                  <h4 className="item-name">{item.name}</h4>
                </Link>
                {item.rxRequired && <span className="badge badge-rx">Rx</span>}
                <div className="item-price-block">
                  <span>${item.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-number">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)} 
                className="remove-item-btn"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="divider"></div>

          <div className="price-summary-box">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>{cartTotal > 250 ? 'FREE' : '$15.00'}</span>
            </div>
            <div className="divider"></div>
            <div className="summary-row total-row">
              <span>Total Price</span>
              <span>${(cartTotal + (cartTotal > 250 ? 0 : 15)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Address Form */}
      <div className="checkout-form-column">
        <h2 className="column-title">Delivery Details</h2>

        <div className="checkout-form-card card-gradient">
          <form onSubmit={handleCheckoutSubmit} className="auth-form">
            {error && (
              <div className="auth-alert">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Contact Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input
                className="form-input"
                id="city"
                type="text"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Full Shipping Address</label>
              <textarea
                className="form-input"
                id="address"
                rows={3}
                placeholder="Apartment, suite, street name..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary auth-submit-btn btn-lg"
              type="submit"
              disabled={loading}
              style={{ display: 'flex', gap: '8px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Configuring gateways...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Proceed to Payment (${(cartTotal + (cartTotal > 250 ? 0 : 15)).toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* CUSTOM GLASSMORPHISM SANDBOX SIMULATOR OVERLAY MODAL */}
      {simulatorOpen && simulatingOrder && (
        <div className="simulator-overlay glass-light animate-fade-in">
          <div className="simulator-modal glass animate-scale-in">
            <div className="simulator-header">
              <Sparkles className="simulator-sparkle-icon" size={24} />
              <h3>Razorpay Sandbox Simulator</h3>
            </div>
            
            <div className="simulator-body">
              <div className="simulator-alert">
                <AlertTriangle size={18} className="sim-alert-icon" />
                <span>Developer Fallback Enabled: Mock orders simulated without live credentials.</span>
              </div>

              <div className="simulator-details">
                <div className="sim-detail-row">
                  <span>Order ID:</span>
                  <code className="sim-code">{simulatingOrder.razorpayOrderId}</code>
                </div>
                <div className="sim-detail-row">
                  <span>Amount Due:</span>
                  <span className="sim-amount">${simulatingOrder.amount.toFixed(2)}</span>
                </div>
              </div>

              <p className="simulator-desc">
                Click **Simulate Success** to mock signature verify webhook callbacks and complete the order. Click cancel to reject the verification signature.
              </p>
            </div>

            <div className="simulator-actions">
              <button 
                onClick={() => handleSimulatePayment(true)} 
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Simulate Success
              </button>
              <button 
                onClick={() => handleSimulatePayment(false)} 
                className="btn btn-danger"
                style={{ flex: 0.6 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
