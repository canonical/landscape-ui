import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";

interface MirrorLinkProps {
  readonly mirrorName: string;
  readonly openInNewTab?: boolean;
}

const MirrorLink: FC<MirrorLinkProps> = ({
  mirrorName,
  openInNewTab = false,
}) => (
  <StaticLink
    to={ROUTES.repositories.mirrors({
      sidePath: ["view"],
      name: mirrorName,
    })}
    target={openInNewTab ? "_blank" : undefined}
  >
    {mirrorName}
  </StaticLink>
);

export default MirrorLink;
