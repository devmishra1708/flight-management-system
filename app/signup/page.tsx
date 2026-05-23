"use client";

import { useState } from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const handleSignup =
    async () => {
      setLoading(true);

      const {
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert(
        "Account created successfully"
      );

      router.push("/login");
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
            Create Account
          </h1>

          <p className="text-gray-400 mt-2">
            Signup to continue
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
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?
          {" "}

          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}