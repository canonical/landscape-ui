import type { FC } from "react";
import classNames from "classnames";
import { formatCountableNoun } from "@/utils/_helpers";

interface PackagesUpgradeInfoProps {
  readonly packageCount: number;
  readonly securityUpgradePackageCount: number;
  readonly totalUpgradePackageCount: number;
}

const PackagesUpgradeInfo: FC<PackagesUpgradeInfoProps> = ({
  packageCount,
  securityUpgradePackageCount,
  totalUpgradePackageCount,
}) => {
  const regularUpgradePackageCount =
    totalUpgradePackageCount - securityUpgradePackageCount;
  const noUpgradePackageCount = packageCount - totalUpgradePackageCount;

  return (
    <div>
      <span>
        You selected {formatCountableNoun(packageCount, "package")}. This will:
      </span>
      <ul
        className={classNames({
          "u-no-margin--bottom": noUpgradePackageCount > 0,
        })}
      >
        {securityUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            {formatCountableNoun(
              securityUpgradePackageCount,
              "security upgrade",
            )}
          </li>
        )}
        {regularUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            {formatCountableNoun(regularUpgradePackageCount, "regular upgrade")}
          </li>
        )}
      </ul>
      {noUpgradePackageCount > 0 && (
        <p>
          <span>No upgrades needed for </span>
          {formatCountableNoun(noUpgradePackageCount, "package")}.
        </p>
      )}
    </div>
  );
};

export default PackagesUpgradeInfo;
