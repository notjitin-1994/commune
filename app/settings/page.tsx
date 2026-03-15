"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  LogOut,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  Info,
  Heart,
  Moon,
  Globe,
  ChevronLeft
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatDate } from "@/lib/utils/helpers";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-taupe uppercase tracking-wider mb-3 px-2">
        {title}
      </h3>
      <div className="bg-white rounded-2xl border border-beige-medium overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  showArrow?: boolean;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsItem({ icon, label, value, onClick, showArrow = true, danger = false, rightElement }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 hover:bg-beige-light active:bg-beige-medium transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-oxide/10 text-red-oxide' : 'bg-beige-medium text-red-oxide'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium text-sm ${danger ? 'text-red-oxide' : 'text-espresso'}`}>
          {label}
        </p>
        {value && (
          <p className="text-xs text-taupe mt-0.5">{value}</p>
        )}
      </div>
      {rightElement || (showArrow && <ChevronRight className="w-5 h-5 text-taupe" />)}
    </button>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <AppShell>
        <div className="min-h-screen bg-beige-light flex items-center justify-center">
          <p className="text-taupe">Loading profile...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        <header className="bg-white/95 backdrop-blur px-6 py-5 sticky top-0 z-10 border-b border-beige-medium">
          <h1 className="font-playfair text-3xl font-bold text-espresso">Settings</h1>
          <p className="text-taupe text-sm">Manage your profile and preferences</p>
        </header>

        <div className="px-4 pt-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 mb-6 relative overflow-hidden border border-beige-medium"
          >
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-red-oxide flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-playfair text-2xl font-bold text-espresso truncate">{user.name}</h2>
                  <p className="text-deep-brown text-sm flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-sage" />
                    {user.isAdmin ? "Community Admin" : "Community Member"}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full py-3 bg-beige-medium rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-deep-brown hover:bg-warm-sand transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          <SettingsSection title="Profile Information">
            <SettingsItem
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              value={user.name}
              showArrow={false}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              value={user.phone}
              showArrow={false}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={user.email || "Not provided"}
              showArrow={false}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Calendar className="w-5 h-5" />}
              label="Member Since"
              value={formatDate(user.createdAt)}
              showArrow={false}
            />
          </SettingsSection>

          <SettingsSection title="Preferences">
            <SettingsItem
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              value="Manage alerts and sounds"
              onClick={() => {}}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Moon className="w-5 h-5" />}
              label="Dark Mode"
              value="Always on"
              showArrow={false}
              rightElement={
                <div className="w-12 h-6 rounded-full bg-red-oxide relative">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                </div>
              }
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Globe className="w-5 h-5" />}
              label="Language"
              value="English (US)"
              onClick={() => {}}
            />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsItem
              icon={<Lock className="w-5 h-5" />}
              label="Privacy & Security"
              value="Change password and privacy settings"
              onClick={() => {}}
            />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help Center"
              value="Get help and view FAQs"
              onClick={() => {}}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Info className="w-5 h-5" />}
              label="About"
              value="Version 1.0.0"
              showArrow={false}
            />
          </SettingsSection>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full py-4 bg-red-oxide/10 text-red-oxide rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-oxide/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </motion.div>

          <p className="text-center text-xs text-taupe mt-6">
            Commune v1.0.0 • Made with <Heart className="w-3 h-3 inline mx-1 text-red-oxide" /> for communities
          </p>
        </div>
      </div>
    </AppShell>
  );
}
