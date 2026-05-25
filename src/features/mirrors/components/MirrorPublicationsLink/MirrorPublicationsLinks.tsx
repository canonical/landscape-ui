import type { FC } from "react";
import { useListPublications } from "../../api";
import { pluralize } from "@/utils/_helpers";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface MirrorPublicationsLinkProps {
  readonly mirrorName: string;
}

const MirrorPublicationsLink: FC<MirrorPublicationsLinkProps> = ({
  mirrorName,
}) => {
  const { data } = useListPublications(
    {
      filter: `source="${mirrorName}"`,
      pageSize: 1000,
    },
    { refetchOnMount: false },
  );

  if (!data.data.publications?.length) {
    return "0 publications";
  }

  return (
    <StaticLink
      to={{
        pathname: ROUTES.repositories.publications(),
        search: `?query=${encodeURIComponent(`source:${mirrorName}`)}`,
      }}
    >
      {pluralize(
        data.data.publications.length,
        ["publication"],
        data.data.nextPageToken ? "limited" : "exact",
      )}
    </StaticLink>
  );
};

export default MirrorPublicationsLink;
