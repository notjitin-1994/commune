"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, Video, MoreVertical, Image, Camera, Paperclip, Mic, Check, CheckCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useMessageStore } from "@/lib/stores/messageStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Message, User } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/utils/helpers";

interface MessageWithSender extends Message {
  sender?: User;
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;
  
  const { messages, conversations, loadData, sendMessage } = useMessageStore();
  const { user } = useAuthStore();
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll to bottom on load and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationId]);

  // Simulate typing indicator randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const getConversation = () => {
    return conversations.find(c => c.id === conversationId);
  };

  const getOtherParticipant = (): User | undefined => {
    const conversation = getConversation();
    if (!conversation || !user) return undefined;
    const users = getUsers();
    const otherId = conversation.participantIds.find(id => id !== user.id);
    return users.find((u: User) => u.id === otherId);
  };

  const getMessagesWithSenders = (): MessageWithSender[] => {
    const users = getUsers();
    const convMessages = messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    
    return convMessages.map((msg, index, arr) => {
      const isLastFromMe = msg.senderId === user?.id && 
        (index === arr.length - 1 || arr[index + 1].senderId !== user?.id);
      
      return {
        ...msg,
        sender: users.find((u: User) => u.id === msg.senderId),
        status: isLastFromMe ? 'read' : msg.senderId === user?.id ? 'delivered' : undefined,
      };
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return;
    
    sendMessage({
      conversationId,
      senderId: user.id,
      content: newMessage,
    });
    
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    router.push('/messages');
  };

  const handleCall = (type: 'audio' | 'video') => {
    // In a real app, this would initiate a call
    console.log(`Starting ${type} call with`, getOtherParticipant()?.name);
  };

  // Group messages by date
  const groupMessagesByDate = (messages: MessageWithSender[]) => {
    const groups: { [key: string]: MessageWithSender[] } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.sentAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      let key: string;
      if (diffDays === 0) {
        key = 'Today';
      } else if (diffDays === 1) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    
    return groups;
  };

  const otherParticipant = getOtherParticipant();
  const conversationMessages = getMessagesWithSenders();
  const groupedMessages = groupMessagesByDate(conversationMessages);

  if (!getConversation()) {
    return (
      <AppShell>
        <div className="fixed inset-x-0 top-0 flex flex-col items-center justify-center bg-beige-light" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <div className="text-center">
            <p className="text-taupe">Conversation not found</p>
            <button onClick={handleBack} className="mt-4 text-red-oxide font-medium">
              Go back
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="fixed inset-x-0 top-0 lg:static lg:h-screen flex flex-col bg-beige-light" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
        {/* Chat Header */}
        <header className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-beige-light active:bg-beige-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-taupe" />
          </button>
          
          <UserAvatar 
            name={otherParticipant?.name || "Unknown"} 
            showStatus 
            isOnline={true}
            size="md"
          />
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-deep-brown text-sm truncate">
              {otherParticipant?.name || "Unknown"}
            </h2>
            <p className="text-xs text-sage flex items-center gap-1">
              {isTyping ? (
                <span className="italic text-tan">typing...</span>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                  Online
                </>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleCall('audio')}
              className="p-2.5 rounded-full hover:bg-beige-light active:bg-beige-medium transition-colors"
            >
              <Phone className="w-5 h-5 text-taupe" />
            </button>
            <button 
              onClick={() => handleCall('video')}
              className="p-2.5 rounded-full hover:bg-beige-light active:bg-beige-medium transition-colors"
            >
              <Video className="w-5 h-5 text-taupe" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-beige-light active:bg-beige-medium transition-colors">
              <MoreVertical className="w-5 h-5 text-taupe" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Contact Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <UserAvatar 
                name={otherParticipant?.name || "Unknown"} 
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-deep-brown">
                  {otherParticipant?.name || "Unknown"}
                </h3>
                <p className="text-xs text-taupe">
                  {otherParticipant?.bio || 'Real Estate Professional'}
                </p>
              </div>
            </div>
            {otherParticipant?.email && (
              <p className="text-xs text-taupe mt-2">
                {otherParticipant.email}
              </p>
            )}
          </motion.div>

          {/* Messages */}
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel}>
                {/* Date Divider */}
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xs text-taupe bg-beige-medium/50 px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {msgs.map((message, index) => {
                      const isOwn = message.senderId === user?.id;
                      const showAvatar = !isOwn && (index === 0 || msgs[index - 1].senderId !== message.senderId);
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}
                        >
                          {/* Avatar for received messages */}
                          {!isOwn && showAvatar && (
                            <div className="flex-shrink-0 mb-1">
                              <UserAvatar 
                                name={message.sender?.name || "Unknown"} 
                                size="sm"
                              />
                            </div>
                          )}
                          {!isOwn && !showAvatar && <div className="w-8" />}

                          {/* Message Bubble */}
                          <div 
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              isOwn 
                                ? 'bg-red-oxide text-white rounded-br-md' 
                                : 'bg-white text-deep-brown rounded-bl-md shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-taupe'}`}>
                              <span className="text-xs">
                                {formatTime(message.sentAt)}
                              </span>
                              {isOwn && message.status && (
                                <span className="ml-1">
                                  {message.status === 'read' ? (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-end gap-2"
                >
                  <UserAvatar 
                    name={otherParticipant?.name || "Unknown"} 
                    size="sm"
                  />
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-taupe/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-taupe/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-taupe/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-beige-medium px-4 py-3" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}>
          {/* Attachment Menu */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-4 py-3 mb-2">
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
                      <Image className="w-5 h-5 text-sage" />
                    </div>
                    <span className="text-xs text-taupe">Gallery</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-tan/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-tan" />
                    </div>
                    <span className="text-xs text-taupe">Camera</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-red-oxide/10 flex items-center justify-center">
                      <Paperclip className="w-5 h-5 text-red-oxide" />
                    </div>
                    <span className="text-xs text-taupe">File</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Row */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`p-2.5 rounded-full transition-colors ${showAttachmentMenu ? 'bg-red-oxide text-white' : 'hover:bg-beige-light text-taupe'}`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full h-11 px-4 pr-10 rounded-full bg-beige-light border-none focus:outline-none focus:ring-2 focus:ring-red-oxide/20 text-deep-brown text-sm"
              />
              {newMessage.length > 0 && (
                <button 
                  onClick={() => setNewMessage('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-taupe/30 flex items-center justify-center"
                >
                  <span className="text-white text-xs">×</span>
                </button>
              )}
            </div>

            {newMessage.trim() ? (
              <button 
                onClick={handleSendMessage}
                className="w-11 h-11 rounded-full bg-red-oxide text-white flex items-center justify-center active:scale-95 transition-transform shadow-button"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button className="w-11 h-11 rounded-full bg-beige-light text-taupe flex items-center justify-center active:scale-95 transition-transform">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
