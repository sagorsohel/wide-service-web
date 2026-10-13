"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Service, UserLocation } from "../../../../types";
import { getServiceById, formatDistance, calculateHaversineDistanceKm } from "../../../../lib/api";
import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { LocationPickerModal } from "../../../../components/LocationPickerModal";
import { ServiceMapEmbed } from "../../../../components/ServiceMapEmbed";
import { DEFAULT_USER_LOCATION } from "../../../../lib/cities";
import {
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
  X,
  Loader2,
} from "lucide-react";

function ServiceDetailContent() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id ? Number(params.id) : null;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (!serviceId) return;
      setLoading(true);
      try {
        const srv = await getServiceById(serviceId);
        setService(srv);
      } catch (e) {
        console.warn("Failed to load service detail:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [serviceId]);

  // Gallery Images dynamically parsed
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
    return ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"];
  }, [service]);

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
  }, [userLocation.latitude, userLocation.longitude, service]);

  const cleanPhone = service?.phone ? service.phone.replace(/[^0-9+]/g, "") : "";
  const cleanWhatsapp = service?.whatsapp
    ? service.whatsapp.replace(/[^0-9]/g, "")
    : cleanPhone.replace(/[^0-9]/g, "");

  const serviceLat =
    service?.latitude != null && !isNaN(Number(service.latitude))
      ? Number(service.latitude)
      : 24.3636;
  const serviceLng =
    service?.longitude != null && !isNaN(Number(service.longitude))
      ? Number(service.longitude)
      : 88.6241;
  const hasCoordinates =
    service?.latitude != null &&
    service?.longitude != null &&
    !isNaN(Number(service.latitude)) &&
    !isNaN(Number(service.longitude));

  const handleOpenMaps = () => {
    if (!service) return;
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

  const handleShare = async () => {
    if (!service) return;
    const shareUrl = window.location.href;
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
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {}
  };

  const profileImageUri =
    service?.logo ||
    (Array.isArray(service?.images) && service.images[0]) ||
    "https://img.icons8.com/fluency/96/maintenance.png";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={setUserLocation}
      />

      <Header
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenDownload={() => {}}
        isMobileAppMode={false}
        onToggleMobileAppMode={() => {}}
        activeNav="Services"
      />

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#d49b1a] animate-spin" />
              <span className="text-sm font-bold text-slate-500">
                Loading Service Details...
              </span>
            </div>
          ) : !service ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                Service Not Found
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                The requested service could not be found or has been removed.
              </p>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="px-6 py-2.5 rounded-full bg-[#d49b1a] text-white font-bold text-sm cursor-pointer"
              >
                Browse All Services
              </button>
            </div>
          ) : (
            <div className="bg-[#e0b328] rounded-3xl shadow-xl border border-amber-300 overflow-hidden">
              {/* Brand Top Bar */}
              <div className="bg-[#e0b328] px-5 py-3.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-slate-900 transition-colors cursor-pointer"
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight text-center truncate px-2">
                  Service Details
                </h1>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-slate-900 transition-colors cursor-pointer relative"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  {copySuccess && (
                    <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Main Curvy Content Sheet */}
              <div className="bg-slate-50 rounded-t-[28px] p-4 sm:p-6 space-y-4">
                {/* 1. Provider Profile Card */}
                <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border-2 border-amber-300 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profileImageUri}
                          alt={service.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-xs flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                        {service.name}
                      </h2>

                      {service.businessName && (
                        <div className="text-xs font-bold text-amber-800 mt-0.5 truncate">
                          {service.businessName}
                        </div>
                      )}

                      <div className="flex items-center flex-wrap gap-1.5 mt-2">
                        {service.categoryName && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
                            {service.categoryName}
                          </span>
                        )}
                        {service.subcategoryName && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {service.subcategoryName}
                          </span>
                        )}
                        {calculatedDistanceKm != null && (
                          <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-black text-emerald-700">
                            <Navigation className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{formatDistance(calculatedDistanceKm)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Action Buttons */}
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
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* 3. Service Operating Schedule Section */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Service Operating Schedule
                    </h4>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {service.schedule ||
                        "Everyday: 9:00 AM - 9:00 PM (Emergency 24/7 Support)"}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Operating hours may vary during holidays or emergency calls.
                    </div>
                  </div>
                </div>

                {/* 4. About Service Section */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight mb-2">
                    About Service
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {service.description ||
                      "অভিজ্ঞ ও প্রশিক্ষিত কারিগর দ্বারা দ্রুত এবং নির্ভরযোগ্য সার্ভিস। আধুনিক সরঞ্জাম দিয়ে দ্রুত সমাধান ও কাজের পর ৭ দিনের ফ্রি সার্ভিস ওয়ারেন্টি।"}
                  </p>
                </div>

                {/* 5. Distance & Interactive Maps Section */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          Service Location & Map
                        </h4>
                        {calculatedDistanceKm != null && (
                          <div className="text-[11px] font-bold text-emerald-700">
                            {formatDistance(calculatedDistanceKm)} from your current
                            location
                          </div>
                        )}
                      </div>
                    </div>

                    {calculatedDistanceKm != null && (
                      <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-black text-emerald-700">
                        {calculatedDistanceKm.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    {service.address}
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 relative">
                    <ServiceMapEmbed
                      serviceLat={serviceLat}
                      serviceLng={serviceLng}
                      serviceName={service.name}
                      userLat={userLocation.latitude}
                      userLng={userLocation.longitude}
                      height={240}
                    />

                    <button
                      type="button"
                      onClick={handleOpenMaps}
                      className="absolute bottom-2.5 right-2.5 bg-slate-900/90 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Full Map</span>
                    </button>
                  </div>

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
                <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400">
                        Direct Contact Hotline
                      </div>
                      <div className="text-xs sm:text-sm font-black text-emerald-700 font-mono mt-0.5">
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
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-[#0284c7]" />
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        Services Images ({galleryImages.length})
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {activeImageIndex + 1} of {galleryImages.length}
                    </span>
                  </div>

                  <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={service.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={handleNextImage}
                    />

                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-md cursor-pointer transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-md cursor-pointer transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}

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

                    <button
                      type="button"
                      onClick={() => setIsFullscreenModalOpen(true)}
                      className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-[11px] font-bold text-white border border-white/10 cursor-pointer transition-all"
                    >
                      <Maximize2 className="w-3 h-3 text-white" />
                      <span>Full View</span>
                    </button>
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {galleryImages.map((imgUri, idx) => {
                        const isSelected = idx === activeImageIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-amber-500 scale-102 shadow-md"
                                : "border-slate-200 opacity-60 hover:opacity-100"
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

                {/* Floating Bottom Booking / Call Bar */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-md flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleOpenMaps}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center border border-slate-200 cursor-pointer shrink-0 transition-colors"
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
          )}
        </div>
      </main>

      <Footer />

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
            alt={service?.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading service details...
        </div>
      }
    >
      <ServiceDetailContent />
    </React.Suspense>
  );
}
