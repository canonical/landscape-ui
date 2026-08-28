import { SidePanelTableFilterChips, TableFilter } from "@/components/filter";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import type { Instance } from "@/types/Instance";
import { getSelectionLabel } from "@/utils/_helpers";
import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import { useState, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import UpgradesList from "../UpgradesList";
import UpgradesSummary from "../UpgradesSummary";
import classes from "./Upgrades.module.scss";
import { UPGRADE_TYPE_OPTIONS } from "./constants";
import type { Package } from "@/features/packages";
import { FilterState, useSearchUpgrades } from "@/features/packages";

interface UpgradesProps {
  readonly selectedInstances: Instance[];
  readonly query?: string;
}

const Upgrades: FC<UpgradesProps> = ({ query, selectedInstances }) => {
  const { closeSidePanel, setSidePanelTitle, changeSidePanelSize } =
    useSidePanel();

  const [toggledUpgrades, setToggledUpgrades] = useState<Package[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [upgradeType, setUpgradeType] = useState("all");
  const [step, setStep] = useState<"list" | "summary">("list");

  const {
    value: isSelectAllUpgradesEnabled,
    setTrue: enableSelectAllUpgrades,
    setFalse: disableSelectAllUpgrades,
  } = useBoolean();

  const {
    data: upgradesResponse,
    isPending: isPendingUpgrades,
    error: upgradesError,
  } = useSearchUpgrades({
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    security: upgradeType === "security" ? FilterState.TRUE : undefined,
    text: search || undefined,
    computer_query: query ?? "",
  });

  if (upgradesError) {
    throw upgradesError;
  }

  const reset = () => {
    setToggledUpgrades([]);
    disableSelectAllUpgrades();
    setCurrentPage(DEFAULT_CURRENT_PAGE);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const clearSearch = () => {
    setInputValue("");
    handleSearch("");
  };

  const handleUpgradeTypeSelect = (value: string) => {
    setUpgradeType(value);
    reset();
  };

  switch (step) {
    case "list":
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
            <TableFilter
              type="single"
              showSelectionOnToggleLabel
              label="Upgrade type"
              onItemSelect={handleUpgradeTypeSelect}
              options={UPGRADE_TYPE_OPTIONS}
              selectedItem={upgradeType}
              hasBadge={upgradeType !== "all"}
            />
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
            ]}
          />
          {isPendingUpgrades ? (
            <LoadingState />
          ) : (
            <UpgradesList
              currentUpgrades={upgradesResponse.data.packages}
              toggledUpgrades={toggledUpgrades}
              setToggledUpgrades={setToggledUpgrades}
              upgradeCount={upgradesResponse.data.count}
              isSelectAllUpgradesEnabled={isSelectAllUpgradesEnabled}
              enableSelectAllUpgrades={enableSelectAllUpgrades}
              disableSelectAllUpgrades={disableSelectAllUpgrades}
              query={query}
            />
          )}
          <SidePanelTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            paginate={setCurrentPage}
            setPageSize={setPageSize}
            totalItems={upgradesResponse?.data.count}
            currentItemCount={upgradesResponse?.data.packages.length}
          />
          <SidePanelFormButtons
            onCancel={closeSidePanel}
            submitButtonText="Next"
            submitButtonDisabled={
              isPendingUpgrades ||
              !(isSelectAllUpgradesEnabled || toggledUpgrades.length)
            }
            onSubmit={() => {
              setStep("summary");
              setSidePanelTitle("Summary");
              changeSidePanelSize("medium");
            }}
          />
        </>
      );

    case "summary":
      return (
        <UpgradesSummary
          isSelectAllUpgradesEnabled={isSelectAllUpgradesEnabled}
          onBackButtonPress={() => {
            setStep("list");
            setSidePanelTitle(
              `Upgrade ${getSelectionLabel(selectedInstances, (toggledInstance) => toggledInstance.title, "instances")}`,
            );
            changeSidePanelSize("large");
          }}
          query={query}
          search={search}
          toggledUpgrades={toggledUpgrades}
          upgradeType={upgradeType}
        />
      );
  }
};

export default Upgrades;
