import LoadingState from "@/components/layout/LoadingState";
// import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { WslProfileNonCompliantInstancesList } from "@/features/wsl-profiles";
import { ROUTES } from "@/libs/routes";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { Suspense, type FC } from "react";
import type { Profile } from "../..";
import { isScriptProfile, isWslProfile } from "../../helpers";
import useSidePanel from "@/hooks/useSidePanel";
import NoData from "@/components/layout/NoData";

interface ProfileAssociatedInstancesLinkProps {
  readonly count: number;
  readonly profile: Profile;
  readonly query: string;
}

const ProfileAssociatedInstancesLink: FC<ProfileAssociatedInstancesLinkProps> = ({ 
  count,
  profile,
  query,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const hasNoAssociations = (!profile.tags.length && !profile.all_computers)
    || (isScriptProfile(profile) && profile.trigger?.trigger_type === "event");

  if (hasNoAssociations) {
    return <NoData />;
  }

  if (count === 0) {
    return <>0 instances</>;
  }

  const text = profile.all_computers ? "All instances" : pluralizeWithCount(count, "instance");

  if (isWslProfile(profile) && query.endsWith(":non-compliant")) {
    return (
      <Button
        className="u-no-padding--top u-no-margin--bottom"
        type="button"
        appearance="link"
        onClick={() => {
          setSidePanelContent(
            `Instances not compliant with ${profile.title}`,
            <Suspense fallback={<LoadingState />}>
              <WslProfileNonCompliantInstancesList wslProfile={profile} />
            </Suspense>,
            "large",
          );
        }}
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
