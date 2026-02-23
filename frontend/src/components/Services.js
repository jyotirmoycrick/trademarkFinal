import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import { ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ── Specific prices per service ID ──────────────────────────────────────────
const SERVICE_PRICING = {
  'trademark-registration': { price: 1299, label: 'Professional Fee' },
  'gst-registration':       { price: 1599, label: 'Professional Fee' },
  'company-registration':   { price: 1599, label: 'Professional Fee' },
};

// Fallback if a new service is added without a mapping
const getDisplayPrice = (service) => {
  return SERVICE_PRICING[service.id]?.price ?? service.price;
};

const getPriceLabel = (service) => {
  return SERVICE_PRICING[service.id]?.label ?? 'Professional Fee';
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (service) => {
    // Override price before adding to cart
    const pricedService = { ...service, price: getDisplayPrice(service) };
    addItem(pricedService);
    toast.success(`${service.name} added to cart!`);
  };

  const handleBuyNow = (service) => {
    const pricedService = { ...service, price: getDisplayPrice(service) };
    addItem(pricedService);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <section id="services" className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 text-sm">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-12 sm:py-16 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block border border-slate-200 bg-white rounded-full px-3 py-1 mb-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Our Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3" data-testid="services-title">
            Choose Your Legal Service
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Expert-managed compliance services for Indian businesses. Transparent pricing, no hidden fees.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`bg-white border rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg ${idx === 0 ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200 hover:border-slate-300'}`}
              data-testid={`service-card-${service.id}`}
            >
              {idx === 0 && (
                <div className="bg-accent text-white text-xs font-bold px-4 py-1.5 text-center tracking-wide uppercase">
                  Most Popular
                </div>
              )}

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Name */}
                <h3 className="text-lg font-bold text-slate-900 mb-2" data-testid={`service-name-${service.id}`}>
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 leading-relaxed" data-testid={`service-description-${service.id}`}>
                  {service.description}
                </p>

                {/* Pricing */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-slate-900" data-testid={`service-price-${service.id}`}>
                      ₹{getDisplayPrice(service).toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500">{getPriceLabel(service)}</span>
                  </div>
                  <div className="text-xs text-slate-500" data-testid={`service-govt-fee-${service.id}`}>
                    + Govt Fee (as applicable)
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-5 flex-1">
                  {service.features.slice(0, 4).map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-slate-700" data-testid={`service-feature-${service.id}-${fidx}`}>
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => handleBuyNow(service)}
                    className={`w-full flex items-center justify-center gap-2 h-12 rounded-md font-semibold transition-colors text-sm ${idx === 0 ? 'bg-accent text-white hover:bg-accent/90' : 'bg-primary text-white hover:bg-primary-hover'}`}
                    data-testid={`buy-now-${service.id}`}
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAddToCart(service)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 h-10 rounded-md font-medium transition-colors text-sm"
                    data-testid={`add-to-cart-${service.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 mb-4">Accepted Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-600">
            {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'EMI'].map((method) => (
              <span key={method} className="bg-white border border-slate-200 rounded-md px-3 py-1.5">
                {method}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">All payments secured by Razorpay. SSL encrypted.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;