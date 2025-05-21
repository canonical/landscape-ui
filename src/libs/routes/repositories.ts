import { createRoute } from "./_helpers";

export const REPOSITORIES_PATHS = {
  repositories: "/repositories",
  repositoriesMirrors: "/repositories/mirrors",
  repositoriesGpgKeys: "/repositories/gpg-keys",
  repositoriesAptSources: "/repositories/apt-sources",
} as const;

export const REPOSITORIES_ROUTES = {
  repositories: createRoute(REPOSITORIES_PATHS.repositories),
  repositoriesMirrors: createRoute(REPOSITORIES_PATHS.repositoriesMirrors),
  repositoriesGpgKeys: createRoute(REPOSITORIES_PATHS.repositoriesGpgKeys),
  repositoriesAptSources: createRoute(
    REPOSITORIES_PATHS.repositoriesAptSources,
  ),
} as const;
