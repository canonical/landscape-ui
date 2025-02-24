import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import ViewAutoinstallFileDetailsEditButton from "../ViewAutoinstallFileDetailsEditButton";
import ViewAutoinstallFileDetailsTabs from "../ViewAutoinstallFileDetailsTabs";
import classes from "./ViewAutoinstallFileDetailsPanel.module.scss";

const ViewAutoinstallFileDetailsPanel: FC<{
  readonly file: AutoinstallFileWithGroups;
}> = ({ file }) => {
  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <ViewAutoinstallFileDetailsEditButton file={file} />

          <Button
            className="p-segmented-control__button"
            disabled={file.is_default}
          >
            <Icon name="delete" />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      <div className={classes.container}>
        <ViewAutoinstallFileDetailsTabs file={file} />
      </div>
    </>
  );
};

export default ViewAutoinstallFileDetailsPanel;
