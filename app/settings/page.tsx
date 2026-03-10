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
  Heart
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
      <h3 className="text-xs font-semibold text-taupe uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
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
}

function SettingsItem({ icon, label, value, onClick, showArrow = true, danger = false }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 hover:bg-beige-light/50 active:bg-beige-light transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-oxide/10 text-red-oxide' : 'bg-beige-medium text-deep-brown'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium text-sm ${danger ? 'text-red-oxide' : 'text-deep-brown'}`}>
          {label}
        </p>
        {value && (
          <p className="text-xs text-taupe mt-0.5">{value}</p>
        )}
      </div>
      {showArrow && (
        <ChevronRight className="w-5 h-5 text-taupe" />
      )}
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
      <div className="min-h-full bg-beige-light pb-8">
        {/* Header */}
        <header className="mobile-header px-4 py-3">
          <h1 className="font-playfair text-xl font-bold text-espresso">Settings</h1>
          <p className="text-xs text-taupe">Manage your profile and preferences</p>
        </header>

        {/* Profile Card */}
        <div className="px-4 pt-2 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-oxide rounded-3xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-playfair text-2xl font-bold truncate">{user.name}</h2>
                <p className="text-white/80 text-sm flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4" />
                  {user.isAdmin ? "Community Admin" : "Community Member"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full py-3 bg-white/20 backdrop-blur rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:bg-white/30 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </motion.div>
        </div>

        {/* Settings Content */}
        <div className="px-4 pb-28">
          {/* Profile Information */}
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

          {/* Preferences */}
          <SettingsSection title="Preferences">
            <SettingsItem
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              value="Manage alerts and sounds"
              onClick={() => {}}
            />
            <div className="h-px bg-beige-medium mx-4" />
            <SettingsItem
              icon={<Lock className="w-5 h-5" />}
              label="Privacy & Security"
              value="Change password and privacy settings"
              onClick={() => {}}
            />
          </SettingsSection>

          {/* Support */}
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

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={logout}
              className="w-full py-4 bg-red-oxide/10 text-red-oxide rounded-2xl font-semibold flex items-center justify-center gap-2 active:bg-red-oxide/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-xs text-taupe mt-6">
            Commune v1.0.0 • Made with <Heart className="w-3 h-3 inline mx-1 text-red-oxide" /> for communities
          </p>
        </div>
      </div>
    </AppShell>
  );
}
