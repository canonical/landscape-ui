import { FC, lazy, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useComputers from "../../../hooks/useComputers";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Tabs, Button } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import LoadingState from "../../../components/layout/LoadingState";
import InfoPanel from "./InfoPanel";
import PageHeader from "../../../components/layout/PageHeader";
import { Breadcrumb } from "../../../types/Breadcrumb";
import classes from "./SingleMachine.module.scss";
import EmptyState from "../../../components/layout/EmptyState";
import { ROOT_PATH } from "../../../constants";

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
  const navigate = useNavigate();

  const { hostname } = useParams();

  const debug = useDebug();

  const { getComputersQuery } = useComputers();

  const {
    data: getComputersQueryResult,
    error: getComputersQueryError,
    isSuccess,
  } = getComputersQuery({
    query: `hostname:${hostname}`,
    with_annotations: true,
  });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const machine = getComputersQueryResult?.data[0] ?? null;

  const breadcrumbs: Breadcrumb[] = [
    { label: "Machines", path: "/machines" },
    { label: machine?.title ?? hostname ?? "", current: true },
  ];

  return (
    <PageMain>
      <PageHeader
        title={machine?.title ?? hostname ?? ""}
        hideTitle
        breadcrumbs={breadcrumbs}
      />
      <PageContent>
        {!machine && isSuccess && (
          <EmptyState
            title="Machine not found"
            icon="connected"
            body={
              <>
                <p className="u-no-margin--bottom">
                  Seems like the machine <code>{hostname}</code> doesn&apos;t
                  exist
                </p>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="go-back-to-machines-page"
                onClick={() =>
                  navigate(`${ROOT_PATH}machines`, { replace: true })
                }
                type="button"
                aria-label="Go back"
              >
                Back to Machines page
              </Button>,
              <Button
                key="go-back-to-home-page"
                onClick={() => navigate(`${ROOT_PATH}`, { replace: true })}
                type="button"
                aria-label="Go back"
              >
                Home page
              </Button>,
            ]}
          />
        )}
        {machine && (
          <>
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
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SingleMachine;
