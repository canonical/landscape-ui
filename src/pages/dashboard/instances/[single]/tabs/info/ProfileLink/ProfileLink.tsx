import StaticLink from "@/components/layout/StaticLink";
import type { Profile } from "@/types/Profile";
import type { FC } from "react";

interface ProfileLinkProps {
  readonly profile: Profile;
}

const ProfileLink: FC<ProfileLinkProps> = ({ profile }) => {
  if (profile.type === "repository") {
    return profile.title;
  }

  return (
    <StaticLink
      to={
        {
          package: `/profiles/package?action=view&packageProfile=${profile.name}`,
          reboot: `/profiles/reboot?action=view&rebootProfile=${profile.id}`,
          removal: `/profiles/removal?action=view&removalProfile=${profile.id}`,
          script: `/scripts?tab=profiles&action=view&scriptProfile=${profile.id}`,
          security: `/profiles/security?action=view&securityProfile=${profile.id}`,
          upgrade: `/profiles/upgrade?action=view&upgradeProfile=${profile.id}`,
          wsl: `/profiles/wsl?action=view&wslProfile=${profile.name}`,
        }[profile.type]
      }
    >
      {profile.title}
    </StaticLink>
  );
};

export default ProfileLink;
