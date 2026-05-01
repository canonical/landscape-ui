import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { USGProfile } from "../../types";
import {
  USG_PROFILE_BENCHMARK_LABELS,
  USG_PROFILE_MODE_LABELS,
} from "../../constants";
import { getTailoringFile } from "../../helpers";

interface ViewUSGProfileDetailsBlockProps {
  readonly profile: USGProfile;
}

const ViewUSGProfileDetailsBlock: FC<ViewUSGProfileDetailsBlockProps> = ({
  profile,
}) => {
  return (
    <>
      <InfoGrid.Item
        label="Benchmark"
        value={USG_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
      />

      <InfoGrid.Item label="Tailoring file" value={getTailoringFile(profile)} />

      <InfoGrid.Item
        label="Mode"
        large
        value={USG_PROFILE_MODE_LABELS[profile.mode]}
      />
    </>
  );
};

export default ViewUSGProfileDetailsBlock;
