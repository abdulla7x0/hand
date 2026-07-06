"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Starfield from "@/components/Starfield";
import PalmScanner from "@/components/PalmScanner";
import {
  Sparkles,
  Camera,
  Crown,
  Heart,
  Briefcase,
  Shield,
  HelpCircle,
  Globe,
  Compass,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import canvasConfetti from "canvas-confetti";

export default function Home() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (report: any) => {
    canvasConfetti({
      particleCount: 150,
      spread: 80,
      colors: ["#E6B85C", "#7E5BEF"],
    });
    // Redirect to dashboard with active scan loaded
    router.push("/dashboard");
  };

  const handleDemoReading = () => {
    // Generate a default demo scan if none exists
    router.push("/dashboard?tab=reading");
  };

  return (
    <div className="relative min-h-screen pb-20">
      <Starfield />
      <Header />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 text-center flex flex-col items-center">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 border border-gold/30 rounded-full gold-glow mb-8 animate-float">
          <Sparkles className="h-3.5 w-3.5 fill-gold" />
          The World&apos;s Advanced AI Astrology Platform
        </div>

        {/* Headings */}
        <h1 className="max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
          Your Destiny Is Written <br />
          <span className="cosmic-gradient-text">In Your Hands</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-purple-200/70 leading-relaxed">
          Upload your palm and unlock AI-powered insights about your personality, career, relationships, health, and future. Discover cosmic guidance tailored uniquely for you.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-midnight bg-gold hover:bg-gold/90 transition-all rounded-full border border-gold/30 shadow-[0_0_25px_rgba(230,184,92,0.45)] hover:scale-[1.03]"
          >
            <Camera className="h-4.5 w-4.5" />
            Scan Palm Now
          </button>
          
          <button
            onClick={handleDemoReading}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-purple-200 hover:text-white bg-violet-dark/25 hover:bg-violet-dark/40 border border-violet-light/35 hover:border-gold/50 rounded-full transition-all"
          >
            View Demo Reading
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* HERO ANIMATION: Rotating Zodiac circle with floating palm representation */}
        <div className="relative mt-16 sm:mt-24 h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] flex items-center justify-center">
          {/* Constellations background glow */}
          <div className="absolute inset-0 bg-violet-light/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Golden Rotating Zodiac Wheel */}
          <div className="absolute inset-0 border border-dashed border-gold/20 rounded-full animate-spin-slow flex items-center justify-center">
            {/* Inner Ring */}
            <div className="h-[80%] w-[80%] border border-double border-gold/30 rounded-full flex items-center justify-center">
              {/* Core Star Point */}
              <div className="h-[70%] w-[70%] border border-dashed border-gold/10 rounded-full"></div>
            </div>
            
            {/* Zodiac Symbol Labels rotating around */}
            {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((zod, i) => {
              const angle = (i * 360) / 12;
              return (
                <span
                  key={i}
                  className="absolute text-gold/60 text-lg sm:text-xl select-none"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-160px) rotate(-${angle}deg)`,
                    transformOrigin: "center center"
                  }}
                >
                  {zod}
                </span>
              );
            })}
          </div>

          {/* Reverse Rotating Outer Star Wheel */}
          <div className="absolute inset-4 border border-dashed border-violet-light/15 rounded-full animate-spin-reverse"></div>

          {/* Floating Glowing Palm Representation */}
          <div className="relative z-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full border-2 border-gold/45 bg-midnight/90 shadow-[0_0_50px_rgba(230,184,92,0.35)] flex items-center justify-center animate-float overflow-hidden group">
            <img
              src="/palm.jpg"
              alt="AI Palm Analysis"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-2 rounded-full border border-dashed border-gold/25 animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-4 mt-28 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Six Major Lines Traced by AI</h2>
          <p className="text-sm text-purple-200/60 max-w-lg mx-auto">
            Our AI analysis engine measures line coordinates, curvatures, depth, and mount intersections to synthesise authentic Vedic and Western palm readings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Heart Line",
              desc: "Deeply connected to emotional maturity, empathy, love dynamics, and compatibility potential.",
              icon: Heart,
              color: "text-rose-400"
            },
            {
              title: "Head Line",
              desc: "Reveals logical reasoning depth, focus, learning preferences, and mental resilience.",
              icon: Compass,
              color: "text-indigo-400"
            },
            {
              title: "Life Line",
              desc: "Represents vital energy, lifestyle changes, physical constitution, and overall adaptability.",
              icon: Sparkles,
              color: "text-emerald-400"
            },
            {
              title: "Fate Line",
              desc: "Charts career choices, external milestones, determination vectors, and professional success.",
              icon: Briefcase,
              color: "text-yellow-400"
            },
            {
              title: "Sun Line",
              desc: "Measures creative heights, artistic expression, public recognition, and the capacity to attract fame.",
              icon: Award,
              color: "text-amber-400"
            },
            {
              title: "Marriage Line",
              desc: "Analyzes bonding capacities, relationship stability, and key union windows.",
              icon: Crown,
              color: "text-purple-400"
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4">
                <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-midnight border border-gold/25 ${feat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VALUE PROP & TRUST */}
      <section className="mx-auto max-w-7xl px-4 mt-28 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl border border-gold/20 p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center">
          
          <div className="space-y-6 lg:w-1/2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Unlock the Maps of <br />
              <span className="gold-gradient-text">Your Life Cycle</span>
            </h2>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              Astrology is a mirror to your soul. By mapping the lines, ridges, and mounts of your palm, our platform matches your somatic features with astrological configurations. Receive immediate, comprehensive guidance regarding career shifts, romantic compatibility, and daily horoscopes.
            </p>

            <ul className="text-xs text-purple-200/80 space-y-3">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold" />
                <span>100% Private & Secure uploads. Images deleted after analysis.</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold animate-pulse" />
                <span>Advanced Computer Vision modeling with authentic Vedic insights.</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gold" />
                <span>Join over 100,000 seekers worldwide.</span>
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 flex justify-center relative w-full aspect-video rounded-2xl overflow-hidden border border-gold/20 bg-midnight/80">
            {/* Visual preview grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(126,91,239,0.15),transparent_70%)]"></div>
            <div className="flex items-center justify-center p-6 text-center space-y-2 flex-col">
              <div className="h-10 w-10 bg-gold/10 border border-gold/30 text-gold rounded-full flex items-center justify-center">
                ☸
              </div>
              <h4 className="font-serif font-bold text-white text-sm">Interactive Horoscope Calculator</h4>
              <p className="text-[10px] text-purple-300/60 max-w-xs">
                Calculate Moon, Sun, Rising signs, lucky stones, colors, and daily scores instantly.
              </p>
              <button
                onClick={() => router.push("/dashboard?tab=horoscope")}
                className="mt-3 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-midnight bg-gold rounded-full"
              >
                Open Birth Chart Builder
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ENTERTAINMENT DISCLAIMER BANNER */}
      <footer className="mx-auto max-w-7xl px-4 mt-28 sm:px-6 lg:px-8 border-t border-gold/15 pt-8 text-center text-xs text-purple-300/40 space-y-3">
        <div className="bg-cosmic/30 border border-gold/10 rounded-2xl p-4 max-w-3xl mx-auto flex items-center justify-center gap-3">
          <Shield className="h-5 w-5 text-gold shrink-0" />
          <p className="text-left text-[11px] leading-relaxed">
            <span className="font-semibold text-gold uppercase block text-[9px] tracking-wider mb-0.5">Disclaimer & Advisory Notice</span>
            Jyotish AI is an entertainment and spiritual guidance application. All readings, analysis, and prediction timelines are not scientifically proven. Decisions should not be made solely based on these results.
          </p>
        </div>

        <p className="pt-4">
          © {new Date().getFullYear()} Jyotish AI Inc. All rights reserved.
        </p>
      </footer>

      {/* POPUP SCANNER OVERLAY */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl relative">
            <button
              onClick={() => setShowScanner(false)}
              className="absolute -top-12 right-0 text-purple-200 hover:text-white flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest"
            >
              ✕ Close
            </button>
            <PalmScanner
              onScanComplete={handleScanComplete}
              onCancel={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
