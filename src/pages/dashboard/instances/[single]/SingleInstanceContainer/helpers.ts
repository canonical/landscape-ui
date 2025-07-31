import { getFeatures } from "@/features/instances";
import type { KernelStatus } from "@/features/kernel";
import type { Breadcrumb } from "@/types/Breadcrumb";
import type { Instance } from "@/types/Instance";

export const getBreadcrumbs = (
  instance?: Instance,
): Breadcrumb[] | undefined => {
  if (!instance) {
    return;
  }

  if (!instance.parent) {
    return [
      { label: "Instances", path: "/instances" },
      { label: instance.title, current: true },
    ];
  }

  return [
    {
      label: "Instances",
      path: "/instances",
    },
    {
      label: instance.parent.title,
      path: `/instances/${instance.parent.id}`,
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
    !kernelStatus[0]?.Livepatch?.Fixes
  ) {
    return undefined;
  }

  return kernelStatus[0].Livepatch.Fixes.length;
};

export const getPackageCount = (instance: Instance, requestResult: number) =>
  !instance.distribution ? 0 : requestResult;

export const getUsnCount = (instance: Instance, requestResult: number) =>
  !instance.distribution ? 0 : requestResult;

export const getInstanceTitle = (instance?: Instance) => instance?.title ?? "";

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
  instance: Instance | undefined,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  getFeatures(instance).packages &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const isLivepatchInfoQueryEnabled = (
  instance: Instance | undefined,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  getFeatures(instance).packages &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const isUsnQueryEnabled = (
  instance: Instance | undefined,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  !!instance &&
  getFeatures(instance).packages &&
  (!childInstanceId || instance.parent?.id === parseInt(instanceId ?? ""));

export const getQueryComputerIdsParam = (instance?: Instance) =>
  instance ? [instance.id] : [];

export const getQueryInstanceIdParam = (instance?: Instance) =>
  instance ? instance.id : 0;

export const isInstanceFound = (
  instance: Instance | undefined,
  instanceId: string | undefined,
  childInstanceId: string | undefined,
) =>
  instance &&
  (!childInstanceId ||
    (instance.parent && instance.parent.id === parseInt(instanceId ?? "")));
