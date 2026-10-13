"use client";

import React from "react";
import { Wrench, CheckCircle, ArrowRight, ShieldCheck, DollarSign, Users } from "lucide-react";

export const ProviderOnboarding: React.FC = () => {
  return (
    <section id="providers" className="py-20 relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 text-white">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/15 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Wrench className="w-3.5 h-3.5" />
              <span>For Technicians & Service Providers</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Grow Your Business with Wide Service
            </h2>
            <p className="text-base sm:text-lg text-amber-100 max-w-2xl leading-relaxed">
              Are you a certified technician, workshop owner, or home care professional?
              List your services, receive direct calls from nearby customers, and manage
              your jobs effortlessly through the Wide Service Creator Portal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-100">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span>Zero Middleman Deductions</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-amber-100">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span>Instant Call/WhatsApp Leads</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-amber-100">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span>Dedicated Creator Panel</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <a
              href="http://localhost:5173/creator-signup"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl transition-all active:scale-95 text-center"
            >
              <span>Register as a Service Provider</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all text-center"
            >
              <span>Existing Provider? Log In to Admin Panel</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
