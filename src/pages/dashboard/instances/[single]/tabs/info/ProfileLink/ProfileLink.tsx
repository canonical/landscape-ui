import StaticLink from "@/components/layout/StaticLink";
import type { Profile } from "@/types/Profile";
import type { FC } from "react";

interface ProfileLinkProps {
  readonly profile: Profile;
}

const ProfileLink: FC<ProfileLinkProps> = ({ profile }) => (
  <StaticLink
    to={
      {
        package: `/profiles/package?action=view&packageProfile=${profile.name}`,
        reboot: `/profiles/reboot?action=view&rebootProfile=${profile.id}`,
        removal: `/profiles/removal?action=view&removalProfile=`,
        repository: `/profiles/repository?action=view&repositoryProfile=`,
        script: `/scripts?tab=profiles&action=view&scriptProfile=`,
        security: `/profiles/security?action=view&securityProfile=`,
        upgrade: `/profiles/upgrade?action=view&upgradeProfile=`,
        wsl: `/profiles/wsl?action=view&wslProfile=`,
      }[profile.type]
    }
  >
    {profile.title}
  </StaticLink>
);

export default ProfileLink;
