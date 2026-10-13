"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I book a service?",
      a: "Simply browse by category, compare verified technicians near your location, and tap 'Call' or 'WhatsApp' to connect directly without any middleman fees.",
    },
    {
      q: "Are the technicians verified?",
      a: "Yes! Every technician and service partner undergoes strict NID background verification, skill checks, and customer rating reviews before being approved.",
    },
    {
      q: "What payment methods do you accept?",
      a: "You can pay directly to your technician after work completion via Cash, bKash, Nagad, or bank transfer based on your preference.",
    },
    {
      q: "Can I change or cancel my booking?",
      a: "Yes, you can directly communicate with your assigned technician to reschedule the service time or cancel with zero cancellation fees.",
    },
    {
      q: "Do you provide a warranty?",
      a: "Yes! We provide a 7-day service warranty on major repairs (AC servicing, plumbing, and electrical work). If any issue reoccurs, it will be checked free of charge.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading & Subtitle (4.5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-slate-800 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d49b1a]" />
              <span>FAQ</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>

            <p className="text-sm sm:text-[15px] text-slate-500 leading-relaxed font-normal">
              Find answers to common questions about our services, booking process and more.
            </p>
          </div>

          {/* Right Column: 5 Accordion Items matching Image 3 (7.5 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 hover:text-[#d49b1a] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 text-base font-light shrink-0">
                      {isOpen ? <Minus className="w-4 h-4 text-[#d49b1a]" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3 font-normal animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
