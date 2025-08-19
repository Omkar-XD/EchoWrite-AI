import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";  // ✅ import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echowrite - AI Writing Assistant",
  description: "Streamline your writing with AI-powered tools by Echowrite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-white`}
      >
        <AuthProvider>
          {/* Navbar is in charge of hiding itself */}
          <Navbar />

          {/* Main content */}
          <main className="pt-14">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
