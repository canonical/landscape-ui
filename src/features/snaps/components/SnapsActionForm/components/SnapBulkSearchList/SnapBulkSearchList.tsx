import BoldSubstring from "@/components/form/BoldSubstring";
import LoadingState from "@/components/layout/LoadingState";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import classNames from "classnames";
import type { ControllerStateAndHelpers } from "downshift";
import type { FC } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import classes from "./SnapBulkSearchList.module.scss";
import TooltipCell from "@/components/layout/TooltipCell";
import type { InstalledSnapWithCount } from "../../../../types";
import type { SearchSnapsResponse } from "../../../../api/useGetBulkInstalledSnaps";

interface SnapBulkSearchListProps {
  readonly downshiftOptions: ControllerStateAndHelpers<InstalledSnapWithCount>;
  readonly queryResult: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<SearchSnapsResponse>>
  > & { isError: false };
  readonly search: string;
  readonly selectedSnaps: InstalledSnapWithCount[];
}

const SnapBulkSearchList: FC<SnapBulkSearchListProps> = ({
  downshiftOptions,
  queryResult,
  search,
  selectedSnaps,
}) => {
  const { ref: loadingRef } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting && !queryResult.isFetchingNextPage) {
        queryResult.fetchNextPage();
      }
    },
  });

  if (queryResult.isPending) {
    return <LoadingState />;
  }

  const results = queryResult.data.pages.flatMap((page) => page.data.results);
  const filteredResults = results.filter(
    (item) => !selectedSnaps.some(({ snap }) => item.snap.id === snap.id),
  );

  if (filteredResults.length) {
    return (
      <>
        <ul className="p-list u-no-margin p-autocomplete__suggestions">
          {filteredResults.map(
            (item: InstalledSnapWithCount, index: number) => (
              <li
                className={classNames("p-list__item", classes.listItem, {
                  [classes.highlighted]:
                    downshiftOptions.highlightedIndex === index,
                })}
                key={item.snap.name}
                {...downshiftOptions.getItemProps({ item, index })}
              >
                <div className="u-truncate">
                  <TooltipCell
                    message={`${item.snap.name} ${item.tracking_channel}`}
                  >
                    <BoldSubstring text={item.snap.name} substring={search} />
                  </TooltipCell>
                </div>
                <div className={classNames("u-text--muted", classes.publisher)}>
                  {item.snap.publisher["display-name"] ??
                    item.snap.publisher.username}
                </div>
              </li>
            ),
          )}
        </ul>
        {queryResult.hasNextPage && <LoadingState ref={loadingRef} dense />}
      </>
    );
  }

  return <div className={classes.empty}>No snaps found.</div>;
};

export default SnapBulkSearchList;
