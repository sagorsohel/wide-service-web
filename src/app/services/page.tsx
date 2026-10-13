"use client";

import React, { useState, useMemo } from "react";
import { UserLocation, Service } from "../../types";
import { DEFAULT_USER_LOCATION } from "../../lib/cities";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { AllServicesHero } from "../../components/AllServicesHero";
import { ServicesFeatureStrip } from "../../components/ServicesFeatureStrip";
import { LocationPickerModal } from "../../components/LocationPickerModal";
import { ServiceDetailModal } from "../../components/ServiceDetailModal";
import {
  CATEGORIES_LIST,
  ALL_SERVICES_MOCK_CARDS,
  AllServicesCardItem,
} from "../../data/servicesData";
import {
  Phone,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(
    DEFAULT_USER_LOCATION
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>([]);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(
    null
  );
  const [selectedExperienceFilter, setSelectedExperienceFilter] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<Service | null>(null);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return ALL_SERVICES_MOCK_CARDS.filter((card) => {
      // Category filter
      if (
        selectedCategorySlug !== "all" &&
        card.categorySlug !== selectedCategorySlug
      ) {
        return false;
      }
      // Search query
      if (appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesCat = card.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      // Rating filter
      if (selectedRatingFilter && card.rating < selectedRatingFilter) {
        return false;
      }
      return true;
    });
  }, [selectedCategorySlug, appliedSearch, selectedRatingFilter]);

  const handlePerformSearch = () => {
    setAppliedSearch(searchQuery);
  };

  const handleCardClick = (card: AllServicesCardItem) => {
    // Convert to Service object to open ServiceDetailModal
    const srv: Service = {
      id: card.id,
      name: card.name,
      businessName: card.category,
      categoryName: card.category,
      address: `${userLocation.city || "Dhaka"}, Bangladesh`,
      phone: card.phone,
      whatsapp: card.whatsapp,
      rating: card.rating,
      reviewCount: card.reviews,
      price: card.price,
      distanceKm: parseFloat(card.distance),
      status: "active",
      categoryId: 1,
      images: [card.image],
    };
    setSelectedServiceForModal(srv);
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsapp = (e: React.MouseEvent, whatsapp: string, name: string) => {
    e.stopPropagation();
    const cleanNumber = whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${name}, I found your service on Wide Service and would like to hire you.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={setUserLocation}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        userLocation={userLocation}
        onClose={() => setSelectedServiceForModal(null)}
      />

      {/* Header with Services Active */}
      <Header
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenDownload={() => {}}
        isMobileAppMode={false}
        onToggleMobileAppMode={() => {}}
        activeNav="Services"
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. All Services Hero matching Left Mockup */}
        <AllServicesHero
          userLocation={userLocation}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
          selectedCategory={selectedCategorySlug}
          onSelectCategory={setSelectedCategorySlug}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPerformSearch={handlePerformSearch}
        />

        {/* 2. 4-Feature Value Strip */}
        <ServicesFeatureStrip />

        {/* 3. Main Two-Column Directory Section (Sidebar 25% + Grid 75%) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Filters matching Mockup (col-span-3) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Categories Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-4 tracking-tight flex items-center justify-between">
                  <span>Categories</span>
                </h3>

                <div className="space-y-1">
                  {CATEGORIES_LIST.map((cat) => {
                    const isActive = selectedCategorySlug === cat.slug;
                    return (
                      <Link
                        key={cat.slug}
                        href={cat.slug === "all" ? "/services" : `/services/${cat.slug}`}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold shadow-2xs"
                            : "hover:bg-slate-50 text-slate-700 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-sm shrink-0">
                            {cat.slug === "ac-repair"
                              ? "❄️"
                              : cat.slug === "plumbing"
                              ? "💧"
                              : cat.slug === "electrical"
                              ? "⚡"
                              : cat.slug === "cleaning"
                              ? "🧹"
                              : cat.slug === "carpentry"
                              ? "🔨"
                              : cat.slug === "cctv"
                              ? "📹"
                              : cat.slug === "appliances"
                              ? "🧺"
                              : cat.slug === "all"
                              ? "⊞"
                              : "⚙️"}
                          </span>
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-amber-500/20 text-[#92400e] font-extrabold"
                              : "text-slate-400 font-normal"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-3.5 tracking-tight">
                  Price Range
                </h3>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  {[
                    "Under ৳500",
                    "৳500 - ৳1,000",
                    "৳1,000 - ৳2,000",
                    "৳2,000 - ৳5,000",
                    "Above ৳5,000",
                  ].map((range) => (
                    <label
                      key={range}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceFilters.includes(range)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPriceFilters([
                              ...selectedPriceFilters,
                              range,
                            ]);
                          } else {
                            setSelectedPriceFilters(
                              selectedPriceFilters.filter((r) => r !== range)
                            );
                          }
                        }}
                        className="rounded border-slate-300 text-[#d49b1a] focus:ring-[#d49b1a] w-4 h-4"
                      />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-3.5 tracking-tight">
                  Rating
                </h3>
                <div className="space-y-2 text-xs font-medium">
                  {[
                    { stars: 5, val: 4.5, label: "4.5 & above" },
                    { stars: 4, val: 4.0, label: "4.0 & above" },
                    { stars: 3, val: 3.5, label: "3.5 & above" },
                  ].map((r) => (
                    <label
                      key={r.val}
                      onClick={() =>
                        setSelectedRatingFilter(
                          selectedRatingFilter === r.val ? null : r.val
                        )
                      }
                      className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        checked={selectedRatingFilter === r.val}
                        onChange={() => {}}
                        className="text-[#d49b1a] focus:ring-[#d49b1a] w-4 h-4"
                      />
                      <div className="flex items-center gap-0.5 text-[#f59e0b]">
                        {[...Array(r.stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-3.5 tracking-tight">
                  Experience
                </h3>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  {["1+ year", "3+ years", "5+ years", "10+ years"].map((exp) => (
                    <label
                      key={exp}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperienceFilter === exp}
                        onChange={() =>
                          setSelectedExperienceFilter(
                            selectedExperienceFilter === exp ? null : exp
                          )
                        }
                        className="rounded border-slate-300 text-[#d49b1a] focus:ring-[#d49b1a] w-4 h-4"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Main Grid Area (col-span-9) */}
            <section className="lg:col-span-9 space-y-6">
              {/* Header Bar: Results Count + Sort Dropdown matching Mockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 px-5 py-4 shadow-2xs">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0f172a] tracking-tight">
                    All Services{" "}
                    <span className="text-slate-400 font-medium text-xs sm:text-sm">
                      ({filteredCards.length > 0 ? "1,800+ found" : "0 found"})
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0f172a] focus:outline-none cursor-pointer pr-7 appearance-none"
                    >
                      <option value="nearest">Nearest First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3-Column Service Cards Grid matching Left Mockup (9 cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Image Thumbnail with Verified & Distance Badges */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Verified Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#10b981] text-white text-[10px] font-bold shadow-2xs">
                          ✓ Verified
                        </div>
                        {/* Distance Badge */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-bold shadow-2xs">
                          📍 {card.distance}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4">
                        <div className="flex items-start gap-2.5 mb-2">
                          {/* Round colored category icon */}
                          <div
                            className={`w-8 h-8 rounded-full ${card.iconBg} text-white flex items-center justify-center shrink-0 shadow-2xs text-xs`}
                          >
                            ⚡
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-extrabold text-[13px] text-[#0f172a] truncate group-hover:text-[#d49b1a] transition-colors">
                              {card.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 truncate">
                              {card.category}
                            </p>
                          </div>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1.5 text-xs mb-2">
                          <span className="font-extrabold text-slate-800">
                            {card.rating}
                          </span>
                          <span className="text-[#f59e0b]">★</span>
                          <span className="text-[11px] text-slate-400">
                            ({card.reviews} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="font-bold text-xs sm:text-sm text-[#0f172a]">
                          {card.price}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions: Call (yellow) & WhatsApp (green) */}
                    <div className="p-3.5 pt-0 flex items-center gap-2">
                      <button
                        onClick={(e) => handleCall(e, card.phone)}
                        className="flex-1 py-2 px-3 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#d49b1a]" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={(e) =>
                          handleWhatsapp(e, card.whatsapp, card.name)
                        }
                        className="flex-1 py-2 px-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination matching Left Mockup: < 1 2 3 4 5 ... 60 > */}
              <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#d49b1a] text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <span className="text-slate-400 text-xs px-1">...</span>

                <button
                  onClick={() => setCurrentPage(60)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === 60
                      ? "bg-[#d49b1a] text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  60
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(60, p + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
