"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Shield, RefreshCw, Database, ChevronRight, Edit3, Camera } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { forceReseed } from "@/lib/data/seed";

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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-beige-medium" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-beige-medium rounded w-1/2" />
                <div className="h-4 bg-beige-medium rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <header className="bg-white/95 backdrop-blur sticky top-0 z-10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/map")}
            className="w-10 h-10 rounded-xl bg-beige-medium flex items-center justify-center text-deep-brown"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-playfair text-xl font-bold text-white">Profile</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-oxide/5" />
            
            <div className="relative">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-2xl bg-red-oxide flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-beige-medium border border-beige-medium flex items-center justify-center text-deep-brown"
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </div>
              
              <h2 className="font-playfair text-2xl font-bold text-white mt-4">{user.name}</h2>
              <p className="text-taupe flex items-center justify-center gap-2 mt-2">
                <Shield className="w-4 h-4" />
                {user.isAdmin ? "Community Admin" : "Community Member"}
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-taupe">Posts</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">48</p>
                  <p className="text-xs text-taupe">Comments</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-taupe">Rooms</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur rounded-2xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-playfair text-lg font-bold text-white mb-4">
                Account Settings
              </h3>
              
              <div className="space-y-2">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-beige-medium/50 hover:bg-beige-medium transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-beige-medium flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-oxide" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Privacy</p>
                      <p className="text-xs text-taupe">Manage your privacy settings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-taupe" />
                </motion.button>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-error/10 hover:bg-error/20 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-error" />
                    </div>
                    <div>
                      <p className="font-medium text-error">Logout</p>
                      <p className="text-xs text-taupe">Sign out of your account</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur rounded-2xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-playfair text-lg font-bold text-white mb-4">
                Demo Data Status
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Users', value: dataStats.users },
                  { label: 'Flags', value: dataStats.flags },
                  { label: 'Posts', value: dataStats.posts },
                  { label: 'Chats', value: dataStats.conversations },
                  { label: 'Messages', value: dataStats.messages },
                  { label: 'Calls', value: dataStats.callLogs },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-beige-medium/50 rounded-xl">
                    <p className="text-2xl font-bold text-red-oxide">{stat.value}</p>
                    <p className="text-xs text-taupe">{stat.label}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-beige-medium/50 hover:bg-beige-medium transition-colors text-deep-brown font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Demo Data
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur rounded-2xl p-6"
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
