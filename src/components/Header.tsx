"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Crown, User, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";
import { localDB } from "@/lib/supabase";

export default function Header() {
  const [subscription, setSubscription] = useState<{ status: string; plan: string }>({
    status: "free",
    plan: "Free Tier",
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("AstroSeeker");

  const syncSub = async () => {
    const sub = await localDB.getSubscription();
    setSubscription(sub);
  };

  useEffect(() => {
    syncSub();
    // Simulate login check
    const user = localStorage.getItem("jyotish_user");
    if (user) {
      setIsLoggedIn(true);
      setUserName(user);
    }
  }, []);

  const handleSimulatedUpgrade = async () => {
    setIsProcessingCheckout(true);
    // Simulate Stripe loading checkout
    setTimeout(async () => {
      await localDB.upgradeSubscription("demo-user", "premium");
      await syncSub();
      setIsProcessingCheckout(false);
      setShowCheckout(false);
      // Trigger a window event to let dashboard know
      window.dispatchEvent(new Event("subscription_updated"));
    }, 2000);
  };

  const handleSimulatedDowngrade = async () => {
    await localDB.upgradeSubscription("demo-user", "free");
    await syncSub();
    window.dispatchEvent(new Event("subscription_updated"));
  };

  const handleLogin = (name: string) => {
    localStorage.setItem("jyotish_user", name);
    setIsLoggedIn(true);
    setUserName(name);
    setShowProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jyotish_user");
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gold/15 bg-cosmic/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-midnight text-gold shadow-[0_0_15px_rgba(230,184,92,0.3)] transition-all group-hover:scale-105">
              <Sparkles className="h-5 w-5 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full border border-dashed border-gold/20 animate-spin-slow"></div>
            </div>
            <span className="font-serif text-xl font-bold tracking-wider gold-gradient-text uppercase">
              Jyotish AI
            </span>
          </Link>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-purple-200/80">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/#scanner" className="hover:text-gold transition-colors">
              AI Palm Scan
            </Link>
            <Link href="/#astrology" className="hover:text-gold transition-colors">
              Zodiac Birth Chart
            </Link>
            <Link href="/dashboard" className="hover:text-gold transition-colors flex items-center gap-1.5">
              <span>Dashboard</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            {subscription.status === "premium" ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-gold bg-gold/10 border border-gold/40 rounded-full gold-glow">
                <Crown className="h-3 w-3 fill-gold" />
                Premium Active
              </span>
            ) : (
              <button
                onClick={() => setShowCheckout(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-bold uppercase tracking-wider text-midnight bg-gold hover:bg-gold/90 transition-all rounded-full border border-gold/20 shadow-[0_0_15px_rgba(230,184,92,0.35)] hover:scale-[1.02]"
              >
                <Crown className="h-3.5 w-3.5 fill-midnight" />
                Upgrade to Premium
              </button>
            )}

            {/* User State */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-violet-light/30 bg-violet-dark/20 text-violet-light hover:border-gold hover:text-gold transition-all"
                >
                  <User className="h-4.5 w-4.5" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gold/20 bg-cosmic/95 backdrop-blur-xl p-4 shadow-2xl text-sm text-left">
                    <div className="font-semibold text-white border-b border-gold/10 pb-2 mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <span>Namaste, {userName}</span>
                    </div>
                    <div className="space-y-2 text-xs text-purple-200/70 mb-4">
                      <div className="flex justify-between">
                        <span>Account Plan:</span>
                        <span className="font-bold text-gold uppercase">{subscription.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Status:</span>
                        <span className="text-emerald-400 font-semibold">Demo Sandbox Active</span>
                      </div>
                    </div>
                    
                    {subscription.status === "premium" && (
                      <button
                        onClick={handleSimulatedDowngrade}
                        className="w-full text-center text-xs text-rose-400 hover:underline mb-3 py-1"
                      >
                        Cancel Premium Subscription
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-200 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 rounded-lg transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleLogin("AstroSeeker")}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-wider text-purple-200 hover:text-white bg-violet-dark/30 hover:bg-violet-dark/50 transition-all rounded-full border border-violet-light/35"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Simulated Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gold/30 bg-cosmic/95 p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-purple-300 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold mb-4">
              <Crown className="h-6 w-6 fill-gold animate-bounce" />
            </div>

            <h3 className="font-serif text-2xl font-bold tracking-wide text-white mb-2">
              Unlock Cosmic Intelligence
            </h3>
            
            <p className="text-sm text-purple-200/70 mb-6">
              Get unlimited AI palm scans, premium PDF report generation, full astrological timelines, and direct chats with the AI Astrologer.
            </p>

            <div className="glass-card-purple border border-gold/10 rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between border-b border-gold/10 pb-2 mb-2 font-bold">
                <span>Premium Access Plan</span>
                <span className="text-gold">$19 / month</span>
              </div>
              <ul className="text-xs text-purple-200/80 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                  Unlimited AI Palm Scans (Vision Powered)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                  Export Comprehensive PDF Destiny Reports
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                  Unlimited AI Astrologer Chatbot Queries
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                  Detailed remedies, mantras, and daily guidance
                </li>
              </ul>
            </div>

            <button
              onClick={handleSimulatedUpgrade}
              disabled={isProcessingCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-bold uppercase tracking-wider text-midnight bg-gold hover:bg-gold/90 disabled:bg-gold/50 rounded-xl transition-all shadow-[0_0_20px_rgba(230,184,92,0.3)]"
            >
              {isProcessingCheckout ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-midnight border-t-transparent"></div>
                  Contacting Stripe Securely...
                </>
              ) : (
                <>
                  Pay Securely via Stripe
                </>
              )}
            </button>
            
            <p className="text-[10px] text-purple-300/40 mt-3 flex items-center justify-center gap-1.5">
              Secure SSL Encryption. Powered by Stripe.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
