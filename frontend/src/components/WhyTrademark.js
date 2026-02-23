import React from 'react';
import { ShieldCheck, Lock, Award, AlertTriangle, TrendingUp, FileCheck } from 'lucide-react';

const WhyTrademark = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: 'Stop Brand Theft',
      description: 'Prevent competitors from copying your brand name or logo. A registered trademark gives you the legal power to take action against infringers.'
    },
    {
      icon: Lock,
      title: 'Exclusive Legal Ownership',
      description: 'You get exclusive rights to use your brand across India. No one else can legally use the same or similar mark in your business category.'
    },
    {
      icon: Award,
      title: 'Build Brand Value',
      description: 'A registered trademark is an asset. It increases your business valuation and builds consumer trust and credibility in your market.'
    },
    {
      icon: AlertTriangle,
      title: 'First Come, First Served',
      description: 'Trademark rights go to the first applicant — not the first user. Delay by even a day can mean losing your brand name permanently.'
    },
    {
      icon: TrendingUp,
      title: 'Use the TM Symbol',
      description: 'Once registered, you can legally use the ® symbol with your brand, signalling authority, authenticity, and professionalism to customers.'
    },
    {
      icon: FileCheck,
      title: 'Legal Proof of Ownership',
      description: 'A trademark certificate is your official proof. Use it to take legal action, license your brand, or sell/franchise your business.'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white" id="why-trademark">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block border border-slate-200 rounded-full px-3 py-1 mb-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Why It Matters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Why Trademark Registration is Critical for Your Business
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Without a trademark, anyone can use your brand name. With one, only you can — backed by law.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-100 p-5 sm:p-6 rounded-xl hover:border-accent hover:bg-white transition-all duration-200 group"
              data-testid={`why-trademark-${index}`}
            >
              <div className="w-11 h-11 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                <reason.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-10 bg-primary rounded-xl p-6 sm:p-8 max-w-5xl mx-auto text-center">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
            Your brand is your identity. Don't leave it unprotected.
          </h3>
          <p className="text-slate-300 text-sm mb-5">
            Filing takes minutes. Protection lasts 10 years, renewable forever.
          </p>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center bg-accent text-white hover:bg-accent/90 h-11 px-8 rounded-md font-semibold transition-colors text-sm"
          >
            Start Registration — ₹1,299 + Govt Fee
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyTrademark;