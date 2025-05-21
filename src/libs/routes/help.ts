import { createRoute } from "./_helpers";

export const HELP_PATHS = {
  help: "/help",
} as const;

export const HELP_ROUTES = {
  help: createRoute(HELP_PATHS.help),
} as const;
