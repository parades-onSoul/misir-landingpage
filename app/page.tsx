"use client";

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NetworkBackground } from "@/components/network-background"
import { useIsMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const emailInputRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitted) {
        setEmail("")
        setError("")
        emailInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSubmitted])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isEmailValid = email.length > 0 && validateEmail(email)

  const handleSubmit = async (e) => {
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
      
      {/* CENTER - Content */}
      <div className="w-full max-w-4xl relative z-20 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 text-white pt-16 md:pt-20 animate-fade-in">
        <header className="w-full flex flex-col gap-8 items-center">
          
          {/* Title and Input - Centered */}
          <div className="max-w-3xl flex flex-col items-center">
            <h1 className="tracking-tight text-balance text-white drop-shadow-2xl font-serif font-thin lg:text-8xl md:text-8xl text-7xl mb-4 text-center">
              The Anti-Noise Engine
            </h1>

            {/* Description */}
            <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-lg font-medium mb-10 text-center text-zinc-300">
              Generative AI dropped the cost of text to zero.
              <br />
              Misir is the passive filter for the flood that followed.
              <br />
              Stop bookmarking. Start mapping.
              <br />
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-[#FF8C5C] to-[#FF6C3C] bg-clip-text text-transparent drop-shadow-xl mt-2 block">
                Google Maps for your mind.
              </span>
            </p>
          </div>

          {/* Email Input Form - Premium Capsule Design */}
          <div className="w-full max-w-md mx-auto relative group z-30 perspective-[1000px]">
             {/* Glow Effect behind container */}
             <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6C3C]/20 to-[#FF8C5C]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500" />

            {!isSubmitted ? (
              <div className="relative">
                <form onSubmit={handleSubmit} className="relative flex items-center group/form" aria-label="Waitlist signup form">
                  <label htmlFor="email-input" className="sr-only">Email address</label>
                  <Input
                    ref={emailInputRef}
                    id="email-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={isMobile ? "Please share your email" : "Please share your email address"}
                    aria-label="Email address"
                    aria-invalid={email && !isEmailValid}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    disabled={isLoading}
                    required
                    className={`
                      w-full h-14 pl-6 pr-[160px] 
                      bg-zinc-900/60 backdrop-blur-xl 
                      border border-white/5 
                      rounded-full 
                      text-white placeholder:text-zinc-500 font-light
                      focus-visible:ring-1 focus-visible:ring-[#FF6C3C]/50 focus-visible:ring-offset-0 focus-visible:border-[#FF6C3C]/50
                      shadow-[0_0_20px_rgba(0,0,0,0.3)]
                      transition-all duration-300
                      ${email && !isEmailValid ? "ring-1 ring-red-500/50 border-red-500/50 bg-red-950/20" : ""}
                      ${email && isEmailValid ? "ring-1 ring-emerald-500/50 border-emerald-500/50 bg-emerald-950/20" : ""}
                    `}
                  />
                  
                  <div className="absolute right-1.5 top-1.5 bottom-1.5 z-10">
                    <Button
                      type="submit"
                      disabled={isLoading || !isEmailValid}
                      className={`
                        h-full px-6 
                        rounded-full 
                        bg-gradient-to-r from-[#FF6C3C] to-[#FF8C5C] 
                        hover:from-[#FF5C2C] hover:to-[#FF7C4C] 
                        text-white font-medium 
                        shadow-lg shadow-[#FF6C3C]/20 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 
                        group/btn flex items-center gap-2
                        ${isLoading ? "opacity-80" : ""}
                      `}
                      onMouseEnter={() => !isLoading && isEmailValid && setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {isLoading ? (
                        <>
                           <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <span>Join Alpha</span>
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Validation Messages - Floating below */}
                <div className="absolute top-full left-0 w-full mt-3 flex justify-center pointer-events-none">
                  <div className="transition-all duration-300 transform">
                    {email && !isEmailValid && (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm shadow-xl">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                         Please enter a valid email address
                       </span>
                    )}
                    {email && isEmailValid && !error && (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-sm shadow-xl">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         Ready to join the revolution
                       </span>
                    )}
                    {error && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm shadow-xl">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                         {error}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center space-y-6 animate-in zoom-in-95 duration-500 fade-in-0"
                style={{
                  boxShadow: "0 0 60px -15px rgba(255, 108, 60, 0.1), 0 0 20px rgba(0,0,0,0.5)"
                }}
              >
                {/* Misir Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#FF6C3C] blur-2xl opacity-20 rounded-full" />
                    <img
                      src="/misir_logo.svg"
                      alt="Misir Logo"
                      className="h-20 w-auto object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                    <p className="text-white font-serif text-2xl tracking-wide">
                      You are on the list.
                    </p>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
                      We are onboarding in small batches to ensure quality. Share with friends to jump the queue.
                    </p>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just joined the waitlist for Misir - The Anti-Noise Engine. Google Maps for your mind! ?? ?")}&url=${encodeURIComponent("https://misir.app")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl transition-all text-sm font-medium border border-zinc-800 hover:border-zinc-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Post
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent("https://misir.app")}&title=${encodeURIComponent("Misir - The Anti-Noise Engine")}&summary=${encodeURIComponent("I just joined the waitlist for Misir. Google Maps for your mind!")}&source=${encodeURIComponent("Misir")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl transition-all text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://misir.app")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#0C63D4] text-white rounded-xl transition-all text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://misir.app");
                      toast.success("Link copied to clipboard!");
                    }}
                    className="w-full text-zinc-500 hover:text-white text-xs py-2 transition-colors font-medium flex items-center justify-center gap-1 group/copy"
                  >
                    <span className="underline underline-offset-2 group-hover/copy:no-underline">Copy invite link</span>
                  </button>
                </div>
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
