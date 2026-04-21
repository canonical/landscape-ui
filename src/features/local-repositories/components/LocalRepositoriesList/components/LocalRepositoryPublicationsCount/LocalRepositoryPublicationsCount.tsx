import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import useGetPublications from "../../../../api/useGetPublications";
import { pluralizeWithCount } from "@/utils/_helpers";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface LocalRepositoryPublicationsCountProps {
  readonly repository: LocalRepository;
}

const LocalRepositoryPublicationsCount: FC<
  LocalRepositoryPublicationsCountProps
> = ({ repository }) => {
  const { publications, isGettingPublications } = useGetPublications({
    filter: `source=${repository.name}`,
  });

  if (isGettingPublications) {
    return <LoadingState inline />;
  }

  if (!publications.length) {
    return "0 publications";
  }

  return (
    <StaticLink
      to={ROUTES.repositories.publications({ search: repository.local_id })}
    >
      {pluralizeWithCount(publications.length, "publication")}
    </StaticLink>
  );
};

export default LocalRepositoryPublicationsCount;
