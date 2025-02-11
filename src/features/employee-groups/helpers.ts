import type { EmployeeGroup } from "./types";

export const isNotUnique = (employeeGroups: EmployeeGroup[], name: string) => {
  return employeeGroups.filter((employee) => employee.name === name).length > 1;
};
