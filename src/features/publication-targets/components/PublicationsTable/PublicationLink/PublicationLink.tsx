import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { Publication } from "@canonical/landscape-openapi";
import type { FC } from "react";

interface PublicationLinkProps {
  readonly publication: Publication;
}

const PublicationLink: FC<PublicationLinkProps> = ({ publication }) => (
  <StaticLink
    to={ROUTES.repositories.publications({
      sidePath: ["view"],
      publication: publication.publicationId ?? "",
    })}
  >
    {publication.label ?? publication.name}
  </StaticLink>
);

export default PublicationLink;
