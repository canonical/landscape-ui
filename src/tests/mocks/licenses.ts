import type { License } from "@/features/licenses";

export const licenses = [
  {
    id: 1,
    available_seats: 50,
    expiration_date: "2026-11-30T00:00:00Z",
    used_seats: 0,
    license_type: "",
  },
  {
    id: 2,
    available_seats: 25,
    expiration_date: null,
    used_seats: 75,
    license_type: "Ubuntu Pro",
  },
  {
    id: 3,
    available_seats: 0,
    expiration_date: "2028-06-01T00:00:00Z",
    used_seats: 5,
    license_type: "Ubuntu Pro Free",
  },
] as const satisfies License[];
