import { FC, useEffect, useRef, useState } from "react";
import { Instance } from "@/types/Instance";
import useUsns from "@/hooks/useUsns";
import { UsnList } from "@/features/usns";
import { Usn } from "@/types/Usn";

interface UsnsPanelProps {
  instances: Instance[];
}

const UsnsPanel: FC<UsnsPanelProps> = ({ instances }) => {
  const [offset, setOffset] = useState(0);
  const [usns, setUsns] = useState<Usn[]>([]);
  const [selectedUsns, setSelectedUsns] = useState<string[]>([]);

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

    offsetRef.current = offset;
    setUsns((prevState) => [...prevState, ...getUsnsQueryResult.data.results]);
    setSelectedUsns((prevState) => [
      ...prevState,
      ...getUsnsQueryResult.data.results.map(({ usn }) => usn),
    ]);
  }, [getUsnsQueryResult]);

  return (
    <>
      <UsnList
        tableType="expandable"
        onNextPageFetch={() => setOffset((prevState) => prevState + 5)}
        instances={instances}
        isUsnsLoading={getUsnsQueryLoading}
        onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
        selectedUsns={selectedUsns}
        totalUsnCount={getUsnsQueryResult?.data.count ?? 0}
        usns={usns}
      />
    </>
  );
};

export default UsnsPanel;
