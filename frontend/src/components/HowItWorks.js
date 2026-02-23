import React from 'react';
import { FileText, Search, Send, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Submit Your Details',
    description: 'Fill out our simple form with your business information',
  },
  {
    icon: Search,
    title: 'Expert Document Review',
    description: 'Our legal experts review and prepare your documents',
  },
  {
    icon: Send,
    title: 'Government Filing Submission',
    description: 'We file your application with the relevant authorities',
  },
  {
    icon: CheckCircle,
    title: 'Application Acknowledgement',
    description: 'Receive confirmation and track your application status',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3" data-testid="how-it-works-title">
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Simple 4-step process to get your legal compliance done
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-6 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4" data-testid={`step-mobile-${index}`}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <step.icon className="h-6 w-6 text-accent" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
