"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NetworkBackground from "@/components/network-background";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on email input when page loads
    emailInputRef.current?.focus();

    // Keyboard shortcut: Escape to clear email
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && emailInputRef.current) {
        setEmail("");
        emailInputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        toast.success(data.message || "You're on the waitlist!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* MAIN CONTENT - Centered */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative h-16 w-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="h-full w-full"
                aria-label="Misir Logo"
              >
                <path
                  d="M50 10 L70 30 L70 70 L50 90 L30 70 L30 30 Z"
                  fill="none"
                  stroke="#FF6C3C"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="50" r="8" fill="#FF6C3C" />
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="30"
                  stroke="#FF6C3C"
                  strokeWidth="2"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="70"
                  y2="50"
                  stroke="#FF6C3C"
                  strokeWidth="2"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="30"
                  y2="50"
                  stroke="#FF6C3C"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 animate-glow rounded-full bg-[#FF6C3C]/20 blur-xl" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="bg-gradient-to-r from-[#FF6C3C] to-[#FF8C5C] bg-clip-text text-transparent">
                Misir
              </span>
            </h1>
            <p className="text-lg text-zinc-400 sm:text-xl">
              Join the waitlist for early access
            </p>
          </div>

          {/* Form */}
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  ref={emailInputRef}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-[#FF6C3C] focus:ring-[#FF6C3C]"
                  aria-label="Email address"
                  aria-invalid={email && !validateEmail(email)}
                  aria-describedby={email && !validateEmail(email) ? "email-error" : undefined}
                  required
                />
                {email && !validateEmail(email) && (
                  <p id="email-error" className="text-sm text-red-400" role="alert">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="h-12 w-full bg-gradient-to-r from-[#FF6C3C] to-[#FF8C5C] font-semibold text-white hover:from-[#FF5C2C] hover:to-[#FF7C4C] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spinnerRotate rounded-full border-2 border-white/30 border-t-white" />
                    Joining...
                  </span>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-3">
              <p className="text-[#FF6C3C] font-medium">
                Request received. We are onboarding in batches.
              </p>
            </div>
          )}

          {/* Info Text */}
          <p className="text-center text-sm text-zinc-500">
            Be the first to know when we launch
          </p>
        </div>
      </div>

      {/* BACKGROUND - Full Screen */}
      <div className="absolute inset-0 z-0">
        <NetworkBackground />
      </div>
    </div>
  );
}
