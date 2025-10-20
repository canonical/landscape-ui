import type { Instance } from "@/types/Instance";
import type { UrlParams } from "@/types/UrlParams";

export const getComputerIdFromParams = (
  params: Partial<UrlParams>,
): number[] => {
  const { instanceId, childInstanceId } = params;

  if (childInstanceId) {
    return [Number(childInstanceId)];
  } else if (instanceId) {
    return [Number(instanceId)];
  }
  return [];
};

export const classifyInstancesByToken = (
  instances: Instance[],
): {
  withToken: number;
  withoutToken: number;
} => {
  const withToken = instances.filter(
    (instance) =>
      instance.ubuntu_pro_info?.result === "success" &&
      instance.ubuntu_pro_info.attached,
  ).length;

  const withoutToken = instances.length - withToken;

  return { withToken, withoutToken };
};

export const getInstanceWithUbuntuPro = (
  instances: Instance[],
): Instance | undefined => {
  for (const instance of instances) {
    const info = instance.ubuntu_pro_info;
    if (info?.result === "success" && info.attached) {
      return instance;
    }
  }
  return undefined;
};
