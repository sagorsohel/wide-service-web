"use client";

import React from "react";
import { Zap } from "lucide-react";

export const StatsBannerSection: React.FC = () => {
  const stats = [
    {
      value: "1,800+",
      label: "Total Services",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Service ticket / clipboard outline matching Image 2 */}
          <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
          <path d="M9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
    {
      value: "5,200+",
      label: "Verified Technicians",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* User profile outline matching Image 2 */}
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      value: "48,000+",
      label: "Happy Customers",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Heart outline matching Image 2 */}
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      value: "96%",
      label: "Satisfaction Rate",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Check in circle outline matching Image 2 */}
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#0b1a30] text-white py-14 sm:py-16 border-b border-slate-800/80 relative overflow-hidden">
      {/* City skyline silhouette matching Image 2 background */}
      <div className="absolute inset-x-0 bottom-0 h-28 opacity-10 pointer-events-none select-none flex items-end">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0 120 L0 80 L30 80 L30 50 L50 50 L50 90 L80 90 L80 40 L110 40 L110 95 L140 95 L140 25 L170 25 L170 95 L220 95 L220 60 L250 60 L250 90 L300 90 L300 35 L330 35 L330 85 L380 85 L380 15 L410 15 L410 85 L460 85 L460 55 L500 55 L500 90 L560 90 L560 30 L590 30 L590 95 L640 95 L640 45 L680 45 L680 90 L730 90 L730 20 L760 20 L760 95 L820 95 L820 60 L860 60 L860 90 L910 90 L910 35 L940 35 L940 85 L1000 85 L1000 50 L1040 50 L1040 95 L1100 95 L1100 25 L1140 25 L1140 90 L1200 90 L1200 120 Z"
            fill="#60a5fa"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading & Description (4.5 cols) */}
          <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-transparent border border-[#eab308]/70 text-[#eab308] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308]" />
              <span>Wide Service</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              By the Numbers
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-sm mx-auto lg:mx-0">
              We are growing every day to serve more homes across Bangladesh.
            </p>
          </div>

          {/* Right Column: 4 Centered Stat Columns with Thin Dividers (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center text-center px-4 ${
                    idx > 0 ? "pt-4 sm:pt-0" : ""
                  }`}
                >
                  {/* Yellow outlined icon */}
                  <div className="mb-2.5 flex items-center justify-center">
                    {stat.icon}
                  </div>

                  {/* Stat Number */}
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

