import { type FC } from "react";
import type { PackageAction, SelectedPackage } from "../../types";
import PackagesActionSummaryItem from "./components/PackagesActionSummaryItem";

interface PackagesActionSummaryProps {
  readonly action: PackageAction;
  readonly selectedPackages: SelectedPackage[];
  readonly instanceIds: number[];
}

const PackagesActionSummary: FC<PackagesActionSummaryProps> = ({
  action,
  selectedPackages,
  instanceIds,
}) => {
  return (
    <ul className="p-list u-no-margin--bottom">
      {selectedPackages.map((selectedPackage) => (
        <PackagesActionSummaryItem
          key={selectedPackage.id}
          action={action}
          instanceIds={instanceIds}
          selectedPackage={selectedPackage}
        />
      ))}
    </ul>
  );
};

export default PackagesActionSummary;
