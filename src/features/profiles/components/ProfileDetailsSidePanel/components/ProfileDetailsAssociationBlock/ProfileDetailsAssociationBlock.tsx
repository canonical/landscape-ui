import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { Profile, ProfileType } from "../../../../types";
import { hasComplianceData, isWslProfile } from "../../../../helpers";
import ProfileAssociatedInstancesLink from "../../../ProfileAssociatedInstancesLink";
import Blocks from "@/components/layout/Blocks";
import { WslProfileNonCompliantParentsLink } from "@/features/wsl-profiles";
import usePageParams from "@/hooks/usePageParams";
import { getAssociationData } from "./helpers";

interface ProfileDetailsAssociationBlockProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ProfileDetailsAssociationBlock: FC<ProfileDetailsAssociationBlockProps> = ({
  profile,
  type,
}) => {
  const { createSidePathPusher } = usePageParams();
  const associationData = getAssociationData(profile);

  return (
    <Blocks.Item title="ASSOCIATION">
      <InfoGrid>
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
            value={profile.tags.join(", ")}
            type="truncated"
          />
        }
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ProfileDetailsAssociationBlock;
