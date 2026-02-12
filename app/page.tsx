"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NetworkBackground } from "@/components/network-background"
import { toast } from "sonner"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const emailInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-focus email input on mount
  React.useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Keyboard shortcut: Escape to clear form
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitted) {
        setEmail("")
        setError("")
        emailInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitted])

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isEmailValid = email.length > 0 && validateEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Please enter your email")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError("This email is already on the waitlist")
          toast.error("Email already registered")
        } else {
          setError(data.error || "Failed to save email")
          toast.error(data.error || "Something went wrong")
        }
        return
      }

      setIsSubmitted(true)
      setEmail("")
      toast.success(data.message || "Successfully joined the waitlist!")
    } catch (err) {
      console.error("Signup error:", err)
      setError("Network error. Please try again.")
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 flex flex-col justify-center items-center text-center">
      {/* Enhanced animations moved to globals.css */}

      {/* CENTER - Content */}
      <div className="w-full max-w-4xl relative z-20 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 text-white pt-16 md:pt-20 animate-fade-in">
        {/* Header Section */}
        <header className="w-full flex flex-col gap-6 md:gap-8 items-center">
          {/* Title and Input - Centered */}
          <div className="max-w-3xl flex flex-col items-center">
            <h1 className="tracking-tight text-balance text-white drop-shadow-2xl font-serif font-thin lg:text-8xl md:text-8xl text-7xl mb-4 text-center">
              The Anti-Noise Engine
            </h1>

            {/* Description with enhanced emphasis on tagline */}
            <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-lg font-medium mb-8 text-center">
              Generative AI dropped the cost of text to zero.
              <br />
              Misir is the passive filter for the flood that followed.
              <br />
              Stop bookmarking. Start mapping.
              <br />
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-[#FF8C5C] to-[#FF6C3C] bg-clip-text text-transparent drop-shadow-xl">
                Google Maps for your mind.
              </span>
            </p>
          </div>

            {/* Email Input Form */}
            <div 
              className="backdrop-blur-md p-3 bg-white/95 rounded-2xl w-full max-w-md mx-auto border border-white/20"
              style={{
                boxShadow: "0 4px 24px rgba(255, 108, 60, 0.15), 0 8px 40px rgba(0, 0, 0, 0.12)"
              }}
            >
              {!isSubmitted ? (
                <div>
                  <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Waitlist signup form">
                    <label htmlFor="email-input" className="sr-only">Email address</label>
                    <Input
                      ref={emailInputRef}
                      id="email-input"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      aria-invalid={email && !isEmailValid}
                      aria-describedby={error ? "error-message" : email && isEmailValid ? "success-message" : undefined}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      disabled={isLoading}
                      required
                      className={`flex-1 border-none text-zinc-900 placeholder:text-zinc-500 h-14 px-5 text-base bg-transparent rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF6C3C] focus-visible:ring-offset-0 disabled:opacity-50 transition-all ${
                        email && !isEmailValid ? "ring-2 ring-red-500" : email && isEmailValid ? "ring-2 ring-emerald-500" : ""
                      }`}
                    />
                    <Button 
                      type="submit"
                      disabled={isLoading || !isEmailValid}
                      className="h-14 min-w-[140px] px-7 text-white font-semibold text-base transition-all bg-gradient-to-r from-[#FF6C3C] to-[#FF8C5C] hover:from-[#FF5C2C] hover:to-[#FF7C4C] active:scale-95 rounded-xl shadow-lg shadow-[#FF6C3C]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      onMouseEnter={() => !isLoading && isEmailValid && setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {isLoading ? "Joining..." : "Join the Alpha"}
                    </Button>
                  </form>
                  {email && !isEmailValid && (
                    <p className="text-red-500 text-xs mt-2 px-4 text-left">
                      ✗ Please enter a valid email address
                    </p>
                  )}
                  {email && isEmailValid && !error && (
                    <p className="text-green-500 text-xs mt-2 px-4 text-left">
                      ✓ Valid email
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-xs mt-2 px-4 text-left">
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 px-4 space-y-4">
                  {/* Misir Logo */}
                  <div className="flex justify-center mb-4">
                    <div className="relative h-20 w-20">
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
                  <p className="text-[#FF6C3C] font-semibold text-lg">
                    You're on the waitlist!
                  </p>
                  <p className="text-white/70 text-sm">
                    We're onboarding in batches. Share with friends to move up the queue.
                  </p>
                  
                  {/* Share Buttons */}
                  <div className="flex gap-3 justify-center pt-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just joined the waitlist for Misir - The Anti-Noise Engine. Google Maps for your mind! ??")}&url=${encodeURIComponent("https://misir.app")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share on X
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://misir.app")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      Share on LinkedIn
                    </a>
                  </div>
                  
                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://misir.app");
                      toast.success("Link copied to clipboard!");
                    }}
                    className="text-white/50 hover:text-white text-sm underline underline-offset-2 transition-colors"
                  >
                    Copy invite link
                  </button>
                </div>
              )}
            </div>
        </header>
      </div>

      {/* BACKGROUND - Full Screen */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <NetworkBackground isHovered={isHovered} />
      </div>
    </main>
  )
}







