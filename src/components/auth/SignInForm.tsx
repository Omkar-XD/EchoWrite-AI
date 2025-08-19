"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/transcribe"); // Redirect after login
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/transcribe");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-black p-6 rounded-lg shadow-lg space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white">Sign In</h2>
      
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
        disabled={loading}
        className="w-full bg-[#00E5FF] hover:bg-[#00c4e5] text-black font-semibold py-2 rounded"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full border border-gray-600 hover:bg-gray-800 text-white font-semibold py-2 rounded"
      >
        Sign in with Google
      </button>

      <p className="text-gray-400 text-sm">
        Don't have an account? <a href="/signup" className="text-[#00E5FF] hover:underline">Sign Up</a>
      </p>
    </form>
  );
}
