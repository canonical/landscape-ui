import { Permission } from "@/types/Permission";
import {
  AccessGroupOption,
  PermissionOption,
} from "@/pages/dashboard/settings/roles/types";
import { AccessGroup } from "@/types/AccessGroup";

export const getPermissionOptions = (permissions: Permission[]) => {
  return permissions.reduce((acc, { global, name, title }) => {
    if (name === "RemoveComputerFromAccessGroup") {
      return acc;
    }

    const permissionType = /view/i.test(name) ? "view" : "manage";

    const permissionLabel =
      name === "AddComputerToAccessGroup"
        ? "access group"
        : title.replace(/(view|manage) /i, "").replace(/computer/i, "instance");

    const permissionOption: PermissionOption = acc.find(
      ({ label }) => label === permissionLabel,
    ) || {
      global,
      label: permissionLabel,
      values: { manage: "", view: "" },
    };

    permissionOption.values[permissionType] = name;

    return [
      ...acc.filter(({ label }) => label !== permissionLabel),
      permissionOption,
    ];
  }, [] as PermissionOption[]);
};

export const getAccessGroupOptions = (accessGroups: AccessGroup[]) => {
  const accessGroupsByDepth = {
    maxDepth: 0,
    options: accessGroups
      .filter((accessGroup) => accessGroup.parent === "")
      .map(
        ({ name, title }): AccessGroupOption => ({
          children: [],
          depth: 0,
          label: title,
          parents: [],
          value: name,
        }),
      ),
  };

  while (accessGroupsByDepth.maxDepth >= 0) {
    const parents = accessGroupsByDepth.options.filter(
      ({ depth }) => depth === accessGroupsByDepth.maxDepth,
    );

    accessGroupsByDepth.maxDepth++;

    const currentDepthAccessGroups = accessGroups.filter(({ parent }) =>
      parents.some(({ value }) => value === parent),
    );

    if (currentDepthAccessGroups.length === 0) {
      break;
    }

    for (const { name, parent, title } of currentDepthAccessGroups) {
      const parentOption = parents.find(({ value }) => value === parent);

      if (!parentOption) {
        continue;
      }

      const currentOptionParents = [parent, ...parentOption.parents];

      accessGroupsByDepth.options.push({
        children: [],
        depth: accessGroupsByDepth.maxDepth,
        label: title,
        parents: currentOptionParents,
        value: name,
      });

      for (const currentOptionParent of currentOptionParents) {
        accessGroupsByDepth.options
          .filter(({ value }) => value === currentOptionParent)[0]
          .children.push(name);
      }
    }
  }

  return accessGroupsByDepth.options;
};

const getParentByDepth = (
  parents: string[],
  depth: number,
  options: AccessGroupOption[],
): string => {
  return options
    .filter((option) => option.depth === depth)
    .filter(({ value }) => parents.includes(value))[0].value;
};

export const getSortedOptions = (
  options: AccessGroupOption[],
): AccessGroupOption[] => {
  return options.sort((a, b) => {
    if (a.children.includes(b.value)) {
      return -1;
    }

    if (b.children.includes(a.value)) {
      return 1;
    }

    for (let i = 0; i < Math.min(a.depth, b.depth); i++) {
      const aParent = getParentByDepth(a.parents, i, options);
      const bParent = getParentByDepth(b.parents, i, options);

      if (aParent !== bParent) {
        return aParent.localeCompare(bParent);
      }
    }

    return a.value.localeCompare(b.value);
  });
};

export const getAccessGroupsToSubmit = (
  accessGroups: string[],
  options: AccessGroupOption[],
) => {
  const maxDepth = Math.max(...options.map(({ depth }) => depth));

  const accessGroupsToSubmit = accessGroups;

  if (accessGroups.length > 0) {
    for (let i = 0; i < maxDepth; i++) {
      const currentDepthAccessGroupOptions = options
        .filter(({ depth }) => depth === i)
        .filter(({ value }) => accessGroups.includes(value));

      for (const currentDepthAccessGroupOption of currentDepthAccessGroupOptions) {
        if (
          currentDepthAccessGroupOption.children.every((child) =>
            accessGroups.includes(child),
          )
        ) {
          const newAccessGroups = accessGroups.filter(
            (accessGroup) =>
              !currentDepthAccessGroupOption.children.includes(accessGroup),
          );

          accessGroups.splice(0, accessGroups.length, ...newAccessGroups);
        }
      }
    }
  }

  return accessGroupsToSubmit;
};
