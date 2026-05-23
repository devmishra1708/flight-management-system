"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/src/lib/supabase/client";

type Booking = {
  id: string;
  status: string;
  total_price: number;
  pnr_code: string;
  booked_at: string;
  seat_id: string;
  flight_id: string;

  flights: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
  };

  seats: {
    seat_number: string;
    class: string;
  };
};

export default function MyBookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings =
      async () => {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) return;

        const {
          data,
          error,
        } = await supabase
          .from("bookings")
          .select(`
            *,
            flights (
              flight_no,
              origin,
              destination,
              departs_at
            ),
            seats (
              seat_number,
              class
            )
          `)
          .eq("user_id", user.id)
          .order(
            "booked_at",
            { ascending: false }
          );

        if (error) {
          console.log(error);
          return;
        }

        setBookings(data || []);
      };

    fetchBookings();
  }, []);

  const cancelBooking =
    async (
      bookingId: string,
      seatId: string
    ) => {
      const confirmed =
        confirm(
          "Cancel booking?"
        );

      if (!confirmed) return;

      const { error } =
        await supabase
          .from("bookings")
          .update({
            status:
              "cancelled",
          })
          .eq("id", bookingId);

      if (error) {
        alert(
          "Cancellation failed"
        );

        return;
      }

      await supabase
        .from("seats")
        .update({
          is_available: true,
        })
        .eq("id", seatId);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status:
                  "cancelled",
              }
            : booking
        )
      );
    };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        My Bookings
      </h1>

      <div className="space-y-5">
        {bookings.map(
          (booking) => (
            <div
              key={booking.id}
              className="bg-slate-800 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
                <div>
                  <h2 className="text-2xl font-bold">
                    {
                      booking
                        .flights
                        .flight_no
                    }
                  </h2>

                  <p className="mt-2 text-lg">
                    {
                      booking
                        .flights
                        .origin
                    }
                    {" → "}
                    {
                      booking
                        .flights
                        .destination
                    }
                  </p>

                  <p className="mt-2">
                    Departure:
                    {" "}
                    {new Date(
                      booking
                        .flights
                        .departs_at
                    ).toLocaleString()}
                  </p>

                  <p className="mt-2">
                    Seat:
                    {" "}
                    {
                      booking
                        .seats
                        .seat_number
                    }
                    {" • "}
                    {
                      booking
                        .seats
                        .class
                    }
                  </p>

                  <p className="mt-2">
                    PNR:
                    {" "}
                    {
                      booking.pnr_code
                    }
                  </p>

                  <p className="mt-2 text-green-400 text-xl font-semibold">
                    ₹
                    {
                      booking.total_price
                    }
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                      
                      ${
                        booking.status ===
                        "confirmed"
                          ? "bg-green-600"
                          : booking.status ===
                            "cancelled"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }
                    `}
                  >
                    {
                      booking.status
                    }
                  </span>

                  {booking.status !==
                    "cancelled" && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() =>
                          cancelBooking(
                            booking.id,
                            booking.seat_id
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          window.location.href = `/reschedule/${booking.id}`
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}