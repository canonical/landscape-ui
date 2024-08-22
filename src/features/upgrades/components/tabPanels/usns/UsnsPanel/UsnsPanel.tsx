import { FC, useEffect, useRef, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import useUsns from "@/hooks/useUsns";
import { UsnList } from "@/features/usns";
import { Instance } from "@/types/Instance";
import { Usn } from "@/types/Usn";

interface UsnsPanelProps {
  instances: Instance[];
}

const UsnsPanel: FC<UsnsPanelProps> = ({ instances }) => {
  const [offset, setOffset] = useState(0);
  const [usns, setUsns] = useState<Usn[]>([]);
  const [selectedUsns, setSelectedUsns] = useState<string[]>([]);

  const totalUsnCountRef = useRef(0);
  const offsetRef = useRef(-1);

  const { getUsnsQuery } = useUsns();

  const { data: getUsnsQueryResult, isLoading: getUsnsQueryLoading } =
    getUsnsQuery({
      computer_ids: instances.map(({ id }) => id),
      show_packages: false,
      limit: 5,
      offset,
    });

  useEffect(() => {
    if (!getUsnsQueryResult || offset === offsetRef.current) {
      return;
    }

    totalUsnCountRef.current = getUsnsQueryResult.data.count;
    offsetRef.current = offset;
    setUsns((prevState) => [...prevState, ...getUsnsQueryResult.data.results]);
    setSelectedUsns((prevState) => [
      ...prevState,
      ...getUsnsQueryResult.data.results.map(({ usn }) => usn),
    ]);
  }, [getUsnsQueryResult]);

  return getUsnsQueryLoading && !usns.length ? (
    <LoadingState />
  ) : (
    <UsnList
      tableType="expandable"
      onNextPageFetch={() => setOffset((prevState) => prevState + 5)}
      instances={instances}
      isUsnsLoading={getUsnsQueryLoading}
      onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
      selectedUsns={selectedUsns}
      totalUsnCount={totalUsnCountRef.current}
      usns={usns}
    />
  );
};

export default UsnsPanel;
