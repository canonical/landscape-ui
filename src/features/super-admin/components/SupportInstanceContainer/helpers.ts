import { ROUTES } from "@/libs/routes";
import type { Breadcrumb } from "@/types/Breadcrumb";
import type { Instance } from "@/types/Instance";

/** The id of the instance the page shows: the child's, when one is named. */
export const getRequestedInstanceId = (
  instanceId: string | undefined,
  childInstanceId: string | undefined,
): number => Number(childInstanceId ?? instanceId);

/** Whether `instance` is the one the address names, under the parent it names. */
export const isInstanceFound = (
  instance: Instance | undefined,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
): instance is Instance =>
  !!instance &&
  (!childInstanceId || instance.parent?.id === Number(instanceId));

/** The breadcrumbs of `instance` in the support session of the account `name`. */
export const getBreadcrumbs = (
  name: string,
  instance: Instance | undefined,
): Breadcrumb[] => {
  const root = {
    label: "Instances",
    path: ROUTES.superAdmin.sessionInstances(name),
  };

  if (!instance) {
    return [root];
  }

  if (!instance.parent) {
    return [root, { label: instance.title, current: true }];
  }

  return [
    root,
    {
      label: instance.parent.title,
      path: ROUTES.superAdmin.sessionInstance(name, instance.parent.id),
    },
    { label: instance.title, current: true },
  ];
};
