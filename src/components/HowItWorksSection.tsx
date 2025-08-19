"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Paste YouTube Link",
    text: "Copy the URL of the video you want to transcribe.",
    img: "https://img.icons8.com/color/96/link.png"
  },
  {
    step: "2",
    title: "Click Transcribe",
    text: "Our AI starts processing instantly.",
    img: "https://img.icons8.com/color/96/play-button-circled.png"
  },
  {
    step: "3",
    title: "Get Transcript",
    text: "Download or translate in one click.",
    img: "https://img.icons8.com/color/96/download-2.png"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-[#0d1117] text-white px-6">
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
        How It Works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-10 bg-white/5 border border-white/10 rounded-2xl 
                       backdrop-blur-lg text-center 
                       hover:scale-105 transition-transform duration-300"
          >
            <img src={step.img} alt={step.title} className="mx-auto mb-6 w-20 h-20" />
            <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-300 text-lg">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
