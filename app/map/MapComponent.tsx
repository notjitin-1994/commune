"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import { MapPin } from "lucide-react";
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

// Custom marker icons
const createCustomIcon = (category: 1 | 2 | 3, isSelected: boolean = false) => {
  const color = getCategoryColor(category);
  const size = isSelected ? 48 : 40;
  const borderWidth = isSelected ? 4 : 3;
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% ${size}% 50% 50%;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: ${borderWidth}px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-size: ${isSelected ? 18 : 14}px;
      ">
        <span style="transform: rotate(45deg);">
          ${category === 1 ? '⚠' : category === 2 ? 'ℹ' : '📍'}
        </span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

interface MapComponentProps {
  flags: Flag[];
  onFlagClick: (flag: Flag) => void;
  onMapClick: (lat: number, lng: number) => void;
  userLocation: { lat: number; lng: number } | null;
  selectedFlagId?: string | null;
  targetFlag?: { lat: number; lng: number } | null;
}

export function MapComponent({
  flags,
  onFlagClick,
  onMapClick,
  userLocation,
  selectedFlagId,
  targetFlag,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Handle map resize
  const handleResize = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultLocation = userLocation || { lat: 19.0760, lng: 72.8777 };

    const map = L.map(mapContainerRef.current, {
      center: [defaultLocation.lat, defaultLocation.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      // Mobile optimizations
      bounceAtZoomLimits: false,
    });

    // Brand-compliant light theme tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Handle resize
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(mapContainerRef.current);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handleMapClick);

    // Ensure proper sizing after init
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      map.off("click", handleMapClick);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      map.remove();
      mapRef.current = null;
    };
  }, [onMapClick, handleResize]);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="position: relative; width: 80px; height: 80px;">
            <div style="
              position: absolute;
              width: 80px;
              height: 80px;
              background: rgba(249, 115, 22, 0.2);
              border-radius: 50%;
              animation: pulse-ring 2s ease-out infinite;
              transform: translate(-50%, -50%);
              left: 50%;
              top: 50%;
            "></div>
            <div style="
              position: absolute;
              width: 20px;
              height: 20px;
              background: #f97316;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              transform: translate(-50%, -50%);
              left: 50%;
              top: 50%;
              z-index: 2;
            "></div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current);

      mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true, duration: 1 });
    }
  }, [userLocation]);

  // Update flag markers
  useEffect(() => {
    if (!mapRef.current) return;

    const currentIds = new Set(flags.map(f => f.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    flags.forEach((flag) => {
      const isSelected = flag.id === selectedFlagId;
      const existingMarker = markersRef.current.get(flag.id);
      
      if (existingMarker) {
        existingMarker.setIcon(createCustomIcon(flag.category, isSelected));
      } else {
        const marker = L.marker([flag.lat, flag.lng], {
          icon: createCustomIcon(flag.category, isSelected),
        })
          .addTo(mapRef.current!)
          .on("click", (e) => {
            e.originalEvent.stopPropagation();
            onFlagClick(flag);
          });

        marker.bindPopup(
          `<div style="font-family: 'Inter', sans-serif; min-width: 150px; color: #2C1F14;">
            <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px; color: #2C1F14;">${flag.title}</div>
            <div style="font-size: 12px; color: #A68A64;">${getCategoryLabel(flag.category)}</div>
          </div>`,
          {
            closeButton: false,
            offset: [0, -20],
            className: 'brand-popup',
          }
        );

        markersRef.current.set(flag.id, marker);
      }
    });
  }, [flags, onFlagClick, selectedFlagId]);

  // Pan to target flag
  useEffect(() => {
    if (!mapRef.current || !targetFlag) return;
    
    mapRef.current.setView([targetFlag.lat, targetFlag.lng], 17, {
      animate: true,
      duration: 1,
    });
  }, [targetFlag]);

  return (
    <>
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0 w-full h-full" 
        style={{ background: "#F5F1E8" }} 
      />
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-oxide" />
          <span className="text-sm text-deep-brown">Tap anywhere to add a flag</span>
        </div>
      </div>

      <style jsx global>{`
        .brand-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid #E8E0D5;
          box-shadow: 0 4px 20px rgba(44, 31, 20, 0.15);
        }
        .brand-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #E8E0D5;
        }
        .brand-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        /* Mobile optimizations for map */
        @media (max-width: 768px) {
          .leaflet-control-zoom {
            display: none;
          }
          .leaflet-popup-content-wrapper {
            max-width: 280px;
          }
        }
        /* Improve marker touch targets on mobile */
        .custom-marker {
          touch-action: manipulation;
        }
        .user-location-marker {
          touch-action: manipulation;
        }
      `}</style>
    </>
  );
}
