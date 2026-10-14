import { Category, Subcategory, Service, UserLocation } from "../types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apiwideservice.widetechbd.com/api";

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * Returns distance in kilometers (km).
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats distance nicely for display:
 * < 1 km -> "450m"
 * >= 1 km -> "1.4 km"
 */
export function formatDistance(distanceKm?: number | null): string {
  if (distanceKm === undefined || distanceKm === null) return "";
  if (distanceKm < 0.05) return "Near you";
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Sorts services by distance from the user's location ascending.
 * Also computes distanceKm if not already provided.
 */
export function sortServicesByDistance(
  services: Service[],
  userLocation?: UserLocation | null
): Service[] {
  if (!userLocation || userLocation.latitude == null || userLocation.longitude == null) {
    return services;
  }

  const uLat = userLocation.latitude;
  const uLng = userLocation.longitude;

  const withDistances = services.map((srv) => {
    let distanceKm = srv.distanceKm;
    if (
      (distanceKm == null || distanceKm === undefined) &&
      srv.latitude != null &&
      srv.longitude != null
    ) {
      distanceKm = calculateHaversineDistanceKm(uLat, uLng, srv.latitude, srv.longitude);
    }
    return {
      ...srv,
      distanceKm,
    };
  });

  return withDistances.sort((a, b) => {
    const distA = a.distanceKm != null ? a.distanceKm : 999999;
    const distB = b.distanceKm != null ? b.distanceKm : 999999;
    return distA - distB;
  });
}

// Fallback Categories
export const FALLBACK_CATEGORIES: Category[] = [
  { id: 37, name: "Gas", image: "https://image.streamespn.org/uploads/13384594-1791896052328-738067288.webp" },
  { id: 7, name: "AC & Cooling Repair", image: "https://img.icons8.com/fluency/96/air-conditioner.png" },
  { id: 8, name: "Plumbing Services", image: "https://img.icons8.com/fluency/96/plumbing.png" },
  { id: 9, name: "Electrical & Wiring", image: "https://img.icons8.com/fluency/96/electrical.png" },
  { id: 10, name: "House Cleaning", image: "https://img.icons8.com/fluency/96/cleaning-service.png" },
  { id: 11, name: "Appliance Repair", image: "https://img.icons8.com/fluency/96/washing-machine.png" },
  { id: 12, name: "Painting & Renovation", image: "https://img.icons8.com/fluency/96/paint-brush.png" },
  { id: 13, name: "Carpentry & Woodwork", image: "https://img.icons8.com/fluency/96/saw.png" },
  { id: 14, name: "Shifting & Moving", image: "https://img.icons8.com/fluency/96/van.png" },
  { id: 15, name: "Pest Control", image: "https://img.icons8.com/fluency/96/insect.png" },
];

// Fallback Services
export const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Master Jet Cleaning & Complete AC Overhaul",
    businessName: "CoolTech Pro Solutions",
    logo: "https://img.icons8.com/fluency/96/air-conditioner.png",
    address: "Holding 42, Zero Point, Shaheb Bazar, Boalia, Rajshahi",
    phone: "01712-345678",
    whatsapp: "8801712345678",
    categoryId: 1,
    categoryName: "AC Repair & Servicing",
    subcategoryId: 1,
    subcategoryName: "AC Deep Cleaning",
    description: "Certified technicians for jet cleaning, refrigerant gas leak detection, compressor maintenance, and fast cooling boost. 15-day service guarantee included.",
    status: "active",
    price: "৳ 650 / Unit",
    rating: 4.9,
    reviewCount: 312,
    experience: "10-year Experience",
    latitude: 24.3636,
    longitude: 88.6241,
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: 2,
    name: "Emergency Water Pipe Leak Detection & Tap Fitting",
    businessName: "AquaFix Plumbing Experts",
    logo: "https://img.icons8.com/fluency/96/plumbing.png",
    address: "Ranibazar Fire Service Mor, Boalia, Rajshahi",
    phone: "01819-876543",
    whatsapp: "8801819876543",
    categoryId: 2,
    categoryName: "Plumbing Services",
    subcategoryId: 2,
    subcategoryName: "Leakage & Pipe Repair",
    description: "Rapid response plumbing service for bathroom lines, kitchen sink blockages, water pump installation, and concealed pipeline leak detection.",
    status: "active",
    price: "৳ 450 / Visit",
    rating: 4.8,
    reviewCount: 245,
    experience: "8-year Experience",
    latitude: 24.367,
    longitude: 88.602,
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: 3,
    name: "Short Circuit Troubleshooting & DB Board Setup",
    businessName: "VoltMaster Bangladesh",
    logo: "https://img.icons8.com/fluency/96/electrical.png",
    address: "Shalbagan Bus Stand, Shah Makhdum, Rajshahi",
    phone: "01911-223344",
    whatsapp: "8801911223344",
    categoryId: 3,
    categoryName: "Electrical Wiring & Repair",
    subcategoryId: 3,
    subcategoryName: "Circuit Breaker & Wiring",
    description: "Licensed electricians equipped with digital multimeters for prompt short circuit diagnosis, ceiling fan mounting, IPS wiring, and smart home lighting setup.",
    status: "active",
    price: "৳ 400 / Visit",
    rating: 4.9,
    reviewCount: 198,
    experience: "12-year Experience",
    latitude: 24.393,
    longitude: 88.605,
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: 4,
    name: "Comprehensive Home Sanitization & Deep Cleaning",
    businessName: "ShineMax Cleaning Team",
    logo: "https://img.icons8.com/fluency/96/cleaning-service.png",
    address: "Sagarpara Bottola, Boalia, Rajshahi",
    phone: "01723-998877",
    whatsapp: "8801723998877",
    categoryId: 4,
    categoryName: "Home Deep Cleaning",
    subcategoryId: 4,
    subcategoryName: "Kitchen & Floor Cleaning",
    description: "Eco-friendly industrial steam scrubbing for tiles, kitchen grease removal, sofa shampooing, and bathroom disinfection. Free quote available on inspection.",
    status: "active",
    price: "৳ 1,200 / Room",
    rating: 4.7,
    reviewCount: 167,
    experience: "6-year Experience",
    latitude: 24.368,
    longitude: 88.606,
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    ],
  },
];

/**
 * Fetch all categories from backend API with fallback
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("[Wide Service Web] API Categories fallback active:", err);
  }
  return FALLBACK_CATEGORIES;
}

/**
 * Fetch subcategories for a given category
 */
export async function getSubcategories(categoryId: number): Promise<Subcategory[]> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/subcategories?categoryId=${categoryId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("[Wide Service Web] API Subcategories fallback active:", err);
  }
  return [];
}

/**
 * Creates URL-friendly slug from category name
 */
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns consistent visual theme (icon, background) for any category name
 */
export function getCategoryVisuals(catName: string): { icon: string; bgColor: string } {
  const n = catName.toLowerCase();
  if (n.includes("ac") || n.includes("cooling")) return { icon: "❄️", bgColor: "bg-[#0284c7]" };
  if (n.includes("plumb")) return { icon: "💧", bgColor: "bg-[#0891b2]" };
  if (n.includes("electr")) return { icon: "⚡", bgColor: "bg-[#eab308]" };
  if (n.includes("clean") || n.includes("saniti")) return { icon: "🧹", bgColor: "bg-[#059669]" };
  if (n.includes("carpent") || n.includes("wood")) return { icon: "🔨", bgColor: "bg-[#9333ea]" };
  if (n.includes("cctv") || n.includes("secur")) return { icon: "📹", bgColor: "bg-[#e11d48]" };
  if (n.includes("appliance") || n.includes("wash")) return { icon: "🧺", bgColor: "bg-[#2563eb]" };
  if (n.includes("paint")) return { icon: "🎨", bgColor: "bg-[#f59e0b]" };
  if (n.includes("gas") || n.includes("stove")) return { icon: "🔥", bgColor: "bg-[#ea580c]" };
  if (n.includes("shift") || n.includes("mov")) return { icon: "🚚", bgColor: "bg-[#0d9488]" };
  if (n.includes("pest")) return { icon: "🐜", bgColor: "bg-[#84cc16]" };
  if (n.includes("solar")) return { icon: "☀️", bgColor: "bg-[#eab308]" };
  if (n.includes("car") || n.includes("bike") || n.includes("motorcycle")) return { icon: "🚗", bgColor: "bg-[#6366f1]" };
  if (n.includes("computer") || n.includes("laptop")) return { icon: "💻", bgColor: "bg-[#3b82f6]" };
  if (n.includes("smart") || n.includes("gadget")) return { icon: "📱", bgColor: "bg-[#6366f1]" };
  if (n.includes("beauty") || n.includes("salon") || n.includes("spa")) return { icon: "💇", bgColor: "bg-[#ec4899]" };
  return { icon: "⊞", bgColor: "bg-[#64748b]" };
}

/**
 * Fetch services with optional category, subcategory, search, location, and radius filtering
 */
export async function getServices(params?: {
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  limit?: number;
  page?: number;
}): Promise<{ services: Service[]; total: number }> {
  try {
    const query = new URLSearchParams();
    query.set("status", "active");
    if (params?.categoryId) query.set("categoryId", String(params.categoryId));
    if (params?.subcategoryId) query.set("subcategoryId", String(params.subcategoryId));
    if (params?.search) query.set("search", params.search);
    if (params?.lat != null) query.set("lat", String(params.lat));
    if (params?.lng != null) query.set("lng", String(params.lng));
    if (params?.radiusKm) query.set("radiusKm", String(params.radiusKm));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.page) query.set("page", String(params.page));

    const res = await fetch(`${BACKEND_BASE_URL}/services?${query.toString()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Service[] = json.data.map((srv: any) => ({
          ...srv,
          images:
            Array.isArray(srv.images) && srv.images.length > 0
              ? srv.images
              : [srv.logo || "/hero_technician.jpg"],
        }));

        const total = json.total || json.pagination?.total || mapped.length;
        return { services: mapped, total };
      }
    }
  } catch (err) {
    console.warn("[Wide Service Web] API Services fallback active:", err);
  }

  // Fallback filtering
  let filtered = [...FALLBACK_SERVICES];
  if (params?.categoryId) {
    filtered = filtered.filter((s) => s.categoryId === params.categoryId);
  }
  if (params?.subcategoryId) {
    filtered = filtered.filter((s) => s.subcategoryId === params.subcategoryId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        s.address.toLowerCase().includes(q)
    );
  }

  return { services: filtered, total: filtered.length };
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id: number): Promise<Service | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/services/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const srv = json.data;
        return {
          ...srv,
          images:
            Array.isArray(srv.images) && srv.images.length > 0
              ? srv.images
              : [srv.logo || "/hero_technician.jpg"],
        };
      }
    }
  } catch (err) {
    console.warn("[Wide Service Web] API getServiceById fallback active:", err);
  }
  return FALLBACK_SERVICES.find((s) => s.id === id) || null;
}
