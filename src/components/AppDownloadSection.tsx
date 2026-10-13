"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import {
  Zap,
  Check,
  MapPin,
  QrCode,
  X,
  Camera,
  Download,
  Share2,
  Home,
  Settings,
  Search,
  Bell,
} from "lucide-react";

export const AppDownloadSection: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const handleOpenQr = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://wide-service.com";
    QRCode.toDataURL(url, {
      width: 260,
      margin: 1.5,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((data) => {
        setQrDataUrl(data);
        setShowQrModal(true);
      })
      .catch((err) => console.error(err));
  };

  const checklistItems = [
    "Book services in minutes",
    "Track your technician",
    "Real-time location",
    "Secure & trusted",
    "Available on Android & iOS",
  ];

  return (
    <section id="download" className="relative overflow-hidden bg-[#0a1329] text-white py-16 lg:py-24">
      {/* Subtle background street network lines and golden map pin markers */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="street-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 120 M 0 0 L 120 120" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3 6" />
              <circle cx="60" cy="60" r="1.5" fill="#d49b1a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#street-grid)" />
        </svg>
      </div>

      {/* Floating Golden Pin Watermarks in Background */}
      <div className="absolute top-10 right-20 w-16 h-16 text-[#d49b1a]/25 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 36 36" fill="currentColor">
          <path d="M18 2C11.37 2 6 7.37 6 14c0 8.25 10.5 19.5 11.25 20.25.38.38 1.12.38 1.5 0C19.5 33.5 30 22.25 30 14c0-6.63-5.37-12-12-12zm0 16.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-1/3 w-20 h-20 text-[#d49b1a]/20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 36 36" fill="currentColor">
          <path d="M18 2C11.37 2 6 7.37 6 14c0 8.25 10.5 19.5 11.25 20.25.38.38 1.12.38 1.5 0C19.5 33.5 30 22.25 30 14c0-6.63-5.37-12-12-12zm0 16.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ============================================================ */}
          {/* Left Column: Two Smartphone Mockups (5 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-[440px] sm:h-[480px]">
              {/* Back Phone: Map View Screen (Tilted slightly to right) */}
              <div className="absolute right-0 top-6 sm:top-8 w-[200px] sm:w-[230px] rounded-[36px] p-2 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-600 shadow-2xl transform rotate-6 hover:rotate-3 transition-transform">
                {/* Screen */}
                <div className="rounded-[30px] overflow-hidden bg-slate-100 aspect-[9/18] relative flex flex-col">
                  {/* Top notch */}
                  <div className="h-5 bg-white flex items-center justify-center">
                    <div className="w-12 h-2.5 rounded-full bg-slate-900" />
                  </div>

                  {/* Street Map Simulation */}
                  <div className="flex-1 bg-[#f1f5f9] relative overflow-hidden">
                    {/* Map Streets SVG */}
                    <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="50" x2="250" y2="100" stroke="#cbd5e1" strokeWidth="6" />
                      <line x1="40" y1="0" x2="180" y2="350" stroke="#cbd5e1" strokeWidth="8" />
                      <line x1="120" y1="0" x2="80" y2="350" stroke="#e2e8f0" strokeWidth="4" />
                      <line x1="0" y1="180" x2="250" y2="140" stroke="#cbd5e1" strokeWidth="7" />
                      <line x1="0" y1="260" x2="250" y2="290" stroke="#cbd5e1" strokeWidth="5" />
                      <circle cx="110" cy="120" r="14" fill="#93c5fd" opacity="0.3" />
                    </svg>

                    {/* Location Pin 1: Blue */}
                    <div className="absolute top-16 left-12 w-6 h-6 flex items-center justify-center animate-bounce">
                      <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white font-bold">
                        📍
                      </div>
                    </div>

                    {/* Location Pin 2: Golden (Technician) */}
                    <div className="absolute top-28 right-8 w-6 h-6 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#d49b1a] border-2 border-white shadow-md flex items-center justify-center text-[10px] text-slate-950 font-bold">
                        ⚡
                      </div>
                    </div>

                    {/* Location Pin 3: Red */}
                    <div className="absolute bottom-24 right-14 w-6 h-6 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white">
                        📍
                      </div>
                    </div>

                    {/* Location Pin 4: Yellow */}
                    <div className="absolute bottom-16 left-10 w-6 h-6 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-[8px]">
                        📍
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front Phone: Pixel-Perfect Wide Service Native App Mockup in Pure Code */}
              <div className="absolute left-0 top-0 w-[240px] sm:w-[270px] rounded-[42px] p-2 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border border-slate-200/90 shadow-[0_25px_45px_rgba(0,0,0,0.6)] z-10 transition-transform duration-300 hover:scale-102">
                {/* Metallic Bezel Buttons on Chassis */}
                <div className="absolute -left-[3px] top-20 w-[3px] h-8 bg-slate-400 rounded-l-sm" />
                <div className="absolute -left-[3px] top-32 w-[3px] h-8 bg-slate-400 rounded-l-sm" />
                <div className="absolute -right-[3px] top-24 w-[3px] h-12 bg-slate-400 rounded-r-sm" />

                {/* Inner Screen */}
                <div className="rounded-[34px] overflow-hidden bg-[#f8fafc] text-slate-900 flex flex-col relative border-2 border-slate-900 shadow-inner">
                  {/* 1. iOS Status Bar with Dynamic Island */}
                  <div className="bg-[#e0b328] px-4 pt-2 pb-1 flex items-center justify-between text-[8px] font-bold text-slate-950">
                    <span>0:42</span>
                    {/* Dynamic Island Pill */}
                    <div className="w-16 h-3.5 rounded-full bg-black flex items-center justify-end pr-1.5 shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[7px]">ııl</span>
                      <span className="text-[7px]">ᯤ</span>
                      <span className="text-[8px]">🔋</span>
                    </div>
                  </div>

                  {/* 2. Golden Header: My Location Area */}
                  <div className="bg-[#e0b328] px-3.5 pt-0.5 pb-2.5 text-slate-950 flex items-center justify-between">
                    <div>
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-950/70 block leading-tight">
                        MY LOCATION AREA
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-black text-slate-950 leading-tight">
                        <span>Shaheb Bazar, Rajshahi</span>
                        <span className="text-[9px]">▾</span>
                      </div>
                    </div>

                    {/* Notification Bell with Red Dot */}
                    <div className="w-6 h-6 rounded-full bg-slate-950/10 flex items-center justify-center relative shadow-2xs">
                      <Bell className="w-3.5 h-3.5 text-slate-950" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-600" />
                    </div>
                  </div>

                  {/* 3. Search Bar */}
                  <div className="px-3 my-2">
                    <div className="bg-white rounded-full px-2.5 py-1.5 flex items-center gap-1.5 border border-slate-200/90 shadow-2xs">
                      <Search className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-[8px] text-slate-400 font-medium">
                        Search category or service...
                      </span>
                    </div>
                  </div>

                  {/* 4. Promo Banner Card */}
                  <div className="px-3 mb-2.5">
                    <div className="bg-[#101b33] rounded-xl p-2 flex items-center justify-between border border-slate-800 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] shrink-0">
                          📲
                        </div>
                        <div>
                          <div className="text-[8px] font-black text-[#e0b328] leading-tight">
                            Wide Service Mobile App
                          </div>
                          <div className="text-[6.5px] text-slate-400 leading-tight">
                            Direct GPS radar & 1-tap call
                          </div>
                        </div>
                      </div>
                      <span className="bg-[#e0b328] text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                        Get App
                      </span>
                    </div>
                  </div>

                  {/* 5. Popular Categories Section Header */}
                  <div className="px-3 mb-1.5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-tight">
                      POPULAR CATEGORIES
                    </span>
                    <span className="text-[7px] font-bold text-slate-400">
                      31 Categories
                    </span>
                  </div>

                  {/* 6. Exact 2-Column Categories Grid (8 Cards matching screenshot) */}
                  <div className="px-3 grid grid-cols-2 gap-1.5 mb-2.5">
                    {/* 1. Gas */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <rect x="9" y="8" width="14" height="19" rx="4" fill="#38bdf8" />
                          <rect x="11" y="5" width="10" height="3" rx="1.5" fill="#0284c7" />
                          <rect x="13" y="3" width="6" height="2" rx="1" fill="#0369a1" />
                          <path d="M16 13c0 2-2 3-2 5a3 3 0 0 0 6 0c0-2.5-2.5-3.5-2.5-5 0-1 0.5-2 1-2.5-2 0.5-2.5 1.5-2.5 2.5z" fill="#ffffff" />
                          <circle cx="7" cy="11" r="1" fill="#38bdf8" />
                          <circle cx="25" cy="15" r="1" fill="#38bdf8" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Gas
                      </span>
                    </div>

                    {/* 2. AC & Cooling Repair */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                          <rect x="4" y="8" width="24" height="11" rx="2" fill="#38bdf8" />
                          <rect x="6" y="15" width="20" height="2" rx="1" fill="#0284c7" />
                          <circle cx="24" cy="11" r="1" fill="#ffffff" />
                          <path d="M8 22c0 2 1.5 3 1.5 4M12 22c0 2 1.5 3 1.5 4M16 22c0 2 1.5 3 1.5 4M20 22c0 2 1.5 3 1.5 4" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        AC & Cooling Repair
                      </span>
                    </div>

                    {/* 3. Plumbing Services */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                          <path d="M7 14h5v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7h4v4h-6v-3h-2v4h-4v-4H7v-5z" fill="#38bdf8" />
                          <rect x="13" y="5" width="4" height="3" rx="1" fill="#0284c7" />
                          <path d="M19 24c0 1.6-1.3 3-3 3s-3-1.4-3-3c0-1.8 3-5 3-5s3 3.2 3 5z" fill="#0284c7" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Plumbing Services
                      </span>
                    </div>

                    {/* 4. Electrical & Wiring */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <path d="M18 10l4 4-6 6-4-4 6-6z" fill="#94a3b8" />
                          <path d="M19 7l2 2M23 11l2 2" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M12 16l-4 4c-1.5 1.5-1 3.5 1 5l1 1" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Electrical & Wiring
                      </span>
                    </div>

                    {/* 5. House Cleaning */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <rect x="6" y="6" width="20" height="20" rx="4" fill="#38bdf8" />
                          <path d="M11 11l8 8M19 11l-3 3 5 5 3-3-5-5z" fill="#0f172a" />
                          <path d="M12 10l-2 2 8 8 2-2-8-8z" fill="#0284c7" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        House Cleaning
                      </span>
                    </div>

                    {/* 6. Appliance Repair */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <rect x="7" y="5" width="18" height="22" rx="3" fill="#38bdf8" />
                          <circle cx="16" cy="17" r="5.5" fill="#0284c7" />
                          <circle cx="16" cy="17" r="3.5" fill="#0369a1" />
                          <circle cx="11" cy="9" r="1.5" fill="#ffffff" />
                          <line x1="16" y1="9" x2="21" y2="9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Appliance Repair
                      </span>
                    </div>

                    {/* 7. Painting & Renovation */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <path d="M19 6l7 7-9 9-7-7 9-9z" fill="#334155" />
                          <path d="M12 13l7 7-3 3-7-7 3-3z" fill="#94a3b8" />
                          <path d="M9 16l7 7-6 6c-2 2-4 0-4 0s-2-2 0-4l3-3-4-6z" fill="#cbd5e1" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Painting & Renovation
                      </span>
                    </div>

                    {/* 8. Carpentry & Woodwork */}
                    <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center gap-1">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                          <path d="M10 22l14-14-3-3-15 15 4 2z" fill="#94a3b8" />
                          <path d="M11 21l2-2 1 1-2 2-1-1zm3-3l2-2 1 1-2 2-1-1zm3-3l2-2 1 1-2 2-1-1z" fill="#64748b" />
                          <path d="M8 20l-3 3c-1.5 1.5-1.5 4 0 5.5s4 1.5 5.5 0l3-3-5.5-5.5z" fill="#eab308" />
                          <circle cx="8" cy="25" r="1.5" fill="#0f172a" />
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-bold text-slate-800 leading-tight">
                        Carpentry & Woodwork
                      </span>
                    </div>
                  </div>

                  {/* 7. Bottom Navigation Bar */}
                  <div className="bg-white/95 border-t border-slate-200/80 px-3 py-1.5 flex items-center justify-between">
                    {/* Home Tab (Golden Highlighted Pill) */}
                    <div className="flex-1 max-w-[100px] bg-[#e0b328]/20 border border-[#e0b328]/60 py-1 px-2.5 rounded-xl flex items-center justify-center gap-1 shadow-2xs">
                      <Home className="w-3 h-3 text-amber-700 fill-amber-500/30" />
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-950 leading-none">
                          Home
                        </span>
                        <div className="w-3 h-[1.5px] bg-[#d49b1a] rounded-full mt-0.5" />
                      </div>
                    </div>

                    {/* Settings Tab */}
                    <div className="flex-1 max-w-[100px] py-1 px-2.5 flex items-center justify-center gap-1 text-slate-500">
                      <Settings className="w-3 h-3 text-slate-400" />
                      <span className="text-[8px] font-bold text-slate-600">
                        Settings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Middle Column: Title, Subtitle & Store Badges (4 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            {/* Pill Badge */}
          

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Get Services on <br />
              <span className="text-[#d49b1a]">Your Mobile</span>
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Download our mobile app for a faster, easier and more convenient experience.
            </p>

            {/* App Store Download Badges Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {/* Google Play Store Badge */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-black/90 hover:bg-black border border-slate-700 text-white flex items-center gap-3 transition-all active:scale-95 shadow-sm"
              >
                {/* Google Play Triangle Logo */}
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.6 2.4l10.9 10.9-3.2 3.2L3.6 2.4z" />
                  <path fill="#34A853" d="M14.5 13.3l3.6-2.1c.9-.5.9-1.4 0-1.9l-3.6-2.1L11.3 10l3.2 3.3z" />
                  <path fill="#FBBC05" d="M3.6 21.6l10.9-10.9-3.2-3.2L3.6 21.6z" />
                  <path fill="#EA4335" d="M14.5 13.3L3.6 21.6c-.6-.4-1-1.1-1-1.9V4.3c0-.8.4-1.5 1-1.9l10.9 10.9z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">
                    GET IT ON
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    Google Play
                  </div>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-black/90 hover:bg-black border border-slate-700 text-white flex items-center gap-3 transition-all active:scale-95 shadow-sm"
              >
                {/* Apple Logo */}
                <svg className="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.1-1.92.98-3.04-.95.04-2.1.63-2.77 1.42-.59.68-1.12 1.82-.98 2.92 1.07.08 2.13-.53 2.77-1.3" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">
                    Download on the
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    App Store
                  </div>
                </div>
              </a>
            </div>

            {/* QR Scan Button */}
            <div className="pt-1">
              <button
                onClick={handleOpenQr}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d49b1a] hover:underline cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Or scan QR code with phone camera</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Right Column: 5 Checklist Items with Golden Checks (3 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3.5">
              {checklistItems.map((text) => (
                <div key={text} className="flex items-center gap-3">
                  {/* Golden filled circle with white checkmark */}
                  <div className="w-5 h-5 rounded-full bg-[#d49b1a] text-slate-950 font-black flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                  </div>
                  <span className="text-white font-medium text-sm sm:text-[15px] tracking-tight">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for scanning */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-white">Scan with Camera</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {qrDataUrl && (
              <div className="p-3 bg-white rounded-2xl mx-auto w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="App QR" className="w-48 h-48" />
              </div>
            )}

            <p className="text-xs text-slate-300">
              Point your smartphone camera at this QR code to launch Wide Service instantly!
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#d49b1a] text-slate-950 font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
