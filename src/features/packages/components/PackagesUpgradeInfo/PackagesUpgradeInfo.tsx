import { FC } from "react";
import classNames from "classnames";

interface PackagesUpgradeInfoProps {
  packageCount: number;
  securityUpgradePackageCount: number;
  totalUpgradePackageCount: number;
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
              <b>{securityUpgradePackageCount}</b>
            </span>
            <span>
              {securityUpgradePackageCount === 1
                ? " security upgrade"
                : " security upgrades"}
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
              {regularUpgradePackageCount === 1
                ? " regular upgrade"
                : " regular upgrades"}
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
          <span>
            {noUpgradePackageCount === 1
              ? " package needed."
              : " packages needed."}
          </span>
        </p>
      )}
    </div>
  );
};

export default PackagesUpgradeInfo;
