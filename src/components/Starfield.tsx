"use client";

import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      fadeSpeed: number;
      direction: number;
    }

    const stars: Star[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.05 + 0.01,
      opacity: Math.random(),
      fadeSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw a subtle radial purple/blue glow in the center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, "rgba(23, 7, 39, 0.4)");
      gradient.addColorStop(0.5, "rgba(12, 3, 22, 0.2)");
      gradient.addColorStop(1, "rgba(5, 5, 5, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach((star) => {
        // Twinkle
        star.opacity += star.fadeSpeed;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.fadeSpeed = -Math.abs(star.fadeSpeed);
        } else if (star.opacity < 0.1) {
          star.opacity = 0.1;
          star.fadeSpeed = Math.abs(star.fadeSpeed);
        }

        // Slow drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // Reset shadow for performance
      ctx.shadowBlur = 0;

      // Draw slow rotating sacred geometry in the background
      ctx.strokeStyle = "rgba(230, 184, 92, 0.015)";
      ctx.lineWidth = 1;
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-50 pointer-events-none" />;
}
