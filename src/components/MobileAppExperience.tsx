"use client";

import React, { useState, useEffect } from "react";
import { Category, Subcategory, Service, UserLocation } from "../types";
import { getCategories, getServices, sortServicesByDistance } from "../lib/api";
import { ServiceCard } from "./ServiceCard";
import { ServiceDetailModal } from "./ServiceDetailModal";
import {
  Bell,
  Search,
  Navigation,
  Home,
  Layers,
  QrCode,
  MapPin,
  Settings,
  PhoneCall,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface MobileAppExperienceProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
}

export const MobileAppExperience: React.FC<MobileAppExperienceProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
}) => {
  const [activeTab, setActiveTab] = useState<"home" | "services" | "download" | "location">("home");
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [cats, srvRes] = await Promise.all([
          getCategories(),
          getServices({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
            limit: 50,
          }),
        ]);
        setCategories(cats);
        setServices(srvRes.services);
      } catch (e) {
        console.warn("Mobile app init error:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [userLocation.latitude, userLocation.longitude]);

  // Filter categories by search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter services by search & category
  const filteredServices = services
    .filter((s) => {
      if (selectedCategory && s.categoryId !== selectedCategory.id) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        s.address.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-950 min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* 1. Golden Yellow Top Header Matching Mobile App */}
      <div className="bg-[#e0b328] text-slate-950 px-5 pt-4 pb-3 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Location Area Selector */}
          <button
            onClick={onOpenLocationPicker}
            className="flex-1 text-left pr-2 cursor-pointer"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/90 block">
              My Location Area
            </span>
            <div className="flex items-center gap-1 font-black text-base text-slate-950 truncate tracking-tight">
              <span className="truncate">{userLocation.area}, {userLocation.city}</span>
              <span className="text-xs">▾</span>
            </div>
          </button>

          {/* Notification Bell Badge */}
          <button
            onClick={onOpenDownload}
            className="w-10 h-10 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 stroke-[2.4]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-600" />
          </button>
        </div>
      </div>

      {/* 2. Search Bar with App Styling */}
      <div className="px-4 my-3.5">
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-3.5 py-3 rounded-2xl shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category or service..."
            className="flex-1 text-xs text-slate-800 dark:text-slate-100 font-medium px-2.5 py-0 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 font-bold p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Fast Promo App Banner */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 rounded-2xl border border-slate-700/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              📲
            </div>
            <div>
              <div className="text-xs font-black text-amber-300">
                Wide Service Mobile App
              </div>
              <div className="text-[11px] text-slate-300">
                Direct GPS radar & 1-tap call
              </div>
            </div>
          </div>
          <button
            onClick={onOpenDownload}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer"
          >
            Get App
          </button>
        </div>
      </div>

      {/* 4. Exact 2-Column Categories Grid (from wide-service-app HomeScreen) */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
            Service Categories
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-400"
            >
              Show All
            </button>
          )}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredCategories.slice(0, 8).map((cat) => {
            const isSelected = selectedCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat)
                }
                className={`rounded-[10px] border p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 active:bg-slate-100"
                }`}
              >
                {/* Admin Icon */}
                <div className="w-12 h-12 mb-2 flex items-center justify-center">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🛠️</span>
                  )}
                </div>

                {/* Name */}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Nearby Services (Closest First) Section */}
      <div className="px-4 flex-1">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
              Nearby in {userLocation.area}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80">
            <span className="text-[10px] font-black text-amber-900 dark:text-amber-300">
              ⚡ Closest First
            </span>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 animate-pulse flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredServices.length > 0 ? (
            filteredServices.slice(0, 15).map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                userLocation={userLocation}
                onSelect={(s) => setSelectedService(s)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200">
              <span className="text-2xl block mb-2">🔍</span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                No nearby services match this search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Edge-to-Edge Native Bottom Navigation Bar Matching App */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-lg px-4 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home Tab */}
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedCategory(null);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "home"
                ? "text-slate-950 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 ${
                activeTab === "home"
                  ? "bg-[#e0b328] text-slate-950 shadow-xs"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <Home className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Home</span>
            {activeTab === "home" && (
              <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
            )}
          </button>

          {/* Services Tab */}
          <button
            onClick={() => {
              setActiveTab("services");
              const el = document.getElementById("services");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "services"
                ? "text-slate-950 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 ${
                activeTab === "services"
                  ? "bg-[#e0b328] text-slate-950 shadow-xs"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <Layers className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Services</span>
            {activeTab === "services" && (
              <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
            )}
          </button>

          {/* App / Scanner Tab */}
          <button
            onClick={() => {
              setActiveTab("download");
              onOpenDownload();
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "download"
                ? "text-slate-950 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 ${
                activeTab === "download"
                  ? "bg-[#e0b328] text-slate-950 shadow-xs"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <QrCode className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Scanner</span>
            {activeTab === "download" && (
              <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
            )}
          </button>

          {/* Location / Settings Tab */}
          <button
            onClick={() => {
              setActiveTab("location");
              onOpenLocationPicker();
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "location"
                ? "text-slate-950 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 ${
                activeTab === "location"
                  ? "bg-[#e0b328] text-slate-950 shadow-xs"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <MapPin className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Location</span>
            {activeTab === "location" && (
              <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        userLocation={userLocation}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};
