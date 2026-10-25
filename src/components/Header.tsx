"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import {
  MapPin,
  Search,
  Smartphone,
  User,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface HeaderProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenDownload: () => void;
  isMobileAppMode: boolean;
  onToggleMobileAppMode: () => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onOpenLocationPicker,
  onOpenDownload,
  isMobileAppMode,
  onToggleMobileAppMode,
  activeNav = "Home",
  onNavClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentNav, setCurrentNav] = useState(activeNav);

  const handleNav = (nav: string, href?: string) => {
    setCurrentNav(nav);
    if (onNavClick) onNavClick(nav);
    if (href) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Logo matching screenshot */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            {/* Custom Golden Pin Logo Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                className="w-9 h-9 fill-[#d49b1a] transition-transform group-hover:scale-105"
              >
                <path d="M18 2C11.37 2 6 7.37 6 14c0 8.25 10.5 19.5 11.25 20.25.38.38 1.12.38 1.5 0C19.5 33.5 30 22.25 30 14c0-6.63-5.37-12-12-12zm0 16.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
              </svg>
              <div className="absolute top-[12px] w-3 h-3 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d49b1a]" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#0f172a] leading-tight">
                Wide Service
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                Local Services • Trusted Technicians
              </span>
            </div>
          </a>

          {/* Center: Navigation Links with golden active indicator */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-slate-700">
            {[
              { name: "Home", href: "/" },
              { name: "Services", href: "/services" },

              { name: "How It Works", href: "/#how-it-works" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => {
              const isActive = (activeNav || currentNav) === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setCurrentNav(item.name)}
                  className={`relative py-2 transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#0f172a] font-bold"
                      : "text-slate-600 hover:text-[#0f172a]"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.name === "Download App" && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                      APK
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d49b1a] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions (Location, Search, App, Login / Register) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Location Selector Pill */}
            <button
              onClick={onOpenLocationPicker}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d49b1a]" />
              <span className="font-bold">{userLocation.city || "Dhaka"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Search Icon Button */}
            <button
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-9 h-9 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Search Services"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile App Download Button */}
            <a
              href="/apk"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Download Wide Service Android & iOS App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">App APK</span>
            </a>

            {/* Golden Login / Register Pill Button */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3">
          <button
            onClick={() => {
              onOpenLocationPicker();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-800"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d49b1a]" />
              <span>
                Location: {userLocation.area}, {userLocation.city}
              </span>
            </div>
            <span className="text-[#d49b1a] text-xs font-black">Change</span>
          </button>

          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            {[
              { name: "Home", href: "/" },
              { name: "Services", href: "/services" },

              { name: "How It Works", href: "/#how-it-works" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left p-2.5 hover:bg-slate-50 rounded-xl block font-medium ${
                  item.href === "/apk"
                    ? "text-emerald-700 font-bold bg-emerald-50/50"
                    : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-full bg-[#d49b1a] text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Login / Register (Admin Portal)</span>
          </a>
        </div>
      )}
    </header>
  );
};
