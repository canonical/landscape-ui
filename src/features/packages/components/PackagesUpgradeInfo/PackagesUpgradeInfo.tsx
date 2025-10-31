import type { FC } from "react";
import classNames from "classnames";
import { pluralize } from "@/utils/_helpers";

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
      <span>You selected </span>
      <span>
        <b>{packageCount}</b>
      </span>
      <span> packages. This will:</span>
      <ul
        className={classNames({
          "u-no-margin--bottom": noUpgradePackageCount > 0,
        })}
      >
        {securityUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            <span>
              <b>{securityUpgradePackageCount} </b>
            </span>
            <span>
              security {pluralize(securityUpgradePackageCount, "upgrade")}
            </span>
          </li>
        )}
        {regularUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            <span>
              <b>{regularUpgradePackageCount}</b>
            </span>
            <span>
              regular {pluralize(regularUpgradePackageCount, "upgrade")}
            </span>
          </li>
        )}
      </ul>
      {noUpgradePackageCount > 0 && (
        <p>
          <span>No upgrades for </span>
          <span>
            <b>{noUpgradePackageCount}</b>
          </span>
          <span>{pluralize(noUpgradePackageCount, "package")} needed.</span>
        </p>
      )}
    </div>
  );
};

export default PackagesUpgradeInfo;
