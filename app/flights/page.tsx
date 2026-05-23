"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/src/lib/supabase/client";

import { useRouter } from "next/navigation";

import { useFlightStore } from "@/src/lib/supabase/stores/flight-store";

type Flight = {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  base_price: number;
};

export default function FlightsPage() {
  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [origin, setOrigin] =
    useState("");

  const [
    destination,
    setDestination,
  ] = useState("");

  const [date, setDate] =
    useState("");

  const [passengers, setPassengers] =
    useState(1);

  const router = useRouter();

  const setSelectedFlight =
    useFlightStore(
      (state) =>
        state.setSelectedFlight
    );

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from("flights")
        .select("*");

      if (error) {
        console.log(error);
        return;
      }

      let filtered =
        data || [];

      if (origin) {
        filtered =
          filtered.filter(
            (flight) =>
              flight.origin
                .toLowerCase()
                .includes(
                  origin.toLowerCase()
                )
          );
      }

      if (destination) {
        filtered =
          filtered.filter(
            (flight) =>
              flight.destination
                .toLowerCase()
                .includes(
                  destination.toLowerCase()
                )
          );
      }

      if (date) {
        filtered =
          filtered.filter(
            (flight) =>
              flight.departs_at.startsWith(
                date
              )
          );
      }

      setFlights(filtered);
    };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex flex-col items-center mb-8">
        <img
          src="/icon-192.png"
          alt="Flight Logo"
          className="w-24 h-24 mb-4"
        />

        <h1 className="text-5xl font-bold">
          Flight Search
        </h1>

        <p className="text-gray-400 mt-2">
          Search and book flights instantly
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) =>
            setOrigin(
              e.target.value
            )
          }
          className="p-3 rounded-lg bg-slate-800 outline-none"
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) =>
            setDestination(
              e.target.value
            )
          }
          className="p-3 rounded-lg bg-slate-800 outline-none"
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="p-3 rounded-lg bg-slate-800 outline-none"
        />

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">
            Passenger Count
          </label>

          <input
            type="number"
            min="1"
            value={passengers}
            onChange={(e) =>
              setPassengers(
                Number(
                  e.target.value
                )
              )
            }
            className="p-3 rounded-lg bg-slate-800 outline-none"
          />
        </div>

        <button
          onClick={fetchFlights}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Search Flights
        </button>
      </div>

      {flights.length ===
      0 ? (
        <div className="text-center text-gray-400 mt-10">
          No Flights Found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {flights.map(
            (flight) => (
              <div
                key={flight.id}
                className="bg-slate-800 rounded-xl p-5"
              >
                <h2 className="text-2xl font-bold">
                  {
                    flight.flight_no
                  }
                </h2>

                <p className="mt-2 text-lg">
                  {
                    flight.origin
                  }
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

                <p>
                  Arrival:
                  {" "}
                  {new Date(
                    flight.arrives_at
                  ).toLocaleString()}
                </p>

                <p className="mt-3 text-xl font-semibold text-green-400">
                  ₹
                  {
                    flight.base_price
                  }
                </p>

                <p className="mt-2 text-gray-300">
                  Passengers:
                  {" "}
                  {
                    passengers
                  }
                </p>

                <button
                  onClick={() => {
                    setSelectedFlight(
                      flight
                    );

                    router.push(
                      `/seat-selection/${flight.id}`
                    );
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Book Flight
                </button>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}