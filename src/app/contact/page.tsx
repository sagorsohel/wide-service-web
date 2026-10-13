"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserLocation } from "../../types";
import { DEFAULT_USER_LOCATION } from "../../lib/cities";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LocationPickerModal } from "../../components/LocationPickerModal";
import { ServiceMapEmbed } from "../../components/ServiceMapEmbed";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  Building2,
  Headphones,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface HubOffice {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const HUBS: HubOffice[] = [
  {
    id: "rajshahi",
    name: "Rajshahi Central Operations Hub",
    city: "Rajshahi",
    address: "Level 4, Trade Center, Shaheb Bazar, Rajshahi - 6000",
    phone: "+880 1712-345678",
    hours: "Everyday: 8:00 AM – 10:00 PM",
    lat: 24.3636,
    lng: 88.6241,
  },
  {
    id: "dhaka",
    name: "Dhaka Corporate Hub",
    city: "Dhaka",
    address: "Road 11, Block D, Banani, Dhaka - 1213",
    phone: "+880 1800-943300",
    hours: "Everyday: 8:00 AM – 10:00 PM",
    lat: 23.7937,
    lng: 90.4043,
  },
  {
    id: "chittagong",
    name: "Chittagong Regional Hub",
    city: "Chittagong",
    address: "Agrabad Commercial Area, Chittagong - 4100",
    phone: "+880 1819-876543",
    hours: "Everyday: 9:00 AM – 9:00 PM",
    lat: 22.3352,
    lng: 91.8155,
  },
];

const FAQS = [
  {
    question: "How quickly does a technician arrive after I call or submit a request?",
    answer:
      "Our system matches you with the nearest active technician within 2–5 km of your address. In metropolitan areas like Dhaka and Rajshahi, average arrival times range from 15 to 30 minutes for emergency requests.",
  },
  {
    question: "Are all Wide Service technicians background verified?",
    answer:
      "Yes, 100%. Every technician undergoes physical National ID (NID) cross-checking, police verification verification, skill assessment, and in-person interviews before they are onboarded to our network.",
  },
  {
    question: "What should I do in case of a late-night electrical or plumbing emergency?",
    answer:
      "Our emergency dispatch hotline (+880 1712-345678) operates 24 hours a day, 7 days a week. Select 'Emergency Support' on our hotline or call directly for immediate assistance.",
  },
  {
    question: "How can I join Wide Service as an independent technician or agency?",
    answer:
      "You can select 'Technician Registration' in the contact form below or visit one of our physical hubs in Rajshahi, Dhaka, or Chittagong with your NID and trade experience certificates.",
  },
  {
    question: "Do you offer corporate or commercial maintenance contracts?",
    answer:
      "Yes. We manage facility maintenance for offices, restaurants, retail chains, and residential complexes across Bangladesh. Reach out to corporate@wideservice.com.bd or call our Dhaka Hub.",
  },
];

export default function ContactPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMobileAppMode, setIsMobileAppMode] = useState(false);

  // Selected Hub for Map Embed
  const [selectedHub, setSelectedHub] = useState<HubOffice>(HUBS[0]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Dhaka",
    category: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Restore saved location from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wide_service_user_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.latitude && parsed.longitude) {
          setUserLocation(parsed);
          // Auto select closest hub if user in Rajshahi or Chittagong
          const matchingHub = HUBS.find((h) =>
            parsed.city?.toLowerCase().includes(h.city.toLowerCase())
          );
          if (matchingHub) {
            setSelectedHub(matchingHub);
          }
        }
      }
    } catch (e) {
      console.warn("Could not read stored location:", e);
    }
  }, []);

  const handleLocationChange = (newLoc: UserLocation) => {
    setUserLocation(newLoc);
    try {
      localStorage.setItem("wide_service_user_location", JSON.stringify(newLoc));
    } catch (e) {}
  };

  const handleOpenDownload = () => {
    const el = document.getElementById("download");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Please fill in your name, phone number, and message.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmissionId(`WS-${Math.floor(10000 + Math.random() * 90000)}`);
    }, 900);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: userLocation.city || "Dhaka",
      category: "General Inquiry",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Global Brand Header */}
      <Header
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenDownload={handleOpenDownload}
        isMobileAppMode={isMobileAppMode}
        onToggleMobileAppMode={() => setIsMobileAppMode(!isMobileAppMode)}
        activeNav="Contact"
      />

      <main className="flex-1">
        {/* =========================================================
            1. HERO SECTION: Contact Header & Quick Cards
        ========================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fefbf2] via-[#faf8f2] to-white pt-14 pb-16 border-b border-slate-100">
          <div className="absolute top-0 right-10 w-96 h-96 bg-[#e0b328]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Golden Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0b328]/15 border border-[#e0b328]/40 text-[#0f172a] text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#d49b1a]" />
                <span>24/7 Customer Support & Hub Operations</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
                We’re Here to Help You{" "}
                <span className="text-[#d49b1a] relative inline-block">
                  Anytime, Anywhere
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 11"
                    fill="none"
                    className="absolute left-0 top-full -mt-1 w-full text-[#d49b1a]/40"
                  >
                    <path
                      d="M0.5 8C80 2 240 1 417.5 7"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Have a question about a service, need emergency technician dispatch, or want to register as a service partner? Reach out to our dedicated support channels.
              </p>
            </div>

            {/* 4 Quick Access Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {/* Card 1: 24/7 Emergency Hotline */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#e0b328] hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d49b1a] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      24/7 Live
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0f172a] mb-1">
                    Emergency Hotline
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Immediate dispatch for urgent electrical, gas, or plumbing issues.
                  </p>
                  <p className="font-black text-sm text-[#d49b1a] tracking-wide">
                    +880 1712-345678
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="tel:+8801712345678"
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Call Hotline Now</span>
                  </a>
                </div>
              </div>

              {/* Card 2: WhatsApp Chat */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      Instant Chat
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0f172a] mb-1">
                    WhatsApp Support
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Send photos or videos of the issue for quick remote diagnostics.
                  </p>
                  <p className="font-black text-sm text-emerald-700 tracking-wide">
                    +880 1712-345678
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="https://wa.me/8801712345678?text=Hello%20Wide%20Service%2C%20I%20need%20help%20with%20a%20service."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Email Support */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      &lt; 2h Reply
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0f172a] mb-1">
                    Email Desk
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    For corporate queries, formal partnerships, and billing questions.
                  </p>
                  <p className="font-black text-xs text-blue-700 truncate tracking-wide">
                    support@wideservice.com.bd
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="mailto:support@wideservice.com.bd"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Send an Email</span>
                  </a>
                </div>
              </div>

              {/* Card 4: Operations Hubs */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-400 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                      3 Divisions
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0f172a] mb-1">
                    Physical Hubs
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Visit us in person at Rajshahi, Dhaka, and Chittagong.
                  </p>
                  <p className="font-black text-xs text-purple-700 tracking-wide">
                    Shaheb Bazar • Banani • Agrabad
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      const el = document.getElementById("hubs-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Hub Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. INTERACTIVE CONTACT FORM & SUPPORT SUMMARY
        ========================================================= */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
              {/* Left Column: Form Card */}
              <div className="lg:col-span-7 bg-[#f8fafc] rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
                <div className="mb-8">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-[#d49b1a] text-xs font-bold uppercase tracking-wider">
                    Inquiry Form
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-2.5">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Fill out the form below. An operations representative will call you back within 15–30 minutes.
                  </p>
                </div>

                {isSubmitted ? (
                  /* Success Feedback */
                  <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Message Received Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                      Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Your ticket reference ID is <span className="font-black text-[#d49b1a]">{submissionId}</span>. Our duty supervisor is dispatching a callback to <span className="font-bold text-slate-900">{formData.phone}</span>.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={handleResetForm}
                        className="px-6 py-2.5 rounded-full bg-[#d49b1a] text-white font-bold text-xs hover:bg-[#b88514] transition-colors cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Live Interactive Form */
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="01712-XXXXXX"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="tanvir@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all"
                        />
                      </div>

                      {/* Division / City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your City / Division
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barishal">Barishal</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                          <option value="Other">Other District</option>
                        </select>
                      </div>
                    </div>

                    {/* Inquiry Reason */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Inquiry Category / Service Needed
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all"
                      >
                        <option value="General Inquiry">General Customer Support</option>
                        <option value="AC Repair & Servicing">AC Repair & Servicing</option>
                        <option value="Plumbing & Sanitary">Plumbing & Sanitary</option>
                        <option value="Electrician & Wiring">Electrician & Wiring</option>
                        <option value="Home Deep Cleaning">Home Deep Cleaning</option>
                        <option value="CCTV & Security">CCTV & Security</option>
                        <option value="Technician Registration">Register as a Technician</option>
                        <option value="Corporate Partnership">Corporate / Commercial Contract</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Detailed Message / Address Details <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Please describe your issue, address or questions in detail..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d49b1a] focus:ring-2 focus:ring-[#d49b1a]/20 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Request</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Information & Trust Box */}
              <div className="lg:col-span-5 space-y-6">
                {/* Working Hours Card */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#e0b328] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">
                        Operating Hours
                      </h4>
                      <p className="text-xs text-slate-400">
                        Bangladesh Standard Time (BST)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 text-xs border-t border-slate-800">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Emergency Technicians:</span>
                      <span className="font-bold text-emerald-400">24/7 (365 Days)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Customer Phone Desk:</span>
                      <span className="font-bold text-white">8:00 AM – 11:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Walk-in Hub Service:</span>
                      <span className="font-bold text-white">9:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Trust & Guarantee Card */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
                  <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>The Wide Service Commitment</span>
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d49b1a] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Zero Middleman Surcharge:</strong> You connect directly with the nearby service partner.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d49b1a] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Verified Identity:</strong> All registered tradespeople have valid NID documents on file.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d49b1a] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Dedicated Dispute Desk:</strong> Any dissatisfaction is reviewed by our customer care supervisors.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Rapid Dial Quick Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-3">
                  <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[#d49b1a]" />
                    <span>Need Immediate Telephone Assistance?</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our Rajshahi & Dhaka response managers are available right now to assign a nearby technician.
                  </p>
                  <a
                    href="tel:+8801712345678"
                    className="inline-flex items-center gap-2 text-xs font-black text-[#d49b1a] hover:underline"
                  >
                    <span>Dial +880 1712-345678 directly</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. REGIONAL HUBS & INTERACTIVE MAP EMBED
        ========================================================= */}
        <section id="hubs-section" className="py-20 bg-[#f8fafc] border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="px-3.5 py-1 rounded-full bg-slate-200/80 text-[#0f172a] text-xs font-bold tracking-wide uppercase">
                Physical Operations Hubs
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-3">
                Visit Our Divisional Service Centers
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Select a hub below to view real-time GPS coordinates, address directions, and localized assistance desks.
              </p>
            </div>

            {/* Hub Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {HUBS.map((hub) => {
                const isActive = selectedHub.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? "bg-[#0f172a] text-white shadow-md scale-102"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-[#e0b328]" : "text-slate-400"
                        }`}
                      />
                      <span>{hub.city} Hub</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map & Hub Info Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Hub Details */}
              <div className="lg:col-span-5 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#d49b1a] text-xs font-black">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{selectedHub.city} Regional Office</span>
                  </div>

                  <h3 className="text-xl font-black text-[#0f172a]">
                    {selectedHub.name}
                  </h3>

                  <div className="space-y-3 text-xs text-slate-600 pt-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#d49b1a] shrink-0 mt-0.5" />
                      <span>{selectedHub.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <a
                        href={`tel:${selectedHub.phone.replace(/[^0-9+]/g, "")}`}
                        className="font-bold text-slate-900 hover:underline"
                      >
                        {selectedHub.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{selectedHub.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 flex flex-wrap gap-3">
                  <a
                    href={`https://maps.google.com/?q=${selectedHub.lat},${selectedHub.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`tel:${selectedHub.phone.replace(/[^0-9+]/g, "")}`}
                    className="px-4 py-2.5 rounded-xl bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hub Desk</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Embedded Leaflet OpenStreetMap */}
              <div className="lg:col-span-7 h-[360px] lg:h-auto min-h-[360px] relative bg-slate-900">
                <ServiceMapEmbed
                  serviceLat={selectedHub.lat}
                  serviceLng={selectedHub.lng}
                  serviceName={selectedHub.name}
                  userLat={userLocation.latitude}
                  userLng={userLocation.longitude}
                  height="100%"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. FREQUENTLY ASKED QUESTIONS (Accordion)
        ========================================================= */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-[#0f172a] text-xs font-bold tracking-wide uppercase">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mt-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Quick answers regarding bookings, emergency technicians, and verification standards.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0f172a] hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#d49b1a]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            5. EMERGENCY HOTLINE BANNER (Amber CTA)
        ========================================================= */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] py-14 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-[#e0b328] text-xs font-bold uppercase tracking-wider">
                  24/7 Rapid Dispatch
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Facing an Urgent Repair or Electrical Hazard?
                </h3>
                <p className="text-slate-300 text-sm max-w-xl font-normal">
                  Our emergency response team assigns certified specialists to your location immediately.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="tel:+8801712345678"
                  className="px-6 py-3.5 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Emergency Unit (+880 1712-345678)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
