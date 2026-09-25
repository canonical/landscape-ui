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
  {
    id: 4,
    available_seats: 58,
    expiration_date: "2027-01-15T00:00:00Z",
    used_seats: 42,
    license_type: "Full",
  },
  {
    id: 7,
    available_seats: 47,
    expiration_date: "2026-12-31T00:00:00Z",
    used_seats: 3,
    license_type: "Full",
  },
  {
    id: 8,
    available_seats: 75,
    expiration_date: "2030-07-01T00:00:00Z",
    used_seats: 50,
    license_type: "LDS",
  },
  {
    id: 9,
    available_seats: 8,
    expiration_date: null,
    used_seats: 2,
    license_type: "Virtual",
  },
  {
    id: 10,
    available_seats: 46,
    expiration_date: "2027-09-10T00:00:00Z",
    used_seats: 4,
    license_type: "LDS Virtual",
  },
  {
    id: 11,
    available_seats: 19,
    expiration_date: "2028-02-28T00:00:00Z",
    used_seats: 1,
    license_type: "Container",
  },
  {
    id: 12,
    available_seats: 7,
    expiration_date: "2031-01-01T00:00:00Z",
    used_seats: 3,
    license_type: "LDS Container",
  },
] as const satisfies License[];
