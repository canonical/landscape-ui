import BoldSubstring from "@/components/form/BoldSubstring";
import LoadingState from "@/components/layout/LoadingState";
import type { Package } from "@/features/packages";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import classNames from "classnames";
import type { ControllerStateAndHelpers } from "downshift";
import type { FC } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import classes from "./PackageDropdownSearchList.module.scss";

interface PackageDropdownSearchListProps {
  readonly downshiftOptions: ControllerStateAndHelpers<Package>;
  readonly exact: boolean;
  readonly hasOneInstance: boolean;
  readonly queryResult: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<ApiPaginatedResponse<Package>>>
  > & { isError: false };
  readonly search: string;
}

const PackageDropdownSearchList: FC<PackageDropdownSearchListProps> = ({
  downshiftOptions,
  exact,
  hasOneInstance,
  queryResult,
  search,
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

  const results = queryResult.data.pages.flatMap((page) => page.data.results);

  if (results.length) {
    return (
      <>
        <ul
          className={classNames(
            "p-list u-no-margin p-autocomplete__suggestions",
          )}
        >
          {results.map((item: Package, index: number) => (
            <li
              className={classNames("p-list__item", classes.pointer, {
                [classes.highlighted]:
                  downshiftOptions.highlightedIndex === index,
              })}
              key={item.name}
              {...downshiftOptions.getItemProps({
                item,
                index,
              })}
            >
              <div className="u-truncate" data-testid="dropdownElement">
                <BoldSubstring text={item.name} substring={search} />
              </div>
              {hasOneInstance && (
                <div>
                  <small className="u-text-muted">
                    {item.computers[0].available_version}
                  </small>
                </div>
              )}
            </li>
          ))}
        </ul>

        {queryResult.hasNextPage && <LoadingState ref={loadingStateRef} />}
      </>
    );
  }

  if (!exact) {
    return <div className={classes.empty}>No packages found</div>;
  }

  if (search) {
    return <div className={classes.empty}>Package not found</div>;
  }
};

export default PackageDropdownSearchList;
