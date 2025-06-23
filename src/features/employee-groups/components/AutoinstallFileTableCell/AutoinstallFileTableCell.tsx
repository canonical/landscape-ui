import Chip from "@/components/layout/Chip";
import NoData from "@/components/layout/NoData";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AutoinstallFileTableCell.module.scss";

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
          message="This group will inherit default autoinstall file since none has been assigned."
        >
          <Chip value="Default" />
        </Tooltip>
      )}
    </div>
  );
};

export default AutoinstallFileTableCell;
