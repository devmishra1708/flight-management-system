"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useRouter } from "next/navigation";

type Flight = {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  base_price: number;
};

export default function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams =
    use(params);

  const router = useRouter();

  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [booking, setBooking] =
    useState<any>(null);

  useEffect(() => {
    const fetchData =
      async () => {
        const {
          data: bookingData,
          error,
        } = await supabase
          .from("bookings")
          .select(`
            *,
            flights (*)
          `)
          .eq(
            "id",
            resolvedParams.id
          )
          .single();

        if (error) {
          console.log(error);
          return;
        }

        setBooking(
          bookingData
        );

        const {
          data: flightsData,
        } = await supabase
          .from("flights")
          .select("*")
          .eq(
            "origin",
            bookingData
              .flights
              .origin
          )
          .eq(
            "destination",
            bookingData
              .flights
              .destination
          );

        setFlights(
          flightsData || []
        );
      };

    fetchData();
  }, [resolvedParams.id]);

  const rescheduleFlight =
    async (
      newFlight: Flight
    ) => {
      if (!booking)
        return;

      const fee =
        newFlight.base_price >
        booking.total_price
          ? newFlight.base_price -
            booking.total_price
          : 0;

      await supabase
        .from("reschedules")
        .insert({
          booking_id:
            booking.id,

          old_flight_id:
            booking.flight_id,

          new_flight_id:
            newFlight.id,

          fee_charged: fee,
        });

      await supabase
        .from("bookings")
        .update({
          flight_id:
            newFlight.id,

          total_price:
            booking.total_price +
            fee,

          status:
            "rescheduled",
        })
        .eq(
          "id",
          booking.id
        );

      alert(
        "Flight Rescheduled Successfully"
      );

      router.push(
        "/my-bookings"
      );
    };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        Reschedule Flight
      </h1>

      <div className="grid gap-5">
        {flights.map(
          (flight) => (
            <div
              key={flight.id}
              className="bg-slate-800 p-6 rounded-xl"
            >
              <h2 className="text-2xl font-bold">
                {
                  flight.flight_no
                }
              </h2>

              <p className="mt-2">
                {flight.origin}
                {" → "}
                {
                  flight.destination
                }
              </p>

              <p className="mt-2">
                Departure:
                {" "}
                {new Date(
                  flight.departs_at
                ).toLocaleString()}
              </p>

              <p className="mt-2 text-green-400 text-xl">
                ₹
                {
                  flight.base_price
                }
              </p>

              <button
                onClick={() =>
                  rescheduleFlight(
                    flight
                  )
                }
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
              >
                Select Flight
              </button>
            </div>
          )
        )}
      </div>
    </main>
  );
}