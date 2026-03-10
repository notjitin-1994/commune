// User
export interface User {
  id: string;
  phone: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Map Flag
export interface Flag {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  category: 1 | 2 | 3;
  title: string;
  description?: string;
  status: 'active' | 'resolved' | 'archived';
  imageUrls?: string[];
  createdAt: string;
}

// Post
export interface Post {
  id: string;
  userId: string;
  flagId?: string; // Linked to a map flag for location context
  content: string;
  category: 1 | 2 | 3;
  imageUrls?: string[];
  isNews: boolean;
  createdAt: string;
  author?: User;
}

// Comment
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  author?: User;
}

// Meeting Room
export interface Room {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  adminIds: string[];
  isPrivate: boolean;
  maxParticipants: number;
  status: 'open' | 'closed';
  scheduledAt?: string;
  createdAt: string;
  participantCount?: number;
}

// Participant
export interface Participant {
  roomId: string;
  userId: string;
  role: 'admin' | 'speaker' | 'listener';
  isMuted: boolean;
  isHandRaised: boolean;
  joinedAt: string;
  user?: User;
}

// Message
export interface Message {
  id: string;
  roomId?: string;
  conversationId?: string;
  senderId: string;
  content: string;
  sentAt: string;
  sender?: User;
}

// Call Log
export interface CallLog {
  id: string;
  callerId: string;
  receiverId: string;
  callType: 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  status: 'completed' | 'missed' | 'declined';
  caller?: User;
  receiver?: User;
}

// Conversation
export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  participants?: User[];
  lastMessage?: Message;
}
