"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserLocation } from "../../types";
import { DEFAULT_USER_LOCATION } from "../../lib/cities";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LocationPickerModal } from "../../components/LocationPickerModal";
import { StatsBannerSection } from "../../components/StatsBannerSection";
import { AppDownloadSection } from "../../components/AppDownloadSection";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  Award,
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  HeartHandshake,
  Target,
  Compass,
  Zap,
  Check,
  Building2,
  Wrench,
  Smartphone,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMobileAppMode, setIsMobileAppMode] = useState(false);

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
    } catch (e) {
      console.warn("Could not read stored location:", e);
    }
  }, []);

  const handleLocationChange = (newLoc: UserLocation) => {
    setUserLocation(newLoc);
    try {
      localStorage.setItem("wide_service_user_location", JSON.stringify(newLoc));
    } catch (e) {}
  };

  const handleOpenDownload = () => {
    const el = document.getElementById("download");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Global Brand Header */}
      <Header
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenDownload={handleOpenDownload}
        isMobileAppMode={isMobileAppMode}
        onToggleMobileAppMode={() => setIsMobileAppMode(!isMobileAppMode)}
        activeNav="About"
      />

      <main className="flex-1">
        {/* =========================================================
            1. HERO SECTION: Brand Story & Impact
        ========================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fefbf2] via-[#faf8f2] to-white pt-14 pb-20 border-b border-slate-100">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e0b328]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Mission Narrative */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Golden Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0b328]/15 border border-[#e0b328]/40 text-[#0f172a] text-xs font-bold tracking-wide shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#d49b1a]" />
                  <span>About Wide Service • Bangladesh’s Trusted Network</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.15]">
                  Empowering Bangladesh with{" "}
                  <span className="text-[#d49b1a] relative inline-block">
                    Verified & Fast
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 418 11"
                      fill="none"
                      className="absolute left-0 top-full -mt-1 w-full text-[#d49b1a]/40"
                    >
                      <path
                        d="M0.5 8C80 2 240 1 417.5 7"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  Local Services
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                  Wide Service was built to revolutionize how homeowners, businesses, and skilled technicians connect. We eliminate uncertainty and middlemen by pairing smart GPS radar proximity with rigorous 100% NID-verified tradespeople right in your neighborhood.
                </p>

                {/* Key Pillars Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    "100% NID & Background Verified Technicians",
                    "Hyper-Local Radar within 2–5 km radius",
                    "Transparent Direct Phone & WhatsApp Access",
                    "Emergency 24/7 Rapid Response Dispatch",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Browse All Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#d49b1a]" />
                    <span>Contact Support</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Composite Hero Image with Float Badges */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Hero Photo */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                    <img
                      src="/hero_technician.jpg"
                      alt="Wide Service Verified Technicians"
                      className="w-full h-[400px] object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Active & Dispatched
                        </span>
                      </div>
                      <p className="text-sm font-bold">
                        Professional, punctual, and equipped with modern tools.
                      </p>
                    </div>
                  </div>

                  {/* Floating Metric Card 1 (Top Left) */}
                  <div className="absolute -top-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/90 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-[#d49b1a] flex items-center justify-center font-black">
                      <ShieldCheck className="w-6 h-6 text-[#d49b1a]" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Verification</div>
                      <div className="text-sm font-black text-slate-900">100% NID Passed</div>
                    </div>
                  </div>

                  {/* Floating Metric Card 2 (Bottom Right) */}
                  <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200/90 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Avg. Response</div>
                      <div className="text-sm font-black text-slate-900">15–30 Mins</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. MISSION, VISION & ETHOS (3 Dynamic Cards)
        ========================================================= */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-[#0f172a] text-xs font-bold tracking-wide uppercase">
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-3">
                Built on Trust, Transparency & Speed
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                We are solving the challenges of unorganized home maintenance by empowering both customers and tradespeople.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Our Mission */}
              <div className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200/80 hover:border-[#e0b328]/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#d49b1a] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Our Mission
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    To deliver reliable, high-quality on-demand services across all 64 districts in Bangladesh by connecting every household with authentic, certified local professionals within minutes.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200/70 text-xs font-bold text-[#d49b1a] flex items-center gap-1.5">
                  <span>Fast, Safe & Fair</span>
                </div>
              </div>

              {/* Card 2: Our Vision */}
              <div className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200/80 hover:border-blue-400/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    To digitize Bangladesh&apos;s trade workforce, enabling 50,000+ electricians, plumbers, AC engineers, and technicians to gain dignified livelihoods, direct bookings, and modern respect.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200/70 text-xs font-bold text-blue-600 flex items-center gap-1.5">
                  <span>Empowering Local Trades</span>
                </div>
              </div>

              {/* Card 3: Our Core Values */}
              <div className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Our Core Values
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Safety first, customer respect, transparent communication, and continuous skill refinement. We measure our success solely by customer peace of mind.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200/70 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span>Community Above All</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. HOW WE WORK: The Wide Service Advantage
        ========================================================= */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Showcase */}
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                  <img
                    src="/ac_service_tech.jpg"
                    alt="Technician servicing AC in Bangladesh"
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d49b1a] text-slate-950 text-xs font-black">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Certified Experts Only</span>
                    </div>
                    <h4 className="text-lg font-black leading-snug">
                      Trained in Safety, Equipped with Modern Diagnostic Tools
                    </h4>
                    <p className="text-xs text-slate-300">
                      Every technician undergoes rigorous skill testing and safety screening before receiving jobs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Pillars of Excellence */}
              <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-[#e0b328]/15 border border-[#e0b328]/40 text-[#0f172a] text-xs font-bold tracking-wide uppercase">
                    The Wide Service Advantage
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight mt-3">
                    Why Millions Rely on Wide Service
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 max-w-xl">
                    We combine intelligent digital tools with boots on the ground across major metropolitan areas and district towns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Feature 1 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#e0b328] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d49b1a] flex items-center justify-center font-bold mb-3.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#0f172a] mb-1.5">
                      Hyper-Local Radar
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Instant matching connects you with verified providers located within your specific ward, thana, or neighborhood.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#e0b328] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#0f172a] mb-1.5">
                      4-Step Verification
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      National ID cross-check, police verification record, hands-on skill verification, and address verification.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#e0b328] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3.5">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#0f172a] mb-1.5">
                      Direct Communication
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Speak directly via call or WhatsApp. No third-party middlemen withholding your technician’s direct line.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#e0b328] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#0f172a] mb-1.5">
                      24/7 Rapid Emergency
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Urgent water leak, short circuit, or AC breakdown at night? Our on-call emergency units respond immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. COMPANY JOURNEY & MILESTONES (Interactive Timeline)
        ========================================================= */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-[#0f172a] text-xs font-bold tracking-wide uppercase">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-3">
                From Rajshahi & Dhaka to Nationwide Trust
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                A brief look at how Wide Service grew into Bangladesh’s preferred digital service gateway.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Center Line for Desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

              <div className="space-y-12 relative">
                {/* Milestone 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#d49b1a] text-xs font-black">
                      Early 2024
                    </span>
                    <h3 className="text-lg font-black text-[#0f172a]">
                      The Genesis & Groundwork
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md md:ml-auto">
                      Founded to address the frustrating lack of verified, punctual home service technicians in Rajshahi and Dhaka metropolitan areas.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#d49b1a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white z-10">
                    1
                  </div>
                  <div className="md:w-1/2 text-left space-y-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md">
                      <span className="text-xs font-bold text-slate-700 block">
                        First 100 Verified Technicians
                      </span>
                      <span className="text-[11px] text-slate-500">
                        100% physically vetted technicians onboarded with manual NID authentication.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="md:w-1/2 md:text-left space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
                      Late 2024
                    </span>
                    <h3 className="text-lg font-black text-[#0f172a]">
                      Mobile Radar & Live Map Tech
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                      Launched dynamic React Native mobile app with real-time Leaflet OpenStreetMap radar, allowing customers to locate technicians nearby with precise distance calculations.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white z-10">
                    2
                  </div>
                  <div className="md:w-1/2 md:text-right space-y-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md md:ml-auto">
                      <span className="text-xs font-bold text-slate-700 block">
                        Direct Dial & WhatsApp Integration
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Customer inquiries transformed into 1-tap calls, reducing wait times from hours to 5 minutes.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                      2025
                    </span>
                    <h3 className="text-lg font-black text-[#0f172a]">
                      Expansion to 8 Divisions
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md md:ml-auto">
                      Onboarded 5,200+ technicians across Dhaka, Chittagong, Rajshahi, Sylhet, Khulna, Barishal, Rangpur, and Mymensingh.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white z-10">
                    3
                  </div>
                  <div className="md:w-1/2 text-left space-y-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md">
                      <span className="text-xs font-bold text-slate-700 block">
                        Over 48,000+ Completed Jobs
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Maintained a 96% customer satisfaction rating with rapid resolution standards.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="md:w-1/2 md:text-left space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d49b1a]/20 text-[#0f172a] text-xs font-black border border-[#d49b1a]">
                      Present & Future (2026+)
                    </span>
                    <h3 className="text-lg font-black text-[#0f172a]">
                      Omnichannel Web, Mobile & Enterprise
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                      Bridging web and mobile experiences with multi-lingual support, enterprise facility maintenance, and next-gen technician training institutes.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white z-10">
                    4
                  </div>
                  <div className="md:w-1/2 md:text-right space-y-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md md:ml-auto">
                      <span className="text-xs font-bold text-slate-700 block">
                        Nationwide Mission: 50,000+ Technicians
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Empowering tradespeople with formal digital certifications and guaranteed local work.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. STATS BANNER: Visual Impact
        ========================================================= */}
        <StatsBannerSection />

        {/* =========================================================
            6. APP DOWNLOAD SECTION: Dual Phone Mockup
        ========================================================= */}
        <AppDownloadSection />

        {/* =========================================================
            7. JOIN AS TECHNICIAN CALLOUT (Amber CTA)
        ========================================================= */}
        <section className="bg-gradient-to-r from-[#d49b1a] to-[#e0b328] py-14 text-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-black/15 text-slate-950 text-xs font-bold uppercase tracking-wider">
                  Technician Registration
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  Are You a Skilled Technician in Bangladesh?
                </h3>
                <p className="text-slate-900/90 text-sm max-w-xl font-medium">
                  Earn more, get direct customer bookings without middleman deductions, and grow your reputation with Wide Service.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-full bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Join as Technician
                </Link>
                <a
                  href="tel:+8801712345678"
                  className="px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-950 font-bold text-xs tracking-wide shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#d49b1a]" />
                  <span>Call Provider Desk</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
