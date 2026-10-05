import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import usePageParams from "@/hooks/usePageParams";
import classes from "@/pages/dashboard/instances/[single]/SingleInstanceTabs/SingleInstanceTabs.module.scss";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import type { StaffAccount } from "../../types";
import StaffAccountAdministrators from "../StaffAccountAdministrators";
import StaffAccountFeatures from "../StaffAccountFeatures";
import StaffAccountInfo from "../StaffAccountInfo";
import StaffAccountLicenses from "../StaffAccountLicenses";
import { TABS } from "./constants";

interface StaffAccountTabsProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountTabs: FC<StaffAccountTabsProps> = ({ staffAccount }) => {
  const { tab, setPageParams } = usePageParams();

  const currentTab =
    TABS.find(({ id }) => id === `tab-link-${tab}`)?.id ?? TABS[0].id;

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={TABS.map((item) => ({
          ...item,
          active: item.id === currentTab,
          onClick: () => {
            setPageParams({ tab: item.id.replace("tab-link-", "") });
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTab}
        className={classes.tabPanel}
      >
        <AppErrorBoundary>
          {"tab-link-info" === currentTab && (
            <StaffAccountInfo staffAccount={staffAccount} />
          )}
          {"tab-link-administrators" === currentTab && (
            <StaffAccountAdministrators
              administrators={staffAccount.administrators}
            />
          )}
          {"tab-link-licenses" === currentTab && (
            <StaffAccountLicenses licenses={staffAccount.licenses} />
          )}
          {"tab-link-feature-flags" === currentTab && (
            <StaffAccountFeatures staffAccount={staffAccount} />
          )}
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default StaffAccountTabs;
