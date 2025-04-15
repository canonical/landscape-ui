import classNames from "classnames";
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
    <div className={classes.container}>
      {!!title && `${title} `}
      {file.filename}, v{version}
      {file.is_default && (
        <span
          className={classNames(
            "p-chip is-dense u-no-margin--bottom",
            classes.chip,
          )}
        >
          <span className="p-chip__value">default</span>
        </span>
      )}
    </div>
  );
};

export default AutoinstallFileSidePanelTitle;
