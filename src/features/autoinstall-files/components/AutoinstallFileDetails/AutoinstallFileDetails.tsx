import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type {
  AutoinstallFile,
  AutoinstallFileWithGroups,
  TabId,
} from "../../types";
import AutoinstallFileTabs from "../AutoinstallFileTabs";

interface AutoinstallFileDetailsProps {
  readonly edit: (file: AutoinstallFile) => void;
  readonly file: AutoinstallFileWithGroups;
  readonly remove: (file: AutoinstallFile) => void;
  readonly setAsDefault: (file: AutoinstallFile) => void;
  readonly viewVersionHistory: (file: AutoinstallFileWithGroups) => void;
  readonly defaultTabId?: TabId;
}

const AutoinstallFileDetails: FC<AutoinstallFileDetailsProps> = ({
  defaultTabId,
  edit,
  file,
  remove,
  setAsDefault,
  viewVersionHistory,
}) => {
  const handleEditButtonClick = (): void => {
    edit(file);
  };

  const handleRemoveButtonClick = (): void => {
    remove(file);
  };

  const handleSetAsDefaultButtonClick = (): void => {
    setAsDefault(file);
  };

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            onClick={handleEditButtonClick}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          {!file.is_default && (
            <Button
              className="p-segmented-control__button"
              onClick={handleSetAsDefaultButtonClick}
            >
              <Icon name="starred" />
              <span>Set as default</span>
            </Button>
          )}

          {!file.is_default && (
            <Button
              className="p-segmented-control__button"
              onClick={handleRemoveButtonClick}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          )}
        </div>
      </div>

      <AutoinstallFileTabs
        defaultTabId={defaultTabId}
        file={file}
        openVersionHistory={viewVersionHistory}
      />
    </>
  );
};

export default AutoinstallFileDetails;
