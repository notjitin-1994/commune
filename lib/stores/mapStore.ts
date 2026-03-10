'use client';

import { create } from 'zustand';
import { Flag } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

interface MapState {
  flags: Flag[];
  selectedFlag: Flag | null;
  filterCategory: number | null;
  isLoading: boolean;
  
  // Actions
  loadFlags: () => void;
  addFlag: (flag: Omit<Flag, 'id' | 'createdAt'>) => void;
  updateFlag: (id: string, data: Partial<Flag>) => void;
  deleteFlag: (id: string) => void;
  setFilter: (category: number | null) => void;
  selectFlag: (flag: Flag | null) => void;
  getFilteredFlags: () => Flag[];
}

export const useMapStore = create<MapState>((set, get) => ({
  flags: [],
  selectedFlag: null,
  filterCategory: null,
  isLoading: false,

  loadFlags: () => {
    if (typeof window === 'undefined') return;
    const flags = JSON.parse(localStorage.getItem('flags') || '[]');
    set({ flags });
  },

  addFlag: (flagData) => {
    const newFlag: Flag = {
      ...flagData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    const flags = [...get().flags, newFlag];
    set({ flags });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('flags', JSON.stringify(flags));
    }
  },

  updateFlag: (id, data) => {
    const flags = get().flags.map(flag =>
      flag.id === id ? { ...flag, ...data } : flag
    );
    set({ flags });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('flags', JSON.stringify(flags));
    }
  },

  deleteFlag: (id) => {
    const flags = get().flags.filter(flag => flag.id !== id);
    set({ flags, selectedFlag: null });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('flags', JSON.stringify(flags));
    }
  },

  setFilter: (category) => {
    set({ filterCategory: category });
  },

  selectFlag: (flag) => {
    set({ selectedFlag: flag });
  },

  getFilteredFlags: () => {
    const { flags, filterCategory } = get();
    if (!filterCategory) return flags;
    return flags.filter(flag => flag.category === filterCategory);
  },
}));
