"use client";

import React from "react";
import { ServiceCategoryMeta } from "../data/servicesData";
import { ShieldCheck, Clock, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategoryHeroProps {
  category: ServiceCategoryMeta;
}

export const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  return (
    <section className="bg-[#0b1a30] text-white pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-slate-800 relative overflow-hidden">
      {/* City skyline background */}
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
        {/* Breadcrumbs matching right mockup */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-white font-bold">{category.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Category Icon, Heading, Subtitle & 3 Horizontal Badges (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Category Icon Badge */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${category.iconBg || "bg-amber-500"} p-2 text-white flex items-center justify-center shadow-lg border border-white/20 overflow-hidden shrink-0`}
              >
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xl">⚙️</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {category.heroTitle || category.name}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
              {category.heroSubtitle ||
                "Keep your home cool and comfortable with professional service from verified technicians near you."}
            </p>

            {/* 3 Horizontal Badges matching Right Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Badge 1: Verified */}
              <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#d49b1a] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Verified Technicians
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Background checked
                  </p>
                </div>
              </div>

              {/* Badge 2: Fast Service */}
              <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#d49b1a] flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Fast Service
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Same day available
                  </p>
                </div>
              </div>

              {/* Badge 3: Affordable Price */}
              <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#d49b1a] flex items-center justify-center shrink-0">
                  <Tag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Affordable Price
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Best rates in Dhaka
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AC Technician Image with Floating Tagline Badge (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Photo */}
              <div className="rounded-[28px] overflow-hidden shadow-2xl border-4 border-slate-700/60 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ac_service_tech.jpg"
                  alt={`${category.name} Technician`}
                  className="w-full h-auto object-cover aspect-[4/3.2]"
                />
              </div>

              {/* Floating Tagline Badge matching Right Mockup */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-full px-4 py-1.5 shadow-md flex items-center gap-1.5 z-20">
                <span className="text-xs">⚡</span>
                <span className="text-xs font-black tracking-tight">
                  {category.heroTagline || "Stay Cool, Stay Comfortable"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
