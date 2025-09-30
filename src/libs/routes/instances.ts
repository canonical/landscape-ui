import type { Instance } from "@/types/Instance";
import type { PageParams } from "../pageParamsManager";
import {
  createRoute,
  createRouteWithParams,
  createPathBuilder,
} from "./_helpers";

export const INSTANCES_PATHS = {
  root: "instances",
  single: ":instanceId",
  child: ":childInstanceId",
} as const;

const base = `/${INSTANCES_PATHS.root}`;
const buildInstancePath = createPathBuilder(base);
const singlePath = buildInstancePath(INSTANCES_PATHS.single);
const childPath = `${singlePath}/${INSTANCES_PATHS.child}`;

export const INSTANCES_ROUTES = {
  root: createRoute(base),

  details: {
    single: (instanceId: string | number, query?: Partial<PageParams>) =>
      createRouteWithParams(singlePath)({ instanceId: instanceId }, query),

    child: (
      instanceId: string | number,
      childInstanceId: string | number,
      query?: Partial<PageParams>,
    ) =>
      createRouteWithParams(childPath)(
        {
          instanceId: instanceId,
          childInstanceId: childInstanceId,
        },
        query,
      ),

    fromParams: (
      params: {
        instanceId?: string | number;
        childInstanceId?: string | number;
      },
      query?: Partial<PageParams>,
    ) => {
      if (params.instanceId === undefined) {
        return createRoute(base)(query);
      }

      if (params.childInstanceId === undefined) {
        return createRouteWithParams(singlePath)(
          { instanceId: params.instanceId },
          query,
        );
      }

      return createRouteWithParams(childPath)(
        {
          instanceId: params.instanceId,
          childInstanceId: params.childInstanceId,
        },
        query,
      );
    },

    fromInstance: (instance: Instance, query?: Partial<PageParams>) => {
      const parentId = instance.parent?.id ?? null;
      return parentId !== null
        ? createRouteWithParams(childPath)(
            {
              instanceId: parentId,
              childInstanceId: instance.id,
            },
            query,
          )
        : createRouteWithParams(singlePath)({ instanceId: instance.id }, query);
    },
  },
} as const;
