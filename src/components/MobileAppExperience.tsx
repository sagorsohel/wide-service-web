"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Category, Subcategory, Service, UserLocation } from "../types";
import {
  getCategories,
  getSubcategories,
  getServices,
  sortServicesByDistance,
  formatDistance,
  calculateHaversineDistanceKm,
} from "../lib/api";
import { ServiceCard } from "./ServiceCard";
import { ServiceMapEmbed } from "./ServiceMapEmbed";
import {
  Bell,
  Search,
  Navigation,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
  PhoneCall,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Compass,
  RotateCcw,
  SearchX,
  MapPinOff,
  Sparkles,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  HelpCircle,
  Globe,
  Radio,
} from "lucide-react";

interface MobileAppExperienceProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
}

const RADIUS_OPTIONS = [
  { label: "All Distance", value: null },
  { label: "Within 1 km", value: 1 },
  { label: "Within 2 km", value: 2 },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
];

export const MobileAppExperience: React.FC<MobileAppExperienceProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
}) => {
  // Navigation Screens matching app/App.tsx:
  // - null: HomeScreen
  // - selectedCategory && !selectedSubcategory: CategoryDetailScreen
  // - selectedCategory && selectedSubcategory: SubcategoryDetailScreen
  // - selectedService: ServiceDetailScreen
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Tab State on HomeScreen: "home" | "setting"
  const [activeTab, setActiveTab] = useState<"home" | "setting">("home");

  // Filter & Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);

  // Service Detail Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Load initial categories & all nearby services
  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      try {
        const [cats, srvRes] = await Promise.all([
          getCategories(),
          getServices({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
            limit: 100,
          }),
        ]);
        if (isMounted) {
          setCategories(cats);
          setServices(srvRes.services);
        }
      } catch (e) {
        console.warn("Mobile app init error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [userLocation.latitude, userLocation.longitude]);

  // Load subcategories whenever selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    let isMounted = true;
    setCategoryLoading(true);
    getSubcategories(selectedCategory.id)
      .then((subs) => {
        if (isMounted) {
          setSubcategories(subs);
          setCategoryLoading(false);
        }
      })
      .catch((e) => {
        console.warn("Subcategory load error:", e);
        if (isMounted) setCategoryLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory?.id]);

  // Reset active image index when switching selected service
  useEffect(() => {
    setActiveImageIndex(0);
    if (selectedService) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedService?.id]);

  // Handle browser back button (hardware / swipe back)
  useEffect(() => {
    const handlePopState = () => {
      if (selectedService) {
        setSelectedService(null);
      } else if (selectedSubcategory) {
        setSelectedSubcategory(null);
      } else if (selectedCategory) {
        setSelectedCategory(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedService, selectedSubcategory, selectedCategory]);

  // Filter categories by search on Home Screen
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  // Filter services on Home Screen
  const filteredHomeServices = useMemo(() => {
    const withDist = sortServicesByDistance(services, userLocation);
    if (!searchQuery) return withDist;
    const q = searchQuery.toLowerCase();
    return withDist.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        (s.categoryName && s.categoryName.toLowerCase().includes(q)) ||
        (s.subcategoryName && s.subcategoryName.toLowerCase().includes(q)) ||
        s.address.toLowerCase().includes(q)
    );
  }, [services, searchQuery, userLocation]);

  // Filter services for CategoryDetailScreen by Category & Radius
  const categoryServices = useMemo(() => {
    if (!selectedCategory) return [];
    const catList = services.filter((s) => s.categoryId === selectedCategory.id);
    const sorted = sortServicesByDistance(catList, userLocation);
    if (selectedRadius === null) return sorted;
    return sorted.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
  }, [services, selectedCategory, selectedRadius, userLocation]);

  // Filter services for SubcategoryDetailScreen by Subcategory & Radius
  const subcategoryServices = useMemo(() => {
    if (!selectedSubcategory) return [];
    const subList = services.filter((s) => s.subcategoryId === selectedSubcategory.id);
    const sorted = sortServicesByDistance(subList, userLocation);
    if (selectedRadius === null) return sorted;
    return sorted.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
  }, [services, selectedSubcategory, selectedRadius, userLocation]);

  // Phone Call Action
  const handleCall = (phone?: string) => {
    if (!phone) {
      alert("No phone number available for this service.");
      return;
    }
    const cleanNumber = phone.replace(/[^0-9+]/g, "");
    window.location.href = `tel:${cleanNumber}`;
  };

  // WhatsApp Action
  const handleWhatsApp = (whatsapp?: string, serviceName?: string) => {
    if (!whatsapp) {
      alert("No WhatsApp number available for this service.");
      return;
    }
    const cleanNumber = whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello, I found "${serviceName || "your service"}" on Wide Service. I want to book an appointment.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  // Share Service
  const handleShare = async (srv: Service) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: srv.name,
          text: `Check out ${srv.name} on Wide Service:`,
          url,
        });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Service link copied to clipboard!");
      } catch {
        alert(`Share link: ${url}`);
      }
    }
  };

  // Gallery images parser for ServiceDetailScreen
  const serviceGalleryImages: string[] = useMemo(() => {
    if (!selectedService) return [];
    const list: string[] = [];
    if (Array.isArray(selectedService.images)) {
      list.push(
        ...selectedService.images.filter(
          (img): img is string => typeof img === "string" && Boolean(img.trim())
        )
      );
    } else if (typeof selectedService.images === "string") {
      try {
        const parsed = JSON.parse(selectedService.images);
        if (Array.isArray(parsed)) {
          list.push(
            ...parsed.filter(
              (img): img is string => typeof img === "string" && Boolean(img.trim())
            )
          );
        }
      } catch {
        list.push(
          ...selectedService.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }
    }

    if (
      selectedService.logo &&
      typeof selectedService.logo === "string" &&
      selectedService.logo.trim() &&
      !list.includes(selectedService.logo.trim())
    ) {
      list.unshift(selectedService.logo.trim());
    }

    if (list.length > 0) return list;
    return ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"];
  }, [selectedService]);

  // Service distance for ServiceDetailScreen
  const serviceDistanceKm = useMemo(() => {
    if (!selectedService) return null;
    if (selectedService.distanceKm != null) return selectedService.distanceKm;
    if (
      userLocation?.latitude != null &&
      userLocation?.longitude != null &&
      selectedService.latitude != null &&
      selectedService.longitude != null
    ) {
      return calculateHaversineDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        selectedService.latitude,
        selectedService.longitude
      );
    }
    return null;
  }, [selectedService, userLocation]);

  /* =========================================================================
     VIEW 1: SERVICE DETAIL SCREEN (Exact Match to app/src/components/ServiceDetailScreen.tsx)
     ========================================================================= */
  if (selectedService) {
    const srv = selectedService;
    return (
      <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900">
        {/* Golden Header matching app/App.tsx */}
        <div className="bg-[#e0b328] px-4 pt-3 pb-3 sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <button
            onClick={() => setSelectedService(null)}
            className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
          </button>

          <div className="flex-1 px-3 text-center truncate">
            <h2 className="text-sm font-black text-slate-950 truncate tracking-tight">
              {srv.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleShare(srv)}
              className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4 stroke-[2.4]" />
            </button>
            <button
              onClick={() => handleCall(srv.phone)}
              className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-colors cursor-pointer"
              title="Call"
            >
              <Phone className="w-4 h-4 stroke-[2.4]" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 bg-white">
          {/* 1. Image Gallery Showcase */}
          <div className="relative w-full aspect-4/3 bg-slate-900 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={serviceGalleryImages[activeImageIndex]}
              alt={srv.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Prev / Next Arrows */}
            {serviceGalleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? serviceGalleryImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === serviceGalleryImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter Badge */}
            {serviceGalleryImages.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-black">
                {activeImageIndex + 1} / {serviceGalleryImages.length}
              </div>
            )}
          </div>

          {/* 2. Primary Service Details */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            {/* Category & Distance Pills */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              {srv.categoryName && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 text-[11px] font-black">
                  {srv.categoryName}
                </span>
              )}
              {srv.subcategoryName && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
                  {srv.subcategoryName}
                </span>
              )}
              {serviceDistanceKm !== null && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                  <span>⚡</span>
                  <span>{formatDistance(serviceDistanceKm)}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug mb-3">
              {srv.name}
            </h1>

            {/* Verified Provider Badge */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-700 stroke-[2.4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 truncate">
                    {srv.businessName || "Verified Service Partner"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified Local Technician
                </span>
              </div>
            </div>

            {/* Action Buttons: 1-Tap Call & WhatsApp */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleCall(srv.phone)}
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 stroke-[2.4]" />
                <span>Call Now</span>
              </button>
              <button
                onClick={() => handleWhatsApp(srv.whatsapp || srv.phone, srv.name)}
                className="py-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 stroke-[2.4]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* 3. About Service / Description */}
          {srv.description && (
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                About This Service
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {srv.description}
              </p>
            </div>
          )}

          {/* 4. Service Location & Schedule */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
              Location & Availability
            </h3>

            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">Address</div>
                <div className="text-xs text-slate-600 leading-relaxed font-medium">
                  {srv.address}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">Working Hours</div>
                <div className="text-xs text-slate-600 font-medium">
                  {srv.schedule || "Open Everyday: 8:00 AM - 10:00 PM"}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Live Radar Map Embed */}
          {srv.latitude != null && srv.longitude != null && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Technician Live Location
                </h3>
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  <span>GPS Radar</span>
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <ServiceMapEmbed
                  serviceLat={Number(srv.latitude)}
                  serviceLng={Number(srv.longitude)}
                  serviceName={srv.name}
                  userLat={userLocation.latitude}
                  userLng={userLocation.longitude}
                  height={220}
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Bottom Quick Call Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-md p-3 px-4 shadow-xl">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <button
              onClick={() => handleCall(srv.phone)}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Technician ({srv.phone})</span>
            </button>
            <button
              onClick={() => handleWhatsApp(srv.whatsapp || srv.phone, srv.name)}
              className="w-12 h-12 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 2: SUBCATEGORY DETAIL SCREEN (app/src/components/SubcategoryDetailScreen.tsx)
     ========================================================================= */
  if (selectedSubcategory && selectedCategory) {
    const subCat = selectedSubcategory;
    const cat = selectedCategory;

    return (
      <div className="w-full bg-[#e0b328] min-h-screen flex flex-col font-sans select-none pb-16">
        {/* Golden Header */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-colors cursor-pointer -ml-1"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>

            {/* Emblem & Title */}
            <div className="flex-1 px-2 flex items-center justify-center truncate">
              <div className="w-8 h-8 rounded-xl bg-white/80 border border-white flex items-center justify-center mr-2 shadow-xs shrink-0 overflow-hidden">
                {subCat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={subCat.image}
                    alt={subCat.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <span className="text-sm">🔧</span>
                )}
              </div>
              <div className="truncate text-left">
                <h2 className="text-base font-black text-slate-950 tracking-tight truncate leading-tight">
                  {subCat.name}
                </h2>
                <div className="text-[10px] font-bold text-slate-800/80 truncate">
                  {cat.name}
                </div>
              </div>
            </div>

            <div className="w-10 h-10" />
          </div>
        </div>

        {/* Curvy Light Content Body */}
        <div className="flex-1 bg-[#f8fafc] rounded-t-[32px] pt-4 px-4 pb-12 shadow-md">
          {/* Proximity / Distance Radius Chips Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>Nearby in {userLocation.area}</span>
              </div>
              <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                ⚡ Closest First
              </span>
            </div>

            {/* Radius Chips Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {RADIUS_OPTIONS.map((opt) => {
                const isActive = selectedRadius === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedRadius(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#e0b328] text-slate-950 shadow-xs border border-amber-500 font-black"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Services List */}
          <div className="space-y-3">
            {subcategoryServices.length > 0 ? (
              subcategoryServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  userLocation={userLocation}
                  onSelect={(s) => setSelectedService(s)}
                />
              ))
            ) : (
              /* No Services Empty State matching app/src/components/NoServicesEmptyState.tsx */
              <div className="py-12 px-4 text-center bg-white rounded-3xl border border-slate-200 mt-2">
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center mb-4 relative">
                  {selectedRadius ? (
                    <MapPinOff className="w-8 h-8 text-amber-700" />
                  ) : (
                    <SearchX className="w-8 h-8 text-amber-700" />
                  )}
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#e0b328] border-2 border-white flex items-center justify-center text-xs">
                    ⚡
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {selectedRadius
                    ? `No Services Within ${selectedRadius} km`
                    : "No Service Providers Found"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 leading-relaxed font-medium">
                  {selectedRadius
                    ? `We couldn't find "${subCat.name}" services within ${selectedRadius} km of ${userLocation.area}. Try expanding the radius.`
                    : `There are currently no active providers listed for "${subCat.name}" in this area.`}
                </p>

                {selectedRadius !== null && (
                  <button
                    onClick={() => setSelectedRadius(null)}
                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Show All Services (Clear Filter)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 3: CATEGORY DETAIL SCREEN (app/src/components/CategoryDetailScreen.tsx)
     ========================================================================= */
  if (selectedCategory) {
    const cat = selectedCategory;

    return (
      <div className="w-full bg-[#e0b328] min-h-screen flex flex-col font-sans select-none pb-16">
        {/* Golden Header */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-950 transition-colors cursor-pointer -ml-1"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>

            {/* Emblem & Title */}
            <div className="flex-1 px-2 flex items-center justify-center truncate">
              <div className="w-8 h-8 rounded-xl bg-white/80 border border-white flex items-center justify-center mr-2 shadow-xs shrink-0 overflow-hidden">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <span className="text-sm">🛠️</span>
                )}
              </div>
              <h2 className="text-base font-black text-slate-950 tracking-tight truncate">
                {cat.name}
              </h2>
            </div>

            <div className="w-10 h-10" />
          </div>
        </div>

        {/* Curvy Light Content Body */}
        <div className="flex-1 bg-[#f8fafc] rounded-t-[32px] pt-5 px-4 pb-12 shadow-md">
          {/* Subcategories 2-Column Grid (app/src/components/CategoryDetailScreen.tsx) */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                Subcategories
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {subcategories.length} available
              </span>
            </div>

            {categoryLoading ? (
              <div className="grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-3 border border-slate-200 animate-pulse flex flex-col items-center justify-center h-24"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-200 mb-2" />
                    <div className="w-16 h-3 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : subcategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {subcategories.map((subCat) => (
                  <button
                    key={subCat.id}
                    onClick={() => setSelectedSubcategory(subCat)}
                    className="bg-white rounded-xl border border-slate-200/90 hover:border-amber-500/60 p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      {subCat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={subCat.image}
                          alt={subCat.name}
                          className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-2xl">🔧</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {subCat.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 font-medium">
                No subcategories listed for this category.
              </div>
            )}
          </div>

          {/* Proximity Radius Filter Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>Services in {cat.name}</span>
              </div>
              <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                ⚡ Closest First
              </span>
            </div>

            {/* Radius Chips Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {RADIUS_OPTIONS.map((opt) => {
                const isActive = selectedRadius === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedRadius(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#e0b328] text-slate-950 shadow-xs border border-amber-500 font-black"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Services List */}
          <div className="space-y-3">
            {categoryServices.length > 0 ? (
              categoryServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  userLocation={userLocation}
                  onSelect={(s) => setSelectedService(s)}
                />
              ))
            ) : (
              /* No Services Empty State */
              <div className="py-12 px-4 text-center bg-white rounded-3xl border border-slate-200 mt-2">
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center mb-4 relative">
                  {selectedRadius ? (
                    <MapPinOff className="w-8 h-8 text-amber-700" />
                  ) : (
                    <SearchX className="w-8 h-8 text-amber-700" />
                  )}
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#e0b328] border-2 border-white flex items-center justify-center text-xs">
                    ⚡
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {selectedRadius
                    ? `No Services Within ${selectedRadius} km`
                    : "No Service Providers Found"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 leading-relaxed font-medium">
                  {selectedRadius
                    ? `We couldn't find "${cat.name}" services within ${selectedRadius} km of ${userLocation.area}. Try expanding the radius.`
                    : `There are currently no active providers listed for "${cat.name}" in this area.`}
                </p>

                {selectedRadius !== null && (
                  <button
                    onClick={() => setSelectedRadius(null)}
                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Show All Services (Clear Filter)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 4: SETTINGS SCREEN (app/src/components/SettingsScreen.tsx)
     ========================================================================= */
  if (activeTab === "setting") {
    return (
      <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900">
        {/* Settings Header */}
        <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Settings
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage your location and app preferences
          </p>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-5">
          {/* 1. Highlighted Location Card with #e0b328 Border */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Service Location
            </span>
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e0b328] shadow-md shadow-amber-500/10">
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-center">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-300 flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                      Current Location
                    </span>
                    <span className="text-base font-black text-slate-900 tracking-tight block">
                      {userLocation.area || "Not Selected"}
                    </span>
                  </div>
                </div>

                <span className="bg-amber-100 px-3 py-1 rounded-full border border-amber-300 text-xs font-bold text-amber-950">
                  {userLocation.city || "Bangladesh"}
                </span>
              </div>

              {/* Full Address */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Full Address
                </span>
                <span className="text-xs font-bold text-slate-800 leading-snug block">
                  {userLocation.address || "Tap below to change location."}
                </span>
              </div>

              {/* Change Location Button */}
              <button
                onClick={onOpenLocationPicker}
                className="w-full bg-[#e0b328] hover:bg-[#d49b1a] py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-md shadow-amber-500/25 active:scale-98 transition-all cursor-pointer font-black text-slate-950 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>Change Location On Map</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

          {/* 2. Preferences & Information */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 px-1">
              App Preferences
            </span>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Language</div>
                    <div className="text-[11px] text-slate-400">English (Default)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">EN</span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">GPS Proximity Radar</div>
                    <div className="text-[11px] text-slate-400">Automatic closest technician</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <button
                onClick={onOpenDownload}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Get Mobile App</div>
                    <div className="text-[11px] text-slate-400">Install native APK / iOS app</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-lg px-4 py-2 shadow-2xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {/* Home Tab */}
            <button
              onClick={() => setActiveTab("home")}
              className="flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all cursor-pointer text-slate-400 hover:text-slate-600"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 text-slate-500">
                <Home className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Home</span>
            </button>

            {/* Settings Tab */}
            <button
              onClick={() => setActiveTab("setting")}
              className="flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all cursor-pointer text-slate-950 font-black"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 bg-[#e0b328] text-slate-950 shadow-xs">
                <Settings className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Settings</span>
              <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 5: HOME SCREEN (Exact Match to app/src/components/HomeScreen.tsx)
     ========================================================================= */
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col pb-24 font-sans select-none text-slate-900">
      {/* 1. Golden Yellow Top Header Matching Mobile App (app/src/components/HomeScreen.tsx) */}
      <div className="bg-[#e0b328] text-slate-950 px-5 pt-4 pb-3 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Location Area Selector */}
          <button
            onClick={onOpenLocationPicker}
            className="flex-1 text-left pr-2 cursor-pointer group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/90 block">
              My Location Area
            </span>
            <div className="flex items-center gap-1 font-black text-base text-slate-950 truncate tracking-tight">
              <span className="truncate">
                {userLocation.area}, {userLocation.city}
              </span>
              <span className="text-xs group-hover:translate-y-0.5 transition-transform">
                ▾
              </span>
            </div>
          </button>

          {/* Notification Bell Badge */}
          <button
            onClick={onOpenDownload}
            className="w-10 h-10 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center relative transition-colors cursor-pointer shrink-0"
            title="Notifications / App"
          >
            <Bell className="w-4 h-4 stroke-[2.4]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-600" />
          </button>
        </div>
      </div>

      {/* 2. Search Bar with App Styling */}
      <div className="px-4 my-3.5">
        <div className="flex items-center bg-white border border-slate-200 px-3.5 py-3 rounded-2xl shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category or service..."
            className="flex-1 text-xs text-slate-800 font-medium px-2.5 py-0 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 font-bold p-1 hover:text-slate-600 cursor-pointer"
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
            className="px-3 py-1.5 rounded-xl bg-[#e0b328] hover:bg-[#d49b1a] text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer"
          >
            Get App
          </button>
        </div>
      </div>

      {/* 4. Exact 2-Column Categories Grid (from wide-service-app HomeScreen) */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
            Popular Categories
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {filteredCategories.length} Categories
          </span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {loading && categories.length === 0
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 py-3.5 px-3 flex flex-col items-center justify-center animate-pulse"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-200 mb-2" />
                  <div className="w-20 h-3 bg-slate-200 rounded" />
                </div>
              ))
            : filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory(null);
                  }}
                  className="bg-white rounded-xl border border-slate-200/90 hover:border-amber-500/60 p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition-all active:scale-98 cursor-pointer group"
                >
                  {/* Dynamic Category Image from Backend */}
                  <div className="w-14 h-14 mb-2 flex items-center justify-center">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-2xl">🛠️</span>
                    )}
                  </div>

                  {/* Category Name */}
                  <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
        </div>
      </div>

      {/* 5. Nearby Services (Closest First) Section */}
      <div className="px-4 flex-1">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-black text-slate-900 truncate">
              Nearby in {userLocation.area}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
            <span className="text-[10px] font-black text-amber-900">
              ⚡ Closest First
            </span>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {loading && services.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 animate-pulse flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredHomeServices.length > 0 ? (
            filteredHomeServices.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                userLocation={userLocation}
                onSelect={(s) => setSelectedService(s)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <span className="text-2xl block mb-2">🔍</span>
              <p className="text-xs font-bold text-slate-600">
                No nearby services match your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Edge-to-Edge Native Bottom Navigation Bar Matching App */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-lg px-4 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home Tab */}
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
            className="flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all cursor-pointer text-slate-950 font-black"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 bg-[#e0b328] text-slate-950 shadow-xs">
              <Home className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Home</span>
            <div className="w-3.5 h-0.5 rounded-full bg-[#e0b328] mt-0.5" />
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab("setting")}
            className="flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all cursor-pointer text-slate-400 hover:text-slate-600"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 bg-transparent text-slate-500">
              <Settings className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
