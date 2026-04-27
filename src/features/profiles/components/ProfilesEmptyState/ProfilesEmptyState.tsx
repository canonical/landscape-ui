import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";
import AddProfileButton from "../AddProfileButton";
import { Link } from "@canonical/react-components";
import { getLink, getMessage } from "./helpers";
import type { ProfileTypes } from "../../helpers";

interface ProfilesEmptyStateProps {
  readonly type: ProfileTypes;
}

const ProfilesEmptyState: FC<ProfilesEmptyStateProps> = ({ type }) => {
  const message = getMessage(type);
  const link = getLink(type);

  return (
    <EmptyState
      body={
        <>
          <p>{message}</p>
          <Link href={link} target="_blank" rel="nofollow noopener noreferrer">
            How to manage {type} profiles in Landscape
          </Link>
        </>
      }
      cta={[<AddProfileButton key="add" />]}
      title={`You haven't added any ${type} profiles yet.`}
      size="large"
    />
  );
};

export default ProfilesEmptyState;
