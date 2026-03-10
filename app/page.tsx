"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map, MessageSquare, Users, Shield } from "lucide-react";
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
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-oxide/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-tan/20 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-oxide flex items-center justify-center shadow-lg">
                <span className="text-white font-playfair font-bold text-4xl">C</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-playfair text-4xl font-bold text-espresso mb-4 leading-tight"
            >
              Connect with Your{" "}
              <span className="text-red-oxide">Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base text-taupe mb-10"
            >
              A sophisticated platform for neighborhood communication where privacy meets community engagement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={() => router.push("/login")}
                className="w-full py-4 bg-red-oxide text-white rounded-2xl font-semibold text-base shadow-button active:scale-[0.98] transition-transform"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-4 bg-transparent border-2 border-red-oxide text-red-oxide rounded-2xl font-semibold text-base active:bg-red-oxide/5 transition-colors"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="bg-white/50 backdrop-blur rounded-2xl p-4 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-beige-medium flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-oxide" />
                  </div>
                  <h3 className="font-semibold text-deep-brown text-sm mb-1">
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
