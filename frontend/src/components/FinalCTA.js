import React from 'react';
import { ArrowRight, Shield, Phone } from 'lucide-react';

const FinalCTA = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/+916291841805?text=Hi, I want to register my trademark', '_blank');
  };

  return (
    <section className="py-14 sm:py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">

        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-slate-600 rounded-full px-3 py-1 mb-6">
            <Shield className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Act Now</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Don't Risk Losing Your Brand Name
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-3">
            Trademark rights go to whoever files first — not whoever used it first. Every day you wait is a risk you don't need to take.
          </p>
          <p className="text-accent font-semibold text-sm sm:text-base mb-8">
            Starting at ₹1,299 + Govt Fee. No consultation fees. No hidden charges.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToServices}
              className="flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent/90 h-14 px-8 rounded-md font-bold transition-colors text-base shadow-sm"
              data-testid="final-cta-button"
            >
              Register My Trademark Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 h-14 px-8 rounded-md font-semibold transition-colors text-base"
            >
              <Phone className="h-5 w-5" />
              Chat on WhatsApp
            </button>
          </div>

          {/* Trust footnote */}
          <p className="mt-6 text-xs text-slate-400">
            Secure payment via Razorpay. Processing begins within 24 hours of order confirmation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;