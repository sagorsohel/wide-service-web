"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Category, Subcategory, Service, UserLocation } from "../types";
import {
  getCategories,
  getSubcategories,
  getServices,
  sortServicesByDistance,
  formatDistance,
} from "../lib/api";
import { ServiceCard } from "./ServiceCard";
import { ServiceDetailModal } from "./ServiceDetailModal";
import {
  Search,
  Filter,
  Navigation,
  SlidersHorizontal,
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Zap,
} from "lucide-react";

interface LiveServiceDirectoryProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
}

export const LiveServiceDirectory: React.FC<LiveServiceDirectoryProps> = ({
  userLocation,
  onOpenLocationPicker,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [sortBy, setSortBy] = useState<"closest" | "rating" | "price">("closest");
  const [radiusFilter, setRadiusFilter] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Load initial categories & services
  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, srvResult] = await Promise.all([
        getCategories(),
        getServices({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          limit: 100,
        }),
      ]);
      setCategories(cats);
      setServices(srvResult.services);
    } catch (err) {
      console.warn("Error loading directory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userLocation.latitude, userLocation.longitude]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      getSubcategories(selectedCategory.id).then((subs) => setSubcategories(subs));
    } else {
      setSubcategories([]);
    }
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Filter & sort services
  const displayedServices = useMemo(() => {
    let result = [...services];

    // Category filter
    if (selectedCategory) {
      result = result.filter((s) => s.categoryId === selectedCategory.id);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      result = result.filter((s) => s.subcategoryId === selectedSubcategory.id);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.businessName && s.businessName.toLowerCase().includes(q)) ||
          s.address.toLowerCase().includes(q) ||
          (s.categoryName && s.categoryName.toLowerCase().includes(q)) ||
          (s.subcategoryName && s.subcategoryName.toLowerCase().includes(q))
      );
    }

    // Radius filter
    if (radiusFilter !== null) {
      result = result.filter((s) => s.distanceKm != null && s.distanceKm <= radiusFilter);
    }

    // Sorting
    if (sortBy === "closest") {
      result = sortServicesByDistance(result, userLocation);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price") {
      // Basic price sort fallback
      result.sort((a, b) => (a.price || "").localeCompare(b.price || ""));
    }

    return result;
  }, [
    services,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    sortBy,
    radiusFilter,
    userLocation,
  ]);

  return (
    <section id="services" className="py-16 relative bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Live On-Demand Directory</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Verified Technicians Near{" "}
              <button
                onClick={onOpenLocationPicker}
                className="underline decoration-amber-500 underline-offset-6 hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{userLocation.area}</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  (Change)
                </span>
              </button>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Showing services dynamically sorted by distance from your coordinates. 1-tap call & direct booking.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-amber-500 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Services</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technician name, service type, or area..."
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Sort:
              </span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                <button
                  onClick={() => setSortBy("closest")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === "closest"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ⚡ Closest First
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === "rating"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ★ Top Rated
                </button>
              </div>
            </div>
          </div>

          {/* Radius Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 mr-1">
              Distance Radius:
            </span>
            {[
              { label: "All Distance", value: null },
              { label: "⚡ Under 2 km", value: 2 },
              { label: "📍 Under 5 km", value: 5 },
              { label: "🚗 Under 10 km", value: 10 },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => setRadiusFilter(r.value)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  radiusFilter === r.value
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Browse Categories
            </span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Clear Category Filter ({selectedCategory.name})
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {/* "All" button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-3 rounded-2xl border min-w-[110px] flex flex-col items-center justify-center text-center shrink-0 transition-all cursor-pointer ${
                selectedCategory === null
                  ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/50"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg mb-1.5">
                🌐
              </div>
              <span className="text-xs font-bold">All Services</span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3 rounded-2xl border min-w-[125px] max-w-[150px] flex flex-col items-center justify-center text-center shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center p-1 mb-1.5 overflow-hidden">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xl">🛠️</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategories (if any category is active) */}
        {selectedCategory && subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1">
              Sub-specialties:
            </span>
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedSubcategory === null
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              All {selectedCategory.name}
            </button>
            {subcategories.map((sub) => {
              const isSubSelected = selectedSubcategory?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSubSelected
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-500/40"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 px-1">
          <span>
            Found{" "}
            <strong className="text-slate-900 dark:text-white font-black">
              {displayedServices.length}
            </strong>{" "}
            available technicians
          </span>
          {sortBy === "closest" && (
            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              ⚡ Sorted by nearest distance from {userLocation.area}
            </span>
          )}
        </div>

        {/* Service Cards Grid (2-Column on Desktop & Tablet) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 animate-pulse flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                </div>
                <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              </div>
            ))}
          </div>
        ) : displayedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                userLocation={userLocation}
                onSelect={(srv) => setSelectedService(srv)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-2xl mb-4">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching technicians found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
              We couldn&apos;t find any service provider matching your current filters. Try
              clearing the search query or selecting a different location.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setRadiusFilter(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenLocationPicker}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                Change Location Area
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        userLocation={userLocation}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
