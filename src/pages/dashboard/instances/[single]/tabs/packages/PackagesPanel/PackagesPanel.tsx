import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { InstancePackage } from "@/features/packages";
import type { InstalledPackageAction } from "@/features/packages/types";
import {
  PackageList,
  PackagesInstallButton,
  PackagesPanelHeader,
  usePackages,
} from "@/features/packages";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { lazy } from "react";
import { useLocation, useParams } from "react-router";
import { getEmptyMessage } from "./helpers";
import { INSTALLED_PACKAGE_ACTIONS } from "@/features/packages/constants";
import { pluralizeArray } from "@/utils/_helpers";

const PackageDetails = lazy(async () => import("@/features/packages/components/PackageDetails"));
const PackagesInstallForm = lazy(async () => import("@/features/packages/components/PackagesInstallForm"));
const InstalledPackagesActionForm = lazy(async () => import("@/features/packages/components/InstalledPackagesActionForm"));

const PackagesPanel: FC = () => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { status, search, currentPage, pageSize, lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();
  const { getInstancePackagesQuery } = usePackages();
  const { state } = useLocation() as {
    state: { selectAll?: boolean } | null;
  };

  useSetDynamicFilterValidation("sidePath", ["install", "view", "upgrade", "remove", "hold", "unhold", "downgrade"]);

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    data: unfilteredPackagesResponse,
    isPending: isGettingUnfilteredPackages,
    error: unfilteredPackagesError,
  } = getInstancePackagesQuery({
    limit: 1,
    instance_id: instanceId,
    installed: true,
  });

  const {
    data: packagesResponse,
    isPending: isGettingPackages,
    error: packagesError,
  } = getInstancePackagesQuery({
    instance_id: instanceId,
    search: search,
    limit: pageSize,
    offset: currentPage * pageSize - pageSize,
    installed: !status || undefined,
    upgrade: status === "upgrade" || undefined,
    held: status === "held" || undefined,
    security: status === "security" || undefined,
  });

  const { selectedItems: selected, setSelectedItems: setSelected } =
    useSelection<InstancePackage>(
      packagesResponse?.data.results ?? [],
      isGettingPackages,
    );

  const handleClearSelection = (): void => {
    setSelected([]);
  };

  if (isGettingUnfilteredPackages) {
    return <LoadingState />;
  }

  if (unfilteredPackagesError) {
    throw unfilteredPackagesError;
  }

  if (!unfilteredPackagesResponse.data.count) {
    return (
      <EmptyState
        title="No packages have been found yet."
        cta={[<PackagesInstallButton key="install" appearance="positive" />]}
      />
    );
  }

  if (packagesError) {
    throw packagesError;
  }

  const actionTargetPackages = name 
    ? packagesResponse?.data.results.filter(p => p.name === name) ?? []
    : selected;

  const viewTarget = name ? packagesResponse?.data.results.find(p => p.name === name) : undefined;
  const isActionSegment = ["upgrade", "remove", "hold", "unhold", "downgrade"].includes(lastSidePathSegment ?? "");
  const currentAction = lastSidePathSegment as InstalledPackageAction;

  return (
    <>
      <PackagesPanelHeader
        selectedPackages={selected}
        handleClearSelection={handleClearSelection}
      />

      {isGettingPackages ? (
        <LoadingState />
      ) : (
        <>
          <PackageList
            packages={packagesResponse.data.results}
            packagesLoading={isGettingPackages}
            selectedPackages={selected}
            onPackagesSelect={(packageNames) => {
              setSelected(packageNames);
            }}
            emptyMsg={getEmptyMessage(status, search)}
            selectAll={!!state?.selectAll}
          />
          <TablePagination
            handleClearSelection={handleClearSelection}
            totalItems={packagesResponse.data.count}
            currentItemCount={packagesResponse.data.results.length}
          />
        </>
      )}

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "install" ||
          (lastSidePathSegment === "view" && !!viewTarget) ||
          (isActionSegment && actionTargetPackages.length > 0)
        }
        size="small"
      >
        {lastSidePathSegment === "install" && (
          <SidePanel.Suspense key="install">
            <SidePanel.Header>Install packages</SidePanel.Header>
            <SidePanel.Content>
              <PackagesInstallForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && viewTarget && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>Package details</SidePanel.Header>
            <SidePanel.Content>
              <PackageDetails singlePackage={viewTarget} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {isActionSegment && actionTargetPackages.length > 0 && (
          <SidePanel.Suspense key="action">
            <SidePanel.Header>
              {INSTALLED_PACKAGE_ACTIONS[currentAction].label}{" "}
              {name ? name : pluralizeArray(selected, (pkg) => pkg.name, "selected packages")}
            </SidePanel.Header>
            <SidePanel.Content>
              <InstalledPackagesActionForm
                action={currentAction}
                packages={actionTargetPackages}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default PackagesPanel;
