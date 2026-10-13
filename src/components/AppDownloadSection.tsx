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

              {/* Front Phone: Wide Service App Screen */}
              <div className="absolute left-0 top-0 w-[220px] sm:w-[250px] rounded-[38px] p-2.5 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-3 border-slate-500 shadow-2xl z-10">
                {/* Screen */}
                <div className="rounded-[32px] overflow-hidden bg-[#0f172a] text-white aspect-[9/18.5] flex flex-col">
                  {/* Top status bar & notch */}
                  <div className="px-4 pt-2 pb-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span>9:41</span>
                    <div className="w-16 h-3 rounded-full bg-slate-950" />
                    <span>5G 🔋</span>
                  </div>

                  {/* App Header with Logo matching screenshot */}
                  <div className="px-4 py-3 text-center border-b border-slate-800/80">
                    <div className="w-7 h-7 mx-auto rounded-full bg-[#d49b1a] flex items-center justify-center text-slate-950 text-xs font-bold mb-1 shadow-xs">
                      📍
                    </div>
                    <div className="text-xs font-black text-white tracking-tight">
                      Wide Service
                    </div>
                    <div className="text-[8px] font-semibold text-[#d49b1a] tracking-wider">
                      Trusted Local Technicians
                    </div>
                  </div>

                  {/* Search bar inside phone */}
                  <div className="px-3.5 my-2">
                    <div className="py-1.5 px-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-[9px] text-slate-400 flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>Search service...</span>
                    </div>
                  </div>

                  {/* 6 Category Icons inside phone matching screenshot */}
                  <div className="px-3.5 flex-1 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] mb-1">
                        ❄️
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">AC Repair</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[10px] mb-1">
                        💧
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">Plumbing</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] mb-1">
                        ⚡
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">Cleaning</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] mb-1">
                        🧹
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">Electricity</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] mb-1">
                        🔨
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">Carpentry</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-1.5 flex flex-col items-center justify-center text-center">
                      <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-[10px] mb-1">
                        📹
                      </div>
                      <span className="text-[8px] font-bold text-slate-200">CCTV</span>
                    </div>
                  </div>

                  {/* Bottom bar inside phone */}
                  <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-around text-[8px] text-slate-400">
                    <span className="text-[#d49b1a] font-bold">🏠 Home</span>
                    <span>📑 Orders</span>
                    <span>⚙️ Account</span>
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#d49b1a] text-[#d49b1a]" />
              <span>Mobile App</span>
            </div>

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
