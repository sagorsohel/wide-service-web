"use client";

import React, { useState } from "react";
import { Service, UserLocation } from "../types";
import { formatDistance, calculateHaversineDistanceKm } from "../lib/api";
import { ServiceMapEmbed } from "./ServiceMapEmbed";
import {
  X,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!service) return null;

  // Extract images
  let images: string[] = [];
  if (Array.isArray(service.images)) {
    images = service.images;
  } else if (typeof service.images === "string") {
    try {
      const parsed = JSON.parse(service.images);
      if (Array.isArray(parsed)) images = parsed;
      else images = [service.images];
    } catch {
      images = service.images.split(",").map((s) => s.trim());
    }
  }

  if (service.logo && !images.includes(service.logo)) {
    images.unshift(service.logo);
  }

  if (images.length === 0) {
    images = [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
    ];
  }

  // Calculate live distance if coordinates exist
  const distanceKm =
    service.distanceKm ??
    (service.latitude != null && service.longitude != null
      ? calculateHaversineDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          service.latitude,
          service.longitude
        )
      : null);

  const cleanPhone = service.phone ? service.phone.replace(/[^0-9+]/g, "") : "";
  const cleanWhatsapp = service.whatsapp
    ? service.whatsapp.replace(/[^0-9]/g, "")
    : cleanPhone.replace(/[^0-9]/g, "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: `Check out ${service.name} by ${service.businessName} on Wide Service!`,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              {service.categoryName || "Local Service"}
            </span>
            {distanceKm !== null && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {formatDistance(distanceKm)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Share Service"
            >
              <Share2 className="w-4 h-4" />
              {copySuccess && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Gallery Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={service.name}
              className="w-full h-full object-cover"
            />

            {/* Subcategory Badge Overlay */}
            {service.subcategoryName && (
              <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-black border border-white/10 shadow-lg">
                {service.subcategoryName}
              </div>
            )}

            {/* Verified Badge */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Pro</span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-amber-500 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Provider */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {service.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {service.businessName || service.categoryName}
              </span>
              {service.subcategoryName && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800">
                    {service.subcategoryName}
                  </span>
                </>
              )}
              {distanceKm !== null && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs">
                    📍 {formatDistance(distanceKm)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">
                  Service Address
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                  {service.address}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">
                  Availability
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {service.schedule || "Open 24/7 (Emergency Service Available)"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Service Description
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {service.description}
              </p>
            </div>
          )}

          {/* Service Guarantees */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <span className="font-extrabold block text-sm">⚡ 30 Min</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Fast Doorstep Arrival
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
              <span className="font-extrabold block text-sm">🛡️ 7 Days</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Service Warranty
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
              <span className="font-extrabold block text-sm">✓ Genuine</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Spare Parts Only
              </span>
            </div>
          </div>

          {/* Interactive Leaflet Map Embed */}
          {service.latitude != null && service.longitude != null && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Live Location & Route
                </h4>
                {distanceKm !== null && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {formatDistance(distanceKm)} from you
                  </span>
                )}
              </div>
              <ServiceMapEmbed
                serviceLat={service.latitude}
                serviceLng={service.longitude}
                serviceName={service.name}
                userLat={userLocation.latitude}
                userLng={userLocation.longitude}
                height={220}
              />
            </div>
          )}
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          {/* Direct Phone Call */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Now ({service.phone})</span>
          </a>

          {/* WhatsApp Chat */}
          {cleanWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                `Hello, I found your service "${service.name}" on Wide Service. Are you currently available?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
