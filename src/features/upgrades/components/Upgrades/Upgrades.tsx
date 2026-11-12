import type { AppTabItem } from "@/components/AppTabs";
import AppTabs, { useActiveTabId } from "@/components/AppTabs";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { hasSecurityUpgrades, hasUpgrades } from "@/features/instances";
import { usePackages } from "@/features/packages";
import { useUsns } from "@/features/usns";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import { useRef } from "react";
import UpgradeInfo from "../UpgradeInfo";
import { TAB_PANELS, VALIDATION_SCHEMA } from "./constants";
import {
  getExcludedPackagesWithNames,
  getInitialValues,
  getTabItems,
} from "./helpers";
import type { UpgradesFormProps, UpgradesTabId } from "./types";

interface UpgradesProps {
  readonly selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  // The packages tab lists upgrade candidates, whose ids the upgrade endpoint
  // ignores, so their names are kept to resolve installed ids on submit.
  const packageNamesByIdRef = useRef(new Map<number, string>());

  const affectedInstances = selectedInstances.filter(({ alerts }) =>
    hasUpgrades(alerts),
  );

  const instancesWithUsn = affectedInstances.filter(({ alerts }) =>
    hasSecurityUpgrades(alerts),
  );

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { isFeatureEnabled } = useAuth();

  const tabItems = getTabItems({
    withPackagesTab: isFeatureEnabled("package-search-rest-api"),
    withUsnsTab: instancesWithUsn.length > 0,
  });
  const activeTabId = useActiveTabId({ items: tabItems, slot: "panel" });
  const { upgradeInstancesPackagesQuery } = usePackages();
  const { upgradeUsnsQuery } = useUsns();

  const { mutateAsync: upgradeInstancesPackages } =
    upgradeInstancesPackagesQuery;
  const { mutateAsync: upgradeUsns } = upgradeUsnsQuery;

  const handleSubmit = async (values: UpgradesFormProps) => {
    try {
      if (activeTabId === "usns") {
        await upgradeUsns({
          computers: instancesWithUsn.map(({ id }) => ({
            id,
            exclude_usns: values.excludedUsns,
          })),
        });
      } else {
        await upgradeInstancesPackages({
          computers: getExcludedPackagesWithNames(
            values.excludedPackages,
            packageNamesByIdRef.current,
          ),
        });
      }

      closeSidePanel();

      notify.success({
        title: "You queued packages to be upgraded",
        message: `Packages on ${pluralize(selectedInstances.length, ["instance"], "exact")} will be upgraded and are queued in Activities`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(affectedInstances),
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const handleExcludedPackagesChange = async (
    newExcludedPackages: UpgradesFormProps["excludedPackages"],
  ) => formik.setFieldValue("excludedPackages", newExcludedPackages);

  const panels: Record<UpgradesTabId, ReactNode> = {
    instances: (
      <TAB_PANELS.instances
        excludedPackages={formik.values.excludedPackages}
        instances={affectedInstances}
        onExcludedPackagesChange={handleExcludedPackagesChange}
      />
    ),
    packages: (
      <TAB_PANELS.packages
        excludedPackages={formik.values.excludedPackages}
        instances={affectedInstances}
        onExcludedPackagesChange={handleExcludedPackagesChange}
        onPackagesLoad={(packages) => {
          for (const { id, name } of packages) {
            packageNamesByIdRef.current.set(id, name);
          }
        }}
      />
    ),
    usns: (
      <TAB_PANELS.usns
        excludedUsns={formik.values.excludedUsns}
        instances={instancesWithUsn}
        onExcludedUsnsChange={async (usns) =>
          formik.setFieldValue("excludedUsns", usns)
        }
      />
    ),
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <UpgradeInfo instances={selectedInstances} />

      <AppTabs
        aria-label="Upgrades"
        slot="panel"
        items={tabItems.map((item): AppTabItem<UpgradesTabId> => ({
          ...item,
          panel: panels[item.id],
        }))}
      />

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting}
        submitButtonText="Upgrade"
      />
    </Form>
  );
};

export default Upgrades;
