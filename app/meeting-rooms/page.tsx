"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Mic, MicOff, PhoneOff, Hand, Crown, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useMeetingStore } from "@/lib/stores/meetingStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Room, User } from "@/lib/types";
import { formatDate } from "@/lib/utils/helpers";

interface RoomWithCreator extends Room {
  creator?: User;
}

// Bottom Sheet Component
function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-warm-sand/50 rounded-full" />
              <h2 className="font-playfair text-lg font-bold text-espresso mt-3">{title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function MeetingRoomsPage() {
  const { 
    rooms, 
    currentRoom, 
    isMuted, 
    isHandRaised,
    loadRooms, 
    createRoom, 
    joinRoom, 
    leaveRoom, 
    toggleMute, 
    raiseHand, 
    lowerHand 
  } = useMeetingStore();
  const { user } = useAuthStore();
  
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    description: "",
    maxParticipants: 20,
  });

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const getRoomsWithCreators = (): RoomWithCreator[] => {
    const users = getUsers();
    return rooms.map(room => ({
      ...room,
      creator: users.find((u: User) => u.id === room.creatorId),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const handleCreateRoom = () => {
    if (!user || !newRoom.title.trim()) return;
    
    createRoom({
      title: newRoom.title,
      description: newRoom.description,
      creatorId: user.id,
      adminIds: [user.id],
      isPrivate: false,
      maxParticipants: newRoom.maxParticipants,
      status: 'open',
    });
    
    setNewRoom({ title: "", description: "", maxParticipants: 20 });
    setIsCreateSheetOpen(false);
  };

  const handleJoinRoom = (roomId: string) => {
    if (!user) return;
    joinRoom(roomId, user.id);
    setIsInRoom(true);
  };

  const handleLeaveRoom = () => {
    if (!user) return;
    leaveRoom(user.id);
    setIsInRoom(false);
  };

  const handleToggleHand = () => {
    if (isHandRaised) {
      lowerHand();
    } else {
      raiseHand();
    }
  };

  // Active Room View
  if (isInRoom && currentRoom) {
    return (
      <AppShell>
        <div className="h-[calc(100vh-64px)] lg:h-screen bg-espresso flex flex-col">
          {/* Header */}
          <header className="px-4 py-3 flex items-center justify-between bg-deep-brown/50 backdrop-blur flex-shrink-0">
            <button 
              onClick={handleLeaveRoom}
              className="lg:hidden p-2 -ml-2 rounded-xl active:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-beige-light" />
            </button>
            <div className="flex-1 min-w-0 mx-2">
              <h1 className="text-beige-light font-playfair text-lg truncate">{currentRoom.title}</h1>
              <p className="text-taupe text-xs truncate">{currentRoom.description}</p>
            </div>
            <div className="flex items-center gap-2 text-tan">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
              <span className="text-sm">{currentRoom.participantCount}</span>
            </div>
          </header>

          {/* Participants Grid - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Local User */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`aspect-square rounded-2xl bg-beige-medium/20 flex flex-col items-center justify-center relative border-2 ${
                  isMuted ? 'border-red-oxide' : 'border-transparent'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-tan flex items-center justify-center text-xl text-deep-brown font-semibold">
                  {user?.name?.[0] || "?"}
                </div>
                <span className="mt-2 text-beige-light text-xs">You</span>
                {isMuted && (
                  <span className="absolute top-2 right-2 text-red-oxide">
                    <MicOff className="w-4 h-4" />
                  </span>
                )}
                {isHandRaised && (
                  <span className="absolute top-2 left-2 text-tan">
                    <Hand className="w-4 h-4" />
                  </span>
                )}
              </motion.div>

              {/* Other Participants */}
              {Array.from({ length: (currentRoom.participantCount || 1) - 1 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-2xl bg-beige-medium/20 flex flex-col items-center justify-center relative border-2 border-transparent"
                >
                  <div className="w-16 h-16 rounded-full bg-warm-sand flex items-center justify-center text-xl text-deep-brown font-semibold">
                    {String.fromCharCode(65 + (i % 26))}
                  </div>
                  <span className="mt-2 text-beige-light text-xs">User {i + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Controls - Fixed at bottom, within the call screen */}
          <div className="flex-shrink-0 px-4 py-4 bg-deep-brown/80 backdrop-blur-md border-t border-white/10">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isMuted ? 'bg-red-oxide text-white' : 'bg-beige-light text-deep-brown'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={handleToggleHand}
                className={`w-14 h-14 rounded-full bg-beige-light text-deep-brown flex items-center justify-center transition-all active:scale-95 ${
                  isHandRaised ? 'ring-4 ring-tan' : ''
                }`}
              >
                <Hand className="w-6 h-6" />
              </button>

              <button
                onClick={handleLeaveRoom}
                className="w-14 h-14 rounded-full bg-red-oxide text-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Lobby View
  return (
    <AppShell>
      <div className="min-h-screen bg-beige-light">
        {/* Header */}
        <header className="mobile-header px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-xl font-bold text-espresso">Meeting Rooms</h1>
              <p className="text-xs text-taupe">Join audio discussions with your community</p>
            </div>
            
            <button
              onClick={() => setIsCreateSheetOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-oxide text-white rounded-xl font-medium text-sm active:scale-95 transition-transform shadow-button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </header>

        {/* Rooms List */}
        <div className="px-4 py-4 pb-28">
          <motion.div 
            className="space-y-3"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.05 } }
            }}
          >
            <AnimatePresence>
              {getRoomsWithCreators().map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-white rounded-2xl p-4 shadow-card active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <h3 className="font-semibold text-deep-brown text-base truncate">{room.title}</h3>
                      <p className="text-sm text-taupe truncate">{room.description}</p>
                    </div>
                    {room.creatorId === user?.id && (
                      <Crown className="w-5 h-5 text-tan flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-taupe">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{room.participantCount} / {room.maxParticipants}</span>
                      </div>
                      <span>by {room.creator?.name || "Unknown"}</span>
                    </div>
                    <button 
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.status === 'closed' || (room.participantCount || 0) >= room.maxParticipants}
                      className="px-4 py-2 bg-red-oxide text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      Join
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {getRoomsWithCreators().length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-beige-medium flex items-center justify-center">
                <Users className="w-10 h-10 text-taupe" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                No rooms yet
              </h3>
              <p className="text-taupe text-sm mb-4">
                Create a room to start a conversation
              </p>
              <button
                onClick={() => setIsCreateSheetOpen(true)}
                className="px-6 py-3 bg-red-oxide text-white rounded-xl font-medium active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Room
              </button>
            </div>
          )}
        </div>

        {/* Create Room Bottom Sheet */}
        <BottomSheet
          isOpen={isCreateSheetOpen}
          onClose={() => setIsCreateSheetOpen(false)}
          title="Create New Room"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Room Title</label>
              <input
                type="text"
                value={newRoom.title}
                onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                placeholder="What's the topic?"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">Description</label>
              <textarea
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Tell people what this room is about..."
                className="form-input form-textarea"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-brown mb-2">
                Max Participants: {newRoom.maxParticipants}
              </label>
              <input
                type="range"
                min={2}
                max={50}
                value={newRoom.maxParticipants}
                onChange={(e) => setNewRoom({ ...newRoom, maxParticipants: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-taupe mt-1">
                <span>2</span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCreateRoom}
                disabled={!newRoom.title.trim()}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </button>
              <button onClick={() => setIsCreateSheetOpen(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </AppShell>
  );
}
