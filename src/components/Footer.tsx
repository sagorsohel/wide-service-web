"use client";

import React from "react";
import { Phone, Mail, MapPin, Heart, ExternalLink, QrCode } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#e0b328] flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                W
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Wide Service
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Bangladesh&apos;s hyper-local home service ecosystem connecting customers with verified
              technicians in real-time. AC repair, plumbing, electrical, cleaning, and more.
            </p>
            <div className="flex items-center gap-4 text-xs pt-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend API Online (Port 5000)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Service Directory
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  Key Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-amber-400 transition-colors">
                  App Download & QR
                </a>
              </li>
            </ul>
          </div>

          {/* Cities Covered */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Coverage Areas
            </h4>
            <ul className="space-y-2">
              <li>Rajshahi (Shaheb Bazar, Boalia, Shah Makhdum)</li>
              <li>Dhaka (Dhanmondi, Gulshan, Mirpur, Uttara)</li>
              <li>Chittagong (Agrabad, GEC)</li>
              <li>Sylhet & Khulna</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Support & Ecosystem
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-mono text-slate-300">01800-WIDE-SERVICE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>support@wide-service.com</span>
              </li>
              <li className="pt-2">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[11px]"
                >
                  <span>Admin Management Panel</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Wide Service Ecosystem. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted for web and mobile with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>by Wide Service Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
