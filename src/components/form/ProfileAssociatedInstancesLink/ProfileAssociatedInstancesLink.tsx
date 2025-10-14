import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface ProfileAssociatedInstancesLinkProps {
  readonly count: number;
  readonly profile: {
    tags: unknown[];
    all_computers?: boolean;
  };
  readonly query: string;
}

const ProfileAssociatedInstancesLink: FC<
  ProfileAssociatedInstancesLinkProps
> = ({ count, profile, query }) => {
  if (!profile.tags.length && !profile.all_computers) {
    return <NoData />;
  }

  if (count === 0) {
    return <>0 instances</>;
  }

  return (
    <StaticLink to={ROUTES.instances.root({ query: `profile:${query}` })}>
      {count} {pluralize(count, "instance")}
    </StaticLink>
  );
};

export default ProfileAssociatedInstancesLink;
