import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { Publication } from "@canonical/landscape-openapi";
import type { FC } from "react";

interface PublicationLinkProps {
  readonly publication: Publication;
  readonly openInNewTab?: boolean;
}

const PublicationLink: FC<PublicationLinkProps> = ({
  publication,
  openInNewTab = false,
}) => (
  <StaticLink
    to={ROUTES.repositories.publications({
      sidePath: ["view"],
      name: publication.publicationId,
    })}
    target={openInNewTab ? "_blank" : undefined}
  >
    {publication.displayName ?? publication.name}
  </StaticLink>
);

export default PublicationLink;
