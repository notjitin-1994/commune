"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map, MessageSquare, Users, Shield, ArrowRight, Home } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

const features = [
  { icon: Map, title: "Community Map", description: "Mark and discover locations" },
  { icon: MessageSquare, title: "Notice Board", description: "Share community updates" },
  { icon: Users, title: "Meeting Rooms", description: "Join audio discussions" },
  { icon: Shield, title: "Private & Secure", description: "End-to-end encrypted" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/map");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-beige-light overflow-hidden">
      <section className="min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-oxide flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-playfair text-xl font-bold text-espresso">Commune</span>
          </div>
          
          <button 
            onClick={() => router.push("/login")}
            className="text-taupe hover:text-deep-brown transition-colors text-sm font-medium"
          >
            Sign In
          </button>
        </motion.nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-lg mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-playfair text-5xl md:text-6xl font-bold text-espresso mb-6 leading-tight"
            >
              Connect with Your{" "}
              <span className="text-red-oxide">Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-taupe mb-10 max-w-md mx-auto"
            >
              A sophisticated platform for neighborhood communication where privacy meets community engagement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className="px-8 py-4 bg-red-oxide text-white rounded-2xl font-semibold text-base shadow-button flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className="px-8 py-4 bg-white text-deep-brown rounded-2xl font-semibold text-base border border-beige-medium hover:bg-beige-medium transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-5 text-center border border-beige-medium"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-oxide/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-oxide" />
                  </div>
                  <h3 className="font-semibold text-espresso text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-taupe">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="py-6 text-center"
        >
          <p className="text-xs text-taupe">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </section>
    </div>
  );
}
