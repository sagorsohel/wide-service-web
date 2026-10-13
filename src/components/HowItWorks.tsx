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

interface HowItWorksProps {
  id?: string;
  pill?: string;
  title?: string;
  subtitle?: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  id = "how-it-works",
  pill = "Simple Steps",
  title = "How It Works",
  subtitle = "Get your service done in just a few simple steps. Fast, easy and reliable.",
}) => {
  const steps = [
    {
      step: "1. Search Service",
      desc: "Find the service you need and set your location.",
      icon: <MapPin className="w-5 h-5 text-[#d49b1a]" />,
    },
    {
      step: "2. Choose Technician",
      desc: "Compare profiles, ratings and distance.",
      icon: <ClipboardList className="w-5 h-5 text-[#d49b1a]" />,
    },
    {
      step: "3. Contact Directly",
      desc: "Call or WhatsApp the technician instantly.",
      icon: <Phone className="w-5 h-5 text-[#d49b1a]" />,
    },
    {
      step: "4. Get It Done",
      desc: "Your service is on the way! Fast & hassle-free.",
      icon: <Check className="w-5 h-5 text-[#d49b1a] stroke-[3]" />,
    },
  ];

  const handleGetStarted = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={id} className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & Get Started CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Pill Badge matching Master Mockup */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-slate-800 text-xs font-semibold">
              <span className="text-[#d49b1a] text-xs">⚡</span>
              <span>{pill}</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
              {title}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-[15px] text-slate-500 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Get Started Button */}
            <div className="pt-2">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Step Cards matching Image 1 (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-[20px] border border-slate-100 p-5 sm:p-5.5 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left group"
                >
                  {/* Circular Golden Icon matching Image 1 */}
                  <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center mb-3.5 shrink-0 transition-transform group-hover:scale-105">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs">
                      {item.icon}
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="font-bold text-sm sm:text-[14px] text-[#0f172a] mb-1.5 tracking-tight">
                    {item.step}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
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
