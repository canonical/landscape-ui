import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  DETAILED_UPGRADES_VIEW_ENABLED,
  MANAGE_INSTANCES_DOCUMENTATION_URL,
  REPORT_VIEW_ENABLED,
  TSV_EXPORTS_ENABLED,
} from "@/constants";
import {
  getInstanceListParams,
  InstancesPageActions,
  useGetInstances,
} from "@/features/instances";
import { getExportTitle } from "@/features/exports";
import { setSelectedInstanceIds } from "@/features/instances";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { Icon, ICONS, Link } from "@canonical/react-components";
import {
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import InstancesContainer from "../InstancesContainer";
import classes from "./InstancesPage.module.scss";

const InstancesExportForm = lazy(
  async () => import("@/features/instances/components/InstancesExportForm"),
);

const ReportView = lazy(async () => {
  const module = await import("@/features/reports");
  return { default: module.ReportView };
});

const InstancesPage: FC = () => {
  const { currentAccount } = useAuthAccounts();

  useSetDynamicFilterValidation("sidePath", [
    ...(TSV_EXPORTS_ENABLED ? ["export"] : []),
    ...(REPORT_VIEW_ENABLED ? ["report"] : []),
  ]);
  const {
    currentPage,
    pageSize,
    wsl,
    sidePath,
    popSidePathUntilClear,
    ...filters
  } = usePageParams();
  const instanceListParams = useMemo(
    () => getInstanceListParams({ filters, wsl }),
    [filters, wsl],
  );

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    ...instanceListParams,
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedInstances([]);
    setIsAllSelected(false);
  }, []);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedInstances([]);
  }, []);

  useEffect(() => {
    if (!isAllSelected) {
      setSelectedInstanceIds(selectedInstances.map(({ id }) => id));
    }
  }, [selectedInstances, isAllSelected]);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        className={classes.instancesPageHeader}
        helperContent={
          <span className={classes.instancesPageHelperContent}>
            <span
              className="p-tooltip"
              onMouseEnter={() => {
                setIsAccountInfoOpen(true);
              }}
              onMouseLeave={(event) => {
                if (event.currentTarget.contains(document.activeElement)) {
                  return;
                }
                setIsAccountInfoOpen(false);
              }}
              onFocus={() => {
                setIsAccountInfoOpen(true);
              }}
              onBlur={(event) => {
                if (
                  event.relatedTarget instanceof Node &&
                  event.currentTarget.contains(event.relatedTarget)
                ) {
                  return;
                }
                setIsAccountInfoOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Escape") {
                  return;
                }
                setIsAccountInfoOpen(false);
              }}
            >
              <button
                type="button"
                className={classes.instancesPageAccountInfoButton}
                aria-label={`New instance registration information, documentation link available. Account name: ${currentAccount.name}`}
                aria-expanded={isAccountInfoOpen}
              >
                <Icon name={ICONS.information} aria-hidden />
              </button>
              {isAccountInfoOpen && (
                <span
                  className="p-tooltip__message"
                  style={{ display: "inline" }}
                >
                  <span>Account name: {currentAccount.name}</span>
                  <br />
                  <Link
                    className={classes.instancesPageDocumentationLink}
                    href={MANAGE_INSTANCES_DOCUMENTATION_URL}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    aria-label="Learn how to register new instances to your Landscape organization (opens a new tab to Landscape documentation)"
                  >
                    Learn how to register new instances to your Landscape
                    organization
                  </Link>
                </span>
              )}
            </span>
          </span>
        }
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            selectedInstances={selectedInstances}
            isAllSelected={isAllSelected}
            onRemoveSuccess={clearSelection}
          />,
        ]}
      />
      <PageContent hasTable>
        <InstancesContainer
          instanceCount={instancesCount}
          instances={instances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
          onChangeFilter={clearSelection}
          isGettingInstances={isGettingInstances}
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </PageContent>
      {TSV_EXPORTS_ENABLED && (
        <SidePanel
          isOpen={sidePath.join(",") === "export"}
          onClose={popSidePathUntilClear}
          size="medium"
        >
          {sidePath.join(",") === "export" && (
            <SidePanel.Suspense key="export">
              <SidePanel.Header>
                {getExportTitle({
                  isAllSelected,
                  selectedCount: selectedInstances.length,
                  totalCount: instancesCount,
                  selectionForms: ["instance"],
                })}
              </SidePanel.Header>
              <SidePanel.Content>
                <InstancesExportForm
                  exportParams={instanceListParams}
                  selectedInstanceIds={
                    isAllSelected
                      ? undefined
                      : selectedInstances.map(({ id }) => id)
                  }
                />
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}
        </SidePanel>
      )}
      {REPORT_VIEW_ENABLED && (
        <SidePanel
          isOpen={sidePath[0] === "report"}
          onClose={popSidePathUntilClear}
          size="medium"
        >
          {sidePath[0] === "report" && (
            <SidePanel.Suspense key="report">
              <ReportView
                selectedInstanceIds={
                  isAllSelected
                    ? undefined
                    : selectedInstances.map(({ id }) => id)
                }
                isAllSelected={isAllSelected}
                allSelectedQuery={
                  isAllSelected ? (instanceListParams.query ?? "") : undefined
                }
              />
            </SidePanel.Suspense>
          )}
        </SidePanel>
      )}
    </PageMain>
  );
};

export default InstancesPage;
