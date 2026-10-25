"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Category, Subcategory, Service, UserLocation } from "../types";
import {
  getCategories,
  getSubcategories,
  getServices,
  sortServicesByDistance,
  formatDistance,
  calculateHaversineDistanceKm,
  loginUser,
  registerUser,
  googleLoginUser,
  getPublicNotifications,
  AppNotification,
} from "../lib/api";
import { ServiceCard } from "./ServiceCard";
import { ServiceMapEmbed } from "./ServiceMapEmbed";
import { loginWithGoogle, subscribeToAuth } from "../lib/firebase";
import {
  Bell,
  Search,
  LayoutGrid,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
  PhoneCall,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Compass,
  RotateCcw,
  SearchX,
  Sparkles,
  X,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Info,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Star,
  Camera,
  Send,
  Trash2,
  Moon,
  Sun,
  Edit3,
  BarChart3,
  Globe,
  User,
} from "lucide-react";

export interface UserProfile {
  id?: number | string;
  name?: string;
  displayName?: string | null;
  phone?: string;
  phoneNumber?: string | null;
  email?: string | null;
  role?: string;
  token?: string;
  firebaseToken?: string | null;
  photoURL?: string | null;
  createdAt?: string;
}

export interface ReviewItem {
  id: string;
  serviceId: string | number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface UserStats {
  servicesViewed: number;
  detailsViewed: number;
  callsClicked: number;
}

interface MobileAppExperienceProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
}

const RADIUS_OPTIONS = [
  { label: "All Distance", value: null },
  { label: "Within 1 km", value: 1 },
  { label: "Within 2 km", value: 2 },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
];

/**
 * Coded Vector Illustration of Team Collaborating for Login Hero
 * Exact match from app/src/components/ProfileScreen.tsx
 */
const TeamIllustrationSvg: React.FC<{
  width?: number | string;
  height?: number;
}> = ({ width = "100%", height = 175 }) => (
  <svg width={width} height={height} viewBox="0 0 380 185" fill="none">
    {/* Ambient Radar Glows */}
    <circle cx="190" cy="105" r="80" fill="rgba(255, 255, 255, 0.16)" />
    <circle
      cx="190"
      cy="105"
      r="120"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.5"
      strokeDasharray="4 4"
    />

    {/* Background Plant Leaves (Left & Right) */}
    <path
      d="M 35 150 C 30 110, 45 90, 60 80 C 65 95, 60 120, 50 150 Z"
      fill="rgba(15, 23, 42, 0.14)"
    />
    <path
      d="M 50 150 C 55 120, 75 105, 90 100 C 90 115, 80 135, 65 150 Z"
      fill="rgba(15, 23, 42, 0.09)"
    />
    <path
      d="M 345 150 C 350 110, 335 90, 320 80 C 315 95, 320 120, 330 150 Z"
      fill="rgba(15, 23, 42, 0.14)"
    />
    <path
      d="M 330 150 C 325 120, 305 105, 290 100 C 290 115, 300 135, 315 150 Z"
      fill="rgba(15, 23, 42, 0.09)"
    />

    {/* Desk Surface & Legs */}
    <rect x="60" y="145" width="260" height="7" rx="3.5" fill="#0f172a" />
    <path
      d="M 80 152 L 72 185 M 300 152 L 308 185"
      stroke="#0f172a"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Coffee Cup on desk */}
    <rect x="100" y="137" width="9" height="8" rx="2" fill="#ffffff" />
    <path
      d="M 109 139 C 111 139 112 141 112 142 C 112 143 111 144 109 144"
      stroke="#ffffff"
      strokeWidth="1.2"
      fill="none"
    />

    {/* Small Succulent Pot on desk */}
    <polygon points="268,145 272,136 282,136 286,145" fill="#0f172a" />
    <path
      d="M 277 136 C 273 129 275 123 279 122 C 280 127 278 133 277 136 Z"
      fill="#22c55e"
    />
    <path
      d="M 277 136 C 281 129 284 125 288 126 C 287 131 282 134 277 136 Z"
      fill="#16a34a"
    />

    {/* LEFT CHARACTER: Technician / Field Specialist */}
    <g>
      <path
        d="M 112 145 L 116 98 C 118 94, 142 94, 144 98 L 148 145 Z"
        fill="#0284c7"
      />
      <rect x="127" y="90" width="6" height="8" fill="#fcd34d" />
      <circle cx="130" cy="78" r="13" fill="#fcd34d" />
      <path
        d="M 118 76 C 118 64, 142 64, 142 76 C 142 80, 138 78, 130 78 C 122 78, 118 80, 118 76 Z"
        fill="#0f172a"
      />
      <path
        d="M 140 108 L 165 128 L 175 128"
        stroke="#fcd34d"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* RIGHT CHARACTER: Supervisor / Engineer */}
    <g>
      <path
        d="M 232 145 L 236 98 C 238 94, 262 94, 264 98 L 268 145 Z"
        fill="#0f172a"
      />
      <rect x="247" y="90" width="6" height="8" fill="#fed7aa" />
      <circle cx="250" cy="78" r="13" fill="#fed7aa" />
      <path
        d="M 238 75 C 238 65, 262 65, 262 75 C 262 82, 256 79, 250 79 C 244 79, 238 82, 238 75 Z"
        fill="#b45309"
      />
      <path
        d="M 240 108 L 215 128 L 205 128"
        stroke="#fed7aa"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* CENTER LAPTOP (Wide Service Workstation) */}
    <g>
      <rect
        x="170"
        y="112"
        width="40"
        height="28"
        rx="2"
        fill="#0f172a"
        stroke="#38bdf8"
        strokeWidth="1.2"
      />
      <rect x="174" y="116" width="32" height="20" rx="1" fill="#0284c7" />
      <circle cx="190" cy="126" r="3" fill="#e0b328" />
      <polygon points="163,145 217,145 213,140 167,140" fill="#94a3b8" />
    </g>

    {/* Ambient Cloud Particles & Service Signals */}
    <g opacity="0.6">
      <circle cx="190" cy="46" r="6" fill="#0f172a" />
      <circle cx="190" cy="55" r="3.5" fill="#0f172a" />
      <circle cx="190" cy="62" r="2" fill="#0f172a" />
    </g>
  </svg>
);

export const MobileAppExperience: React.FC<MobileAppExperienceProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
}) => {
  // Navigation Screens matching app/App.tsx:
  // - null: HomeScreen / Tab root
  // - selectedCategory && !selectedSubcategory: CategoryDetailScreen
  // - selectedCategory && selectedSubcategory: SubcategoryDetailScreen
  // - selectedService: ServiceDetailScreen
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Exact 5 Tabs matching app/App.tsx:
  // 1. "home" (LayoutGrid)
  // 2. "favorites" (Heart)
  // 3. "find" (Search)
  // 4. "setting" (Settings)
  // 5. "profile" (User)
  const [activeTab, setActiveTab] = useState<
    "home" | "favorites" | "find" | "setting" | "profile"
  >("home");

  // Favorites Tab Segment ("recent" | "favorites")
  const [favoritesSegment, setFavoritesSegment] = useState<"recent" | "favorites">("recent");

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [signupAvatar, setSignupAvatar] = useState<string | null>(null);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);

  // Activity Stats Modal State
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // About & Privacy Modals
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // User Dynamic Stats
  const [userStats, setUserStats] = useState<UserStats>({
    servicesViewed: 0,
    detailsViewed: 0,
    callsClicked: 0,
  });

  // Saved Favorites & Recent Services Storage
  const [favoritesList, setFavoritesList] = useState<Service[]>([]);
  const [recentServicesList, setRecentServicesList] = useState<Service[]>([]);

  // Notification Center Modal & State
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // App Theme & Preferences
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pushNotifsEnabled, setPushNotifsEnabled] = useState(true);

  // Synchronize Dark / Light Mode with Document Element & LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode);
      try {
        localStorage.setItem("wide_theme_mode", isDarkMode ? "dark" : "light");
      } catch {}
    }
  }, [isDarkMode]);

  // Categories & Services State
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);

  // Service Detail Image Carousel
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Service Reviews & Ratings
  const [reviewsMap, setReviewsMap] = useState<Record<string, ReviewItem[]>>({});
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Restore session, favorites, recent services, stats and reviews on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("wide_service_auth_user");
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        if (!parsed.photoURL && (parsed.displayName || parsed.name || parsed.email)) {
          parsed.photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            parsed.displayName || parsed.name || parsed.email || "User",
          )}`;
        }
        setCurrentUser(parsed);
      }

      const savedFavs = localStorage.getItem("wide_favorite_services");
      if (savedFavs) {
        setFavoritesList(JSON.parse(savedFavs));
      }

      const savedRecent = localStorage.getItem("wide_recent_services");
      if (savedRecent) {
        setRecentServicesList(JSON.parse(savedRecent));
      }

      const savedStats = localStorage.getItem("wide_user_stats");
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }

      const savedReviews = localStorage.getItem("wide_service_reviews_v1");
      if (savedReviews) {
        setReviewsMap(JSON.parse(savedReviews));
      }

      const savedTheme = localStorage.getItem("wide_theme_mode");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch {}

    const unsubscribeAuth = subscribeToAuth((fbProfile) => {
      if (fbProfile?.photoURL) {
        setCurrentUser((prev) => {
          if (!prev) return prev;
          if (prev.photoURL === fbProfile.photoURL) return prev;
          const updated: UserProfile = {
            ...prev,
            photoURL: fbProfile.photoURL,
            displayName: fbProfile.displayName || prev.displayName,
          };
          try {
            localStorage.setItem("wide_service_auth_user", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Fetch Public Notifications and calculate unread count
  useEffect(() => {
    let isMounted = true;
    async function loadNotifs() {
      setLoadingNotifs(true);
      try {
        const list = await getPublicNotifications();
        if (!isMounted) return;
        setNotifications(list);

        const lastSeenId = Number(localStorage.getItem("last_seen_notification_id")) || 0;
        const unread = list.filter((n) => Number(n.id) > lastSeenId).length;
        setUnreadNotifCount(unread);
      } catch (e) {
        // silent
      } finally {
        if (isMounted) setLoadingNotifs(false);
      }
    }
    loadNotifs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenNotificationsModal = () => {
    setNotifModalOpen(true);
    setUnreadNotifCount(0);
    try {
      const maxId = notifications.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0);
      if (maxId > 0) {
        localStorage.setItem("last_seen_notification_id", String(maxId));
      }
    } catch {}
  };

  const handleCloseNotificationsModal = () => {
    setNotifModalOpen(false);
  };

  // Load initial categories & nearby services
  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      try {
        const [cats, srvRes] = await Promise.all([
          getCategories(),
          getServices({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
            limit: 100,
          }),
        ]);
        if (isMounted) {
          setCategories(cats);
          setServices(srvRes.services);
        }
      } catch (e) {
        console.warn("Mobile app init error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [userLocation.latitude, userLocation.longitude]);

  // Load subcategories whenever selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    let isMounted = true;
    setCategoryLoading(true);
    getSubcategories(selectedCategory.id)
      .then((subs) => {
        if (isMounted) {
          setSubcategories(subs);
          setCategoryLoading(false);
        }
      })
      .catch((e) => {
        console.warn("Subcategory load error:", e);
        if (isMounted) setCategoryLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory?.id]);

  // Record service view in recent history and increment stats
  const handleSelectService = (srv: Service) => {
    setSelectedService(srv);
    setActiveImageIndex(0);

    // 1. Add to recent services
    setRecentServicesList((prev) => {
      const filtered = prev.filter((item) => String(item.id) !== String(srv.id));
      const updated = [srv, ...filtered].slice(0, 30);
      try {
        localStorage.setItem("wide_recent_services", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Increment stats
    setUserStats((prev) => {
      const updated = {
        ...prev,
        detailsViewed: prev.detailsViewed + 1,
        servicesViewed: prev.servicesViewed + 1,
      };
      try {
        localStorage.setItem("wide_user_stats", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle Favorite Service
  const handleToggleFavorite = (srv: Service, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoritesList((prev) => {
      const exists = prev.some((item) => String(item.id) === String(srv.id));
      const updated = exists
        ? prev.filter((item) => String(item.id) !== String(srv.id))
        : [srv, ...prev];
      try {
        localStorage.setItem("wide_favorite_services", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isServiceFavorited = (srvId: string | number) => {
    return favoritesList.some((item) => String(item.id) === String(srvId));
  };

  // Clear Recent Services History
  const handleClearRecent = () => {
    if (window.confirm("আপনি কি সম্প্রতি দেখা সব সার্ভিসের হিস্ট্রি মুছে ফেলতে চান?")) {
      setRecentServicesList([]);
      try {
        localStorage.removeItem("wide_recent_services");
      } catch {}
    }
  };

  // Track Call Clicked
  const handleCall = (phone?: string) => {
    setUserStats((prev) => {
      const updated = { ...prev, callsClicked: prev.callsClicked + 1 };
      try {
        localStorage.setItem("wide_user_stats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (phone) {
      const clean = phone.replace(/[^0-9+]/g, "");
      window.location.href = `tel:${clean}`;
    }
  };

  const handleWhatsApp = (whatsapp?: string, name?: string) => {
    setUserStats((prev) => {
      const updated = { ...prev, callsClicked: prev.callsClicked + 1 };
      try {
        localStorage.setItem("wide_user_stats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    const num = (whatsapp || "").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello! I found your service "${name || "Wide Service"}" on the Wide Service App. I need assistance.`,
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const handleShare = (srv: Service) => {
    if (navigator.share) {
      navigator.share({
        title: srv.name,
        text: `Check out ${srv.name} on Wide Service:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Navigation Handlers for Bottom Bar (Matches app/App.tsx)
  const handleGoHome = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoFavorites = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("favorites");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoFind = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("find");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoSettings = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("setting");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoProfile = () => {
    setSelectedService(null);
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    setActiveTab("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hardware Back Button Simulation
  const handleBackNavigation = () => {
    if (selectedService) {
      setSelectedService(null);
      return;
    }
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
      return;
    }
    if (selectedCategory) {
      setSelectedCategory(null);
      return;
    }
    if (activeTab !== "home") {
      setActiveTab("home");
      return;
    }
  };

  // Handle User Login / Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMode === "login") {
      if (!authEmail.trim() || !authPassword.trim()) {
        setAuthError("Please enter your phone/email and password.");
        return;
      }

      setAuthLoading(true);
      try {
        const res = await loginUser(authEmail.trim(), authPassword.trim());
        if (!res.success || !res.data) {
          setAuthError(res.message || "Invalid phone number/email or password.");
          return;
        }

        const userObj: UserProfile = {
          id: res.data.id,
          name: res.data.name,
          displayName: res.data.name,
          phone: res.data.phone,
          phoneNumber: res.data.phone,
          email: res.data.email,
          role: res.data.role,
          token: res.data.token,
          firebaseToken: res.data.firebaseToken,
          photoURL:
            res.data.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              res.data.name || "User",
            )}`,
          createdAt: new Date().toLocaleDateString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem("wide_service_auth_user", JSON.stringify(userObj));
          if (res.data.token) {
            localStorage.setItem("user_session_token", res.data.token);
          }
        } catch {}

        setAuthSuccess("Successfully logged in!");
        setAuthPassword("");
      } catch (err: any) {
        setAuthError(err?.message || "Failed to log in.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Signup Mode
      if (!authName.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (!authPhone.trim()) {
        setAuthError("Please enter your phone number.");
        return;
      }
      if (!authPassword.trim() || authPassword.length < 6) {
        setAuthError("Password should be at least 6 characters.");
        return;
      }

      setAuthLoading(true);
      try {
        const res = await registerUser(
          authName.trim(),
          authPhone.trim(),
          authPassword.trim(),
          authEmail.trim() || undefined,
        );

        if (!res.success || !res.data) {
          setAuthError(res.message || "Failed to create account.");
          return;
        }

        const userObj: UserProfile = {
          id: res.data.id,
          name: res.data.name,
          displayName: res.data.name,
          phone: res.data.phone,
          phoneNumber: res.data.phone,
          email: res.data.email,
          role: res.data.role,
          token: res.data.token,
          firebaseToken: res.data.firebaseToken,
          photoURL:
            signupAvatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              authName.trim(),
            )}`,
          createdAt: new Date().toLocaleDateString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem("wide_service_auth_user", JSON.stringify(userObj));
          if (res.data.token) {
            localStorage.setItem("user_session_token", res.data.token);
          }
        } catch {}

        setAuthSuccess("Account created successfully!");
        setAuthPassword("");
      } catch (err: any) {
        setAuthError(err?.message || "Failed to create account.");
      } finally {
        setAuthLoading(false);
      }
    }
  };

  // Google Sign-In Handler (Bulletproof with backend API sync)
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const fbUser = await loginWithGoogle();
      if (!fbUser || !fbUser.email) {
        setAuthLoading(false);
        return;
      }

      // Sync with backend API
      const backendRes = await googleLoginUser({
        idToken: fbUser.idToken,
        email: fbUser.email,
        name: fbUser.displayName || undefined,
        photoURL: fbUser.photoURL || undefined,
      });

      const avatarUrl =
        fbUser.photoURL ||
        backendRes.data?.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          fbUser.displayName || fbUser.email || "User",
        )}`;

      const userObj: UserProfile = {
        id: backendRes.data?.id || fbUser.uid,
        name: backendRes.data?.name || fbUser.displayName || "Google User",
        displayName:
          fbUser.displayName || backendRes.data?.name || "Google User",
        phone: backendRes.data?.phone || fbUser.phoneNumber || undefined,
        phoneNumber: backendRes.data?.phone || fbUser.phoneNumber || undefined,
        email: fbUser.email,
        role: backendRes.data?.role || "Verified Customer",
        token: backendRes.data?.token,
        firebaseToken: backendRes.data?.firebaseToken,
        photoURL: avatarUrl,
        createdAt: fbUser.createdAt || new Date().toLocaleDateString(),
      };

      setCurrentUser(userObj);
      try {
        localStorage.setItem("wide_service_auth_user", JSON.stringify(userObj));
        if (backendRes.data?.token) {
          localStorage.setItem("user_session_token", backendRes.data.token);
        }
      } catch {}
      setAuthSuccess("Signed in with Google successfully!");
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("popup-closed-by-user") ||
        err?.message?.includes("cancelled-popup-request")
      ) {
        // User closed the popup, do not show error banner
        setAuthLoading(false);
        return;
      }
      setAuthError(err?.message || "Google Sign-In failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of your account?")) {
      setCurrentUser(null);
      try {
        localStorage.removeItem("wide_service_auth_user");
        localStorage.removeItem("user_session_token");
      } catch {}
      setAuthSuccess(null);
      setAuthError(null);
    }
  };

  // Save Profile Changes
  const handleOpenEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.displayName || currentUser.name || "");
    setEditPhone(currentUser.phone || currentUser.phoneNumber || "");
    setEditEmail(currentUser.email || "");
    setEditAvatar(currentUser.photoURL || null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("Please enter your name.");
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim(),
      displayName: editName.trim(),
      phone: editPhone.trim() || undefined,
      phoneNumber: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
      photoURL: editAvatar || currentUser?.photoURL,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem("wide_service_auth_user", JSON.stringify(updated));
    } catch {}
    setIsEditModalOpen(false);
  };

  // Filter Categories on Home Screen
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  // Filter Services for CategoryDetailScreen
  const categoryServices = useMemo(() => {
    if (!selectedCategory) return [];
    let list = services.filter((s) => s.categoryId === selectedCategory.id);
    if (selectedSubcategory) {
      list = list.filter((s) => s.subcategoryId === selectedSubcategory.id);
    }
    const sorted = sortServicesByDistance(list, userLocation);
    if (selectedRadius === null) return sorted;
    return sorted.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
  }, [selectedCategory, selectedSubcategory, services, userLocation, selectedRadius]);

  // Filter Services for FindScreen
  const findServices = useMemo(() => {
    let list = [...services];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.businessName && s.businessName.toLowerCase().includes(q)) ||
          (s.categoryName && s.categoryName.toLowerCase().includes(q)) ||
          (s.subcategoryName && s.subcategoryName.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q)),
      );
    }
    const sorted = sortServicesByDistance(list, userLocation);
    if (selectedRadius === null) return sorted;
    return sorted.filter((s) => (s.distanceKm ?? 999) <= selectedRadius);
  }, [services, searchQuery, selectedRadius, userLocation]);

  // Reviews for Selected Service
  const currentReviews = useMemo(() => {
    if (!selectedService) return [];
    const idKey = String(selectedService.id);
    return reviewsMap[idKey] || [];
  }, [selectedService, reviewsMap]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    const newRev: ReviewItem = {
      id: "rev_" + Date.now(),
      serviceId: selectedService.id,
      userName: currentUser?.displayName || currentUser?.name || "Verified Customer",
      userAvatar: currentUser?.photoURL || undefined,
      rating: newRating,
      comment: newComment.trim(),
      date: "Just now",
      verified: true,
    };

    const idKey = String(selectedService.id);
    const updatedReviews = [newRev, ...(reviewsMap[idKey] || [])];
    const newMap = { ...reviewsMap, [idKey]: updatedReviews };

    setReviewsMap(newMap);
    try {
      localStorage.setItem("wide_service_reviews_v1", JSON.stringify(newMap));
    } catch {}

    setNewComment("");
    setReviewSubmitting(false);
    setReviewSuccessMsg("Thank you! Your review has been published.");
    setTimeout(() => setReviewSuccessMsg(null), 4000);
  };

  // Service Distance calculation
  const serviceDistanceKm = useMemo(() => {
    if (!selectedService) return null;
    if (selectedService.distanceKm !== undefined && selectedService.distanceKm !== null) {
      return selectedService.distanceKm;
    }
    if (selectedService.latitude != null && selectedService.longitude != null) {
      return calculateHaversineDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        selectedService.latitude,
        selectedService.longitude,
      );
    }
    return null;
  }, [selectedService, userLocation]);

  // Gallery Images for Selected Service
  const galleryImages = useMemo(() => {
    if (!selectedService) return [];
    if (Array.isArray(selectedService.images) && selectedService.images.length > 0) {
      return selectedService.images;
    }
    if (selectedService.logo) {
      return [selectedService.logo];
    }
    return ["https://img.icons8.com/fluency/96/maintenance.png"];
  }, [selectedService]);

  return (
    <div
      className={`w-full min-h-screen flex flex-col font-sans select-none relative transition-colors ${
        isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* =========================================================================
          VIEW 1: SERVICE DETAIL SCREEN (MATCHING app/ServiceDetailScreen)
          ========================================================================= */}
      {selectedService ? (
        <div className="w-full min-h-screen flex flex-col pb-28">
          {/* Top Header - Fixed/Sticky with Light Background (No Yellow) matching mobile app */}
          <div
            className={`px-4 pt-3 pb-3 sticky top-0 z-40 shadow-xs flex items-center justify-between border-b ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>

            <div className="flex-1 px-3 text-center truncate">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {selectedService.name}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => handleToggleFavorite(selectedService, e)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isServiceFavorited(selectedService.id)
                    ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                title="Favorite"
              >
                <Heart
                  className={`w-4 h-4 stroke-[2.4] ${
                    isServiceFavorited(selectedService.id)
                      ? "fill-red-600 text-red-600"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                />
              </button>
              <button
                onClick={() => handleShare(selectedService)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4 stroke-[2.4]" />
              </button>
              <button
                onClick={() => handleCall(selectedService.phone)}
                className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
                title="Call"
              >
                <Phone className="w-4 h-4 stroke-[2.4]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
            {/* 1. Image Gallery Showcase */}
            <div className="relative w-full aspect-16/10 bg-slate-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[activeImageIndex]}
                alt={selectedService.name}
                className="w-full h-full object-cover transition-all"
              />
              {galleryImages.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                    <button
                      onClick={() =>
                        setActiveImageIndex(
                          (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
                        )
                      }
                      className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
                      }
                      className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                    {galleryImages.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeImageIndex ? "w-5 bg-[#e0b328]" : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 2. Primary Service Details */}
            <div className={`p-4 sm:p-5 border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              {/* Distance Pill */}
              {serviceDistanceKm !== null && (
                <div className="mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-black inline-flex items-center gap-1">
                    <span>⚡</span>
                    <span>{formatDistance(serviceDistanceKm)}</span>
                  </span>
                </div>
              )}

              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-snug mb-3">
                {selectedService.name}
              </h1>

              {/* Verified Provider Badge */}
              <div
                className={`flex items-center gap-2 p-3 rounded-2xl border mb-4 ${
                  isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 stroke-[2.4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black truncate">
                      {selectedService.businessName || "Verified Service Partner"}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified Local Technician
                  </span>
                </div>
              </div>

              {/* 1-Tap Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleCall(selectedService.phone)}
                  className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 stroke-[2.4]" />
                  <span>Call Now</span>
                </button>
                <button
                  onClick={() =>
                    handleWhatsApp(
                      selectedService.whatsapp || selectedService.phone,
                      selectedService.name,
                    )
                  }
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 stroke-[2.4]" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* 3. About Service / Description */}
            {selectedService.description && (
              <div className={`p-4 sm:p-5 border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  About This Service
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                  {selectedService.description}
                </p>
              </div>
            )}

            {/* 4. Location & Availability */}
            <div className={`p-4 sm:p-5 border-b space-y-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Location & Availability
              </h3>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black">{selectedService.address}</div>
                  <div className="text-[11px] text-slate-400">
                    Coordinates: {selectedService.latitude || "23.8103"},{" "}
                    {selectedService.longitude || "90.4125"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black">
                    {selectedService.schedule || "Open Daily (8:00 AM - 10:00 PM)"}
                  </div>
                  <div className="text-[11px] text-slate-400">Emergency support available</div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ServiceMapEmbed
                  serviceLat={selectedService.latitude || 23.8103}
                  serviceLng={selectedService.longitude || 90.4125}
                  serviceName={selectedService.name}
                  userLat={userLocation?.latitude}
                  userLng={userLocation?.longitude}
                  height={220}
                />
              </div>
            </div>

            {/* 5. Customer Reviews & Ratings */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Ratings & Reviews
                </h3>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-amber-500 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>
                    {(
                      (currentReviews.reduce((sum, r) => sum + r.rating, 0) + 4.9 * 3) /
                      (currentReviews.length + 3)
                    ).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating ?? newRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your experience with this service provider..."
                    rows={3}
                    className={`w-full p-3 rounded-2xl border text-xs outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !newComment.trim()}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#e0b328] hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
                {reviewSuccessMsg && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{reviewSuccessMsg}</span>
                  </p>
                )}
              </form>

              {/* Existing Reviews */}
              <div className="space-y-3 pt-2">
                {currentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-2xl border ${
                      isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#e0b328] text-slate-950 text-xs font-black flex items-center justify-center">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-black">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">{rev.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : selectedSubcategory && selectedCategory ? (
        /* =========================================================================
            VIEW 2: SUBCATEGORY DETAIL SCREEN
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          <div
            className={`px-4 pt-3 pb-3 sticky top-0 z-40 shadow-xs flex items-center justify-between border-b ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}
          >
            <button
              onClick={() => setSelectedSubcategory(null)}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>
            <div className="flex-1 px-3 text-center truncate">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {selectedSubcategory.name}
              </h2>
            </div>
            <div className="w-10" />
          </div>

          <div className="p-4 space-y-3">
            {categoryServices.length === 0 ? (
              <div className="py-16 text-center">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No services found in this category.</p>
              </div>
            ) : (
              categoryServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  userLocation={userLocation}
                  onSelect={() => handleSelectService(srv)}
                />
              ))
            )}
          </div>
        </div>
      ) : selectedCategory ? (
        /* =========================================================================
            VIEW 3: CATEGORY DETAIL SCREEN
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          <div
            className={`px-4 pt-3 pb-3 sticky top-0 z-40 shadow-xs flex items-center justify-between border-b ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}
          >
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.6]" />
            </button>
            <div className="flex-1 px-3 text-center truncate">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {selectedCategory.name}
              </h2>
            </div>
            <div className="w-10" />
          </div>

          {/* Subcategories Horizontal Scroll Chips */}
          {subcategories.length > 0 && (
            <div className={`px-4 py-3 border-b flex gap-2 overflow-x-auto no-scrollbar ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            }`}>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                  selectedSubcategory === null
                    ? "bg-[#e0b328] text-slate-950 shadow-xs"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                    selectedSubcategory?.id === sub.id
                      ? "bg-[#e0b328] text-slate-950 shadow-xs"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Distance Chips */}
          <div className="px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedRadius(opt.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedRadius === opt.value
                    ? "bg-[#e0b328] text-slate-950"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="p-4 space-y-3">
            {categoryLoading ? (
              <div className="py-16 text-center text-xs font-bold text-slate-400">Loading services...</div>
            ) : categoryServices.length === 0 ? (
              <div className="py-16 text-center">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No services found in this category.</p>
              </div>
            ) : (
              categoryServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  userLocation={userLocation}
                  onSelect={() => handleSelectService(srv)}
                />
              ))
            )}
          </div>
        </div>
      ) : activeTab === "favorites" ? (
        /* =========================================================================
            VIEW 4: FAVORITES & RECENT SERVICES SCREEN (EXACT MATCH TO app/FavoritesScreen)
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          {/* Top Header Bar */}
          <div
            className={`px-5 pt-4 pb-3 sticky top-0 z-30 shadow-2xs border-b flex items-center justify-between ${
              isDarkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#e0b328]" />
                <h1 className="text-xl font-black tracking-tight">Saved & History</h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                আপনার প্রিয় এবং সম্প্রতি দেখা সার্ভিসগুলো
              </p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Segmented Switcher Pill */}
            <div
              className={`p-1 rounded-2xl border flex items-center ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200/80"
              }`}
            >
              <button
                onClick={() => setFavoritesSegment("recent")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  favoritesSegment === "recent"
                    ? "bg-[#e0b328] text-slate-950 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Recently Viewed</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    favoritesSegment === "recent"
                      ? "bg-black/15 text-slate-950"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {recentServicesList.length}
                </span>
              </button>
              <button
                onClick={() => setFavoritesSegment("favorites")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  favoritesSegment === "favorites"
                    ? "bg-[#e0b328] text-slate-950 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Saved Services</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    favoritesSegment === "favorites"
                      ? "bg-black/15 text-slate-950"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {favoritesList.length}
                </span>
              </button>
            </div>

            {/* Sub-view: Recently Viewed */}
            {favoritesSegment === "recent" ? (
              <div className="space-y-3">
                {recentServicesList.length > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Recently Viewed Services
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                )}

                {recentServicesList.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black mb-1">হিস্ট্রি খালি</h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-4">
                      আপনি সম্প্রতি কোনো সার্ভিস দেখেননি। প্রয়োজনীয় সেবা খুঁজতে এক্সপ্লোর করুন।
                    </p>
                    <button
                      onClick={handleGoFind}
                      className="px-5 py-2.5 rounded-full bg-[#e0b328] text-slate-950 font-black text-xs hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
                    >
                      Find Services
                    </button>
                  </div>
                ) : (
                  recentServicesList.map((srv) => (
                    <ServiceCard
                      key={srv.id}
                      service={srv}
                      userLocation={userLocation}
                      onSelect={() => handleSelectService(srv)}
                    />
                  ))
                )}
              </div>
            ) : (
              /* Sub-view: Saved Favorites */
              <div className="space-y-3">
                {favoritesList.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-[#e0b328] mb-3 animate-pulse">
                      <Heart className="w-8 h-8 fill-[#e0b328]" />
                    </div>
                    <h3 className="text-base font-black mb-1">কোনো প্রিয় সার্ভিস নেই</h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-4">
                      যেকোনো সার্ভিসে হার্ট আইকনে ট্যাপ করে এখানে সহজে সেভ করে রাখুন।
                    </p>
                    <button
                      onClick={handleGoFind}
                      className="px-5 py-2.5 rounded-full bg-[#e0b328] text-slate-950 font-black text-xs hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
                    >
                      Find Services
                    </button>
                  </div>
                ) : (
                  favoritesList.map((srv) => (
                    <ServiceCard
                      key={srv.id}
                      service={srv}
                      userLocation={userLocation}
                      onSelect={() => handleSelectService(srv)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "find" ? (
        /* =========================================================================
            VIEW 5: FIND SERVICES SCREEN (MATCHING app/FindScreen)
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          {/* Header */}
          <div
            className={`px-5 pt-4 pb-3 sticky top-0 z-30 shadow-2xs border-b ${
              isDarkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#e0b328]" />
              <h1 className="text-xl font-black tracking-tight">Find Services</h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              আপনার এলাকার বিশ্বস্ত টেকনিশিয়ান ও সার্ভিস প্রোভাইডার
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* Location Bar */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Selected Area</div>
                  <div className="text-xs font-black truncate max-w-[200px]">
                    {userLocation.area}, {userLocation.city}
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenLocationPicker}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Change
              </button>
            </div>

            {/* Search Bar */}
            <div
              className={`flex items-center px-3.5 py-2.5 rounded-2xl border shadow-2xs ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}
            >
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, category or address..."
                className="flex-1 bg-transparent text-xs outline-none font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Distance Radius Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedRadius(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                    selectedRadius === opt.value
                      ? "bg-[#e0b328] text-slate-950 shadow-xs"
                      : isDarkMode
                      ? "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Services List */}
            <div className="space-y-3">
              {findServices.length === 0 ? (
                <div className="py-20 text-center">
                  <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black mb-1">No services found</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-3">
                    Try adjusting your search query or selecting a larger distance radius.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedRadius(null);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                findServices.map((srv) => (
                  <ServiceCard
                    key={srv.id}
                    service={srv}
                    userLocation={userLocation}
                    onSelect={() => handleSelectService(srv)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "setting" ? (
        /* =========================================================================
            VIEW 6: SETTINGS SCREEN (MATCHING app/SettingsScreen)
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          {/* Header */}
          <div
            className={`px-5 pt-4 pb-3 sticky top-0 z-30 shadow-2xs border-b ${
              isDarkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#e0b328]" />
              <h1 className="text-xl font-black tracking-tight">Settings</h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              অ্যাপ সেটিংস ও প্রিফারেন্স ম্যানেজ করুন
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* 1. HIGHLIGHTED LOCATION SECTION (1:1 with app/src/components/SettingsScreen.tsx) */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-1">
                Service Location
              </span>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-[#e0b328] shadow-lg shadow-amber-500/10">
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center">
                    <div className="relative w-11 h-11 flex items-center justify-center mr-3 shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-400/20 border border-amber-300 dark:border-amber-400/30 flex items-center justify-center shadow-2xs">
                        <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 block">
                        Current Location
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight block">
                        {userLocation?.area || "Not Selected"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-100/90 dark:bg-amber-950/70 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                    <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                      {userLocation?.city || "Bangladesh"}
                    </span>
                  </div>
                </div>

                {/* Address Details Box */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 mb-4">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 mb-0.5 uppercase tracking-wider block">
                    Full Address
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug block">
                    {userLocation?.address ||
                      `Latitude: ${userLocation.latitude.toFixed(4)}, Longitude: ${userLocation.longitude.toFixed(4)}`}
                  </span>
                </div>

                {/* Change Location Action Button matching mobile app */}
                <button
                  type="button"
                  onClick={onOpenLocationPicker}
                  className="w-full bg-[#e0b328] hover:bg-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-slate-950" />
                    <span className="text-sm font-black tracking-wide text-slate-950">
                      Change Location On Map
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* 2. APP PREFERENCES (WITH ANIMATED SLIDING THEME PILL) */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-1">
                Preferences
              </span>
              <div
                className={`rounded-3xl border divide-y shadow-2xs overflow-hidden ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 divide-slate-800"
                    : "bg-white border-slate-200/80 divide-slate-100"
                }`}
              >
                {/* Theme Mode Toggle (Segmented Pill Switcher) */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isDarkMode ? "bg-amber-400/20 text-amber-400" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                        Theme Appearance
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isDarkMode ? "Dark mode active" : "Light mode active"}
                      </div>
                    </div>
                  </div>

                  {/* Segmented Light / Dark Switcher with Fluid Sliding Pill */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700 relative w-36 h-9">
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs transition-transform duration-200 ease-out ${
                        isDarkMode ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsDarkMode(false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 z-10 text-xs transition-colors cursor-pointer ${
                        !isDarkMode ? "text-amber-700 font-black" : "text-slate-400 font-semibold"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDarkMode(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 z-10 text-xs transition-colors cursor-pointer ${
                        isDarkMode ? "text-amber-400 font-black" : "text-slate-400 font-semibold"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                {/* Notifications Toggle */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                        Push Notifications
                      </div>
                      <div className="text-[11px] text-slate-400">Receive service updates and deals</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPushNotifsEnabled(!pushNotifsEnabled)}
                    className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors flex items-center ${
                      pushNotifsEnabled ? "bg-[#e0b328]" : isDarkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        pushNotifsEnabled ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Support & Info Card */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-1">
                Support & Details
              </span>
              <div
                className={`rounded-3xl border divide-y shadow-2xs overflow-hidden ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 divide-slate-800"
                    : "bg-white border-slate-200/80 divide-slate-100"
                }`}
              >
                <a
                  href="tel:+8801700000000"
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black">24/7 Hotline Support</div>
                      <div className="text-[11px] text-slate-400">+880 1700-000000</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black">WhatsApp Chat</div>
                      <div className="text-[11px] text-slate-400">Direct message assistance</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(true)}
                  className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black">About Wide Service</div>
                      <div className="text-[11px] text-slate-400">Version 2.4.0 (Official Build)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black">Privacy Policy & Terms</div>
                      <div className="text-[11px] text-slate-400">Data protection guidelines</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "profile" ? (
        /* =========================================================================
            VIEW 7: PROFILE & AUTHENTICATION SCREEN (EXACT MATCH TO app/ProfileScreen)
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          {currentUser ? (
            /* =====================================================================
               PROFILE SUB-VIEW: LOGGED IN USER
               ===================================================================== */
            <div className="space-y-4">
              {/* Dark Teal Hero Top Banner with Brand Amber Curve Wave */}
              <div className="relative bg-[#091b24] pt-5 pb-7 px-5 text-white overflow-hidden shadow-md">
                {/* Dribbble Style Organic Curved Amber Wave at Top Right */}
                <svg
                  className="absolute -top-5 -right-5 w-60 h-56 pointer-events-none select-none opacity-95"
                  viewBox="0 0 240 220"
                >
                  <path d="M 60 0 C 60 95, 120 180, 240 195 L 240 0 Z" fill="#e0b328" />
                </svg>

                {/* Top Action Row */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <button
                    onClick={handleGoFind}
                    className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
                    title="Find Services"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleOpenEditModal}
                    className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Centered Circular Avatar with White Border & Camera Badge */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div
                      onClick={handleOpenEditModal}
                      className="w-24 h-24 rounded-full border-4 border-white bg-[#e0b328] flex items-center justify-center overflow-hidden shadow-xl cursor-pointer"
                    >
                      {currentUser.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentUser.photoURL}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-slate-900">
                          {(currentUser.displayName || currentUser.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Camera Edit Badge on bottom-right of avatar */}
                    <button
                      onClick={handleOpenEditModal}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#e0b328] border-2 border-white flex items-center justify-center text-slate-950 shadow-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* User Name & Contact Identifier */}
                  <h2 className="text-xl font-black text-white mt-3 tracking-tight text-center">
                    {currentUser.displayName || currentUser.name || "Wide Tech Member"}
                  </h2>
                  {(currentUser.phone || currentUser.email) && (
                    <p className="text-xs font-semibold text-white/80 mt-1 text-center">
                      {currentUser.phone || currentUser.email}
                    </p>
                  )}

                  {/* Contact / Social Quick Icons Row (Call, WhatsApp, Email, Web) */}
                  <div className="flex items-center justify-center gap-3.5 mt-3.5">
                    <a
                      href="tel:+8801700000000"
                      className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                      title="Call Helpline"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href="https://wa.me/8801700000000"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center text-emerald-400 hover:bg-white/25 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <a
                      href="mailto:support@widetechbd.com"
                      className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                      title="Email Support"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a
                      href="https://widetechbd.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                      title="Official Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Activity Stats Row (3 Rounded Cards) */}
              <div className="px-4">
                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setIsStatsModalOpen(true)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-transform hover:scale-102 ${
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    <div className="text-base font-black text-amber-500">{userStats.servicesViewed}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">Services Viewed</div>
                  </div>
                  <div
                    onClick={() => setIsStatsModalOpen(true)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-transform hover:scale-102 ${
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    <div className="text-base font-black text-blue-500">{userStats.detailsViewed}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">Details Opened</div>
                  </div>
                  <div
                    onClick={() => setIsStatsModalOpen(true)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-transform hover:scale-102 ${
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    <div className="text-base font-black text-emerald-500">{userStats.callsClicked}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">Calls Connected</div>
                  </div>
                </div>
              </div>

              {/* Menu Items List */}
              <div className="px-4">
                <div
                  className={`rounded-2xl border divide-y shadow-2xs overflow-hidden ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 divide-slate-800"
                      : "bg-white border-slate-200/80 divide-slate-100"
                  }`}
                >
                  <button
                    onClick={handleOpenEditModal}
                    className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Edit3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Edit Profile</div>
                        <div className="text-[11px] text-slate-400">Update name, phone and photo</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setIsStatsModalOpen(true)}
                    className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">My Activity Stats</div>
                        <div className="text-[11px] text-slate-400">
                          {userStats.servicesViewed} views • {userStats.callsClicked} calls placed
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={onOpenLocationPicker}
                    className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Active Location</div>
                        <div className="text-[11px] text-slate-400">
                          {userLocation.area}, {userLocation.city}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleGoFavorites}
                    className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Saved Services</div>
                        <div className="text-[11px] text-slate-400">
                          {favoritesList.length} bookmarked providers
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <a
                    href="tel:+8801700000000"
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">24/7 Hotline Support</div>
                        <div className="text-[11px] text-slate-400">+880 1700-000000 (Emergency)</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>

                  <a
                    href="https://widetechbd.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Official Website</div>
                        <div className="text-[11px] text-slate-400">https://widetechbd.com</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Privacy & Security</div>
                        <div className="text-[11px] text-slate-400">Data protection guidelines</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Log Out Button */}
                <div className="mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-black text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =====================================================================
               AUTH SUB-VIEW: LOGGED OUT (DRIBBLE HERO IN BRAND COLOR #e0b328)
               ===================================================================== */
            <div className="space-y-4">
              {/* 1. Curved Hero Top Banner in Brand Color #e0b328 */}
              <div className="bg-[#e0b328] pt-6 pb-5 px-4 w-full rounded-b-[36px] shadow-md overflow-hidden text-center">
                <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-1">Hello!</h1>

                {/* Scalable Coded Vector Team Illustration */}
                <div className="w-full flex items-center justify-center my-1">
                  <TeamIllustrationSvg width="100%" height={170} />
                </div>

                {/* Tagline */}
                <p className="text-xs font-semibold text-slate-950/80 px-6 max-w-sm mx-auto leading-relaxed">
                  This application will help you to find verified local technicians and book
                  emergency repairs anytime.
                </p>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <span className="w-5 h-1.5 rounded-full bg-slate-950" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950/30" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950/30" />
                </div>
              </div>

              {/* 2. Modern Pill Form Section */}
              <div className="px-5 pt-2">
                {/* Segmented Auth Mode Switch with Animated Sliding Pill */}
                <div
                  className={`p-1 rounded-full border flex items-center mb-4 ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
                      authMode === "login"
                        ? "bg-[#e0b328] text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
                      authMode === "signup"
                        ? "bg-[#e0b328] text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Alerts */}
                {authError && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}
                {authSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {authMode === "signup" && (
                    <>
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Full Name
                        </label>
                        <div
                          className={`flex items-center px-3.5 py-2.5 rounded-xl border ${
                            isDarkMode
                              ? "bg-slate-900 border-slate-800 focus-within:border-amber-400"
                              : "bg-white border-slate-200 focus-within:border-amber-500"
                          }`}
                        >
                          <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="John Doe"
                            className="flex-1 bg-transparent text-xs outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Phone Number
                        </label>
                        <div
                          className={`flex items-center px-3.5 py-2.5 rounded-xl border ${
                            isDarkMode
                              ? "bg-slate-900 border-slate-800 focus-within:border-amber-400"
                              : "bg-white border-slate-200 focus-within:border-amber-500"
                          }`}
                        >
                          <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="01700000000"
                            className="flex-1 bg-transparent text-xs outline-none font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      {authMode === "login" ? "Phone or Email" : "Email (Optional)"}
                    </label>
                    <div
                      className={`flex items-center px-3.5 py-2.5 rounded-xl border ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 focus-within:border-amber-400"
                          : "bg-white border-slate-200 focus-within:border-amber-500"
                      }`}
                    >
                      <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type={authMode === "login" ? "text" : "email"}
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder={authMode === "login" ? "01700000000 or email" : "name@example.com"}
                        className="flex-1 bg-transparent text-xs outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Password
                    </label>
                    <div
                      className={`flex items-center px-3.5 py-2.5 rounded-xl border ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 focus-within:border-amber-400"
                          : "bg-white border-slate-200 focus-within:border-amber-500"
                      }`}
                    >
                      <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 bg-transparent text-xs outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === "login" && (
                    <div className="text-right">
                      <a
                        href="tel:+8801700000000"
                        className="text-[11px] font-bold text-amber-600 hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  )}

                  {/* Gold Submit Button */}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#e0b328] hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </span>
                    ) : authMode === "login" ? (
                      "Log In"
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                      <span
                        className={`px-3 font-black text-slate-400 ${
                          isDarkMode ? "bg-slate-950" : "bg-[#f8fafc]"
                        }`}
                      >
                        Or connect with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-2xs active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    {authMode === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signup");
                            setAuthError(null);
                          }}
                          className="font-black text-amber-600 hover:underline cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setAuthError(null);
                          }}
                          className="font-black text-amber-600 hover:underline cursor-pointer"
                        >
                          Log In
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            VIEW 8: ROOT HOME SCREEN (MATCHING app/HomeScreen)
            ========================================================================= */
        <div className="w-full min-h-screen flex flex-col pb-28">
          {/* Top Header Bar matching app/src/components/HomeScreen.tsx */}
          <div
            className={`px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 z-30 shadow-2xs border-b ${
              isDarkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            {/* Left Section: Greeting & Location Area */}
            <div className="flex-1 mr-3">
              {currentUser ? (
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Welcome, {currentUser.displayName || currentUser.name || "User"}
                    </span>
                    <span className="text-xs">👋</span>
                  </div>
                  <button
                    onClick={onOpenLocationPicker}
                    className="text-left cursor-pointer group"
                  >
                    <h1 className="text-xl font-black tracking-tight truncate max-w-[240px] group-hover:text-amber-500 transition-colors">
                      {userLocation ? `${userLocation.area}, ${userLocation.city}` : "Select Location"}
                    </h1>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    My Location Area
                  </div>
                  <button
                    onClick={onOpenLocationPicker}
                    className="text-left cursor-pointer group"
                  >
                    <h1 className="text-xl font-black tracking-tight truncate max-w-[240px] group-hover:text-amber-500 transition-colors">
                      {userLocation ? `${userLocation.area}, ${userLocation.city}` : "Select Location"}
                    </h1>
                  </button>
                </div>
              )}
            </div>

            {/* Right Section: Notification Bell and User Avatar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNotificationsModal}
                className={`w-10 h-10 rounded-full border items-center justify-center relative transition-colors cursor-pointer flex ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white dark:border-slate-900">
                    {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                  </span>
                )}
              </button>

              {currentUser && (
                <div
                  onClick={handleGoProfile}
                  className="w-10 h-10 rounded-full bg-[#e0b328] border-2 border-[#e0b328] flex items-center justify-center overflow-hidden cursor-pointer shadow-xs"
                >
                  {currentUser.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-black text-slate-950">
                      {(currentUser.displayName || currentUser.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar matching app/src/components/HomeScreen.tsx */}
          <div className="px-5 my-3.5">
            <div
              className={`flex items-center px-4 py-3 rounded-2xl border shadow-2xs ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}
            >
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category or service..."
                className="flex-1 bg-transparent text-xs font-medium outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Exact 2-Column Categories Grid (NO promotional banner!) */}
          <div className="px-5 mb-5 flex-1">
            <div className="grid grid-cols-2 gap-3">
              {loading && categories.length === 0
                ? [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={`rounded-xl border py-4 px-3 flex flex-col items-center justify-center animate-pulse ${
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 mb-2" />
                      <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  ))
                : filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory(null);
                      }}
                      className={`rounded-xl border p-3.5 flex flex-col items-center justify-center text-center shadow-2xs transition-all active:scale-97 cursor-pointer group ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 hover:border-amber-400/60"
                          : "bg-white border-slate-200/90 hover:border-amber-400/80"
                      }`}
                    >
                      <div className="w-14 h-14 mb-2 flex items-center justify-center">
                        {cat.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-2xl">🛠️</span>
                        )}
                      </div>
                      <span className="text-xs font-bold line-clamp-2 leading-tight">
                        {cat.name}
                      </span>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PERSISTENT FULL-WIDTH BOTTOM NAVIGATION BAR (1:1 WITH app/App.tsx)
          Pure minimalist 5-icon layout:
          1. Home (LayoutGrid)
          2. Favorites (Heart)
          3. Find (Search)
          4. Settings (Settings)
          5. Profile (User / Avatar circle)
          ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-md mx-auto border-t shadow-2xl backdrop-blur-xl h-[60px] flex items-center justify-around px-2 ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-800 text-slate-100"
              : "bg-white/95 border-slate-200/90 text-slate-900"
          }`}
        >
          {/* 1. Home Tab */}
          <button
            onClick={handleGoHome}
            className="flex-1 h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Home"
          >
            <LayoutGrid
              className={`w-6 h-6 transition-colors ${
                activeTab === "home" && !selectedCategory && !selectedService
                  ? "text-[#e0b328] stroke-[2.5]"
                  : "text-slate-400 dark:text-slate-500 stroke-[2] hover:text-slate-600"
              }`}
            />
          </button>

          {/* 2. Favorites Tab (Heart) */}
          <button
            onClick={handleGoFavorites}
            className="flex-1 h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Favorites"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                activeTab === "favorites" && !selectedCategory && !selectedService
                  ? "fill-[#e0b328] text-[#e0b328] stroke-[2.5]"
                  : "text-slate-400 dark:text-slate-500 stroke-[2] hover:text-slate-600"
              }`}
            />
          </button>

          {/* 3. Find Tab (Search) */}
          <button
            onClick={handleGoFind}
            className="flex-1 h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Find"
          >
            <Search
              className={`w-6 h-6 transition-colors ${
                activeTab === "find" && !selectedCategory && !selectedService
                  ? "text-[#e0b328] stroke-[2.5]"
                  : "text-slate-400 dark:text-slate-500 stroke-[2] hover:text-slate-600"
              }`}
            />
          </button>

          {/* 4. Settings Tab */}
          <button
            onClick={handleGoSettings}
            className="flex-1 h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Settings"
          >
            <Settings
              className={`w-6 h-6 transition-colors ${
                activeTab === "setting" && !selectedCategory && !selectedService
                  ? "text-[#e0b328] stroke-[2.5]"
                  : "text-slate-400 dark:text-slate-500 stroke-[2] hover:text-slate-600"
              }`}
            />
          </button>

          {/* 5. Profile Tab */}
          <button
            onClick={handleGoProfile}
            className="flex-1 h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Profile"
          >
            {currentUser?.photoURL ? (
              <div
                className={`w-6 h-6 rounded-full overflow-hidden border ${
                  activeTab === "profile" && !selectedCategory && !selectedService
                    ? "border-[#e0b328] ring-2 ring-[#e0b328]"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <User
                className={`w-6 h-6 transition-colors ${
                  activeTab === "profile" && !selectedCategory && !selectedService
                    ? "text-[#e0b328] stroke-[2.5]"
                    : "text-slate-400 dark:text-slate-500 stroke-[2] hover:text-slate-600"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* 1. In-App Notification Center Modal (matching app/src/components/HomeScreen) */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
              isDarkMode ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e0b328]/20 flex items-center justify-center text-[#e0b328]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Notifications</h3>
                  <p className="text-[10px] text-slate-400">System announcements & updates</p>
                </div>
              </div>
              <button
                onClick={handleCloseNotificationsModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingNotifs ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">No new notifications</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border ${
                      isDarkMode
                        ? "bg-slate-800/60 border-slate-700"
                        : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-xs font-black">{item.title}</h4>
                      <span className="text-[9px] text-slate-400">
                        {item.sentAt || item.createdAt
                          ? new Date(item.sentAt || item.createdAt || "").toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {item.body}
                    </p>
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt="Notification Media"
                        className="w-full h-32 object-cover rounded-xl mt-2"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={handleCloseNotificationsModal}
                className="w-full py-2.5 rounded-xl bg-[#e0b328] text-slate-950 font-black text-xs hover:bg-amber-500 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl ${
              isDarkMode ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 rounded-xl bg-[#e0b328] hover:bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Activity Stats Details Modal */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl ${
              isDarkMode ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black">My Activity Stats</h3>
              </div>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-100"
                }`}
              >
                <div>
                  <div className="text-xs font-black">Services Browsed</div>
                  <div className="text-[11px] text-slate-400">Total service cards loaded</div>
                </div>
                <span className="text-lg font-black text-amber-500">{userStats.servicesViewed}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-100"
                }`}
              >
                <div>
                  <div className="text-xs font-black">Details Opened</div>
                  <div className="text-[11px] text-slate-400">Service detail screens viewed</div>
                </div>
                <span className="text-lg font-black text-blue-500">{userStats.detailsViewed}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-100"
                }`}
              >
                <div>
                  <div className="text-xs font-black">Calls Connected</div>
                  <div className="text-[11px] text-slate-400">Technicians called directly</div>
                </div>
                <span className="text-lg font-black text-emerald-500">{userStats.callsClicked}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsStatsModalOpen(false)}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#e0b328] text-slate-950 font-black text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. About Wide Service Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl ${
              isDarkMode ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black">About Wide Service</h3>
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Wide Service by WideTech BD connects customers directly with background-verified,
              expert local technicians for home repairs, plumbing, electrical, AC cooling, cleaning
              and appliance services.
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400 mb-4">
              ✨ 100% Free Hyperlocal Platform • No Middleman Fees
            </div>
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#e0b328] text-slate-950 font-black text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 5. Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl ${
              isDarkMode ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black">Privacy & Terms</h3>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Your personal data and phone numbers are encrypted and protected under WideTech BD’s
              strict privacy protocols. We never share your credentials with unauthorized third
              parties.
            </p>
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#e0b328] text-slate-950 font-black text-xs cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
