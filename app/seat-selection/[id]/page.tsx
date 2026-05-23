"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useFlightStore } from "@/src/lib/supabase/stores/flight-store";

import { useRouter } from "next/navigation";

type Seat = {
  id: string;
  seat_number: string;
  class: string;
  is_available: boolean;
  extra_fee: number;
};

export default function SeatSelectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams =
    use(params);

  const router = useRouter();

  const [seats, setSeats] =
    useState<Seat[]>([]);

  const selectedSeat =
    useFlightStore(
      (state) =>
        state.selectedSeat
    );

  const setSelectedSeat =
    useFlightStore(
      (state) =>
        state.setSelectedSeat
    );

  useEffect(() => {
    const fetchSeats =
      async () => {
        const {
          data,
          error,
        } = await supabase
          .from("seats")
          .select("*")
          .eq(
            "flight_id",
            resolvedParams.id
          );

        if (error) {
          console.log(error);
          return;
        }

        setSeats(data || []);
      };

    fetchSeats();

    const channel =
      supabase
        .channel(
          "realtime-seats"
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "seats",
          },
          (payload) => {
            setSeats((prev) =>
              prev.map((seat) =>
                seat.id ===
                payload.new.id
                  ? {
                      ...seat,
                      is_available:
                        payload
                          .new
                          .is_available,
                    }
                  : seat
              )
            );
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [resolvedParams.id]);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        Select Your Seat
      </h1>

      <div className="mb-8 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded" />
          <span>Economy</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-500 rounded" />
          <span>Business</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-500 rounded" />
          <span>First</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded" />
          <span>Occupied</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded" />
          <span>Selected</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 gap-3 min-w-[500px]">
          {seats.map((seat) => (
            <button
              key={seat.id}
              disabled={
                !seat.is_available
              }
              title={`${seat.class} | Extra Fee ₹${seat.extra_fee}`}
              onClick={() =>
                setSelectedSeat(
                  seat
                )
              }
              className={`p-3 rounded-lg font-semibold transition-all
                
                ${
                  !seat.is_available
                    ? "bg-red-500 cursor-not-allowed"
                    : selectedSeat?.id ===
                      seat.id
                    ? "bg-blue-500 scale-105"
                    : seat.class ===
                      "first"
                    ? "bg-purple-500"
                    : seat.class ===
                      "business"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-500"
                }
              `}
            >
              {seat.seat_number}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!selectedSeat}
        onClick={() =>
          router.push("/booking")
        }
        className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg disabled:bg-gray-600"
      >
        Continue Booking
      </button>
    </main>
  );
}