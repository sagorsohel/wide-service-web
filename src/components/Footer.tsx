"use client";

import React, { useState } from "react";
import { Lightbulb } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#0b1a30] text-white pt-16 pb-10 border-t border-slate-800 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          {/* Col 1: Brand Info & Socials (4.5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-8 h-8 fill-[#d49b1a]">
                  <path d="M18 2C11.37 2 6 7.37 6 14c0 8.25 10.5 19.5 11.25 20.25.38.38 1.12.38 1.5 0C19.5 33.5 30 22.25 30 14c0-6.63-5.37-12-12-12zm0 16.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
                </svg>
                <div className="absolute top-[10px] w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d49b1a]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-white leading-tight">
                  Wide Service
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Local Services • Trusted Technicians
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
              Your trusted partner for home services in Bangladesh. Fast, reliable and professional
              technicians, near you.
            </p>

            {/* Social Media Rounded Buttons matching Image 3 */}
            <div className="flex items-center gap-2 pt-1">
              {/* Facebook */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-black text-white flex items-center justify-center transition-colors"
                title="X"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E4405F] text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF0000] text-white flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-normal">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Services
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-normal">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  AC Repair
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Plumbing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Electrical
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Cleaning
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Carpentry
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  CCTV
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Appliances
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Stay Connected with Newsletter (3 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Stay Connected
            </h4>
            <p className="text-slate-400 text-xs font-normal">
              Get the latest updates and offers.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex items-center rounded-xl overflow-hidden bg-white p-1 border border-slate-700 max-w-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar matching Image 3 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          {/* Left links */}
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </a>
          </div>

          {/* Right copyright matching Image 3 */}
          <div className="flex items-center gap-1.5">
            <span>© 2025 Wide Service. All rights reserved.</span>
            <span>|</span>
            <span>Made with ❤️ in Bangladesh</span>
          </div>
        </div>
      </div>

      {/* Floating Yellow Action Button on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            const el = document.getElementById("services");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-12 h-12 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
          title="Explore Services"
        >
          <Lightbulb className="w-5 h-5 text-white" />
        </button>
      </div>
    </footer>
  );
};
