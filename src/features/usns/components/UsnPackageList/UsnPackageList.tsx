import type { FC } from "react";
import type { UsnPackage } from "@/types/Usn";
import UsnPackagesRemoveButton from "../UsnPackagesRemoveButton";
import UsnPackagesTable from "../UsnPackagesTable";

interface UsnPackageListProps {
  readonly instanceTitle: string;
  readonly limit: number;
  readonly onLimitChange: () => void;
  readonly showRemoveButton: boolean;
  readonly usn: string;
  readonly usnPackages: UsnPackage[];
}

const UsnPackageList: FC<UsnPackageListProps> = ({
  instanceTitle,
  limit,
  onLimitChange,
  showRemoveButton,
  usn,
  usnPackages,
}) => (
  <UsnPackagesTable
    additionalCta={
      showRemoveButton && (
        <UsnPackagesRemoveButton instanceTitle={instanceTitle} usn={usn} />
      )
    }
    limit={limit}
    onLimitChange={onLimitChange}
    usn={usn}
    usnPackages={usnPackages}
  />
);

export default UsnPackageList;
