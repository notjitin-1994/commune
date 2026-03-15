"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  AlertTriangle, 
  MapPin, 
  X, 
  Info, 
  Navigation, 
  Crosshair, 
  Plus,
  ChevronDown,
  Layers
} from "lucide-react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { useMapStore } from "@/lib/stores/mapStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Flag } from "@/lib/types";
import { getCategoryColor, getCategoryLabel, formatDate } from "@/lib/utils/helpers";

// Dynamically import the map component
const MapComponent = dynamic(
  () => import("./MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-beige-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-red-oxide border-t-transparent rounded-full animate-spin" />
          <p className="text-deep-brown">Loading map...</p>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-beige-light/80 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col border-t border-beige-medium"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-beige-medium rounded-full" />
              <h2 className="font-playfair text-xl font-bold text-espresso mt-4">{title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Inner component
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
  const [locationDenied, setLocationDenied] = useState(false);
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
    // Request location after a short delay to ensure user interaction context
    const timer = setTimeout(() => {
      handleGetLocation();
    }, 500);
    return () => clearTimeout(timer);
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
            setLocationDenied(true);
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
    } else {
      // Prompt user to enable location or tap map
      setLocationError("Enable location access or tap on the map to add a flag");
      setTimeout(() => setLocationError(null), 3000);
    }
  };

  const filteredFlags = filterCategory ? flags.filter((f) => f.category === filterCategory) : flags;

  return (
    <AppShell>
      <div className="h-[100dvh] lg:h-screen flex flex-col bg-beige-light fixed inset-0 lg:relative">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur px-4 py-3 sticky top-0 z-20 flex-shrink-0">
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
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-11 h-11 rounded-xl bg-beige-medium border border-beige-medium flex items-center justify-center text-deep-brown hover:text-espresso hover:bg-warm-sand transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-11 h-11 rounded-xl bg-beige-medium border border-beige-medium flex items-center justify-center text-deep-brown hover:text-espresso hover:bg-warm-sand transition-colors disabled:opacity-50"
              >
                {isLocating ? (
                  <div className="w-5 h-5 border-2 border-red-oxide border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Crosshair className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                    <input
                      type="text"
                      placeholder="Search places..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="input pl-11 pr-10"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-beige-medium flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-taupe" />
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-beige-medium rounded-xl shadow-xl border border-beige-medium overflow-hidden z-50"
                      >
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectSearchResult(result)}
                            className="w-full text-left px-4 py-3 hover:bg-beige-medium transition-colors border-b border-beige-medium last:border-0"
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

          {/* Category Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilter(null)}
              className={`chip flex-shrink-0 ${filterCategory === null ? "chip-active" : "chip-inactive"}`}
            >
              <Layers className="w-4 h-4" />
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
          <AnimatePresence>
            {locationError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-red-oxide/10 rounded-xl border border-red-oxide/20"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-oxide mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-deep-brown">{locationError}</p>
                    <p className="text-xs text-taupe mt-1">
                      {locationError === "Location access denied" 
                        ? "Please enable location in your browser settings and try again."
                        : "You can still use the map by searching for a location."}
                    </p>
                  </div>
                  <button 
                    onClick={handleGetLocation} 
                    className="text-xs font-medium text-red-oxide underline whitespace-nowrap"
                  >
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          {/* Location Permission Required */}
          {!userLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-30 bg-beige-light flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl border border-beige-medium text-center">
                <div className="w-20 h-20 bg-red-oxide/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Navigation className="w-10 h-10 text-red-oxide" />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-espresso mb-3">
                  Location Required
                </h2>
                <p className="text-taupe text-sm mb-6 leading-relaxed">
                  Commune requires location access to show community flags near you. Please allow location access to continue.
                </p>
                <button
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="w-full py-4 bg-red-oxide text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-oxide/25"
                >
                  {isLocating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Allow Location Access
                    </>
                  )}
                </button>
                {locationError && (
                  <p className="text-xs text-red-oxide mt-4">
                    {locationError}. Please enable location in your browser settings.
                  </p>
                )}
              </div>
            </motion.div>
          )}
          <MapComponent
            flags={filteredFlags}
            onFlagClick={handleFlagClick}
            onMapClick={handleMapClick}
            userLocation={userLocation}
            selectedFlagId={selectedFlag?.id}
            targetFlag={targetFlag}
          />
        </div>

        {/* Floating Action Buttons */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddCurrentLocation}
          className="fixed left-4 z-40 flex items-center gap-2 px-5 py-3 bg-red-oxide text-white rounded-full font-medium text-sm shadow-xl shadow-red-oxide/30"
          style={{ bottom: 'calc(96px + env(safe-area-inset-bottom))' }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Flag</span>
        </motion.button>

        {/* Add Flag Bottom Sheet */}
        <BottomSheet
          isOpen={isAddSheetOpen}
          onClose={() => setIsAddSheetOpen(false)}
          title="Add New Flag"
        >
          <div className="space-y-5">
            <div className="p-4 bg-beige-medium rounded-xl border border-beige-medium">
              <div className="flex items-center gap-2 text-taupe text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <p className="text-deep-brown font-medium font-mono text-sm">
                {newFlagPosition.lat.toFixed(6)}, {newFlagPosition.lng.toFixed(6)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-3">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewFlagData({ ...newFlagData, category: cat as 1 | 2 | 3 })}
                    className={`py-4 px-2 rounded-xl text-sm font-medium transition-all ${
                      newFlagData.category === cat
                        ? "text-white shadow-lg"
                        : "bg-beige-medium text-deep-brown border border-beige-medium hover:bg-beige-medium"
                    }`}
                    style={
                      newFlagData.category === cat
                        ? { backgroundColor: getCategoryColor(cat as 1 | 2 | 3) }
                        : undefined
                    }
                  >
                    <div className="text-lg mb-2">
                      {cat === 1 ? <AlertTriangle className="w-6 h-6 mx-auto" /> : cat === 2 ? <Info className="w-6 h-6 mx-auto" /> : <MapPin className="w-6 h-6 mx-auto" />}
                    </div>
                    <div className="text-xs">
                      {getCategoryLabel(cat as 1 | 2 | 3)}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Title</label>
              <input
                type="text"
                value={newFlagData.title}
                onChange={(e) => setNewFlagData({ ...newFlagData, title: e.target.value })}
                placeholder="What's happening here?"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Description</label>
              <textarea
                value={newFlagData.description}
                onChange={(e) => setNewFlagData({ ...newFlagData, description: e.target.value })}
                placeholder="Add more details..."
                className="input min-h-[100px] resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddFlag}
                disabled={!newFlagData.title.trim()}
                className="w-full py-4 bg-red-oxide text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-oxide/25"
              >
                <MapPin className="w-5 h-5" />
                Add Flag
              </motion.button>
              <button onClick={() => setIsAddSheetOpen(false)} className="w-full py-4 bg-beige-medium text-deep-brown rounded-xl font-semibold hover:bg-beige-medium transition-colors">
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
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: getCategoryColor(selectedFlag.category) }}
                >
                  {selectedFlag.category === 1 && <AlertTriangle className="w-8 h-8 text-white" />}
                  {selectedFlag.category === 2 && <Info className="w-8 h-8 text-white" />}
                  {selectedFlag.category === 3 && <MapPin className="w-8 h-8 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-2xl font-bold text-espresso">
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

              {selectedFlag.description && (
                <div className="p-4 bg-beige-medium rounded-xl border border-beige-medium">
                  <p className="text-deep-brown leading-relaxed">{selectedFlag.description}</p>
                </div>
              )}

              <div className="p-4 bg-beige-medium rounded-xl border border-beige-medium">
                <div className="flex items-center gap-2 text-taupe text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Coordinates</span>
                </div>
                <p className="text-deep-brown font-mono text-sm">
                  {selectedFlag.lat.toFixed(6)}, {selectedFlag.lng.toFixed(6)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-taupe pt-2 border-t border-beige-medium">
                <span>Posted {formatDate(selectedFlag.createdAt)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDetailSheetOpen(false)}
                className="w-full py-4 bg-red-oxide text-white rounded-xl font-semibold shadow-lg shadow-red-oxide/25"
              >
                Close
              </motion.button>
            </div>
          )}
        </BottomSheet>
      </div>
    </AppShell>
  );
}

// Main export
export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-beige-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-red-oxide border-t-transparent rounded-full animate-spin" />
          <p className="text-deep-brown">Loading map...</p>
        </div>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
