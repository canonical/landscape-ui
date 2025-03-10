import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type {
  AutoinstallFile,
  AutoinstallFileTabId,
  WithGroups,
} from "../../types";
import AutoinstallFileTabs from "../AutoinstallFileTabs";

interface AutoinstallFileDetailsProps {
  readonly edit: (file: AutoinstallFile) => void;
  readonly file: WithGroups<AutoinstallFile>;
  readonly remove: (file: AutoinstallFile) => void;
  readonly setAsDefault: (file: AutoinstallFile) => void;
  readonly viewVersionHistory: (file: WithGroups<AutoinstallFile>) => void;
  readonly initialTabId?: AutoinstallFileTabId;
}

const AutoinstallFileDetails: FC<AutoinstallFileDetailsProps> = ({
  edit,
  file,
  remove,
  setAsDefault,
  viewVersionHistory,
  initialTabId,
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
            <>
              <Button
                className="p-segmented-control__button"
                onClick={handleSetAsDefaultButtonClick}
              >
                <Icon name="starred" />
                <span>Set as default</span>
              </Button>

              <Button
                className="p-segmented-control__button"
                onClick={handleRemoveButtonClick}
              >
                <Icon name="delete" />
                <span>Remove</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <AutoinstallFileTabs
        initialTabId={initialTabId}
        file={file}
        viewVersionHistory={viewVersionHistory}
      />
    </>
  );
};

export default AutoinstallFileDetails;
