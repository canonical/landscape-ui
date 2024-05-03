import { FC, useEffect, useState } from "react";
import useDistributions from "@/hooks/useDistributions";
import LoadingState from "@/components/layout/LoadingState";
import DistributionCard from "@/pages/dashboard/repositories/mirrors/DistributionCard";
import DistributionsEmptyState from "@/pages/dashboard/repositories/mirrors/DistributionsEmptyState";
import { SyncPocketRef } from "@/pages/dashboard/repositories/mirrors/types";

interface DistributionContainerProps {
  onDistributionsLengthChange: (length: number) => void;
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
      refetchInterval: !syncPocketRefs.length ? undefined : 1000,
    },
  );

  const distributions = data?.data ?? [];

  useEffect(() => {
    onDistributionsLengthChange(distributions.length);
  }, [distributions.length]);

  useEffect(() => {
    if (!syncPocketRefs.length) {
      return;
    }

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

  const handleSyncPocketRefAdd = (ref: SyncPocketRef) => {
    setSyncPocketRefs((prevState) => [...prevState, ref]);
  };

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading && distributions.length === 0 && <DistributionsEmptyState />}
      {!isLoading &&
        distributions.length > 0 &&
        distributions.map((distribution) => (
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
