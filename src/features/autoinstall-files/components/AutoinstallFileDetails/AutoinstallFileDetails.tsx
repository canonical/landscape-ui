import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFileWithGroups, TabId } from "../../types";
import ViewAutoinstallFileDetailsTabs from "../ViewAutoinstallFileDetailsTabs";

interface AutoinstallFileDetailsProps {
  readonly file: AutoinstallFileWithGroups;
  readonly openDetailsPanel: (defaultTabId: TabId) => void;
  readonly openEditPanel: () => void;
  readonly defaultTabId?: TabId;
}

const AutoinstallFileDetails: FC<AutoinstallFileDetailsProps> = ({
  defaultTabId,
  file,
  openDetailsPanel,
  openEditPanel,
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

          <Button
            className="p-segmented-control__button"
            disabled={file.is_default}
          >
            <Icon name="delete" />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      <ViewAutoinstallFileDetailsTabs
        defaultTabId={defaultTabId}
        file={file}
        openDetailsPanel={openDetailsPanel}
      />
    </>
  );
};

export default AutoinstallFileDetails;
