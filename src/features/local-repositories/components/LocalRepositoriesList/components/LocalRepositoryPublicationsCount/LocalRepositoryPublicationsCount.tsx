import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { useGetPublicationsBySource } from "@/features/publications";
import { pluralizeWithCount } from "@/utils/_helpers";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface LocalRepositoryPublicationsCountProps {
  readonly repository: Local;
}

const LocalRepositoryPublicationsCount: FC<
  LocalRepositoryPublicationsCountProps
> = ({ repository }) => {
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    repository.name,
  );

  if (isGettingPublications) {
    return <LoadingState inline />;
  }

  if (!publications.length) {
    return "0 publications";
  }

  return (
    <StaticLink
      to={ROUTES.repositories.publications({
        query: `source:${repository.name}`,
      })}
    >
      {pluralizeWithCount(publications.length, "publication")}
    </StaticLink>
  );
};

export default LocalRepositoryPublicationsCount;
