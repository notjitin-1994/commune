'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

// User details type for the registration flow
export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  signup: (phone: string, userDetails: UserDetails) => Promise<boolean>;
  checkUserExists: (phone: string) => boolean;
  getUserFromStorage: (phone: string) => User | null;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'commune_users',
  CURRENT_USER: 'commune_current_user',
  AUTH_STORAGE: 'auth-storage',
} as const;

// Helper functions for localStorage
const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUserToStorage = (user: User): void => {
  if (typeof window === 'undefined') return;
  const users = getUsersFromStorage();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = { ...user, updatedAt: new Date().toISOString() };
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

const clearCurrentUserFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Check if user exists by phone number
      checkUserExists: (phone: string): boolean => {
        const users = getUsersFromStorage();
        return users.some((u) => u.phone === phone);
      },

      // Get user from storage by phone
      getUserFromStorage: (phone: string): User | null => {
        const users = getUsersFromStorage();
        return users.find((u) => u.phone === phone) || null;
      },

      login: async (phone: string, otp: string) => {
        set({ isLoading: true });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo: any 6-digit OTP works
        if (otp.length === 6 && /^\d+$/.test(otp)) {
          // Check if user exists in localStorage
          const existingUser = get().getUserFromStorage(phone);
          
          if (existingUser) {
            // Update last login
            const updatedUser = { 
              ...existingUser, 
              updatedAt: new Date().toISOString() 
            };
            saveUserToStorage(updatedUser);
            set({ user: updatedUser, isAuthenticated: true, isLoading: false });
            return true;
          }
          
          // New user - will go to signup flow
          set({ isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      signup: async (phone: string, userDetails: UserDetails) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const existingUser = get().getUserFromStorage(phone);
        
        if (existingUser && existingUser.firstName) {
          // User already has a complete profile
          set({ isLoading: false });
          return false;
        }
        
        const fullName = `${userDetails.firstName} ${userDetails.lastName}`.trim();
        
        const newUser: User = {
          id: existingUser?.id || generateId(),
          phone,
          name: fullName,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          bio: userDetails.bio,
          isAdmin: false,
          createdAt: existingUser?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        saveUserToStorage(newUser);
        
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        clearCurrentUserFromStorage();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = { 
          ...user, 
          ...data,
          // Update name if firstName or lastName changed
          name: data.firstName || data.lastName 
            ? `${data.firstName || user.firstName} ${data.lastName || user.lastName}`.trim()
            : user.name,
          updatedAt: new Date().toISOString()
        };
        
        set({ user: updatedUser });
        saveUserToStorage(updatedUser);
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORAGE,
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Export storage keys for use in other components
export { STORAGE_KEYS };
