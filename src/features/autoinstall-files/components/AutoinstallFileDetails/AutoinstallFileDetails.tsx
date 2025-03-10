import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFileWithGroups, TabId } from "../../types";
import AutoinstallFileTabs from "../AutoinstallFileTabs";

interface AutoinstallFileDetailsProps {
  readonly file: AutoinstallFileWithGroups;
  readonly openEditPanel: () => void;
  readonly openVersionHistory: () => void;
  readonly defaultTabId?: TabId;
}

const AutoinstallFileDetails: FC<AutoinstallFileDetailsProps> = ({
  defaultTabId,
  file,
  openEditPanel,
  openVersionHistory,
}) => {
  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            onClick={openEditPanel}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          {!file.is_default && (
            <Button className="p-segmented-control__button">
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          )}
        </div>
      </div>

      <AutoinstallFileTabs
        defaultTabId={defaultTabId}
        file={file}
        openVersionHistory={openVersionHistory}
      />
    </>
  );
};

export default AutoinstallFileDetails;
