import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useGetWslLimits } from "@/features/wsl";
import {
  useGetWslProfiles,
} from "@/features/wsl-profiles";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";

const WslProfilesPage: FC = () => {
  const { isGettingWslProfiles, wslProfiles, wslProfilesCount } = useGetWslProfiles(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    },
  );

  const { isGettingWslLimits, wslProfileLimit } = useGetWslLimits();
  const isWslProfileLimitReached = wslProfilesCount >= wslProfileLimit;

  return (
    <PageMain>
      <PageHeader
        title="WSL profiles"
        actions={wslProfilesCount ? [
          <AddProfileButton
            key="add-wsl-profile"
            disabled={isWslProfileLimitReached}
            type="wsl"
          />
        ] : undefined }
      />
      <PageContent hasTable>
        <Notification
          severity="caution"
          title="WSL profiles is a beta feature"
        >
          We are gathering feedback to improve this feature.{" "}
          <a
            target="_blank"
            rel="noreferrer noopener nofollow"
            href="https://discourse.ubuntu.com/t/feedback-on-the-new-web-portal/50528"
          >
            Share your feedback
          </a>
        </Notification>
        <ProfilesContainer
          type={"wsl"}
          profiles={wslProfiles}
          profilesCount={wslProfilesCount}
          isPending={isGettingWslLimits || isGettingWslProfiles}
          isProfileLimitReached={isWslProfileLimitReached}
        />
      </PageContent>
    </PageMain>
  );
};

export default WslProfilesPage;
