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
    <div className="bg-beige-light" style={{ minHeight: '100dvh' }}>
      {/* Desktop Side Navigation */}
      {!hideNav && (
        <div className="hidden lg:block">
          <SideNav />
        </div>
      )}

      {/* Main Content - Industry standard: consistent padding for navbar */}
      <main 
        className={`${hideNav ? '' : 'lg:ml-64'}`} 
        style={{ 
          minHeight: '100dvh',
          paddingBottom: hideNav ? 0 : 'calc(64px + env(safe-area-inset-bottom))'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
          style={{ minHeight: hideNav ? '100dvh' : 'auto' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation - Always visible except modals */}
      {!hideNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
