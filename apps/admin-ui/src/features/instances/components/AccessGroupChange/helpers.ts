import type { AccessGroup } from "@/features/access-groups";

export const getAccessGroupOptions = (
  accessGroups: AccessGroup[] | undefined,
) =>
  accessGroups?.map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  })) ?? [];
