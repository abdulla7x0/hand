"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Starfield from "@/components/Starfield";
import PalmScanner from "@/components/PalmScanner";
import ChatBot from "@/components/ChatBot";
import { localDB, isSupabaseConfigured } from "@/lib/supabase";
import { generateAstrologyProfile, generateDailyHoroscope, PalmAnalysisReport, AstrologyProfile, ZODIAC_SIGNS } from "@/utils/astrologyData";
import { generatePDFReport } from "@/utils/pdfGenerator";
import {
  Activity,
  FileText,
  User,
  History,
  Compass,
  Zap,
  TrendingUp,
  Sparkles,
  Calendar,
  MessageSquare,
  Globe,
  Share2,
  Download,
  AlertTriangle,
  RotateCcw,
  Check,
  Heart,
  Briefcase,
  Flame,
  DollarSign,
  Crown
} from "lucide-react";
import canvasConfetti from "canvas-confetti";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reading" | "horoscope" | "predictions" | "remedies" | "reports" | "history" | "community" | "profile"
  >("overview");
  
  const [scans, setScans] = useState<any[]>([]);
  const [activeScan, setActiveScan] = useState<PalmAnalysisReport | null>(null);
  const [profile, setProfile] = useState<AstrologyProfile | null>(null);
  const [dailyHoroscope, setDailyHoroscope] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [subStatus, setSubStatus] = useState("free");

  // Horoscope Inputs
  const [nameInput, setNameInput] = useState("");
  const [birthDate, setBirthDate] = useState("1995-07-16");
  const [birthTime, setBirthTime] = useState("12:00");
  const [birthPlace, setBirthPlace] = useState("Varanasi, India");

  // Community Inputs
  const [posts, setPosts] = useState<any[]>([
    {
      id: "p1",
      author: "Sneha Sharma",
      date: "2 hours ago",
      text: "Just did my palm scan! Got a 94% Creativity Score and a Writer's Fork on my Head Line. It explains my passion for content design!",
      sharedScan: { score: 94, line: "Head Line (Forked)" },
      likes: 12,
      comments: 3,
    },
    {
      id: "p2",
      author: "Rohan Varma",
      date: "1 day ago",
      text: "Does anyone know what specific remedies help with balancing an overactive Moon Mount? My report suggests meditation, but looking for mantras.",
      likes: 5,
      comments: 8,
    }
  ]);
  const [newPostText, setNewPostText] = useState("");

  const loadData = async () => {
    // 1. Subscription
    const sub = await localDB.getSubscription();
    setSubStatus(sub.status);

    // 2. Scans
    const list = await localDB.getScans();
    setScans(list);
    if (list.length > 0) {
      setActiveScan(list[0]);
    } else {
      setActiveScan(null);
    }

    // 3. Profile & Horoscope
    const savedProfile = localStorage.getItem("jyotish_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setNameInput(parsed.name);
      setBirthDate(parsed.birthDate);
      setBirthTime(parsed.birthTime);
      setBirthPlace(parsed.birthPlace);
      // Daily horoscope based on zodiac
      const horo = generateDailyHoroscope(parsed.zodiacSign);
      setDailyHoroscope(horo);
    } else {
      // Seed default profile
      const defaultProf = generateAstrologyProfile("AstroSeeker", "1995-07-16", "12:00", "Varanasi, India");
      setProfile(defaultProf);
      setNameInput("AstroSeeker");
      setBirthDate("1995-07-16");
      setBirthTime("12:00");
      setBirthPlace("Varanasi, India");
      const horo = generateDailyHoroscope(defaultProf.zodiacSign);
      setDailyHoroscope(horo);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to subscription changes
    const handleSubChange = () => {
      loadData();
    };
    window.addEventListener("subscription_updated", handleSubChange);
    return () => {
      window.removeEventListener("subscription_updated", handleSubChange);
    };
  }, []);

  const handleScanComplete = (newScan: any) => {
    canvasConfetti({
      particleCount: 150,
      spread: 80,
      colors: ["#E6B85C", "#7E5BEF", "#12041E"],
    });
    setScans((prev) => [newScan, ...prev]);
    setActiveScan(newScan);
    setIsScanning(false);
    setActiveTab("reading");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProf = generateAstrologyProfile(nameInput, birthDate, birthTime, birthPlace);
    setProfile(newProf);
    localStorage.setItem("jyotish_profile", JSON.stringify(newProf));
    
    // Update daily horoscope
    const horo = generateDailyHoroscope(newProf.zodiacSign);
    setDailyHoroscope(horo);

    // Show success confetti
    canvasConfetti({
      particleCount: 50,
      spread: 60,
      colors: ["#E6B85C", "#7E5BEF"],
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Math.random().toString(36).substring(2, 11),
      author: profile?.name || "AstroSeeker",
      date: "Just now",
      text: newPostText,
      sharedScan: activeScan ? { score: activeScan.scores.personality, line: activeScan.lines.heart.type } : undefined,
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const triggerPDFDownload = () => {
    if (!activeScan) return;
    if (subStatus !== "premium") {
      alert("PDF Export is a premium feature. Please upgrade your subscription using the button in the top menu to download full reports.");
      return;
    }
    generatePDFReport(activeScan, profile || undefined);
  };

  return (
    <div className="min-h-screen cosmic-bg relative text-white pb-20">
      <Starfield />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR TABS */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="glass-card rounded-2xl p-4 space-y-1.5 border border-gold/15 sticky top-24">
              <div className="px-3 pb-3 mb-3 border-b border-gold/10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Astrology Console</span>
              </div>
              
              {[
                { id: "overview", label: "Overview", icon: Activity },
                { id: "reading", label: "Palm Reading", icon: Sparkles },
                { id: "horoscope", label: "Horoscope & Birth Chart", icon: Calendar },
                { id: "predictions", label: "Future Predictions", icon: TrendingUp },
                { id: "remedies", label: "Vedic Remedies", icon: Compass },
                { id: "reports", label: "Advanced Report", icon: FileText },
                { id: "history", label: "Reading History", icon: History },
                { id: "community", label: "Community Forum", icon: Globe },
                { id: "profile", label: "User Profile", icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setIsScanning(false);
                      setActiveTab(tab.id as any);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gold text-midnight shadow-[0_0_15px_rgba(230,184,92,0.35)]"
                        : "text-purple-200/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => setIsScanning(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-midnight bg-gold border border-gold/25 shadow-lg hover:scale-[1.02] transition-all"
              >
                <Sparkles className="h-4 w-4 fill-midnight" />
                Scan New Palm
              </button>
            </div>
          </aside>

          {/* MAIN DASHBOARD VIEW */}
          <div className="flex-1 min-w-0">
            {isScanning ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-2xl font-bold">New Scan</h2>
                  <button
                    onClick={() => setIsScanning(false)}
                    className="text-sm text-purple-300 hover:text-white"
                  >
                    Cancel Scan
                  </button>
                </div>
                <PalmScanner
                  onScanComplete={handleScanComplete}
                  onCancel={() => setIsScanning(false)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* TABS CONTENT */}

                {/* 1. OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="glass-card-purple rounded-3xl p-6 border border-violet-light/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 z-10">
                        <h1 className="font-serif text-3xl font-bold tracking-wide">
                          Namaste, <span className="gold-gradient-text">{profile?.name || "Seeker"}</span>
                        </h1>
                        <p className="text-sm text-purple-200/80 max-w-lg">
                          Your astral nodes are active. Today, your overall alignment score is{" "}
                          <span className="font-bold text-gold">{dailyHoroscope?.overall || 88}%</span>.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 z-10">
                        <button
                          onClick={() => setIsScanning(true)}
                          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-midnight bg-gold rounded-full border border-gold/20 shadow-md"
                        >
                          Scan Palm Now
                        </button>
                      </div>
                      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-violet-light/10 blur-3xl pointer-events-none"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Interactive Horoscope Snapshot */}
                      <div className="glass-card rounded-2xl p-6 border border-gold/15 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-lg font-bold text-purple-200">Zodiac Alignment</h3>
                            <Calendar className="h-5 w-5 text-gold" />
                          </div>
                          
                          <div className="space-y-2 border-l border-gold/25 pl-4 py-1">
                            <div>
                              <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Sun Constellation</span>
                              <p className="text-base font-serif font-bold text-gold">{profile?.zodiacSign}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Lucky Stone</span>
                              <p className="text-sm text-purple-200">{profile?.luckyGemstone}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Lucky Color</span>
                              <p className="text-sm text-purple-200">{profile?.luckyColor}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab("horoscope")}
                          className="mt-6 text-xs text-gold/80 hover:text-gold hover:underline font-semibold flex items-center gap-1"
                        >
                          View Full Birth Chart →
                        </button>
                      </div>

                      {/* Daily Horoscope snapshot */}
                      <div className="glass-card rounded-2xl p-6 border border-gold/15 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="font-serif text-lg font-bold text-purple-200">Daily Balance</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-rose-400 shrink-0" />
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Love</span>
                                <p className="text-sm font-bold text-purple-200">{dailyHoroscope?.love.score}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-sky-400 shrink-0" />
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Career</span>
                                <p className="text-sm font-bold text-purple-200">{dailyHoroscope?.career.score}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Flame className="h-4 w-4 text-orange-400 shrink-0" />
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Health</span>
                                <p className="text-sm font-bold text-purple-200">{dailyHoroscope?.health.score}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Wealth</span>
                                <p className="text-sm font-bold text-purple-200">{dailyHoroscope?.wealth.score}%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab("horoscope")}
                          className="mt-6 text-xs text-gold/80 hover:text-gold hover:underline font-semibold flex items-center gap-1"
                        >
                          View Horoscope Details →
                        </button>
                      </div>

                      {/* Active Scan Indicator */}
                      <div className="glass-card rounded-2xl p-6 border border-gold/15 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="font-serif text-lg font-bold text-purple-200">Active Reading</h3>
                          {activeScan ? (
                            <div className="space-y-2 border-l border-violet-light/35 pl-4 py-1">
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Scan Date</span>
                                <p className="text-sm text-purple-200">{activeScan.timestamp}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Traced Lines</span>
                                <p className="text-sm text-purple-200">6 Major Paths Scanned</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Confidence Rating</span>
                                <p className="text-sm font-bold text-emerald-400">{activeScan.scores.personality}% Alignment</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-purple-300/50 italic py-4">No palm reading captured yet.</p>
                          )}
                        </div>

                        {activeScan ? (
                          <button
                            onClick={() => setActiveTab("reading")}
                            className="mt-6 text-xs text-gold/80 hover:text-gold hover:underline font-semibold flex items-center gap-1"
                          >
                            Explore Palm Lines →
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsScanning(true)}
                            className="mt-6 text-xs text-gold hover:underline font-semibold"
                          >
                            Start Scan →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chatbot embedded block */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-bold">Planetary Remedies</h3>
                          <button onClick={() => setActiveTab("remedies")} className="text-xs text-gold hover:underline">
                            View All Remedies
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeScan?.remedies.slice(0, 2).map((rem, i) => (
                            <div key={i} className="glass-card-purple rounded-xl p-4 border border-violet-light/10 space-y-2">
                              <span className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase bg-gold/15 text-gold border border-gold/30 rounded">
                                {rem.type}
                              </span>
                              <h4 className="font-serif text-sm font-bold text-white">{rem.title}</h4>
                              <p className="text-xs text-purple-200/70 line-clamp-3">{rem.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Astrologer Chat widget */}
                      <div className="w-full">
                        <ChatBot activeReport={activeScan} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PALM READING DETAILS */}
                {activeTab === "reading" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold">Palm Line Insights</h2>
                        <p className="text-xs text-purple-200/60 mt-1">Detailed analysis of your traced major lines and mounts.</p>
                      </div>
                      {activeScan && (
                        <div className="flex gap-2">
                          <button
                            onClick={triggerPDFDownload}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-midnight bg-gold rounded-full shadow-md"
                          >
                            <Download className="h-3.5 w-3.5" />
                            PDF Export
                          </button>
                        </div>
                      )}
                    </div>

                    {activeScan ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT PANE: IMAGE PREVIEW & RADAR METRICS */}
                        <div className="space-y-6 lg:col-span-1">
                          <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col items-center">
                            <span className="text-xs text-gold/70 font-semibold mb-3">Scanned Image & Markings</span>
                            <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border border-gold/20 shadow-inner bg-midnight">
                              {activeScan.imageUrl ? (
                                <img src={activeScan.imageUrl} alt="Palm scan" className="w-full h-full object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-purple-300/40">
                                  No Camera capture (Demo Data)
                                </div>
                              )}
                              {/* Draw simulated lines over hand in CSS / SVG */}
                              <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center p-4">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-gold stroke-current stroke-[1.5] fill-none">
                                  {/* Simulated Heart Line (curves to mercury/jupiter) */}
                                  <path d="M 15,45 C 30,42 60,35 78,18" className="stroke-rose-500/80" />
                                  {/* Simulated Head Line (across palm) */}
                                  <path d="M 15,48 C 35,46 65,48 82,65" className="stroke-indigo-400/80" />
                                  {/* Simulated Life Line (around thumb mount) */}
                                  <path d="M 15,50 C 32,58 48,82 48,90" className="stroke-emerald-400/80" />
                                  {/* Simulated Fate Line (up the center) */}
                                  <path d="M 50,88 L 50,30" className="stroke-yellow-400/80" strokeDasharray="3,3" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="w-full mt-4 space-y-1.5 text-xs text-purple-200/70 pl-2">
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Traced Heart Line</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-400"></span> Traced Head Line</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Traced Life Line</div>
                              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-yellow-400"></span> Traced Fate Line</div>
                            </div>
                          </div>

                          {/* Metric indices */}
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4">
                            <h4 className="font-serif text-sm font-bold text-white border-b border-gold/10 pb-2">Destiny Scores</h4>
                            <div className="space-y-3">
                              {[
                                { label: "Confidence", val: activeScan.scores.confidence },
                                { label: "Leadership Core", val: activeScan.scores.leadership },
                                { label: "Creativity Index", val: activeScan.scores.creativity },
                                { label: "Communication Skill", val: activeScan.scores.communication },
                                { label: "Emotional Quotient", val: activeScan.scores.eq },
                              ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-xs text-purple-200/80">
                                    <span>{item.label}</span>
                                    <span className="font-bold text-gold">{item.val}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-violet-dark/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold transition-all" style={{ width: `${item.val}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT PANE: DETAILED INTERPRETATIONS */}
                        <div className="lg:col-span-2 space-y-6">
                          
                          {/* Lines Interpretations */}
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-6">
                            <h3 className="font-serif text-xl font-bold text-gold border-b border-gold/10 pb-3">Line Readings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {Object.entries(activeScan.lines).map(([key, value]: [string, any]) => (
                                <div key={key} className="space-y-2 border-l-2 border-violet-light/35 pl-4 py-1">
                                  <h4 className="font-serif text-base font-bold text-white">{value.name}</h4>
                                  <span className="inline-block text-[10px] text-gold font-semibold uppercase">{value.type}</span>
                                  <p className="text-xs text-purple-200/75 leading-relaxed">{value.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mounts Analysis */}
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-6">
                            <h3 className="font-serif text-xl font-bold text-gold border-b border-gold/10 pb-3">Palm Mounts Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {Object.entries(activeScan.mounts).map(([key, value]: [string, any]) => (
                                <div key={key} className="space-y-1">
                                  <div className="flex justify-between text-sm font-semibold text-white">
                                    <span>{value.name}</span>
                                    <span className="text-xs text-gold uppercase">{value.strength}</span>
                                  </div>
                                  <p className="text-xs text-purple-200/70 leading-relaxed">{value.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl p-12 text-center border border-gold/15 flex flex-col items-center">
                        <Sparkles className="h-12 w-12 text-gold animate-pulse mb-4" />
                        <h3 className="font-serif text-xl font-bold mb-2">No Active Reading</h3>
                        <p className="text-sm text-purple-200/60 max-w-sm mb-6">
                          To view your palm line readings, please perform a palm scan using your camera or upload a photo.
                        </p>
                        <button
                          onClick={() => setIsScanning(true)}
                          className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-midnight bg-gold rounded-xl shadow-md"
                        >
                          Scan Palm Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. HOROSCOPE & BIRTH CHART */}
                {activeTab === "horoscope" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-2xl font-bold">Zodiac Horoscope & Birth Chart</h2>
                        <p className="text-xs text-purple-200/60 mt-1">Compute details based on Vedic calculation values.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* INPUT CHART DETAILS */}
                      <div className="glass-card rounded-2xl p-6 border border-gold/15 h-fit">
                        <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-3 mb-4">Birth Configuration</h3>
                        
                        <form onSubmit={handleProfileSave} className="space-y-4">
                          <div>
                            <label className="block text-xs text-purple-200/70 font-semibold mb-1">Full Name</label>
                            <input
                              type="text"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full bg-midnight border border-gold/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/60"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-purple-200/70 font-semibold mb-1">Birth Date</label>
                              <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-midnight border border-gold/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/60"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-purple-200/70 font-semibold mb-1">Birth Time</label>
                              <input
                                type="time"
                                value={birthTime}
                                onChange={(e) => setBirthTime(e.target.value)}
                                className="w-full bg-midnight border border-gold/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/60"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-purple-200/70 font-semibold mb-1">Birth Place</label>
                            <input
                              type="text"
                              value={birthPlace}
                              onChange={(e) => setBirthPlace(e.target.value)}
                              className="w-full bg-midnight border border-gold/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/60"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 px-4 font-bold uppercase tracking-wider text-midnight bg-gold rounded-xl hover:bg-gold/90 transition-all text-xs"
                          >
                            Calculate Astral Chart
                          </button>
                        </form>
                      </div>

                      {/* OUTPUT CALCULATED DETAILS */}
                      <div className="lg:col-span-2 space-y-6">
                        {profile ? (
                          <>
                            {/* Astral Signs Card */}
                            <div className="glass-card-purple rounded-2xl p-6 border border-violet-light/35 grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Sun Sign (Zodiac)</span>
                                <h4 className="font-serif text-lg font-bold text-gold">{profile.zodiacSign}</h4>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Moon Sign</span>
                                <h4 className="font-serif text-lg font-bold text-purple-100">{profile.moonSign}</h4>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Rising Sign</span>
                                <h4 className="font-serif text-lg font-bold text-purple-100">{profile.risingSign}</h4>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Birth Number</span>
                                <h4 className="font-serif text-lg font-bold text-gold">{profile.birthNumber}</h4>
                              </div>
                            </div>

                            {/* Lucky Indicators Card */}
                            <div className="glass-card rounded-2xl p-6 border border-gold/15">
                              <h3 className="font-serif text-base font-bold text-gold border-b border-gold/10 pb-2 mb-4">Cosmic Numerology & Lucky Vectors</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-[10px] text-purple-300/60 uppercase block">Lucky Color</span>
                                  <span className="font-semibold text-white">{profile.luckyColor}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-purple-300/60 uppercase block">Lucky Number</span>
                                  <span className="font-semibold text-white">{profile.luckyNumber}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-purple-300/60 uppercase block">Lucky Day</span>
                                  <span className="font-semibold text-white">{profile.luckyDay}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-purple-300/60 uppercase block">Lucky Gemstone</span>
                                  <span className="font-semibold text-white">{profile.luckyGemstone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Daily Horoscope */}
                            {dailyHoroscope && (
                              <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4">
                                <h3 className="font-serif text-base font-bold text-gold border-b border-gold/10 pb-2">
                                  Daily Horoscope — {profile.zodiacSign}
                                </h3>

                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-cosmic/30 border border-gold/5 rounded-xl space-y-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-rose-300">💖 Love Compatibility</span>
                                        <span className="text-gold font-bold">{dailyHoroscope.love.score}%</span>
                                      </div>
                                      <p className="text-xs text-purple-200/70 leading-relaxed">{dailyHoroscope.love.desc}</p>
                                    </div>

                                    <div className="p-3 bg-cosmic/30 border border-gold/5 rounded-xl space-y-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-sky-300">💼 Professional Outlook</span>
                                        <span className="text-gold font-bold">{dailyHoroscope.career.score}%</span>
                                      </div>
                                      <p className="text-xs text-purple-200/70 leading-relaxed">{dailyHoroscope.career.desc}</p>
                                    </div>

                                    <div className="p-3 bg-cosmic/30 border border-gold/5 rounded-xl space-y-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-emerald-300">💰 Financial Alignment</span>
                                        <span className="text-gold font-bold">{dailyHoroscope.wealth.score}%</span>
                                      </div>
                                      <p className="text-xs text-purple-200/70 leading-relaxed">{dailyHoroscope.wealth.desc}</p>
                                    </div>

                                    <div className="p-3 bg-cosmic/30 border border-gold/5 rounded-xl space-y-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-orange-300">🔥 Vitality & Health</span>
                                        <span className="text-gold font-bold">{dailyHoroscope.health.score}%</span>
                                      </div>
                                      <p className="text-xs text-purple-200/70 leading-relaxed">{dailyHoroscope.health.desc}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="glass-card rounded-2xl p-8 text-center border border-gold/15">
                            Please configure and save your birth details first.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FUTURE PREDICTIONS */}
                {activeTab === "predictions" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Future Predictions & Metrics</h2>
                      <p className="text-xs text-purple-200/60 mt-1">Planetary aspects for upcoming career, relationships, and financial cycles.</p>
                    </div>

                    {activeScan ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* SCORES snapshots */}
                        <div className="space-y-6 lg:col-span-1">
                          {/* Financial Indices */}
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4">
                            <h3 className="font-serif text-base font-bold text-gold border-b border-gold/10 pb-2">Material Alignment</h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs text-purple-200/80 mb-1">
                                  <span>Financial Discipline</span>
                                  <span className="font-bold text-white">{activeScan.wealth.disciplineScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-violet-dark/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-gold" style={{ width: `${activeScan.wealth.disciplineScore}%` }}></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs text-purple-200/80 mb-1">
                                  <span>Risk Appetite</span>
                                  <span className="font-bold text-white">{activeScan.wealth.riskAppetite}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-violet-dark/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-gold" style={{ width: `${activeScan.wealth.riskAppetite}%` }}></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs text-purple-200/80 mb-1">
                                  <span>Long-term Wealth Potential</span>
                                  <span className="font-bold text-white">{activeScan.wealth.wealthPotential}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-violet-dark/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-gold animate-pulse" style={{ width: `${activeScan.wealth.wealthPotential}%` }}></div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-purple-200/70 border-t border-gold/10 pt-3 leading-relaxed mt-2">
                              {activeScan.wealth.guidance}
                            </p>
                          </div>

                          {/* Health tendencies */}
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4">
                            <h3 className="font-serif text-base font-bold text-gold border-b border-gold/10 pb-2">Vigor & Health Tendencies</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="bg-cosmic/30 border border-gold/5 p-2 rounded-xl">
                                <span className="text-[10px] text-purple-300/60 uppercase">Energy level</span>
                                <p className="text-base font-bold text-emerald-400">{activeScan.health.energyLevel}%</p>
                              </div>
                              <div className="bg-cosmic/30 border border-gold/5 p-2 rounded-xl">
                                <span className="text-[10px] text-purple-300/60 uppercase">Stress Tendency</span>
                                <p className="text-base font-bold text-orange-400">{activeScan.health.stressTendency}%</p>
                              </div>
                              <div className="bg-cosmic/30 border border-gold/5 p-2 rounded-xl">
                                <span className="text-[10px] text-purple-300/60 uppercase">Sleep Quality</span>
                                <p className="text-base font-bold text-purple-200">{activeScan.health.sleepQuality}%</p>
                              </div>
                              <div className="bg-cosmic/30 border border-gold/5 p-2 rounded-xl">
                                <span className="text-[10px] text-purple-300/60 uppercase">Mental Focus</span>
                                <p className="text-base font-bold text-sky-400">{activeScan.health.mentalFocus}%</p>
                              </div>
                            </div>
                            <p className="text-xs text-purple-200/70 border-t border-gold/10 pt-3 leading-relaxed">
                              {activeScan.health.tendencies}
                            </p>
                          </div>
                        </div>

                        {/* TIMELINE VIEW */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-6">
                            <h3 className="font-serif text-xl font-bold text-gold border-b border-gold/10 pb-3">Predicted Future Timeline</h3>
                            
                            <div className="relative border-l border-gold/25 pl-6 ml-4 space-y-6 py-2">
                              {/* 2026 */}
                              <div className="relative">
                                <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border border-gold bg-midnight flex items-center justify-center text-[8px] text-gold font-bold">
                                  ✨
                                </div>
                                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                  <span>2026</span>
                                  <span className="text-[10px] text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/25">Career Node</span>
                                </h4>
                                <p className="text-xs text-purple-200/70 mt-1">{activeScan.futureTimeline.year2026}</p>
                              </div>

                              {/* 2027 */}
                              <div className="relative">
                                <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border border-gold bg-midnight flex items-center justify-center text-[8px] text-gold font-bold">
                                  ✨
                                </div>
                                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                  <span>2027</span>
                                  <span className="text-[10px] text-rose-300 uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-400/25">Love Node</span>
                                </h4>
                                <p className="text-xs text-purple-200/70 mt-1">{activeScan.futureTimeline.year2027}</p>
                              </div>

                              {/* 2028 */}
                              <div className="relative">
                                <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border border-gold bg-midnight flex items-center justify-center text-[8px] text-gold font-bold">
                                  ✨
                                </div>
                                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                  <span>2028</span>
                                  <span className="text-[10px] text-emerald-300 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/25">Wealth Node</span>
                                </h4>
                                <p className="text-xs text-purple-200/70 mt-1">{activeScan.futureTimeline.year2028}</p>
                              </div>

                              {/* 2029 */}
                              <div className="relative">
                                <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border border-gold bg-midnight flex items-center justify-center text-[8px] text-gold font-bold">
                                  ✨
                                </div>
                                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                  <span>2029</span>
                                  <span className="text-[10px] text-purple-300 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-400/25">Vigor Node</span>
                                </h4>
                                <p className="text-xs text-purple-200/70 mt-1">{activeScan.futureTimeline.year2029}</p>
                              </div>

                              {/* 2030 */}
                              <div className="relative">
                                <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border border-gold bg-midnight flex items-center justify-center text-[8px] text-gold font-bold">
                                  ✨
                                </div>
                                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                  <span>2030</span>
                                  <span className="text-[10px] text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/25">Legacy Node</span>
                                </h4>
                                <p className="text-xs text-purple-200/70 mt-1">{activeScan.futureTimeline.year2030}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl p-12 text-center border border-gold/15">
                        Please perform a palm scan first to unlock future predictions.
                      </div>
                    )}
                  </div>
                )}

                {/* 5. VEDIC REMEDIES */}
                {activeTab === "remedies" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Vedic Remedies & Planetary Alignment</h2>
                      <p className="text-xs text-purple-200/60 mt-1">Recommended habits, charities, and mantras to restore planetary equilibrium.</p>
                    </div>

                    {activeScan ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeScan.remedies.map((rem, i) => (
                          <div key={i} className="glass-card rounded-2xl p-6 border border-gold/15 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="inline-flex px-2 py-0.5 text-[9.5px] font-bold uppercase bg-violet-light/10 text-violet-light border border-violet-light/35 rounded">
                                  {rem.type}
                                </span>
                                <Compass className="h-5 w-5 text-gold animate-spin-slow" />
                              </div>
                              <h3 className="font-serif text-lg font-bold text-white">{rem.title}</h3>
                              <p className="text-xs text-purple-200/70 leading-relaxed">{rem.description}</p>
                            </div>

                            {rem.mantra && (
                              <div className="bg-cosmic/40 border border-gold/10 rounded-xl p-3.5 mt-2">
                                <span className="text-[9px] uppercase font-bold tracking-wider text-gold block mb-1">Chant/Sanskrit Mantra</span>
                                <p className="text-xs text-purple-200 font-serif italic">{rem.mantra}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl p-12 text-center border border-gold/15">
                        Please perform a palm scan first to unlock personalized Vedic remedies.
                      </div>
                    )}
                  </div>
                )}

                {/* 6. ADVANCED PDF REPORT */}
                {activeTab === "reports" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Advanced Reports Console</h2>
                      <p className="text-xs text-purple-200/60 mt-1">Export high-grade astrology dossiers in vector PDF format.</p>
                    </div>

                    {activeScan ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Info Pane */}
                        <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-6 lg:col-span-1">
                          <div className="flex items-center gap-3">
                            <FileText className="h-7 w-7 text-gold" />
                            <div>
                              <h4 className="font-semibold text-white text-sm">PDF Document Details</h4>
                              <span className="text-[10px] text-purple-300/50">4 Vector Pages</span>
                            </div>
                          </div>

                          <div className="space-y-3 text-xs text-purple-200/80 pl-1 border-l border-gold/25">
                            <div>
                              <span className="text-[10px] text-purple-300/60 uppercase font-semibold">Report Structure</span>
                              <p className="mt-0.5">Cover Page, Palm Lines reading, Mounts & Career guidance, Health & Future predictions timeline.</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-purple-300/60 uppercase font-semibold">License Tier</span>
                              {subStatus === "premium" ? (
                                <p className="text-emerald-400 font-bold uppercase">PREMIUM ACTIVE</p>
                              ) : (
                                <p className="text-gold font-bold uppercase">FREE DEMO MODE</p>
                              )}
                            </div>
                          </div>

                          {subStatus === "premium" ? (
                            <button
                              onClick={triggerPDFDownload}
                              className="w-full py-3 px-4 font-bold uppercase tracking-wider text-midnight bg-gold rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-xs"
                            >
                              <Download className="h-4 w-4" />
                              Download Vector PDF
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3.5 text-xs text-gold flex gap-2">
                                <Crown className="h-5 w-5 shrink-0 fill-gold mt-0.5" />
                                <div>
                                  <span className="font-bold block">Upgrade Required</span>
                                  PDF Exports are locked under the Premium Access tier. Upgrade via the header menu.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Document Mockup View */}
                        <div className="lg:col-span-2 glass-card-purple rounded-2xl p-6 border border-violet-light/35 flex flex-col items-center justify-center text-center py-12 relative overflow-hidden">
                          {/* Simulated document layout representation */}
                          <div className="border border-gold/25 w-48 h-64 bg-midnight rounded p-3 text-left space-y-4 shadow-xl select-none scale-90 sm:scale-100 transition-all opacity-80 hover:opacity-100">
                            {/* Header decoration */}
                            <div className="border-b border-gold/15 pb-1 flex justify-between items-center text-[7px] text-gold font-semibold uppercase">
                              <span>Jyotish AI</span>
                              <span>Destiny Report</span>
                            </div>
                            
                            {/* Sacred symbol representation */}
                            <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-gold/30 flex items-center justify-center text-gold text-xs">
                              ☸
                            </div>

                            {/* Lines */}
                            <div className="space-y-2">
                              <div className="h-1.5 w-2/3 bg-gold/20 rounded"></div>
                              <div className="h-1.5 w-full bg-purple-200/10 rounded"></div>
                              <div className="h-1.5 w-full bg-purple-200/10 rounded"></div>
                              <div className="h-1.5 w-4/5 bg-purple-200/10 rounded"></div>
                            </div>

                            {/* Seal */}
                            <div className="pt-4 border-t border-gold/10 flex justify-between items-end">
                              <div className="h-2 w-10 bg-gold/15 rounded"></div>
                              <span className="text-[5px] text-purple-200/35">entertainment purposes only</span>
                            </div>
                          </div>

                          <span className="text-xs text-purple-200/50 mt-6 block">Document Print Preview</span>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl p-12 text-center border border-gold/15">
                        Please perform a palm scan first to generate a printable destiny dossier.
                      </div>
                    )}
                  </div>
                )}

                {/* 7. READING HISTORY */}
                {activeTab === "history" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-2xl font-bold">Palm Scan History</h2>
                        <p className="text-xs text-purple-200/60 mt-1">Reload or compare past cosmic alignments.</p>
                      </div>
                      {scans.length > 0 && (
                        <button
                          onClick={async () => {
                            if (confirm("Clear all scan history?")) {
                              localStorage.removeItem("jyotish_ai_palm_scans");
                              await loadData();
                            }
                          }}
                          className="text-xs text-rose-400 hover:underline"
                        >
                          Clear All Scans
                        </button>
                      )}
                    </div>

                    {scans.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scans.map((scan) => {
                          const isActive = activeScan?.scanId === scan.scanId;
                          return (
                            <div
                              key={scan.id}
                              className={`glass-card rounded-2xl p-5 border flex justify-between items-center transition-all ${
                                isActive ? "border-gold bg-gold/5" : "border-gold/15"
                              }`}
                            >
                              <div className="space-y-1.5">
                                <h3 className="font-serif text-base font-bold text-white">Scan ID: {scan.scanId}</h3>
                                <p className="text-xs text-purple-200/60">Scanned on: {scan.timestamp}</p>
                                <div className="flex gap-2 text-[10px] mt-2">
                                  <span className="bg-violet-dark/40 text-violet-light px-2.5 py-0.5 rounded border border-violet-light/20">
                                    {scan.scores.personality}% Alignment
                                  </span>
                                  {isActive && (
                                    <span className="bg-gold/15 text-gold px-2 py-0.5 rounded border border-gold/30 font-semibold uppercase">
                                      Active Reading
                                    </span>
                                  )}
                                </div>
                              </div>

                              {!isActive && (
                                <button
                                  onClick={() => {
                                    setActiveScan(scan);
                                    canvasConfetti({
                                      particleCount: 30,
                                      spread: 40,
                                      colors: ["#E6B85C", "#7E5BEF"],
                                    });
                                  }}
                                  className="text-xs font-bold text-gold hover:underline"
                                >
                                  Load Reading
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl p-12 text-center border border-gold/15">
                        No previous readings recorded. Try performing your first palm reading!
                      </div>
                    )}
                  </div>
                )}

                {/* 8. COMMUNITY FORUM */}
                {activeTab === "community" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Astrology Community Circle</h2>
                      <p className="text-xs text-purple-200/60 mt-1">Discuss configurations, remedies, and alignment with fellow seekers.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* POSTS LIST */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* CREATE POST FORM */}
                        <form onSubmit={handleCreatePost} className="glass-card rounded-2xl p-4 border border-gold/15 space-y-3">
                          <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder="Share an insight from your palm scan or ask a question about planetary transits..."
                            rows={3}
                            className="w-full bg-midnight/80 border border-gold/15 rounded-xl p-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all"
                          />
                          <div className="flex justify-between items-center">
                            {activeScan ? (
                              <span className="text-[10px] text-gold flex items-center gap-1">
                                <Check className="h-3 w-3 text-emerald-400" />
                                Attach active scan results
                              </span>
                            ) : (
                              <span className="text-[10px] text-purple-300/45">No scan attached</span>
                            )}
                            
                            <button
                              type="submit"
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-midnight bg-gold rounded-lg shadow-md"
                            >
                              Publish Insight
                            </button>
                          </div>
                        </form>

                        {/* FEEDS */}
                        <div className="space-y-4">
                          {posts.map((post) => (
                            <div key={post.id} className="glass-card rounded-2xl p-5 border border-gold/15 space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gold">{post.author}</span>
                                <span className="text-purple-300/50">{post.date}</span>
                              </div>
                              <p className="text-sm text-purple-200/80 leading-relaxed">{post.text}</p>
                              
                              {post.sharedScan && (
                                <div className="bg-cosmic/30 border border-gold/10 p-3 rounded-xl flex justify-between items-center">
                                  <span className="text-xs text-gold font-serif">Shared Palm Matrix Tracing</span>
                                  <span className="text-[10px] bg-gold/10 text-gold px-2.5 py-0.5 rounded border border-gold/25">
                                    {post.sharedScan.line || `${post.sharedScan.score}% Match`}
                                  </span>
                                </div>
                              )}

                              <div className="flex gap-4 pt-3 border-t border-gold/10 text-xs text-purple-200/60">
                                <button className="hover:text-gold transition-colors">👍 {post.likes} Likes</button>
                                <button className="hover:text-gold transition-colors">💬 {post.comments} Comments</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SIDEBAR WIDGETS */}
                      <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-5 border border-gold/15 space-y-4">
                          <h3 className="font-serif text-base font-bold text-white border-b border-gold/10 pb-2">Trending Astrology Queries</h3>
                          <ul className="space-y-2 text-xs text-purple-200/80">
                            <li>
                              <a href="#" className="hover:text-gold transition-colors">#HeadLineForkMeaning</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-gold transition-colors">#SaturnMountRemedy</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-gold transition-colors">#TransitOfJupiter2026</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-gold transition-colors">#LuckyGemstoneAdvice</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. USER PROFILE */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">User Profile & Subscription Console</h2>
                      <p className="text-xs text-purple-200/60 mt-1">Manage details, licensing tier, and database preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Subscription Status Card */}
                      <div className="glass-card rounded-2xl p-6 border border-gold/15 space-y-6">
                        <h3 className="font-serif text-lg font-bold text-gold border-b border-gold/10 pb-2">Plan Details</h3>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-purple-300/60 uppercase block">Licensing Tier</span>
                            <span className="font-bold text-lg text-white uppercase">{subStatus === "premium" ? "Premium Access" : "Free Tier"}</span>
                          </div>
                          <Crown className={`h-8 w-8 ${subStatus === "premium" ? "text-gold fill-gold animate-bounce" : "text-purple-300/40"}`} />
                        </div>

                        <div className="text-xs text-purple-200/80 space-y-2">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={subStatus === "premium" ? "text-emerald-400 font-semibold" : "text-purple-300"}>
                              {subStatus === "premium" ? "Active (Simulated Stripe)" : "Trial / Limitations Active"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Scans Limitation:</span>
                            <span>{subStatus === "premium" ? "Unlimited Scans (Vision Nodes)" : "1 Basic Scan per week"}</span>
                          </div>
                        </div>

                        {subStatus !== "premium" && (
                          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-xs text-gold leading-relaxed">
                            <span className="font-bold block mb-1">Cosmic Expansion Pack</span>
                            Upgrade your plan in the top navigation bar to unlock unlimited scans, chatbot messages, and vector reports.
                          </div>
                        )}
                      </div>

                      {/* Developer Sandbox Options */}
                      <div className="glass-card-purple rounded-2xl p-6 border border-violet-light/35 space-y-6">
                        <h3 className="font-serif text-lg font-bold text-white border-b border-violet-light/20 pb-2">Developer Tools</h3>
                        
                        <div className="space-y-4 text-xs">
                          <div className="p-3 bg-midnight/60 rounded-lg space-y-1">
                            <span className="font-bold block text-purple-200">Supabase Connection State</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`h-2.5 w-2.5 rounded-full ${isSupabaseConfigured ? "bg-emerald-500" : "bg-orange-500"}`}></span>
                              <span className="font-semibold">{isSupabaseConfigured ? "Connected (Real DB)" : "Demo Sandbox (LocalStorage Fallback)"}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-semibold block text-purple-200">Reset Local Storage Sandbox</span>
                            <p className="text-purple-300/70">Wipe all cached database scans, horoscopes, and chat records.</p>
                            <button
                              onClick={() => {
                                if (confirm("Wipe all local simulated DB cache?")) {
                                  localStorage.clear();
                                  alert("Cache cleared successfully! Reloading...");
                                  window.location.reload();
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-800/40 rounded-xl transition-all font-semibold"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Reset Workspace Cache
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
