import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { WslProfileNonCompliantInstancesList } from "@/features/wsl-profiles";
import { ROUTES } from "@/libs/routes";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button, Spinner } from "@canonical/react-components";
import { Suspense, type FC } from "react";
import type { Profile } from "../..";
import { hasAssociations, isPostEnrollmentScriptProfile, isWslProfile } from "../../helpers";
import useSidePanel from "@/hooks/useSidePanel";
import NoData from "@/components/layout/NoData";

interface ProfileAssociatedInstancesLinkProps {
  readonly count: number;
  readonly profile: Profile;
  readonly query: string;
  readonly isPending?: boolean;
  readonly isGeneralAssociation?: boolean;
}

const ProfileAssociatedInstancesLink: FC<ProfileAssociatedInstancesLinkProps> = ({ 
  count,
  profile,
  query,
  isPending = false,
  isGeneralAssociation = false,
}) => {
  const { setSidePanelContent } = useSidePanel();

  if (isPending) {
    return <Spinner />;
  }

  const hasNoAssociations = !hasAssociations(profile) || isPostEnrollmentScriptProfile(profile);

  if (hasNoAssociations) {
    return <NoData />;
  }

  if (count === 0) {
    return <>0 instances</>;
  }

  const text = isGeneralAssociation && profile.all_computers 
    ? "All instances" 
    : pluralizeWithCount(count, "instance");

  const formattedQuery = query.startsWith("profile:") ? query.toLowerCase() : query;

  if (isWslProfile(profile) && query.endsWith(":noncompliant")) {
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
    <StaticLink to={ROUTES.instances.root({ query: formattedQuery })}>
      {text}
    </StaticLink>
  );
};

export default ProfileAssociatedInstancesLink;
