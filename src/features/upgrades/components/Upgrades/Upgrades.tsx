import { SidePanelTableFilterChips, TableFilter } from "@/components/filter";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useFetch from "@/hooks/useFetch";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { SearchBox } from "@canonical/react-components";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { useState, type FC } from "react";
import type { PackageUpgrade } from "../../types/PackageUpgrade";
import UpgradesList from "../UpgradesList";
import classes from "./Upgrades.module.scss";
import {
  PRIORITY_OPTIONS,
  SEVERITY_OPTIONS,
  UPGRADE_TYPE_OPTIONS,
} from "./constants";

const Upgrades: FC = () => {
  const authFetch = useFetch();
  const { closeSidePanel } = useSidePanel();

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedPackages, setSelectedPackages] = useState<PackageUpgrade[]>(
    [],
  );

  const [upgradeType, setUpgradeType] = useState("all");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);

  const queryParams = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    priorities,
    severities,
    upgrade_type: upgradeType,
    search,
    query: "", // Placeholder for instance query
  };

  const {
    data: packagesResponse,
    isPending: isPendingPackages,
    error: packagesError,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<PackageUpgrade>>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages/upgrades", queryParams],
    queryFn: async () =>
      authFetch.get("packages/upgrades", {
        params: queryParams,
      }),
  });

  if (packagesError) {
    throw packagesError;
  }

  const clearSearch = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <>
      <div className={classes.header}>
        <SearchBox
          className={classNames("u-no-margin--bottom", classes.search)}
          externallyControlled
          value={inputValue}
          onChange={setInputValue}
          onClear={clearSearch}
          onSearch={setSearch}
          autoComplete="off"
        />
        <div className={classes.filters}>
          <TableFilter
            type="single"
            showSelectionOnToggleLabel
            label="Upgrade type"
            onItemSelect={setUpgradeType}
            options={UPGRADE_TYPE_OPTIONS}
            selectedItem={upgradeType}
            hasBadge={upgradeType !== "all"}
          />
          <TableFilter
            type="multiple"
            label="Priority"
            onItemsSelect={setPriorities}
            selectedItems={priorities}
            options={PRIORITY_OPTIONS}
            hasBadge={!!priorities.length}
          />
          <TableFilter
            type="multiple"
            label="Severity"
            onItemsSelect={setSeverities}
            selectedItems={severities}
            options={SEVERITY_OPTIONS}
            hasBadge={!!severities.length}
          />
        </div>
      </div>
      <SidePanelTableFilterChips
        filters={[
          {
            label: "Search",
            item: search,
            clear: clearSearch,
          },
          {
            label: "Upgrades",
            item: upgradeType === "security" ? "Security" : undefined,
            clear: () => {
              setUpgradeType("all");
            },
          },
          {
            label: "Priority",
            multiple: true,
            items: priorities.map((priority) => {
              return {
                label:
                  PRIORITY_OPTIONS.find((option) => option.value === priority)
                    ?.label || priority,
                value: priority,
              };
            }),
            clear: () => {
              setPriorities([]);
            },
            remove: (value: string) => {
              setPriorities((previousPriorities) =>
                previousPriorities.filter((priority) => priority !== value),
              );
            },
          },
          {
            label: "Severity",
            multiple: true,
            items: severities.map((severity) => {
              return {
                label:
                  SEVERITY_OPTIONS.find((option) => option.value === severity)
                    ?.label || severity,
                value: severity,
              };
            }),
            clear: () => {
              setSeverities([]);
            },
            remove: (value: string) => {
              setSeverities((previousSeverities) =>
                previousSeverities.filter((severity) => severity !== value),
              );
            },
          },
        ]}
      />
      {isPendingPackages ? (
        <LoadingState />
      ) : (
        <UpgradesList
          packages={packagesResponse.data.results}
          selectedPackages={selectedPackages}
          setSelectedPackages={setSelectedPackages}
        />
      )}
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={packagesResponse?.data.count}
        currentItemCount={packagesResponse?.data.results.length}
      />
      <SidePanelFormButtons
        onCancel={closeSidePanel}
        submitButtonText="Next"
        submitButtonDisabled={isPendingPackages || !selectedPackages.length}
      />
    </>
  );
};

export default Upgrades;
