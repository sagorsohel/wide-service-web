"use client";

import React, { useState, useMemo } from "react";
import { Service, UserLocation } from "../types";
import { formatDistance, calculateHaversineDistanceKm } from "../lib/api";
import { ServiceMapEmbed } from "./ServiceMapEmbed";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  PhoneCall,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Navigation,
  ExternalLink,
  Images,
  Maximize2,
  Compass,
} from "lucide-react";

interface ServiceDetailModalProps {
  service: Service | null;
  userLocation: UserLocation;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  userLocation,
  onClose,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Parse Gallery Images dynamically - hooks called unconditionally
  const galleryImages: string[] = useMemo(() => {
    if (!service) return [];
    const list: string[] = [];
    if (Array.isArray(service.images)) {
      list.push(
        ...service.images.filter(
          (img): img is string => typeof img === "string" && Boolean(img.trim())
        )
      );
    } else if (typeof service.images === "string") {
      try {
        const parsed = JSON.parse(service.images);
        if (Array.isArray(parsed)) {
          list.push(
            ...parsed.filter(
              (img): img is string =>
                typeof img === "string" && Boolean(img.trim())
            )
          );
        }
      } catch {
        const split = service.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        list.push(...split);
      }
    }

    if (
      service.logo &&
      typeof service.logo === "string" &&
      service.logo.trim() &&
      !list.includes(service.logo.trim())
    ) {
      list.unshift(service.logo.trim());
    }

    if (list.length > 0) return list;
    return [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    ];
  }, [service?.images, service?.logo]);

  // Calculate live distance - hooks called unconditionally
  const calculatedDistanceKm: number | null = useMemo(() => {
    if (!service) return null;
    const sLat = service.latitude != null ? Number(service.latitude) : null;
    const sLng = service.longitude != null ? Number(service.longitude) : null;
    if (
      userLocation.latitude != null &&
      userLocation.longitude != null &&
      sLat != null &&
      sLng != null &&
      !isNaN(sLat) &&
      !isNaN(sLng)
    ) {
      return calculateHaversineDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        sLat,
        sLng
      );
    }
    if (service.distanceKm != null) {
      return service.distanceKm;
    }
    return null;
  }, [
    userLocation.latitude,
    userLocation.longitude,
    service?.latitude,
    service?.longitude,
    service?.distanceKm,
  ]);

  // Image Navigation
  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // If no service is selected, don't render UI (safely placed after all hooks)
  if (!service) return null;

  // Profile Image URI
  const profileImageUri =
    service.logo ||
    (Array.isArray(service.images) && service.images[0]) ||
    "https://img.icons8.com/fluency/96/maintenance.png";

  const cleanPhone = service.phone ? service.phone.replace(/[^0-9+]/g, "") : "";
  const cleanWhatsapp = service.whatsapp
    ? service.whatsapp.replace(/[^0-9]/g, "")
    : cleanPhone.replace(/[^0-9]/g, "");

  // Coordinates
  const serviceLat =
    service.latitude != null && !isNaN(Number(service.latitude))
      ? Number(service.latitude)
      : 24.3636;
  const serviceLng =
    service.longitude != null && !isNaN(Number(service.longitude))
      ? Number(service.longitude)
      : 88.6241;
  const hasCoordinates =
    service.latitude != null &&
    service.longitude != null &&
    !isNaN(Number(service.latitude)) &&
    !isNaN(Number(service.longitude));

  // Open Google Maps Directions
  const handleOpenMaps = () => {
    const destination = hasCoordinates
      ? `${serviceLat},${serviceLng}`
      : encodeURIComponent(service.address || service.name);

    const originParam =
      userLocation.latitude != null && userLocation.longitude != null
        ? `&origin=${userLocation.latitude},${userLocation.longitude}`
        : "";

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}${originParam}`;
    window.open(googleMapsUrl, "_blank");
  };

  // Share Service Details
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/services/detail/${service.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: `${service.name}${
            service.businessName ? ` - ${service.businessName}` : ""
          }\nঠিকানা: ${service.address}\nযোগাযোগ: ${service.phone}\nWide Service!`,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {}
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl bg-[#e0b328] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header matching Brand Theme (from ServiceDetailScreen.tsx) */}
          <div className="bg-[#e0b328] px-5 pt-3.5 pb-3.5 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-slate-900 transition-colors cursor-pointer"
              title="Close"
            >
              <ChevronLeft className="w-5 h-5 text-slate-900" />
            </button>

            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight text-center truncate px-2">
              Service Details
            </h3>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-slate-900 transition-colors cursor-pointer relative"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-slate-900" />
              {copySuccess && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>

          {/* Main Curvy Content Sheet (rounded-t-[30px]) */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-t-[28px] overflow-y-auto flex flex-col">
            <div className="p-4 sm:p-5 space-y-4 flex-1">
              {/* 1. Provider Profile Card */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-4">
                  {/* Profile Logo with ShieldCheck Verified Badge */}
                  <div className="relative shrink-0">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-600/60 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profileImageUri}
                        alt={service.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-xs flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Identity Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                      {service.name}
                    </h2>

                    {service.businessName && (
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-400 mt-0.5 truncate">
                        {service.businessName}
                      </div>
                    )}

                    {/* Category & Subcategory Pills + Distance Badge */}
                    <div className="flex items-center flex-wrap gap-1.5 mt-2">
                      {service.categoryName && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {service.categoryName}
                        </span>
                      )}
                      {service.subcategoryName && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {service.subcategoryName}
                        </span>
                      )}
                      {calculatedDistanceKm != null && (
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                          <Navigation className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{formatDistance(calculatedDistanceKm)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Quick Action Buttons (Call Now & WhatsApp) */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    `হ্যালো, আমি Wide Service থেকে "${service.name}" সম্পর্কে জানতে যোগাযোগ করছি।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* 3. Service Operating Schedule Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                    Service Operating Schedule
                  </h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {service.schedule ||
                      "Everyday: 9:00 AM - 9:00 PM (Emergency 24/7 Support)"}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Operating hours may vary during holidays or emergency calls.
                  </div>
                </div>
              </div>

              {/* 4. About Service Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                  About Service
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {service.description ||
                    "অভিজ্ঞ ও প্রশিক্ষিত কারিগর দ্বারা দ্রুত এবং নির্ভরযোগ্য সার্ভিস। আধুনিক সরঞ্জাম দিয়ে দ্রুত সমাধান ও কাজের পর ৭ দিনের ফ্রি সার্ভিস ওয়ারেন্টি।"}
                </p>
              </div>

              {/* 5. Distance & Interactive Maps Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                        Service Location & Map
                      </h4>
                      {calculatedDistanceKm != null && (
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          {formatDistance(calculatedDistanceKm)} from your current
                          location
                        </div>
                      )}
                    </div>
                  </div>

                  {calculatedDistanceKm != null && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full text-xs font-black text-emerald-700 dark:text-emerald-300">
                      {calculatedDistanceKm.toFixed(1)} km
                    </div>
                  )}
                </div>

                {/* Physical Address Text */}
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {service.address}
                </div>

                {/* Embedded Interactive Map Preview */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                  <ServiceMapEmbed
                    serviceLat={serviceLat}
                    serviceLng={serviceLng}
                    serviceName={service.name}
                    userLat={userLocation.latitude}
                    userLng={userLocation.longitude}
                    height={200}
                  />

                  {/* Floating Directions Button on Map */}
                  <button
                    type="button"
                    onClick={handleOpenMaps}
                    className="absolute bottom-2.5 right-2.5 bg-slate-900/90 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Full Map</span>
                  </button>
                </div>

                {/* Get Directions Button */}
                <button
                  type="button"
                  onClick={handleOpenMaps}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm font-black"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Get Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200 ml-1" />
                </button>
              </div>

              {/* 6. Direct Contact Hotline Row */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400">
                      Direct Contact Hotline
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                      {service.phone}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${cleanPhone}`}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-extrabold cursor-pointer transition-all active:scale-95"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span>Call</span>
                </a>
              </div>

              {/* 7. Services Images Gallery */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-[#0284c7]" />
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                      Services Images ({galleryImages.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {activeImageIndex + 1} of {galleryImages.length}
                  </span>
                </div>

                {/* Main Active Showcase Photo */}
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galleryImages[activeImageIndex]}
                    alt={service.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={handleNextImage}
                  />

                  {/* Left Arrow Button */}
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-md cursor-pointer transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* Right Arrow Button */}
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-md cursor-pointer transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Dots indicator at bottom-center */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                      {galleryImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === activeImageIndex
                              ? "w-5 bg-amber-400"
                              : "w-2 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Tap to Fullscreen Button Overlay */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-[11px] font-bold text-white border border-white/10 cursor-pointer transition-all"
                  >
                    <Maximize2 className="w-3 h-3 text-white" />
                    <span>Full View</span>
                  </button>
                </div>

                {/* Thumbnails Row */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {galleryImages.map((imgUri, idx) => {
                      const isSelected = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-500 scale-102 shadow-md"
                              : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUri}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Floating Bottom Booking / Call Bar */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between shadow-xl gap-3">
              <button
                type="button"
                onClick={handleOpenMaps}
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0 transition-colors"
                title="Directions in Google Maps"
              >
                <Compass className="w-5 h-5 text-blue-600" />
              </button>

              <a
                href={`tel:${cleanPhone}`}
                className="flex-1 bg-[#e0b328] hover:bg-amber-500 text-slate-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-slate-900" />
                <span>Call & Book Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreenModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreenModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={galleryImages[activeImageIndex]}
            alt={service.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
