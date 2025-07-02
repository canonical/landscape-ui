import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useDistributions } from "../../hooks";
import type { SyncPocketRef } from "../../types";
import DistributionCard from "../DistributionCard";
import DistributionsEmptyState from "../DistributionsEmptyState";
import { REFETCH_INTERVAL } from "./constants";

interface DistributionContainerProps {
  readonly onDistributionsLengthChange: (length: number) => void;
}

const DistributionContainer: FC<DistributionContainerProps> = ({
  onDistributionsLengthChange,
}) => {
  const [syncPocketRefs, setSyncPocketRefs] = useState<SyncPocketRef[]>([]);

  const { getDistributionsQuery } = useDistributions();

  const { data, isLoading } = getDistributionsQuery(
    {
      include_latest_sync: true,
    },
    {
      refetchInterval: !syncPocketRefs.length ? undefined : REFETCH_INTERVAL,
    },
  );

  const distributions = data?.data ?? [];

  useEffect(() => {
    onDistributionsLengthChange(distributions.length);
  }, [distributions.length]);

  useEffect(() => {
    for (const syncPocketRef of syncPocketRefs) {
      const pocket = distributions
        .find(({ name }) => name === syncPocketRef.distributionName)
        ?.series.find(({ name }) => name === syncPocketRef.seriesName)
        ?.pockets.find(({ name }) => name === syncPocketRef.pocketName);

      if (
        !pocket ||
        (pocket.mode !== "mirror" && pocket.mode !== "pull") ||
        pocket.last_sync_status === "in progress"
      ) {
        continue;
      }

      setSyncPocketRefs((prevState) =>
        prevState.filter(
          ({ distributionName }) =>
            distributionName !== syncPocketRef.distributionName,
        ),
      );
    }
  }, [distributions]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!distributions.length) {
    return <DistributionsEmptyState />;
  }

  const handleSyncPocketRefAdd = (ref: SyncPocketRef): void => {
    setSyncPocketRefs((prevState) => [...prevState, ref]);
  };

  return (
    <>
      {distributions.map((distribution) => (
        <DistributionCard
          key={distribution.name}
          distribution={distribution}
          syncPocketRefAdd={handleSyncPocketRefAdd}
          syncPocketRefs={syncPocketRefs}
        />
      ))}
    </>
  );
};

export default DistributionContainer;
