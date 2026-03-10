"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/stores/authStore";

interface UseUserDataReturn {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  getUserByPhone: (phone: string) => User | null;
  getUserById: (id: string) => User | null;
  refreshUsers: () => void;
}

/**
 * Hook to access user data from localStorage
 * Useful for displaying user information across the app
 */
export function useUserData(): UseUserDataReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      // Load all users
      const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
      if (usersData) {
        setUsers(JSON.parse(usersData));
      }

      // Load current user
      const currentUserData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (currentUserData) {
        setCurrentUser(JSON.parse(currentUserData));
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();

    // Listen for storage changes (in case of multi-tab usage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USERS || e.key === STORAGE_KEYS.CURRENT_USER) {
        loadUsers();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUsers]);

  const getUserByPhone = useCallback(
    (phone: string): User | null => {
      return users.find((u) => u.phone === phone) || null;
    },
    [users]
  );

  const getUserById = useCallback(
    (id: string): User | null => {
      return users.find((u) => u.id === id) || null;
    },
    [users]
  );

  const refreshUsers = useCallback(() => {
    setIsLoading(true);
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    currentUser,
    isLoading,
    getUserByPhone,
    getUserById,
    refreshUsers,
  };
}

/**
 * Hook to get a specific user's data by ID
 */
export function useUserById(userId: string): User | null {
  const { getUserById } = useUserData();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUserById(userId));
  }, [userId, getUserById]);

  return user;
}

/**
 * Hook to format and display user name consistently
 */
export function useUserDisplayName(user: User | null): string {
  if (!user) return "Unknown User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.name || "Unknown User";
}

/**
 * Hook to get user initials for avatar display
 */
export function useUserInitials(user: User | null): string {
  if (!user) return "?";
  const first = user.firstName?.[0] || user.name?.[0] || "?";
  const last = user.lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
}
