"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    seedAllData();
    
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
      <main 
        className={`${hideNav ? '' : 'lg:ml-72'}`}
        style={{ 
          minHeight: '100dvh',
          paddingBottom: hideNav ? 0 : 'calc(80px + env(safe-area-inset-bottom))'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : 'initial'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
