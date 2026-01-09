import type { Administrator } from "@/types/Administrator";
import { administratorRoles } from "./roles";

export const administrators = [
  {
    name: "Bob Mellow",
    email: "bob@example.com",
    id: 3,
    roles: administratorRoles,
  },
  {
    name: "Jane Robertson",
    email: "jane@example.com",
    id: 2,
    roles: administratorRoles.slice(0, 2),
  },
  {
    name: "John Smith",
    email: "john@example.com",
    id: 1,
    roles: administratorRoles.slice(0, 2),
  },
  {
    name: "Noel Coward",
    email: "noel@example.com",
    id: 4,
    roles: administratorRoles.slice(0, 2),
  },
  {
    name: "Robert Frost",
    email: "robert@example.com",
    id: 6,
    roles: administratorRoles.slice(0, 3),
  },
] as const satisfies Administrator[];
