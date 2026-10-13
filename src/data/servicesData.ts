export interface ServiceCategoryMeta {
  id: string;
  name: string;
  slug: string;
  count: string;
  iconBg: string;
  badgeText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  subcategories: string[];
}

export const CATEGORIES_LIST: ServiceCategoryMeta[] = [
  {
    id: "all",
    name: "All Services",
    slug: "all",
    count: "1,800+",
    iconBg: "bg-slate-700",
    subcategories: ["All Subcategories"],
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    slug: "ac-repair",
    count: "212",
    iconBg: "bg-[#0284c7]",
    badgeText: "AC Repair",
    heroTitle: "AC Repair",
    heroSubtitle:
      "Keep your home cool and comfortable with professional AC repair and maintenance services. Get quick, reliable and affordable service from verified technicians near you.",
    heroTagline: "Stay Cool, Stay Comfortable",
    subcategories: [
      "All Subcategories",
      "AC Jet Wash & Servicing",
      "Gas Refill & Leak Fix",
      "AC Installation & Uninstallation",
      "Thermostat & Electrical Repair",
      "Compressor Replacement",
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    slug: "plumbing",
    count: "248",
    iconBg: "bg-[#0891b2]",
    badgeText: "Plumbing",
    heroTitle: "Plumbing Services",
    heroSubtitle:
      "Fast and expert plumbing solutions for pipe leakages, bathroom fittings, water heater installation, and drainage clearing by trusted plumbers.",
    heroTagline: "Fast Leak Fix, Pure Flow",
    subcategories: [
      "All Subcategories",
      "Pipe Leakage & Repair",
      "Sanitary & Bathroom Fitting",
      "Water Motor & Pump Servicing",
      "Water Tank Cleaning",
      "Drainage & Blockage Removal",
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    slug: "electrical",
    count: "242",
    iconBg: "bg-[#eab308]",
    badgeText: "Electrical",
    heroTitle: "Electrical Services",
    heroSubtitle:
      "Safe and certified electrical solutions including short circuit repair, home rewiring, fan/light installation, and circuit breaker servicing.",
    heroTagline: "Safe Wiring, Bright Living",
    subcategories: [
      "All Subcategories",
      "Short Circuit Diagnosis",
      "Full House Wiring",
      "Ceiling Fan & Light Installation",
      "Circuit Breaker & DB Box",
      "IPS & Generator Setup",
    ],
  },
  {
    id: "cleaning",
    name: "Cleaning",
    slug: "cleaning",
    count: "198",
    iconBg: "bg-[#059669]",
    badgeText: "Cleaning",
    heroTitle: "Home & Office Cleaning",
    heroSubtitle:
      "Spotless deep cleaning for homes, corporate offices, sofas, carpets, and water tanks with professional equipment and eco-friendly chemicals.",
    heroTagline: "Deep Clean, Fresh Living",
    subcategories: [
      "All Subcategories",
      "Full Apartment Deep Cleaning",
      "Sofa & Carpet Shampooing",
      "Kitchen & Bathroom Disinfection",
      "Office Space Cleaning",
      "Pest Control Services",
    ],
  },
  {
    id: "carpentry",
    name: "Carpentry",
    slug: "carpentry",
    count: "176",
    iconBg: "bg-[#9333ea]",
    badgeText: "Carpentry",
    heroTitle: "Carpentry & Furniture",
    heroSubtitle:
      "Custom wooden furniture crafting, cabinet installation, door & lock repair, and furniture polishing by skilled master carpenters.",
    heroTagline: "Crafted Solid, Built to Last",
    subcategories: [
      "All Subcategories",
      "Door Lock & Hinge Fitting",
      "Modular Kitchen & Wardrobe",
      "Furniture Assembly & Repair",
      "Varnish & Wood Polish",
    ],
  },
  {
    id: "cctv",
    name: "CCTV",
    slug: "cctv",
    count: "143",
    iconBg: "bg-[#e11d48]",
    badgeText: "CCTV",
    heroTitle: "CCTV & Security",
    heroSubtitle:
      "Protect your residence and business with high-definition IP cameras, DVR/NVR configuration, remote mobile viewing, and routine maintenance.",
    heroTagline: "24/7 Eyes on Your Safety",
    subcategories: [
      "All Subcategories",
      "HD IP Camera Installation",
      "DVR / NVR Setup & Networking",
      "Camera Troubleshooting & Wiring",
      "Smart Video Doorbell",
    ],
  },
  {
    id: "appliances",
    name: "Appliances",
    slug: "appliances",
    count: "167",
    iconBg: "bg-[#2563eb]",
    badgeText: "Appliances",
    heroTitle: "Home Appliance Repair",
    heroSubtitle:
      "Quick repair and genuine spare parts for washing machines, refrigerators, microwave ovens, water purifiers, and kitchen appliances.",
    heroTagline: "Keep Your Home Running Smooth",
    subcategories: [
      "All Subcategories",
      "Washing Machine Repair",
      "Refrigerator & Deep Fridge",
      "Microwave Oven Repair",
      "Water Purifier (RO) Servicing",
    ],
  },
  {
    id: "other",
    name: "Other",
    slug: "other",
    count: "124",
    iconBg: "bg-[#64748b]",
    badgeText: "Other",
    heroTitle: "More Specialized Services",
    heroSubtitle:
      "Painting, welding, home shifting, masonry, and customized local handyman services all over Bangladesh.",
    heroTagline: "Any Job, Done Right",
    subcategories: [
      "All Subcategories",
      "Wall Painting & Renovation",
      "House Shifting & Moving",
      "Welding & Grill Work",
    ],
  },
];

export interface AllServicesCardItem {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  distance: string;
  phone: string;
  whatsapp: string;
  iconBg: string;
}

export const ALL_SERVICES_MOCK_CARDS: AllServicesCardItem[] = [
  {
    id: 1,
    name: "CoolTech Pro Solutions",
    category: "AC Repair & Maintenance",
    categorySlug: "ac-repair",
    image: "/card_ac.jpg",
    rating: 4.9,
    reviews: 186,
    price: "৳ 600 / Unit",
    distance: "1.2 km",
    phone: "01712-345678",
    whatsapp: "8801712345678",
    iconBg: "bg-[#0284c7]",
  },
  {
    id: 2,
    name: "Dhaka Plumbing Service",
    category: "Plumbing & Sanitary",
    categorySlug: "plumbing",
    image: "/card_plumbing.jpg",
    rating: 4.7,
    reviews: 142,
    price: "৳ 400 / Visit",
    distance: "2.4 km",
    phone: "01819-234567",
    whatsapp: "8801819234567",
    iconBg: "bg-[#0891b2]",
  },
  {
    id: 3,
    name: "Bright Electricals",
    category: "Electrical & Wiring",
    categorySlug: "electrical",
    image: "/card_electrical.jpg",
    rating: 4.8,
    reviews: 118,
    price: "৳ 500 / Visit",
    distance: "3.1 km",
    phone: "01911-345678",
    whatsapp: "8801911345678",
    iconBg: "bg-[#eab308]",
  },
  {
    id: 4,
    name: "Clean Home Services",
    category: "Home & Office Cleaning",
    categorySlug: "cleaning",
    image: "/card_cleaning.jpg",
    rating: 4.8,
    reviews: 96,
    price: "৳ 350 / Hour",
    distance: "4.2 km",
    phone: "01612-987654",
    whatsapp: "8801612987654",
    iconBg: "bg-[#059669]",
  },
  {
    id: 5,
    name: "WoodCraft Solutions",
    category: "Carpentry & Furniture",
    categorySlug: "carpentry",
    image: "/card_carpentry.jpg",
    rating: 4.6,
    reviews: 87,
    price: "৳ 700 / Visit",
    distance: "5.6 km",
    phone: "01733-445566",
    whatsapp: "8801733445566",
    iconBg: "bg-[#9333ea]",
  },
  {
    id: 6,
    name: "SecureTech CCTV",
    category: "CCTV Installation",
    categorySlug: "cctv",
    image: "/card_cctv.jpg",
    rating: 4.5,
    reviews: 73,
    price: "৳ 800 / Unit",
    distance: "6.8 km",
    phone: "01552-334455",
    whatsapp: "8801552334455",
    iconBg: "bg-[#e11d48]",
  },
  {
    id: 7,
    name: "Home Appliance Care",
    category: "Appliances Repair",
    categorySlug: "appliances",
    image: "/card_appliance.jpg",
    rating: 4.4,
    reviews: 66,
    price: "৳ 500 / Visit",
    distance: "7.1 km",
    phone: "01722-112233",
    whatsapp: "8801722112233",
    iconBg: "bg-[#2563eb]",
  },
  {
    id: 8,
    name: "FixIt All Services",
    category: "General Home Services",
    categorySlug: "other",
    image: "/hero_technician.jpg",
    rating: 4.3,
    reviews: 54,
    price: "৳ 400 / Visit",
    distance: "8.3 km",
    phone: "01844-556677",
    whatsapp: "8801844556677",
    iconBg: "bg-[#d49b1a]",
  },
  {
    id: 9,
    name: "Color World Paints",
    category: "Painting & Decoration",
    categorySlug: "other",
    image: "/card_painting.jpg",
    rating: 4.2,
    reviews: 48,
    price: "৳ 600 / Visit",
    distance: "9.6 km",
    phone: "01999-887766",
    whatsapp: "8801999887766",
    iconBg: "bg-[#0ea5e9]",
  },
];

export interface CategoryDetailCardItem {
  id: number;
  title: string;
  provider: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  distance: string;
  tags: string[];
  phone: string;
  whatsapp: string;
}

export const AC_REPAIR_MOCK_CARDS: CategoryDetailCardItem[] = [
  {
    id: 101,
    title: "Master AC Jet Wash & Complete Maintenance",
    provider: "CoolTech Pro Solutions",
    categorySlug: "ac-repair",
    image: "/card_ac.jpg",
    rating: 4.9,
    reviews: 186,
    price: "৳ 600 / Unit",
    distance: "1.2 km",
    tags: ["AC Cleaning", "Gas Refill", "Maintenance"],
    phone: "01712-345678",
    whatsapp: "8801712345678",
  },
  {
    id: 102,
    title: "AC Repair & Gas Refill Service",
    provider: "Dhaka Cooling Service",
    categorySlug: "ac-repair",
    image: "/ac_service_tech.jpg",
    rating: 4.7,
    reviews: 142,
    price: "৳ 900 / Visit",
    distance: "2.4 km",
    tags: ["Repair", "Gas Refill", "Checkup"],
    phone: "01819-234567",
    whatsapp: "8801819234567",
  },
  {
    id: 103,
    title: "Inverter AC Installation & Service",
    provider: "Smart Cool BD",
    categorySlug: "ac-repair",
    image: "/card_ac.jpg",
    rating: 4.8,
    reviews: 118,
    price: "৳ 800 / Unit",
    distance: "3.1 km",
    tags: ["Installation", "Service", "Maintenance"],
    phone: "01911-345678",
    whatsapp: "8801911345678",
  },
  {
    id: 104,
    title: "Window AC Repair Service",
    provider: "AC Fix Zone",
    categorySlug: "ac-repair",
    image: "/ac_service_tech.jpg",
    rating: 4.6,
    reviews: 98,
    price: "৳ 450 / Visit",
    distance: "4.8 km",
    tags: ["Repair", "Cleaning", "Gas Refill"],
    phone: "01612-987654",
    whatsapp: "8801612987654",
  },
  {
    id: 105,
    title: "Split AC Maintenance Package",
    provider: "Cool Master Service",
    categorySlug: "ac-repair",
    image: "/card_ac.jpg",
    rating: 4.5,
    reviews: 73,
    price: "৳ 700 / Unit",
    distance: "5.6 km",
    tags: ["Cleaning", "Service", "Inspection"],
    phone: "01733-445566",
    whatsapp: "8801733445566",
  },
  {
    id: 106,
    title: "AC Thermostat & Wiring Repair",
    provider: "Electro Care",
    categorySlug: "ac-repair",
    image: "/card_electrical.jpg",
    rating: 4.3,
    reviews: 54,
    price: "৳ 600 / Visit",
    distance: "6.9 km",
    tags: ["Wiring", "Thermostat", "Repair"],
    phone: "01552-334455",
    whatsapp: "8801552334455",
  },
];
