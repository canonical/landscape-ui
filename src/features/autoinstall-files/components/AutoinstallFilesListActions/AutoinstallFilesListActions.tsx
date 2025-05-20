import ListActions from "@/components/layout/ListActions";
import type { FC } from "react";
import type { AutoinstallFile, WithGroups } from "../../types";

interface AutoinstallFilesListActionsProps {
  readonly edit: (file: AutoinstallFile) => void;
  readonly file: WithGroups<AutoinstallFile>;
  readonly remove: (file: AutoinstallFile) => void;
  readonly setAsDefault: (file: AutoinstallFile) => void;
  readonly viewDetails: (file: WithGroups<AutoinstallFile>) => void;
}

const AutoinstallFilesListActions: FC<AutoinstallFilesListActionsProps> = ({
  edit,
  file,
  remove,
  setAsDefault,
  viewDetails,
}) => {
  const actions = [
    {
      icon: "topic",
      label: "View details",
      "aria-label": `View ${file.filename} details`,
      hasIcon: true,
      onClick: (): void => {
        viewDetails(file);
      },
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${file.filename}`,
      onClick: (): void => {
        edit(file);
      },
    },
    {
      icon: "starred",
      label: "Set as default",
      "aria-label": `Set ${file.filename} as default`,
      onClick: (): void => {
        setAsDefault(file);
      },
      disabled: file.is_default,
    },
  ];

  const destructiveActions = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${file.filename}`,
      onClick: (): void => {
        remove(file);
      },
      disabled: file.is_default,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${file.filename} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />
    </>
  );
};

export default AutoinstallFilesListActions;
