"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import { MapPin, LayoutGrid, Search, ChevronDown } from "lucide-react";
import { CATEGORIES_LIST } from "../data/servicesData";

interface AllServicesHeroProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPerformSearch: () => void;
}

export const AllServicesHero: React.FC<AllServicesHeroProps> = ({
  userLocation,
  onOpenLocationPicker,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onPerformSearch,
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const activeCategoryMeta = CATEGORIES_LIST.find(
    (c) => c.slug === selectedCategory
  ) || CATEGORIES_LIST[0];

  const handleSelect = (slug: string) => {
    onSelectCategory(slug);
    setCategoryDropdownOpen(false);
  };

  return (
    <section className="bg-[#0b1a30] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-800 relative overflow-hidden">
      {/* Decorative city skyline silhouette */}
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
          {/* Left Column: Heading, Subtitle & 3-Field Search Bar (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              All Services
            </h1>

            <p className="text-sm sm:text-base font-semibold text-slate-200">
              Find trusted local technicians for all your home and office needs.
            </p>

            <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed max-w-xl">
              From AC repair to cleaning, plumbing to electrical — get the best service near you with verified professionals.
            </p>

            {/* 3-Field Unified White Search Box matching Mockup */}
            <div className="pt-2">
              <div className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-slate-100">
                {/* Field 1: Location */}
                <button
                  type="button"
                  onClick={onOpenLocationPicker}
                  className="flex-1 flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 rounded-full transition-colors cursor-pointer group"
                >
                  <MapPin className="w-4 h-4 text-[#d49b1a] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Your location
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate">
                      {userLocation.address || userLocation.city || "Dhaka, Bangladesh"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:text-slate-600 shrink-0" />
                </button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-slate-200" />

                {/* Field 2: Category Selector */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 rounded-full transition-colors cursor-pointer group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#d49b1a] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Category
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate">
                        {activeCategoryMeta.name}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:text-slate-600 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-slate-900">
                      {CATEGORIES_LIST.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => handleSelect(cat.slug)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            selectedCategory === cat.slug
                              ? "bg-amber-50 text-[#d49b1a]"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {cat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-slate-200" />

                {/* Field 3: Search Input */}
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onPerformSearch()}
                    placeholder="Search services..."
                    className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={onPerformSearch}
                  className="px-6 py-3 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Technician Image with "Your Local Service Partner" Badge (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Photo */}
              <div className="rounded-[28px] overflow-hidden shadow-2xl border-4 border-slate-700/60 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero_technician.jpg"
                  alt="Wide Service Local Technician"
                  className="w-full h-auto object-cover aspect-[4/3.2]"
                />
              </div>

              {/* Floating "Your Local Service Partner" Badge matching Mockup */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-full px-4 py-1.5 shadow-md flex items-center gap-1.5 z-20">
                <span className="text-xs">⚡</span>
                <span className="text-xs font-black tracking-tight">Your Local Service Partner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
