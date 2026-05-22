import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstancesPageActions, useGetInstances, useGetPendingInstances, getFeatures } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { getSelectionLabel, pluralize } from "@/utils/_helpers";
import { lazy, useCallback, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";
import { getQuery } from "./helpers";

const RunInstanceScriptForm = lazy(
  async () => import("@/features/scripts/components/RunInstanceScriptForm"),
);
const Upgrades = lazy(
  async () => import("@/features/upgrades/components/Upgrades"),
);
const ReportView = lazy(
  async () => import("@/pages/dashboard/instances/ReportView"),
);
const AccessGroupChange = lazy(
  async () => import("@/features/instances/components/AccessGroupChange")
);
const DistributionUpgrades = lazy(
  async () => import("@/features/instances/components/DistributionUpgrades"),
);
const TagsAddForm = lazy(
  async () => import("@/features/instances/components/TagsAddForm")
);
const AttachTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/AttachTokenForm"),
);
const ReplaceTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/ReplaceTokenForm"),
);
const PendingInstancesForm = lazy(
  async () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);
const ReportForm = lazy(
  async () => import("@/pages/dashboard/instances/ReportForm"),
);
const ManageSavedSearchesSidePanel = lazy(
  async () => import("@/features/saved-searches/components/ManageSavedSeachesSidePanel"),
);
const CreateSavedSearchForm = lazy(
  async () => import("@/features/saved-searches/components/CreateSavedSearchForm"),
);
const EditSavedSearchForm = lazy(
  async () => import("@/features/saved-searches/components/EditSavedSearchForm"),
);

const InstancesPage: FC = () => {
  const { currentPage, pageSize, wsl, lastSidePathSegment, popSidePathUntilClear, ...filters } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "run-script",
    "upgrades",
    "distribution-upgrades",
    "report-view",
    "access-group-change",
    "tags-assign",
    "attach-token",
    "replace-token",
    "review-pending-instances",
    "download-report",
    "manage-saved-searches",
    "create-saved-search",
    "edit-saved-search",
  ]);

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query: getQuery(filters),
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    wsl_children: wsl.includes("child"),
    wsl_parents: wsl.includes("parent"),
  });

  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);

  const { pendingInstances } = useGetPendingInstances(undefined, {
    enabled: lastSidePathSegment === "review-pending-instances",
  });

  const clearSelection = useCallback(() => {
    setSelectedInstances([]);
  }, []);

  const createInstanceCountString = (filteredInstances: Instance[]) => {
    return (
      <PluralizeWithBoldCount count={filteredInstances.length} singular="instance" />
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            selectedInstances={selectedInstances}
          />,
        ]}
      />
      <PageContent hasTable>
        <InstancesContainer
          instanceCount={instancesCount}
          instances={instances}
          isGettingInstances={isGettingInstances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
          onChangeFilter={clearSelection}
        />
      </PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "run-script" ||
          lastSidePathSegment === "upgrades" ||
          lastSidePathSegment === "distribution-upgrades" ||
          lastSidePathSegment === "report-view" ||
          lastSidePathSegment === "access-group-change" ||
          lastSidePathSegment === "tags-assign" ||
          lastSidePathSegment === "attach-token" ||
          lastSidePathSegment === "replace-token" ||
          lastSidePathSegment === "review-pending-instances" ||
          lastSidePathSegment === "download-report" ||
          lastSidePathSegment === "manage-saved-searches" ||
          lastSidePathSegment === "create-saved-search" ||
          lastSidePathSegment === "edit-saved-search"
        }
        size={
          lastSidePathSegment === "upgrades" ||
          lastSidePathSegment === "review-pending-instances"
            ? "large"
            : lastSidePathSegment === "distribution-upgrades" ||
              lastSidePathSegment === "report-view" ||
              lastSidePathSegment === "manage-saved-searches"
            ? "medium"
            : "small"
        }
      >
        {lastSidePathSegment === "run-script" && (
          <SidePanel.Suspense key="run-script">
            <SidePanel.Header>Run script</SidePanel.Header>
            <SidePanel.Content>
              {selectedInstances.some((instance) => !getFeatures(instance).scripts) ? (
                <div className="p-notification--caution">
                  <p>You selected {selectedInstances.length} instances. This script will:</p>
                  <ul>
                    <li>
                      run on{" "}
                      {createInstanceCountString(
                        selectedInstances.filter((instance) => getFeatures(instance).scripts)
                      )}
                    </li>
                    <li>
                      not run on{" "}
                      {createInstanceCountString(
                        selectedInstances.filter((instance) => !getFeatures(instance).scripts)
                      )}
                    </li>
                  </ul>
                </div>
              ) : null}
              <RunInstanceScriptForm
                query={selectedInstances.map(({ id }) => `id:${id}`).join(" OR ")}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "upgrades" && (
          <SidePanel.Suspense key="upgrades">
            <SidePanel.Header>Upgrades</SidePanel.Header>
            <SidePanel.Content>
              <Upgrades selectedInstances={selectedInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "distribution-upgrades" && (
          <SidePanel.Suspense key="distribution-upgrades">
            <SidePanel.Header>Upgrade distributions</SidePanel.Header>
            <SidePanel.Content>
              <DistributionUpgrades selectedInstances={selectedInstances.map(({ id }) => id)} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "report-view" && (
          <SidePanel.Suspense key="report-view">
            <SidePanel.Header>
              Report for {getSelectionLabel(selectedInstances, (instance) => instance.title, `instances`)}
            </SidePanel.Header>
            <SidePanel.Content>
              <ReportView instanceIds={selectedInstances.map(({ id }) => id)} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "access-group-change" && (
          <SidePanel.Suspense key="access-group-change">
            <SidePanel.Header>Assign access group</SidePanel.Header>
            <SidePanel.Content>
              <AccessGroupChange selected={selectedInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "tags-assign" && (
          <SidePanel.Suspense key="tags-assign">
            <SidePanel.Header>Assign tags</SidePanel.Header>
            <SidePanel.Content>
              <TagsAddForm selected={selectedInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "attach-token" && (
          <SidePanel.Suspense key="attach-token">
            <SidePanel.Header>
              Attach Ubuntu Pro token to {pluralize(selectedInstances.length, ["instance"], "exact")}
            </SidePanel.Header>
            <SidePanel.Content>
              <AttachTokenForm selectedInstances={selectedInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "replace-token" && (
          <SidePanel.Suspense key="replace-token">
            <SidePanel.Header>
              Replace Ubuntu Pro token for {pluralize(selectedInstances.length, ["instance"], "exact")}
            </SidePanel.Header>
            <SidePanel.Content>
              <ReplaceTokenForm selectedInstances={selectedInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "review-pending-instances" && (
          <SidePanel.Suspense key="review-pending-instances">
            <SidePanel.Header>Review Pending Instances</SidePanel.Header>
            <SidePanel.Content>
              <PendingInstancesForm instances={pendingInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "download-report" && (
          <SidePanel.Suspense key="download-report">
            <SidePanel.Header>Download report as CSV</SidePanel.Header>
            <SidePanel.Content>
              <ReportForm instanceIds={selectedInstances.map(({ id }) => id)} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "manage-saved-searches" && (
          <SidePanel.Suspense key="manage-saved-searches">
            <SidePanel.Header>Manage saved searches</SidePanel.Header>
            <SidePanel.Content>
              <ManageSavedSearchesSidePanel />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "create-saved-search" && (
          <SidePanel.Suspense key="create-saved-search">
            <SidePanel.Header>Add saved search</SidePanel.Header>
            <SidePanel.Content>
              <CreateSavedSearchForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit-saved-search" && (
          <SidePanel.Suspense key="edit-saved-search">
            <SidePanel.Header>Edit saved search</SidePanel.Header>
            <SidePanel.Content>
              <EditSavedSearchForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default InstancesPage;
