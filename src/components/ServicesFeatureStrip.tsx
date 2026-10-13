"use client";

import React from "react";
import { Compass, PhoneCall, ShieldCheck, Lock } from "lucide-react";

export const ServicesFeatureStrip: React.FC = () => {
  const features = [
    {
      title: "Hyper-Local Matching",
      desc: "Closest technician first",
      icon: <Compass className="w-5 h-5 text-[#059669]" />,
      bg: "bg-emerald-50",
    },
    {
      title: "1-Tap Contact",
      desc: "Call or WhatsApp directly",
      icon: <PhoneCall className="w-5 h-5 text-[#059669]" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Verified Professionals",
      desc: "Trusted & experienced",
      icon: <ShieldCheck className="w-5 h-5 text-[#059669]" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Secure Payments",
      desc: "Safe & reliable",
      icon: <Lock className="w-5 h-5 text-[#059669]" />,
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="bg-white border-b border-slate-100 py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className={`flex items-center gap-3 ${
                idx > 0 ? "pt-2 sm:pt-0 sm:pl-4" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${feat.bg} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                {feat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0f172a] leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
