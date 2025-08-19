"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#0d1117] text-white px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        
        {/* Left Side - Contact Info */}
        <div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#63E0FF] via-[#6A5AF9] to-[#9B5FFF] text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(147,197,253,0.7)]">
            Let's Talk
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8 drop-shadow-[0_0_8px_rgba(147,197,253,0.4)]">
            I'm always open to discussing new opportunities, creative projects, or just having a friendly chat about technology and development. I typically respond within 24 hours.
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl drop-shadow-[0_0_8px_rgba(147,197,253,0.25)] hover:bg-white/10 transition">
              <Mail className="w-6 h-6 text-[#9b5fff]" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="text-gray-300 leading-relaxed">
                  omkarchavan21k@gmail.com
                </p>
              </div>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/Omkar-XD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/5 p-4 rounded-xl drop-shadow-[0_0_8px_rgba(147,197,253,0.25)] hover:bg-white/10 transition"
            >
              <Github className="w-6 h-6 text-[#9b5fff]" />
              <div>
                <p className="font-semibold text-white">GitHub</p>
                <p className="text-gray-300 leading-relaxed">
                  github.com/Omkar-XD
                </p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/omkar-chavan-8b59a8334/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/5 p-4 rounded-xl drop-shadow-[0_0_8px_rgba(147,197,253,0.25)] hover:bg-white/10 transition"
            >
              <Linkedin className="w-6 h-6 text-[#9b5fff]" />
              <div>
                <p className="font-semibold text-white">LinkedIn</p>
                <p className="text-gray-300 leading-relaxed">
                  linkedin.com/in/omkar-chavan-8b59a8334
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          action="https://api.web3forms.com/submit"
          method="POST"
          className="bg-white/5 p-8 rounded-2xl backdrop-blur-lg border border-white/10 space-y-6"
        >
          {/* API key from .env */}
          <input
            type="hidden"
            name="access_key"
            value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY}
          />
          <input
            type="hidden"
            name="email"
            value="omkarchavan21k@gmail.com"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-4 rounded-lg bg-black/30 border border-white/20 text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full p-4 rounded-lg bg-black/30 border border-white/20 text-white"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="What's this about?"
            className="w-full p-4 rounded-lg bg-black/30 border border-white/20 text-white"
          />

          <textarea
            name="message"
            placeholder="Tell me about your project or just say hello..."
            rows={4}
            required
            className="w-full p-4 rounded-lg bg-black/30 border border-white/20 text-white"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-[#6a5af9] to-[#9b5fff] hover:opacity-90 transition-all duration-300"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
}
