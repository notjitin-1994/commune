"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, ArrowLeft, Phone, Video, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useMessageStore } from "@/lib/stores/messageStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { demoConversations, demoMessages } from "@/lib/data/seed";
import { Message, Conversation, User } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/utils/helpers";

interface ConversationWithParticipants extends Conversation {
  participants?: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { messages, conversations, loadData } = useMessageStore();
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Force seed data if missing
    if (typeof window !== 'undefined') {
      const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
      const storedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const currentUserId = user?.id;
      
      // Check if current user has any conversations
      const userHasConversations = currentUserId && storedConversations.some(
        (c: any) => c.participantIds?.includes(currentUserId)
      );
      
      // If user has no conversations, create demo conversations for them
      if (currentUserId && !userHasConversations) {
        console.log('Creating demo conversations for user:', currentUserId);
        
        // Create new conversations with current user replacing user-1
        const newConversations = [
          {
            id: 'conv-1',
            participantIds: [currentUserId, 'user-2'],
            lastMessageAt: new Date(Date.now() - 300000).toISOString(),
          },
          {
            id: 'conv-2',
            participantIds: [currentUserId, 'user-3'],
            lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'conv-3',
            participantIds: [currentUserId, 'user-4'],
            lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'conv-4',
            participantIds: [currentUserId, 'user-5'],
            lastMessageAt: new Date(Date.now() - 18000000).toISOString(),
          },
        ];
        
        // Update message sender IDs from user-1 to current user
        const newMessages = demoMessages.map((msg: any) => ({
          ...msg,
          senderId: msg.senderId === 'user-1' ? currentUserId : msg.senderId,
        }));
        
        localStorage.setItem('conversations', JSON.stringify(newConversations));
        localStorage.setItem('messages', JSON.stringify(newMessages));
        
        // Seed users if missing
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (storedUsers.length === 0) {
          const demoUsers = [
            { id: 'user-2', name: 'Sarah Chen', phone: '+0987654321', isAdmin: false, firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@realtypro.com', bio: 'Licensed Realtor with 10+ years experience' },
            { id: 'user-3', name: 'Mike Williams', phone: '+1122334455', isAdmin: true, firstName: 'Mike', lastName: 'Williams', email: 'mike.w@homefinders.com', bio: 'Property Manager | Commercial Specialist' },
            { id: 'user-4', name: 'Emma Davis', phone: '+5544332211', isAdmin: false, firstName: 'Emma', lastName: 'Davis', email: 'emma.davis@luxehomes.com', bio: 'Luxury Property Consultant' },
            { id: 'user-5', name: 'David Park', phone: '+6677889900', isAdmin: false, firstName: 'David', lastName: 'Park', email: 'david.park@gmail.com', bio: 'Local homeowner and community advocate' },
          ];
          localStorage.setItem('users', JSON.stringify(demoUsers));
          console.log('✅ Seeded users:', demoUsers.length);
        }
        
        console.log('✅ Created conversations for current user:', newConversations.length);
        console.log('✅ Created messages:', newMessages.length);
      } else if (storedMessages.length === 0) {
        // Fall back to default seeding if completely empty
        localStorage.setItem('messages', JSON.stringify(demoMessages));
        localStorage.setItem('conversations', JSON.stringify(demoConversations));
        console.log('✅ Seeded default demo data');
      }
    }
    
    loadData();
  }, [loadData, user]);

  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const getConversationsWithData = (): ConversationWithParticipants[] => {
    const users = getUsers();
    
    return conversations
      .filter(conv => user && conv.participantIds.includes(user.id))
      .map(conv => {
        const participants = conv.participantIds
          .map(id => users.find((u: User) => u.id === id))
          .filter(Boolean) as User[];
        
        const convMessages = messages.filter(m => m.conversationId === conv.id);
        const lastMessage = convMessages.sort((a, b) => 
          new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        )[0];
        
        // Calculate unread count (messages not from current user)
        const unreadCount = convMessages.filter(
          m => m.senderId !== user?.id && new Date(m.sentAt).getTime() > new Date(conv.lastMessageAt).getTime() - 86400000
        ).length;
        
        return { ...conv, participants, lastMessage, unreadCount };
      })
      .sort((a, b) => 
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
  };

  const getOtherParticipant = (conversation: ConversationWithParticipants): User | undefined => {
    if (!user) return undefined;
    return conversation.participants?.find(p => p.id !== user.id);
  };

  const handleOpenChat = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const filteredConversations = getConversationsWithData().filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherParticipant?.phone?.includes(searchQuery);
  });

  // Group conversations by date
  const groupConversationsByDate = (conversations: ConversationWithParticipants[]) => {
    const groups: { [key: string]: ConversationWithParticipants[] } = {};
    
    conversations.forEach(conv => {
      const date = new Date(conv.lastMessageAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      let key: string;
      if (diffDays === 0) {
        key = 'Today';
      } else if (diffDays === 1) {
        key = 'Yesterday';
      } else if (diffDays < 7) {
        key = date.toLocaleDateString('en-US', { weekday: 'long' });
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(conv);
    });
    
    return groups;
  };

  const groupedConversations = groupConversationsByDate(filteredConversations);

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        {/* Header */}
        <header className="mobile-header px-4 py-3 sticky top-0 z-10">
          <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="form-input pl-10"
            />
          </div>
        </header>

        {/* Conversations List */}
        <div className="px-4 py-4 pb-8">
          <AnimatePresence>
            {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <motion.div 
                key={dateLabel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-taupe uppercase tracking-wide mb-3 px-1">
                  {dateLabel}
                </h3>
                
                <div className="space-y-2">
                  {convs.map((conversation, index) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const isOnline = Math.random() > 0.5;
                    
                    return (
                      <motion.button
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleOpenChat(conversation.id)}
                        className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card active:scale-[0.99] transition-transform"
                      >
                        <div className="relative">
                          <UserAvatar 
                            name={otherParticipant?.name || "Unknown"} 
                            showStatus 
                            isOnline={isOnline}
                            size="lg"
                          />
                          {conversation.unreadCount && conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-oxide text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-deep-brown text-sm truncate">
                              {otherParticipant?.name || "Unknown"}
                            </h3>
                            {conversation.lastMessage && (
                              <span className={`text-xs flex-shrink-0 ${conversation.unreadCount ? 'text-red-oxide font-medium' : 'text-taupe'}`}>
                                {formatTime(conversation.lastMessage.sentAt)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 mt-0.5">
                            {conversation.lastMessage?.senderId === user?.id && (
                              <span className="text-xs text-taupe">You: </span>
                            )}
                            <p className={`text-sm truncate ${conversation.unreadCount ? 'text-deep-brown font-medium' : 'text-taupe'}`}>
                              {conversation.lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-taupe flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredConversations.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-beige-medium flex items-center justify-center">
                <Send className="w-10 h-10 text-taupe" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                No conversations yet
              </h3>
              <p className="text-taupe text-sm">
                Start messaging to see conversations here
              </p>
              
              {/* Debug Info */}
              <div className="mt-6 p-4 bg-red-50 rounded-xl text-left max-w-xs mx-auto">
                <p className="text-xs font-semibold text-red-600 mb-2">Debug Info:</p>
                <p className="text-xs text-red-500">Current User ID: {user?.id || 'Not logged in'}</p>
                <p className="text-xs text-red-500">Total Conversations: {conversations.length}</p>
                <p className="text-xs text-red-500">Total Messages: {messages.length}</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="mt-3 w-full py-2 bg-red-500 text-white text-xs rounded-lg"
                >
                  Clear & Reload
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
