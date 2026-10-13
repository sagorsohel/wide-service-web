"use client";

import React from "react";
import {
  ShieldCheck,
  Zap,
  MapPin,
  PhoneCall,
  Clock,
  Sparkles,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";

export const SystemFeatures: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-amber-500" />,
      title: "Hyper-Local GPS Radar",
      description:
        "Automatically calculates real-world distance between you and certified technicians using precision Haversine formula, showing closest experts first.",
      badge: "Smart Distance",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "100% Verified Technicians",
      description:
        "Every technician and workshop on Wide Service undergoes NID verification, background checks, and skill assessments before approval.",
      badge: "Verified Trust",
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-blue-500" />,
      title: "Direct Call & WhatsApp",
      description:
        "No hidden middleman markup or booking commissions. Contact service providers directly via phone or WhatsApp for transparent rates.",
      badge: "0% Extra Markup",
    },
    {
      icon: <BadgeCheck className="w-6 h-6 text-amber-500" />,
      title: "7-Day Service Warranty",
      description:
        "Enjoy peace of mind with our 7-day workmanship warranty. If the issue reoccurs, your assigned technician will fix it with genuine parts.",
      badge: "Guaranteed Work",
    },
    {
      icon: <Clock className="w-6 h-6 text-rose-500" />,
      title: "30-Minute Emergency Dispatch",
      description:
        "Facing a short-circuit, burst water pipe, or broken AC? Filter by 24/7 emergency technicians who arrive within 30 minutes.",
      badge: "Fast Dispatch",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: "Cross-Platform Ecosystem",
      description:
        "Experience the exact same rich features across Mobile App (React Native Expo), Web Portal (Next.js), and Admin Management.",
      badge: "Seamless Sync",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Why Choose Wide Service</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed for Speed, Safety & Reliability
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
            We bridge the gap between skilled local craftsmen and home owners with real-time
            distance tracking, verified credentials, and instant communication.
          </p>
        </div>

        {/* 3x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500/50 transition-all hover:shadow-lg group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
