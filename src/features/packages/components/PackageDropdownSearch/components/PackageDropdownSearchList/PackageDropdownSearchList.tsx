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
import type { Package } from "../../../../types";
import { useFetchNextPageOnIntersection } from "../../hooks";
import classes from "./PackageDropdownSearchList.module.scss";
import type { SearchPackagesResponse } from "../../../../api/useSearchPackages";
import { pluralize } from "@/utils/_helpers";
import TooltipCell from "@/components/layout/TooltipCell";

interface PackageDropdownSearchListProps {
  readonly downshiftOptions: ControllerStateAndHelpers<Package>;
  readonly exact: boolean;
  readonly queryResult: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<SearchPackagesResponse>>
  > & { isError: false };
  readonly search: string;
  readonly selectedPackages: Package[];
}

const PackageDropdownSearchList: FC<PackageDropdownSearchListProps> = ({
  downshiftOptions,
  exact,
  queryResult,
  search,
  selectedPackages,
}) => {
  const loadingStateRef = useFetchNextPageOnIntersection({
    fetchNextPage: queryResult.fetchNextPage,
    hasNextPage: queryResult.hasNextPage,
    isFetchingNextPage: queryResult.isFetchingNextPage,
  });

  if (exact && !search) {
    return;
  }

  if (queryResult.isPending) {
    return <LoadingState />;
  }

  const results: Package[] = queryResult.data.pages
    .flatMap((page) => page.data.packages)
    .filter((item) => !selectedPackages.some(({ id }) => item.id === id))
    .map((item) => ({ ...item }));

  if (results.length) {
    return (
      <>
        <ul
          className={classNames(
            "p-list u-no-margin p-autocomplete__suggestions",
          )}
          {...downshiftOptions.getMenuProps()}
        >
          {results.map((item, index) => {
            return (
              <li
                className={classNames("p-list__item", classes.listItem, {
                  [classes.highlighted]:
                    downshiftOptions.highlightedIndex === index,
                })}
                key={`${item.name}-${item.version}`}
                {...downshiftOptions.getItemProps({ item, index })}
              >
                <div className="u-truncate font-monospace">
                  <TooltipCell
                    message={`${item.name} ${item.version}`}
                    position="top-center"
                  >
                    <BoldSubstring text={item.name} substring={search} />{" "}
                    {item.version}
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

  if (!exact) {
    return <div className={classes.empty}>No packages found.</div>;
  }

  if (search) {
    return <div className={classes.empty}>Package not found.</div>;
  }

  return;
};

export default PackageDropdownSearchList;
