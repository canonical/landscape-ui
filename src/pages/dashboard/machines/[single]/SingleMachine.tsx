import { FC, lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useComputers from "../../../../hooks/useComputers";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button, Tabs } from "@canonical/react-components";
import useDebug from "../../../../hooks/useDebug";
import LoadingState from "../../../../components/layout/LoadingState";
import PageHeader from "../../../../components/layout/PageHeader";
import { Breadcrumb } from "../../../../types/Breadcrumb";
import classes from "./SingleMachine.module.scss";
import EmptyState from "../../../../components/layout/EmptyState";
import { ROOT_PATH } from "../../../../constants";

const InfoPanel = lazy(() => import("./tabs/info"));
const ProcessesPanel = lazy(() => import("./tabs/processes"));
const HardwarePanel = lazy(() => import("./tabs/hardware"));
const PackagesPanel = lazy(() => import("./tabs/packages"));
const ActivityPanel = lazy(() => import("./tabs/activities"));
const InstancesPanel = lazy(() => import("./tabs/instances"));

const tabLinks = [
  {
    label: "Info",
    id: "tab-link-info",
  },
  {
    label: "Instances",
    id: "tab-link-instances",
  },
  {
    label: "Activities",
    id: "tab-link-activities",
  },
  {
    label: "Security issues",
    id: "tab-link-security-issues",
  },
  {
    label: "Packages",
    id: "tab-link-packages",
  },
  {
    label: "Processes",
    id: "tab-link-processes",
  },
  {
    label: "Ubuntu Pro",
    id: "tab-link-ubuntu-pro",
  },
  {
    label: "Users",
    id: "tab-link-users",
  },
  {
    label: "Reports",
    id: "tab-link-reports",
  },
  {
    label: "Hardware",
    id: "tab-link-hardware",
  },
];

const SingleMachine: FC = () => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState("tab-link-info");

  const { hostname, childHostname } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const debug = useDebug();

  useEffect(() => {
    if (state?.tab) {
      setCurrentTabLinkId(`tab-link-${state.tab}`);
    } else {
      setCurrentTabLinkId(`tab-link-info`);
    }
  }, [state, childHostname]);

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, error: getComputersQueryError } =
    getComputersQuery({
      query: `hostname:${hostname}`,
      with_annotations: true,
    });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const machine = getComputersQueryResult?.data.results[0] ?? null;

  const getBreadcrumbs = (): Breadcrumb[] | undefined => {
    if (!childHostname) {
      return [
        { label: "Machines", path: "/machines" },
        { label: machine?.title ?? hostname ?? "", current: true },
      ];
    }

    return [
      { label: "Machines", path: "/machines" },
      {
        label: machine?.title ?? hostname ?? "",
        path: `/machines/${machine?.hostname ?? hostname}`,
      },
      {
        label:
          machine?.children.find(({ hostname }) => hostname === childHostname)
            ?.title ?? childHostname,
        current: true,
      },
    ];
  };

  return (
    <PageMain>
      <PageHeader
        title={machine?.title ?? childHostname ?? hostname ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs()}
      />
      <PageContent>
        {!machine && getComputersQueryResult && (
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
              links={tabLinks
                .filter(({ id }) =>
                  machine?.children.length > 0 && !childHostname
                    ? [
                        "tab-link-info",
                        "tab-link-instances",
                        "tab-link-activities",
                        "tab-link-hardware",
                      ].includes(id)
                    : id !== "tab-link-instances",
                )
                .map(({ label, id }) => ({
                  label,
                  id,
                  role: "tab",
                  active: id === currentTabLinkId,
                  onClick: () => setCurrentTabLinkId(id),
                }))}
            />
            <div
              tabIndex={0}
              role="tabpanel"
              aria-labelledby={currentTabLinkId}
              className={classes.tabPanel}
            >
              <Suspense fallback={<LoadingState />}>
                {"tab-link-info" === currentTabLinkId && (
                  <InfoPanel
                    machine={
                      machine.children.find(
                        ({ hostname }) => hostname === childHostname,
                      ) ?? machine
                    }
                  />
                )}
                {"tab-link-instances" === currentTabLinkId && (
                  <InstancesPanel />
                )}
                {"tab-link-activities" === currentTabLinkId && (
                  <ActivityPanel />
                )}
                {"tab-link-security-issues" === currentTabLinkId && (
                  <p>Security issues</p>
                )}
                {"tab-link-packages" === currentTabLinkId && (
                  <PackagesPanel tabState={state} />
                )}
                {"tab-link-processes" === currentTabLinkId && (
                  <ProcessesPanel />
                )}
                {"tab-link-ubuntu-pro" === currentTabLinkId && (
                  <p>Ubuntu Pro</p>
                )}
                {"tab-link-users" === currentTabLinkId && <p>Users</p>}
                {"tab-link-reports" === currentTabLinkId && <p>Reports</p>}
                {"tab-link-hardware" === currentTabLinkId && <HardwarePanel />}
              </Suspense>
            </div>
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SingleMachine;
