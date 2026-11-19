import InfoGrid from "@/components/layout/InfoGrid";
import type { InstancePackage } from "@/features/packages";
import { highlightVersionsDifference } from "@/features/packages";
import type { FC } from "react";

interface SupportInstancePackageDetailsProps {
  readonly singlePackage: InstancePackage;
}

const SupportInstancePackageDetails: FC<SupportInstancePackageDetailsProps> = ({
  singlePackage,
}) => (
  <InfoGrid spaced>
    <InfoGrid.Item label="Name" large value={singlePackage.name} />

    <InfoGrid.Item label="Summary" large value={singlePackage.summary} />

    <InfoGrid.Item
      label="Current version"
      value={singlePackage.current_version}
    />

    {singlePackage.available_version !== null &&
      singlePackage.available_version !== singlePackage.current_version && (
        <InfoGrid.Item
          label="Upgradable to"
          value={highlightVersionsDifference(singlePackage)}
        />
      )}
  </InfoGrid>
);

export default SupportInstancePackageDetails;
