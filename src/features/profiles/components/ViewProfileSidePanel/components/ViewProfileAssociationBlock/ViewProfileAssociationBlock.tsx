import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { Profile, ProfileType } from "../../../../types";
import { hasComplianceData } from "../../../../helpers";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import Blocks from "@/components/layout/Blocks";
import { getAssociationData } from "./helpers";
import Chip from "@/components/layout/Chip/Chip";

interface ViewProfileAssociationBlockProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ViewProfileAssociationBlock: FC<ViewProfileAssociationBlockProps> = ({
  profile,
  type,
}) => {
  const associationData = getAssociationData(profile);

  return (
    <Blocks.Item title="Association">
      <InfoGrid dense>
        <InfoGrid.Item
          label="Associated Instances"
          large
          value={!profile.tags.length && !profile.all_computers
            ? <p>This profile has not yet been associated with any instances.</p>
            : <ProfileAssociatedInstancesLink
              profile={profile}
              count={associationData}
              query={`${type}:${profile.id}`}
            />
          }
        />

        {hasComplianceData(profile) &&
          <>
            <InfoGrid.Item
              label="Compliant"
              value={
                <ProfileAssociatedInstancesLink
                  profile={profile}
                  count={
                    profile.computers?.constrained.length -
                    profile.computers?.["non-compliant"].length
                  }
                  query={`${type}:${profile.id}:compliant`}
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
                />
              }
            />
          </>
        }
        {!!profile.tags.length &&
          <InfoGrid.Item
            label="Tags"
            large
            value={profile.tags.map((tag) => (
              <Chip key={tag} value={tag} />
            ))}
          />
        }
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ViewProfileAssociationBlock;
