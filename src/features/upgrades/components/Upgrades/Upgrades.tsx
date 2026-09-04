import { SidePanelTableFilterChips } from "@/components/filter";
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
import UpgradesList from "../UpgradesList";
import UpgradesSummary from "../UpgradesSummary";
import classes from "./Upgrades.module.scss";
import type { Package } from "@/features/packages";
import {
  useCreatePackageChangePlan,
  useDeletePackageChangePlan,
  useSearchUpgrades,
} from "@/features/packages";

interface UpgradesProps {
  readonly selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  const {
    closeSidePanel,
    setSidePanelTitle,
    changeSidePanelSize,
    setOnCloseOverride,
  } = useSidePanel();

  const [selectedUpgrades, setSelectedUpgrades] = useState<Package[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [packageChangePlanId, setPackageChangePlanId] = useState<number | null>(
    null,
  );

  const computerQuery = selectedInstances
    .map((instance) => `id:${instance.id}`)
    .join(" OR ");

  const {
    data: upgradesResponse,
    isPending: isPendingUpgrades,
    error: upgradesError,
  } = useSearchUpgrades({
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    text: search.trim() || undefined,
    computer_query: computerQuery,
  });

  const {
    mutateAsync: createPackageChangePlan,
    isPending: isCreatingPackageChangePlan,
  } = useCreatePackageChangePlan();

  const { mutateAsync: deletePackageChangePlan } = useDeletePackageChangePlan();

  if (upgradesError) {
    throw upgradesError;
  }

  const reset = () => {
    setSelectedUpgrades([]);
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

  switch (packageChangePlanId) {
    case null:
      return (
        <>
          <SearchBox
            className={classNames(classes.search)}
            externallyControlled
            value={inputValue}
            onChange={setInputValue}
            onClear={clearSearch}
            onSearch={handleSearch}
            autoComplete="off"
          />
          <SidePanelTableFilterChips
            filters={[
              {
                label: "Search",
                item: search,
                clear: clearSearch,
              },
            ]}
          />
          {isPendingUpgrades ? (
            <LoadingState />
          ) : (
            <UpgradesList
              currentUpgrades={upgradesResponse.data.packages}
              selectedUpgrades={selectedUpgrades}
              setSelectedUpgrades={setSelectedUpgrades}
              upgradeCount={upgradesResponse.data.count}
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
            submitButtonDisabled={isPendingUpgrades || !selectedUpgrades.length}
            submitButtonLoading={isCreatingPackageChangePlan}
            onSubmit={async () => {
              const config = {
                upgrade_config: {
                  select_by_ids: {
                    package_ids: selectedUpgrades.map(({ id }) => id),
                  },
                },
              };

              const { data } = await createPackageChangePlan({
                computer_query: computerQuery,
                ...config,
              });

              setSidePanelTitle("Summary");
              changeSidePanelSize("medium");
              setPackageChangePlanId(data.id);
              setOnCloseOverride(() => {
                deletePackageChangePlan(data.id);
                closeSidePanel();
              });
            }}
          />
        </>
      );

    default:
      return (
        <UpgradesSummary
          onBackButtonPress={() => {
            setSidePanelTitle(
              `Upgrade ${getSelectionLabel(selectedInstances, (toggledInstance) => toggledInstance.title, "instances")}`,
            );
            changeSidePanelSize("large");
            setPackageChangePlanId(null);
          }}
          packageChangePlanId={packageChangePlanId}
        />
      );
  }
};

export default Upgrades;
