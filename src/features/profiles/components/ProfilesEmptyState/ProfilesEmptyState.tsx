import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";
import AddProfileButton from "../AddProfileButton";
import type { ProfileType } from "../../types";
// import { Link } from "@canonical/react-components";
import { getLink, getMessage } from "./helpers";
import { Link } from "@canonical/react-components";

interface ProfilesEmptyStateProps {
  readonly type: ProfileType;
}

const ProfilesEmptyState: FC<ProfilesEmptyStateProps> = ({ type }) => {
  const message = getMessage(type);
  const link = getLink(type);

  return (
    <EmptyState
      body={
        <>
          <p>{message}</p>
          {!!link &&
            <Link
              href={link.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
            {link.text}
          </Link>
          }
        </>
      }
      cta={[<AddProfileButton key="add" type={type} />]}
      title={`No ${type} profiles found`}
    />
  );
};

export default ProfilesEmptyState;
