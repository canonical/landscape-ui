import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";
import classes from "./ViewAutoinstallFileDetailsPanel.module.scss";
import ViewAutoinstallFileDetailsTabs from "../ViewAutoinstallFileDetailsTabs";
import ViewAutoinstallFileDetailsEditButton from "../ViewAutoinstallFileDetailsEditButton";

const ViewAutoinstallFileDetailsPanel: FC<{
  readonly file: AutoinstallFile;
  readonly isDefault: boolean;
}> = ({ file, isDefault }) => {
  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <ViewAutoinstallFileDetailsEditButton fileName={file.filename} />

          <Button className="p-segmented-control__button" disabled={isDefault}>
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
