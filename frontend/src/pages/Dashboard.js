import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FileText, Clock, CheckCircle, ChevronDown, ChevronUp,
  ShieldCheck, User, ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';
import Header from '../components/Header';
import useAuthStore from '../store/authStore';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── Status helpers ─── */
const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle,
    bg: 'bg-[#10b981]/10',
    text: 'text-[#10b981]',
    border: 'border-[#10b981]/20',
    dot: 'bg-[#10b981]',
    label: 'Completed',
  },
  processing: {
    icon: Clock,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    label: 'Processing',
  },
  failed: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'Failed',
  },
  pending: {
    icon: FileText,
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    label: 'Pending',
  },
};

const getStatus = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.pending;

/* ─── Mobile Order Card (accordion) ─── */
const OrderCard = ({ order, index }) => {
  const [open, setOpen] = useState(false);
  const cfg = getStatus(order.status);
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
      data-testid={`order-row-${order.id}`}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-left gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
            <Icon className={`h-4 w-4 ${cfg.text}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate">
              {order.services.map(s => s.name).join(', ')}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5" data-testid={`order-id-${order.id}`}>
              #{order.id.substring(0, 8)}…
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div>
            <p className="text-sm font-bold text-slate-900 text-right" data-testid={`order-amount-${order.id}`}>
              ₹{order.final_amount.toLocaleString()}
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
              data-testid={`order-status-${order.id}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          {open
            ? <ChevronUp className="h-4 w-4 text-slate-300 flex-shrink-0" />
            : <ChevronDown className="h-4 w-4 text-slate-300 flex-shrink-0" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount Paid</p>
                  <p className="text-xs font-semibold text-slate-800">₹{order.final_amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Services</p>
                <div className="space-y-1">
                  {order.services.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-[#10b981] flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-700">{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
const Dashboard = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user }       = useAuthStore();
  const navigate              = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Status helpers (kept for original table on desktop) ─── */
  const getStatusIcon = (status) => {
    const cfg = getStatus(status);
    const Icon = cfg.icon;
    return <Icon className={`h-4 w-4 ${cfg.text}`} />;
  };

  const getStatusColor = (status) => {
    const cfg = getStatus(status);
    return `${cfg.bg} ${cfg.text} border ${cfg.border}`;
  };

  const totalOrders      = orders.length;
  const activeServices   = orders.filter(o => o.status === 'processing').length;
  const completedCount   = orders.filter(o => o.status === 'completed').length;

  const statCards = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: FileText,
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-100',
      testId: 'total-orders-card',
      countId: 'total-orders-count',
    },
    {
      label: 'Active Services',
      value: activeServices,
      icon: Clock,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      testId: 'active-services-card',
      countId: 'active-services-count',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle,
      iconColor: 'text-[#10b981]',
      iconBg: 'bg-[#10b981]/10',
      testId: 'completed-services-card',
      countId: 'completed-services-count',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@700;800&display=swap');
      `}</style>

      <Header />

      <div className="pt-[60px] max-w-5xl mx-auto px-4 py-6 sm:py-10">

        {/* ── Welcome header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Mobile: compact greeting bar */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
                data-testid="dashboard-title"
              >
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-sm text-slate-500 mt-1" data-testid="dashboard-subtitle">
                Manage your legal services and track applications
              </p>
            </div>
            {/* Avatar / User icon */}
            <div className="w-11 h-11 rounded-2xl bg-[#0B1120] flex items-center justify-center flex-shrink-0 shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 + i * 0.07 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6"
                data-testid={card.testId}
              >
                {/* Mobile: stack vertically */}
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
                </div>
                <p className="text-[11px] sm:text-sm text-slate-500 leading-tight mb-1">{card.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900" data-testid={card.countId}>
                  {card.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Orders section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg sm:text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
              data-testid="recent-orders-title"
            >
              Recent Orders
            </h2>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* ─ Loading ─ */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#10b981] rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading orders…</p>
            </div>
          )}

          {/* ─ Empty state ─ */}
          {!loading && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-base font-bold text-slate-700 mb-1" data-testid="no-orders-message">No orders yet</p>
              <p className="text-sm text-slate-400 mb-6 max-w-xs">
                Once you place your first order, all your legal services will appear here.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#0B1120] text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
              >
                Browse Services <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* ─ MOBILE: Accordion cards ─ */}
          {!loading && orders.length > 0 && (
            <>
              <div className="sm:hidden space-y-3">
                {orders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </div>

              {/* ─ DESKTOP: Table ─ */}
              <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Table top accent */}
                <div className="h-1 bg-gradient-to-r from-[#0B1120] via-[#10b981] to-[#0ea570]" />
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Services</th>
                        <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="hover:bg-slate-50/70 transition-colors group"
                          data-testid={`order-row-${order.id}`}
                        >
                          <td className="py-4 px-5">
                            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1" data-testid={`order-id-${order.id}`}>
                              #{order.id.substring(0, 8)}…
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="text-sm font-medium text-slate-800 max-w-[220px] truncate">
                              {order.services.map(s => s.name).join(', ')}
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sm font-bold text-slate-900" data-testid={`order-amount-${order.id}`}>
                              ₹{order.final_amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                              data-testid={`order-status-${order.id}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sm text-slate-500">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Bottom trust strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8 pb-4"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          <span className="text-xs text-slate-400 font-medium">All data secured with 256-bit SSL · Razorpay PCI DSS Compliant</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;