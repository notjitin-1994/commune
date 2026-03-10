'use client';

import { create } from 'zustand';
import { Room, Participant } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

interface MeetingState {
  rooms: Room[];
  currentRoom: Room | null;
  participants: Participant[];
  isMuted: boolean;
  isHandRaised: boolean;
  isLoading: boolean;
  
  // Actions
  loadRooms: () => void;
  createRoom: (room: Omit<Room, 'id' | 'createdAt' | 'participantCount'>) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (userId: string) => void;
  toggleMute: () => void;
  raiseHand: () => void;
  lowerHand: () => void;
  getRoomParticipants: (roomId: string) => Participant[];
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  rooms: [],
  currentRoom: null,
  participants: [],
  isMuted: true,
  isHandRaised: false,
  isLoading: false,

  loadRooms: () => {
    if (typeof window === 'undefined') return;
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    set({ rooms });
  },

  createRoom: (roomData) => {
    const newRoom: Room = {
      ...roomData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      participantCount: 0,
    };
    
    const rooms = [...get().rooms, newRoom];
    set({ rooms });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  },

  joinRoom: (roomId, userId) => {
    const room = get().rooms.find(r => r.id === roomId);
    if (!room) return;

    // Check if already in room
    const existingParticipant = get().participants.find(
      p => p.roomId === roomId && p.userId === userId
    );
    
    if (existingParticipant) {
      set({ currentRoom: room });
      return;
    }

    const newParticipant: Participant = {
      roomId,
      userId,
      role: room.creatorId === userId ? 'admin' : 'listener',
      isMuted: true,
      isHandRaised: false,
      joinedAt: new Date().toISOString(),
    };

    const participants = [...get().participants, newParticipant];
    
    // Update room participant count
    const rooms = get().rooms.map(r =>
      r.id === roomId 
        ? { ...r, participantCount: (r.participantCount || 0) + 1 }
        : r
    );

    set({ 
      currentRoom: room, 
      participants, 
      rooms,
      isMuted: true,
      isHandRaised: false,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  },

  leaveRoom: (userId) => {
    const { currentRoom, participants } = get();
    if (!currentRoom) return;

    const updatedParticipants = participants.filter(
      p => !(p.roomId === currentRoom.id && p.userId === userId)
    );

    // Update room participant count
    const rooms = get().rooms.map(r =>
      r.id === currentRoom.id 
        ? { ...r, participantCount: Math.max(0, (r.participantCount || 0) - 1) }
        : r
    );

    set({ 
      currentRoom: null, 
      participants: updatedParticipants, 
      rooms,
      isMuted: true,
      isHandRaised: false,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  },

  toggleMute: () => {
    set(state => ({ isMuted: !state.isMuted }));
  },

  raiseHand: () => {
    set({ isHandRaised: true });
  },

  lowerHand: () => {
    set({ isHandRaised: false });
  },

  getRoomParticipants: (roomId) => {
    return get().participants.filter(p => p.roomId === roomId);
  },
}));
