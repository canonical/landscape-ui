import { FC, useEffect, useRef, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useUsns, UsnList } from "@/features/usns";
import { Instance } from "@/types/Instance";
import { Usn } from "@/types/Usn";

interface UsnsPanelProps {
  excludedUsns: string[];
  instances: Instance[];
  onExcludedUsnsChange: (usns: string[]) => void;
}

const UsnsPanel: FC<UsnsPanelProps> = ({
  excludedUsns,
  instances,
  onExcludedUsnsChange,
}) => {
  const [offset, setOffset] = useState(0);
  const [usns, setUsns] = useState<Usn[]>([]);

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
  }, [getUsnsQueryResult]);

  const handleSelectedUsnsChange = (newUsns: string[]) => {
    onExcludedUsnsChange(
      usns.filter(({ usn }) => !newUsns.includes(usn)).map(({ usn }) => usn),
    );
  };

  const selectedUsns = usns
    .filter(({ usn }) => !excludedUsns.includes(usn))
    .map(({ usn }) => usn);

  return getUsnsQueryLoading && !usns.length ? (
    <LoadingState />
  ) : (
    <UsnList
      tableType="expandable"
      onNextPageFetch={() => setOffset((prevState) => prevState + 5)}
      instances={instances}
      isUsnsLoading={getUsnsQueryLoading}
      onSelectedUsnsChange={handleSelectedUsnsChange}
      selectedUsns={selectedUsns}
      totalUsnCount={totalUsnCountRef.current}
      usns={usns}
    />
  );
};

export default UsnsPanel;
