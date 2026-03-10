"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, ClipboardList, MessageSquare, Users, Phone, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { useAuthStore } from "@/lib/stores/authStore";

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/notice-board", label: "Notice Board", icon: ClipboardList },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/meeting-rooms", label: "Meeting Rooms", icon: Users },
  { href: "/calls", label: "Call History", icon: Phone },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 h-screen bg-beige-light border-r border-warm-sand/30 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-warm-sand/30">
        <Link href="/map" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-oxide flex items-center justify-center">
            <span className="text-white font-playfair font-bold text-lg">C</span>
          </div>
          <span className="font-playfair text-xl font-bold text-espresso">Commune</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "text-red-oxide bg-red-oxide/5"
                      : "text-taupe hover:text-deep-brown hover:bg-beige-medium/50"
                  )}
                >
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden">
                    <Icon className="w-5 h-5 relative z-10" />
                    {isActive && (
                      <motion.div
                        layoutId="sideNavIndicator"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-oxide rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-warm-sand/30">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-taupe hover:text-red-oxide hover:bg-red-oxide/5 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
