import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { WslProfileNonCompliantInstancesList } from "@/features/wsl-profiles";
import { ROUTES } from "@/libs/routes";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { Suspense, type FC } from "react";
import type { Profile } from "../../types";
import {
  hasAssociations,
  isPackageProfile,
  isPostEnrollmentScriptProfile,
  isWslProfile,
} from "../../helpers";
import useSidePanel from "@/hooks/useSidePanel";
import NoData from "@/components/layout/NoData";

interface ProfileAssociatedInstancesLinkProps {
  readonly count: number;
  readonly profile: Profile;
  readonly query: string;
  readonly isPending?: boolean;
  readonly isGeneralAssociation?: boolean;
}

const ProfileAssociatedInstancesLink: FC<
  ProfileAssociatedInstancesLinkProps
> = ({
  count,
  profile,
  query,
  isPending = false,
  isGeneralAssociation = false,
}) => {
  const { setSidePanelContent } = useSidePanel();

  if (isPending) {
    return <LoadingState inline />;
  }

  const hasNoAssociations =
    !hasAssociations(profile) || isPostEnrollmentScriptProfile(profile);

  if (hasNoAssociations) {
    return <NoData />;
  }

  if (count === 0) {
    return <>0 instances</>;
  }

  const text =
    isGeneralAssociation && profile.all_computers
      ? "All instances"
      : pluralizeWithCount(count, "instance");

  const getPackageComplianceIds = () => {
    if (isPackageProfile(profile) && !isGeneralAssociation) {
      return query.endsWith(":noncompliant")
        ? profile.computers["non-compliant"]
        : profile.computers.constrained.filter(
            (id) => !profile.computers["non-compliant"].includes(id),
          );
    }
  };

  const formattedQuery =
    getPackageComplianceIds()
      ?.map((id) => `id:${id}`)
      .join(" OR ") ?? `profile:${query.toLowerCase()}`;

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
