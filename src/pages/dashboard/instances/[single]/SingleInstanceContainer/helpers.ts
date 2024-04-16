import { ROOT_PATH } from "@/constants";
import { Breadcrumb } from "@/types/Breadcrumb";
import { Instance } from "@/types/Instance";

export const getBreadcrumbs = (
  instance: Instance | null,
): Breadcrumb[] | undefined => {
  if (!instance) {
    return;
  }

  if (!instance.parent) {
    return [
      { label: "Instances", path: `${ROOT_PATH}instances` },
      { label: instance.title, current: true },
    ];
  }

  return [
    {
      label: "Instances",
      path: `${ROOT_PATH}instances`,
    },
    {
      label: instance.parent.title,
      path: `${ROOT_PATH}instances/${instance.parent.id}`,
    },
    {
      label: instance.title,
      current: true,
    },
  ];
};
