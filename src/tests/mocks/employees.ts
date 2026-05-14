import type { Employee } from "@/features/employees";
import { instances } from "./instance";

export const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    is_active: true,
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c0",
    computers: instances,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c1",
    is_active: false,
    computers: null,
    groups: null,
  },
  {
    id: 3,
    name: "Alice",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c2",
    is_active: true,
    email: "alice@gmail.com",
    computers: null,
    groups: null,
  },
] as const satisfies Employee[];
