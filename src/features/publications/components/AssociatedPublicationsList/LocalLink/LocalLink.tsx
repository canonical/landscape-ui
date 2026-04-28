import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";

interface LocalLinkProps {
  readonly localName: string;
  readonly openInNewTab?: boolean;
}

const LocalLink: FC<LocalLinkProps> = ({ localName, openInNewTab = false }) => (
  <StaticLink
    to={ROUTES.repositories.localRepositories({
      sidePath: ["view"],
      name: localName.replace(/^locals\//, ""),
    })}
    target={openInNewTab ? "_blank" : undefined}
  >
    {localName}
  </StaticLink>
);

export default LocalLink;
