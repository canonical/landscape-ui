import type { FC } from "react";
import type { Instance } from "@/types/Instance";
import classNames from "classnames";

interface UpgradeInfoProps {
  readonly instances: Instance[];
}

const UpgradeInfo: FC<UpgradeInfoProps> = ({ instances }) => {
  const instancesWithSecurityUpgradeCount = instances.filter(
    ({ upgrades }) => upgrades?.security,
  ).length;
  const instancesWithRegularUpgradeCount = instances.filter(
    ({ upgrades }) => upgrades?.regular,
  ).length;
  const notAffectedInstancesCount = instances.filter(
    ({ upgrades }) => !upgrades?.security && !upgrades?.regular,
  ).length;

  return (
    <div>
      <span>You selected </span>
      <span>
        <b>{instances.length}</b>
      </span>
      <span> instances:</span>
      <ul
        className={classNames({
          "u-no-margin--bottom": notAffectedInstancesCount > 0,
        })}
      >
        {instancesWithSecurityUpgradeCount > 0 && (
          <li>
            <span>Security upgrades are available for </span>
            <b>{instancesWithSecurityUpgradeCount}</b>
            <span>
              {instancesWithSecurityUpgradeCount !== 1
                ? " instances"
                : " instance"}
            </span>
          </li>
        )}
        {instancesWithRegularUpgradeCount > 0 && (
          <li>
            <span>Regular upgrades are available for </span>
            <b>{instancesWithRegularUpgradeCount}</b>
            <span>
              {instancesWithRegularUpgradeCount !== 1
                ? " instances"
                : " instance"}
            </span>
          </li>
        )}
      </ul>
      {notAffectedInstancesCount > 0 && (
        <p>
          <span>No upgrades for </span>
          <span>
            <b>{notAffectedInstancesCount}</b>
          </span>
          <span>
            {notAffectedInstancesCount !== 1
              ? " instances needed."
              : " instance needed."}
          </span>
        </p>
      )}
    </div>
  );
};

export default UpgradeInfo;
