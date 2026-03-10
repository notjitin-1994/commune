"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, ClipboardList, MessageSquare, Users, Phone, Settings } from "lucide-react";
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-beige-medium/50 z-[100] pb-safe">
      <div className="flex items-center justify-around h-[64px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 active:scale-95",
                isActive ? "text-red-oxide" : "text-taupe"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-1 w-10 h-1 bg-red-oxide rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-red-oxide/10" : ""
              )}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-0.5",
                isActive ? "text-red-oxide" : "text-taupe"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
