"use client";

import React, { useState } from "react";
import { UserLocation, CityOption } from "../types";
import { POPULAR_LOCATIONS } from "../lib/cities";
import {
  MapPin,
  Navigation,
  Search,
  X,
  Check,
  LocateFixed,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle HTML5 Geolocation
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Reverse geocode using OpenStreetMap Nominatim for human-readable area name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const area =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.quarter ||
              addr.city_district ||
              addr.town ||
              "Current Location";
            const city =
              addr.city || addr.town || addr.state || addr.county || "Bangladesh";

            const newLoc: UserLocation = {
              address: data.display_name || `${area}, ${city}`,
              area,
              city,
              latitude: lat,
              longitude: lng,
              isCurrentGps: true,
              updatedAt: new Date().toISOString(),
            };

            onSelectLocation(newLoc);
            onClose();
            return;
          }
        } catch (e) {
          console.warn("Reverse geocode failed:", e);
        }

        // Fallback with raw coordinates
        const fallbackLoc: UserLocation = {
          address: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          area: "GPS Location",
          city: "Detected",
          latitude: lat,
          longitude: lng,
          isCurrentGps: true,
          updatedAt: new Date().toISOString(),
        };
        onSelectLocation(fallbackLoc);
        onClose();
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setGpsError("Location permission denied. Please select your city below.");
        } else {
          setGpsError("Unable to retrieve your location. Please choose a city below.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectCity = (cityOpt: CityOption) => {
    const loc: UserLocation = {
      address: `${cityOpt.area}, ${cityOpt.name}, Bangladesh`,
      area: cityOpt.area,
      city: cityOpt.name,
      latitude: cityOpt.lat,
      longitude: cityOpt.lng,
      isCurrentGps: false,
      updatedAt: new Date().toISOString(),
    };
    onSelectLocation(loc);
    onClose();
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Choose Your Location
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Show nearest verified technicians & live distances
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Action */}
        <div className="p-6 space-y-4">
          {/* Current GPS Button */}
          <button
            onClick={handleUseCurrentGPS}
            disabled={isLocating}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <LocateFixed
              className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`}
            />
            {isLocating ? "Locating your GPS..." : "Use My Current GPS Location"}
          </button>

          {gpsError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Shaheb Bazar, Dhanmondi, Mirpur)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 no-scrollbar">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Popular Cities & Hubs</span>
            <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
              ⚡ Nearest first
            </span>
          </div>

          {filteredLocations.map((loc, idx) => {
            const isSelected =
              Math.abs(currentLocation.latitude - loc.lat) < 0.001 &&
              Math.abs(currentLocation.longitude - loc.lng) < 0.001;

            return (
              <button
                key={`${loc.name}-${loc.area}-${idx}`}
                onClick={() => handleSelectCity(loc)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/60 text-amber-950 dark:text-amber-200"
                    : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight">
                      {loc.area}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {loc.name}, Bangladesh
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Active Location Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="font-semibold text-slate-400">Current:</span>
            <span className="font-bold truncate text-slate-900 dark:text-white">
              {currentLocation.area}, {currentLocation.city}
            </span>
          </div>
          <span className="shrink-0 text-[11px] font-mono text-slate-400">
            {currentLocation.latitude.toFixed(3)}, {currentLocation.longitude.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};
