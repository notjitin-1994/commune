"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, MapPin, X, Info, Navigation, ChevronDown, Crosshair, ArrowLeft, TriangleAlert, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMapStore } from "@/lib/stores/mapStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Flag } from "@/lib/types";
import { getCategoryColor, getCategoryLabel, formatDate } from "@/lib/utils/helpers";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(
  () => import("./MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-beige-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-oxide border-t-transparent rounded-full animate-spin" />
          <p className="text-taupe text-sm">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// Bottom Sheet Component
function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Handle */}
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-warm-sand/50 rounded-full" />
              <h2 className="font-playfair text-lg font-bold text-espresso mt-3">{title}</h2>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Inner component that uses useSearchParams
function MapPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flags, loadFlags, addFlag, selectedFlag, selectFlag, filterCategory, setFilter } = useMapStore();
  const { user } = useAuthStore();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [newFlagPosition, setNewFlagPosition] = useState({ lat: 0, lng: 0 });
  const [newFlagData, setNewFlagData] = useState({
    title: "",
    description: "",
    category: 1 as 1 | 2 | 3,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [targetFlag, setTargetFlag] = useState<{ lat: number; lng: number } | null>(null);

  // Handle URL params for navigation from notice board
  useEffect(() => {
    const flagId = searchParams.get('flag');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (flagId && lat && lng) {
      const flag = flags.find(f => f.id === flagId);
      if (flag) {
        selectFlag(flag);
        setIsDetailSheetOpen(true);
        setTargetFlag({ lat: parseFloat(lat), lng: parseFloat(lng) });
      }
    }
  }, [searchParams, flags, selectFlag]);

  useEffect(() => {
    loadFlags();
    handleGetLocation();
  }, [loadFlags]);

  const handleGetLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location timeout";
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setIsSearching(false);
  };

  const handleSelectSearchResult = (result: { lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setUserLocation({ lat, lng });
    setSearchResults([]);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewFlagPosition({ lat, lng });
    setNewFlagData({ title: "", description: "", category: 1 });
    setIsAddSheetOpen(true);
  }, []);

  const handleFlagClick = useCallback((flag: Flag) => {
    selectFlag(flag);
    setIsDetailSheetOpen(true);
  }, [selectFlag]);

  const handleAddFlag = () => {
    if (!user) return;

    addFlag({
      userId: user.id,
      lat: newFlagPosition.lat,
      lng: newFlagPosition.lng,
      category: newFlagData.category,
      title: newFlagData.title,
      description: newFlagData.description,
      status: "active",
    });

    setIsAddSheetOpen(false);
  };

  const handleAddCurrentLocation = () => {
    if (userLocation) {
      setNewFlagPosition(userLocation);
      setNewFlagData({ title: "", description: "", category: 1 });
      setIsAddSheetOpen(true);
    }
  };

  const filteredFlags = filterCategory ? flags.filter((f) => f.category === filterCategory) : flags;

  return (
    <AppShell>
      <div className="fixed inset-x-0 top-0 bottom-[calc(64px+env(safe-area-inset-bottom))] lg:static lg:h-screen flex flex-col bg-beige-light">
        {/* Mobile Header - Compact */}
        <header className="mobile-header px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="font-playfair text-xl font-bold text-espresso truncate">Community Map</h1>
              {userLocation && (
                <p className="text-xs text-taupe flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span className="truncate">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
                </p>
              )}
            </div>
            
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 rounded-xl bg-beige-medium active:bg-warm-sand/30 transition-colors"
            >
              <Search className="w-5 h-5 text-deep-brown" />
            </button>
          </div>

          {/* Search Bar - Expandable */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                    <Input
                      type="text"
                      placeholder="Search places..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10 pr-10 h-11"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-taupe" />
                      </button>
                    )}
                  </div>
                  
                  {/* Search Results */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-beige-medium overflow-hidden z-50"
                      >
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectSearchResult(result)}
                            className="w-full text-left px-4 py-3 hover:bg-beige-light transition-colors border-b border-beige-medium last:border-0 active:bg-beige-medium"
                          >
                            <p className="text-sm text-deep-brown truncate">{result.display_name}</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filters - Horizontal Scroll */}
          <div className="category-bar mt-3">
            <button
              onClick={() => setFilter(null)}
              className={`chip ${filterCategory === null ? "chip-active" : "chip-inactive"}`}
            >
              All
            </button>
            {[1, 2, 3].map((cat) => (
              <CategoryPill
                key={cat}
                category={cat as 1 | 2 | 3}
                isSelected={filterCategory === cat}
                onClick={() => setFilter(filterCategory === cat ? null : cat)}
              />
            ))}
          </div>

          {/* Location Error */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3 bg-red-oxide/10 rounded-xl flex items-center gap-2 text-sm text-red-oxide"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{locationError}</span>
              <button onClick={handleGetLocation} className="underline font-medium">
                Retry
              </button>
            </motion.div>
          )}
        </header>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <MapComponent
            flags={filteredFlags}
            onFlagClick={handleFlagClick}
            onMapClick={handleMapClick}
            userLocation={userLocation}
            selectedFlagId={selectedFlag?.id}
            targetFlag={targetFlag}
          />
        </div>

        {/* Floating Action Buttons - Fixed position relative to viewport */}
        {userLocation && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleAddCurrentLocation}
            className="fixed left-4 z-40 flex items-center gap-2 px-5 py-3 bg-red-oxide text-white rounded-full font-medium text-sm shadow-lg active:scale-95 transition-transform"
            style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
          >
            <Plus className="w-5 h-5" />
            <span>Add here</span>
          </motion.button>
        )}

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="fixed right-4 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-70"
          style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
          aria-label="Get my location"
        >
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-red-oxide border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair className="w-5 h-5 text-deep-brown" />
          )}
        </button>

        {/* Add Flag Bottom Sheet */}
        <BottomSheet
          isOpen={isAddSheetOpen}
          onClose={() => setIsAddSheetOpen(false)}
          title="Add New Flag"
        >
          <div className="space-y-5">
            {/* Location Display */}
            <div className="p-4 bg-beige-light rounded-xl">
              <div className="flex items-center gap-2 text-taupe text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <p className="text-deep-brown font-medium text-sm">
                {newFlagPosition.lat.toFixed(6)}, {newFlagPosition.lng.toFixed(6)}
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewFlagData({ ...newFlagData, category: cat as 1 | 2 | 3 })}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      newFlagData.category === cat
                        ? "text-white shadow-lg"
                        : "bg-beige-light text-deep-brown active:bg-beige-medium"
                    }`}
                    style={
                      newFlagData.category === cat
                        ? { backgroundColor: getCategoryColor(cat as 1 | 2 | 3) }
                        : undefined
                    }
                  >
                    <div className="text-lg mb-1">
                      {cat === 1 ? <AlertTriangle className="w-6 h-6" /> : cat === 2 ? <Info className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div className="text-xs">
                      {getCategoryLabel(cat as 1 | 2 | 3)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Title</label>
              <input
                type="text"
                value={newFlagData.title}
                onChange={(e) => setNewFlagData({ ...newFlagData, title: e.target.value })}
                placeholder="What's happening here?"
                className="form-input"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Description</label>
              <textarea
                value={newFlagData.description}
                onChange={(e) => setNewFlagData({ ...newFlagData, description: e.target.value })}
                placeholder="Add more details..."
                className="form-input form-textarea"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddFlag}
                disabled={!newFlagData.title.trim()}
                className="btn-primary"
              >
                <MapPin className="w-5 h-5" />
                Add Flag
              </button>
              <button onClick={() => setIsAddSheetOpen(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* Flag Detail Bottom Sheet */}
        <BottomSheet
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          title="Flag Details"
        >
          {selectedFlag && (
            <div className="space-y-5">
              {/* Flag Header */}
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: getCategoryColor(selectedFlag.category) }}
                >
                  {selectedFlag.category === 1 && <AlertTriangle className="w-6 h-6" />}
                  {selectedFlag.category === 2 && <Info className="w-6 h-6" />}
                  {selectedFlag.category === 3 && <MapPin className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-xl font-bold text-espresso">
                    {selectedFlag.title}
                  </h3>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mt-2"
                    style={{ backgroundColor: getCategoryColor(selectedFlag.category) }}
                  >
                    {getCategoryLabel(selectedFlag.category)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedFlag.description && (
                <div className="p-4 bg-beige-light rounded-xl">
                  <p className="text-deep-brown leading-relaxed">{selectedFlag.description}</p>
                </div>
              )}

              {/* Location */}
              <div className="p-4 bg-beige-light rounded-xl">
                <div className="flex items-center gap-2 text-taupe text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Coordinates</span>
                </div>
                <p className="text-deep-brown font-medium font-mono text-sm">
                  {selectedFlag.lat.toFixed(6)}, {selectedFlag.lng.toFixed(6)}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between text-sm text-taupe pt-2 border-t border-beige-medium">
                <span>Posted {formatDate(selectedFlag.createdAt)}</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsDetailSheetOpen(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          )}
        </BottomSheet>
      </div>
    </AppShell>
  );
}

// Main export wrapped in Suspense
export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-beige-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-oxide border-t-transparent rounded-full animate-spin" />
          <p className="text-taupe text-sm">Loading map...</p>
        </div>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
