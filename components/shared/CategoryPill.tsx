"use client";

import { cn } from "@/lib/utils/helpers";
import { getCategoryColor, getCategoryLabel } from "@/lib/utils/helpers";
import { AlertTriangle, Info, MapPin } from "lucide-react";

interface CategoryPillProps {
  category: 1 | 2 | 3;
  isSelected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}

export function CategoryPill({
  category,
  isSelected = false,
  onClick,
  showLabel = true,
}: CategoryPillProps) {
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);
  const Icon = category === 1 ? AlertTriangle : category === 2 ? Info : MapPin;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95",
        isSelected
          ? "text-white shadow-md"
          : "bg-beige-medium text-deep-brown active:bg-warm-sand/50"
      )}
      style={isSelected ? { backgroundColor: color } : undefined}
    >
      <Icon className="w-4 h-4" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
