import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams/usePageParams";
import { ROUTES } from "@/libs/routes";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

interface ProfileAssociatedInstancesLinkProps {
  readonly count: number;
  readonly profile: {
    id: number;
    tags: string[];
    all_computers: boolean;
    trigger?: { event_type?: string };
  };
  readonly query: string;
}

const ProfileAssociatedInstancesLink: FC<ProfileAssociatedInstancesLinkProps> = ({ 
  count,
  profile,
  query,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const hasNoData = (!profile.tags.length && !profile.all_computers) || profile.trigger?.event_type == "post_enrollment";
  
  if (hasNoData) {
    return <NoData />;
  }

  if (count === 0) {
    return <>0 instances</>;
  }

  const text = pluralizeWithCount(count, "instance");

  if (query.startsWith("wsl:") && query.endsWith(":non-compliant")) {
    return (
      <Button
        className="u-no-padding--top u-no-margin--bottom"
        type="button"
        appearance="link"
        onClick={createPageParamsSetter({
          sidePath: ["noncompliant"],
          profile: profile.id.toString(),
        })}
      >
        {text}
      </Button>
    );
  }

  return (
    <StaticLink to={ROUTES.instances.root({ query: `profile:${query}` })}>
      {text}
    </StaticLink>
  );
};

export default ProfileAssociatedInstancesLink;
