import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, LogOut, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const lastScrollY = useRef(0);

  const itemCount = useCartStore(state => state.getItemCount());
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (currentY < 80) {
        setIsVisible(true);
      } else if (diff > 8) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
      } else if (diff < -8) {
        setIsVisible(true);
      }
      setIsScrolled(currentY > 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const whatsappUrl = `https://wa.me/+916291841805?text=${encodeURIComponent('Hi, I need assistance with legal services from WebDesert')}`;

  return (
    <motion.header
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-white/97 backdrop-blur-md"
      style={{
        boxShadow: isScrolled
          ? '0 1px 0 rgba(0,0,0,0.06), 0 8px 24px -4px rgba(0,0,0,0.07)'
          : '0 1px 0 rgba(0,0,0,0.08)',
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo — left-padded, routes to home */}
          <Link to="/" className="flex items-center flex-shrink-0 pl-1" data-testid="logo-link">
            <img
              src="https://customer-assets.emergentagent.com/job_0fe702b8-845f-4f93-ab40-25c4fa620ca6/artifacts/3rlmmodw_logo-3.png"
              alt="WebDesert"
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {[['Home', '/'], ['Services', '/#services'], ['How It Works', '/#how-it-works']].map(([label, href]) =>
              href === '/' ? (
                <Link key={label} to={href}
                  className="px-4 py-2 text-[13.5px] font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all">
                  {label}
                </Link>
              ) : (
                <a key={label} href={href}
                  className="px-4 py-2 text-[13.5px] font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all">
                  {label}
                </a>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5d] transition-colors text-[13px] font-semibold shadow-sm"
              data-testid="whatsapp-button"
            >
              <Phone className="h-3.5 w-3.5" />
              WhatsApp
            </a>

            <Link to="/cart"
              className="relative flex items-center justify-center w-9 h-9 hover:bg-slate-100 rounded-lg transition-colors"
              data-testid="cart-button"
            >
              <ShoppingCart className="h-[18px] w-[18px] text-slate-600" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#10b981] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" data-testid="cart-count">
                  {itemCount}
                </span>
              )}
            </Link>

            {token && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2.5 h-9 hover:bg-slate-100 rounded-lg transition-colors"
                  data-testid="profile-button"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold leading-none">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl overflow-hidden"
                      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)' }}
                      data-testid="profile-dropdown"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        data-testid="dashboard-link">
                        Dashboard
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-slate-100"
                        data-testid="logout-button">
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className="hidden sm:flex items-center h-9 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors text-[13px] font-semibold"
                data-testid="login-button"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 hover:bg-slate-100 rounded-lg transition-colors"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-slate-100"
              data-testid="mobile-menu"
            >
              <div className="py-2 pb-4 space-y-0.5">
                {[['Home', '/'], ['Services', '/#services'], ['How It Works', '/#how-it-works']].map(([label, href]) =>
                  href === '/' ? (
                    <Link key={label} to={href} onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 px-3 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 rounded-lg">{label}</Link>
                  ) : (
                    <a key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 px-3 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 rounded-lg">{label}</a>
                  )
                )}
                {!token && (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 text-sm font-bold text-white bg-slate-900 rounded-lg text-center mt-2">Sign In</Link>
                )}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2.5 px-3 text-sm font-medium text-[#25D366] hover:bg-slate-50 rounded-lg">
                  <Phone className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;