"use client";

import React from "react";
import { Star, Check } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: "Farhana Akter",
      location: "Dhaka, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
      rating: 5,
      quote:
        '"Great service! The AC technician was on time, professional and fixed the problem quickly. Highly recommended!"',
    },
    {
      name: "Rahim Uddin",
      location: "Dhaka, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
      rating: 5,
      quote:
        '"Very good experience. The plumber was skilled and finished the work neatly. Will definitely use again."',
    },
    {
      name: "Nusrat Jahan",
      location: "Dhaka, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
      rating: 5,
      quote:
        '"Easy to book, fast response and reasonable price. Really happy with the service!"',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#f8fafc] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            {/* Pill Badge matching Image 1 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-slate-800 text-xs font-semibold mb-3">
              <span className="text-[#d49b1a] text-xs">⚡</span>
              <span>What Our Customers Say</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Real Stories, Real Satisfaction
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-slate-500 mt-2 font-normal">
              Trusted by homeowners across Dhaka for reliable and professional services.
            </p>
          </div>

          {/* Right Link */}
          <a
            href="#services"
            className="text-xs sm:text-sm font-bold text-[#d49b1a] hover:text-[#b88514] inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>View All Reviews</span>
            <span>→</span>
          </a>
        </div>

        {/* 3 Review Cards Grid matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6.5">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex items-start gap-4 sm:gap-5"
            >
              {/* Left: Avatar with blue verified check badge */}
              <div className="relative shrink-0">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Blue verified badge with white check */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#1877f2] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              {/* Right: Stars, Quote, Name, Location */}
              <div className="flex-1 flex flex-col justify-between min-h-[140px]">
                <div>
                  {/* 5 Golden Stars */}
                  <div className="flex items-center gap-0.5 text-[#f59e0b] mb-2.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mb-4">
                    {rev.quote}
                  </p>
                </div>

                {/* Author & Location */}
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0f172a] leading-tight">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {rev.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

