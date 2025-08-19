"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; // 🔹 import AuthContext
import { signOutUser } from "@/lib/auth";        // 🔹 Firebase signOut

interface NavItem {
  name: string;
  url?: string;
  isButton?: boolean;
  action?: () => void;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth(); // 🔹 get logged-in user
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState<string>("/");

  // ✅ Always run hooks first, then decide render
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide navbar on auth pages
  const noNavbarPaths = ["/signin", "/signup"];
  if (noNavbarPaths.includes(pathname)) {
    return null;
  }

  // Nav items change depending on auth state
  const navItems: NavItem[] = user
    ? [
        { name: "Home", url: "/" },
        { name: "Transcribe", url: "/transcribe" },
        { name: "Profile", url: "/profile" },
        {
          name: "Logout",
          action: async () => {
            await signOutUser();
            router.push("/signin");
          },
        },
      ]
    : [
        { name: "Home", url: "/" },
        { name: "Features", url: "#features" },
        { name: "How It Works", url: "#how-it-works" },
        { name: "Contact", url: "#contact" },
        { name: "Sign In", url: "/signin" },
        { name: "Sign Up", url: "/signup", isButton: true },
      ];

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.action) {
      e.preventDefault();
      item.action();
      return;
    }
    if (item.url?.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(item.url);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setActive(item.url);
      }
    } else if (item.url) {
      setActive(item.url);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-lg border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo2.png"
            alt="Echowrite Logo"
            width={180}
            height={100}
            priority
          />
        </Link>

        {/* Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = active === item.url || pathname === item.url;

              if (item.isButton) {
                return (
                  <Link
                    key={item.name}
                    href={item.url!}
                    onClick={(e) => handleNavClick(e, item)}
                    className="px-4 py-1.5 rounded-full font-semibold bg-[#00E5FF] text-black hover:bg-[#00c4e5] transition-colors shadow-md shadow-[#00E5FF]/40 hover:shadow-lg hover:shadow-[#00E5FF]/60 text-sm"
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(e, item)}
                    className="relative cursor-pointer text-sm font-medium px-3 py-1.5 rounded-full transition-colors text-gray-300 hover:text-[#00E5FF]"
                  >
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.url || "#"}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    "relative cursor-pointer text-sm font-medium px-3 py-1.5 rounded-full transition-colors",
                    "text-gray-300 hover:text-[#00E5FF]",
                    isActive && "text-[#00E5FF]"
                  )}
                >
                  {item.name}
                  {isActive && item.url && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-[#00E5FF]/10 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
