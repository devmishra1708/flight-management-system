"use client";

import { useState } from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const handleLogin =
    async () => {
      setLoading(true);

      const {
        error,
      } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      router.push("/flights");
    };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/icon-192.png"
            alt="Logo"
            className="w-20 h-20 mb-3"
          />

          <h1 className="text-3xl font-bold">
            Login
          </h1>

          <p className="text-gray-400 mt-2">
            Access your bookings
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?
          {" "}

          <Link
            href="/signup"
            className="text-blue-400 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}