"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserLocation, Service, Category } from "../../types";
import { DEFAULT_USER_LOCATION } from "../../lib/cities";
import {
  getServices,
  getCategories,
  slugifyCategory,
  getCategoryVisuals,
} from "../../lib/api";
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
  MapPin,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(
    DEFAULT_USER_LOCATION,
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<Service | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [liveServices, setLiveServices] = useState<AllServicesCardItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Load dynamic categories from backend API
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.warn("[Wide Service] Categories fetch fallback:", err);
      }
    }
    loadCats();
  }, []);

  // Dynamic category list combining "All Services" and real backend categories
  const dynamicCategories = useMemo(() => {
    const list = [
      {
        id: "all",
        name: "All Services",
        slug: "all",
        count: totalCount > 0 ? `${totalCount}+` : "1,800+",
        icon: "⊞",
        backendCategoryId: undefined as number | undefined,
      },
    ];

    if (categories.length > 0) {
      categories.forEach((cat) => {
        const visuals = getCategoryVisuals(cat.name);
        list.push({
          id: String(cat.id),
          name: cat.name,
          slug: slugifyCategory(cat.name),
          count: "Active",
          icon: visuals.icon,
          backendCategoryId: cat.id,
        });
      });
      return list;
    }

    return CATEGORIES_LIST.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count,
      icon: c.slug === "ac-repair" ? "❄️" : c.slug === "plumbing" ? "💧" : "⚙️",
      backendCategoryId: c.backendCategoryId,
    }));
  }, [categories, totalCount]);

  // Fetch live backend services on filters/page change
  useEffect(() => {
    async function fetchBackendData() {
      setLoading(true);
      try {
        const catMeta = dynamicCategories.find(
          (c) => c.slug === selectedCategorySlug,
        );
        const res = await getServices({
          categoryId: catMeta?.backendCategoryId,
          search: appliedSearch || undefined,
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          page: currentPage,
          limit: 12,
        });

        if (res.services && res.services.length > 0) {
          const mapped: AllServicesCardItem[] = res.services.map(
            (s: Service, idx: number) => {
              const visuals = getCategoryVisuals(
                s.categoryName || s.name || "service",
              );
              return {
                id: s.id,
                name: s.name,
                category: s.businessName || s.categoryName || "Home Service",
                categorySlug:
                  selectedCategorySlug !== "all"
                    ? selectedCategorySlug
                    : slugifyCategory(s.categoryName || "service"),
                image:
                  Array.isArray(s.images) && s.images[0]
                    ? s.images[0]
                    : s.logo ||
                      ALL_SERVICES_MOCK_CARDS[
                        idx % ALL_SERVICES_MOCK_CARDS.length
                      ].image,
                distance: s.distanceKm
                  ? `${s.distanceKm.toFixed(1)} km`
                  : `${(1.2 + (idx % 6) * 1.1).toFixed(1)} km`,
                address: s.address,
                schedule: s.schedule || "Open Today",
                phone: s.phone || "01712-345678",
                whatsapp: s.whatsapp || s.phone || "8801712345678",
                iconBg: visuals.bgColor,
              };
            },
          );
          setLiveServices(mapped);
          setTotalCount(res.total || mapped.length);
        } else {
          setLiveServices([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.warn("[Wide Service] Backend fetch fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBackendData();
  }, [
    selectedCategorySlug,
    appliedSearch,
    currentPage,
    userLocation.latitude,
    userLocation.longitude,
    dynamicCategories,
  ]);

  // Cards to display with sorting
  const filteredCards = useMemo(() => {
    const source =
      liveServices.length > 0 ? liveServices : ALL_SERVICES_MOCK_CARDS;
    let result = source.filter((card) => {
      // Category filter for fallback
      if (
        liveServices.length === 0 &&
        selectedCategorySlug !== "all" &&
        card.categorySlug !== selectedCategorySlug
      ) {
        return false;
      }
      // Search query for fallback
      if (liveServices.length === 0 && appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesCat = card.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      return true;
    });

    if (sortBy === "name_asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [liveServices, selectedCategorySlug, appliedSearch, sortBy]);

  const handlePerformSearch = () => {
    setAppliedSearch(searchQuery);
  };

  const handleCardClick = (card: AllServicesCardItem) => {
    const srv: Service = {
      id: card.id,
      name: card.name,
      businessName: card.category,
      categoryName: card.category,
      address: card.address || `${userLocation.city || "Dhaka"}, Bangladesh`,
      schedule: card.schedule || "Open 24/7",
      phone: card.phone,
      whatsapp: card.whatsapp,
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

  const handleWhatsapp = (
    e: React.MouseEvent,
    whatsapp: string,
    name: string,
  ) => {
    e.stopPropagation();
    const cleanNumber = whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${name}, I found your service on Wide Service and would like to hire you.`,
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  const totalPages = Math.max(
    1,
    Math.ceil((totalCount || filteredCards.length) / 12),
  );

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
        {/* 1. All Services Hero */}
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

        {/* 3. Main Directory Section (Sidebar 25% + Grid 75%) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Dynamic Categories & Support (col-span-3) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Dynamic Categories Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-4 tracking-tight flex items-center justify-between">
                  <span>Categories</span>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {dynamicCategories.length - 1} Total
                  </span>
                </h3>

                <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                  {dynamicCategories.map((cat) => {
                    const isActive = selectedCategorySlug === cat.slug;
                    return (
                      <Link
                        key={cat.slug}
                        href={
                          cat.slug === "all"
                            ? "/services"
                            : `/services/${cat.slug}`
                        }
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold shadow-2xs"
                            : "hover:bg-slate-50 text-slate-700 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-sm shrink-0">{cat.icon}</span>
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

              {/* Need Help? Call Us Now Card */}
              <div className="rounded-2xl border border-amber-200 bg-[#fef9c3] p-5 shadow-2xs text-center space-y-3">
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

                <a
                  href="tel:+8801700000000"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-slate-950 font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>+880 1700 000 000</span>
                </a>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Available 24/7 Support</span>
                </div>
              </div>

              {/* Why Choose Us Card */}
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
                    <span>Direct Call & WhatsApp Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>Nearby Location Based Matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>100% Genuine Local Service</span>
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
                    All Services{" "}
                    <span className="text-slate-400 font-medium text-xs sm:text-sm">
                      (
                      {totalCount > 0
                        ? `${totalCount}+ found`
                        : `${filteredCards.length} found`}
                      )
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
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3-Column Service Cards Grid - No Price, No Rating */}
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

                        {/* Distance Badge */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-bold shadow-2xs">
                          📍 {card.distance}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4">
                        <div className="flex items-start gap-2.5 mb-2">
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

                        {/* Location / Address */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#d49b1a] shrink-0" />
                          <span className="truncate">
                            {card.address || "Available Locally"}
                          </span>
                        </div>

                        {/* Availability / Schedule */}
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1.5 mb-1 truncate">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {card.schedule || "Open Today"}
                          </span>
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

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3, 4, 5].slice(0, totalPages).map((page) => (
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

                {totalPages > 5 && (
                  <>
                    <span className="text-slate-400 text-xs px-1">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? "bg-[#d49b1a] text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
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
