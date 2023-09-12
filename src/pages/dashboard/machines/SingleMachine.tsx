import { FC, lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import useComputers from "../../../hooks/useComputers";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Tabs } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import LoadingState from "../../../components/layout/LoadingState";
import InfoPanel from "./InfoPanel";
import PageHeader from "../../../components/layout/PageHeader";
import { Breadcrumb } from "../../../types/Breadcrumb";
import classes from "./SingleMachine.module.scss";

const ProcessesPanel = lazy(() => import("./ProcessesPanel"));
const HardwarePanel = lazy(() => import("./HardwarePanel"));

const tabLabels = [
  "Info",
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

  const breadcrumbs: Breadcrumb[] = [
    { label: "Machines", path: "/machines" },
    { label: machine?.title ?? "", current: true },
  ];

  return (
    machine && (
      <PageMain>
        <PageHeader title={machine.title} hideTitle breadcrumbs={breadcrumbs} />
        <PageContent>
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
          <div
            tabIndex={0}
            role="tabpanel"
            aria-labelledby={getTabLabelId(tabLabels[currentTab])}
            className={classes.tabPanel}
          >
            <Suspense fallback={<LoadingState />}>
              {0 === currentTab && <InfoPanel machine={machine} />}
              {1 === currentTab && <ProcessesPanel machineId={machine.id} />}
              {2 === currentTab && <p>Ubuntu Pro</p>}
              {3 === currentTab && <p>Users</p>}
              {4 === currentTab && <p>Reports</p>}
              {5 === currentTab && <HardwarePanel />}
            </Suspense>
          </div>
        </PageContent>
      </PageMain>
    )
  );
};

export default SingleMachine;
