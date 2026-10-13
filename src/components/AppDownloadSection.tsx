"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Smartphone,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Camera,
  ExternalLink,
  ShieldCheck,
  Zap,
  MapPin,
  Bell,
  Sparkles,
} from "lucide-react";

export const AppDownloadSection: React.FC = () => {
  const [qrMode, setQrMode] = useState<"webapp" | "apk" | "playstore">("webapp");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Target download URLs
  const getTargetUrl = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (qrMode === "webapp") return origin;
      if (qrMode === "apk") return `${origin}/wide-service.apk`;
      if (qrMode === "playstore") return `https://play.google.com/store/apps/details?id=com.wideservice.app`;
    }
    return "https://wide-service.com";
  };

  useEffect(() => {
    const target = getTargetUrl();
    QRCode.toDataURL(target, {
      width: 280,
      margin: 1.5,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [qrMode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getTargetUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <section id="download" className="py-20 relative overflow-hidden bg-slate-900 text-white">
      {/* Decorative Golden Ambient Gradients */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <QrCode className="w-4 h-4" />
            <span>Instant App & Scanner Access</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Get Wide Service On Your Mobile Phone
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Scan the QR code with your phone camera to instantly access the app, or download
            the native Android APK for fast, on-demand local technician services.
          </p>
        </div>

        {/* 2-Column Grid: Left QR & Buttons, Right Mockup Phone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: QR Code + Download Options (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Interactive QR Box Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* QR Code Container with Scan Frame */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="relative p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-500/40">
                    {/* Scanner Target Corner Highlights */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-amber-500 rounded-tl" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-amber-500 rounded-tr" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-amber-500 rounded-bl" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-amber-500 rounded-br" />

                    {/* QR Image */}
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="Wide Service QR Code"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                        Generating QR...
                      </div>
                    )}
                  </div>

                  {/* Scan Badge */}
                  <span className="mt-3 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Point phone camera to scan
                  </span>
                </div>

                {/* QR Mode Switcher & Details */}
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      Scan to Open or Download
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Select what you want this QR code to trigger on your mobile:
                    </p>
                  </div>

                  {/* Mode Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => setQrMode("webapp")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        qrMode === "webapp"
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Instant Web App
                    </button>
                    <button
                      onClick={() => setQrMode("apk")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        qrMode === "apk"
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Android APK
                    </button>
                    <button
                      onClick={() => setQrMode("playstore")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        qrMode === "playstore"
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Play Store
                    </button>
                  </div>

                  {/* Target URL Preview & Copy */}
                  <div className="flex items-center gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-700 text-xs">
                    <span className="font-mono text-slate-400 truncate flex-1 text-left">
                      {getTargetUrl()}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Built-in Scanner Trigger */}
                  <button
                    onClick={() => setScannerOpen(true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Want to scan a QR code with this device? Click here</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct App Download Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Android APK Download */}
              <a
                href="/wide-service.apk"
                download="wide-service.apk"
                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                <Download className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-800">
                    Direct Download
                  </div>
                  <div className="text-sm font-extrabold">Android App (APK)</div>
                </div>
              </a>

              {/* Google Play Store Badge */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.icons8.com/fluency/48/google-play.png"
                  alt="Google Play"
                  className="w-7 h-7 shrink-0"
                />
                <div className="text-left">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">
                    GET IT ON
                  </div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>

            {/* App Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live GPS Radar</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Call / WA</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Push Alerts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free App</span>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup Displaying App Interface (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            {/* Phone Outer Shell */}
            <div className="relative w-72 sm:w-80 rounded-[44px] p-3 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl border-4 border-slate-600/60 ring-1 ring-white/10">
              {/* Speaker / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                <div className="w-10 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Screen Inner */}
              <div className="relative rounded-[36px] overflow-hidden bg-slate-950 text-white aspect-[9/18.5] flex flex-col pt-7">
                {/* Simulated App Header */}
                <div className="px-4 py-3 bg-[#e0b328] text-slate-950 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-800">
                      My Location Area
                    </div>
                    <div className="text-xs font-black flex items-center gap-0.5">
                      Shaheb Bazar, Rajshahi ▾
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-950/15 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                </div>

                {/* Simulated Screen Body */}
                <div className="flex-1 p-3 space-y-2.5 overflow-hidden text-[11px] bg-slate-900">
                  {/* Search Input */}
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-400 text-[10px] flex items-center gap-1.5">
                    <span>🔍</span> Search category or service...
                  </div>

                  {/* 2-Column Categories Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                      <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/20 flex items-center justify-center text-xs mb-1">
                        ❄️
                      </div>
                      <div className="font-bold text-[10px] text-white">AC Repair</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                      <div className="w-7 h-7 mx-auto rounded-lg bg-blue-500/20 flex items-center justify-center text-xs mb-1">
                        🚰
                      </div>
                      <div className="font-bold text-[10px] text-white">Plumbing</div>
                    </div>
                  </div>

                  {/* Nearby Header */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-[10px] text-white flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Nearby Services
                    </span>
                    <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-black">
                      ⚡ Closest First
                    </span>
                  </div>

                  {/* Simulated Service Card */}
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                      🛠️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[10px] text-white truncate">
                        Master AC Jet Wash
                      </div>
                      <div className="text-[9px] text-amber-400 font-medium">
                        ⚡ 320m • Shaheb Bazar
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      📞
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                      🔧
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[10px] text-white truncate">
                        Pipe Leak Detection
                      </div>
                      <div className="text-[9px] text-amber-400 font-medium">
                        ⚡ 580m • Ranibazar
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      📞
                    </div>
                  </div>
                </div>

                {/* Simulated Bottom Navigation */}
                <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-around text-[9px] text-slate-400">
                  <div className="flex flex-col items-center text-amber-400 font-bold">
                    <span>🏠</span> Home
                  </div>
                  <div className="flex flex-col items-center">
                    <span>🔍</span> Services
                  </div>
                  <div className="flex flex-col items-center">
                    <span>⚙️</span> Settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Built-in Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">QR Code Scanner</h3>
            <p className="text-xs text-slate-400">
              Hold a Wide Service QR code in front of your camera or point your mobile camera at
              the QR code shown on the screen to connect directly!
            </p>

            <div className="aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/40 flex flex-col items-center justify-center p-4 text-xs text-slate-500">
              <div className="w-32 h-32 border-2 border-amber-500 rounded-xl relative flex items-center justify-center animate-pulse">
                <QrCode className="w-16 h-16 text-amber-400/60" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-400 animate-bounce" />
              </div>
              <span className="mt-4 text-slate-400">
                Camera scanner ready
              </span>
            </div>

            <button
              onClick={() => setScannerOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
