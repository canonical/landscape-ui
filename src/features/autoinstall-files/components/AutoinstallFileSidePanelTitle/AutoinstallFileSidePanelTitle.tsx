import Chip from "@/components/layout/Chip";
import type { FC } from "react";
import type { AutoinstallFile } from "../../types";
import classes from "./AutoinstallFileSidePanelTitle.module.scss";

interface AutoinstallFileSidePanelTitleProps {
  readonly file: AutoinstallFile;
  readonly title?: string;
  readonly version?: number;
}

const AutoinstallFileSidePanelTitle: FC<AutoinstallFileSidePanelTitleProps> = ({
  file,
  title,
  version = file.version,
}) => {
  return (
    <span>
      <span className={classes.text}>
        {!!title && `${title} `}
        {file.filename}, v{version}
      </span>
      {file.is_default && <Chip className={classes.chip} value="Default" />}
    </span>
  );
};

export default AutoinstallFileSidePanelTitle;
