import StaticLink from "@/components/layout/StaticLink";
import type { Profile } from "@/types/Profile";
import type { FC } from "react";
import { getTo } from "./helpers";

interface ProfileLinkProps {
  readonly profile: Profile;
}

const ProfileLink: FC<ProfileLinkProps> = ({ profile }) => (
  <StaticLink to={getTo(profile)}>{profile.title}</StaticLink>
);

export default ProfileLink;
