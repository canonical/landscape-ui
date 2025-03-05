import Chip from "@/components/layout/Chip";
import NoData from "@/components/layout/NoData";
import { Tooltip } from "@canonical/react-components";
import type { FC } from "react";

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
    <div>
      <span>
        {fileName}, v{version}
      </span>
      {isDefault && (
        <Tooltip
          position="top-center"
          message="This group will inherit default Autoinstall file since none has been assigned."
        >
          <Chip text="default" />
        </Tooltip>
      )}
    </div>
  );
};

export default AutoinstallFileTableCell;
