import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <img
              src="https://customer-assets.emergentagent.com/job_0fe702b8-845f-4f93-ab40-25c4fa620ca6/artifacts/3rlmmodw_logo-3.png"
              alt="WebDesert Legal Services"
              className="h-9 mb-4 brightness-0 invert"
            />
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Professional trademark and legal compliance services for Indian businesses. Government-registered filing experts.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span>Secured by Razorpay</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wide">Navigate</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#services" className="text-slate-400 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#why-trademark" className="text-slate-400 hover:text-white transition-colors">Why Trademark</a>
              </li>
              <li>
                <a href="https://webdesert.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">About WebDesert</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wide">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">Trademark Registration</li>
              <li className="text-slate-400">GST Registration</li>
              <li className="text-slate-400">Company Registration</li>
              <li className="text-slate-400">Legal Compliance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/+916291841805"
                  className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                  <span>+91 62918 41805</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@webdesert.in"
                  className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors break-all"
                >
                  <Mail className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                  <span>contact@webdesert.in</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} WebDesert. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs text-center sm:text-right">
            Trademark Registration starting ₹1,299 + Govt Fee
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;