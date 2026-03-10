"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Plus, MapPin, X } from "lucide-react";
import L from "leaflet";
import { Flag } from "@/lib/types";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils/helpers";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  iconUrl: markerIcon.src || markerIcon,
  shadowUrl: markerShadow.src || markerShadow,
});

// Custom marker icons for different categories
const createCustomIcon = (category: 1 | 2 | 3, isSelected: boolean = false) => {
  const color = getCategoryColor(category);
  const size = isSelected ? 44 : 36;
  const borderWidth = isSelected ? 4 : 3;
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: ${borderWidth}px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        font-size: ${isSelected ? 20 : 16}px;
        transition: all 0.2s;
      ">
        ${category === 1 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' 
          : category === 2 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' 
          : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

interface MapComponentProps {
  flags: Flag[];
  onFlagClick: (flag: Flag) => void;
  onMapClick: (lat: number, lng: number) => void;
  userLocation: { lat: number; lng: number } | null;
  onGetLocation: () => void;
  isLocating: boolean;
  onAddLocationClick: () => void;
  selectedFlagId?: string | null;
  targetFlag?: { lat: number; lng: number } | null;
}

export function MapComponent({
  flags,
  onFlagClick,
  onMapClick,
  userLocation,
  onGetLocation,
  isLocating,
  onAddLocationClick,
  selectedFlagId,
  targetFlag,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultLocation = userLocation || { lat: 40.7128, lng: -74.006 };

    const map = L.map(mapContainerRef.current, {
      center: [defaultLocation.lat, defaultLocation.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Store map reference
    mapRef.current = map;

    // Handle map clicks for adding flags
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      map.remove();
      mapRef.current = null;
    };
  }, [onMapClick]);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    if (userLocation) {
      // Add user location marker with pulse effect
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="position: relative; width: 60px; height: 60px;">
            <div style="
              position: absolute;
              width: 60px;
              height: 60px;
              background: rgba(156, 61, 50, 0.25);
              border-radius: 50%;
              animation: pulse-ring 2s ease-out infinite;
              transform: translate(-50%, -50%);
              left: 50%;
              top: 50%;
            "></div>
            <div style="
              position: absolute;
              width: 18px;
              height: 18px;
              background: #9C3D32;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transform: translate(-50%, -50%);
              left: 50%;
              top: 50%;
              z-index: 2;
            "></div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current);

      // Pan to user location smoothly
      mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true, duration: 1 });
    }
  }, [userLocation]);

  // Update flag markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers not in current flags
    const currentIds = new Set(flags.map(f => f.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    flags.forEach((flag) => {
      const isSelected = flag.id === selectedFlagId;
      const existingMarker = markersRef.current.get(flag.id);
      
      if (existingMarker) {
        // Update icon if selection changed
        existingMarker.setIcon(createCustomIcon(flag.category, isSelected));
      } else {
        // Create new marker
        const marker = L.marker([flag.lat, flag.lng], {
          icon: createCustomIcon(flag.category, isSelected),
        })
          .addTo(mapRef.current!)
          .on("click", (e) => {
            e.originalEvent.stopPropagation();
            onFlagClick(flag);
          });

        // Add popup with flag info
        marker.bindPopup(
          `<div style="font-family: 'Work Sans', sans-serif; min-width: 150px;">
            <div style="font-weight: 600; color: #2C1F14; margin-bottom: 4px; font-size: 14px;">${flag.title}</div>
            <div style="font-size: 12px; color: #A68A64;">${getCategoryLabel(flag.category)}</div>
          </div>`,
          {
            closeButton: false,
            offset: [0, -18],
          }
        );

        markersRef.current.set(flag.id, marker);
      }
    });
  }, [flags, onFlagClick, selectedFlagId]);

  // Pan to target flag when navigating from notice board
  useEffect(() => {
    if (!mapRef.current || !targetFlag) return;
    
    mapRef.current.setView([targetFlag.lat, targetFlag.lng], 17, {
      animate: true,
      duration: 1,
    });
  }, [targetFlag]);

  return (
    <>
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ background: "#e5e3df" }} />

      {/* Map Hint - Inside map at top */}
      <div className="map-hint pointer-events-none">
        <MapPin className="w-4 h-4 text-red-oxide" />
        <span>Tap anywhere to add a flag</span>
      </div>

      {/* Add Current Location Button - Left side */}
      <AnimatePresence>
        {userLocation && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            onClick={onAddLocationClick}
            className="add-location-btn"
          >
            <Plus className="w-5 h-5" />
            <span>Add here</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Location Button - Right side */}
      <button
        onClick={onGetLocation}
        disabled={isLocating}
        className="location-fab"
        aria-label="Get my location"
      >
        {isLocating ? (
          <div className="w-5 h-5 border-2 border-red-oxide border-t-transparent rounded-full animate-spin" />
        ) : (
          <Crosshair className="w-5 h-5 text-deep-brown" />
        )}
      </button>
    </>
  );
}
