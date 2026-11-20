import AppTabs from "@/components/AppTabs";
import type { FC, ReactNode } from "react";
import type { StaffAccount } from "../../types";
import StaffAccountAdministrators from "../StaffAccountAdministrators";
import StaffAccountFeatures from "../StaffAccountFeatures";
import StaffAccountInfo from "../StaffAccountInfo";
import StaffAccountLicenses from "../StaffAccountLicenses";
import StaffAccountWslLimits from "../StaffAccountWslLimits";
import type { StaffAccountTabId } from "./constants";
import { TABS } from "./constants";

interface StaffAccountTabsProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountTabs: FC<StaffAccountTabsProps> = ({ staffAccount }) => {
  const panels: Record<StaffAccountTabId, ReactNode> = {
    info: <StaffAccountInfo staffAccount={staffAccount} />,
    administrators: (
      <StaffAccountAdministrators
        administrators={staffAccount.administrators}
      />
    ),
    licenses: <StaffAccountLicenses licenses={staffAccount.licenses} />,
    features: <StaffAccountFeatures staffAccount={staffAccount} />,
    wsl: <StaffAccountWslLimits staffAccount={staffAccount} />,
  };

  return (
    <AppTabs
      aria-label="Account details"
      items={TABS.map(({ id, label }) => ({ id, label, panel: panels[id] }))}
    />
  );
};

export default StaffAccountTabs;
