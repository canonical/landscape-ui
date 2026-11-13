import LoadingState from "@/components/layout/LoadingState";
import {
  BAND_CRITICALITY,
  BAND_LABEL,
  isHealthMeasurable,
} from "@/features/health";
import type { HealthBand } from "@/features/health";
import { getFeatures } from "@/features/instances";
import type { FeatureKey } from "@/types/FeatureKey";
import type { Instance } from "@/types/Instance";
import { Badge } from "@canonical/react-ds-global";

interface GetTabLabelProps {
  id: string;
  label: string;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
  healthScore: number | undefined;
  healthBand: HealthBand | undefined;
  healthLoading: boolean;
}

const getTabLabel = ({
  id,
  label,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
  healthScore,
  healthBand,
  healthLoading,
}: GetTabLabelProps) => {
  if (
    (id === "tab-link-packages" && packagesLoading) ||
    (id === "tab-link-security-issues" && usnLoading) ||
    (id === "tab-link-kernel" && kernelLoading) ||
    (id === "tab-link-health" && healthLoading)
  ) {
    return (
      <>
        <span>{label}</span>
        <LoadingState inline />
      </>
    );
  }

  if (id === "tab-link-packages" && packageCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={packageCount} />
      </>
    );
  }

  if (id === "tab-link-security-issues" && usnCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={usnCount} criticality="error" />
      </>
    );
  }

  if (id === "tab-link-kernel" && kernelCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={kernelCount} />
      </>
    );
  }

  if (
    id === "tab-link-health" &&
    healthBand !== undefined &&
    healthScore !== undefined
  ) {
    return (
      <>
        <span>{label}</span>
        <Badge
          value={healthScore}
          criticality={BAND_CRITICALITY[healthBand]}
          title={`Health score ${healthScore}, ${BAND_LABEL[healthBand]}`}
          aria-label={`Health score ${healthScore}, ${BAND_LABEL[healthBand]}`}
        />
      </>
    );
  }

  return label;
};

interface GetTabLinksProps {
  activeTabId: string;
  instance: Instance;
  isFeatureEnabled: (feature: FeatureKey) => boolean;
  onActiveTabChange: (tabId: string) => void;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
  healthScore: number | undefined;
  healthBand: HealthBand | undefined;
  healthLoading: boolean;
}

export const getTabLinks = ({
  activeTabId,
  instance,
  isFeatureEnabled,
  onActiveTabChange,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
  healthScore,
  healthBand,
  healthLoading,
}: GetTabLinksProps) => {
  const tabLinks: {
    label: string;
    id: string;
    included: boolean;
  }[] = [
    {
      label: "Info",
      id: "tab-link-info",
      included: true,
    },
    {
      label: "Health",
      id: "tab-link-health",
      // LA061: gated by the feature flag AND by whether the instance is
      // measurable. Non-Ubuntu instances (Windows hosts, "other Linux") and
      // anything without the Landscape client running have no signals to
      // score, so the tab would only show the score-100 placeholder — drop
      // it instead. Lives second so it's the natural follow-up after Info.
      included: isFeatureEnabled("health") && isHealthMeasurable(instance),
    },
    {
      label: "WSL",
      id: "tab-link-wsl",
      included:
        getFeatures(instance).wsl &&
        isFeatureEnabled("wsl-child-instance-profiles"),
    },
    {
      label: "Activities",
      id: "tab-link-activities",
      included: true,
    },
    {
      label: "Kernel",
      id: "tab-link-kernel",
      included: getFeatures(instance).packages,
    },
    {
      label: "Security issues",
      id: "tab-link-security-issues",
      included: getFeatures(instance).packages,
    },
    {
      label: "Packages",
      id: "tab-link-packages",
      included: getFeatures(instance).packages,
    },
    {
      label: "Snaps",
      id: "tab-link-snaps",
      included: getFeatures(instance).snaps,
    },
    {
      label: "Processes",
      id: "tab-link-processes",
      included: getFeatures(instance).processes,
    },
    {
      label: "Ubuntu Pro",
      id: "tab-link-ubuntu-pro",
      included: getFeatures(instance).pro,
    },
    {
      label: "Users",
      id: "tab-link-users",
      included: getFeatures(instance).users,
    },
    {
      label: "Hardware",
      id: "tab-link-hardware",
      included: getFeatures(instance).hardware,
    },
  ];

  return tabLinks
    .filter((link) => link.included)
    .map(({ label, id }) => ({
      label: getTabLabel({
        label,
        id,
        packageCount,
        packagesLoading,
        usnCount,
        usnLoading,
        kernelCount,
        kernelLoading,
        healthScore,
        healthBand,
        healthLoading,
      }),
      id,
      role: "tab",
      active: id === activeTabId,
      onClick: () => {
        onActiveTabChange(id);
      },
    }));
};
