import { FC, Suspense, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Tabs } from "@canonical/react-components";
import LoadingState from "../../../components/layout/LoadingState";
import PageHeader from "../../../components/layout/PageHeader";
import classes from "./UserPage.module.scss";
import useAuth from "../../../hooks/useAuth";
import AccountPage from "./AccountPage";

const tabLabels = [
  "Account",
  "Administrators",
  "Roles",
  "Access groups",
  "Scripts",
  "Graphs",
  "Profiles",
  "Alerts",
  "Searches",
  "Activities",
  "Licenses",
  "Events",
];

const getTabLabelId = (label: string) => {
  return `tab-link-${label.toLowerCase().replace(/\s+/g, "-")}`;
};

const UserPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { user } = useAuth();

  return (
    user && (
      <PageMain>
        <PageHeader title={tabLabels[currentTab]} />
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
              {0 === currentTab && <AccountPage />}
              {1 === currentTab && <p>Administrators</p>}
              {2 === currentTab && <p>Roles</p>}
              {3 === currentTab && <p>Access Groups</p>}
              {4 === currentTab && <p>Scripts</p>}
              {5 === currentTab && <p>Graphs</p>}
              {6 === currentTab && <p>Profiles</p>}
              {7 === currentTab && <p>Alerts</p>}
              {8 === currentTab && <p>Searches</p>}
              {9 === currentTab && <p>Activities</p>}
              {10 === currentTab && <p>Licenses</p>}
              {11 === currentTab && <p>Events</p>}
            </Suspense>
          </div>
        </PageContent>
      </PageMain>
    )
  );
};

export default UserPage;
