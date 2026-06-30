import type { Group } from "@/types/User";

export const mapGroupsToOptions = (groups: Group[]) =>
  groups.map((group) => ({
    label: group.name,
    value: group.name,
  }));
