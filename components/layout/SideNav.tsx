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
  Settings, 
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { useAuthStore } from "@/lib/stores/authStore";

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/notice-board", label: "Notice Board", icon: ClipboardList },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/meeting-rooms", label: "Meeting Rooms", icon: Users },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 h-screen bg-white border-r border-beige-medium flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-beige-medium">
        <Link href="/map" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-oxide flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-playfair text-xl font-bold text-espresso">Commune</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <p className="text-xs font-semibold text-taupe uppercase tracking-wider mb-4 px-4">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-red-oxide text-white shadow-button"
                      : "text-deep-brown hover:bg-beige-medium"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-beige-medium">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-beige-medium flex items-center justify-center text-deep-brown font-semibold">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-espresso truncate">{user?.name || "User"}</p>
            <p className="text-xs text-taupe truncate">{user?.phone || ""}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-taupe hover:text-red-oxide hover:bg-beige-light transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
