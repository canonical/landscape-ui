import { FC, Suspense, lazy, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Tabs } from "@canonical/react-components";
import LoadingState from "../../../components/layout/LoadingState";
import PageHeader from "../../../components/layout/PageHeader";
import classes from "./AccountPage.module.scss";
import OverviewPage from "./overview";

const AccessGroupsPage = lazy(() => import("./access-group"));

const tabLabels = ["Account", "Access groups"];

const getTabLabelId = (label: string) => {
  return `tab-link-${label.toLowerCase().replace(/\s+/g, "-")}`;
};

const AccountPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <PageMain>
      <PageHeader title={"Account"} />
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
            {0 === currentTab && <OverviewPage />}
            {1 === currentTab && <AccessGroupsPage />}
          </Suspense>
        </div>
      </PageContent>
    </PageMain>
  );
};

export default AccountPage;
