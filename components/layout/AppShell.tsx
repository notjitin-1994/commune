"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { useAuthStore } from "@/lib/stores/authStore";
import { seedAllData } from "@/lib/data/seed";

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Seed demo data
    console.log('AppShell: Seeding data...');
    seedAllData();
    
    // Debug: log current data state
    if (typeof window !== 'undefined') {
      const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
      const convs = JSON.parse(localStorage.getItem('conversations') || '[]');
      console.log('AppShell: Messages seeded:', msgs.length);
      console.log('AppShell: Conversations seeded:', convs.length);
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Desktop Side Navigation */}
      {!hideNav && (
        <div className="hidden lg:block">
          <SideNav />
        </div>
      )}

      {/* Main Content */}
      <main className={`${hideNav ? '' : 'lg:ml-64'} pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
