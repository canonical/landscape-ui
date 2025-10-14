import type { FC, ReactNode } from "react";

interface ProfileAssociationProps {
  readonly profile: {
    tags: unknown[];
    all_computers?: boolean;
  };
  readonly children?: ReactNode;
}

const ProfileAssociationInfo: FC<ProfileAssociationProps> = ({
  children,
  profile,
}) => {
  if (profile.all_computers) {
    return <p>This profile has been associated with all instances.</p>;
  }

  if (profile.tags.length) {
    return children;
  }

  return <p>This profile has not yet been associated with any instances.</p>;
};

export default ProfileAssociationInfo;
