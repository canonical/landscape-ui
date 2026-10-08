import { SidePanelTableFilterChips } from "@/components/filter";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import type { Instance } from "@/types/Instance";
import {
  getSelectionLabel,
  pluralize,
  toInstanceQuery,
} from "@/utils/_helpers";
import { Button, Modal, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import { useState, type FC } from "react";
import UpgradesList from "../PackagesUpgradeList";
import UpgradesSummary from "../PackagesUpgradeSummary";
import classes from "./PackagesUpgradeForm.module.scss";
import type { Package } from "@/features/packages";
import {
  DEB_MANAGEMENT_PACKAGE_LIMIT,
  useCreatePackageChangePlan,
  useDeletePackageChangePlan,
  useSearchUpgrades,
} from "@/features/packages";
import useDebug from "@/hooks/useDebug";
import { useBoolean } from "usehooks-ts";

interface UpgradesProps {
  readonly selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  const debug = useDebug();

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

  const {
    value: limitModalOpen,
    setTrue: openLimitModal,
    setFalse: closeLimitModal,
  } = useBoolean();

  const computerQuery = toInstanceQuery(
    selectedInstances.map((instance) => instance.id),
  );

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
              if (selectedUpgrades.length > DEB_MANAGEMENT_PACKAGE_LIMIT) {
                openLimitModal();
                return;
              }

              try {
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
              } catch (error) {
                debug(error);
              }
            }}
          />
          {limitModalOpen && (
            <Modal
              close={closeLimitModal}
              title="Upgrade limit exceeded"
              buttonRow={
                <Button appearance="positive" onClick={closeLimitModal}>
                  OK
                </Button>
              }
            >
              <p className="u-margin--bottom">
                Upgrades are only available for a selection of{" "}
                {pluralize(DEB_MANAGEMENT_PACKAGE_LIMIT, ["package"], "exact")}{" "}
                or fewer. Please select fewer packages, then try again.
              </p>
            </Modal>
          )}
        </>
      );

    default:
      return (
        <UpgradesSummary
          onBackButtonPress={() => {
            setSidePanelTitle(
              `Apply upgrades to ${getSelectionLabel(selectedInstances, (toggledInstance) => toggledInstance.title, "instances")}`,
            );
            changeSidePanelSize("large");
            setPackageChangePlanId(null);
            setOnCloseOverride(undefined);
          }}
          packageChangePlanId={packageChangePlanId}
        />
      );
  }
};

export default Upgrades;
