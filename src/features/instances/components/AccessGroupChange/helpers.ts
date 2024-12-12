import { AccessGroup } from "@/features/access-groups";

export const getAccessGroupOptions = (
  accessGroups: AccessGroup[] | undefined,
) => {
  const options =
    accessGroups?.map((accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    })) ?? [];

  options.unshift({ label: "Select access group", value: "" });

  return options;
};
