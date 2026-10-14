"use client";

import React from "react";
import { Service, UserLocation } from "../types";
import { formatDistance, calculateHaversineDistanceKm } from "../lib/api";
import { PhoneCall, MapPin, Phone, MessageSquare, Star, ShieldCheck } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  userLocation: UserLocation;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  userLocation,
  onSelect,
}) => {
  const imageUri =
    service.logo ||
    (Array.isArray(service.images) && service.images[0]) ||
    "https://img.icons8.com/fluency/96/maintenance.png";

  const cleanPhone = service.phone ? service.phone.replace(/[^0-9+]/g, "") : "";

  // Dynamic distance calculation if not pre-computed
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

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  return (
    <div
      onClick={() => onSelect(service)}
      className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all flex items-center gap-3.5 cursor-pointer relative"
    >
      {/* Left: Image / Logo */}
      <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-amber-50/70 border border-amber-100/90 items-center justify-center shrink-0 flex relative shadow-2xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUri}
          alt={service.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Middle: Service Info */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Service Name */}
        <h4 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug truncate group-hover:text-amber-600 transition-colors">
          {service.name}
        </h4>

        {/* Business Name with Verified Indicator & Distance Badge */}
        <div className="flex items-center justify-between gap-1.5 mt-0.5 mb-1">
          <span className="text-xs font-bold text-amber-900 truncate flex items-center gap-1">
            <span className="truncate">{service.businessName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </span>

          {distanceKm !== null && distanceKm !== undefined && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 whitespace-nowrap ${
                distanceKm <= 1
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : distanceKm <= 3
                  ? "bg-amber-50 border border-amber-200 text-amber-800"
                  : "bg-slate-100 border border-slate-200 text-slate-600"
              }`}
            >
              {distanceKm < 1
                ? `⚡ ${Math.round(distanceKm * 1000)}m`
                : `📍 ${distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Location / Address */}
        <div className="flex items-center text-[11px] text-slate-500 mb-1 truncate">
          <MapPin className="w-3 h-3 shrink-0 mr-1 text-slate-400" />
          <span className="truncate">{service.address}</span>
        </div>

        {/* Phone & Availability */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center text-emerald-700 font-mono font-bold">
            <Phone className="w-2.5 h-2.5 mr-1 shrink-0 text-emerald-600" />
            <span>{service.phone}</span>
          </div>

          <div className="font-medium text-slate-500 text-[10px]">
            {service.schedule || "Open Today"}
          </div>
        </div>
      </div>

      {/* Right: Direct Call Button */}
      <button
        type="button"
        onClick={handleCall}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 active:scale-95 transition-all shrink-0 cursor-pointer"
        title={`Call ${service.phone}`}
      >
        <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
