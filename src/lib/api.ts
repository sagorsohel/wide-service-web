import { Category, Subcategory, Service, UserLocation } from "../types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  { id: 1, name: "AC Repair & Servicing", image: "https://img.icons8.com/fluency/96/air-conditioner.png" },
  { id: 2, name: "Plumbing Services", image: "https://img.icons8.com/fluency/96/plumbing.png" },
  { id: 3, name: "Electrical Wiring & Repair", image: "https://img.icons8.com/fluency/96/electrical.png" },
  { id: 4, name: "Home Deep Cleaning", image: "https://img.icons8.com/fluency/96/cleaning-service.png" },
  { id: 5, name: "Handcraft & Carpentry", image: "https://img.icons8.com/fluency/96/saw.png" },
  { id: 6, name: "Shifting & House Moving", image: "https://img.icons8.com/fluency/96/van.png" },
  { id: 7, name: "CCTV & Home Security", image: "https://img.icons8.com/fluency/96/webcam.png" },
  { id: 8, name: "Computer & Laptop Repair", image: "https://img.icons8.com/fluency/96/laptop.png" },
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
        const mapped: Service[] = json.data.map((srv: any, idx: number) => ({
          ...srv,
          images: Array.isArray(srv.images) && srv.images.length > 0 ? srv.images : [srv.logo || "/hero_technician.jpg"],
          price: srv.price || (idx % 2 === 0 ? "৳ 600 / Visit" : "৳ 450 / Visit"),
          rating: srv.rating || 4.8 + ((idx % 3) * 0.1),
          reviewCount: srv.reviewCount || 120 + ((idx * 23) % 150),
          experience: srv.experience || `${5 + (idx % 8)}-year Experience`,
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
          price: srv.price || "৳ 550 / Visit",
          rating: srv.rating || 4.9,
          reviewCount: srv.reviewCount || 140,
          experience: srv.experience || "8-year Experience",
        };
      }
    }
  } catch (err) {
    console.warn("[Wide Service Web] API getServiceById fallback active:", err);
  }
  return FALLBACK_SERVICES.find((s) => s.id === id) || null;
}
