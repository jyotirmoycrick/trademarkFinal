import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import {
  ShieldCheck, Lock, Award, AlertTriangle, TrendingUp, FileCheck,
  FileText, Search, Send, CheckCircle, ArrowRight, Phone,
  ShoppingCart, Star, Zap, BadgeCheck, Building2, Globe, CreditCard, Shield,
  Mail, MapPin
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getServicePrice = (serviceName = '') => {
  const name = serviceName.toLowerCase();
  if (name.includes('company')) return '₹1,999';
  if (name.includes('gst')) return '₹1,599';
  return '₹1,299';
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] } })
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.08 } })
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } })
};

const Section = ({ children, className = '', id }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id={id} ref={ref} className={className}>
      {children(inView)}
    </section>
  );
};

const useCountUp = (target, duration, start) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let c = 0;
    const steps = 60;
    const step = target / steps;
    const iv = setInterval(() => {
      c += step;
      if (c >= target) { setCount(target); clearInterval(iv); }
      else setCount(Math.floor(c));
    }, duration / steps);
    return () => clearInterval(iv);
  }, [target, duration, start]);
  return count;
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [statsStarted, setStatsStarted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const itemCount = useCartStore(s => s.getItemCount());

  const b = useCountUp(1000, 2200, statsStarted);
  const a = useCountUp(5000, 2200, statsStarted);
  const r = useCountUp(99, 2200, statsStarted);

  useEffect(() => {
    axios.get(`${API}/services`)
      .then(r => setServices(r.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setServicesLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const heroObs = new IntersectionObserver(([e]) => setShowStickyBar(!e.isIntersecting), { threshold: 0.1 });
    if (heroRef.current) heroObs.observe(heroRef.current);
    return () => heroObs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const handleBuyNow = (s) => { addItem(s); navigate('/checkout'); };
  const handleAddToCart = (s) => { addItem(s); toast.success(`${s.name} added to cart!`); };
  const wa = `https://wa.me/+916291841805?text=${encodeURIComponent('Hi, I want to register my trademark')}`;

  const whyReasons = [
    { icon: AlertTriangle, title: 'First Come, First Served', desc: 'Rights go to the FIRST applicant — not the first user. One day of delay could cost you your own brand name permanently.' },
    { icon: ShieldCheck, title: 'Stop Brand Theft', desc: 'Legal authority to stop anyone copying your name, logo, or identity. Take action — with the law on your side.' },
    { icon: Lock, title: 'Exclusive Nationwide Rights', desc: 'Only you can use your trademark in your category across all of India — enforced by law from day one of filing.' },
    { icon: Award, title: 'Build Brand Value', desc: 'A trademark is a business asset. It boosts valuation, signals credibility, and makes your brand licensable or sellable.' },
    { icon: TrendingUp, title: 'Display the ® Symbol', desc: 'Use ® legally once registered — a powerful trust signal that tells customers your brand is official and authentic.' },
    { icon: FileCheck, title: 'Official Proof of Ownership', desc: 'The certificate is your legal proof. Use it for enforcement, to franchise, or when closing a business deal.' },
  ];

  const steps = [
    { icon: FileText, title: 'Submit Details', desc: 'Fill in your brand name, category & contact. Done in under 5 minutes.', time: '5 min' },
    { icon: Search, title: 'Expert Review', desc: 'Our legal team checks availability and prepares your official documents.', time: '24 hrs' },
    { icon: Send, title: 'Government Filing', desc: 'We submit directly to the Trademark Registry. Official acknowledgment issued.', time: '1–2 days' },
    { icon: CheckCircle, title: 'Track & Confirm', desc: 'Monitor progress from your dashboard. We keep you updated at every stage.', time: 'Ongoing' },
  ];

  const trustBadges = [
    { icon: Building2, label: 'MCA Registered', sub: 'Ministry of Corporate Affairs' },
    { icon: Globe, label: 'ISO 9001:2015', sub: 'Quality Management Certified' },
    { icon: BadgeCheck, label: 'D-U-N-S Verified', sub: 'Dun & Bradstreet Listed' },
    { icon: CreditCard, label: 'Razorpay Secured', sub: 'PCI DSS Compliant Payments' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
        @keyframes marquee-x { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-run { display:flex; animation:marquee-x 36s linear infinite; white-space:nowrap; }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 70%{transform:scale(1.5);opacity:0} 100%{opacity:0} }
        .pulse-ring::before { content:''; position:absolute; inset:-4px; border-radius:50%; border:2px solid currentColor; animation:pulse-ring 1.8s ease-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-anim { animation:float 3.5s ease-in-out infinite; }
        .card-hover { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease; }
        .card-hover:hover { transform:translateY(-4px); }
        .section-dot::before { content:''; display:inline-block; width:6px; height:6px; border-radius:50%; background:currentColor; margin-right:8px; vertical-align:middle; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:#f1f5f9; } ::-webkit-scrollbar-thumb { background:#0B1120; border-radius:3px; }
      `}</style>

      {/* ── HEADER (fixed, 60px tall) ── */}
      <Header />

      {/* ── STICKY MOBILE BUY BAR ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl px-4 py-3 flex items-center gap-3 md:hidden"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-400 font-medium">Trademark Registration</div>
              <div className="text-base font-bold text-slate-900">₹1,299 <span className="text-xs font-normal text-slate-400">+ Govt Fee</span></div>
            </div>
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl flex-shrink-0">
              <Phone className="h-3.5 w-3.5" /> Ask
            </a>
            <button onClick={() => scrollTo('services')}
              className="flex items-center gap-1.5 bg-accent text-white text-sm font-bold px-5 py-2.5 rounded-xl flex-shrink-0 shadow-sm">
              Register Now <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ANNOUNCEMENT BAR ── */}
      {/* Offset pt-[60px] for fixed header */}
      <div className="pt-[60px]">
        <div className="bg-[#0B1120] text-white h-9 overflow-hidden flex items-center">
          <div className="overflow-hidden w-full">
            <div className="marquee-run">
              {[1, 2].map(i => (
                <span key={i} className="flex-shrink-0 text-[11.5px] font-medium tracking-wide px-8 text-slate-400">
                  <span className="text-[#10b981] font-bold">Limited Slots</span> &nbsp;·&nbsp;
                  Trademark Registration ₹1,299 + Govt Fee &nbsp;·&nbsp;
                  Secure Your Brand Before Someone Else Does &nbsp;·&nbsp;
                  1,000+ Brands Protected &nbsp;·&nbsp;
                  MCA Registered &nbsp;·&nbsp; ISO 9001:2015 &nbsp;·&nbsp; D-U-N-S Verified &nbsp;·&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="bg-white pt-10 pb-0" ref={heroRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <div className="inline-flex items-center border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-full mb-5">
                  <span className="relative w-2 h-2 mr-2 flex-shrink-0 pulse-ring text-accent">
                    <span className="w-2 h-2 bg-accent rounded-full block"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Trusted by 1,000+ Indian Businesses</span>
                </div>
              </motion.div>

              <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5">
                Register Your Trademark &<br className="hidden sm:block" />{' '}
                <span className="text-accent">Protect Your Brand</span>
              </motion.h1>

              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-slate-500 text-base sm:text-lg mb-7 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Expert legal filing for Indian businesses. Your brand name, logo, and identity — secured permanently by law before someone else claims it.
              </motion.p>

              {/* Price card */}
              <motion.div initial="hidden" animate="visible" variants={scaleIn} custom={3}
                className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900 rounded-2xl px-6 py-5 mb-8 w-full sm:w-auto">
                <div className="text-center sm:text-left">
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="text-4xl font-bold text-white">₹1,299</span>
                    <span className="text-sm text-slate-400">professional fee</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">+ Govt Fee as applicable</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-700" />
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider">What's Included</div>
                  <div className="text-xs text-slate-400 mt-0.5">Filing + Documents + Expert Support</div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-7">
                <button onClick={() => scrollTo('services')}
                  className="group flex items-center justify-center gap-2 bg-accent text-white font-bold px-8 rounded-2xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 text-sm sm:text-base"
                  style={{ height: '56px' }} data-testid="hero-primary-cta">
                  Register My Trademark
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => window.open('https://wa.me/+916291841805?text=Hi, I need expert consultation', '_blank')}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-800 font-bold px-8 rounded-2xl hover:border-accent hover:text-accent transition-all text-sm sm:text-base"
                  style={{ height: '56px' }} data-testid="hero-secondary-cta">
                  <Phone className="h-4 w-4" /> Talk to Expert
                </button>
              </motion.div>

              {/* Trust pills */}
              <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={5}
                className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['Government Filing', '24hr Processing', '99% Success Rate', 'WhatsApp Support'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                    <CheckCircle className="h-3 w-3 text-accent" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right image */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end flex-shrink-0">
              <div className="relative w-full max-w-[300px] sm:max-w-[360px] float-anim">
                <img
                  src="https://images.unsplash.com/photo-1659355894406-977b8c4503d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGNvcnBvcmF0ZSUyMGZvcm1hbHxlbnwwfHx8fDE3NzE4NDY3OTd8MA&ixlib=rb-4.1.0&q=85"
                  alt="Professional Legal Services"
                  className="w-full rounded-3xl shadow-2xl"
                  style={{ height: '340px', objectFit: 'cover', objectPosition: 'top' }}
                />
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute -bottom-5 -left-5 bg-white border border-slate-100 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Applications Filed</div>
                    <div className="text-2xl font-bold text-slate-900">5,000+</div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.4 }}
                  className="absolute -top-4 -right-4 bg-accent text-white rounded-2xl shadow-lg px-4 py-2.5 text-center">
                  <div className="text-xs font-bold uppercase tracking-wider">Success</div>
                  <div className="text-2xl font-bold">99%</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Urgency banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}
            className="border-l-4 border-red-500 bg-red-50 rounded-r-xl px-5 py-4 mt-14 max-w-4xl mx-auto flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-semibold">
              Trademark rights are granted to the <span className="underline">first applicant</span>, not the first user. Delaying your application can permanently cost you ownership of your own brand name.
            </p>
          </motion.div>
        </div>

        {/* Feature strip */}
        <div className="bg-slate-900 mt-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {[
                ['Expert Filing', 'Handled end-to-end'],
                ['Live Tracking', 'Application status'],
                ['Legal Docs', 'Prepared for you'],
                ['WhatsApp Help', 'Always available'],
              ].map(([l, s], i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="py-5 px-4 sm:px-6 text-center">
                  <div className="text-white font-bold text-sm">{l}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <Section className="py-12 bg-white" id="trust">
        {(inView) => (
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}
              className="text-center mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified & Trusted</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trustBadges.map((badge, i) => (
                <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} custom={i}
                  className="card-hover bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                    <badge.icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{badge.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{badge.sub}</div>
                  </div>
                  <div className="flex items-center gap-1 mt-auto">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent">Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Razorpay payment strip */}
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={4}
              className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Powered by Razorpay</div>
                  <div className="text-xs text-slate-400">India's most trusted payment gateway — PCI DSS Level 1 Compliant</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                {['UPI', 'Visa', 'Mastercard', 'Net Banking', 'EMI'].map(m => (
                  <span key={m} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg px-3 py-1.5">{m}</span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </Section>

      {/* ── STATS ── */}
      <section className="py-14 sm:py-20 bg-slate-900" ref={statsRef}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { val: `${b.toLocaleString()}+`, label: 'Businesses Served', sub: 'Across India', idx: 0 },
              { val: `${a.toLocaleString()}+`, label: 'Applications Filed', sub: 'With govt authorities', idx: 1 },
              { val: `${r}%`, label: 'Success Rate', sub: 'Approved applications', idx: 2 },
            ].map(({ val, label, sub, idx }) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={statsStarted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="text-center py-8 px-4 sm:px-8 border border-white/10 rounded-2xl" data-testid={`stat-${idx}`}>
                <div className="text-3xl sm:text-5xl font-bold text-white mb-1.5" data-testid={`stat-value-${idx}`}>{val}</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300 mb-1" data-testid={`stat-label-${idx}`}>{label}</div>
                <div className="text-xs text-slate-600 hidden sm:block">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRADEMARK ── */}
      <Section className="py-14 sm:py-20 bg-white" id="why-trademark">
        {(inView) => (
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block section-dot">Why It Matters</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why Trademark is Non-Negotiable</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">Without a trademark, your brand has zero legal protection. With one, you own it — backed by law.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {whyReasons.map((reason, i) => (
                <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i * 0.5 + 1}
                  className="card-hover group bg-slate-50 border border-slate-100 rounded-3xl p-7 hover:bg-white hover:border-accent/30 hover:shadow-xl transition-all"
                  data-testid={`why-trademark-${i}`}>
                  <div className="bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:border-accent transition-all shadow-sm"
                    style={{ width: '52px', height: '52px' }}>
                    <reason.icon className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2.5">{reason.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{reason.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={4}
              className="mt-12 bg-slate-900 rounded-3xl p-8 sm:p-10 text-center">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Your brand is your most valuable business asset.</h3>
              <p className="text-slate-400 text-sm mb-6">Don't leave it unprotected. Filing takes less than 5 minutes.</p>
              <button onClick={() => scrollTo('services')}
                className="group inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 h-12 px-8 rounded-xl font-bold transition-all text-sm shadow-lg shadow-accent/20">
                Start Registration — ₹1,299 + Govt Fee <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        )}
      </Section>

      {/* ── SERVICES ── */}
      <Section className="py-14 sm:py-20 bg-slate-50" id="services">
        {(inView) => (
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block section-dot">Our Services</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4" data-testid="services-title">Choose Your Legal Service</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">Transparent pricing. Expert execution. No hidden charges — ever.</p>
            </motion.div>

            {servicesLoading ? (
              <div className="flex flex-col items-center gap-3 py-16">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Loading services...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {services.map((service, idx) => {
                  const price = getServicePrice(service.name);
                  return (
                    <motion.div key={service.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} custom={idx}
                      className={`card-hover relative bg-white rounded-3xl overflow-hidden flex flex-col
                        ${idx === 0 ? 'border-2 border-accent shadow-2xl shadow-accent/10 lg:scale-105' : 'border border-slate-200 hover:border-slate-300 hover:shadow-xl'}`}
                      data-testid={`service-card-${service.id}`}>

                      {idx === 0 && (
                        <div className="bg-accent px-4 py-2.5 flex items-center justify-center gap-2">
                          <Star className="h-3.5 w-3.5 text-white fill-white" />
                          <span className="text-white text-xs font-bold uppercase tracking-widest">Most Popular</span>
                          <Star className="h-3.5 w-3.5 text-white fill-white" />
                        </div>
                      )}

                      <div className="p-7 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2" data-testid={`service-name-${service.id}`}>{service.name}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6" data-testid={`service-description-${service.id}`}>{service.description}</p>

                        <div className={`rounded-2xl px-5 py-4 mb-6 ${idx === 0 ? 'border border-accent/20' : 'bg-slate-50 border border-slate-100'}`}
                          style={{ backgroundColor: idx === 0 ? 'rgba(16,185,129,.06)' : undefined }}>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-3xl font-bold text-slate-900" data-testid={`service-price-${service.id}`}>{price}</span>
                            <span className="text-sm text-slate-400">professional fee</span>
                          </div>
                          <p className="text-xs text-slate-400" data-testid={`service-govt-fee-${service.id}`}>+ Govt Fee as applicable</p>
                        </div>

                        <ul className="space-y-3 mb-7 flex-1">
                          {service.features.slice(0, 4).map((f, fi) => (
                            <li key={fi} className="flex items-start gap-3 text-sm" data-testid={`service-feature-${service.id}-${fi}`}>
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${idx === 0 ? 'bg-accent/15' : 'bg-slate-100'}`}>
                                <CheckCircle className={`h-3 w-3 ${idx === 0 ? 'text-accent' : 'text-slate-500'}`} />
                              </span>
                              <span className="text-slate-600">{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col gap-2.5 mt-auto">
                          <button onClick={() => handleBuyNow(service)}
                            className={`group w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all text-sm
                              ${idx === 0 ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            data-testid={`buy-now-${service.id}`}>
                            Register Now
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => handleAddToCart(service)}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 h-10 rounded-xl font-semibold transition-all text-sm"
                            data-testid={`add-to-cart-${service.id}`}>
                            <ShoppingCart className="h-4 w-4" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={5}
              className="mt-10 bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Shield className="h-4 w-4 text-accent" /> 100% Secure & Encrypted Payment
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'EMI'].map(m => (
                  <span key={m} className="bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg px-3 py-1.5">{m}</span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section className="py-14 sm:py-20 bg-white" id="how-it-works">
        {(inView) => (
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0} className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block section-dot">Simple Process</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4" data-testid="how-it-works-title">How It Works</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">We handle all the complexity. Just share your details — we take it from there.</p>
            </motion.div>

            {/* Desktop timeline */}
            <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-5xl mx-auto relative mb-14">
              <div className="absolute top-9 left-[14%] right-[14%] h-0.5 bg-slate-200">
                <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
                  className="h-full bg-accent origin-left" />
              </div>
              {steps.map((step, i) => (
                <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i * 0.7 + 1}
                  className="flex flex-col items-center text-center relative" data-testid={`step-${i}`}>
                  <div className="relative z-10 w-[72px] h-[72px] bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mb-5 shadow-md">
                    <step.icon className="h-7 w-7 text-accent" />
                    <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">{i + 1}</div>
                  </div>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">{step.time}</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden max-w-sm mx-auto mb-12">
              {steps.map((step, i) => (
                <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i * 0.5}
                  className="flex gap-4" data-testid={`step-mobile-${i}`}>
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <step.icon className="h-5 w-5 text-accent" />
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-2" />}
                  </div>
                  <div className="pb-7 flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{step.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={5} className="text-center">
              <button onClick={() => scrollTo('services')}
                className="group inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 font-bold px-10 rounded-2xl transition-colors shadow-xl text-sm"
                style={{ height: '56px' }}>
                Get Started Today <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-3 text-xs text-slate-400">No consultation fees. Pay only when ready to file.</p>
            </motion.div>
          </div>
        )}
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="py-16 sm:py-24 bg-accent">
        {(inView) => (
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 border border-white/30 rounded-full px-3 py-1 text-xs font-bold text-white/80 uppercase tracking-widest mb-6">
              <Zap className="h-3.5 w-3.5 text-white" /> Act Now — Limited Slots Today
            </motion.div>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Don't Risk Losing Your Brand Name
            </motion.h2>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}
              className="text-white/70 text-sm sm:text-base mb-2">
              Trademark rights go to whoever files first. Every day you wait is a risk you don't need to take.
            </motion.p>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={3}
              className="text-white font-bold text-lg mb-10">₹1,299 + Govt Fee · No Hidden Charges</motion.p>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={4}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo('services')}
                className="group flex items-center justify-center gap-2 bg-white text-accent hover:bg-white/90 font-bold px-8 rounded-2xl transition-all shadow-xl text-base"
                style={{ height: '56px' }} data-testid="final-cta-button">
                Register My Trademark Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href={wa} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/20 border border-white/30 text-white hover:bg-white/30 font-semibold px-8 rounded-2xl transition-all text-base"
                style={{ height: '56px' }}>
                <Phone className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </motion.div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={5}
              className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  <badge.icon className="h-3.5 w-3.5" /> {badge.label}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </Section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
            <div className="col-span-2 sm:col-span-1">
              <img
                src="https://customer-assets.emergentagent.com/job_0fe702b8-845f-4f93-ab40-25c4fa620ca6/artifacts/3rlmmodw_logo-3.png"
                alt="WebDesert" className="h-7 mb-4 brightness-0 invert" />
              <p className="text-slate-400 text-sm leading-relaxed mb-5">Professional trademark and legal compliance for Indian businesses.</p>
              <div className="flex flex-wrap gap-2">
                {['MCA', 'ISO 9001', 'D-U-N-S'].map(badge => (
                  <span key={badge} className="text-xs font-bold text-slate-400 border border-slate-700 rounded-lg px-2.5 py-1">{badge}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Navigate</h3>
              <ul className="space-y-3 text-sm">
                {[['Services', '/#services'], ['How It Works', '/#how-it-works'], ['About Us', 'https://webdesert.in']].map(([l, h]) => (
                  <li key={l}><a href={h} className="text-slate-400 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Services</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                {['Trademark Registration', 'GST Registration', 'Company Registration'].map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://wa.me/+916291841805" className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors">
                    <Phone className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" /> +91 62918 41805
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@webdesert.in" className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors break-all">
                    <Mail className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" /> contact@webdesert.in
                  </a>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" /> India
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 py-5 flex flex-col sm:flex-row justify-between gap-2 items-center">
            <p className="text-slate-500 text-xs">© {new Date().getFullYear()} WebDesert. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-3.5 w-3.5 text-accent" /> Secured by Razorpay · PCI DSS Compliant
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom padding for sticky bar */}
      <div className="md:hidden h-20" />
    </div>
  );
};

export default Home;