"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  PhoneCall,
  QrCode,
  Smartphone,
  Star,
  Users,
  Clock,
} from "lucide-react";

interface HeroSectionProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
  onQuickSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
  onQuickSearch,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onQuickSearch(searchInput.trim());
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickPills = [
    { label: "AC Jet Wash", query: "AC" },
    { label: "Plumber", query: "Plumbing" },
    { label: "Electrician", query: "Electrical" },
    { label: "Deep Clean", query: "Cleaning" },
    { label: "Water Heater", query: "Solar" },
    { label: "CCTV", query: "CCTV" },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-white via-amber-500/5 to-slate-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-850">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill: Hyper-local GPS Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-amber-500/30 shadow-xs text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Serving your area:</span>
            <button
              onClick={onOpenLocationPicker}
              className="text-amber-700 dark:text-amber-400 underline font-black hover:opacity-80 transition-opacity cursor-pointer"
            >
              {userLocation.area}, {userLocation.city}
            </button>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            Find Verified Local Experts & Services Near You
          </h1>

          {/* Subtitle with Bengali context */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            আপনার নিকটস্থ বিশ্বস্ত টেকনিশিয়ান ও সার্ভিস এখন এক ক্লিকে। On-demand AC repair, plumbing,
            electrical fixes, and home maintenance with live distance calculation and zero hidden fees.
          </p>

          {/* Large Hero Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-3xl border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 flex items-center gap-2 transition-all focus-within:border-amber-500"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What service do you need? (e.g. AC service, pipe leak, wiring)..."
              className="flex-1 py-3 px-2 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="px-5 sm:px-7 py-3 rounded-2xl bg-[#e0b328] hover:bg-[#c49214] text-slate-950 font-black text-sm shrink-0 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-400">Trending:</span>
            {quickPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => {
                  setSearchInput(pill.query);
                  onQuickSearch(pill.query);
                  const el = document.getElementById("services");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/60 transition-colors font-medium cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#services"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span>Explore 1,800+ Services</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenDownload}
              className="px-6 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-300 font-extrabold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR / Get Mobile App</span>
            </button>
          </div>
        </div>

        {/* Live Ecosystem Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-black mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              1,800+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Verified Technicians
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-black mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              36+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Service Categories
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-black mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              30 Min
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Average Arrival
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 mx-auto flex items-center justify-center font-black mb-2">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Customer Satisfaction
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
