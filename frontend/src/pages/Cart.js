import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const total = getTotal();
  const finalTotal = total - discount;

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === 'LAUNCH50') {
      const discountAmount = Math.floor(total * 0.05);
      setDiscount(discountAmount);
      setCouponCode(code);
    } else if (code === '') {
      setDiscount(0);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-4" data-testid="empty-cart-title">
            Your cart is empty
          </h2>
          <p className="text-slate-600 mb-8" data-testid="empty-cart-message">
            Add some services to get started
          </p>
          <Link
            to="/#services"
            className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary-hover h-11 px-8 rounded-md font-medium transition-all duration-200"
            data-testid="browse-services-button"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
          data-testid="back-to-home"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-6" data-testid="cart-title">
                Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h1>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-4 border border-slate-100 rounded-lg"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1" data-testid={`cart-item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2" data-testid={`cart-item-description-${item.id}`}>
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50"
                            data-testid={`decrease-quantity-${item.id}`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50"
                            data-testid={`increase-quantity-${item.id}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm"
                          data-testid={`remove-item-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900" data-testid={`item-price-${item.id}`}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      {item.govt_fee && (
                        <div className="text-sm text-slate-500" data-testid={`item-govt-fee-${item.id}`}>
                          + ₹{(item.govt_fee * item.quantity).toLocaleString()} Govt Fee
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6" data-testid="order-summary-title">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">₹{total.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Discount</span>
                    <span data-testid="discount">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-slate-900">
                    <span>Total</span>
                    <span data-testid="total">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="LAUNCH50"
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    data-testid="coupon-input"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 text-sm font-medium"
                    data-testid="apply-coupon-button"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-hover h-12 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md mb-3"
                data-testid="proceed-to-checkout-button"
              >
                Proceed to Checkout
              </button>

              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs text-red-800 font-medium text-center" data-testid="urgency-message">
                  Limited Filing Slots Available Today
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;