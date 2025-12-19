import type { FC } from "react";
import type { Package } from "../../types";
import { Button } from "@canonical/react-components";
import classes from "./PackagesUninstallSummary.module.scss";

interface PackagesUninstallSummaryProps {
  readonly selectedPackages: Package[];
  readonly instanceIds: number[];
}

const PackagesUninstallSummary: FC<PackagesUninstallSummaryProps> = ({
  selectedPackages,
  instanceIds,
}) => {
  const changingInstances = selectedPackages.flatMap((pkg) =>
    pkg.computers
      .filter((instance) => instance.status == "installed")
      .map((instance) => instance.id),
  );
  const unchangingInstances = instanceIds.filter(
    (id) => !changingInstances.includes(id),
  );

  return (
    <ul className="p-list u-no-margin--bottom">
      {selectedPackages.map((pkg) => (
        <li key={pkg.name} className={classes.package}>
          <strong className={classes.title}>{pkg.name}</strong>
          <div className={classes.row}>
            <Button
              type="button"
              appearance="link"
              className={classes.instances}
            >
              {changingInstances.length} instances
            </Button>
            <span>
              will uninstall <code>{pkg.name}</code>
            </span>
          </div>
          <div className={classes.row}>
            <Button
              type="button"
              appearance="link"
              className={classes.instances}
            >
              {unchangingInstances.length} instances
            </Button>
            <span>
              don&apos;t have <code>{pkg.name}</code> installed
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PackagesUninstallSummary;
