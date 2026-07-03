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
import type { Package } from "../../../../types";
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

  const results = queryResult.data.pages.flatMap((page) => page.data.packages);

  if (results.length) {
    return (
      <>
        <ul
          className={classNames(
            "p-list u-no-margin p-autocomplete__suggestions",
          )}
        >
          {results.map((item: Package, index: number) => {
            const disabled = selectedPackages.some(({ id }) => item.id === id);

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
                key={`${item.name}-${item.version}`}
                {...props}
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
};

export default PackageDropdownSearchList;
