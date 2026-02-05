import type { InstanceWithoutRelation } from "@/types/Instance";

export const getInstanceKeyForRemount = (
  instance: InstanceWithoutRelation,
): string => {
  const employeeId = instance.employee_id ?? "no-employee";
  const tagsKey = instance.tags.join(",");

  return `${employeeId}-${tagsKey}`;
};
