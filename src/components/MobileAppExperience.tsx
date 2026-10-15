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
  loginUser,
  registerUser,
} from "../lib/api";

export interface UserProfile {
  id?: number | string;
  name?: string;
  displayName?: string | null;
  phone?: string;
  phoneNumber?: string | null;
  email?: string | null;
  role?: string;
  token?: string;
  firebaseToken?: string | null;
  photoURL?: string | null;
  createdAt?: string;
}
import {
  Bell,
  Search,
  Navigation,
  LayoutGrid,
  Home,
  Settings,
  Zap,
  Headphones,
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
  User,
  Info,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  HeartHandshake,
  UserCheck,
  Award,
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Tab State: "home" | "find" | "about" | "setting" | "profile"
  const [activeTab, setActiveTab] = useState<
    "home" | "find" | "about" | "setting" | "profile"
  >("home");

  // User Authentication State (Backend API powered)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Restore authenticated session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wide_service_auth_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {}
  }, []);

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

  // Navigation Handlers for Bottom Bar
  const handleGoHome = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoAbout = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoFind = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("find");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoSettings = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("setting");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoProfile = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auth Action Handlers (Powered by Backend API)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMode === "login") {
      if (!authEmail.trim() || !authPassword.trim()) {
        setAuthError("Please enter your phone/email and password.");
        return;
      }

      setAuthLoading(true);
      try {
        const res = await loginUser(authEmail.trim(), authPassword.trim());
        if (!res.success || !res.data) {
          setAuthError(res.message || "Invalid phone number/email or password.");
          return;
        }

        const userObj: UserProfile = {
          id: res.data.id,
          name: res.data.name,
          displayName: res.data.name,
          phone: res.data.phone,
          phoneNumber: res.data.phone,
          email: res.data.email,
          role: res.data.role,
          token: res.data.token,
          firebaseToken: res.data.firebaseToken,
          createdAt: new Date().toLocaleDateString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem("wide_service_auth_user", JSON.stringify(userObj));
        } catch {}

        setAuthSuccess("Successfully logged in!");
        setAuthPassword("");
      } catch (err: any) {
        setAuthError(err?.message || "Failed to log in.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Signup Mode
      if (!authName.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (!authPhone.trim()) {
        setAuthError("Please enter your phone number.");
        return;
      }
      if (!authPassword.trim() || authPassword.length < 6) {
        setAuthError("Password should be at least 6 characters.");
        return;
      }

      setAuthLoading(true);
      try {
        const res = await registerUser(
          authName.trim(),
          authPhone.trim(),
          authPassword.trim(),
          authEmail.trim() || undefined
        );

        if (!res.success || !res.data) {
          setAuthError(res.message || "Failed to create account.");
          return;
        }

        const userObj: UserProfile = {
          id: res.data.id,
          name: res.data.name,
          displayName: res.data.name,
          phone: res.data.phone,
          phoneNumber: res.data.phone,
          email: res.data.email,
          role: res.data.role,
          token: res.data.token,
          firebaseToken: res.data.firebaseToken,
          createdAt: new Date().toLocaleDateString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem("wide_service_auth_user", JSON.stringify(userObj));
        } catch {}

        setAuthSuccess("Account created successfully!");
        setAuthPassword("");
      } catch (err: any) {
        setAuthError(err?.message || "Failed to create account.");
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("wide_service_auth_user");
    } catch {}
    setAuthSuccess(null);
    setAuthError(null);
  };

  // Filter categories by search on Home Screen
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  // Filter services for CategoryDetailScreen by Category & Radius
  const categoryServices = useMemo(() => {
    if (!selectedCategory) return [];
    const catList = services.filter(
      (s) => s.categoryId === selectedCategory.id,
    );
    const sorted = sortServicesByDistance(catList, userLocation);
    if (selectedRadius === null) return sorted;
    return sorted.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
  }, [services, selectedCategory, selectedRadius, userLocation]);

  // Filter services for SubcategoryDetailScreen by Subcategory & Radius
  const subcategoryServices = useMemo(() => {
    if (!selectedSubcategory) return [];
    const subList = services.filter(
      (s) => s.subcategoryId === selectedSubcategory.id,
    );
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
      `Hello, I found "${serviceName || "your service"}" on Wide Service. I want to book an appointment.`,
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
          (img): img is string =>
            typeof img === "string" && Boolean(img.trim()),
        ),
      );
    } else if (typeof selectedService.images === "string") {
      try {
        const parsed = JSON.parse(selectedService.images);
        if (Array.isArray(parsed)) {
          list.push(
            ...parsed.filter(
              (img): img is string =>
                typeof img === "string" && Boolean(img.trim()),
            ),
          );
        }
      } catch {
        list.push(
          ...selectedService.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
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
    return [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    ];
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
        selectedService.longitude,
      );
    }
    return null;
  }, [selectedService, userLocation]);

  // Services list for Find tab (with live search & radius filtering)
  const findServicesList = useMemo(() => {
    let list = services;
    if (selectedRadius !== null) {
      list = list.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
    }
    const withDist = sortServicesByDistance(list, userLocation);
    if (!searchQuery.trim()) return withDist;
    const q = searchQuery.toLowerCase().trim();
    return withDist.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        (s.categoryName && s.categoryName.toLowerCase().includes(q)) ||
        (s.subcategoryName && s.subcategoryName.toLowerCase().includes(q)) ||
        s.address.toLowerCase().includes(q),
    );
  }, [services, selectedRadius, userLocation, searchQuery]);

  // Active Tab flags
  const isHomeActive =
    activeTab === "home" && !selectedCategory && !selectedService;
  const isAboutActive =
    activeTab === "about" && !selectedCategory && !selectedService;
  const isFindActive =
    activeTab === "find" && !selectedCategory && !selectedService;
  const isSettingsActive =
    activeTab === "setting" && !selectedCategory && !selectedService;
  const isProfileActive =
    activeTab === "profile" && !selectedCategory && !selectedService;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none text-slate-900 relative">
      {/* =========================================================================
          VIEW 1: SERVICE DETAIL SCREEN
          ========================================================================= */}
      {selectedService ? (
        <div className="w-full min-h-screen flex flex-col pb-36 text-slate-900">
          {/* Sticky Header (Clean Light Mode) */}
          <div
            className="bg-[#e0b328] backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-3 sticky top-0 z-40 shadow-xs flex items-center justify-between"
            style={{ position: "sticky", top: 0, zIndex: 40 }}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="w-10 h-10 rounded-full bg-black/10 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>

            <div className="flex-1 px-3 text-center truncate">
              <h2 className="text-sm font-black text-slate-900 truncate tracking-tight">
                {selectedService.name}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleShare(selectedService)}
                className="w-10 h-10 rounded-full bg-black/10 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4 stroke-[2.4]" />
              </button>
              <button
                onClick={() => handleCall(selectedService.phone)}
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
            <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={serviceGalleryImages[activeImageIndex]}
                alt={selectedService.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev / Next Arrows */}
              {serviceGalleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? serviceGalleryImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === serviceGalleryImages.length - 1 ? 0 : prev + 1,
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
                {/* {selectedService.categoryName && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 text-[11px] font-black">
                    {selectedService.categoryName}
                  </span>
                )}
                {selectedService.subcategoryName && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
                    {selectedService.subcategoryName}
                  </span>
                )} */}
                {serviceDistanceKm !== null && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                    <span>⚡</span>
                    <span>{formatDistance(serviceDistanceKm)}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug mb-3">
                {selectedService.name}
              </h1>

              {/* Verified Provider Badge */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-700 stroke-[2.4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {selectedService.businessName ||
                        "Verified Service Partner"}
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
                  onClick={() => handleCall(selectedService.phone)}
                  className="py-3 px-3 rounded-xl bg-black/10 hover:bg-black/20 text-black font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 stroke-[2.4]" />
                  <span>Call Now</span>
                </button>
                <button
                  onClick={() =>
                    handleWhatsApp(
                      selectedService.whatsapp || selectedService.phone,
                      selectedService.name,
                    )
                  }
                  className="py-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 stroke-[2.4]" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* 3. About Service / Description */}
            {selectedService.description && (
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  About This Service
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {selectedService.description}
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
                  <div className="text-xs font-bold text-slate-900">
                    Address
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedService.address}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Working Hours
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {selectedService.schedule ||
                      "Open Everyday: 8:00 AM - 10:00 PM"}
                  </div>
                </div>
              </div>
            </div>
            {/* 5. Live Radar Map Embed */}
            {selectedService.latitude != null &&
              selectedService.longitude != null && (
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
                      serviceLat={Number(selectedService.latitude)}
                      serviceLng={Number(selectedService.longitude)}
                      serviceName={selectedService.name}
                      userLat={userLocation.latitude}
                      userLng={userLocation.longitude}
                      height={220}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Floating Bottom Booking Bar (Docked right above the persistent bottom navigation bar) */}
          <div className="fixed bottom-[60px] left-0 right-0 z-40 flex justify-center pointer-events-none px-0">
            <div className="pointer-events-auto w-full max-w-md mx-auto bg-white/95 border-t border-slate-200 backdrop-blur-md p-2.5 px-4 shadow-lg">
              <div className="flex items-center gap-2">
              <button
                onClick={() => handleCall(selectedService.phone)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call ({selectedService.phone})</span>
              </button>
              <button
                onClick={() =>
                  handleWhatsApp(
                    selectedService.whatsapp || selectedService.phone,
                    selectedService.name,
                  )
                }
                className="w-11 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : selectedSubcategory && selectedCategory ? (
        /* =========================================================================
           VIEW 2: SUBCATEGORY DETAIL SCREEN
           ========================================================================= */
        <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28">
          {/* Sticky Fixed Header (Light Mode, No Yellow) */}
          <div
            className="sticky top-0 z-40 bg-[#e0b328] backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-3 shadow-xs"
            style={{ position: "sticky", top: 0, zIndex: 40 }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className="w-10 h-10 rounded-full bg-black/10 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer -ml-1"
                title="Back"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
              </button>

              {/* Emblem & Title */}
              <div className="flex-1 px-2 flex items-center justify-center truncate">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center mr-2 shadow-xs shrink-0 overflow-hidden">
                  {selectedSubcategory.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedSubcategory.image}
                      alt={selectedSubcategory.name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <span className="text-sm">🔧</span>
                  )}
                </div>
                <div className="truncate text-left">
                  <h2 className="text-base font-black text-slate-900 tracking-tight truncate leading-tight">
                    {selectedSubcategory.name}
                  </h2>
                  <div className="text-[10px] font-bold text-slate-500 truncate">
                    {selectedCategory.name}
                  </div>
                </div>
              </div>

              <div className="w-10 h-10" />
            </div>
          </div>

          {/* Light Content Body */}
          <div className="flex-1 bg-[#f8fafc] pt-4 px-4 pb-12">
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
                      ? `We couldn't find "${selectedSubcategory.name}" services within ${selectedRadius} km of ${userLocation.area}. Try expanding the radius.`
                      : `There are currently no active providers listed for "${selectedSubcategory.name}" in this area.`}
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
      ) : selectedCategory ? (
        /* =========================================================================
           VIEW 3: CATEGORY DETAIL SCREEN
           ========================================================================= */
        <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28">
          {/* Sticky Fixed Header (Light Mode, No Yellow) */}
          <div
            className="sticky top-0 z-40 bg-[#e0b328] backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-3 shadow-xs"
            style={{ position: "sticky", top: 0, zIndex: 40 }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className="w-10 h-10 rounded-full bg-black/10 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer -ml-1"
                title="Back"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
              </button>

              {/* Emblem & Title */}
              <div className="flex-1 px-2 flex items-center justify-center truncate">
                <div className="w-8 h-8 rounded-xl bg-black border border-slate-200/90 flex items-center justify-center mr-2 shadow-xs shrink-0 overflow-hidden">
                  {selectedCategory.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <span className="text-sm">🛠️</span>
                  )}
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight truncate">
                  {selectedCategory.name}
                </h2>
              </div>

              <div className="w-10 h-10" />
            </div>
          </div>

          {/* Light Content Body */}
          <div className="flex-1 bg-[#f8fafc] pt-5 px-4 pb-12">
            {/* Subcategories 2-Column Grid */}
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
                  <span>Services in {selectedCategory.name}</span>
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
                      ? `We couldn't find "${selectedCategory.name}" services within ${selectedRadius} km of ${userLocation.area}. Try expanding the radius.`
                      : `There are currently no active providers listed for "${selectedCategory.name}" in this area.`}
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
      ) : activeTab === "find" ? (
        /* =========================================================================
           VIEW: FIND SERVICES SCREEN
           ========================================================================= */
        <div className="w-full min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900 bg-[#f8fafc]">
          {/* Top Sticky Header */}
          <div
            className="sticky top-0 z-40 bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/90 px-4 pt-3 pb-3 shadow-2xs"
            style={{ position: "sticky", top: 0, zIndex: 40 }}
          >
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <div>
                <h1 className="text-xl font-black text-slate-950 tracking-tight">
                  Find Services
                </h1>
                <button
                  onClick={onOpenLocationPicker}
                  className="flex items-center text-xs font-bold text-slate-500 hover:text-amber-700 transition-colors mt-0.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#e0b328] mr-1 shrink-0" />
                  <span className="truncate max-w-[200px]">
                    {userLocation.area ||
                      userLocation.city ||
                      "Dhaka, Bangladesh"}
                  </span>
                </button>
              </div>

              <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                ⚡ Closest First
              </span>
            </div>

            {/* Live Search Input Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center px-3.5 py-2.5 mb-2.5">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service, category, or technician..."
                className="flex-1 text-xs text-slate-800 font-medium px-2 py-0 bg-transparent focus:outline-none"
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

            {/* Radius Filter Chips */}
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

          {/* Services List */}
          <div className="px-4 pt-4 flex-1 space-y-3">
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
            ) : findServicesList.length > 0 ? (
              findServicesList.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  userLocation={userLocation}
                  onSelect={(s) => setSelectedService(s)}
                />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 mt-2">
                <span className="text-3xl block mb-2">🔍</span>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  No services found
                </h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query or radius filter.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "setting" ? (
        /* =========================================================================
           VIEW 4: SETTINGS SCREEN
           ========================================================================= */
        <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900">
          {/* Settings Header */}
          <div
            className="px-5 pt-4 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-2xs"
            style={{ position: "sticky", top: 0, zIndex: 30 }}
          >
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
                      <div className="text-xs font-bold text-slate-900">
                        Language
                      </div>
                      <div className="text-[11px] text-slate-400">
                        English (Default)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">EN</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        GPS Proximity Radar
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Automatic closest technician
                      </div>
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
                      <div className="text-xs font-bold text-slate-900">
                        Get Mobile App
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Install native APK / iOS app
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "about" ? (
        /* =========================================================================
           VIEW: ABOUT WIDE SERVICE SCREEN (EXACT MATCHING MOCKUP DESIGN)
           ========================================================================= */
        <div className="w-full bg-[#fdfbf7] min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900">
          {/* 1. Golden Hero Banner (Matching the exact screenshot artwork) */}
          <div className="relative w-full overflow-hidden bg-[#f6c429] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-hero-nobar.jpg"
              alt="WideTech BD - Your Reliable Hyperlocal Service Partner"
              className="w-full h-auto object-cover select-none pointer-events-none"
            />
            {/* Interactive Overlay Button for Online Support */}
            <a
              href="tel:+8801700000000"
              className="absolute top-2.5 right-3 w-32 h-8 rounded-full z-10 cursor-pointer"
              title="Call 24/7 Online Support"
            />
          </div>

          {/* Main Content Body */}
          <div className="px-3.5 sm:px-4 py-4 space-y-5">
            {/* 2. Section: Why Choose Us. (Exact Mobile Mockup Match) */}
            <div>
              <div className="mb-3 px-0.5">
                <h2 className="text-base sm:text-lg font-black text-[#0f172a] tracking-tight leading-tight">
                  Why Choose Us.
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                  We make home service simple, safe and stress-free.
                </p>
              </div>

              {/* 4 Cards Grid - 2 Columns Layout */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Card 1: Verified Technicians */}
                <div className="bg-white rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-4 border border-amber-100/90 shadow-2xs flex flex-col items-start justify-between min-w-0 transition-all hover:border-amber-300 hover:shadow-xs active:scale-98">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#fff9ea] border border-[#fde8ad] flex items-center justify-center mb-3 shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#b45309] stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="text-xs sm:text-[13px] font-black text-[#0f172a] leading-tight mb-1 tracking-tight">
                      Verified Technicians
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug font-medium">
                      Background checked &amp; trusted
                    </p>
                  </div>
                </div>

                {/* Card 2: Local Experts */}
                <div className="bg-white rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-4 border border-amber-100/90 shadow-2xs flex flex-col items-start justify-between min-w-0 transition-all hover:border-amber-300 hover:shadow-xs active:scale-98">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#fff9ea] border border-[#fde8ad] flex items-center justify-center mb-3 shrink-0 shadow-2xs">
                    <MapPin className="w-5 h-5 text-[#b45309] stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="text-xs sm:text-[13px] font-black text-[#0f172a] leading-tight mb-1 tracking-tight">
                      Local Experts
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug font-medium">
                      Quick service near you
                    </p>
                  </div>
                </div>

                {/* Card 3: Fast Response */}
                <div className="bg-white rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-4 border border-amber-100/90 shadow-2xs flex flex-col items-start justify-between min-w-0 transition-all hover:border-amber-300 hover:shadow-xs active:scale-98">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#fff9ea] border border-[#fde8ad] flex items-center justify-center mb-3 shrink-0 shadow-2xs">
                    <Zap className="w-5 h-5 text-[#b45309] stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="text-xs sm:text-[13px] font-black text-[#0f172a] leading-tight mb-1 tracking-tight">
                      Fast Response
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug font-medium">
                      Get help in minutes
                    </p>
                  </div>
                </div>

                {/* Card 4: 24/7 Support */}
                <div className="bg-white rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-4 border border-amber-100/90 shadow-2xs flex flex-col items-start justify-between min-w-0 transition-all hover:border-amber-300 hover:shadow-xs active:scale-98">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#fff9ea] border border-[#fde8ad] flex items-center justify-center mb-3 shrink-0 shadow-2xs">
                    <Headphones className="w-5 h-5 text-[#b45309] stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="text-xs sm:text-[13px] font-black text-[#0f172a] leading-tight mb-1 tracking-tight">
                      24/7 Support
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug font-medium">
                      We&apos;re always here for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Section: Our Services */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    Our Services
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Professional help for your home and business.
                  </p>
                </div>
                <button
                  onClick={handleGoHome}
                  className="px-2.5 py-1 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-950 text-[11px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

              {/* 5 Pastel Service Cards (Smooth Horizontal Scroll matching mockup) */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 snap-x snap-mandatory">
                {/* 1: AC Repair & Service */}
                <button
                  onClick={handleGoFind}
                  className="min-w-[128px] sm:min-w-[136px] flex-1 shrink-0 snap-start bg-[#e0f7fa] hover:bg-[#b2ebf2] rounded-2xl p-3 border border-sky-100/80 shadow-2xs flex flex-col justify-between text-left cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-sky-200 flex items-center justify-center mb-2 text-lg shadow-2xs">
                      ❄️
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      AC Repair &amp; Service
                    </h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/95 shadow-2xs flex items-center justify-center text-sky-700 text-xs font-black mt-3">
                    →
                  </div>
                </button>

                {/* 2: Solar Panel Setup */}
                <button
                  onClick={handleGoFind}
                  className="min-w-[128px] sm:min-w-[136px] flex-1 shrink-0 snap-start bg-[#e8f5e9] hover:bg-[#c8e6c9] rounded-2xl p-3 border border-emerald-100/80 shadow-2xs flex flex-col justify-between text-left cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-emerald-200 flex items-center justify-center mb-2 text-lg shadow-2xs">
                      ☀️
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      Solar Panel Setup
                    </h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/95 shadow-2xs flex items-center justify-center text-emerald-700 text-xs font-black mt-3">
                    →
                  </div>
                </button>

                {/* 3: Plumbing Service */}
                <button
                  onClick={handleGoFind}
                  className="min-w-[128px] sm:min-w-[136px] flex-1 shrink-0 snap-start bg-[#f3e5f5] hover:bg-[#e1bee7] rounded-2xl p-3 border border-purple-100/80 shadow-2xs flex flex-col justify-between text-left cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-purple-200 flex items-center justify-center mb-2 text-lg shadow-2xs">
                      🚰
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      Plumbing Service
                    </h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/95 shadow-2xs flex items-center justify-center text-purple-700 text-xs font-black mt-3">
                    →
                  </div>
                </button>

                {/* 4: Electrical Service */}
                <button
                  onClick={handleGoFind}
                  className="min-w-[128px] sm:min-w-[136px] flex-1 shrink-0 snap-start bg-[#fff3e0] hover:bg-[#ffe0b2] rounded-2xl p-3 border border-orange-100/80 shadow-2xs flex flex-col justify-between text-left cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-orange-200 flex items-center justify-center mb-2 text-lg shadow-2xs">
                      ⚡
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      Electrical Service
                    </h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/95 shadow-2xs flex items-center justify-center text-orange-700 text-xs font-black mt-3">
                    →
                  </div>
                </button>

                {/* 5: General Repairs */}
                <button
                  onClick={handleGoFind}
                  className="min-w-[128px] sm:min-w-[136px] flex-1 shrink-0 snap-start bg-[#ffebee] hover:bg-[#ffcdd2] rounded-2xl p-3 border border-rose-100/80 shadow-2xs flex flex-col justify-between text-left cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-rose-200 flex items-center justify-center mb-2 text-lg shadow-2xs">
                      🛠️
                    </div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      General Repairs
                    </h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/95 shadow-2xs flex items-center justify-center text-rose-700 text-xs font-black mt-3">
                    →
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Section: Serving Across Bangladesh Banner (Pure Code Component) */}
            <div className="relative rounded-[22px] sm:rounded-[24px] overflow-hidden bg-gradient-to-r from-[#071d41] via-[#09224f] to-[#0c2b64] p-3.5 sm:p-4 border border-sky-900/50 shadow-md">
              {/* Background Map & Path Decorative SVG */}
              <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 pointer-events-none overflow-hidden select-none">
                {/* Ambient Glow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl" />

                <svg
                  viewBox="0 0 200 80"
                  className="w-full h-full object-cover opacity-90"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <filter id="bangladesh-pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* Layered Map Silhouette Polygons matching Bangladesh regions */}
                  <path
                    d="M 100,18 Q 120,8 140,14 T 175,20 T 195,12 L 200,80 L 95,80 Q 110,50 120,44 T 135,35 Z"
                    fill="#183153"
                    opacity="0.65"
                  />
                  <path
                    d="M 125,32 Q 140,24 158,28 T 178,40 T 198,35 L 200,80 L 115,80 Q 130,55 138,48 Z"
                    fill="#c97a14"
                    opacity="0.5"
                  />
                  <path
                    d="M 142,42 Q 155,34 170,38 T 192,48 L 200,80 L 135,80 Z"
                    fill="#d9821a"
                    opacity="0.45"
                  />
                  <path
                    d="M 155,48 Q 168,42 180,46 T 200,56 L 200,80 L 150,80 Z"
                    fill="#eab308"
                    opacity="0.4"
                  />

                  {/* Dashed Route Curves */}
                  <path
                    d="M 122,54 Q 138,28 162,32"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="2.4"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 166,32 Q 182,24 198,28"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="1.6"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Concentric Signal Arcs */}
                  <circle cx="166" cy="22" r="14" fill="none" stroke="#facc15" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                  <circle cx="166" cy="22" r="22" fill="none" stroke="#facc15" strokeWidth="0.5" opacity="0.15" />

                  {/* Prominent Golden Location Marker Pin */}
                  <g transform="translate(154, 5)">
                    <path
                      d="M 12,0 C 6,0 1,4.5 1,10.5 C 1,17.5 12,26 12,26 C 12,26 23,17.5 23,10.5 C 23,4.5 18,0 12,0 Z"
                      fill="#facc15"
                      filter="url(#bangladesh-pin-shadow)"
                    />
                    <circle cx="12" cy="10" r="3.2" fill="#0f172a" />
                  </g>
                </svg>
              </div>

              {/* Foreground Content */}
              <div className="relative z-10 flex items-center gap-3 pr-16 sm:pr-24">
                {/* Left Olive/Gold Circle Badge */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#363d2e]/90 border border-[#787750]/60 flex items-center justify-center shrink-0 shadow-inner">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-[#f6d860]"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </div>

                {/* Text Block */}
                <div className="min-w-0">
                  <h3 className="text-white font-black text-xs sm:text-sm tracking-tight leading-tight">
                    Serving Across Bangladesh
                  </h3>
                  <p className="text-slate-300 text-[10px] sm:text-[11px] font-medium leading-snug mt-0.5">
                    From Dhaka to every district, we&apos;re closer than you think.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Company Info, Direct Hotline & Website */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              <div className="p-3.5 flex items-center gap-3">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">WideTech BD</div>
                  <div className="text-[11px] text-slate-400">Your Tech Partner • Software &amp; Digital Solutions</div>
                </div>
              </div>

              <div className="p-3.5 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">Headquarters</div>
                  <div className="text-[11px] text-slate-500">Rajshahi &amp; Dhaka, Bangladesh</div>
                </div>
              </div>

              <a
                href="tel:+8801700000000"
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">24/7 Support Hotline</div>
                    <div className="text-[11px] text-slate-500">+880 1700-000000 (Tap to Call)</div>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Call Now
                </span>
              </a>

              <a
                href="https://widetechbd.com"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Official Website</div>
                    <div className="text-[11px] text-slate-500">https://widetechbd.com</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* 6. Footer Stamp */}
            <div className="text-center pt-2 pb-6">
              <span className="text-[11px] font-bold text-slate-400 block">
                Wide Service v1.0.0 • Powered by WideTech BD
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                © 2026 WideTech BD. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      ) : activeTab === "profile" ? (
        /* =========================================================================
           VIEW: PROFILE & AUTHENTICATION SCREEN (BACKEND POWERED)
           ========================================================================= */
        <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col font-sans select-none pb-28 text-slate-900">
          {/* Sticky Header */}
          <div
            className="px-5 pt-4 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-2xs flex items-center justify-between"
            style={{ position: "sticky", top: 0, zIndex: 30 }}
          >
            <div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e0b328]" />
                {currentUser ? "My Profile" : "Account & Login"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {currentUser
                  ? "Manage your credentials & appointments"
                  : "Sign in with your phone or email to access your profile"}
              </p>
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {currentUser ? (
              /* ===================================================================
                 SUB-VIEW A: LOGGED IN USER PROFILE DETAILS
                 =================================================================== */
              <>
                {/* 1. User Profile Hero Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-[#e0b328]/20 border-2 border-[#e0b328] p-0.5 shrink-0 overflow-hidden shadow-xs">
                      {currentUser.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || currentUser.name || "User"}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center rounded-xl">
                          {(currentUser.displayName || currentUser.name || currentUser.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Name & Credentials */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-base font-black text-slate-900 truncate">
                          {currentUser.displayName || currentUser.name || "Wide Service Customer"}
                        </h3>
                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      {currentUser.email && (
                        <p className="text-xs text-slate-500 truncate font-medium">
                          {currentUser.email}
                        </p>
                      )}
                      {(currentUser.phoneNumber || currentUser.phone) && (
                        <p className="text-xs text-slate-600 font-bold mt-0.5">
                          {currentUser.phoneNumber || currentUser.phone}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                          <span>●</span> Verified Customer
                        </span>
                        {currentUser.createdAt && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Joined {currentUser.createdAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Location & Service Card */}
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    Default Location
                  </span>
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          {userLocation.area}, {userLocation.city}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Active radar coordinate
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onOpenLocationPicker}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* 3. Account Actions Menu */}
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    My Account Options
                  </span>
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                    <button
                      onClick={handleGoFind}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-[#e0b328]" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Find Local Technicians
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Search nearby emergency repairs
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={handleGoAbout}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            About Wide Service
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Company info, hotline & mission
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={onOpenDownload}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Download Mobile APK
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Install on Android & iOS
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* 4. Log Out Button */}
                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out of Account</span>
                  </button>
                </div>
              </>
            ) : (
              /* ===================================================================
                 SUB-VIEW B: NOT LOGGED IN -> AUTH LOGIN & SIGNUP FORM
                 =================================================================== */
              <div className="space-y-4">
                {/* Main Auth Form Container */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
                  <div className="mb-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-300 mx-auto flex items-center justify-center mb-2.5">
                      {authMode === "login" ? (
                        <LogIn className="w-6 h-6 text-amber-700" />
                      ) : (
                        <User className="w-6 h-6 text-amber-700" />
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {authMode === "login"
                        ? "Welcome Back"
                        : "Create Free Account"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {authMode === "login"
                        ? "Sign in with your phone or email to manage your profile"
                        : "Join Wide Service to book local verified technicians"}
                    </p>
                  </div>

                  {/* Feedback Alerts */}
                  {authError && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-3">
                    {/* Full Name for Signup */}
                    {authMode === "signup" && (
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Full Name
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
                          <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="e.g. Mohammad Rahim"
                            className="w-full text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Phone Number for Signup */}
                    {authMode === "signup" && (
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Phone Number
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
                          <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="tel"
                            required
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Phone or Email Input for Login */}
                    {authMode === "login" && (
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Phone Number or Email
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
                          <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="text"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="01XXXXXXXXX or name@example.com"
                            className="w-full text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Optional Email for Signup */}
                    {authMode === "signup" && (
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Email Address (Optional)
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
                          <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Input */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                        Password
                      </label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
                        <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-[#e0b328] hover:bg-[#c99e1c] text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? (
                        <span>Processing...</span>
                      ) : authMode === "login" ? (
                        <>
                          <LogIn className="w-4 h-4 stroke-[2.4]" />
                          <span>Sign In</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 stroke-[2.4]" />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switcher Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      {authMode === "login" ? (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("signup");
                              setAuthError(null);
                            }}
                            className="font-bold text-amber-700 hover:underline cursor-pointer"
                          >
                            Sign Up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("login");
                              setAuthError(null);
                            }}
                            className="font-bold text-amber-700 hover:underline cursor-pointer"
                          >
                            Sign In
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* 3 Value badges */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs">
                    <span className="text-base block mb-0.5">⚡</span>
                    <span className="text-[10px] font-bold text-slate-800 block">
                      1-Tap Call
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs">
                    <span className="text-base block mb-0.5">📍</span>
                    <span className="text-[10px] font-bold text-slate-800 block">
                      Live Radar
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs">
                    <span className="text-base block mb-0.5">🛡️</span>
                    <span className="text-[10px] font-bold text-slate-800 block">
                      Verified Pros
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 5: HOME SCREEN
           ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28 font-sans select-none text-slate-900">
          {/* 1. Golden Yellow Top Header Matching Mobile App */}
          <div className="bg-[#e0b328] text-slate-950 px-5 pt-3.5 pb-3 shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between gap-3">
              {/* Location Area & User Greeting */}
              <div className="flex-1 min-w-0">
                {currentUser ? (
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 truncate mb-0.5">
                    <span className="truncate">
                      Welcome, {currentUser.displayName || currentUser.name || "User"}
                    </span>
                    <span className="shrink-0 text-xs">👋</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-800/90 block">
                    My Location Area
                  </span>
                )}
                <button
                  onClick={onOpenLocationPicker}
                  className="flex items-center gap-1 font-black text-base text-slate-950 truncate tracking-tight text-left cursor-pointer group"
                  title="Change Location"
                >
                  <span className="truncate">
                    {userLocation.area}, {userLocation.city}
                  </span>
                  <span className="text-xs group-hover:translate-y-0.5 transition-transform shrink-0">
                    ▾
                  </span>
                </button>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {currentUser && (
                  <button
                    onClick={handleGoProfile}
                    className="w-9 h-9 rounded-full bg-slate-950/15 hover:bg-slate-950/25 text-slate-950 flex items-center justify-center font-black text-xs transition-colors cursor-pointer shrink-0 border border-slate-950/20 overflow-hidden shadow-2xs"
                    title={`Logged in as ${currentUser.displayName || currentUser.name || "User"}`}
                  >
                    {currentUser.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {(currentUser.displayName || currentUser.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </button>
                )}

                {/* Notification Bell Badge */}
                <button
                  onClick={onOpenDownload}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center relative transition-colors cursor-pointer shrink-0"
                  title="Notifications / App"
                >
                  <Bell className="w-4 h-4 stroke-[2.4]" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-600" />
                </button>
              </div>
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

          {/* 4. Exact 2-Column Categories Grid */}
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
        </div>
      )}

      {/* =========================================================================
          PERSISTENT FLOATING PILL BOTTOM NAVIGATION BAR (MATCHING SCREENSHOT)
          ========================================================================= */}
      {/* Persistent Floating Pill Bottom Navigation Bar (Light Mode) */}
      {/* Persistent Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-0">
        <div className="pointer-events-auto w-full max-w-md mx-auto bg-white/95 border-t border-slate-200/90 py-2 px-3 sm:px-4 shadow-2xl shadow-slate-900/15 backdrop-blur-xl flex items-center justify-around">
          {/* 1. Home Tab */}
          <button
            onClick={handleGoHome}
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all"
            title="Home"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isHomeActive
                  ? "bg-[#e0b328] shadow-md shadow-amber-500/30 text-slate-950"
                  : "bg-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <LayoutGrid
                className={`w-5 h-5 ${
                  isHomeActive
                    ? "stroke-[2.4] fill-slate-950 text-slate-950"
                    : "stroke-[2] fill-slate-400 text-slate-400"
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                isHomeActive ? "text-slate-950 font-black" : "text-slate-400"
              }`}
            >
              Home
            </span>
          </button>

          {/* 2. About Tab */}
          <button
            onClick={handleGoAbout}
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all"
            title="About Us"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isAboutActive
                  ? "bg-[#e0b328] shadow-md shadow-amber-500/30 text-slate-950"
                  : "bg-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Info
                className={`w-5 h-5 ${
                  isAboutActive ? "stroke-[2.6] text-slate-950" : "stroke-[2]"
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                isAboutActive ? "text-slate-950 font-black" : "text-slate-400"
              }`}
            >
              About
            </span>
          </button>

          {/* 3. Find Tab (Center Elevated Button) */}
          <button
            onClick={handleGoFind}
            className="flex flex-col items-center justify-center -mt-6 cursor-pointer group px-2"
            title="Find Services"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white transition-all ${
                isFindActive
                  ? "bg-[#e0b328] shadow-xl shadow-amber-500/40 text-slate-950 scale-105"
                  : "bg-slate-100 border-white shadow-md text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              <Search
                className={`w-6 h-6 ${
                  isFindActive ? "stroke-[2.8] text-slate-950" : "stroke-[2.2]"
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                isFindActive ? "text-slate-950 font-black" : "text-slate-400"
              }`}
            >
              Find
            </span>
          </button>

          {/* 4. Settings Tab */}
          <button
            onClick={handleGoSettings}
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all"
            title="Settings"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isSettingsActive
                  ? "bg-[#e0b328] shadow-md shadow-amber-500/30 text-slate-950"
                  : "bg-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Settings
                className={`w-5 h-5 ${
                  isSettingsActive
                    ? "stroke-[2.6] text-slate-950"
                    : "stroke-[2]"
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                isSettingsActive ? "text-slate-950 font-black" : "text-slate-400"
              }`}
            >
              Settings
            </span>
          </button>

          {/* 5. Profile Tab */}
          <button
            onClick={handleGoProfile}
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all"
            title="Profile"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isProfileActive
                  ? "bg-[#e0b328] shadow-md shadow-amber-500/30 text-slate-950"
                  : "bg-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  isProfileActive ? "stroke-[2.6] text-slate-950" : "stroke-[2]"
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                isProfileActive ? "text-slate-950 font-black" : "text-slate-400"
              }`}
            >
              {currentUser ? "Profile" : "Account"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
