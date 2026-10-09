import BoldSubstring from "@/components/form/BoldSubstring";
import LoadingState from "@/components/layout/LoadingState";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import classNames from "classnames";
import type { ControllerStateAndHelpers } from "downshift";
import type { FC, UIEvent } from "react";
import classes from "./SnapBulkSearchList.module.scss";
import type { InstalledSnapWithCount } from "../../../../types";
import type { SearchSnapsResponse } from "../../../../api/useGetBulkInstalledSnaps";

const NEAR_BOTTOM_THRESHOLD = 20; // in pixels

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
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    queryResult;
  const handleScroll = (event: UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    const nearBottom =
      scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_THRESHOLD;
    const canFetchNextPage = hasNextPage && !isFetchingNextPage;

    if (nearBottom && canFetchNextPage) {
      fetchNextPage();
    }
  };

  const stylingClass = `p-card--highlighted ${classes.suggestionsContainer}`;

  if (isPending) {
    return (
      <div className={classNames(stylingClass, "u-align--center")}>
        <LoadingState inline />
      </div>
    );
  }

  const results = data.pages.flatMap((page) => page.data.results);
  const filteredResults = results.filter(
    (item) => !selectedSnaps.some(({ snap }) => item.snap.id === snap.id),
  );

  if (filteredResults.length) {
    return (
      <ul
        className={classNames(stylingClass, "p-list u-no-margin u-no-padding")}
        onScroll={handleScroll}
        {...downshiftOptions.getMenuProps()}
      >
        {filteredResults.map((item: InstalledSnapWithCount, index: number) => (
          <li
            className={classNames(classes.listItem, {
              [classes.highlighted]:
                downshiftOptions.highlightedIndex === index,
            })}
            key={item.snap.id}
            {...downshiftOptions.getItemProps({ item, index })}
          >
            <span className="u-truncate">
              <BoldSubstring text={item.snap.name} substring={search} />
            </span>
            <div className={classNames("u-text--muted", classes.publisher)}>
              {item.snap.publisher["display-name"] ??
                item.snap.publisher.username}
            </div>
          </li>
        ))}
        {isFetchingNextPage && (
          <li role="presentation">
            <LoadingState dense />
          </li>
        )}
      </ul>
    );
  }

  return <div className={stylingClass}>No snaps found.</div>;
};

export default SnapBulkSearchList;
