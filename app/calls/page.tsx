"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Video, 
  Clock, 
  Plus, 
  X, 
  Delete,
  ChevronLeft,
  User
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CallLog, User as UserType } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/helpers";

interface CallLogWithUsers extends CallLog {
  caller?: UserType;
  receiver?: UserType;
  otherParty?: UserType;
}

// Modern compact dialer component
function CompactDialer({
  isOpen,
  onClose,
  onCall,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCall: (number: string, type: 'audio' | 'video') => void;
}) {
  const [number, setNumber] = useState("");

  const dialPad = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' },
  ];

  const handlePress = (key: string) => {
    if (number.length < 15) setNumber(prev => prev + key);
  };

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (number) {
      onCall(number, type);
      setNumber("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-md z-[100]"
          />

          {/* Compact Dialer Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header with close */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-sm font-medium text-taupe">New Call</span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-beige-light flex items-center justify-center active:bg-beige-medium transition-colors"
              >
                <X className="w-4 h-4 text-taupe" />
              </button>
            </div>

            {/* Number Display */}
            <div className="px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-mono font-semibold text-espresso tracking-wider">
                  {number || "Enter number"}
                </span>
              </div>
              {number && (
                <button
                  onClick={handleBackspace}
                  className="mt-2 px-3 py-1 text-xs text-taupe hover:text-red-oxide transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Compact Number Pad */}
            <div className="px-4 pb-3">
              <div className="grid grid-cols-3 gap-2">
                {dialPad.map((key) => (
                  <motion.button
                    key={key.num}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePress(key.num)}
                    className="h-14 rounded-2xl bg-beige-light/50 active:bg-beige-medium flex flex-col items-center justify-center transition-colors"
                  >
                    <span className="text-xl font-semibold text-espresso">{key.num}</span>
                    {key.sub && (
                      <span className="text-[9px] text-taupe font-medium tracking-wider">{key.sub}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Call Actions */}
            <div className="px-4 pb-4 pt-2 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCall('audio')}
                disabled={!number}
                className="flex-1 h-12 rounded-2xl bg-sage text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sage/25"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">Audio</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCall('video')}
                disabled={!number}
                className="flex-1 h-12 rounded-2xl bg-tan text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-tan/25"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CallsPage() {
  const [callLogs, setCallLogs] = useState<CallLogWithUsers[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');
  const [showDialer, setShowDialer] = useState(false);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('callLogs') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user;
    
    const logsWithUsers = logs.map((log: CallLog) => {
      const caller = users.find((u: UserType) => u.id === log.callerId);
      const receiver = users.find((u: UserType) => u.id === log.receiverId);
      const otherParty = log.callerId === currentUser?.id ? receiver : caller;
      
      return { ...log, caller, receiver, otherParty };
    });
    
    setCallLogs(logsWithUsers.sort((a: CallLog, b: CallLog) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    ));
  }, []);

  const getCallStatusVisual = (call: CallLogWithUsers) => {
    if (call.status === 'missed') {
      return {
        icon: <PhoneMissed className="w-4 h-4" />,
        color: 'text-red-oxide',
        bgColor: 'bg-red-oxide/10',
      };
    }
    if (call.direction === 'incoming') {
      return {
        icon: <PhoneIncoming className="w-4 h-4" />,
        color: 'text-sage',
        bgColor: 'bg-sage/10',
      };
    }
    return {
      icon: <PhoneOutgoing className="w-4 h-4" />,
      color: 'text-tan',
      bgColor: 'bg-tan/10',
    };
  };

  const filteredCalls = activeTab === 'missed' 
    ? callLogs.filter(call => call.status === 'missed')
    : callLogs;

  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const date = new Date(call.startedAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(call);
    return groups;
  }, {} as Record<string, CallLogWithUsers[]>);

  const handleCall = (number: string, type: 'audio' | 'video') => {
    console.log(`Calling ${number} via ${type}`);
  };

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        {/* Modern Header */}
        <header className="px-4 pt-4 pb-3 bg-beige-light/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-playfair text-2xl font-bold text-espresso">Calls</h1>
            
            {/* Edit/Options Button */}
            <button className="p-2 rounded-xl bg-beige-medium/50 text-taupe hover:bg-beige-medium transition-colors">
              <Delete className="w-5 h-5" />
            </button>
          </div>
          
          {/* Pill-style Segmented Tabs */}
          <div className="flex p-1 bg-beige-medium/40 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-white text-espresso shadow-sm'
                  : 'text-taupe hover:text-deep-brown'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('missed')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'missed'
                  ? 'bg-white text-red-oxide shadow-sm'
                  : 'text-taupe hover:text-deep-brown'
              }`}
            >
              Missed
            </button>
          </div>
        </header>

        {/* Call List */}
        <div className="px-4 py-2 pb-24">
          {Object.entries(groupedCalls).map(([date, calls]) => (
            <div key={date} className="mb-6">
              {/* Date Header */}
              <h3 className="text-xs font-semibold text-taupe/80 uppercase tracking-wider mb-3 px-1">
                {new Date(date).toDateString() === new Date().toDateString() 
                  ? 'Today' 
                  : new Date(date).toDateString() === new Date(Date.now() - 86400000).toDateString()
                  ? 'Yesterday'
                  : formatDate(date)}
              </h3>
              
              {/* Call Cards */}
              <div className="space-y-2">
                {calls.map((call, index) => {
                  const status = getCallStatusVisual(call);
                  const isMissed = call.status === 'missed';
                  
                  return (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.25 }}
                      className="group bg-white rounded-2xl p-3 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <UserAvatar 
                          name={call.otherParty?.name || "Unknown"} 
                          size="md"
                        />
                        {/* Status Indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${status.bgColor} flex items-center justify-center border-2 border-white`}>
                          <span className={status.color}>{status.icon}</span>
                        </div>
                      </div>

                      {/* Call Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${
                          isMissed ? 'text-red-oxide' : 'text-espresso'
                        }`}>
                          {call.otherParty?.name || "Unknown"}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${status.color}`}>
                            {call.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-taupe/30" />
                          <span className="text-xs text-taupe flex items-center gap-1">
                            {call.callType === 'video' ? (
                              <><Video className="w-3 h-3" /> Video</>
                            ) : (
                              <><Phone className="w-3 h-3" /> Audio</>
                            )}
                          </span>
                          {call.durationSeconds && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-taupe/30" />
                              <span className="text-xs text-taupe">
                                {formatDuration(call.durationSeconds)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Time & Actions */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-taupe/70 font-medium">
                          {formatTime(call.startedAt)}
                        </span>
                        
                        {/* Quick Actions */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-9 h-9 rounded-full bg-sage/10 text-sage flex items-center justify-center hover:bg-sage/20 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="w-9 h-9 rounded-full bg-tan/10 text-tan flex items-center justify-center hover:bg-tan/20 transition-colors">
                            <Video className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredCalls.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-beige-medium/50 flex items-center justify-center">
                <Phone className="w-10 h-10 text-taupe/50" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                No calls yet
              </h3>
              <p className="text-sm text-taupe max-w-[200px] mx-auto">
                {activeTab === 'missed' 
                  ? "You have no missed calls"
                  : "Your call history will appear here"
                }
              </p>
            </motion.div>
          )}
        </div>

        {/* Material Design 3 FAB - Bottom Right */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDialer(true)}
          className="fixed right-5 z-40 w-14 h-14 rounded-2xl bg-red-oxide text-white shadow-xl flex items-center justify-center"
          style={{ 
            bottom: 'calc(88px + env(safe-area-inset-bottom))',
            boxShadow: '0 4px 20px rgba(156, 61, 50, 0.35), 0 2px 8px rgba(156, 61, 50, 0.25)'
          }}
        >
          <Plus className="w-7 h-7" />
        </motion.button>

        {/* Compact Dialer Overlay */}
        <CompactDialer
          isOpen={showDialer}
          onClose={() => setShowDialer(false)}
          onCall={handleCall}
        />
      </div>
    </AppShell>
  );
}
