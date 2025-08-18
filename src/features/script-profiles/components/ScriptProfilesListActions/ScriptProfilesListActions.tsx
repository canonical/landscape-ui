import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";

interface ScriptProfilesListActionsProps {
  readonly scriptProfile: ScriptProfile;
}

const ScriptProfilesListActions: FC<ScriptProfilesListActionsProps> = ({
  scriptProfile,
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
        setPageParams({ sidePath: ["view"], scriptProfile: scriptProfile.id });
      },
    },
  ];

  if (!scriptProfile.archived) {
    nondestructiveActions.push({
      icon: "edit",
      label: "Edit",
      onClick: () => {
        setPageParams({ sidePath: ["edit"], scriptProfile: scriptProfile.id });
      },
    });
  }

  const destructiveActions: Action[] | undefined = !scriptProfile.archived
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
        toggleAriaLabel={`${scriptProfile.title} script profile actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />
      <ScriptProfileArchiveModal
        onClose={closeArchiveModal}
        opened={archiveModalOpened}
        profile={scriptProfile}
      />
    </>
  );
};

export default ScriptProfilesListActions;
