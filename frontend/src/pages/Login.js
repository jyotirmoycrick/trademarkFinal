import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import {
  ArrowRight, ShieldCheck, Building2, Globe, BadgeCheck,
  CreditCard, Lock, CheckCircle, Eye, EyeOff
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const trustItems = [
  { icon: Building2, label: 'MCA Registered', sub: 'Ministry of Corporate Affairs' },
  { icon: Globe, label: 'ISO 9001:2015', sub: 'Quality Management Certified' },
  { icon: BadgeCheck, label: 'D-U-N-S Verified', sub: 'Dun & Bradstreet Listed' },
  { icon: CreditCard, label: 'Razorpay Secured', sub: 'PCI DSS Compliant Payments' },
];

const stats = [
  { val: '5,000+', label: 'Applications Filed' },
  { val: '1,000+', label: 'Brands Protected' },
  { val: '99%', label: 'Success Rate' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      const { access_token, user } = response.data;
      setAuth(access_token, user);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');
      `}</style>

      <Header />

      {/* Full-height split layout, offset for fixed header */}
      <div className="flex min-h-screen pt-[60px]">

        {/* ── LEFT PANEL — dark brand side ── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] flex-col bg-[#0B1120] relative overflow-hidden">
          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          {/* Glowing accent blob */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

          <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12">
            {/* Top section */}
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_0fe702b8-845f-4f93-ab40-25c4fa620ca6/artifacts/3rlmmodw_logo-3.png"
                alt="WebDesert" className="h-7 mb-12 brightness-0 invert opacity-90"
              />

              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] block flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-300 tracking-wide">India's Trusted Legal Partner</span>
                </div>
                <h2 className="text-3xl font-bold text-white leading-snug mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Protect Your Brand.<br />Secure Your Future.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Professional trademark & legal compliance services for Indian businesses — handled end-to-end.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-10">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/6 border border-white/8 rounded-xl px-4 py-4 text-center">
                    <div className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                    <div className="text-xs text-slate-500 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Verified & Certified</p>
                {trustItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-slate-500 truncate">{item.sub}</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-[#10b981] flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-2 mt-8">
              <ShieldCheck className="h-4 w-4 text-[#10b981]" />
              <span className="text-xs text-slate-500">256-bit SSL encrypted · Your data is safe</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — form side ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50/60">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[400px]"
          >
            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-700 mb-10 transition-colors group" data-testid="back-to-home">
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to home
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#0B1120] flex items-center justify-center mb-5">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-[28px] font-bold text-slate-900 mb-1.5 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }} data-testid="login-title">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500" data-testid="login-subtitle">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email address
                </label>
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/25 focus:border-[#10b981] transition-all shadow-sm"
                  placeholder="you@example.com"
                  data-testid="login-email-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password" name="password" type={showPassword ? 'text' : 'password'} required
                    value={formData.password} onChange={handleChange}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-11 text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/25 focus:border-[#10b981] transition-all shadow-sm"
                    placeholder="Enter your password"
                    data-testid="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0B1120] text-white text-[14px] font-semibold hover:bg-slate-800 transition-all shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                data-testid="login-submit-button"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">New to WebDesert?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <Link to="/register"
              className="flex items-center justify-center w-full h-12 rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              data-testid="register-link"
            >
              Create a free account
            </Link>

            {/* Mobile trust badges */}
            <div className="lg:hidden mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-center text-slate-400 font-semibold uppercase tracking-widest mb-4">Verified & Trusted</p>
              <div className="grid grid-cols-2 gap-2">
                {trustItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-3 py-2.5 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight truncate">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;