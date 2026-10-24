"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Smartphone,
  Apple,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  QrCode,
  ArrowRight,
  Zap,
  Clock,
  Layers,
  MapPin,
  Bell,
  HardDrive,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { UserLocation } from "../../types";
import { DEFAULT_USER_LOCATION } from "../../lib/cities";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LocationPickerModal } from "../../components/LocationPickerModal";

interface AppReleaseItem {
  id: number;
  platform: "android" | "ios";
  version: string;
  buildNumber?: string;
  downloadUrl: string;
  fileSize?: string;
  fileType: string;
  releaseNotes?: string;
  minOsVersion: string;
  isActive: number;
  downloadsCount: number;
  createdAt: string;
}

export default function ApkDownloadPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMobileAppMode, setIsMobileAppMode] = useState(false);

  // Release data states
  const [androidRelease, setAndroidRelease] = useState<AppReleaseItem>({
    id: 1,
    platform: "android",
    version: "1.0.0",
    buildNumber: "1",
    downloadUrl: "https://apiwideservice.widetechbd.com/uploads/apps/wide-service-latest.apk",
    fileSize: "45.2 MB",
    fileType: "apk",
    releaseNotes: "অফিশিয়াল রিলিজ - আল্ট্রা-স্মুথ সার্ভিস এক্সপেরিয়েন্স, কুইক কল, রিয়েল-টাইম জিপিএস ও ইনস্ট্যান্ট পুশ নোটিফিকেশন সুবিধা।",
    minOsVersion: "Android 7.0+",
    isActive: 1,
    downloadsCount: 142,
    createdAt: new Date().toISOString(),
  });

  const [iosRelease, setIosRelease] = useState<AppReleaseItem>({
    id: 2,
    platform: "ios",
    version: "1.0.0",
    buildNumber: "1",
    downloadUrl: "https://apiwideservice.widetechbd.com/uploads/apps/wide-service-latest.ipa",
    fileSize: "52.8 MB",
    fileType: "ipa",
    releaseNotes: "অফিশিয়াল iOS প্রিভিউ রিলিজ - ফাস্ট সার্চ, রেসপনসিভ বুকিং ও প্রিমিয়াম ডিজাইন ইন্টারফেস।",
    minOsVersion: "iOS 14.0+",
    isActive: 1,
    downloadsCount: 98,
    createdAt: new Date().toISOString(),
  });

  const [androidQr, setAndroidQr] = useState<string>("");
  const [iosQr, setIosQr] = useState<string>("");
  const [isDownloadingAndroid, setIsDownloadingAndroid] = useState(false);
  const [isDownloadingIos, setIsDownloadingIos] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://apiwideservice.widetechbd.com/api";

  // Fetch latest public releases from backend
  useEffect(() => {
    async function fetchReleases() {
      try {
        const res = await fetch(`${apiUrl}/app-releases/public`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.android) setAndroidRelease(json.data.android);
            if (json.data.ios) setIosRelease(json.data.ios);
          }
        }
      } catch (e) {
        console.warn("Using default release values due to fetch note:", e);
      }
    }
    fetchReleases();
  }, [apiUrl]);

  // Generate QR codes for both releases
  useEffect(() => {
    if (androidRelease?.downloadUrl) {
      QRCode.toDataURL(androidRelease.downloadUrl, {
        width: 220,
        margin: 1.5,
        color: { dark: "#080e1e", light: "#ffffff" },
      })
        .then((url) => setAndroidQr(url))
        .catch(console.error);
    }

    if (iosRelease?.downloadUrl) {
      QRCode.toDataURL(iosRelease.downloadUrl, {
        width: 220,
        margin: 1.5,
        color: { dark: "#080e1e", light: "#ffffff" },
      })
        .then((url) => setIosQr(url))
        .catch(console.error);
    }
  }, [androidRelease?.downloadUrl, iosRelease?.downloadUrl]);

  // Restore saved location from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wide_service_user_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.latitude && parsed.longitude) {
          setUserLocation(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const handleLocationChange = (newLoc: UserLocation) => {
    setUserLocation(newLoc);
    try {
      localStorage.setItem("wide_service_user_location", JSON.stringify(newLoc));
    } catch (e) {}
  };

  // Download trigger and tracking
  const handleDownload = async (platform: "android" | "ios") => {
    const target = platform === "android" ? androidRelease : iosRelease;
    if (!target) return;

    if (platform === "android") setIsDownloadingAndroid(true);
    else setIsDownloadingIos(true);

    // Track download in backend
    try {
      fetch(`${apiUrl}/app-releases/track/${target.id}`, { method: "POST" });
    } catch (e) {}

    // Trigger file download
    window.open(target.downloadUrl, "_blank");

    setTimeout(() => {
      if (platform === "android") {
        setIsDownloadingAndroid(false);
        setAndroidRelease((prev) => ({
          ...prev,
          downloadsCount: (prev.downloadsCount || 0) + 1,
        }));
      } else {
        setIsDownloadingIos(false);
        setIosRelease((prev) => ({
          ...prev,
          downloadsCount: (prev.downloadsCount || 0) + 1,
        }));
      }
    }, 1500);
  };

  const faqs = [
    {
      q: "কীভাবে Android ফোনে APK ফাইল ইনস্টল করব?",
      a: "APK ফাইলটি ডাউনলোড করার পর নোটিফিকেশনে বা Downloads ফোল্ডারে ট্যাপ করুন। যদি 'Install unknown apps' অনুমতি চায়, তবে Settings এ গিয়ে অনুমতি দিয়ে 'Install' বাটনে চাপুন। ২ সেকেন্ডেই অ্যাপ ইনস্টল হয়ে যাবে।",
    },
    {
      q: "এই APK ফাইলটি কি সম্পূর্ণ নিরাপদ?",
      a: "হ্যাঁ, ১০০% নিরাপদ। এটি ওয়াইড সার্ভিসের নিজস্ব অফিশিয়াল ডেভেলপার সাইনড বিল্ড। এতে কোনো বিজ্ঞাপন বা ক্ষতিকর কোড নেই এবং Google Play Protect দ্বারা নিরাপদ হিসেবে স্বীকৃত।",
    },
    {
      q: "আইফোনে (iOS) কীভাবে ইনস্টল করব?",
      a: "iOS এর জন্য ডাউনলোড বাটনে চাপলে সরাসরি ইন্সটল লিংক বা টেস্টফ্লাইট প্রম্পট পাবেন। অথবা কিউআর কোড স্ক্যান করে সরাসরি ডিভাইসে ওপেন করতে পারবেন।",
    },
    {
      q: "নতুন আপডেট আসলে কি আবার ডাউনলোড করতে হবে?",
      a: "নতুন কোনো ফিচার বা ভার্সন রিলিজ হলে অ্যাপের ভেতরে স্বয়ংক্রিয়ভাবে নোটিফিকেশন চলে আসবে এবং এই /apk পেজ থেকে ১-ক্লিকেই নতুন আপডেট নামিয়ে নিতে পারবেন।",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1d] text-slate-100 font-sans selection:bg-[#e0b328] selection:text-slate-900">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Global Header */}
      <Header
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenDownload={() => {}}
        isMobileAppMode={isMobileAppMode}
        onToggleMobileAppMode={() => setIsMobileAppMode(!isMobileAppMode)}
        activeNav="Services"
      />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Ambient Lighting Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#e0b328]/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-96 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================
            HERO SECTION: Title & Introduction
        ======================================================== */}
        <section className="relative z-10 pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Official Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0b328]/15 border border-[#e0b328]/40 text-[#e0b328] text-xs font-bold tracking-wide shadow-lg mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#e0b328] animate-pulse" />
            <span>অফিশিয়াল মোবাইল অ্যাপ রিলিজ সেন্টার • Wide Service Mobile</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            আপনার হাতের মুঠোয়{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e0b328] via-[#ffd24d] to-[#e0b328]">
              ১০০+ জরুরি সেবা
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Wide Service অফিশিয়াল মোবাইল অ্যাপ ডাউনলোড করুন। কোনো থার্ড-পার্টি নয়—সরাসরি বিশ্বস্ত টেকনিশিয়ানকে কল দিন, লাইভ ম্যাপে দূরত্ব দেখুন এবং ইনস্ট্যান্ট সেবা গ্রহণ করুন।
          </p>

          {/* Trust Guarantees Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% নিরাপদ ও ভাইরাস মুক্ত</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-[#e0b328]" />
              <span>সরাসরি ১-ট্যাপে ডাউনলোড</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>লাইটওয়েট ও আল্ট্রা-ফাস্ট সাইজ</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            DOWNLOAD CARDS SECTION: Android & iOS Side-by-Side
        ======================================================== */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {/* ----------------------------------------------------
                CARD 1: ANDROID APK DOWNLOAD
            ---------------------------------------------------- */}
            <div className="relative group rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0e1935] via-[#091226] to-[#080e1e] border-2 border-emerald-500/40 hover:border-emerald-400/80 shadow-2xl transition-all duration-300 flex flex-col justify-between">
              {/* Top Accent Light */}
              <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-60" />

              <div>
                {/* Header: Platform & Version */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                          Android APK
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          v{androidRelease?.version || "1.0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                        অফিশিয়াল প্যাকেজ ({androidRelease?.minOsVersion || "Android 7.0+"})
                      </span>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> লেটেস্ট স্ট্যাবল
                  </span>
                </div>

                {/* Release Info & Features */}
                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white block mb-1">রিলিজ আপডেট:</span>
                    {androidRelease?.releaseNotes ||
                      "আল্ট্রা-স্মুথ সিনেমা কার্টেন ইন্টারফেস, ফাস্ট টেকনিশিয়ান সার্চ ও রিয়েল-টাইম পুশ নোটিফিকেশন।"}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[11px]">ফাইল সাইজ</span>
                      <span className="font-black text-white text-sm">
                        {androidRelease?.fileSize || "45.2 MB"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[11px]">মোট ডাউনলোড</span>
                      <span className="font-black text-emerald-400 text-sm">
                        {androidRelease?.downloadsCount || 142} বার
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Direct Download Button */}
                <button
                  onClick={() => handleDownload("android")}
                  disabled={isDownloadingAndroid}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className={`w-5 h-5 ${isDownloadingAndroid ? "animate-bounce" : ""}`} />
                  <span>
                    {isDownloadingAndroid ? "ডাউনলোড শুরু হচ্ছে..." : "Download Wide Service APK"}
                  </span>
                </button>
              </div>

              {/* QR Code Scan Area */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 rounded-2xl bg-white p-2 shrink-0 flex items-center justify-center shadow-md">
                  {androidQr ? (
                    <img src={androidQr} alt="Scan to download APK" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 animate-pulse rounded-lg" />
                  )}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    মোবাইল দিয়ে স্ক্যান করুন
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    আপনার ফোনের ক্যামেরা বা QR স্ক্যানার দিয়ে স্ক্যান করলেই সরাসরি অ্যান্ড্রয়েড ফোনে APK ফাইল ডাউনলোড শুরু হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                CARD 2: APPLE iOS DOWNLOAD
            ---------------------------------------------------- */}
            <div className="relative group rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#141b38] via-[#0b132a] to-[#080e1e] border-2 border-indigo-500/40 hover:border-indigo-400/80 shadow-2xl transition-all duration-300 flex flex-col justify-between">
              {/* Top Accent Light */}
              <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full opacity-60" />

              <div>
                {/* Header: Platform & Version */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Apple className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                          Apple iOS
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          v{iosRelease?.version || "1.0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                        iPhone & iPad ({iosRelease?.minOsVersion || "iOS 14.0+"})
                      </span>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> অফিশিয়াল বিল্ড
                  </span>
                </div>

                {/* Release Info & Features */}
                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white block mb-1">রিলিজ আপডেট:</span>
                    {iosRelease?.releaseNotes ||
                      "iOS প্রিভিউ প্যাকেজ - আল্ট্রা-স্মুথ রেটিনা অপ্টিমাইজেশন, লাইভ নোটিফিকেশন ও ফাস্ট কল সার্ভিস।"}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[11px]">ফাইল সাইজ</span>
                      <span className="font-black text-white text-sm">
                        {iosRelease?.fileSize || "52.8 MB"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[11px]">মোট ডাউনলোড</span>
                      <span className="font-black text-indigo-400 text-sm">
                        {iosRelease?.downloadsCount || 98} বার
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Direct Download Button */}
                <button
                  onClick={() => handleDownload("ios")}
                  disabled={isDownloadingIos}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className={`w-5 h-5 ${isDownloadingIos ? "animate-bounce" : ""}`} />
                  <span>
                    {isDownloadingIos ? "ডাউনলোড শুরু হচ্ছে..." : "Download iOS App / IPA"}
                  </span>
                </button>
              </div>

              {/* QR Code Scan Area */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 rounded-2xl bg-white p-2 shrink-0 flex items-center justify-center shadow-md">
                  {iosQr ? (
                    <img src={iosQr} alt="Scan to download iOS app" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 animate-pulse rounded-lg" />
                  )}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-400" />
                    iPhone দিয়ে স্ক্যান করুন
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    আইফোনের ডিফল্ট ক্যামেরা ওপেন করে কিউআর কোডটি ধরুন। সরাসরি ডাউনলোড পেজ ও ইনস্টলার ওপেন হয়ে যাবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3-STEP INSTALLATION GUIDE (VISUAL)
        ======================================================== */}
        <section className="relative z-10 py-16 bg-[#0a1329] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="px-3.5 py-1 rounded-full bg-[#e0b328]/15 text-[#e0b328] text-xs font-bold uppercase tracking-wider">
                সহজ ৩ ধাপ
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                কীভাবে ফোনে অ্যাপটি ইনস্টল করবেন?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                মাত্র ১ মিনিটেই আপনার মোবাইল ফোনে Wide Service চালু করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-lg flex items-center justify-center mb-4">
                  ১
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  APK / App ফাইল ডাউনলোড করুন
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  উপরের সবুজ বাটনে চাপ দিয়ে সরাসরি আপনার ডিভাইসে সর্বশেষ অফিশিয়াল রিলিজটি নামিয়ে নিন।
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative">
                <div className="w-10 h-10 rounded-xl bg-[#e0b328]/20 text-[#e0b328] font-black text-lg flex items-center justify-center mb-4">
                  ২
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  অনুমতি দিন (Allow Source)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ফাইল ওপেন করার সময় যদি প্রম্পট আসে, তবে &quot;Settings&quot; এ গিয়ে &quot;Allow from this source&quot; অন করে দিন।
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-lg flex items-center justify-center mb-4">
                  ৩
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  ইনস্টল সম্পন্ন ও সেবা গ্রহণ
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  &quot;Install&quot; বাটনে চাপুন। ইনস্টলেশন শেষ হলে অ্যাপ খুলে আপনার পছন্দের সার্ভিস সরাসরি উপভোগ করুন।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            EXCLUSIVE APP FEATURES STRIP
        ======================================================== */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-white">
              মোবাইল অ্যাপ ব্যবহারের বিশেষ সুবিধাসমূহ
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ওয়েবসাইটের তুলনায় মোবাইল অ্যাপে আরও দ্রুত ও পার্সোনালাইজড অভিজ্ঞতা
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e0b328]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#e0b328] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">ইনস্ট্যান্ট ১-ক্লিক কল</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোনো অপেক্ষা নেই—সরাসরি প্রোভাইডারের ফোনে ডায়াল বা হোয়াটসঅ্যাপে কথা বলুন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">লাইভ জিপিএস রাডার</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার থেকে মাত্র ৫০০ মিটার বা ১ কিলোমিটারের ভেতরের টেকনিশিয়ানদের খুঁজে নিন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">স্মার্ট পুশ নোটিফিকেশন</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                জরুরি নোটিস, ডিসকাউন্ট অফার এবং টেকনিশিয়ান আসার সময় আপডেট ফোনে পেয়ে যাবেন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">১০০% ভেরিফাইড প্রোভাইডার</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                জাতীয় পরিচয়পত্র (NID) ও পুলিশ রেকর্ড দ্বারা যাচাইকৃত বিশ্বস্ত প্রফেশনাল।
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            FAQ ACCORDION SECTION
        ======================================================== */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-24">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#e0b328] uppercase tracking-wider">
              সাধারণ জিজ্ঞাসা
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              অ্যাপ ডাউনলোড সম্পর্কিত প্রশ্নোত্তর
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#e0b328] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#e0b328] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
