"use client";

import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Squares } from "@/components/ui/squares-background";
import HeroSection from "@/components/HeroSection";
import FeatureHighlight from "@/components/FeatureHighlight";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      {/* Hero Section */}
      <HeroSection />

{/* Feature Highlight Section */}
      <FeatureHighlight />

      {/* Features Section */}
      <FeaturesSection />

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
