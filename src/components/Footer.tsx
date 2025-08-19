export default function Footer() {
  return (
    <footer className="relative bg-[#0d1117] border-t border-[#00E5FF]/30 overflow-hidden">
      {/* Glow background effect */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#00E5FF]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-[#00E5FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative text-center text-gray-300 py-6">
        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <a
            href="#support"
            className="hover:text-[#00E5FF] transition-colors duration-300 hover:drop-shadow-[0_0_8px_#00E5FF]"
          >
            Support
          </a>
          <a
            href="#help"
            className="hover:text-[#00E5FF] transition-colors duration-300 hover:drop-shadow-[0_0_8px_#00E5FF]"
          >
            Help Center
          </a>
          <a
            href="#contact"
            className="hover:text-[#00E5FF] transition-colors duration-300 hover:drop-shadow-[0_0_8px_#00E5FF]"
          >
            Contact Us
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © 2025 <span className="text-[#00E5FF]">Echowrite.ai</span> • Powered by{" "}
          <span className="text-[#00E5FF]">Omkar Chavan</span>
        </p>
      </div>
    </footer>
  );
}
