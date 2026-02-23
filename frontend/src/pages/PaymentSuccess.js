import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import useLeadCapture from '../hooks/useLeadCapture';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  // Safety net: if the user got here, they definitely converted.
  // markConverted is idempotent — safe to call even if Checkout already called it.
  const { markConverted } = useLeadCapture([], 0, null);

  useEffect(() => {
    if (!paymentId || !orderId) {
      navigate('/');
      return;
    }
    // Belt-and-suspenders: mark converted here in case the handler in Checkout.js
    // didn't fire (network blip, user navigated directly to this URL, etc.)
    markConverted();
  }, [paymentId, orderId]); // eslint-disable-line

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-16 pt-[96px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Green success bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#10b981] to-[#0ea570]" />

            <div className="p-10 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-11 w-11 text-[#10b981]" />
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900 mb-3" data-testid="success-title">
                Payment Successful!
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-8" data-testid="success-message">
                Your legal service order is confirmed. Our team will reach out within <strong className="text-slate-700">24 hours</strong> to begin processing your application.
              </p>

              {/* Order details */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Details</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Payment ID</span>
                    <span className="font-mono font-semibold text-slate-900 text-xs" data-testid="payment-id">{paymentId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Order ID</span>
                    <span className="font-mono font-semibold text-slate-900 text-xs" data-testid="order-id">{orderId}</span>
                  </div>
                </div>
              </div>

              {/* What's next */}
              <div className="bg-[#0B1120] rounded-xl p-5 mb-8 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  What happens next
                </p>

                <div className="space-y-2.5">
                  {[
                    'Our legal expert will review your application',
                    "We'll send documents to your email within 24hrs",
                    'Track progress in your dashboard anytime',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#10b981] text-[10px] font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0B1120] text-white hover:bg-slate-800 h-12 px-6 rounded-xl font-semibold text-sm transition-all"
                  data-testid="go-to-dashboard-button"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-12 px-6 rounded-xl font-semibold text-sm transition-all"
                  data-testid="download-invoice-button"
                >
                  <Download className="h-4 w-4" /> Print Receipt
                </button>
              </div>
            </div>

            <div className="px-10 pb-6 flex items-center justify-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
              <span className="text-xs text-slate-400">Payment secured by Razorpay · PCI DSS Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;