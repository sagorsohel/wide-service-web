"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { UserLocation, Service, Subcategory, Category } from "../../../types";
import { DEFAULT_USER_LOCATION } from "../../../lib/cities";
import {
  getServices,
  getSubcategories,
  getCategories,
  slugifyCategory,
  getCategoryVisuals,
} from "../../../lib/api";
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
  MapPin,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<Service | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [liveServices, setLiveServices] = useState<CategoryDetailCardItem[]>([]);
  const [liveSubcategories, setLiveSubcategories] = useState<Subcategory[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Load all categories dynamically from backend
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (e) {
        console.warn("[Wide Service] Failed to load categories:", e);
      }
    }
    loadCats();
  }, []);

  // Dynamic categories list with slugs & visuals
  const dynamicCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((cat) => {
        const visuals = getCategoryVisuals(cat.name);
        return {
          id: String(cat.id),
          name: cat.name,
          slug: slugifyCategory(cat.name),
          count: "Active",
          icon: visuals.icon,
          image: cat.image,
          backendCategoryId: cat.id,
          subcategories: ["All Subcategories"],
        };
      });
    }

    return CATEGORIES_LIST.filter((c) => c.slug !== "all").map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: "Active",
      icon: c.slug === "ac-repair" ? "❄️" : c.slug === "plumbing" ? "💧" : "⚙️",
      image: c.image,
      backendCategoryId: c.backendCategoryId,
      subcategories: c.subcategories,
    }));
  }, [categories]);

  // Active Category Meta: matching slug or ID
  const activeCategory = useMemo(() => {
    const found = dynamicCategories.find(
      (c) => c.slug === categorySlug || c.id === categorySlug
    );
    if (found) {
      const visuals = getCategoryVisuals(found.name);
      return {
        id: found.id,
        name: found.name,
        slug: found.slug,
        count: found.count,
        iconBg: visuals.bgColor,
        image: found.image,
        backendCategoryId: found.backendCategoryId,
        badgeText: found.name,
        heroTitle: found.name,
        heroSubtitle: `Professional ${found.name} services by verified local technicians. Direct Call and WhatsApp support available.`,
        heroTagline: "Fast & Reliable Local Service",
        subcategories: found.subcategories,
      };
    }

    const staticFound = CATEGORIES_LIST.find((c) => c.slug === categorySlug);
    return (
      staticFound ||
      CATEGORIES_LIST[1] // default to AC Repair
    );
  }, [categorySlug, dynamicCategories]);

  // Fetch live subcategories for this category from backend
  useEffect(() => {
    async function fetchSubcategories() {
      if (activeCategory.backendCategoryId) {
        try {
          const subs = await getSubcategories(activeCategory.backendCategoryId);
          setLiveSubcategories(subs);
        } catch (e) {
          console.warn("[Wide Service] Subcategories fetch error:", e);
        }
      }
    }
    fetchSubcategories();
  }, [activeCategory.backendCategoryId]);

  // Subcategory list strings for the filter bar
  const subcategoryOptions = useMemo(() => {
    if (liveSubcategories.length > 0) {
      return ["All Subcategories", ...liveSubcategories.map((s) => s.name)];
    }
    return activeCategory.subcategories || ["All Subcategories"];
  }, [liveSubcategories, activeCategory.subcategories]);

  // Fetch live services for this category from backend
  useEffect(() => {
    async function fetchCategoryServices() {
      setLoading(true);
      try {
        let matchedSubId: number | undefined = undefined;
        if (selectedSubcategory !== "All Subcategories") {
          const matched = liveSubcategories.find(
            (s) => s.name.toLowerCase() === selectedSubcategory.toLowerCase()
          );
          if (matched) {
            matchedSubId = matched.id;
          }
        }

        const res = await getServices({
          categoryId: activeCategory.backendCategoryId,
          subcategoryId: matchedSubId,
          search: appliedSearch || undefined,
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          page: currentPage,
          limit: 10,
        });

        if (res.services && res.services.length > 0) {
          const mapped: CategoryDetailCardItem[] = res.services.map(
            (s: Service, idx: number) => ({
              id: s.id,
              title: s.name,
              provider: s.businessName || s.creatorName || activeCategory.name,
              categorySlug: activeCategory.slug,
              image:
                Array.isArray(s.images) && s.images[0]
                  ? s.images[0]
                  : s.logo ||
                    AC_REPAIR_MOCK_CARDS[idx % AC_REPAIR_MOCK_CARDS.length].image,
              distance: s.distanceKm
                ? `${s.distanceKm.toFixed(1)} km`
                : `${(1.2 + (idx % 4) * 0.8).toFixed(1)} km`,
              address: s.address,
              schedule: s.schedule || "Open Today",
              phone: s.phone || "01712-345678",
              whatsapp: s.whatsapp || s.phone || "8801712345678",
              description: s.description,
              tags: [
                s.subcategoryName || activeCategory.name,
                "Verified Technician",
                "Direct Contact",
              ],
            })
          );
          setLiveServices(mapped);
          setTotalCount(res.total || mapped.length);
        } else {
          setLiveServices([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.warn("[Wide Service] Category services fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryServices();
  }, [
    activeCategory.backendCategoryId,
    activeCategory.name,
    activeCategory.slug,
    selectedSubcategory,
    appliedSearch,
    currentPage,
    userLocation.latitude,
    userLocation.longitude,
    liveSubcategories,
  ]);

  // Display Cards: backend services with fallback to mockup cards
  const displayCards = useMemo(() => {
    const source =
      liveServices.length > 0 ? liveServices : AC_REPAIR_MOCK_CARDS;

    let filtered = source.filter((card) => {
      // Subcategory / tag filter (when fallback is active)
      if (
        liveServices.length === 0 &&
        selectedSubcategory !== "All Subcategories" &&
        !card.tags.some((t) =>
          selectedSubcategory.toLowerCase().includes(t.toLowerCase())
        )
      ) {
        return false;
      }

      // Search query (when fallback is active)
      if (liveServices.length === 0 && appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(q);
        const matchesProvider = card.provider.toLowerCase().includes(q);
        const matchesTags = card.tags.some((t) =>
          t.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesProvider && !matchesTags) return false;
      }

      return true;
    });

    if (sortBy === "name_asc") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "name_desc") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [liveServices, selectedSubcategory, appliedSearch, sortBy]);

  const handleCardClick = (card: CategoryDetailCardItem) => {
    const srv: Service = {
      id: card.id,
      name: card.title,
      businessName: card.provider,
      categoryName: activeCategory.name,
      address: card.address || `${userLocation.city || "Dhaka"}, Bangladesh`,
      schedule: card.schedule || "Open 24/7",
      phone: card.phone,
      whatsapp: card.whatsapp,
      distanceKm: parseFloat(card.distance),
      description: card.description,
      status: "active",
      categoryId: activeCategory.backendCategoryId || 1,
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

  const totalPages = Math.max(1, Math.ceil((totalCount || displayCards.length) / 10));

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
        {/* 1. Category Hero with Breadcrumbs & Badges */}
        <CategoryHero category={activeCategory} />

        {/* 2. Subcategory & Search Filter Bar (No Price) */}
        <CategoryFilterBar
          userLocation={userLocation}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
          subcategories={subcategoryOptions}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPerformSearch={() => setAppliedSearch(searchQuery)}
          categoryName={activeCategory.name}
        />

        {/* 3. Main Directory Section (Sidebar 25% + Grid 75%) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: All Categories + Support (col-span-3) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* All Categories List */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0f172a] mb-4 tracking-tight flex items-center justify-between">
                  <span>Categories</span>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {dynamicCategories.length} Total
                  </span>
                </h3>

                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                  {dynamicCategories.map((cat) => {
                    const isActive = activeCategory.slug === cat.slug;
                    return (
                      <div key={cat.slug} className="space-y-1">
                        <Link
                          href={`/services/${cat.slug}`}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#fef9c3] text-[#92400e] border border-[#fde68a] font-bold shadow-2xs"
                              : "hover:bg-slate-50 text-slate-700 font-semibold"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-5 h-5 object-contain shrink-0"
                              />
                            ) : (
                              <span className="text-sm shrink-0">{cat.icon}</span>
                            )}
                            <span className="truncate">{cat.name}</span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                              isActive ? "rotate-90 text-[#92400e]" : "text-slate-400"
                            }`}
                          />
                        </Link>

                        {/* Tree Design Subcategories when active */}
                        {isActive && liveSubcategories && liveSubcategories.length > 0 && (
                          <div className="ml-5 pl-3 py-1 space-y-1 border-l-2 border-amber-300 relative my-1 animate-in slide-in-from-top-1 duration-200">
                            {/* All Subcategories Option */}
                            <button
                              type="button"
                              onClick={() => setSelectedSubcategory("All Subcategories")}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                                selectedSubcategory === "All Subcategories"
                                  ? "bg-amber-100/90 text-amber-950 font-extrabold shadow-2xs"
                                  : "hover:bg-amber-50/60 text-slate-600 font-medium"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="truncate">All {cat.name}</span>
                            </button>

                            {/* Subcategory items */}
                            {liveSubcategories.map((sub) => {
                              const isSubActive = selectedSubcategory === sub.name;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => setSelectedSubcategory(sub.name)}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                                    isSubActive
                                      ? "bg-amber-100/90 text-amber-950 font-extrabold shadow-2xs"
                                      : "hover:bg-amber-50/60 text-slate-600 font-medium"
                                  }`}
                                >
                                  {sub.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={sub.image}
                                      alt={sub.name}
                                      className="w-3.5 h-3.5 object-contain shrink-0 rounded-xs"
                                    />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{sub.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
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

              {/* Why Choose Us? Card */}
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
                    <span>Direct Call & WhatsApp Connect</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d49b1a] text-sm font-bold">✓</span>
                    <span>Fast & Reliable Local Service</span>
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
                      ({totalCount > 0 ? `${totalCount}+ found` : `${displayCards.length} found`})
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

              {/* 2-Column Detailed Category Cards Grid - No Price, No Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayCards.map((card) => (
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

                        {/* Location / Address */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#d49b1a] shrink-0" />
                          <span className="truncate">{card.address || "Available Locally"}</span>
                        </div>

                        {/* Availability / Schedule */}
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold truncate">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{card.schedule || "Open Today"}</span>
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
