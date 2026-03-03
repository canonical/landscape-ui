import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { Profile, ProfileType } from "../../../../types";
import { hasComplianceData, isWslProfile } from "../../../../helpers";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import Blocks from "@/components/layout/Blocks";
import { WslProfileNonCompliantParentsLink } from "@/features/wsl-profiles";
import usePageParams from "@/hooks/usePageParams";
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
  const { createSidePathPusher } = usePageParams();
  const associationData = getAssociationData(profile);

  return (
    <Blocks.Item title="Association">
      <InfoGrid dense>
        <InfoGrid.Item
          label="Associated Instances"
          large
          value={
            <ProfileAssociatedInstancesLink
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
              value={isWslProfile(profile)
                ? <WslProfileNonCompliantParentsLink
                    wslProfile={profile}
                    onClick={createSidePathPusher("noncompliant")}
                  />
                : <ProfileAssociatedInstancesLink
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
