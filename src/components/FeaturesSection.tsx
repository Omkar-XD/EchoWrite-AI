"use client";

import { motion } from "framer-motion";
import { Rocket, Zap, Bot, Languages } from "lucide-react";

const features = [
  {
  icon: <Zap className="w-8 h-8 text-[#00E5FF]" />,
  title: "Fast",
  text: "Lightning-speed transcription powered by AI.",
  img: "/assets/speed.png"
},
  {
    icon: <Rocket className="w-8 h-8 text-[#00E5FF]" />,
    title: "Free",
    text: "Enjoy our service without any cost.",
    img: "https://img.icons8.com/color/96/free-shipping.png"
  },
  {
    icon: <Bot className="w-8 h-8 text-[#00E5FF]" />,
    title: "AI Accuracy",
    text: "Cutting-edge AI ensures precise transcripts.",
    img: "https://img.icons8.com/color/96/artificial-intelligence.png"
  },
  {
    icon: <Languages className="w-8 h-8 text-[#00E5FF]" />,
    title: "Multi-Language",
    text: "Supports over 50+ languages seamlessly.",
    img: "https://img.icons8.com/color/96/language.png"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[#0d1117] text-white px-6">
      <motion.h2
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-4xl font-bold text-center mb-12 
             bg-clip-text text-transparent 
             bg-gradient-to-b from-[#00E5FF] to-[#007E92]
             drop-shadow-[0_0_8px_#00E5FF] 
             md:drop-shadow-[0_0_12px_#00E5FF]"
>
  Features
</motion.h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center justify-start p-8 min-h-[280px] bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold mb-2 text-[#00E5FF]">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-[220px]">
              {feature.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
