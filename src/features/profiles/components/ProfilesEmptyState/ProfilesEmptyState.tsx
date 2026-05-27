import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";
import AddProfileButton from "../AddProfileButton";
import { getLink, getMessage } from "./helpers";
import type { ProfileTypes } from "../../helpers";

interface ProfilesEmptyStateProps {
  readonly type: ProfileTypes;
}

const ProfilesEmptyState: FC<ProfilesEmptyStateProps> = ({ type }) => {
  return (
    <EmptyState
      body={getMessage(type)}
      link={{
        href: getLink(type),
        text: `How to manage ${type} profiles in Landscape`,
      }}
      cta={[<AddProfileButton key="add" />]}
      title={`You haven't added any ${type} profiles yet.`}
    />
  );
};

export default ProfilesEmptyState;
