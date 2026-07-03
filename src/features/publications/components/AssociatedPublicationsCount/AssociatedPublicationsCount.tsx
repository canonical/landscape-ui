import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useGetPublicationsBySource } from "@/features/publications";
import { pluralize } from "@/utils/_helpers";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface AssociatedPublicationsCountProps {
  readonly sourceName: string;
}

const AssociatedPublicationsCount: FC<AssociatedPublicationsCountProps> = ({
  sourceName,
}) => {
  const { publications, isGettingPublications } =
    useGetPublicationsBySource(sourceName);

  if (isGettingPublications) {
    return <LoadingState inline />;
  }

  if (!publications.length) {
    return "0 publications";
  }

  return (
    <StaticLink
      to={ROUTES.repositories.publications({
        query: `source:${sourceName}`,
      })}
    >
      {pluralize(publications.length, ["publication"], "exact")}
    </StaticLink>
  );
};

export default AssociatedPublicationsCount;
