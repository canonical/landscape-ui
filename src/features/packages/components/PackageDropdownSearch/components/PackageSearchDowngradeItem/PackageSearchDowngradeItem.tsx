import type { Package } from "@/features/packages";
import type { FC } from "react";

interface PackageSearchDowngradeItemProps {
  readonly selectedPackage: Package;
  readonly onDelete: () => void;
  readonly query: string;
}

const PackageSearchDowngradeItem: FC<PackageSearchDowngradeItemProps> = () => {
  return <li>PLACEHOLDER</li>;
};

export default PackageSearchDowngradeItem;
