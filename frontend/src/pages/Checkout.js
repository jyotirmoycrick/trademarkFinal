import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Lock, ArrowLeft, ShieldCheck, User, Building2,
  Mail, Phone, Tag, ChevronRight, ChevronDown, Sparkles, BadgeCheck, CreditCard, Zap
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import useLeadCapture from '../hooks/useLeadCapture';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── Field animation variants ─── */
const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }
  }),
};

/* ─── Step indicator ─── */
const StepDot = ({ num, label, state }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300
      ${state === 'done'   ? 'bg-[#10b981] text-white shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
      : state === 'active' ? 'bg-[#0B1120] text-white shadow-[0_0_0_3px_rgba(11,17,32,0.14)]'
      :                      'bg-slate-100 text-slate-400'}`}
    >
      {state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : num}
    </div>
    <span className={`text-xs font-semibold transition-colors duration-300
      ${state === 'active' ? 'text-slate-900' : state === 'done' ? 'text-[#10b981]' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

/* ─── Input field with icon ─── */
const Field = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, onBlur, testId, required = true, index = 0 }) => (
  <motion.div custom={index} variants={fieldVariants} initial="hidden" animate="visible">
    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#10b981] transition-colors duration-200 pointer-events-none">
        <Icon className="h-4 w-4" />
      </div>
      <input
        type={type} name={name} required={required}
        value={value} onChange={onChange} onBlur={onBlur}
        placeholder={placeholder} data-testid={testId}
        className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[15px] text-slate-900
          placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]
          transition-all duration-200 shadow-sm group-hover:border-slate-300"
      />
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Checkout = () => {
  const [step, setStep]                     = useState(1);
  const [loading, setLoading]               = useState(false);
  const [couponCode, setCouponCode]         = useState('');
  const [couponApplied, setCouponApplied]   = useState(false);
  const [summaryOpen, setSummaryOpen]       = useState(false); // mobile collapsible
  const [formData, setFormData]             = useState({ name: '', email: '', phone: '', business_name: '' });

  const { items, getTotal, clearCart } = useCartStore();
  const { token, user }                = useAuthStore();
  const navigate                       = useNavigate();

  const total      = getTotal();
  const discount   = couponApplied && couponCode.toUpperCase() === 'LAUNCH50' ? Math.floor(total * 0.05) : 0;
  const finalTotal = total - discount;

  const { trackField, trackStep, markConverted } = useLeadCapture(items, total, user);

  useEffect(() => {
    if (!token)          { navigate('/login'); return; }
    if (items.length === 0) { navigate('/cart');  return; }
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', business_name: '' });
    }
    trackStep('started');
  }, [token, items, user, navigate]); // eslint-disable-line

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlur   = (e) => trackField(e.target.name, e.target.value);

  const handleStepOne = (e) => {
    e.preventDefault();
    trackStep('complete', { ...formData });
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'LAUNCH50') {
      setCouponApplied(true);
      toast.success('Coupon applied! 5% discount added.');
    } else {
      setCouponApplied(false);
      toast.error('Invalid coupon code');
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script       = document.createElement('script');
      script.src         = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload      = () => resolve(true);
      script.onerror     = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setLoading(true);
    trackStep('payment_initiated');
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { toast.error('Failed to load payment gateway'); setLoading(false); return; }

      const cartItems = items.map(item => ({ service_id: item.id, quantity: item.quantity }));
      const orderResponse = await axios.post(
        `${API}/orders/create`,
        { ...formData, cart_items: cartItems, coupon_code: couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpay_order_id, amount, key_id, internal_order_id } = orderResponse.data;
      trackStep('payment_initiated', { razorpay_order_id });

      const options = {
        key: key_id,
        amount: amount * 100,
        currency: 'INR',
        name: 'WebDesert Legal Services',
        description: 'Legal Service Payment',
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await axios.post(
              `${API}/orders/verify-payment`,
              {
                razorpay_order_id:  response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                order_id: internal_order_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await markConverted();
            clearCart();
            toast.success('Payment successful!');
            navigate(`/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${razorpay_order_id}`);
          } catch { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => toast.info('Payment cancelled. Your details are saved — try again anytime.') },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#0B1120' },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared: Order summary contents (used in both mobile accordion & desktop sidebar) ── */
  const SummaryContents = () => (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 font-medium leading-snug">{item.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
              {item.govt_fee && (
                <p className="text-[11px] text-slate-400">+₹{(item.govt_fee * item.quantity).toLocaleString()} Govt</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="pt-1">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          <Tag className="inline h-3 w-3 mr-1" />Coupon Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={e => { setCouponCode(e.target.value); setCouponApplied(false); }}
            placeholder="LAUNCH50"
            className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all"
            data-testid="coupon-input"
          />
          <button
            onClick={handleApplyCoupon}
            className={`px-4 h-10 rounded-xl text-xs font-bold flex-shrink-0 transition-all
              ${couponApplied
                ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30'
                : 'bg-[#0B1120] text-white hover:bg-slate-800'}`}
            data-testid="apply-coupon-button"
          >
            {couponApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-[#10b981] font-medium">
            <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount</span>
            <span data-testid="payment-discount">−₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-[#0B1120] text-base pt-1 border-t border-slate-100">
          <span>Total Payable</span>
          <span data-testid="payment-total">₹{finalTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@700;800&display=swap');
        /* Reserve space at bottom so fixed CTA bar doesn't overlap content on mobile */
        .mobile-pb { padding-bottom: 96px; }
        @media (min-width: 1024px) { .mobile-pb { padding-bottom: 0; } }
      `}</style>

      <Header />

      {/* ══ PAGE WRAPPER ══ */}
      <div className="pt-[60px] min-h-screen mobile-pb">

        {/* ── Fixed top step-bar (mobile) / inline top-bar (desktop) ── */}
        <div className="sticky top-[60px] z-30 bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
            {/* Back */}
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors group flex-shrink-0"
              data-testid="back-to-cart"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Cart</span>
            </button>

            {/* Step pills */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <StepDot num={1} label="Your Info"    state={step > 1 ? 'done' : 'active'} />
              <div className="w-8 sm:w-12 h-px bg-slate-200 relative overflow-hidden">
                <div className={`absolute inset-y-0 left-0 bg-[#10b981] transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <StepDot num={2} label="Review & Pay" state={step >= 2 ? 'active' : 'pending'} />
            </div>

            {/* Spacer to balance layout */}
            <div className="w-[60px] sm:w-[90px] flex-shrink-0" />
          </div>
        </div>

        {/* ══ MOBILE: Collapsible order summary accordion (top of page, below step bar) ══ */}
        <div className="lg:hidden bg-white border-b border-slate-100">
          <button
            onClick={() => setSummaryOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#10b981]" />
              <span className="text-sm font-semibold text-slate-800" data-testid="payment-summary-title">Order Summary</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 rounded-full px-2 py-0.5">
                  −₹{discount.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">₹{finalTotal.toLocaleString()}</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${summaryOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                key="mobile-summary"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-5 pt-1 border-t border-slate-100">
                  <SummaryContents />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ MAIN CONTENT ══ */}
        <div className="max-w-5xl mx-auto px-4 py-5 lg:py-8 lg:grid lg:grid-cols-[1fr_340px] lg:gap-7 lg:items-start">

          {/* ─────────────────────────────────
              FORM AREA
          ───────────────────────────────── */}
          <div>
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Info form ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-[#0B1120] via-[#10b981] to-[#0ea570]" />
                  <div className="p-5 sm:p-7">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2
                          className="text-xl sm:text-2xl font-bold text-slate-900 mb-1"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                          data-testid="checkout-step-1-title"
                        >
                          Your Information
                        </h2>
                        <p className="text-sm text-slate-400">We'll use this to process your legal application</p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 ml-4">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <form onSubmit={handleStepOne} className="space-y-4">
                      {/* Stack all fields on mobile, 2-col on sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={User}      label="Full Name"      name="name"          placeholder="John Doe"              value={formData.name}          onChange={handleChange} onBlur={handleBlur} testId="checkout-name-input"     index={0} />
                        <Field icon={Mail}      label="Email Address"  name="email"         placeholder="you@example.com"       value={formData.email}         onChange={handleChange} onBlur={handleBlur} testId="checkout-email-input"    index={1} type="email" />
                        <Field icon={Phone}     label="Phone Number"   name="phone"         placeholder="+91 98765 43210"       value={formData.phone}         onChange={handleChange} onBlur={handleBlur} testId="checkout-phone-input"    index={2} type="tel" />
                        <Field icon={Building2} label="Business Name"  name="business_name" placeholder="Your Business Pvt Ltd" value={formData.business_name} onChange={handleChange} onBlur={handleBlur} testId="checkout-business-input" index={3} />
                      </div>

                      {/* Security note */}
                      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible"
                        className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-3"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          Your details are secured with 256-bit SSL encryption and only used to process your application.
                        </p>
                      </motion.div>

                      {/* CTA — full width, large touch target */}
                      <motion.button
                        custom={5} variants={fieldVariants} initial="hidden" animate="visible"
                        type="submit"
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2.5 h-14 rounded-xl bg-[#0B1120] text-white font-semibold text-[15px] hover:bg-slate-800 active:bg-slate-900 transition-all shadow-md group"
                        data-testid="proceed-to-review-button"
                      >
                        Continue to Review
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Review ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* Customer info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[#10b981] to-[#0ea570]" />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2
                            className="text-lg font-bold text-slate-900"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                            data-testid="checkout-step-2-title"
                          >
                            Review Order
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">Confirm your details before payment</p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-[#10b981] hover:text-[#0ea570] px-3 py-1.5 rounded-lg bg-[#10b981]/8 hover:bg-[#10b981]/15 transition-all"
                        >
                          Edit Info
                        </button>
                      </div>

                      {/* 2-col on mobile too — simpler label+value rows */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: User,      label: 'Name',     value: formData.name,          testId: 'review-name' },
                          { icon: Mail,      label: 'Email',    value: formData.email,         testId: 'review-email' },
                          { icon: Phone,     label: 'Phone',    value: formData.phone,         testId: 'review-phone' },
                          { icon: Building2, label: 'Business', value: formData.business_name, testId: 'review-business' },
                        ].map(({ icon: Icon, label, value, testId }, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-50 border border-slate-100 rounded-xl p-3"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Icon className="h-3 w-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 truncate" data-testid={testId}>
                              {value || '—'}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Services list */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#10b981]" />
                        Services Ordered
                      </h3>
                      <div className="space-y-2.5">
                        {items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                            data-testid={`review-item-${item.id}`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-[#0B1120]/6 border border-[#0B1120]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <BadgeCheck className="h-3.5 w-3.5 text-[#0B1120]" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 text-sm leading-snug">{item.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                              {item.govt_fee && (
                                <p className="text-[11px] text-slate-400">+₹{(item.govt_fee * item.quantity).toLocaleString()} Govt</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons — visible above the fixed bar on desktop, hidden on mobile (fixed bar handles it) */}
                  <div className="hidden lg:flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-none flex items-center gap-1.5 px-5 h-13 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-all shadow-sm"
                      data-testid="back-to-info-button"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <motion.button
                      onClick={handlePayment}
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.01 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="flex-1 flex items-center justify-center gap-2.5 bg-[#10b981] text-white hover:bg-[#0ea570] h-13 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#10b981]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                      data-testid="pay-now-button"
                    >
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Initializing…</>
                      ) : (
                        <><Lock className="h-4 w-4" /> Pay Securely — ₹{finalTotal.toLocaleString()} <Zap className="h-3.5 w-3.5 opacity-70" /></>
                      )}
                    </motion.button>
                  </div>

                  {/* Payment methods strip (desktop only, mobile sees it in fixed bar) */}
                  <div className="hidden lg:flex items-center justify-center gap-3 pb-1">
                    {['UPI', 'Visa / MC', 'RuPay', 'Net Banking', 'EMI'].map(m => (
                      <span key={m} className="text-[11px] text-slate-400 font-medium">{m}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─────────────────────────────────
              DESKTOP SIDEBAR: Order summary
          ───────────────────────────────── */}
          <div className="hidden lg:block lg:sticky lg:top-[130px] space-y-4">

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-[#0B1120] to-slate-700" />
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-5 text-[15px]" data-testid="payment-summary-title">
                  Order Summary
                </h3>
                <SummaryContents />
              </div>
            </motion.div>

            {/* Security card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-[#0B1120] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span className="text-xs font-bold text-white tracking-wide">Secured Checkout</span>
              </div>
              {[
                { icon: CreditCard, text: 'Razorpay · PCI DSS Compliant' },
                { icon: Lock,       text: '256-bit SSL Encryption' },
                { icon: BadgeCheck, text: 'MCA & D-U-N-S Verified' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-400">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Payment methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white rounded-2xl border border-slate-100 p-4"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'EMI'].map(m => (
                  <span key={m} className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">{m}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE: Fixed bottom CTA bar ══
          Always visible — shows total + primary action at all times.
          On step 1: "Continue to Review" (submits form via button-id trick)
          On step 2: "Pay Securely"
      */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="px-4 pt-3 pb-safe pb-4">
          {/* Mini price row */}
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
              <span className="text-[11px] text-slate-400 font-medium">Razorpay · SSL Secured</span>
            </div>
            <div className="text-right">
              {discount > 0 && (
                <p className="text-[11px] text-[#10b981] font-semibold">Saved ₹{discount.toLocaleString()}</p>
              )}
              <p className="text-base font-bold text-slate-900">₹{finalTotal.toLocaleString()}</p>
            </div>
          </div>

          {/* Step 1 CTA */}
          {step === 1 && (
            <button
              form="checkout-form-mobile"
              type="submit"
              onClick={(e) => {
                // find the real form and trigger its submit
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              className="w-full h-14 rounded-xl bg-[#0B1120] text-white font-bold text-[15px] flex items-center justify-center gap-2 active:bg-slate-900 transition-all shadow-md"
              data-testid="proceed-to-review-button-mobile"
            >
              Continue to Review <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Step 2 CTA */}
          {step === 2 && (
            <div className="space-y-2">
              <motion.button
                onClick={handlePayment}
                disabled={loading}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full h-14 rounded-xl bg-[#10b981] text-white font-bold text-[15px] flex items-center justify-center gap-2.5 active:bg-[#0ea570] transition-all shadow-lg shadow-[#10b981]/25 disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="pay-now-button"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  <><Lock className="h-4 w-4" /> Pay Securely — ₹{finalTotal.toLocaleString()}</>
                )}
              </motion.button>
              <button
                onClick={() => setStep(1)}
                className="w-full h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:bg-slate-100 transition-all"
                data-testid="back-to-info-button"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
