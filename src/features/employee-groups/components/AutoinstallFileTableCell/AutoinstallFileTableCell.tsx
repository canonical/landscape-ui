import classNames from "classnames";
import type { FC } from "react";
import classes from "./AutoinstallFileTableCell.module.scss";
import NoData from "@/components/layout/NoData";
import { Tooltip } from "@canonical/react-components";

interface AutoinstallFileTableCellProps {
  readonly fileName: string | undefined;
  readonly isDefault: boolean | undefined;
  readonly version: number | undefined;
}

const AutoinstallFileTableCell: FC<AutoinstallFileTableCellProps> = ({
  fileName,
  isDefault,
  version,
}) => {
  if (!fileName || !version) {
    return <NoData />;
  }

  return (
    <div className={classes.container}>
      <span>
        {fileName}, v{version}
      </span>
      {isDefault && (
        <Tooltip
          position="top-center"
          message="This group will inherit default Autoinstall file since none has been assigned."
        >
          <small
            className={classNames(
              classes.defaultAutoinstallFileChip,
              "u-no-margin--bottom",
            )}
          >
            default
          </small>
        </Tooltip>
      )}
    </div>
  );
};

export default AutoinstallFileTableCell;
