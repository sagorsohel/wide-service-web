"use client";

import React from "react";
import {
  MapPin,
  ClipboardList,
  Phone,
  Check,
  ArrowRight,
  Wrench,
} from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "1. Search Service",
      desc: "Find the service you need and set your location.",
      icon: <MapPin className="w-5 h-5 text-white" />,
    },
    {
      step: "2. Choose Technician",
      desc: "Compare profiles, ratings and distance.",
      icon: <ClipboardList className="w-5 h-5 text-white" />,
    },
    {
      step: "3. Contact Directly",
      desc: "Call or WhatsApp the technician instantly.",
      icon: <Phone className="w-5 h-5 text-white" />,
    },
    {
      step: "4. Get It Done",
      desc: "Your service is on the way! Fast & hassle-free.",
      icon: <Check className="w-5 h-5 text-white stroke-[3]" />,
    },
  ];

  const handleGetStarted = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#f9fafb] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & Get Started CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-slate-800 text-xs font-semibold">
              <span className="text-[#d49b1a] text-xs">🔧</span>
              <span>Simple Steps</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
              How It Works
            </h2>

            {/* Description (2 lines matching screenshot) */}
            <p className="text-sm sm:text-[15px] text-slate-500 leading-relaxed font-normal">
              Get your service done in just a few simple steps.
              <br className="hidden sm:inline" />
              Fast, easy and reliable.
            </p>

            {/* Get Started Button */}
            <div className="pt-2">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Step Cards (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-[22px] border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left group"
                >
                  {/* Circular Golden Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#fef3c7] flex items-center justify-center mb-4 shrink-0 transition-transform group-hover:scale-105">
                    <div className="w-9 h-9 rounded-full bg-[#d49b1a] flex items-center justify-center shadow-xs">
                      {item.icon}
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="font-bold text-sm sm:text-[15px] text-[#0f172a] mb-2 tracking-tight">
                    {item.step}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
