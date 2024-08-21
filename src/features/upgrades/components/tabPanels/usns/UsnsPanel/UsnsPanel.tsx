import { FC, useEffect, useRef, useState } from "react";
import { Instance } from "@/types/Instance";
import useUsns from "@/hooks/useUsns";
import LoadingState from "@/components/layout/LoadingState";
import { UsnList } from "@/features/usns";

interface UsnsPanelProps {
  instances: Instance[];
}

const UsnsPanel: FC<UsnsPanelProps> = ({ instances }) => {
  // const [offset, setOffset] = useState(5);
  const [selectedUsns, setSelectedUsns] = useState<string[]>([]);

  const notFirstLoad = useRef(false);

  useEffect(() => {
    console.log("notFirstLoad", notFirstLoad.current);
  }, [notFirstLoad.current]);

  useEffect(() => {
    console.log("selectedUsns", selectedUsns);
  }, [selectedUsns]);

  const { getUsnsInfiniteQuery } = useUsns();

  const {
    data: getUsnsInfiniteQueryResult,
    fetchNextPage,
    isLoading: getUsnsInfiniteQueryLoading,
    isFetchingNextPage,
    hasNextPage,
  } = getUsnsInfiniteQuery(
    {
      computer_ids: instances.map(({ id }) => id),
      show_packages: false,
      limit: 5,
    },
    {
      // enabled: instances.length > 0,
      // getNextPageParam: () => offset,
    },
  );

  // const queryClient = useQueryClient();

  useEffect(() => {
    // return () => {
    //   queryClient.setQueryData(["usnsInfinite"], {
    //     pages: getUsnsInfiniteQueryResult?.pages.slice(0, 1) ?? [],
    //     pageParams: getUsnsInfiniteQueryResult?.pageParams.slice(0, 1) ?? [],
    //   });
    // };
  }, []);

  useEffect(() => {
    console.log(
      "getUsnsInfiniteQueryResult?.pages",
      getUsnsInfiniteQueryResult?.pages,
    );
  }, [getUsnsInfiniteQueryResult]);

  useEffect(() => {
    console.log("hasNextPage", hasNextPage);
  }, [hasNextPage]);

  const usns =
    getUsnsInfiniteQueryResult?.pages.flatMap(({ data: { results } }) =>
      results.toReversed(),
    ) ?? [];

  const totalUsnCount = getUsnsInfiniteQueryResult?.pages[0].data.count ?? 0;

  useEffect(() => {
    if (!getUsnsInfiniteQueryResult) {
      return;
    }

    notFirstLoad.current
      ? setSelectedUsns((prevState) => [
          ...prevState,
          ...getUsnsInfiniteQueryResult.pages[
            getUsnsInfiniteQueryResult.pages.length - 1
          ].data.results.map(({ usn }) => usn),
        ])
      : setSelectedUsns(usns.map(({ usn }) => usn));

    notFirstLoad.current = true;
  }, [getUsnsInfiniteQueryResult]);

  return (
    <>
      {getUsnsInfiniteQueryLoading && <LoadingState />}
      {!getUsnsInfiniteQueryLoading && usns.length === 0 && null}
      {!getUsnsInfiniteQueryLoading && usns.length > 0 && (
        <UsnList
          tableType="expandable"
          onNextPageFetch={async () => {
            await fetchNextPage();
            // setOffset((prevState) => prevState + 5);
          }}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          instances={instances}
          isUsnsLoading={getUsnsInfiniteQueryLoading}
          onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
          selectedUsns={selectedUsns}
          totalUsnCount={totalUsnCount}
          usns={usns}
        />
      )}
    </>
  );
};

export default UsnsPanel;
