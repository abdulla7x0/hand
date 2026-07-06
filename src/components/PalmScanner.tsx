"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Upload, Sparkles, Check, Info } from "lucide-react";
import { generatePalmAnalysis } from "@/utils/astrologyData";
import { localDB } from "@/lib/supabase";

interface PalmScannerProps {
  onScanComplete: (report: any) => void;
  onCancel: () => void;
}

export default function PalmScanner({ onScanComplete, onCancel }: PalmScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [step, setStep] = useState<"camera-prompt" | "scanning" | "processing" | "complete">("camera-prompt");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Initializing Sacred Geometry...");
  const [progress, setProgress] = useState(0);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setStep("scanning");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please upload a photo of your palm instead.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  // Capture Image
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame to square canvas
    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    canvas.width = 500;
    canvas.height = 500;
    
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 500, 500);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    stopCamera();
    startProcessing();
  };

  // Handle File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        startProcessing();
      }
    };
    reader.readAsDataURL(file);
  };

  // Run AI Processing Animation
  const startProcessing = () => {
    setStep("processing");
    setProgress(0);

    const statuses = [
      { text: "Locating palm boundaries...", p: 15 },
      { text: "Mapping Mount of Jupiter (ambition)...", p: 30 },
      { text: "Tracing Heart Line (emotional core)...", p: 45 },
      { text: "Decoding Head Line (intellectual focus)...", p: 60 },
      { text: "Analyzing Life Line & energy currents...", p: 75 },
      { text: "Calculating planetary aspects & future vectors...", p: 90 },
      { text: "Synthesizing full Destiny Profile...", p: 100 }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < statuses.length) {
        setProcessingStatus(statuses[currentIdx].text);
        setProgress(statuses[currentIdx].p);
        currentIdx++;
      } else {
        clearInterval(interval);
        completeAnalysis();
      }
    }, 1200);
  };

  // Complete analysis and save report
  const completeAnalysis = async () => {
    setStep("complete");
    // Generate beautiful custom reading report
    const report = generatePalmAnalysis(capturedImage || undefined);
    
    // Save report to our local database
    const saved = await localDB.saveScan(report);
    
    setTimeout(() => {
      onScanComplete(saved);
    }, 800);
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-3xl border border-gold/30 overflow-hidden shadow-2xl">
      {/* Header banner */}
      <div className="bg-cosmic/80 border-b border-gold/15 p-4 text-center">
        <h4 className="font-serif text-lg font-bold text-gold uppercase tracking-wider flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-gold animate-pulse" />
          Destiny Palm Scanner
        </h4>
        <p className="text-xs text-purple-200/60 mt-1">
          Alignment guidance overlay. Keep your hand flat with fingers parted.
        </p>
      </div>

      <div className="p-6">
        {step === "camera-prompt" && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
            <div className="relative h-28 w-28 flex items-center justify-center rounded-full border border-dashed border-gold/40 bg-gold/5">
              <Camera className="h-12 w-12 text-gold animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-dashed border-violet-light/30 animate-spin-slow"></div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-serif text-xl font-bold text-white">Select Capture Method</h5>
              <p className="text-sm text-purple-200/70 max-w-sm">
                Place your hand in front of the camera or upload a clear photo of your left or right palm in bright lighting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold uppercase tracking-wider text-midnight bg-gold hover:bg-gold/90 transition-all rounded-xl cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                Start Live Camera
              </button>

              <label className="flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold uppercase tracking-wider text-purple-200 hover:text-white bg-violet-dark/30 hover:bg-violet-dark/50 border border-violet-light/40 hover:border-gold/60 rounded-xl transition-all cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                {cameraError}
              </p>
            )}
          </div>
        )}

        {step === "scanning" && (
          <div className="relative flex flex-col items-center">
            {/* Camera Viewport */}
            <div className="relative w-full aspect-square max-w-[380px] rounded-2xl overflow-hidden border-2 border-gold/30 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Hand Outline Overlay SVG */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 text-gold/30">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full max-w-[300px] text-gold/25 stroke-[1] fill-none stroke-current animate-pulse-slow"
                >
                  {/* Outer Sacred Circles */}
                  <circle cx="50" cy="50" r="48" strokeDasharray="3,3" />
                  <circle cx="50" cy="50" r="44" opacity="0.5" />
                  {/* Palm Outline Path */}
                  <path d="M 50,92 C 45,92 40,88 38,82 C 34,75 28,68 25,60 C 22,53 15,48 18,42 C 20,38 25,41 29,46 C 26,30 25,20 28,15 C 30,12 34,13 36,17 C 38,24 40,32 41,38 C 39,20 40,10 44,7 C 46,5 50,6 51,10 C 53,18 53,28 54,36 C 54,18 56,10 59,8 C 61,6 65,7 66,11 C 67,20 66,30 66,39 C 67,24 69,18 73,16 C 75,15 78,17 78,21 C 78,30 75,42 74,50 C 77,50 81,52 82,56 C 84,65 80,75 75,81 C 70,86 66,90 58,91 C 55,92 52,92 50,92 Z" />
                </svg>
              </div>

              {/* Alignment guides text */}
              <div className="absolute bottom-4 inset-x-0 mx-auto w-fit bg-midnight/80 backdrop-blur-sm border border-gold/20 px-3 py-1 rounded-full text-[10px] text-gold flex items-center gap-1.5 shadow-md">
                <Info className="h-3 w-3" />
                Align hand flat, fingers apart
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 w-full mt-6 justify-center">
              <button
                onClick={captureImage}
                className="flex items-center justify-center gap-2 py-2.5 px-6 font-bold uppercase tracking-wider text-midnight bg-gold hover:bg-gold/90 transition-all rounded-xl"
              >
                Capture Scan
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setStep("camera-prompt");
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-purple-200 bg-violet-dark/30 hover:bg-violet-dark/50 border border-violet-light/30 rounded-xl transition-all"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
            {/* Image Preview with Scanning Laser Line */}
            {capturedImage && (
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-[0_0_20px_rgba(230,184,92,0.25)]">
                <img src={capturedImage} alt="Captured Palm" className="w-full h-full object-cover" />
                
                {/* Laser scan bar */}
                <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_15px_#E6B85C] animate-scan" />
              </div>
            )}

            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-xs text-purple-200/80">
                <span>AI Astrology Node Analysis</span>
                <span>{progress}%</span>
              </div>
              {/* Progress bar container */}
              <div className="h-2 w-full bg-violet-dark/30 border border-violet-light/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-light to-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gold/90 font-serif italic tracking-wide animate-pulse mt-2">
                &ldquo;{processingStatus}&rdquo;
              </p>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Check className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h5 className="font-serif text-lg font-bold text-white">Destiny Report Synthesized</h5>
              <p className="text-xs text-purple-200/60">
                Your astrology and palm lines have aligned. Opening dashboard...
              </p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
