"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";

const features = [
  {
    img: "/assets/cr1.png",
    title: "YouTube Video Transcription",
    text: "Convert any YouTube video link into accurate text instantly."
  },
  {
    img: "/assets/cr2.png",
    title: "Multi-Language Support",
    text: "Detects the original language & allows translation to English."
  },
  {
    img: "/assets/cr3.png",
    title: "AI Summary",
    text: "Generate quick, human-readable summaries of transcripts."
  },
  {
    img: "/assets/cr4.png",
    title: "Download Options",
    text: "Save transcripts as TXT or CSV instantly."
  },
  {
    img: "/assets/cr5.png",
    title: "Copy to Clipboard",
    text: "Instantly copy transcript text with one click."
  },
  {
    img: "/assets/cr6.png",
    title: "User Profiles",
    text: "Sign in to save and manage your transcription history."
  },
  {
    img: "/assets/cr7.png",
    title: "Contact Form",
    text: "Easily reach us for support or inquiries."
  },
  {
    img: "/assets/cr8.png",
    title: "Clean & Simple UI",
    text: "Enjoy a fast and distraction-free experience."
  }
];

export default function FullWidthFeatureCarousel() {
  return (
    <section className="py-20 bg-[#0d1117] text-white overflow-hidden">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-b from-[#00E5FF] to-[#007E92] drop-shadow-[0_0_15px_#00E5FF]"
      >
        Features Highlight
      </motion.h2>

      {/* Carousel */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="max-w-5xl mx-auto"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center px-8"
            >
              <Image
                src={feature.img}
                alt={feature.title}
                width={1500}
                height={1200}
                className="mb-6 drop-shadow-[0_0_15px_#00E5FF] rounded-xl"
              />
              <h3 className="text-3xl font-semibold mb-4 drop-shadow-[0_0_15px_#00E5FF]">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {feature.text}
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
