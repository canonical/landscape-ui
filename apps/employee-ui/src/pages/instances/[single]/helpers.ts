import type { Breadcrumb, Instance } from "@landscape/types";

export const isInstanceFound = (instance: Instance | null) => instance;

export const getBreadcrumbs = (
  instance: Instance | null,
): Breadcrumb[] | undefined => {
  if (!instance) {
    return;
  }

  return [
    { label: "Instances", path: "/instances" },
    { label: instance.title, current: true },
  ];
};

export const isInstanceQueryEnabled = (
  instanceId: string | undefined,
  savedUserAccount: string | undefined,
  userAccount: string | undefined,
) => !!instanceId && (!savedUserAccount || savedUserAccount === userAccount);
