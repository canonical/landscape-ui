import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import { hasSecurityUpgrades, hasUpgrades } from "@/features/instances";
import { usePackages } from "@/features/packages";
import { useUsns } from "@/features/usns";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Form, Tabs } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { Suspense, useState } from "react";
import UpgradeInfo from "../UpgradeInfo";
import { TAB_LINKS, TAB_PANELS, VALIDATION_SCHEMA } from "./constants";
import { getInitialValues, getTabLinks } from "./helpers";
import type { UpgradesFormProps } from "./types";

interface UpgradesProps {
  readonly selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  const [activeTabLinkId, setActiveTabLinkId] = useState(TAB_LINKS[0].id);

  const affectedInstances = selectedInstances.filter(({ alerts }) =>
    hasUpgrades(alerts),
  );

  const instancesWithUsn = affectedInstances.filter(({ alerts }) =>
    hasSecurityUpgrades(alerts),
  );

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { upgradeInstancesPackagesQuery } = usePackages();
  const { upgradeUsnsQuery } = useUsns();

  const { mutateAsync: upgradeInstancesPackages } =
    upgradeInstancesPackagesQuery;
  const { mutateAsync: upgradeUsns } = upgradeUsnsQuery;

  const handleSubmit = async (values: UpgradesFormProps) => {
    try {
      if (activeTabLinkId === "tab-link-usns") {
        await upgradeUsns({
          computers: instancesWithUsn.map(({ id }) => ({
            id,
            exclude_usns: values.excludedUsns,
          })),
        });
      } else {
        await upgradeInstancesPackages({
          computers: values.excludedPackages,
        });
      }

      closeSidePanel();

      notify.success({
        title: "You queued packages to be upgraded",
        message: `Packages on ${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")} will be upgraded and are queued in Activities`,
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

  return (
    <Form onSubmit={formik.handleSubmit}>
      <UpgradeInfo instances={selectedInstances} />

      <Tabs
        links={getTabLinks({
          activeTabLinkId,
          onTabLinkClick: (id) => {
            setActiveTabLinkId(id);
          },
          withUsnsTab: instancesWithUsn.length > 0,
        })}
      />

      <AppErrorBoundary>
        <div tabIndex={0} role="tabpanel" aria-labelledby={activeTabLinkId}>
          {activeTabLinkId === "tab-link-instances" && (
            <Suspense fallback={<LoadingState />}>
              <TAB_PANELS.instances
                excludedPackages={formik.values.excludedPackages}
                instances={affectedInstances}
                onExcludedPackagesChange={async (newExcludedPackages) =>
                  formik.setFieldValue("excludedPackages", newExcludedPackages)
                }
              />
            </Suspense>
          )}
          {activeTabLinkId === "tab-link-packages" && (
            <Suspense fallback={<LoadingState />}>
              <TAB_PANELS.packages
                excludedPackages={formik.values.excludedPackages}
                instances={affectedInstances}
                onExcludedPackagesChange={async (newExcludedPackages) =>
                  formik.setFieldValue("excludedPackages", newExcludedPackages)
                }
              />
            </Suspense>
          )}
          {activeTabLinkId === "tab-link-usns" && (
            <Suspense fallback={<LoadingState />}>
              <TAB_PANELS.usns
                excludedUsns={formik.values.excludedUsns}
                instances={instancesWithUsn}
                onExcludedUsnsChange={async (usns) =>
                  formik.setFieldValue("excludedUsns", usns)
                }
              />
            </Suspense>
          )}
        </div>
      </AppErrorBoundary>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Upgrade"
      />
    </Form>
  );
};

export default Upgrades;
