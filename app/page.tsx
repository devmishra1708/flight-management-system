import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      
      

      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        
        <img
          src="/icon-512.png"
          alt="Flight Logo"
          className="w-40 h-40 mb-8"
        />

        <h1 className="text-6xl font-bold max-w-4xl leading-tight">
          Smart Flight Booking
          <span className="text-blue-400">
            {" "}Management System
          </span>
        </h1>

        <p className="mt-6 text-gray-300 text-xl max-w-2xl">
          Real-time flight booking platform built with
          Next.js Supabase and Zustand featuring
          seat selection booking rescheduling and
          live updates.
        </p>

        <div className="flex gap-4 mt-10">
          <Link
            href="/flights"
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg"
          >
            Book Flights
          </Link>

          <Link
            href="/signup"
            className="border border-white/20 hover:border-blue-400 px-6 py-3 rounded-2xl font-semibold transition-all"
          >
            Create Account
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 px-8 pb-20">
        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">
            Real-Time Seats
          </h2>

          <p className="text-gray-300">
            Live seat availability updates powered
            by Supabase Realtime.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">
            Secure Booking
          </h2>

          <p className="text-gray-300">
            Authentication and booking management
            with protected routes.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">
            Easy Reschedule
          </h2>

          <p className="text-gray-300">
            Cancel and reschedule bookings with
            instant updates.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-gray-400">
        © 2026 Flight Management System • Built with Next.js + Supabase
      </footer>
    </main>
  );
}