import { createRoute, createPathBuilder } from "./_helpers";

export const REPOSITORIES_PATHS = {
  root: "repositories",
  mirrors: "mirrors",
  localRepositories: "local-repositories",
  publications: "publications",
  publicationTargets: "publication-targets",
  repositoryProfiles: "repository-profiles",
} as const;

const base = `/${REPOSITORIES_PATHS.root}`;

const buildRepositoryPath = createPathBuilder(base);

export const REPOSITORIES_ROUTES = {
  root: createRoute(base),
  mirrors: createRoute(buildRepositoryPath(REPOSITORIES_PATHS.mirrors)),
  localRepositories: createRoute(
    buildRepositoryPath(REPOSITORIES_PATHS.localRepositories),
  ),
  publications: createRoute(
    buildRepositoryPath(REPOSITORIES_PATHS.publications),
  ),
  publicationTargets: createRoute(
    buildRepositoryPath(REPOSITORIES_PATHS.publicationTargets),
  ),
  repositoryProfiles: createRoute(
    buildRepositoryPath(REPOSITORIES_PATHS.repositoryProfiles),
  ),
} as const;
