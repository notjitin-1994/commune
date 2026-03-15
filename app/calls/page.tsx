"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Video, 
  Plus, 
  X, 
  Delete,
  Clock3,
  ChevronRight
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CallLog, User as UserType } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/helpers";

interface CallLogWithUsers extends CallLog {
  caller?: UserType;
  receiver?: UserType;
  otherParty?: UserType;
}

function ModernDialer({
  isOpen,
  onClose,
  onCall,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCall: (number: string, type: 'audio' | 'video') => void;
}) {
  const [number, setNumber] = useState("");
  const [recentNumbers, setRecentNumbers] = useState<string[]>([]);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('recentDialedNumbers');
    if (stored) {
      setRecentNumbers(JSON.parse(stored));
    }
  }, []);

  const saveToRecent = (num: string) => {
    setRecentNumbers(prev => {
      const filtered = prev.filter(n => n !== num);
      const updated = [num, ...filtered].slice(0, 5);
      localStorage.setItem('recentDialedNumbers', JSON.stringify(updated));
      return updated;
    });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

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
    if (number.replace(/\D/g, '').length < 15) {
      setNumber(prev => prev + key);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1));
    if (navigator.vibrate) navigator.vibrate(5);
  };

  const handleLongPressStart = () => {
    longPressTimer.current = setInterval(() => {
      setNumber(prev => prev.slice(0, -1));
      if (navigator.vibrate) navigator.vibrate(5);
    }, 100);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearInterval(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (number.replace(/\D/g, '').length >= 7) {
      saveToRecent(number);
      onCall(number, type);
      setNumber("");
      onClose();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '');
      if (cleaned.length > 0 && cleaned.length <= 15) {
        setNumber(cleaned);
      }
    } catch (err) {
      console.log('Paste failed');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handlePress(e.key);
      if (e.key === '*') handlePress('*');
      if (e.key === '#') handlePress('#');
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Enter' && number) handleCall('audio');
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, number]);

  const displayNumber = formatPhoneNumber(number);
  const isValidNumber = number.replace(/\D/g, '').length >= 7;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-beige-light/90 z-[100]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[32px] shadow-2xl overflow-hidden border-t border-beige-medium"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-beige-medium rounded-full" />
            </div>

            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-base font-semibold text-espresso">New Call</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-beige-medium flex items-center justify-center text-taupe"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="px-6 py-4 bg-beige-medium/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <input
                    type="tel"
                    value={displayNumber || "Enter a number"}
                    readOnly
                    className={`w-full bg-transparent text-3xl font-semibold tracking-wider outline-none ${
                      number ? "text-espresso" : "text-taupe"
                    }`}
                    onClick={handlePaste}
                  />
                  {number && (
                    <p className="text-xs text-taupe mt-1">
                      {number.replace(/\D/g, '').length} digits
                    </p>
                  )}
                </div>

                {number && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleBackspace}
                    onMouseDown={handleLongPressStart}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={handleLongPressStart}
                    onTouchEnd={handleLongPressEnd}
                    className="w-12 h-12 rounded-xl bg-beige-medium flex items-center justify-center text-taupe"
                  >
                    <Delete className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {recentNumbers.length > 0 && !number && (
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {recentNumbers.map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNumber(num)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-beige-medium rounded-full text-sm text-deep-brown border border-beige-medium"
                    >
                      <Clock3 className="w-3.5 h-3.5 text-taupe" />
                      {formatPhoneNumber(num)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-w-sm mx-auto">
                {dialPad.map((key) => (
                  <motion.button
                    key={key.num}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePress(key.num)}
                    className="h-[72px] rounded-2xl bg-beige-medium flex flex-col items-center justify-center gap-0.5 active:bg-beige-medium transition-colors"
                  >
                    <span className="text-[28px] font-semibold text-espresso">
                      {key.num}
                    </span>
                    {key.sub && (
                      <span className="text-[11px] font-medium text-taupe tracking-wider">
                        {key.sub}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex gap-4 max-w-sm mx-auto">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCall('audio')}
                disabled={!isValidNumber}
                className="flex-1 h-14 rounded-2xl bg-sage text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-sage/20"
              >
                <Phone className="w-5 h-5" />
                <span>Audio</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCall('video')}
                disabled={!isValidNumber}
                className="flex-1 h-14 rounded-2xl bg-red-oxide text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-red-oxide/20"
              >
                <Video className="w-5 h-5" />
                <span>Video</span>
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
        color: 'text-error',
        bgColor: 'bg-error/10',
      };
    }
    if (call.direction === 'incoming') {
      return {
        icon: <PhoneIncoming className="w-4 h-4" />,
        color: 'text-success',
        bgColor: 'bg-sage/10',
      };
    }
    return {
      icon: <PhoneOutgoing className="w-4 h-4" />,
      color: 'text-red-oxide',
      bgColor: 'bg-red-oxide/10',
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
        <header className="bg-white/95 backdrop-blur px-6 py-5 sticky top-0 z-10">
          <h1 className="font-playfair text-3xl font-bold text-espresso mb-4">Calls</h1>
          
          <div className="flex p-1 bg-beige-medium rounded-xl border border-beige-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-red-oxide text-white shadow-lg'
                  : 'text-taupe hover:text-espresso'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('missed')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'missed'
                  ? 'bg-error text-white shadow-lg'
                  : 'text-taupe hover:text-espresso'
              }`}
            >
              Missed
            </button>
          </div>
        </header>

        <div className="px-4 py-4 pb-24">
          {Object.entries(groupedCalls).map(([date, calls]) => (
            <div key={date} className="mb-6">
              <h3 className="text-xs font-semibold text-taupe uppercase tracking-wider mb-3 px-2">
                {new Date(date).toDateString() === new Date().toDateString() 
                  ? 'Today' 
                  : new Date(date).toDateString() === new Date(Date.now() - 86400000).toDateString()
                  ? 'Yesterday'
                  : formatDate(date)}
              </h3>
              
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
                      className="bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-3 card-press"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-beige-medium flex items-center justify-center text-espresso font-semibold">
                          {call.otherParty?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${status.bgColor} flex items-center justify-center border-2 border-beige-light`}>
                          <span className={status.color}>{status.icon}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${isMissed ? 'text-error' : 'text-espresso'}`}>
                          {call.otherParty?.name || "Unknown"}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${status.color}`}>
                            {call.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-warm-sand" />
                          <span className="text-xs text-taupe flex items-center gap-1">
                            {call.callType === 'video' ? (
                              <><Video className="w-3 h-3" /> Video</>
                            ) : (
                              <><Phone className="w-3 h-3" /> Audio</>
                            )}
                          </span>
                          {call.durationSeconds && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-warm-sand" />
                              <span className="text-xs text-taupe">
                                {formatDuration(call.durationSeconds)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-taupe">
                          {formatTime(call.startedAt)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCalls.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-beige-medium flex items-center justify-center">
                <Phone className="w-10 h-10 text-taupe" />
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

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDialer(true)}
          className="fixed right-5 z-40 w-14 h-14 rounded-2xl bg-gradient-to-r from-red-oxide to-rust text-white shadow-xl flex items-center justify-center shadow-red-oxide/30"
          style={{ bottom: 'calc(96px + env(safe-area-inset-bottom))' }}
        >
          <Plus className="w-7 h-7" />
        </motion.button>

        <ModernDialer
          isOpen={showDialer}
          onClose={() => setShowDialer(false)}
          onCall={handleCall}
        />
      </div>
    </AppShell>
  );
}
