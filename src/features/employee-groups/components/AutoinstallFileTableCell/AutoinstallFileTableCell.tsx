import NoData from "@/components/layout/NoData";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AutoinstallFileTableCell.module.scss";
import classNames from "classnames";

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
          positionElementClassName={classes.position}
          message="This group will inherit default Autoinstall file since none has been assigned."
        >
          <span
            className={classNames(
              "p-chip is-dense u-no-margin--bottom",
              classes.chip,
            )}
          >
            <span className="p-chip__value">default</span>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default AutoinstallFileTableCell;
