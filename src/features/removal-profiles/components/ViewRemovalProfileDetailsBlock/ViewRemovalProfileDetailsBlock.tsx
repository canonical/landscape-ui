import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { RemovalProfile } from "../../types";

interface ViewRemovalProfileDetailsBlockProps {
  readonly profile: RemovalProfile;
}

const ViewRemovalProfileDetailsBlock: FC<
  ViewRemovalProfileDetailsBlockProps
> = ({ profile }) => {
  return (
    <InfoGrid.Item
      label="Removal Timeframe"
      value={`${profile.days_without_exchange} days`}
    />
  );
};

export default ViewRemovalProfileDetailsBlock;
