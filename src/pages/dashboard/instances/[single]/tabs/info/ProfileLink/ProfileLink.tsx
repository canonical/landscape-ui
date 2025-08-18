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
          package: `/profiles/package?sidePath=view&packageProfile=${profile.name}`,
          reboot: `/profiles/reboot?sidePath=view&rebootProfile=${profile.id}`,
          removal: `/profiles/removal?sidePath=view&removalProfile=${profile.id}`,
          script: `/scripts?tab=profiles&sidePath=view&scriptProfile=${profile.id}`,
          security: `/profiles/security?sidePath=view&securityProfile=${profile.id}`,
          upgrade: `/profiles/upgrade?sidePath=view&upgradeProfile=${profile.id}`,
          wsl: `/profiles/wsl?sidePath=view&wslProfile=${profile.name}`,
        }[profile.type]
      }
    >
      {profile.title}
    </StaticLink>
  );
};

export default ProfileLink;
