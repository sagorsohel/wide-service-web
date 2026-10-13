"use client";

import React from "react";
import {
  Zap,
  MapPin,
  ShieldCheck,
  Tag,
  Headphones,
  CheckCircle2,
} from "lucide-react";

export const WhyChooseUsSection: React.FC = () => {
  const cards = [
    {
      title: "Vetted Professionals",
      desc: "Background checked & verified",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#d49b1a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Transparent Pricing",
      desc: "No hidden charges",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#d49b1a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 14v1" />
          <path d="M9 19v2" />
          <path d="M9 3v2" />
          <path d="M9 9h6" />
          <path d="M15 15h.01" />
        </svg>
      ),
    },
    {
      title: "24/7 Support",
      desc: "We're always here to help",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#d49b1a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      ),
    },
    {
      title: "Wide Service Coverage",
      desc: "All over Dhaka & nearby areas",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#d49b1a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#f9fafb] border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & 4 Cards (7.5 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Pill Badge matching Image 2 */}
           

            {/* Stylized Heading matching Image 2 */}
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
              Fast Services, Trusted Care
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-slate-500 max-w-2xl leading-relaxed font-normal">
              We are committed to providing the best service experience with quality, safety and convenience.
            </p>

            {/* 4 Feature Cards Row matching Image 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-2">
              {cards.map((card, idx) => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl sm:rounded-[22px] border border-slate-100 p-4 sm:p-4.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  style={{
                    borderTopRightRadius: "30px",
                  }}
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center mb-3 shrink-0">
                    {card.icon}
                  </div>

                  <div>
                    {/* Title */}
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#0f172a] mb-1 leading-snug tracking-tight">
                      {card.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AC Technician Image & Floating Badge (4.5 cols) */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* Technician Image */}
              <div className="rounded-[30px] overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ac_service_tech.jpg"
                  alt="Verified Technician Servicing AC"
                  className="w-full h-auto object-cover aspect-[4/3.2]"
                />
              </div>

              {/* Floating Verified Badge matching Image 2 */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-white rounded-2xl shadow-lg border border-slate-100 p-3 flex items-center gap-2.5 z-20">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] leading-tight">
                    Verified Technician
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight">
                    Background checked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
