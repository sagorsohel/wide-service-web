"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { UserLocation, Service } from "../../../types";
import { DEFAULT_USER_LOCATION } from "../../../lib/cities";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { CategoryHero } from "../../../components/CategoryHero";
import { CategoryFilterBar } from "../../../components/CategoryFilterBar";
import { LocationPickerModal } from "../../../components/LocationPickerModal";
import { ServiceDetailModal } from "../../../components/ServiceDetailModal";
import {
  CATEGORIES_LIST,
  AC_REPAIR_MOCK_CARDS,
  CategoryDetailCardItem,
} from "../../../data/servicesData";
import {
  Phone,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function SingleCategoryContent() {
  const params = useParams();
  const categorySlug = (params?.category as string) || "ac-repair";

  const [userLocation, setUserLocation] = useState<UserLocation>(
    DEFAULT_USER_LOCATION
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All Subcategories");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Any Price");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<Service | null>(null);

  // Active Category Meta
  const activeCategory = useMemo(() => {
    return (
      CATEGORIES_LIST.find((c) => c.slug === categorySlug) ||
      CATEGORIES_LIST[1] // default to AC Repair
    );
  }, [categorySlug]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return AC_REPAIR_MOCK_CARDS.filter((card) => {
      // Subcategory / tag filter
      if (
        selectedSubcategory !== "All Subcategories" &&
        !card.tags.some((t) =>
          selectedSubcategory.toLowerCase().includes(t.toLowerCase())
        )
      ) {
        // If subcategory doesn't match directly, keep visible or filter
      }

      // Search query
      if (appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(q);
        const matchesProvider = card.provider.toLowerCase().includes(q);
        const matchesTags = card.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProvider && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedSubcategory, appliedSearch]);

  const handleCardClick = (card: CategoryDetailCardItem) => {
    const srv: Service = {
      id: card.id,
      name: card.title,
      businessName: card.provider,
      categoryName: activeCategory.name,
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
      `Hello ${name}, I am interested in booking your ${activeCategory.name} service on Wide Service.`
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

      {/* Header */}
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
        {/* 1. Category Hero with Breadcrumbs & Badges matching Right Mockup */}
        <CategoryHero category={activeCategory} />

        {/* 2. Subcategory, Price & Search Filter Bar */}
        <CategoryFilterBar
          userLocation={userLocation}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
          subcategories={activeCategory.subcategories}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPerformSearch={() => setAppliedSearch(searchQuery)}
          categoryName={activeCategory.name}
        />

        {/* 3. Main Directory Section (Sidebar 25% + Grid 75%) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Categories + Call Support Card + Why Choose Us (col-span-3) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* All Categories List */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-4 tracking-tight">
                  All Categories
                </h3>

                <div className="space-y-1">
                  {CATEGORIES_LIST.map((cat) => {
                    const isActive = activeCategory.slug === cat.slug;
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

              {/* Need Help? Call Us Now Card matching Right Mockup */}
              <div className="rounded-2xl border border-amber-200 bg-[#fef9c3] p-5 shadow-2xs text-center space-y-3">
                {/* Agent Avatar */}
                <div className="relative w-14 h-14 mx-auto rounded-full bg-white border-2 border-[#d49b1a] overflow-hidden flex items-center justify-center shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt="Support Agent"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-white" />
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#0f172a] tracking-tight">
                    Need Help?
                  </h4>
                  <p className="text-xs font-bold text-slate-700">
                    Call Us Now
                  </p>
                </div>

                {/* Call Button Pill */}
                <a
                  href="tel:+8801700000000"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-slate-950 font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>+880 1700 000 000</span>
                </a>

                {/* Status Dot */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Available 24/7</span>
                </div>
              </div>

              {/* Why Choose Us? Card matching Right Mockup */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-black text-[#0f172a] tracking-tight">
                  Why Choose Us?
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>Verified & Experienced Technicians</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>Transparent Pricing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>Fast & Reliable Service</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>100% Customer Satisfaction</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Right Main Grid Area (col-span-9) */}
            <section className="lg:col-span-9 space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 px-5 py-4 shadow-2xs">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0f172a] tracking-tight">
                    {activeCategory.name} Services{" "}
                    <span className="text-slate-400 font-medium text-xs sm:text-sm">
                      ({activeCategory.count} found)
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

              {/* 2-Column Detailed Category Cards Grid matching Right Mockup (6 cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          alt={card.title}
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

                      {/* Card Content matching Right Mockup */}
                      <div className="p-4 space-y-2">
                        {/* Title in Blue Accent Font */}
                        <h3 className="font-extrabold text-[13px] text-[#0284c7] group-hover:text-[#0369a1] transition-colors leading-snug">
                          {card.title}
                        </h3>

                        {/* Provider Name */}
                        <p className="text-xs font-semibold text-slate-700">
                          {card.provider}
                        </p>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-extrabold text-slate-800">
                            {card.rating}
                          </span>
                          <span className="text-[#f59e0b]">★</span>
                          <span className="text-[11px] text-slate-400">
                            ({card.reviews} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="font-bold text-xs text-[#0f172a]">
                          {card.price}
                        </div>

                        {/* Feature Tags Row matching Right Mockup */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284c7] text-[10px] font-bold border border-sky-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Call & WhatsApp */}
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
                          handleWhatsapp(e, card.whatsapp, card.provider)
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

              {/* Pagination matching Right Mockup: < 1 2 3 4 5 ... 15 > */}
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
                  onClick={() => setCurrentPage(15)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === 15
                      ? "bg-[#d49b1a] text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  15
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(15, p + 1))}
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

export default function SingleCategoryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading category...
        </div>
      }
    >
      <SingleCategoryContent />
    </React.Suspense>
  );
}

