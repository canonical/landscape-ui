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
import { useBoolean } from "usehooks-ts";
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
  const [toggledUpgrades, setToggledUpgrades] = useState<PackageUpgrade[]>([]);

  const {
    value: isSelectAllUpgradesEnabled,
    setTrue: enableSelectAllUpgrades,
    setFalse: disableSelectAllUpgrades,
  } = useBoolean();

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
    data: upgradesResponse,
    isPending: isPendingUpgrades,
    error: upgradesError,
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

  if (upgradesError) {
    throw upgradesError;
  }

  const clearSelection = () => {
    setToggledUpgrades([]);
    disableSelectAllUpgrades();
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    clearSelection();
  };

  const clearSearch = () => {
    setInputValue("");
    handleSearch("");
  };

  const handleUpgradeTypeSelect = (value: string) => {
    setUpgradeType(value);
    clearSelection();
  };

  const handlePrioritiesSelect = (values: string[]) => {
    setPriorities(values);
    clearSelection();
  };

  const handleSeveritiesSelect = (values: string[]) => {
    setSeverities(values);
    clearSelection();
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
          onSearch={handleSearch}
          autoComplete="off"
        />
        <div className={classes.filters}>
          <TableFilter
            type="single"
            showSelectionOnToggleLabel
            label="Upgrade type"
            onItemSelect={handleUpgradeTypeSelect}
            options={UPGRADE_TYPE_OPTIONS}
            selectedItem={upgradeType}
            hasBadge={upgradeType !== "all"}
          />
          <TableFilter
            type="multiple"
            label="Priority"
            onItemsSelect={handlePrioritiesSelect}
            selectedItems={priorities}
            options={PRIORITY_OPTIONS}
            hasBadge={!!priorities.length}
          />
          <TableFilter
            type="multiple"
            label="Severity"
            onItemsSelect={handleSeveritiesSelect}
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
              handleUpgradeTypeSelect("all");
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
              handlePrioritiesSelect([]);
            },
            remove: (value: string) => {
              handlePrioritiesSelect(
                priorities.filter((priority) => priority !== value),
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
              handleSeveritiesSelect([]);
            },
            remove: (value: string) => {
              handleSeveritiesSelect(
                severities.filter((severity) => severity !== value),
              );
            },
          },
        ]}
      />
      {isPendingUpgrades ? (
        <LoadingState />
      ) : (
        <UpgradesList
          currentUpgrades={upgradesResponse.data.results}
          toggledUpgrades={toggledUpgrades}
          setToggledUpgrades={setToggledUpgrades}
          upgradeCount={upgradesResponse.data.count}
          isSelectAllUpgradesEnabled={isSelectAllUpgradesEnabled}
          enableSelectAllUpgrades={enableSelectAllUpgrades}
          disableSelectAllUpgrades={disableSelectAllUpgrades}
        />
      )}
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={upgradesResponse?.data.count}
        currentItemCount={upgradesResponse?.data.results.length}
      />
      <SidePanelFormButtons
        onCancel={closeSidePanel}
        submitButtonText="Next"
        submitButtonDisabled={
          isPendingUpgrades ||
          !(isSelectAllUpgradesEnabled || toggledUpgrades.length)
        }
      />
    </>
  );
};

export default Upgrades;
