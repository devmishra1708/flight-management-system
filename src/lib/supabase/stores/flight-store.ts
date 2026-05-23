import { create } from "zustand";

import { persist } from "zustand/middleware";

type Flight = {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  base_price: number;
};

type Seat = {
  id: string;
  seat_number: string;
  class: string;
  is_available: boolean;
  extra_fee: number;
};

type PassengerData = {
  full_name: string;
  passport_no: string;
  nationality: string;
  dob: string;
};

type FlightStore = {
  selectedFlight:
    | Flight
    | null;

  selectedSeat:
    | Seat
    | null;

  passengerData: PassengerData;

  setSelectedFlight: (
    flight: Flight
  ) => void;

  setSelectedSeat: (
    seat: Seat
  ) => void;

  setPassengerData: (
    data: PassengerData
  ) => void;

  resetStore: () => void;
};

export const useFlightStore =
  create<FlightStore>()(
    persist(
      (set) => ({
        selectedFlight: null,

        selectedSeat: null,

        passengerData: {
          full_name: "",
          passport_no: "",
          nationality: "",
          dob: "",
        },

        setSelectedFlight: (
          flight
        ) =>
          set({
            selectedFlight:
              flight,
          }),

        setSelectedSeat: (
          seat
        ) =>
          set({
            selectedSeat: seat,
          }),

        setPassengerData: (
          data
        ) =>
          set({
            passengerData: data,
          }),

        resetStore: () =>
          set({
            selectedFlight:
              null,

            selectedSeat:
              null,

            passengerData: {
              full_name: "",
              passport_no:
                "",
              nationality:
                "",
              dob: "",
            },
          }),
      }),

      {
        name:
          "flight-booking-store",

        partialize: (
          state
        ) => ({
          selectedFlight:
            state.selectedFlight,

          selectedSeat:
            state.selectedSeat,

          passengerData: {
            full_name:
              state.passengerData
                .full_name,

            nationality:
              state.passengerData
                .nationality,

            dob:
              state.passengerData
                .dob,
          },
        }),
      }
    )
  );