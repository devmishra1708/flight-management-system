"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/src/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();

  const handleLogout =
    async () => {
      await supabase.auth.signOut();

      router.push("/login");
    };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link
        href="/flights"
        className="text-2xl font-bold text-blue-400"
      >
        SkyBooker
      </Link>

      <div className="flex gap-6 items-center">
        <Link
          href="/flights"
          className="hover:text-blue-400"
        >
          Flights
        </Link>

        <Link
          href="/my-bookings"
          className="hover:text-blue-400"
        >
          My Bookings
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}