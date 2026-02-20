import type { FC } from "react";
import classNames from "classnames";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount";

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
        You selected{" "}
        <PluralizeWithBoldCount count={packageCount} singular="package" />. This
        will:
      </span>
      <ul
        className={classNames({
          "u-no-margin--bottom": noUpgradePackageCount > 0,
        })}
      >
        {securityUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            <PluralizeWithBoldCount
              count={securityUpgradePackageCount}
              singular="security upgrade"
            />
          </li>
        )}
        {regularUpgradePackageCount > 0 && (
          <li>
            <span>apply </span>
            <PluralizeWithBoldCount
              count={regularUpgradePackageCount}
              singular="regular upgrade"
            />
          </li>
        )}
      </ul>
      {noUpgradePackageCount > 0 && (
        <p>
          <span>No upgrades needed for </span>
          <PluralizeWithBoldCount
            count={noUpgradePackageCount}
            singular="package"
          />
          .
        </p>
      )}
    </div>
  );
};

export default PackagesUpgradeInfo;
