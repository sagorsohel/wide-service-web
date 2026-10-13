"use client";

import React from "react";
import { MapPin, Search, PhoneCall, CheckCircle2, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: <MapPin className="w-7 h-7 text-amber-500" />,
      title: "Select Your Location",
      description:
        "Allow browser GPS auto-detection or choose your city/area (e.g. Shaheb Bazar, Dhanmondi, Mirpur) to find technicians closest to your doorstep.",
    },
    {
      number: "02",
      icon: <Search className="w-7 h-7 text-amber-500" />,
      title: "Browse & Compare Experts",
      description:
        "Filter by 36+ categories, sub-services, and live distance (⚡ Closest First). Review transparent prices, photos, and ratings.",
    },
    {
      number: "03",
      icon: <PhoneCall className="w-7 h-7 text-amber-500" />,
      title: "1-Tap Direct Call or Chat",
      description:
        "Connect directly with the technician via phone or WhatsApp. No hidden middleman commissions or lengthy wait times.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Effortless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How Wide Service Works
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
            Get your home or office repairs sorted in under 30 minutes with our seamless workflow.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              {/* Step Number Watermark */}
              <div className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute top-5 right-6 select-none pointer-events-none">
                {step.number}
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
