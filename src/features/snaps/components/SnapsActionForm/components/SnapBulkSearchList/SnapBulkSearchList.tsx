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
import classes from "./SnapDropdownSearchList.module.scss";
import { pluralize } from "@/utils/_helpers";
import TooltipCell from "@/components/layout/TooltipCell";
import type { SelectedSnaps } from "../../../../types";

interface SnapBulkSearchListProps {
  readonly downshiftOptions: ControllerStateAndHelpers<SelectedSnaps>;
  readonly exact: boolean;
  readonly queryResult: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<SearchSnapsResponse>>
  > & { isError: false };
  readonly search: string;
  readonly selectedSnaps: SelectedSnaps[];
}

const SnapBulkSearchList: FC<SnapBulkSearchListProps> = ({
  downshiftOptions,
  exact,
  queryResult,
  search,
  selectedSnaps,
}) => {
  const { ref: loadingStateRef } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting && !queryResult.isFetchingNextPage) {
        queryResult.fetchNextPage();
      }
    },
  });

  if (exact && !search) {
    return;
  }

  if (queryResult.isPending) {
    return <LoadingState />;
  }

  const results = queryResult.data.pages.flatMap((page) => page.data.snaps);

  if (results.length) {
    return (
      <>
        <ul
          className={classNames(
            "p-list u-no-margin p-autocomplete__suggestions",
          )}
        >
          {results.map((item: SelectedSnaps, index: number) => {
            const disabled = selectedSnaps.some(({ id }) => item.id === id);

            const props = disabled
              ? {}
              : downshiftOptions.getItemProps({ item, index });

            return (
              <li
                className={classNames("p-list__item", classes.listItem, {
                  [classes.highlighted]:
                    downshiftOptions.highlightedIndex === index,
                  [classes.disabled]: disabled,
                })}
                key={`${item.name}-${item.channel}`}
                {...props}
              >
                <div className="u-truncate font-monospace">
                  <TooltipCell
                    message={`${item.name} ${item.channel}`}
                    position="top-center"
                  >
                    <BoldSubstring text={item.name} substring={search} />{" "}
                    {item.channel}
                  </TooltipCell>
                </div>
                <div
                  className={classNames("u-text--muted", classes.computerCount)}
                >
                  {pluralize(item.computers.count, ["instance"], "exact")}
                </div>
              </li>
            );
          })}
        </ul>

        {queryResult.hasNextPage && <LoadingState ref={loadingStateRef} />}
      </>
    );
  }

  if (search) {
    return <div className={classes.empty}>No snaps found.</div>;
  }

  return;
};

export default SnapBulkSearchList;
