import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAutoinstallFileActions } from "../../hooks";
import type { AutoinstallFile } from "../../types";
import AutoinstallFileDeleteModal from "../AutoinstallFileDeleteModal";

interface AutoinstallFilesListActionsProps {
  readonly autoinstallFile: AutoinstallFile;
}

const AutoinstallFilesListActions: FC<AutoinstallFilesListActionsProps> = ({
  autoinstallFile,
}) => {
  const {
    value: isDeleteModalVisible,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean();
  const {
    openAutoinstallFileDetails,
    openAutoinstallFileEditForm,
    setAutoinstallFileAsDefault,
  } = useAutoinstallFileActions(autoinstallFile);

  const handleViewDetailsButtonClick = () => {
    openAutoinstallFileDetails();
  };

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View ${autoinstallFile.filename} details`,
      onClick: handleViewDetailsButtonClick,
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${autoinstallFile.filename}`,
      onClick: openAutoinstallFileEditForm,
    },
    {
      icon: "starred",
      label: "Set as default",
      "aria-label": `Set ${autoinstallFile.filename} as default`,
      onClick: setAutoinstallFileAsDefault,
      disabled: autoinstallFile.is_default,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${autoinstallFile.filename}`,
      onClick: openDeleteModal,
      disabled: autoinstallFile.is_default,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${autoinstallFile.filename} actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isDeleteModalVisible && (
        <AutoinstallFileDeleteModal
          autoinstallFile={autoinstallFile}
          close={closeDeleteModal}
        />
      )}
    </>
  );
};

export default AutoinstallFilesListActions;
