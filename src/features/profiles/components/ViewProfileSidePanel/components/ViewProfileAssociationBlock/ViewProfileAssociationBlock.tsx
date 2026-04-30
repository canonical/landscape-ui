import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import {
  hasAssociations,
  hasComplianceData,
  type ProfileTypes,
} from "../../../../helpers";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import Blocks from "@/components/layout/Blocks";
import Chip from "@/components/layout/Chip";
import type { Profile } from "../../../../types";
import { useGetProfileAssociatedCount } from "../../../../hooks/useGetProfileAssociatedCount";

interface ViewProfileAssociationBlockProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
  readonly titleClassName?: string;
}

const ViewProfileAssociationBlock: FC<ViewProfileAssociationBlockProps> = ({
  profile,
  type,
  titleClassName,
}) => {
  const { associatedCount, isGettingInstances } =
    useGetProfileAssociatedCount(profile);

  return (
    <Blocks.Item title="Association" titleClassName={titleClassName}>
      <InfoGrid dense>
        <InfoGrid.Item
          label="Associated Instances"
          large
          value={
            !hasAssociations(profile) ? (
              <span>
                This profile has not yet been associated with any instances.
              </span>
            ) : (
              <ProfileAssociatedInstancesLink
                profile={profile}
                count={associatedCount}
                query={`${type}:${profile.id}`}
                isPending={isGettingInstances}
                isGeneralAssociation
              />
            )
          }
        />

        {hasAssociations(profile) && hasComplianceData(profile) && (
          <>
            <InfoGrid.Item
              label="Compliant"
              value={
                <ProfileAssociatedInstancesLink
                  profile={profile}
                  count={
                    profile.computers.constrained.length -
                    profile.computers["non-compliant"].length
                  }
                  query={`${type}:${profile.id}:compliant`}
                  isPending={isGettingInstances}
                />
              }
            />

            <InfoGrid.Item
              label="Not compliant"
              value={
                <ProfileAssociatedInstancesLink
                  profile={profile}
                  count={profile.computers["non-compliant"].length}
                  query={`${type}:${profile.id}:noncompliant`}
                  isPending={isGettingInstances}
                />
              }
            />
          </>
        )}
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

export default ViewProfileAssociationBlock;
