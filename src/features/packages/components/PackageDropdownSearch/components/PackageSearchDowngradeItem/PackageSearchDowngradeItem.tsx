import type { PackageWithVersions } from "@/features/packages";
import {
  mapActionTypeToQueryParams,
  useSearchPackages,
} from "@/features/packages";
import type { FC } from "react";
import classes from "./PackageSearchDowngradeItem.module.scss";
import type { MultiSelectItem } from "@canonical/react-components";
import {
  Button,
  Icon,
  ICONS,
  Notification,
  Tooltip,
} from "@canonical/react-components";
import { pluralize, toInstanceQuery } from "@/utils/_helpers";
import MultiSelectField from "@/components/form/MultiSelectField";
import LoadingState from "@/components/layout/LoadingState";
import { useTheme } from "@/context/theme";
import classNames from "classnames";
import { useIntersectionObserver } from "usehooks-ts";
import { QUERY_LIMIT } from "../../constants";

interface PackageSearchDowngradeItemProps {
  readonly instanceIds: number[];
  readonly selectedPackage: PackageWithVersions;
  readonly onDelete: () => void;
  readonly onItemsUpdate: (items: MultiSelectItem[]) => void;
}

const PackageSearchDowngradeItem: FC<PackageSearchDowngradeItemProps> = ({
  instanceIds,
  selectedPackage,
  onDelete,
  onItemsUpdate,
}) => {
  const { isDarkMode } = useTheme();

  const {
    data: packagesResponse,
    error: packagesError,
    isPending: isPendingPackages,
    isFetchingNextPage: isFetchingNextPackagesPage,
    fetchNextPage: fetchNextPackagesPage,
    hasNextPage: hasNextPackagesPage,
  } = useSearchPackages({
    computer_query: toInstanceQuery(instanceIds),
    names: selectedPackage[0].name,
    limit: QUERY_LIMIT,
    ...mapActionTypeToQueryParams("install"),
  });

  if (packagesError) {
    throw packagesError;
  }

  const { ref: loadingStateRef } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting && !isFetchingNextPackagesPage) {
        fetchNextPackagesPage();
      }
    },
  });

  const packages = isPendingPackages
    ? []
    : packagesResponse.pages.flatMap((page) => page.data.packages);

  const items = packages.map((pkg) => ({
    label: `${pkg.version} (${pluralize(pkg.computers.count, ["instance"], "exact")})`,
    value: pkg.id,
  }));

  const getDropdownHeader = () => {
    if (isPendingPackages) {
      return <LoadingState />;
    } else if (packages.length > 1) {
      return (
        <div className={classes.notification}>
          <Notification severity="caution" borderless className="u-no-margin">
            If you select multiple versions that apply to the same instance, the
            most recent version will be applied.
          </Notification>
        </div>
      );
    } else {
      return undefined;
    }
  };

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.topRow}>
        <div>
          <div className={classNames("font-monospace", classes.name)}>
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
        <Tooltip message="Remove" position="top-center">
          <Button
            type="button"
            appearance="base"
            className={classes.deleteButton}
            aria-label={`Delete ${selectedPackage[0].name}`}
            onClick={onDelete}
          >
            <Icon name={ICONS.delete} />
          </Button>
        </Tooltip>
      </div>
      <MultiSelectField
        className={classNames(classes.multiSelect, { "is-paper": !isDarkMode })}
        items={items}
        dropdownHeader={getDropdownHeader()}
        showDropdownFooter={hasNextPackagesPage}
        footerClassName={classes.footer}
        dropdownFooter={<LoadingState ref={loadingStateRef} />}
        variant="condensed"
        placeholder="Version"
        onItemsUpdate={onItemsUpdate}
        selectedItems={selectedPackage[1]
          .map((id) => items.find((item) => item.value === id))
          .filter((item) => item !== undefined)}
      />
    </li>
  );
};

export default PackageSearchDowngradeItem;
