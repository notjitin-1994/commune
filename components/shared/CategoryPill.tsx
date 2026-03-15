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
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
        isSelected
          ? "text-white shadow-md"
          : "bg-navy-800 text-navy-300 border border-white/5 hover:bg-navy-700"
      )}
      style={isSelected ? { backgroundColor: color } : undefined}
    >
      <Icon className="w-4 h-4" />
      {showLabel && <span>{label}</span>}
    </motion.button>
  );
}

import { motion } from "framer-motion";
