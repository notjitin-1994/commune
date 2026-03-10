"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Shield, Check, Loader2 } from "lucide-react";
import { useAuthStore, UserDetails } from "@/lib/stores/authStore";

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
      <div className="px-4 py-4 flex items-center">
        <button
          onClick={() => step === "phone" ? router.push("/") : setStep(step === "otp" ? "phone" : "otp")}
          className="p-2 -ml-2 rounded-xl active:bg-beige-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-taupe" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-oxide/10 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-red-oxide" />
                </div>
                <h1 className="font-playfair text-2xl font-bold text-espresso mb-2">
                  Enter Your Phone
                </h1>
                <p className="text-taupe text-sm">
                  We'll send you a verification code
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-deep-brown mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input text-center text-lg tracking-wide"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-oxide text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handlePhoneSubmit}
                  className="btn-primary mt-6"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-oxide/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-oxide" />
                </div>
                <h1 className="font-playfair text-2xl font-bold text-espresso mb-2">
                  Enter OTP
                </h1>
                <p className="text-taupe text-sm">
                  Code sent to {phone}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-mono font-medium rounded-xl border-2 border-beige-medium bg-white text-deep-brown focus:border-red-oxide focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-oxide text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className="btn-primary mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>

                <p className="text-center text-sm text-taupe">
                  Didn't receive code?{" "}
                  <button className="text-red-oxide font-medium">
                    Resend
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-sm mx-auto w-full"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-oxide/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-red-oxide" />
                </div>
                <h1 className="font-playfair text-2xl font-bold text-espresso mb-2">
                  Welcome!
                </h1>
                <p className="text-taupe text-sm">
                  What should we call you?
                </p>
              </div>

              <div className="space-y-4">
                <div>
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
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-oxide text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handleNameSubmit}
                  disabled={isLoading}
                  className="btn-primary mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-taupe">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
