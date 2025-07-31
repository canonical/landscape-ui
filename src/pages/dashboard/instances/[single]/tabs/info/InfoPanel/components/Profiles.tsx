import useAuth from "@/hooks/useAuth";
import type { Profile } from "@/types/Instance";
import type { FC } from "react";

interface ProfilesProps {
  profiles: Profile[];
}

const Profiles: FC<ProfilesProps> = ({ profiles }) => {
  const { isFeatureEnabled } = useAuth();

  if (!isFeatureEnabled("script-profiles")) {
    profiles = profiles.filter((profile) => profile.type !== "script");
  }

  if (!isFeatureEnabled("usg-profiles")) {
    profiles = profiles.filter((profile) => profile.type !== "security");
  }

  if (!isFeatureEnabled("wsl-child-instance-profiles")) {
    profiles = profiles.filter((profile) => profile.type !== "wsl");
  }

  return profiles.map((profile, index) => (
    <span key={`${profile.type}${profile.id}`}>
      {profile.title}
      {index < profiles.length - 1 ? ", " : ""}
    </span>
  ));
};

export default Profiles;
