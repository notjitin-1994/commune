"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, Clock, Plus, X, User, Hash } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CallLog, User as UserType } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/helpers";

interface CallLogWithUsers extends CallLog {
  caller?: UserType;
  receiver?: UserType;
  otherParty?: UserType;
}

export default function CallsPage() {
  const [callLogs, setCallLogs] = useState<CallLogWithUsers[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');
  const [showDialer, setShowDialer] = useState(false);
  const [dialNumber, setDialNumber] = useState("");

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

  const getCallIcon = (call: CallLogWithUsers) => {
    if (call.status === 'missed') {
      return <PhoneMissed className="w-5 h-5 text-red-oxide" />;
    }
    if (call.direction === 'incoming') {
      return <PhoneIncoming className="w-5 h-5 text-sage" />;
    }
    return <PhoneOutgoing className="w-5 h-5 text-tan" />;
  };

  const getCallTypeIcon = (callType: string) => {
    return callType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />;
  };

  const filteredCalls = activeTab === 'missed' 
    ? callLogs.filter(call => call.status === 'missed')
    : callLogs;

  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const date = new Date(call.startedAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(call);
    return groups;
  }, {} as Record<string, CallLogWithUsers[]>);

  const handleDialNumber = (num: string) => {
    if (dialNumber.length < 15) {
      setDialNumber(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (!dialNumber) return;
    console.log(`Calling ${dialNumber} via ${type}`);
    setShowDialer(false);
    setDialNumber("");
  };

  const dialPadButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  return (
    <AppShell>
      <div className="min-h-full bg-beige-light">
        {/* Header */}
        <header className="mobile-header px-4 py-3">
          <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">Calls</h1>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-red-oxide text-white shadow-button'
                  : 'bg-beige-light text-deep-brown active:bg-beige-medium'
              }`}
            >
              All Calls
            </button>
            <button
              onClick={() => setActiveTab('missed')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'missed'
                  ? 'bg-red-oxide text-white shadow-button'
                  : 'bg-beige-light text-deep-brown active:bg-beige-medium'
              }`}
            >
              Missed
            </button>
          </div>
        </header>

        {/* Call List */}
        <div className="px-4 py-4 pb-8">
          {Object.entries(groupedCalls).map(([date, calls]) => (
            <div key={date} className="mb-6">
              <h3 className="text-xs font-semibold text-taupe uppercase tracking-wide mb-3 sticky top-0 bg-beige-light py-2">
                {new Date(date).toDateString() === new Date().toDateString() 
                  ? 'Today' 
                  : new Date(date).toDateString() === new Date(Date.now() - 86400000).toDateString()
                  ? 'Yesterday'
                  : formatDate(date)}
              </h3>
              
              <motion.div 
                className="space-y-3"
                initial="initial"
                animate="animate"
                variants={{
                  animate: { transition: { staggerChildren: 0.03 } }
                }}
              >
                {calls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card active:scale-[0.99] transition-transform"
                  >
                    <UserAvatar 
                      name={call.otherParty?.name || "Unknown"} 
                      size="md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-deep-brown text-sm truncate">
                          {call.otherParty?.name || "Unknown"}
                        </h3>
                        {call.status === 'missed' && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-oxide" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-taupe mt-1">
                        <span className="flex items-center gap-1">
                          {getCallIcon(call)}
                          {call.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                        </span>
                        <span className="flex items-center gap-1">
                          {getCallTypeIcon(call.callType)}
                          {call.callType === 'video' ? 'Video' : 'Audio'}
                        </span>
                        {call.durationSeconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(call.durationSeconds)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-taupe">{formatTime(call.startedAt)}</p>
                      <div className="flex gap-1 mt-2 justify-end">
                        <button className="w-9 h-9 rounded-full bg-sage/10 flex items-center justify-center active:bg-sage/20 transition-colors">
                          <Phone className="w-4 h-4 text-sage" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-tan/10 flex items-center justify-center active:bg-tan/20 transition-colors">
                          <Video className="w-4 h-4 text-tan" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}

          {filteredCalls.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-beige-medium flex items-center justify-center">
                <Phone className="w-10 h-10 text-taupe" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">
                No calls yet
              </h3>
              <p className="text-taupe text-sm">
                Your call history will appear here
              </p>
            </div>
          )}
        </div>

        {/* Floating Dialer Button */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 lg:bottom-8">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDialer(true)}
            className="w-16 h-16 rounded-full bg-red-oxide text-white shadow-2xl flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 30px rgba(156, 61, 50, 0.4)',
            }}
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Dialer Modal */}
        <AnimatePresence>
          {showDialer && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDialer(false)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              />
              
              {/* Dialer */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
                style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
              >
                {/* Handle */}
                <div className="flex flex-col items-center pt-3 pb-4">
                  <div className="w-10 h-1.5 bg-warm-sand/50 rounded-full" />
                </div>

                {/* Number Display */}
                <div className="px-6 py-4 border-b border-beige-medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {dialNumber ? (
                        <span className="text-2xl font-mono font-semibold text-deep-brown tracking-wider">
                          {dialNumber}
                        </span>
                      ) : (
                        <span className="text-lg text-taupe">Enter number</span>
                      )}
                    </div>
                    {dialNumber && (
                      <button 
                        onClick={handleBackspace}
                        className="p-2 rounded-full hover:bg-beige-light active:bg-beige-medium transition-colors"
                      >
                        <X className="w-5 h-5 text-taupe" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Dial Pad */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {dialPadButtons.map((btn) => (
                      <button
                        key={btn.num}
                        onClick={() => handleDialNumber(btn.num)}
                        className="aspect-square rounded-2xl bg-beige-light active:bg-beige-medium transition-colors flex flex-col items-center justify-center"
                      >
                        <span className="text-2xl font-semibold text-deep-brown">{btn.num}</span>
                        {btn.letters && (
                          <span className="text-[10px] text-taupe uppercase tracking-wider">{btn.letters}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Call Buttons */}
                  <div className="flex gap-3 mt-6 max-w-xs mx-auto">
                    <button
                      onClick={() => handleCall('audio')}
                      disabled={!dialNumber}
                      className="flex-1 h-14 rounded-2xl bg-sage text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </button>
                    <button
                      onClick={() => handleCall('video')}
                      disabled={!dialNumber}
                      className="flex-1 h-14 rounded-2xl bg-tan text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      <Video className="w-5 h-5" />
                      Video
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setShowDialer(false);
                      setDialNumber("");
                    }}
                    className="w-full mt-4 py-3 text-taupe font-medium active:text-deep-brown transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
