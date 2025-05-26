import { createRoute, createRouteWithParams } from "./_helpers";

export const INSTANCES_PATHS = {
  instances: "/instances",
  instancesSingle: "/instances/:instanceId",
  instancesChild: "/instances/:instanceId/:childInstanceId",
} as const;

export const INSTANCES_ROUTES = {
  instances: createRoute(INSTANCES_PATHS.instances),
  instancesSingle: createRouteWithParams<{ instanceId: string }>(
    INSTANCES_PATHS.instancesSingle,
  ),
  instancesChild: createRouteWithParams<{
    instanceId: string;
    childInstanceId: string;
  }>(INSTANCES_PATHS.instancesChild),
} as const;
