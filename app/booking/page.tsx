"use client";

import { useState } from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useFlightStore } from "@/src/lib/supabase/stores/flight-store";

import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();

  const selectedFlight =
    useFlightStore(
      (state) =>
        state.selectedFlight
    );

  const selectedSeat =
    useFlightStore(
      (state) =>
        state.selectedSeat
    );

  const [fullName, setFullName] =
    useState("");

  const [
    passportNo,
    setPassportNo,
  ] = useState("");

  const [
    nationality,
    setNationality,
  ] = useState("");

  const [dob, setDob] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleBooking =
    async () => {
      if (
        !selectedFlight ||
        !selectedSeat
      ) {
        alert(
          "Flight or seat missing"
        );
        return;
      }

      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert(
          "Please login first"
        );
        setLoading(false);
        return;
      }

      const pnr =
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      const {
        data: booking,
        error,
      } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          flight_id:
            selectedFlight.id,
          seat_id:
            selectedSeat.id,
          status: "confirmed",
          total_price:
            selectedFlight.base_price +
            selectedSeat.extra_fee,
          pnr_code: pnr,
        })
        .select()
        .single();

      if (error) {
        console.log(error);
        alert(
          "Booking failed"
        );
        setLoading(false);
        return;
      }

      await supabase
        .from("passengers")
        .insert({
          booking_id:
            booking.id,
          full_name: fullName,
          passport_no:
            passportNo,
          nationality:
            nationality,
          dob,
        });

      await supabase
        .from("seats")
        .update({
          is_available: false,
        })
        .eq(
          "id",
          selectedSeat.id
        );

      router.push(
        `/confirmation/${pnr}`
      );
    };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex justify-center p-6">
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/icon-192.png"
            alt="Logo"
            className="w-20 h-20 mb-4"
          />

          <h1 className="text-4xl font-bold">
            Passenger Details
          </h1>

          <p className="text-gray-400 mt-2">
            Complete your booking
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-700 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Passport Number
            </label>

            <input
              type="text"
              value={passportNo}
              onChange={(e) =>
                setPassportNo(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-700 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Nationality
            </label>

            <input
              type="text"
              value={nationality}
              onChange={(e) =>
                setNationality(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-700 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Date of Birth
            </label>

            <input
              type="date"
              value={dob}
              onChange={(e) =>
                setDob(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-700 outline-none"
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Processing..."
              : "Confirm Booking"}
          </button>
        </div>
      </div>
    </main>
  );
}