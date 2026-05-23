"use client";

import { use, useEffect, useState } from "react";

import { supabase } from "@/src/lib/supabase/client";

type Booking = {
  id: string;
  pnr_code: string;
  total_price: number;
  status: string;

  flights: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
  };

  seats: {
    seat_number: string;
    class: string;
  };
};

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ pnr: string }>;
}) {
  const resolvedParams = use(params);

  const [booking, setBooking] =
    useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data, error } =
        await supabase
          .from("bookings")
          .select(`
            *,
            flights (
              flight_no,
              origin,
              destination,
              departs_at,
              arrives_at
            ),
            seats (
              seat_number,
              class
            )
          `)
          .eq(
            "pnr_code",
            resolvedParams.pnr
          )
          .single();

      if (error) {
        console.log(error);
        return;
      }

      setBooking(data);
    };

    fetchBooking();
  }, [resolvedParams.pnr]);

  if (!booking) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <h1 className="text-2xl">
          Loading Booking...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-green-400 mb-6">
          Booking Confirmed
        </h1>

        <div className="space-y-4 text-lg">
          <p>
            <strong>PNR:</strong>
            {" "}
            {booking.pnr_code}
          </p>

          <p>
            <strong>Flight:</strong>
            {" "}
            {booking.flights.flight_no}
          </p>

          <p>
            <strong>Route:</strong>
            {" "}
            {booking.flights.origin}
            {" → "}
            {booking.flights.destination}
          </p>

          <p>
            <strong>Departure:</strong>
            {" "}
            {new Date(
              booking.flights.departs_at
            ).toLocaleString()}
          </p>

          <p>
            <strong>Arrival:</strong>
            {" "}
            {new Date(
              booking.flights.arrives_at
            ).toLocaleString()}
          </p>

          <p>
            <strong>Seat:</strong>
            {" "}
            {booking.seats.seat_number}
          </p>

          <p>
            <strong>Class:</strong>
            {" "}
            {booking.seats.class}
          </p>

          <p>
            <strong>Status:</strong>
            {" "}
            {booking.status}
          </p>

          <p className="text-2xl font-bold text-green-400">
            ₹{booking.total_price}
          </p>
        </div>
      </div>
    </main>
  );
}