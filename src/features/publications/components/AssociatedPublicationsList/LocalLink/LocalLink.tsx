import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";

interface LocalLinkProps {
  readonly localName: string;
  readonly displayName?: string;
  readonly openInNewTab?: boolean;
}

const LocalLink: FC<LocalLinkProps> = ({
  localName,
  displayName,
  openInNewTab = false,
}) => (
  <StaticLink
    to={ROUTES.repositories.localRepositories({
      sidePath: ["view"],
      name: localName.replace(/^locals\//, ""),
    })}
    target={openInNewTab ? "_blank" : undefined}
  >
    {displayName ?? localName}
  </StaticLink>
);

export default LocalLink;
