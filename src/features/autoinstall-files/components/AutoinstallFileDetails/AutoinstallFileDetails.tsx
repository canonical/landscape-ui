import { ResponsiveButtons } from "@/components/ui";
import { ActionButton, Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAutoinstallFileActions } from "../../hooks";
import type { AutoinstallFile, AutoinstallFileTabId } from "../../types";
import AutoinstallFileDeleteModal from "../AutoinstallFileDeleteModal";
import AutoinstallFileTabs from "../AutoinstallFileTabs";

interface AutoinstallFileDetailsProps {
  readonly autoinstallFile: AutoinstallFile;
  readonly initialTabId?: AutoinstallFileTabId;
}

const AutoinstallFileDetails: FC<AutoinstallFileDetailsProps> = ({
  autoinstallFile,
  initialTabId,
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
    isSettingAutoinstallFileAsDefault,
  } = useAutoinstallFileActions(autoinstallFile);

  const viewVersionHistory = () => {
    openAutoinstallFileDetails("version-history");
  };

  return (
    <>
      <ResponsiveButtons
        collapseFrom="xs"
        buttons={[
          <Button
            key="edit"
            type="button"
            onClick={openAutoinstallFileEditForm}
            hasIcon
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>,
          <ActionButton
            key="set-as-default"
            type="button"
            onClick={setAutoinstallFileAsDefault}
            disabled={autoinstallFile.is_default}
            hasIcon
            loading={isSettingAutoinstallFileAsDefault}
          >
            <Icon name="starred" />
            <span>Set as default</span>
          </ActionButton>,
          <Button
            key="remove"
            type="button"
            onClick={openDeleteModal}
            disabled={autoinstallFile.is_default}
            hasIcon
          >
            <Icon name={ICONS.delete} />
            <span>Remove</span>
          </Button>,
        ]}
      />

      <AutoinstallFileTabs
        initialTabId={initialTabId}
        file={autoinstallFile}
        viewVersionHistory={viewVersionHistory}
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

export default AutoinstallFileDetails;
