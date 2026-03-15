"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Phone, 
  Shield, 
  Check, 
  Loader2, 
  ChevronRight,
  Lock,
  Home
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated, isLoading } = useAuthStore();
  
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/map");
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.phone === phone);
    setIsNewUser(!existingUser);
    setStep("otp");
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete OTP");
      return;
    }
    
    setError("");
    const success = await login(phone, otpString);
    
    if (success) {
      if (isNewUser) {
        setStep("name");
      } else {
        router.push("/map");
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleNameSubmit = async () => {
    if (name.trim().length < 2) {
      setError("Please enter your name");
      return;
    }
    
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const success = await signup(phone, {
      firstName,
      lastName,
      email: '',
      bio: ''
    });
    if (success) {
      router.push("/map");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-beige-light flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6"
      >
        <button
          onClick={() => step === "phone" ? router.push("/") : setStep(step === "otp" ? "phone" : "otp")}
          className="flex items-center gap-2 text-taupe hover:text-deep-brown transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-beige-medium flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-oxide flex items-center justify-center shadow-lg"
                >
                  <Phone className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-playfair text-4xl font-bold text-espresso mb-3"
                >
                  Welcome Back
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-taupe"
                >
                  Enter your phone number to continue
                </motion.p>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-deep-brown mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input text-center text-lg tracking-wider"
                    autoFocus
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-oxide text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhoneSubmit}
                  className="btn-primary"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-beige-medium flex items-center justify-center"
                >
                  <Shield className="w-10 h-10 text-red-oxide" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-playfair text-3xl font-bold text-espresso mb-3"
                >
                  Verification Code
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-taupe"
                >
                  Enter the 6-digit code sent to {phone}
                </motion.p>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-3"
                >
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <input
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white border-2 border-beige-medium text-espresso focus:border-red-oxide focus:outline-none transition-colors"
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-oxide text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-sm text-taupe"
                >
                  Didn&apos;t receive code?{" "}
                  <button className="text-red-oxide hover:text-rust font-medium">
                    Resend
                  </button>
                </motion.p>
              </div>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-sage flex items-center justify-center shadow-lg"
                >
                  <Home className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-playfair text-3xl font-bold text-espresso mb-3"
                >
                  Almost There!
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-taupe"
                >
                  What should we call you?
                </motion.p>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-deep-brown mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input text-center"
                    autoFocus
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-oxide text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNameSubmit}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-6 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-taupe text-xs">
          <Lock className="w-3 h-3" />
          <span>Secured with end-to-end encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
