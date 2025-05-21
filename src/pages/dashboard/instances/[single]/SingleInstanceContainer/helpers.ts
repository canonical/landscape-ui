import { currentInstanceIs } from "@/features/instances";
import type { KernelStatus } from "@/features/kernel";
import { ROUTES } from "@/libs/routes";
import type { Breadcrumb } from "@/types/Breadcrumb";
import type { Instance } from "@/types/Instance";

export const getBreadcrumbs = (
  instance: Instance | null,
): Breadcrumb[] | undefined => {
  if (!instance) {
    return;
  }

  if (!instance.parent) {
    return [
      { label: "Instances", path: ROUTES.instances() },
      { label: instance.title, current: true },
    ];
  }

  return [
    {
      label: "Instances",
      path: ROUTES.instances(),
    },
    {
      label: instance.parent.title,
      path: ROUTES.instancesSingle({
        instanceId: instance.parent.id.toString(),
      }),
    },
    {
      label: instance.title,
      current: true,
    },
  ];
};

export const getKernelCount = (kernelStatus?: KernelStatus[]) => {
  if (
    !kernelStatus ||
    kernelStatus.length === 0 ||
    !kernelStatus[0].Livepatch.Fixes
  ) {
    return undefined;
  }

  return kernelStatus[0].Livepatch.Fixes.length;
};

export const getPackageCount = (instance: Instance, requestResult: number) =>
  !instance.distribution ? 0 : requestResult;

export const getUsnCount = (instance: Instance, requestResult: number) =>
  !instance.distribution ? 0 : requestResult;

export const getInstanceTitle = (instance: Instance | null) =>
  instance?.title ?? "";

export const getInstanceRequestId = (
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) => (childInstanceId ? parseInt(childInstanceId) : parseInt(instanceId ?? ""));

export const isInstanceQueryEnabled = (
  instanceId: string | undefined,
  savedUserAccount: string | undefined,
  userAccount: string | undefined,
) => !!instanceId && (!savedUserAccount || savedUserAccount === userAccount);

export const isInstancePackagesQueryEnabled = (
  instance: Instance | null,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  currentInstanceIs("ubuntu", instance) &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const isLivepatchInfoQueryEnabled = (
  instance: Instance | null,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  currentInstanceIs("ubuntu", instance) &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const isUsnQueryEnabled = (
  instance: Instance | null,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  currentInstanceIs("ubuntu", instance) &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const getQueryComputerIdsParam = (instance: Instance | null) =>
  instance ? [instance.id] : [];

export const getQueryInstanceIdParam = (instance: Instance | null) =>
  instance ? instance.id : 0;

export const isInstanceFound = (
  instance: Instance | null,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  instance &&
  (!childInstanceId ||
    (instance.parent && instance.parent.id === parseInt(instanceId ?? "")));
