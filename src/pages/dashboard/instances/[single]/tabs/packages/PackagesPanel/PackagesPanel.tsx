import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  INSTALLED_PACKAGE_ACTIONS,
  PackageList,
  PackagesInstallButton,
  PackagesPanelHeader,
  type InstalledPackageAction,
  type InstancePackage,
  usePackages,
} from "@/features/packages";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { lazy } from "react";
import { useLocation, useParams } from "react-router";
import { getEmptyMessage } from "./helpers";
import { getSelectionLabel } from "@/utils/_helpers";

const PackageDetails = lazy(
  async () => import("@/features/packages/components/PackageDetails"),
);
const PackagesInstallForm = lazy(
  async () => import("@/features/packages/components/PackagesInstallForm"),
);
const InstalledPackagesActionForm = lazy(
  async () =>
    import("@/features/packages/components/InstalledPackagesActionForm"),
);

const ACTION_SEGMENTS: readonly InstalledPackageAction[] = [
  "upgrade",
  "remove",
  "hold",
  "unhold",
  "downgrade",
];

const isInstalledPackageAction = (
  segment: string | undefined,
): segment is InstalledPackageAction => {
  if (!segment) {
    return false;
  }

  return ACTION_SEGMENTS.includes(segment as InstalledPackageAction);
};

const getActionHeaderTarget = (
  name: string | undefined,
  selected: InstancePackage[],
) => {
  if (name) {
    return name;
  }

  return getSelectionLabel(selected, (pkg) => pkg.name, "selected packages");
};

interface PackagesPanelReadyProps {
  readonly isGettingPackages: boolean;
  readonly packages: InstancePackage[];
  readonly packagesCount: number;
  readonly selected: InstancePackage[];
  readonly setSelected: (items: InstancePackage[]) => void;
  readonly status: string | undefined;
  readonly search: string;
  readonly selectAll: boolean;
  readonly lastSidePathSegment: string | undefined;
  readonly name: string | undefined;
  readonly popSidePathUntilClear: () => void;
  readonly handleClearSelection: () => void;
}

const PackagesPanelReady: FC<PackagesPanelReadyProps> = ({
  isGettingPackages,
  packages,
  packagesCount,
  selected,
  setSelected,
  status,
  search,
  selectAll,
  lastSidePathSegment,
  name,
  popSidePathUntilClear,
  handleClearSelection,
}) => {
  const actionTargetPackages = name
    ? packages.filter((pkg) => pkg.name === name)
    : selected;

  const viewTarget = name
    ? packages.find((pkg) => pkg.name === name)
    : undefined;
  const currentAction = isInstalledPackageAction(lastSidePathSegment)
    ? lastSidePathSegment
    : undefined;
  const isActionSidePanelOpen =
    !!currentAction && actionTargetPackages.length > 0;
  const isSidePanelOpen =
    lastSidePathSegment === "install" ||
    (lastSidePathSegment === "view" && !!viewTarget) ||
    isActionSidePanelOpen;

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
            packages={packages}
            packagesLoading={isGettingPackages}
            selectedPackages={selected}
            onPackagesSelect={setSelected}
            emptyMsg={getEmptyMessage(status ?? "", search)}
            selectAll={selectAll}
          />
          <TablePagination
            handleClearSelection={handleClearSelection}
            totalItems={packagesCount}
            currentItemCount={packages.length}
          />
        </>
      )}

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={isSidePanelOpen}
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

        {isActionSidePanelOpen && currentAction && (
          <SidePanel.Suspense key="action">
            <SidePanel.Header>
              {INSTALLED_PACKAGE_ACTIONS[currentAction].label}{" "}
              {getActionHeaderTarget(name, selected)}
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

const PackagesPanel: FC = () => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const {
    status,
    search,
    currentPage,
    pageSize,
    lastSidePathSegment,
    name,
    popSidePathUntilClear,
  } = usePageParams();
  const { getInstancePackagesQuery } = usePackages();
  const { state } = useLocation() as {
    state: { selectAll?: boolean } | null;
  };

  useSetDynamicFilterValidation("sidePath", [
    "install",
    "view",
    "upgrade",
    "remove",
    "hold",
    "unhold",
    "downgrade",
  ]);

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

  if (!unfilteredPackagesResponse?.data.count) {
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

  if (!packagesResponse) {
    return <LoadingState />;
  }

  return (
    <PackagesPanelReady
      isGettingPackages={isGettingPackages}
      packages={packagesResponse.data.results}
      packagesCount={packagesResponse.data.count}
      selected={selected}
      setSelected={setSelected}
      status={status}
      search={search ?? ""}
      selectAll={Boolean(state?.selectAll)}
      lastSidePathSegment={lastSidePathSegment}
      name={name}
      popSidePathUntilClear={popSidePathUntilClear}
      handleClearSelection={handleClearSelection}
    />
  );
};

export default PackagesPanel;
