"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, Calendar, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User as UserType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils/helpers";
import { format } from "date-fns";

interface UserProfileProps {
  user: UserType;
  editable?: boolean;
  className?: string;
}

export function UserProfile({ user, editable = false, className }: UserProfileProps) {
  const { updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    bio: user.bio || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    updateProfile({
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
      bio: editedUser.bio,
    });
    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = user.firstName?.[0] || user.name?.[0] || "?";
    const last = user.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || "Unknown User";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("bg-white rounded-2xl shadow-card overflow-hidden", className)}
    >
      {/* Header / Banner */}
      <div className="h-24 bg-red-oxide" />

      {/* Avatar & Basic Info */}
      <div className="px-6 pb-6">
        <div className="relative flex justify-between items-start -mt-12 mb-4">
          {/* Avatar */}
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={getDisplayName()}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-beige-medium flex items-center justify-center">
                <span className="text-2xl font-playfair font-bold text-espresso">
                  {getInitials()}
                </span>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {editable && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-14"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Name & Phone */}
        <div className="mb-6">
          <h2 className="font-playfair text-2xl font-bold text-espresso">
            {getDisplayName()}
          </h2>
          <p className="text-taupe flex items-center gap-2 mt-1">
            <Phone className="w-4 h-4" />
            {user.phone}
          </p>
        </div>

        {/* Edit Form or Display */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-deep-brown mb-1">
                  First Name
                </label>
                <Input
                  value={editedUser.firstName}
                  onChange={(e) =>
                    setEditedUser((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-brown mb-1">
                  Last Name
                </label>
                <Input
                  value={editedUser.lastName}
                  onChange={(e) =>
                    setEditedUser((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                <Input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email address"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-1">
                Bio
              </label>
              <Textarea
                value={editedUser.bio}
                onChange={(e) =>
                  setEditedUser((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell us about yourself"
                maxLength={200}
                className="min-h-[80px] resize-none"
              />
              <p className="text-xs text-taupe text-right mt-1">
                {editedUser.bio.length}/200
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Email */}
            {user.email && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-beige-light flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-taupe" />
                </div>
                <div>
                  <p className="text-xs text-taupe uppercase tracking-wide">Email</p>
                  <p className="text-deep-brown">{user.email}</p>
                </div>
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-beige-light flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-taupe" />
                </div>
                <div>
                  <p className="text-xs text-taupe uppercase tracking-wide">Bio</p>
                  <p className="text-deep-brown text-sm leading-relaxed">{user.bio}</p>
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-beige-light flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-taupe" />
              </div>
              <div>
                <p className="text-xs text-taupe uppercase tracking-wide">Member Since</p>
                <p className="text-deep-brown">
                  {format(new Date(user.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Compact version for sidebars/dropdowns
export function UserProfileCompact({ user, className }: { user: UserType; className?: string }) {
  const getInitials = () => {
    const first = user.firstName?.[0] || user.name?.[0] || "?";
    const last = user.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || "Unknown User";
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-white shadow-card", className)}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={getDisplayName()}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-beige-medium flex items-center justify-center">
          <span className="text-sm font-playfair font-bold text-espresso">
            {getInitials()}
          </span>
        </div>
      )}
      <div className="min-w-0">
        <p className="font-medium text-deep-brown truncate">{getDisplayName()}</p>
        <p className="text-xs text-taupe truncate">{user.phone}</p>
      </div>
    </div>
  );
}

// Skeleton loader
export function UserProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="h-24 bg-beige-medium" />
      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4">
          <div className="w-24 h-24 rounded-2xl border-4 border-white bg-beige-medium" />
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-beige-medium rounded w-1/2" />
          <div className="h-4 bg-beige-medium rounded w-1/3" />
          <div className="h-20 bg-beige-medium rounded mt-4" />
        </div>
      </div>
    </div>
  );
}
