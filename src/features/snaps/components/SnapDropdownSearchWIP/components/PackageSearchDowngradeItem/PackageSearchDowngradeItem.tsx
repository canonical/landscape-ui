import type {
  PackageWithVersions,
  SearchPackagesRequest,
  SearchPackagesResponse,
} from "@/features/packages";
import { mapActionToQueryParams } from "@/features/packages";
import type { FC } from "react";
import classes from "./PackageSearchDowngradeItem.module.scss";
import type { MultiSelectItem } from "@canonical/react-components";
import { Button, Icon, ICONS, Notification } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";
import MultiSelectField from "@/components/form/MultiSelectField";
import LoadingState from "@/components/layout/LoadingState";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";
import useFetch from "@/hooks/useFetch";
import { useTheme } from "@/context/theme";
import classNames from "classnames";

interface PackageSearchDowngradeItemProps {
  readonly instanceIds: number[];
  readonly selectedPackage: PackageWithVersions;
  readonly onDelete: () => void;
  readonly onItemsUpdate: (items: MultiSelectItem[]) => void;
}

const useMultiSelectPackages = (
  options: UseQueryOptions<
    AxiosResponse<SearchPackagesResponse>,
    AxiosError<ApiError>
  >,
) => {
  const {
    data: packagesResponse,
    isPending: isPendingPackages,
    error: packagesError,
  } = useQuery<AxiosResponse<SearchPackagesResponse>, AxiosError<ApiError>>(
    options,
  );

  if (packagesError) {
    throw packagesError;
  }

  if (isPendingPackages) {
    return {
      items: [],
      dropdownHeader: <LoadingState />,
    };
  }

  return {
    items: packagesResponse.data.packages.map((pkg) => ({
      label: `${pkg.version} (${pluralize(pkg.computers.count, ["instance"], "exact")})`,
      value: pkg.id,
    })),

    dropdownHeader:
      packagesResponse.data.packages.length > 1 ? (
        <div className={classes.notification}>
          <Notification severity="caution" borderless className="u-no-margin">
            If you select multiple versions that apply to the same instance, the
            most recent version will be applied.
          </Notification>
        </div>
      ) : undefined,
  };
};

const PackageSearchDowngradeItem: FC<PackageSearchDowngradeItemProps> = ({
  instanceIds,
  selectedPackage,
  onDelete,
  onItemsUpdate,
}) => {
  const authFetch = useFetch();
  const { isDarkMode } = useTheme();

  const queryParams: SearchPackagesRequest = {
    computer_query: instanceIds.map((id) => `id:${id}`).join(" OR "),
    names: [selectedPackage[0].name],
    ...mapActionToQueryParams("install"),
  };

  const { items, dropdownHeader } = useMultiSelectPackages({
    queryKey: ["packages", queryParams],
    queryFn: async () => {
      return authFetch.post("packages:search", queryParams);
    },
  });

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.topRow}>
        <div>
          <div className="font-monospace">
            {selectedPackage[0].name} {selectedPackage[0].version}
          </div>
          <div className="u-text--muted p-text--small u-no-margin">
            Installed on{" "}
            {pluralize(
              selectedPackage[0].computers.count,
              ["instance"],
              "exact",
            )}
          </div>
        </div>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
          aria-label={`Delete ${selectedPackage[0].name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <MultiSelectField
        className={classNames(classes.multiSelect, { "is-paper": !isDarkMode })}
        items={items}
        dropdownHeader={dropdownHeader}
        showDropdownFooter={false}
        variant="condensed"
        placeholder="Version"
        onItemsUpdate={onItemsUpdate}
        selectedItems={selectedPackage[1].map(
          (id) => items.find((item) => item.value === id) as MultiSelectItem,
        )}
      />
    </li>
  );
};

export default PackageSearchDowngradeItem;
