"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Category, Subcategory, Service, UserLocation } from "../types";
import {
  getCategories,
  getServices,
  sortServicesByDistance,
  slugifyCategory,
  getCategoryVisuals,
} from "../lib/api";
import { ServiceDetailModal } from "./ServiceDetailModal";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Heart,
  Navigation,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

interface LiveServiceDirectoryProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
}

export const LiveServiceDirectory: React.FC<LiveServiceDirectoryProps> = ({
  userLocation,
  onOpenLocationPicker,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);

  // Exact 8 Popular Categories matching the screenshot with navigation slugs
  const popularCategories = [
    {
      id: "ac",
      name: "AC Repair",
      slug: "ac-repair",
      count: "512+ Services",
      icon: "❄️",
      bgColor: "bg-[#0284c7]",
    },
    {
      id: "plumbing",
      name: "Plumbing",
      slug: "plumbing",
      count: "420+ Services",
      icon: "💧",
      bgColor: "bg-[#0891b2]",
    },
    {
      id: "electrical",
      name: "Electrical",
      slug: "electrical",
      count: "389+ Services",
      icon: "⚡",
      bgColor: "bg-[#eab308]",
    },
    {
      id: "cleaning",
      name: "Cleaning",
      slug: "cleaning",
      count: "312+ Services",
      icon: "🧹",
      bgColor: "bg-[#059669]",
    },
    {
      id: "carpentry",
      name: "Carpentry",
      slug: "carpentry",
      count: "276+ Services",
      icon: "🔨",
      bgColor: "bg-[#9333ea]",
    },
    {
      id: "cctv",
      name: "CCTV",
      slug: "cctv",
      count: "198+ Services",
      icon: "📹",
      bgColor: "bg-[#e11d48]",
    },
    {
      id: "appliances",
      name: "Appliances",
      slug: "appliances",
      count: "167+ Services",
      icon: "🧺",
      bgColor: "bg-[#2563eb]",
    },
    {
      id: "other",
      name: "Other",
      slug: "other",
      count: "124+ Services",
      icon: "⊞",
      bgColor: "bg-[#64748b]",
    },
  ];

  // Dynamic categories mapped from backend
  const dynamicCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories.slice(0, 8).map((cat) => {
        const visuals = getCategoryVisuals(cat.name);
        return {
          id: String(cat.id),
          name: cat.name,
          slug: slugifyCategory(cat.name),
          count: "",
          icon: visuals.icon,
          bgColor: visuals.bgColor,
        };
      });
    }
    return popularCategories;
  }, [categories]);

  // Load live data from backend API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, srvResult] = await Promise.all([
          getCategories(),
          getServices({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
            limit: 40,
          }),
        ]);
        setCategories(cats);
        setServices(srvResult.services);
      } catch (err) {
        console.warn("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userLocation.latitude, userLocation.longitude]);

  // Featured 4 Nearby Services with live backend data
  const featuredCards = useMemo(() => {
    if (services.length > 0) {
      let activeList = services;
      if (selectedCategory) {
        activeList = services.filter((s) =>
          (s.categoryName || "")
            .toLowerCase()
            .includes(selectedCategory.toLowerCase()),
        );
      }
      if (activeList.length > 0) {
        const fallbackImages = [
          "/card_ac.jpg",
          "/card_plumbing.jpg",
          "/card_electrical.jpg",
          "/card_cleaning.jpg",
        ];
        return activeList.slice(0, 4).map((s, idx) => {
          const visuals = getCategoryVisuals(s.categoryName || s.name);
          return {
            id: s.id,
            name: s.name,
            businessName: s.businessName || s.categoryName || "Local Service",
            categoryName: s.categoryName || "Home Service",
            image:
              (Array.isArray(s.images) && s.images[0]) ||
              s.logo ||
              fallbackImages[idx % fallbackImages.length],
            avatarBg: visuals.bgColor,
            avatarIcon: visuals.icon,
            distance: s.distanceKm
              ? `${s.distanceKm.toFixed(1)} km`
              : "Near you",
            schedule: s.schedule || "Open Today",
            phone: s.phone,
            whatsapp: s.whatsapp || s.phone,
            address: s.address,
            description: s.description || "",
            latitude: s.latitude,
            longitude: s.longitude,
            status: "active" as const,
            categoryId: s.categoryId,
          };
        });
      }
    }

    const list = [
      {
        id: 101,
        name: "CoolTech Pro Solutions",
        businessName: "CoolTech Pro Solutions",
        categoryName: "AC Repair & Maintenance",
        image: "/card_ac.jpg",
        avatarBg: "bg-[#0284c7]",
        avatarIcon: "❄️",
        distance: "1.2 km",
        schedule: "8:00 AM - 10:00 PM",
        phone: "01812345678",
        whatsapp: "8801812345678",
        address: "House 14, Road 7, Dhanmondi, Dhaka",
        description:
          "Certified technicians for jet cleaning, refrigerant gas leak detection, compressor maintenance, and cooling boost.",
        latitude: 23.7461,
        longitude: 90.3742,
        status: "active" as const,
        categoryId: 1,
      },
      {
        id: 102,
        name: "Dhaka Plumbing Service",
        businessName: "Dhaka Plumbing Service",
        categoryName: "Plumbing & Sanitary",
        image: "/card_plumbing.jpg",
        avatarBg: "bg-[#0891b2]",
        avatarIcon: "💧",
        distance: "2.4 km",
        schedule: "24/7 Emergency Service",
        phone: "01711223344",
        whatsapp: "880171223344",
        address: "Block C, Mirpur 10, Dhaka",
        description:
          "Specialized in water pipe leakage fix, bathroom fittings, sink blockages, concealed line repairs and water pump installation.",
        latitude: 23.8071,
        longitude: 90.3686,
        status: "active" as const,
        categoryId: 2,
      },
      {
        id: 103,
        name: "Bright Electricals",
        businessName: "Bright Electricals",
        categoryName: "Electrical & Wiring",
        image: "/card_electrical.jpg",
        avatarBg: "bg-[#eab308]",
        avatarIcon: "⚡",
        distance: "3.1 km",
        schedule: "9:00 AM - 9:00 PM",
        phone: "01999887766",
        whatsapp: "8801999887766",
        address: "Gulshan 1 Circle, Dhaka",
        description:
          "Certified electrician available for circuit breaker repair, short circuit fix, DB board wiring, and home electrical inspection.",
        latitude: 23.7925,
        longitude: 90.4078,
        status: "active" as const,
        categoryId: 3,
      },
      {
        id: 104,
        name: "Clean Home Services",
        businessName: "Clean Home Services",
        categoryName: "Home & Office Cleaning",
        image: "/card_cleaning.jpg",
        avatarBg: "bg-[#059669]",
        avatarIcon: "🧹",
        distance: "4.2 km",
        schedule: "Available Today",
        phone: "01855667788",
        whatsapp: "8801855667788",
        address: "Sector 3, Uttara, Dhaka",
        description:
          "Professional home deep cleaning, living room vacuuming, sofa shampooing, bathroom disinfection and kitchen degreasing.",
        latitude: 23.8759,
        longitude: 90.3795,
        status: "active" as const,
        categoryId: 4,
      },
    ];

    if (!selectedCategory) return list;

    return list.filter((s) =>
      s.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()),
    );
  }, [services, selectedCategory]);

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  };

  const handleWhatsapp = (
    e: React.MouseEvent,
    whatsapp: string,
    name: string,
  ) => {
    e.stopPropagation();
    const clean = whatsapp.replace(/[^0-9]/g, "");
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(
        `Hello, I would like to book your service "${name}" on Wide Service.`,
      )}`,
      "_blank",
    );
  };

  return (
    <section id="services" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* ============================================================ */}
        {/* 1. Popular Service Categories Section matching mockup */}
        {/* ============================================================ */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                Popular Service Categories
              </h2>
              {/* Golden Underline Bar */}
              <div className="w-12 h-1 bg-[#d49b1a] rounded-full mt-1.5" />
            </div>

            <a
              href="/services"
              className="text-xs sm:text-sm font-bold text-[#d49b1a] hover:text-[#b88514] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Services</span>
              <span>→</span>
            </a>
          </div>

          {/* 8-Card Grid matching mockup - Clicking navigates to Single Category page */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
            {dynamicCategories.map((cat) => {
              return (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="bg-white rounded-[18px] border border-slate-200/90 hover:border-[#d49b1a] p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer hover:shadow-md hover:scale-102 group"
                >
                  {/* Colored Round Icon */}
                  <div
                    className={`w-12 h-12 rounded-full ${cat.bgColor} flex items-center justify-center text-white text-xl mb-3 shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    {cat.icon}
                  </div>

                  {/* Category Name */}
                  <div className="text-xs font-black text-[#0f172a] group-hover:text-[#d49b1a] transition-colors leading-tight mb-1 truncate w-full">
                    {cat.name}
                  </div>

                  {/* Services Count */}
                  <div className="text-[10px] font-medium text-slate-400">
                    {cat.count}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Nearby Services Section matching mockup */}
        {/* ============================================================ */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                Nearby Services
              </h2>
              {/* Golden Underline Bar */}
              <div className="w-12 h-1 bg-[#d49b1a] rounded-full mt-1.5" />
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d49b1a]" />
                <span>
                  Showing services near{" "}
                  <strong>{userLocation.city || "Dhaka"}</strong>
                </span>
              </span>
              <span>•</span>
              <button
                onClick={onOpenLocationPicker}
                className="font-bold text-[#d49b1a] hover:underline cursor-pointer"
              >
                Change Location
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCards.map((service) => (
              <div
                key={service.id}
                onClick={() =>
                  setSelectedService(service as unknown as Service)
                }
                className="bg-white rounded-[22px] border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Top-Left: Verified Green Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#10b981] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <span>✓</span>
                      <span>Verified</span>
                    </div>

                    {/* Top-Right: Distance Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" />
                      <span>{service.distance}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-start gap-2.5">
                      {/* Avatar Round Icon */}
                      <div
                        className={`w-9 h-9 rounded-full ${service.avatarBg} flex items-center justify-center text-white text-base shrink-0 shadow-2xs mt-0.5`}
                      >
                        {service.avatarIcon}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Service Title */}
                        <h3 className="font-extrabold text-xs sm:text-[13px] text-[#0f172a] truncate group-hover:text-[#d49b1a] transition-colors">
                          {service.name}
                        </h3>

                        {/* Category Subtitle */}
                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          {service.categoryName}
                        </p>

                        {/* Location / Address */}
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#d49b1a] shrink-0" />
                          <span className="truncate">{service.address}</span>
                        </div>

                        {/* Schedule / Availability */}
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold truncate">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {service.schedule || "Open Today"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Dual Pill: Call & WhatsApp) */}
                <div className="p-3 pt-0 flex items-center gap-2">
                  {/* Call Button (Cream / Beige Pill) */}
                  <button
                    onClick={(e) => handleCall(e, service.phone)}
                    className="flex-1 py-2 px-3 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-700" />
                    <span>Call</span>
                  </button>

                  {/* WhatsApp Button (Emerald Green Pill) */}
                  <button
                    onClick={(e) =>
                      handleWhatsapp(e, service.whatsapp, service.name)
                    }
                    className="flex-1 py-2 px-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Real Services from Backend if expanded */}
          {showAllServices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {services.slice(0, 12).map((service, idx) => (
                <div
                  key={service.id || idx}
                  onClick={() => setSelectedService(service)}
                  className="bg-white rounded-[22px] border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          service.logo ||
                          (Array.isArray(service.images) &&
                            service.images[0]) ||
                          "/card_ac.jpg"
                        }
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#10b981] text-white text-[10px] font-bold">
                        ✓ Verified
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-bold">
                        📍{" "}
                        {service.distanceKm
                          ? `${service.distanceKm.toFixed(1)} km`
                          : "Near you"}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-extrabold text-[13px] text-[#0f172a] truncate">
                        {service.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {service.businessName || service.categoryName}
                      </p>
                      {/* Location / Address */}
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#d49b1a] shrink-0" />
                        <span className="truncate">{service.address}</span>
                      </div>

                      {/* Schedule / Availability */}
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold truncate">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {service.schedule || "Open Today"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 pt-0 flex items-center gap-2">
                    <button
                      onClick={(e) => handleCall(e, service.phone)}
                      className="flex-1 py-2 px-3 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                    <button
                      onClick={(e) =>
                        handleWhatsapp(
                          e,
                          service.whatsapp || service.phone,
                          service.name,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Toggle All Services Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="px-6 py-2.5 rounded-full border border-slate-300 hover:border-[#d49b1a] text-xs font-bold text-slate-700 hover:text-[#d49b1a] transition-all cursor-pointer"
            >
              {showAllServices
                ? "Show Less"
                : `Explore More Verified Services (+${services.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Modal with Leaflet Map when any card is clicked */}
      <ServiceDetailModal
        service={selectedService}
        userLocation={userLocation}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
