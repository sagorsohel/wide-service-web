"use client";

import React, { useState, useEffect } from "react";
import { UserLocation } from "../types";
import { DEFAULT_USER_LOCATION } from "../lib/cities";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { LiveServiceDirectory } from "../components/LiveServiceDirectory";
import { HowItWorks } from "../components/HowItWorks";
import { WhyChooseUsSection } from "../components/WhyChooseUsSection";
import { AppDownloadSection } from "../components/AppDownloadSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { StatsBannerSection } from "../components/StatsBannerSection";
import { FaqSection } from "../components/FaqSection";
import { ProviderOnboarding } from "../components/ProviderOnboarding";
import { Footer } from "../components/Footer";
import { LocationPickerModal } from "../components/LocationPickerModal";
import { MobileAppExperience } from "../components/MobileAppExperience";

export default function Home() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMobileAppMode, setIsMobileAppMode] = useState(false);

  // Restore saved location from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wide_service_user_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.latitude && parsed.longitude) {
          setUserLocation(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not read stored location:", e);
    }
  }, []);

  // Save location to localStorage when updated
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

  const handleQuickSearch = (query: string) => {
    const searchInput = document.querySelector<HTMLInputElement>(
      '#services input[type="text"]'
    );
    if (searchInput) {
      searchInput.value = query;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Responsive or Toggled View:
          On mobile screen sizes (< md), defaults to MobileAppExperience!
          On desktop, user can also preview the mobile app layout with "Mobile App Mode".
      */}
      {isMobileAppMode ? (
        <div className="flex-1 flex flex-col items-center justify-start bg-slate-900 py-6 px-4">
          {/* Top Bar Switcher to return to desktop */}
          <div className="w-full max-w-md mb-4 flex items-center justify-between text-white text-xs">
            <span className="font-bold flex items-center gap-1.5">
              📱 Mobile App Preview Mode
            </span>
            <button
              onClick={() => setIsMobileAppMode(false)}
              className="px-3 py-1.5 rounded-xl bg-[#d49b1a] text-white font-bold hover:bg-[#b88514] transition-colors cursor-pointer"
            >
              Exit to Desktop Web
            </button>
          </div>

          {/* Mobile Shell Frame */}
          <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-700">
            <MobileAppExperience
              userLocation={userLocation}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              onOpenDownload={handleOpenDownload}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Viewport (< md): Automatically displays the App Experience */}
          <div className="block md:hidden">
            <MobileAppExperience
              userLocation={userLocation}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              onOpenDownload={handleOpenDownload}
            />
          </div>

          {/* Desktop & Tablet Viewport (>= md): Full Landing Page Experience matching all mockups */}
          <div className="hidden md:flex flex-col flex-1">
            {/* 1. Header with Golden Pin Logo & Navigation */}
            <Header
              userLocation={userLocation}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              onOpenDownload={handleOpenDownload}
              isMobileAppMode={isMobileAppMode}
              onToggleMobileAppMode={() => setIsMobileAppMode(!isMobileAppMode)}
            />

            {/* Main Content */}
            <main className="flex-1">
              {/* 1. Hero Section: Find Trusted Home Service Technicians */}
              <HeroSection
                userLocation={userLocation}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
                onOpenDownload={handleOpenDownload}
                onQuickSearch={handleQuickSearch}
              />

              {/* 2. Popular Service Categories (8) + Nearby Services (4) */}
              <LiveServiceDirectory
                userLocation={userLocation}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              />

              {/* 3. Simple Steps / How It Works (4 Steps) */}
              <HowItWorks
                id="how-it-works"
                pill="Simple Steps"
                title="How It Works"
                subtitle="Get your service done in just a few simple steps. Fast, easy and reliable."
              />

              {/* 4. Get Services on Your Mobile (Dual Phones Mockup + Badges + 5 Checks) */}
              <AppDownloadSection />

              {/* 5. Why Choose Us / Trusted by Thousands (4 Steps) */}
              <HowItWorks
                id="trusted-by-thousands"
                pill="Why Choose Us"
                title="Trusted by Thousands"
                subtitle="We are service platform providing a few simple steps. Fast, easy, safety and convenience."
              />

              {/* 6. Fast Services, Trusted Care (AC Tech + 4 Cards) */}
              <WhyChooseUsSection />

              {/* 7. Real Stories, Real Satisfaction (3 Customer Reviews with 5 Stars) */}
              <TestimonialsSection />

              {/* 8. By the Numbers (1,800+ Services, 5,200+ Techs, 48k+ Customers, 96%) */}
              <StatsBannerSection />

              {/* 9. Frequently Asked Questions (5 Accordion Questions) */}
              <FaqSection />
            </main>

            {/* 10. Footer with Socials, Newsletter & Copyright */}
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
