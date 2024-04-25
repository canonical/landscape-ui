import { Tabs } from "@canonical/react-components";
import { FC, Suspense, lazy, useState } from "react";
import { TAB_LINKS } from "./constants";
import classes from "./AccountSettingsTabs.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import { Credential, UserDetails } from "@/types/UserDetails";

const GeneralSettings = lazy(() => import("../general"));
const ApiCredentials = lazy(() => import("../api-credentials"));
const Alerts = lazy(() => import("../alerts"));

interface AccountSettingsTabsProps {
  user: UserDetails;
  credentials: Credential[];
}

const AccountSettingsTabs: FC<AccountSettingsTabsProps> = ({
  user,
  credentials,
}) => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState("tab-link-general");

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={TAB_LINKS.map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => {
            setCurrentTabLinkId(id);
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
          {"tab-link-general" === currentTabLinkId && (
            <GeneralSettings user={user} />
          )}
          {"tab-link-alerts" === currentTabLinkId && <Alerts />}
          {"tab-link-api" === currentTabLinkId && (
            <ApiCredentials user={user} credentials={credentials} />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default AccountSettingsTabs;
