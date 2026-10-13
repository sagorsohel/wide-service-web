"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import {
  Wrench,
  MapPin,
  Search,
  Crosshair,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  CheckCircle2,
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
  const [selectedServiceType, setSelectedServiceType] = useState("AC Repair");

  const handleFindService = (e: React.FormEvent) => {
    e.preventDefault();
    const slugMap: Record<string, string> = {
      "AC Repair": "ac-repair",
      "Plumbing": "plumbing",
      "Electrical": "electrical",
      "Cleaning": "cleaning",
      "Carpentry": "carpentry",
      "CCTV": "cctv",
      "Appliances": "appliances",
    };
    const slug = slugMap[selectedServiceType] || "ac-repair";
    window.location.href = `/services/${slug}`;
  };

  const floatingServices = [
    {
      name: "AC Repair",
      slug: "ac-repair",
      desc: "Cool Comfort",
      color: "bg-[#0284c7]",
      icon: "❄️",
    },
    {
      name: "Plumbing",
      slug: "plumbing",
      desc: "Fix It Right",
      color: "bg-[#0891b2]",
      icon: "💧",
    },
    {
      name: "Electrical",
      slug: "electrical",
      desc: "Safe & Reliable",
      color: "bg-[#d97706]",
      icon: "⚡",
    },
    {
      name: "Cleaning",
      slug: "cleaning",
      desc: "Fresh & Clean",
      color: "bg-[#059669]",
      icon: "🧹",
    },
    {
      name: "Carpentry",
      slug: "carpentry",
      desc: "Build Better",
      color: "bg-[#9333ea]",
      icon: "🔨",
    },
    {
      name: "CCTV",
      slug: "cctv",
      desc: "Secure Your Home",
      color: "bg-[#e11d48]",
      icon: "📹",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-white to-[#fafafa] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Inputs & Feature Pills (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill Badge */}
           

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12]">
              <span className="text-[#0f172a] block">Find Trusted Home</span>
              <span className="text-[#d49b1a] block">Service Technicians</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
              From AC repair to plumbing, electrical to cleaning — get your home services done by
              verified local professionals, near you.
            </p>

            {/* Search / Booking Box */}
            <form
              onSubmit={handleFindService}
              className="bg-white rounded-[22px] border border-slate-200 shadow-lg shadow-slate-200/50 p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Location Picker Field */}
              <button
                type="button"
                onClick={onOpenLocationPicker}
                className="w-full sm:w-auto flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <MapPin className="w-4 h-4 text-[#d49b1a]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Your location
                  </span>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 truncate">
                    <span className="truncate">
                      {userLocation.city || "Dhaka"}, Bangladesh
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </div>
                </div>
              </button>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-10 bg-slate-200" />

              {/* Select Service Dropdown */}
              <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Wrench className="w-4 h-4 text-[#d49b1a]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Select service
                  </span>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="AC Repair">AC Repair</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="CCTV">CCTV Security</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>
              </div>

              {/* Golden Find Service Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-[18px] bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Service</span>
              </button>
            </form>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Pillar 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Crosshair className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    Hyper-Local Matching
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Closest technician first
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    1-Tap Contact
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Call or WhatsApp directly
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    Verified Professionals
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Trusted & experienced
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Technician & Floating Card (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Background Warm Sun Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-amber-200/40 via-amber-100/30 to-transparent blur-xl pointer-events-none" />

            {/* Floating Golden Location Marker Pin */}
            <div className="absolute -top-3 left-6 sm:left-12 z-20 animate-bounce duration-1000">
              <div className="relative w-10 h-10 flex items-center justify-center drop-shadow-md">
                <svg viewBox="0 0 36 36" className="w-9 h-9 fill-[#d49b1a]">
                  <path d="M18 2C11.37 2 6 7.37 6 14c0 8.25 10.5 19.5 11.25 20.25.38.38 1.12.38 1.5 0C19.5 33.5 30 22.25 30 14c0-6.63-5.37-12-12-12zm0 16.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                </svg>
                <div className="absolute top-[12px] w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Handwritten Doodle Annotation */}
            <div className="absolute top-2 right-12 z-20 hidden sm:block">
              <span className="font-serif italic text-sm font-bold text-slate-800 tracking-tight transform -rotate-6 block">
                Your Local Service Partner
              </span>
              <svg
                className="w-12 h-6 text-[#d49b1a] ml-4 -mt-1"
                viewBox="0 0 48 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4c8 8 20 12 36 6m0 0l-6-6m6 6l-6 6" />
              </svg>
            </div>

            {/* Main Technician Image Frame */}
            <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_technician.jpg"
                alt="Wide Service Trusted Technician"
                className="w-full h-auto object-cover aspect-[4/4.5]"
              />
            </div>

            {/* Floating Services Card on the right */}
            <div className="absolute -bottom-4 -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-3 w-44 sm:w-48 hidden sm:block">
              <div className="space-y-2">
                {floatingServices.map((srv) => (
                  <a
                    key={srv.name}
                    href={`/services/${srv.slug}`}
                    className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-7 h-7 rounded-full ${srv.color} flex items-center justify-center text-xs text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      {srv.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight truncate group-hover:text-[#d49b1a] transition-colors">
                        {srv.name}
                      </div>
                      <div className="text-[9px] font-medium text-slate-400 leading-tight">
                        {srv.desc}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
