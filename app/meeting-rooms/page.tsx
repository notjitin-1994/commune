"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Mic, MicOff, PhoneOff, Hand, Crown, ArrowLeft, Headphones, Calendar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useMeetingStore } from "@/lib/stores/meetingStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Room, User } from "@/lib/types";
import { formatDate } from "@/lib/utils/helpers";

interface RoomWithCreator extends Room {
  creator?: User;
}

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
            className="fixed inset-0 bg-deep-brown/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col border-t border-beige-medium"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-beige-medium rounded-full" />
              <h2 className="font-playfair text-xl font-bold text-espresso mt-4">{title}</h2>
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
        <div className="fixed inset-x-0 top-0 lg:static lg:h-screen flex flex-col bg-beige-light" style={{ bottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
          <header className="bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-beige-medium">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleLeaveRoom}
              className="w-10 h-10 rounded-xl bg-beige-medium flex items-center justify-center text-deep-brown"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex-1 min-w-0 mx-3 text-center">
              <h1 className="font-playfair text-lg font-bold text-espresso truncate">{currentRoom.title}</h1>
              <p className="text-xs text-taupe truncate">{currentRoom.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-red-oxide">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
              <span className="text-sm font-medium">{currentRoom.participantCount}</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`aspect-square rounded-2xl bg-white flex flex-col items-center justify-center relative border-2 ${
                  isMuted ? 'border-red-oxide' : 'border-beige-medium'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-red-oxide flex items-center justify-center text-xl text-white font-semibold">
                  {user?.name?.[0] || "?"}
                </div>
                <span className="mt-2 text-deep-brown text-xs">You</span>
                
                {isMuted && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-oxide flex items-center justify-center">
                    <MicOff className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {isHandRaised && (
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
                    <Hand className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>

              {Array.from({ length: (currentRoom.participantCount || 1) - 1 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-2xl bg-white flex flex-col items-center justify-center relative border-2 border-beige-medium"
                >
                  <div className="w-16 h-16 rounded-full bg-beige-medium flex items-center justify-center text-xl text-espresso font-semibold">
                    {String.fromCharCode(65 + (i % 26))}
                  </div>
                  <span className="mt-2 text-taupe text-xs">User {i + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white border-t border-beige-medium px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isMuted ? 'bg-red-oxide text-white' : 'bg-beige-medium text-deep-brown'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleHand}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isHandRaised ? 'bg-terracotta text-white' : 'bg-beige-medium text-deep-brown'
                }`}
              >
                <Hand className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLeaveRoom}
                className="w-14 h-14 rounded-2xl bg-red-oxide text-white flex items-center justify-center"
              >
                <PhoneOff className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Lobby View
  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        <header className="bg-white/95 backdrop-blur px-6 py-5 sticky top-0 z-10 border-b border-beige-medium">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-espresso">Meeting Rooms</h1>
              <p className="text-taupe text-sm">Join audio discussions with your community</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateSheetOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-red-oxide text-white rounded-xl font-medium text-sm shadow-button"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create</span>
            </motion.button>
          </div>
        </header>

        <div className="px-4 py-4 pb-8">
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
                  className="bg-white rounded-2xl p-5 border border-beige-medium shadow-card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-espresso text-lg">{room.title}</h3>
                        {room.creatorId === user?.id && (
                          <Crown className="w-5 h-5 text-terracotta" />
                        )}
                      </div>
                      <p className="text-sm text-taupe mt-1">{room.description}</p>
                    </div>
                    
                    <div className="w-12 h-12 rounded-2xl bg-beige-medium flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-red-oxide" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-taupe">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{room.participantCount} / {room.maxParticipants}</span>
                      </div>
                      <span className="text-warm-sand">•</span>
                      <span>by {room.creator?.name || "Unknown"}</span>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.status === 'closed' || (room.participantCount || 0) >= room.maxParticipants}
                      className="px-5 py-2.5 bg-red-oxide text-white rounded-xl text-sm font-medium disabled:opacity-50 shadow-button"
                    >
                      Join
                    </motion.button>
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
              <p className="text-taupe text-sm mb-6">
                Create a room to start a conversation
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateSheetOpen(true)}
                className="px-6 py-3 bg-red-oxide text-white rounded-xl font-medium shadow-button"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Room
              </motion.button>
            </div>
          )}
        </div>

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
                className="form-textarea"
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
                className="w-full accent-red-oxide"
              />
              <div className="flex justify-between text-xs text-taupe mt-1">
                <span>2</span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateRoom}
                disabled={!newRoom.title.trim()}
                className="w-full py-4 bg-red-oxide text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-button"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </motion.button>
              <button onClick={() => setIsCreateSheetOpen(false)} className="w-full py-4 bg-beige-medium text-deep-brown rounded-xl font-semibold hover:bg-warm-sand transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </AppShell>
  );
}
