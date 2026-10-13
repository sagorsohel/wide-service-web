"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import {
  MapPin,
  Smartphone,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
  isMobileAppMode: boolean;
  onToggleMobileAppMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
  isMobileAppMode,
  onToggleMobileAppMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#e0b328] flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                W
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                  Wide Service
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                  Local Service Ecosystem
                </span>
              </div>
            </a>

            {/* Location Selector Pill */}
            <button
              onClick={onOpenLocationPicker}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors ml-2 cursor-pointer"
              title="Change search location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate max-w-[140px] md:max-w-[180px]">
                {userLocation.area}, {userLocation.city}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a
              href="#services"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Browse Services
            </a>
            <a
              href="#features"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Platform Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#download"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Mobile App & QR
            </a>
            <a
              href="#providers"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Join as Technician
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Web vs App View */}
            <button
              onClick={onToggleMobileAppMode}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMobileAppMode
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
              title="Toggle between Desktop Website and Mobile App layout"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isMobileAppMode ? "Desktop View" : "Mobile App Mode"}</span>
            </button>

            {/* Download / Scanner CTA */}
            <button
              onClick={onOpenDownload}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e0b328] hover:bg-[#c49214] text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get Mobile App</span>
            </button>

            {/* Provider Login (Links to admin project) */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Admin / Creator Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <button
            onClick={() => {
              onOpenLocationPicker();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Location: {userLocation.area}, {userLocation.city}</span>
            </div>
            <span className="text-amber-600 text-xs font-black">Change</span>
          </button>

          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Browse Services
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Features & Guarantees
            </a>
            <a
              href="#download"
              onClick={() => {
                onOpenDownload();
                setMobileMenuOpen(false);
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-amber-600 dark:text-amber-400"
            >
              Download Mobile App & Scanner
            </a>
            <a
              href="#providers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Join as Technician
            </a>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-mono"
            >
              <span>Admin / Creator Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
