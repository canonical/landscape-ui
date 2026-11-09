import AppTabs from "@/components/AppTabs";
import Blocks from "@/components/layout/Blocks";
import Chip from "@/components/layout/Chip";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { PackageProfileDetailsConstraints } from "@/features/package-profiles";
import {
  hasAssociations,
  hasSchedule,
  isPackageProfile,
  type Profile,
  ProfileTypes,
  useGetProfileAssociatedCount,
  ViewProfileDetailsBlock,
  ViewProfileGeneralBlock,
  ViewProfileScheduleBlock,
} from "@/features/profiles";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import { Suspense } from "react";

/** The association of a profile as text: a support session cannot open instances. */
const AssociationBlock: FC<{ readonly profile: Profile }> = ({ profile }) => {
  const { associatedCount } = useGetProfileAssociatedCount(profile);

  const getAssociation = () => {
    if (!hasAssociations(profile)) {
      return "This profile has not yet been associated with any instances.";
    }

    return profile.all_computers
      ? "All instances"
      : pluralize(associatedCount, ["instance"], "exact");
  };

  return (
    <Blocks.Item title="Association">
      <InfoGrid dense>
        <InfoGrid.Item
          label="Associated instances"
          large
          value={getAssociation()}
        />
        {!!profile.tags.length && (
          <InfoGrid.Item
            label="Tags"
            large
            value={profile.tags.map((tag) => (
              <Chip key={tag} value={tag} />
            ))}
          />
        )}
      </InfoGrid>
    </Blocks.Item>
  );
};

interface SupportProfileSidePanelProps {
  readonly type: ProfileTypes;
  readonly profile: Profile | undefined;
}

/** A profile's details, read-only; loading while `profile` is undefined. */
const SupportProfileSidePanel: FC<SupportProfileSidePanelProps> = ({
  type,
  profile,
}) => {
  if (!profile) {
    return <SidePanel.LoadingState />;
  }

  const packageProfile =
    type === ProfileTypes.package && isPackageProfile(profile) ? profile : null;

  const info = (
    <Blocks>
      <ViewProfileGeneralBlock type={type} profile={profile} />
      <ViewProfileDetailsBlock profile={profile} />
      {hasSchedule(type) && <ViewProfileScheduleBlock profile={profile} />}
      <AssociationBlock profile={profile} />
    </Blocks>
  );

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        {packageProfile ? (
          <AppTabs
            aria-label="Profile details"
            slot="panel"
            items={[
              { id: "info", label: "Info", panel: info },
              {
                id: "package-constraints",
                label: "Package constraints",
                panel: (
                  <PackageProfileDetailsConstraints profile={packageProfile} />
                ),
              },
            ]}
          />
        ) : (
          <Suspense fallback={<LoadingState />}>{info}</Suspense>
        )}
      </SidePanel.Content>
    </>
  );
};

export default SupportProfileSidePanel;
