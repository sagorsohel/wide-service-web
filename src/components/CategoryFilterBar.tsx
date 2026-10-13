"use client";

import React, { useState } from "react";
import { UserLocation } from "../types";
import { MapPin, ChevronDown, Search } from "lucide-react";

interface CategoryFilterBarProps {
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  subcategories: string[];
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPerformSearch: () => void;
  categoryName: string;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  userLocation,
  onOpenLocationPicker,
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  searchQuery,
  onSearchChange,
  onPerformSearch,
  categoryName,
}) => {
  const [subcatOpen, setSubcatOpen] = useState(false);

  return (
    <div className="bg-[#f8fafc] border-b border-slate-200/80 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-sm border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* 1. Location */}
          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="flex-1 flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 rounded-full transition-colors cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-[#d49b1a] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Your location
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate">
                {userLocation.address || userLocation.city || "Dhaka, Bangladesh"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:text-slate-600 shrink-0" />
          </button>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* 2. Subcategories */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setSubcatOpen(!subcatOpen)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Subcategory
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate">
                  {selectedSubcategory || "All Subcategories"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {subcatOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-slate-900">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      onSelectSubcategory(sub);
                      setSubcatOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedSubcategory === sub
                        ? "bg-amber-50 text-[#d49b1a] font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* 3. Search Input */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onPerformSearch()}
              placeholder={`Search ${categoryName} services...`}
              className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={onPerformSearch}
            className="px-6 py-2.5 rounded-full bg-[#d49b1a] hover:bg-[#b88514] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
