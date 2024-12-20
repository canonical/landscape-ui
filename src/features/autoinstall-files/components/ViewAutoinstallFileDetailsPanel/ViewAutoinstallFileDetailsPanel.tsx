import { Button, Icon } from "@canonical/react-components";
import { FC } from "react";
import { AutoinstallFile } from "../../types";
import classes from "./ViewAutoinstallFileDetailsPanel.module.scss";
import ViewAutoinstallFileDetailsTabs from "../ViewAutoinstallFileDetailsTabs";
import ViewAutoinstallFileDetailsEditButton from "../ViewAutoinstallFileDetailsEditButton";

const ViewAutoinstallFileDetailsPanel: FC<{ file: AutoinstallFile }> = ({
  file,
}) => {
  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <ViewAutoinstallFileDetailsEditButton fileName={file.name} />

          <Button className="p-segmented-control__button" disabled>
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
