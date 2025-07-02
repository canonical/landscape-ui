import type { Employee } from "./types";

export const getStatusText = (employee: Employee) =>
  employee.is_active ? "Active" : "Inactive";
