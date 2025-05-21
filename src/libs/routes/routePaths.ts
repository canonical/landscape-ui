import { PATHS } from "./paths";
import { ROOT_PATHS } from "./root";

const ROOT_PATHS_ARRAY = Object.values(ROOT_PATHS);

export const ROUTE_PATHS = Object.fromEntries(
  Object.entries(PATHS).map(([key, value]) => [
    key,
    ROOT_PATHS_ARRAY.includes(
      value as (typeof ROOT_PATHS)[keyof typeof ROOT_PATHS],
    )
      ? value
      : value.slice(1),
  ]),
) as typeof PATHS;
