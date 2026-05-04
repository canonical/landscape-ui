import type { FC } from "react";
import { useListPublications } from "../../api";
import { pluralizeNew } from "@/utils/_helpers";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface MirrorPublicationsLinkProps {
  readonly mirrorName: string;
}

const MirrorPublicationsLink: FC<MirrorPublicationsLinkProps> = ({
  mirrorName,
}) => {
  const { data } = useListPublications({
    filter: `source="${mirrorName}"`,
    pageSize: 1000,
  });

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
      {pluralizeNew(data.data.publications.length, "publication", {
        showCount: data.data.nextPageToken ? "limited" : "exact",
      })}
    </StaticLink>
  );
};

export default MirrorPublicationsLink;
