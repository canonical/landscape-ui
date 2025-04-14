import type { Employee } from "@/features/employees";

export interface FormProps {
  action: "associate" | "disassociate";
  employee: Employee | null;
}
