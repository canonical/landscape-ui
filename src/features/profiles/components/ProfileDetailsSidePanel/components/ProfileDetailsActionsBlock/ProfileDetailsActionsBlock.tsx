import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemoveProfileModal from "../../../RemoveProfileModal";
import type { Profile, ProfileType } from "../../../../types";
import { ResponsiveButtons } from "@/components/ui";
import { canArchiveProfile } from "../../../../helpers";
import type { Action } from "@/types/Action";

interface ProfileDetailsActionsBlockProps {
  readonly profile: Profile;
  readonly type: ProfileType;
  readonly extraActions: Action[];
}

const ProfileDetailsActionsBlock: FC<ProfileDetailsActionsBlockProps> = ({
  profile,
  type,
  extraActions,
}) => {
  const { createSidePathPusher } = usePageParams();

  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  const handleProfileEdit = createSidePathPusher("edit");
  const handleProfileDuplicate = createSidePathPusher("duplicate");

  const archive = canArchiveProfile(profile);

  const buttons: Action[] = [
    {
      label: "Edit",
      icon: "edit",
      onClick: handleProfileEdit,
    },
    ...extraActions,
    {
      label: "Duplicate",
      icon: "canvas",
      onClick: handleProfileDuplicate,
    },
    {
      label: archive ? "Archive" : "Remove",
      icon: archive ? "archive" : ICONS.delete,
      onClick: handleOpenModal,
      appearance: "negative",
    },
  ];

  return (
    <>
        <ResponsiveButtons
          buttons={buttons.map((action) => (
            <Button
              key={action.title}
              className="p-segmented-control__button u-no-margin"
              hasIcon
              type="button"
              appearance={action.appearance ?? "positive"}
              onClick={action.onClick}
              aria-label={`${action.label} ${profile.title} ${type} profile`}
            >
              <Icon name={action.icon} />
              <span>{action.label}</span>
            </Button>
          ))}
        />

      <RemoveProfileModal
        closeModal={handleCloseModal}
        opened={modalOpen}
        profile={profile}
        type={type}
      />
    </>
  );
};

export default ProfileDetailsActionsBlock;
