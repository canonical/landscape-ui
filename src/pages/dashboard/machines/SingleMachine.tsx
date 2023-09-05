import { FC, lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import useComputers from "../../../hooks/useComputers";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Tabs } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import LoadingState from "../../../components/layout/LoadingState";
import InfoPanel from "./InfoPanel";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import classes from "./SingleMachine.module.scss";

const ProcessesPanel = lazy(() => import("./ProcessesPanel"));
const HardwarePanel = lazy(() => import("./HardwarePanel"));

const tabLabels = [
  "Info",
  "Packages",
  "Activities",
  "Processes",
  "Ubuntu Pro",
  "Users",
  "Reports",
  "Hardware",
];

const getTabLabelId = (label: string) => {
  return `tab-link-${label.toLowerCase().replace(/\s+/g, "-")}`;
};

const SingleMachine: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { hostname } = useParams();

  const debug = useDebug();

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, error: getComputersQueryError } =
    getComputersQuery({
      query: `hostname:${hostname}`,
      with_annotations: true,
    });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const machine = getComputersQueryResult?.data[0] ?? null;

  return (
    machine && (
      <PageMain>
        <PageContent>
          <Breadcrumbs className={classes.breadcrumbs} />
          <Tabs
            listClassName="u-no-margin--bottom"
            links={tabLabels.map((label, index) => ({
              label,
              id: getTabLabelId(label),
              role: "tab",
              active: index === currentTab,
              onClick: () => setCurrentTab(index),
              "data-testid": getTabLabelId(label),
            }))}
          />
          <Suspense fallback={<LoadingState />}>
            <div
              tabIndex={0}
              role="tabpanel"
              aria-labelledby={getTabLabelId(tabLabels[currentTab])}
            >
              {0 === currentTab && <InfoPanel machine={machine} />}
              {1 === currentTab && <p>Packages</p>}
              {2 === currentTab && <p>Activities</p>}
              {3 === currentTab && <ProcessesPanel machineId={machine.id} />}
              {4 === currentTab && <p>Ubuntu Pro</p>}
              {5 === currentTab && <p>Users</p>}
              {6 === currentTab && <p>Reports</p>}
              {7 === currentTab && <HardwarePanel />}
            </div>
          </Suspense>
        </PageContent>
      </PageMain>
    )
  );
};

export default SingleMachine;
