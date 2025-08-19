"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/transcribe");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="bg-black p-6 rounded-lg shadow-lg space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white">Sign Up</h2>
      
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 rounded bg-gray-900 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded bg-gray-900 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-[#00E5FF] hover:bg-[#00c4e5] text-black font-semibold py-2 rounded"
      >
        Sign Up
      </button>

      <p className="text-gray-400 text-sm">
        Already have an account? <a href="/signin" className="text-[#00E5FF] hover:underline">Sign In</a>
      </p>
    </form>
  );
}
