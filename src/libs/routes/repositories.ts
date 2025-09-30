import { createRoute, createPathBuilder } from "./_helpers";

export const REPOSITORIES_PATHS = {
  root: "repositories",
  mirrors: "mirrors",
  gpgKeys: "gpg-keys",
  aptSources: "apt-sources",
} as const;

const base = `/${REPOSITORIES_PATHS.root}`;

const buildRepositoryPath = createPathBuilder(base);

export const REPOSITORIES_ROUTES = {
  root: createRoute(base),
  mirrors: createRoute(buildRepositoryPath(REPOSITORIES_PATHS.mirrors)),
  gpgKeys: createRoute(buildRepositoryPath(REPOSITORIES_PATHS.gpgKeys)),
  aptSources: createRoute(buildRepositoryPath(REPOSITORIES_PATHS.aptSources)),
} as const;
