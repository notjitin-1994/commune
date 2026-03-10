"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Shield, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, UserProfileCompact, UserProfileSkeleton } from "@/components/shared/UserProfile";
import { useAuthStore } from "@/lib/stores/authStore";
import { forceReseed } from "@/lib/data/seed";
import { cn } from "@/lib/utils/helpers";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [dataStats, setDataStats] = useState({
    users: 0,
    flags: 0,
    posts: 0,
    messages: 0,
    conversations: 0,
    callLogs: 0,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load data stats
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDataStats({
        users: JSON.parse(localStorage.getItem('users') || '[]').length,
        flags: JSON.parse(localStorage.getItem('flags') || '[]').length,
        posts: JSON.parse(localStorage.getItem('posts') || '[]').length,
        messages: JSON.parse(localStorage.getItem('messages') || '[]').length,
        conversations: JSON.parse(localStorage.getItem('conversations') || '[]').length,
        callLogs: JSON.parse(localStorage.getItem('callLogs') || '[]').length,
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleResetData = () => {
    if (confirm('This will reset all demo data. Are you sure?')) {
      forceReseed();
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-beige-light py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <UserProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Header */}
      <header className="bg-white shadow-card sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/map")}
            className="p-2 -ml-2 rounded-full hover:bg-beige-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-taupe" />
          </button>
          <h1 className="font-playfair text-xl font-bold text-espresso">Profile</h1>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <UserProfile user={user} editable />

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-playfair text-lg font-bold text-espresso mb-4">
                Account Settings
              </h3>
              
              <div className="space-y-3">
                {/* Privacy Option */}
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-beige-light transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-beige-light flex items-center justify-center">
                      <Shield className="w-5 h-5 text-taupe" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-brown">Privacy</p>
                      <p className="text-xs text-taupe">Manage your privacy settings</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-taupe rotate-180" />
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-oxide/5 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-oxide/10 flex items-center justify-center group-hover:bg-red-oxide/20 transition-colors">
                    <LogOut className="w-5 h-5 text-red-oxide" />
                  </div>
                  <div>
                    <p className="font-medium text-red-oxide">Logout</p>
                    <p className="text-xs text-taupe">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Demo Data Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-playfair text-lg font-bold text-espresso mb-4">
                Demo Data Status
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.users}</p>
                  <p className="text-xs text-taupe">Users</p>
                </div>
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.flags}</p>
                  <p className="text-xs text-taupe">Flags</p>
                </div>
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.posts}</p>
                  <p className="text-xs text-taupe">Posts</p>
                </div>
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.conversations}</p>
                  <p className="text-xs text-taupe">Chats</p>
                </div>
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.messages}</p>
                  <p className="text-xs text-taupe">Messages</p>
                </div>
                <div className="text-center p-3 bg-beige-light rounded-xl">
                  <p className="text-2xl font-bold text-red-oxide">{dataStats.callLogs}</p>
                  <p className="text-xs text-taupe">Calls</p>
                </div>
              </div>

              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-deep-brown/5 hover:bg-deep-brown/10 active:bg-deep-brown/20 transition-colors text-deep-brown font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Demo Data
              </button>
            </div>
          </motion.div>

          {/* Data Storage Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-beige-medium/50 rounded-2xl p-6"
          >
            <h4 className="text-sm font-medium text-taupe mb-2">Data Storage</h4>
            <p className="text-xs text-taupe leading-relaxed">
              Your profile information is stored locally in your browser using localStorage. 
              This means your data persists across sessions but is only available on this device. 
              Clearing your browser data will remove this information.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
