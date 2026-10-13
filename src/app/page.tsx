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

      {/* Conditionally rendered or Responsive App Layout:
          On mobile screen sizes (max-md), it defaults to MobileAppExperience!
          On desktop, user can also toggle "Mobile App Mode" to preview the app layout.
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

          {/* Desktop & Tablet Viewport (>= md): Full Landing Page Experience */}
          <div className="hidden md:flex flex-col flex-1">
            {/* Header */}
            <Header
              userLocation={userLocation}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              onOpenDownload={handleOpenDownload}
              isMobileAppMode={isMobileAppMode}
              onToggleMobileAppMode={() => setIsMobileAppMode(!isMobileAppMode)}
            />

            {/* Main Content */}
            <main className="flex-1">
              {/* Hero Section */}
              <HeroSection
                userLocation={userLocation}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
                onOpenDownload={handleOpenDownload}
                onQuickSearch={handleQuickSearch}
              />

              {/* Live Service Directory (Popular Categories + Nearby Services + 4 Pillars) */}
              <LiveServiceDirectory
                userLocation={userLocation}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              />

              {/* Section 1 from Image 1: How It Works / Trusted by Thousands (4 Steps) */}
              <HowItWorks />

              {/* Section 2 from Image 2: Why Choose Us (Fast Services, Trusted Care + AC Tech + 4 Cards) */}
              <WhyChooseUsSection />

              {/* Mobile App Section: Dual Phones Mockup + Store Badges + 5 Golden Checks */}
              <AppDownloadSection />

              {/* Service Provider Onboarding */}
              <ProviderOnboarding />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
