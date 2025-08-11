import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";

interface ScriptProfilesListActionsProps {
  readonly profile: ScriptProfile;
}

const ScriptProfilesListActions: FC<ScriptProfilesListActionsProps> = ({
  profile,
}) => {
  const { setPageParams } = usePageParams();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      onClick: () => {
        setPageParams({ action: "view", scriptProfile: profile.id });
      },
    },
  ];

  if (!profile.archived) {
    nondestructiveActions.push({
      icon: "edit",
      label: "Edit",
      onClick: () => {
        setPageParams({ action: "edit", scriptProfile: profile.id });
      },
    });
  }

  const destructiveActions: Action[] | undefined = !profile.archived
    ? [
        {
          icon: "archive",
          label: "Archive",
          onClick: openArchiveModal,
        },
      ]
    : undefined;

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} script profile actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />

      <ScriptProfileArchiveModal
        onClose={closeArchiveModal}
        opened={archiveModalOpened}
        profile={profile}
      />
    </>
  );
};

export default ScriptProfilesListActions;
