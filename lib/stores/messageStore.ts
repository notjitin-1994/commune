'use client';

import { create } from 'zustand';
import { Message, Conversation } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  isLoading: boolean;
  
  // Actions
  loadData: () => void;
  sendMessage: (message: Omit<Message, 'id' | 'sentAt'>) => void;
  getMessagesForConversation: (conversationId: string) => Message[];
  getOrCreateConversation: (participantIds: string[]) => string;
  getConversationsForUser: (userId: string) => Conversation[];
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  conversations: [],
  isLoading: false,

  loadData: () => {
    if (typeof window === 'undefined') return;
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    set({ messages, conversations });
  },

  sendMessage: (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      sentAt: new Date().toISOString(),
    };
    
    const messages = [...get().messages, newMessage];
    set({ messages });
    
    // Update conversation last message time
    if (messageData.conversationId) {
      const conversations = get().conversations.map(conv =>
        conv.id === messageData.conversationId
          ? { ...conv, lastMessageAt: newMessage.sentAt }
          : conv
      );
      set({ conversations });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('conversations', JSON.stringify(conversations));
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  },

  getMessagesForConversation: (conversationId) => {
    return get()
      .messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  },

  getOrCreateConversation: (participantIds) => {
    // Sort IDs to ensure consistent lookup
    const sortedIds = [...participantIds].sort();
    
    // Check if conversation exists
    const existing = get().conversations.find(conv => {
      const convSortedIds = [...conv.participantIds].sort();
      return JSON.stringify(convSortedIds) === JSON.stringify(sortedIds);
    });
    
    if (existing) {
      return existing.id;
    }
    
    // Create new conversation
    const newConversation: Conversation = {
      id: generateId(),
      participantIds: sortedIds,
      lastMessageAt: new Date().toISOString(),
    };
    
    const conversations = [...get().conversations, newConversation];
    set({ conversations });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
    
    return newConversation.id;
  },

  getConversationsForUser: (userId) => {
    return get()
      .conversations
      .filter(conv => conv.participantIds.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },
}));
