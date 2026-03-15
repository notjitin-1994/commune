"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Map, 
  ClipboardList, 
  MessageSquare, 
  Users, 
  Phone, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/notice-board", label: "Board", icon: ClipboardList },
  { href: "/messages", label: "Chat", icon: MessageSquare },
  { href: "/meeting-rooms", label: "Rooms", icon: Users },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige-medium safe-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200",
                isActive ? "text-red-oxide" : "text-taupe"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon 
                  className="w-5 h-5" 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-red-oxide" : "text-taupe"
                )}>
                  {item.label}
                </span>
              </motion.div>
              
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-oxide rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
