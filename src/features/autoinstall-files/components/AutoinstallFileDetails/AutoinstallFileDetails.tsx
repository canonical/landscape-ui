import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type {
  AutoinstallFile,
  AutoinstallFileTabId,
  WithGroups,
} from "../../types";
import AutoinstallFileTabs from "../AutoinstallFileTabs";

interface AutoinstallFileDetailsProps {
  readonly edit: () => void;
  readonly file: WithGroups<AutoinstallFile>;
  readonly remove: () => void;
  readonly setAsDefault: () => void;
  readonly viewVersionHistory: () => void;
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
  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button className="p-segmented-control__button" onClick={edit}>
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          {!file.is_default && (
            <>
              <Button
                className="p-segmented-control__button"
                onClick={setAsDefault}
              >
                <Icon name="starred" />
                <span>Set as default</span>
              </Button>

              <Button className="p-segmented-control__button" onClick={remove}>
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
