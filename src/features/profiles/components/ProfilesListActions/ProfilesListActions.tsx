import ListActions from "@/components/layout/ListActions";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { Profile, ProfileType } from "../../types";
import RemoveProfileModal from "../RemoveProfileModal";
import { useGetProfileActions } from "../../hooks/useGetProfileActions";

interface PackageProfileListActionsProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
  type,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const actions = useGetProfileActions({ profile, type, handleOpenModal: openModal });

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions.slice(0, -1)}
        destructiveActions={actions.slice(-1)}
      />

      <RemoveProfileModal
        closeModal={closeModal}
        opened={isModalOpen}
        profile={profile}
        type={type}
      />
    </>
  );
};

export default ProfileListActions;
