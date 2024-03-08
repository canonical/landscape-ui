import { Breadcrumb } from "@/types/Breadcrumb";
import { ROOT_PATH } from "@/constants";
import { Instance } from "@/types/Instance";

export const getBreadcrumbs = (
  instance: Instance | null,
  hostname = "",
  childHostname = "",
): Breadcrumb[] | undefined => {
  if (!childHostname) {
    return [
      { label: "Instances", path: `${ROOT_PATH}instances` },
      { label: instance?.title ?? hostname, current: true },
    ];
  }

  return [
    {
      label: "Instances",
      path: `${ROOT_PATH}instances`,
    },
    {
      label: instance?.title ?? hostname,
      path: `${ROOT_PATH}instances/${instance?.hostname ?? hostname}`,
    },
    {
      label:
        instance?.children.find(({ hostname }) => hostname === childHostname)
          ?.title ?? childHostname,
      current: true,
    },
  ];
};
