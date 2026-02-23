import React from 'react';
import { Shield, Clock, CheckCircle, ArrowRight, Phone } from 'lucide-react';

const Hero = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTalkToExpert = () => {
    window.open('https://wa.me/+916291841805?text=Hi, I need expert consultation for legal services', '_blank');
  };

  const trustPoints = [
    { icon: Shield, text: 'Government Registered Filing' },
    { icon: Clock, text: 'Processing Starts in 24 Hours' },
    { icon: CheckCircle, text: '99% Application Success Rate' },
  ];

  return (
    <section className="bg-white pt-6 pb-0 sm:pt-10 sm:pb-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Mobile: Stack | Desktop: Side by Side */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 max-w-6xl mx-auto">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

            {/* Trust Badge */}
            <div className="inline-flex items-center border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 flex-shrink-0"></span>
              <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">Trusted by 1000+ Indian Businesses</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Protect Your Brand with{' '}
              <span className="text-accent">Trademark</span>{' '}
              Registration
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 mb-5 max-w-lg mx-auto lg:mx-0">
              Professional filing support by legal experts. Secure your brand name, logo, and identity before someone else claims it.
            </p>

            {/* Pricing Callout */}
            <div className="inline-flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">₹1,299</span>
                <span className="text-sm text-slate-500 font-medium">Professional Fee</span>
              </div>
              <span className="hidden sm:block text-slate-300">+</span>
              <span className="text-sm text-slate-600 font-medium">Govt Fee (as applicable)</span>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mb-7">
              {trustPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <point.icon className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>{point.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={scrollToServices}
                className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover h-13 sm:h-14 px-7 rounded-md font-semibold transition-colors text-sm sm:text-base shadow-sm"
                style={{ height: '52px' }}
                data-testid="hero-primary-cta"
              >
                Register My Trademark Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleTalkToExpert}
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-800 hover:border-accent h-13 sm:h-14 px-7 rounded-md font-semibold transition-colors text-sm sm:text-base"
                style={{ height: '52px' }}
                data-testid="hero-secondary-cta"
              >
                <Phone className="h-4 w-4" />
                Talk to an Expert
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px]">
              <img
                src="https://images.unsplash.com/photo-1659355894406-977b8c4503d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGNvcnBvcmF0ZSUyMGZvcm1hbHxlbnwwfHx8fDE3NzE4NDY3OTd8MA&ixlib=rb-4.1.0&q=85"
                alt="Professional Legal Services"
                className="w-full rounded-xl shadow-md"
                style={{ maxHeight: '300px', objectFit: 'cover', objectPosition: 'top' }}
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-slate-100 rounded-xl shadow-md px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Applications Filed</div>
                  <div className="text-lg font-bold text-slate-900">5,000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="border border-red-200 bg-red-50 rounded-lg p-3 mt-10 max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-red-700 font-semibold">
            Trademark rights are granted to the FIRST applicant. Delaying your application can cost you ownership of your own brand name.
          </p>
        </div>
      </div>

      {/* What You Get Strip */}
      <div className="bg-primary mt-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-700">
            {[
              { label: 'Filing by Experts', sub: 'Handled end-to-end' },
              { label: 'Application Status', sub: 'Live tracking' },
              { label: 'Legal Documents', sub: 'Prepared for you' },
              { label: 'WhatsApp Support', sub: 'Always available' },
            ].map((item, i) => (
              <div key={i} className="py-4 px-4 text-center">
                <div className="text-white font-semibold text-sm">{item.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;