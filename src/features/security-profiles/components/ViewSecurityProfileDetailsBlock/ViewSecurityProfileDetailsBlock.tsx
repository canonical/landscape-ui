import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { SecurityProfile } from "../../types";
import {
  SECURITY_PROFILE_BENCHMARK_LABELS,
  SECURITY_PROFILE_MODE_LABELS,
} from "../../constants";
import { getTailoringFile } from "../../helpers";

interface ViewSecurityProfileDetailsBlockProps {
  readonly profile: SecurityProfile;
}

const ViewSecurityProfileDetailsBlock: FC<
  ViewSecurityProfileDetailsBlockProps
> = ({ profile }) => {
  return (
    <>
      <InfoGrid.Item
        label="Benchmark"
        value={SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
      />

      <InfoGrid.Item label="Tailoring file" value={getTailoringFile(profile)} />

      <InfoGrid.Item
        label="Mode"
        large
        value={SECURITY_PROFILE_MODE_LABELS[profile.mode]}
      />
    </>
  );
};

export default ViewSecurityProfileDetailsBlock;
