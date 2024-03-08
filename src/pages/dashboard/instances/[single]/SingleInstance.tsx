import { FC, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useInstances from "@/hooks/useInstances";
import PageMain from "@/components/layout/PageMain";
import PageContent from "@/components/layout/PageContent";
import { Button, Tabs } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import LoadingState from "@/components/layout/LoadingState";
import PageHeader from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/types/Breadcrumb";
import classes from "./SingleInstance.module.scss";
import EmptyState from "@/components/layout/EmptyState";
import { ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";

const InfoPanel = lazy(() => import("./tabs/info"));
const ProcessesPanel = lazy(() => import("./tabs/processes"));
const HardwarePanel = lazy(() => import("./tabs/hardware"));
const PackagesPanel = lazy(() => import("./tabs/packages"));
const ActivityPanel = lazy(() => import("./tabs/activities"));
const InstancesPanel = lazy(() => import("./tabs/instances"));
const UserPanel = lazy(() => import("./tabs/users"));

interface TabState {
  filter: string;
  selectAll: boolean;
}

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

const SingleInstance: FC = () => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState("tab-link-info");
  const [tabState, setTabState] = useState<TabState | null>(null);

  const { hostname, childHostname } = useParams();
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const debug = useDebug();

  const userAccountRef = useRef("");

  useEffect(() => {
    if (!user?.current_account) {
      return;
    }

    if (!userAccountRef.current) {
      userAccountRef.current = user.current_account;
    }

    if (userAccountRef.current === user.current_account) {
      return;
    }

    navigate(`${ROOT_PATH}instances`, { replace: true });
  }, [user?.current_account]);

  useEffect(() => {
    if (!state) {
      return;
    }

    const { tab, ...otherProps } = state;

    if (tab) {
      setCurrentTabLinkId(`tab-link-${tab}`);
    }

    setTabState(otherProps);
  }, [state]);

  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery({
      query: `hostname:${hostname}`,
      with_annotations: true,
    });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instance = getInstancesQueryResult?.data.results[0] ?? null;

  const getBreadcrumbs = (): Breadcrumb[] | undefined => {
    if (!childHostname) {
      return [
        { label: "Instances", path: `${ROOT_PATH}instances` },
        { label: instance?.title ?? hostname ?? "", current: true },
      ];
    }

    return [
      {
        label: "Instances",
        path: `${ROOT_PATH}instances`,
      },
      {
        label: instance?.title ?? hostname ?? "",
        path: `${ROOT_PATH}instances/${instance?.hostname ?? hostname}`,
      },
      {
        label:
          instance?.children.find(({ hostname }) => hostname === childHostname)
            ?.title ?? childHostname,
        current: true,
      },
    ];
  };

  return (
    <PageMain>
      <PageHeader
        title={instance?.title ?? childHostname ?? hostname ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs()}
      />
      <PageContent>
        {!instance && getInstancesQueryResult && (
          <EmptyState
            title="Instance not found"
            icon="connected"
            body={
              <>
                <p className="u-no-margin--bottom">
                  Seems like the instance <code>{hostname}</code> doesn&apos;t
                  exist
                </p>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="go-back-to-instances-page"
                onClick={() =>
                  navigate(`${ROOT_PATH}instances`, { replace: true })
                }
                type="button"
                aria-label="Go back"
              >
                Back to Instances page
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
        {instance && (
          <>
            <Tabs
              listClassName="u-no-margin--bottom"
              links={tabLinks
                .filter(({ id }) =>
                  instance.children.length > 0 && !childHostname
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
                  onClick: () => {
                    setCurrentTabLinkId(id);
                    setTabState(null);
                  },
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
                    instance={
                      instance.children.find(
                        ({ hostname }) => hostname === childHostname,
                      ) ?? instance
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
                  <PackagesPanel tabState={tabState} />
                )}
                {"tab-link-processes" === currentTabLinkId && (
                  <ProcessesPanel instanceId={instance.id} />
                )}
                {"tab-link-ubuntu-pro" === currentTabLinkId && (
                  <p>Ubuntu Pro</p>
                )}
                {"tab-link-users" === currentTabLinkId && (
                  <UserPanel instanceId={instance.id} />
                )}
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

export default SingleInstance;
