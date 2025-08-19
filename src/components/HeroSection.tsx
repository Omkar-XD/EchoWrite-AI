"use client";

import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; dx: number; dy: number }[] = [];
    const particleCount = 50;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full text-white py-20 px-6 md:px-12 lg:px-20 z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
        
        {/* Left Content */}
        <div className="flex-1 relative z-10 space-y-6 overflow-hidden">
          <ParticleBackground />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-b from-[#00E5FF] to-[#007E92] 
                       hover:from-[#00fff7] hover:to-[#00b8c6] 
                       transition-all duration-500 ease-in-out 
                       hover:scale-[1.02] cursor-pointer"
          >
            Transcribe YouTube Videos Instantly with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10 text-lg text-gray-300 max-w-xl leading-relaxed"
          >
            Convert any video into text effortlessly, with AI-powered precision.
            Download your transcripts in one click and save hours of work.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 mt-6 flex flex-wrap gap-4"
          >
            <Link
              href="/signin" // ✅ Redirects to Sign In page
              className="px-6 py-3 rounded-full font-semibold bg-[#00E5FF] text-black 
                         hover:bg-[#00c4e5] transition-all duration-300 
                         shadow-md shadow-[#00E5FF]/40 hover:shadow-[#00E5FF]/80
                         hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               translate-x-[-100%] group-hover:translate-x-[100%] 
                               transition-transform duration-500" />
            </Link>
            <Link
              href="/learn-more"
              className="px-6 py-3 rounded-full font-semibold border border-[#00E5FF] text-[#00E5FF] 
                         hover:bg-[#00E5FF]/10 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Mini Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-10 mt-6 flex flex-wrap gap-6 text-sm text-gray-400"
          >
            {[{ label: "Fast", icon: "⚡" },
              { label: "Free", icon: "💸" },
              { label: "AI Accuracy", icon: "🤖" }
            ].map((feature, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer"
              >
                <span className="text-lg">{feature.icon}</span> {feature.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex-1 w-full relative h-[500px]"
        >
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

          {/* Glow aura layers */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/30 blur-3xl animate-slowspin"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl animate-slowspin-reverse"></div>
          </div>

          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full relative z-10"
          />
        </motion.div>
      </div>
    </section>
  );
}
