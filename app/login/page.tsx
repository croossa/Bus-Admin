"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Bus, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Invalid Password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
            <div className="bg-black text-white p-3 rounded-xl">
                <Bus size={32} />
            </div>
        </div>

        <h1 className="text-2xl font-black text-center text-slate-900 mb-2">Admin Login</h1>
        <p className="text-center text-slate-500 mb-8">Enter your secure password to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <button 
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all flex justify-center items-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
            </button>
        </form>
      </div>
    </div>
  );
}
