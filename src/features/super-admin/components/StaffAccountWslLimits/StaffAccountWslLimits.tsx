import Blocks from "@/components/layout/Blocks";
import HeaderActions from "@/components/layout/HeaderActions";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useAuth from "@/hooks/useAuth";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { useGetStaffAccountWslLimits } from "../../api";
import { WSL_LIMIT_FIELDS } from "../../constants";
import type { StaffAccount } from "../../types";
import EditStaffAccountWslLimitsForm from "../EditStaffAccountWslLimitsForm";

interface StaffAccountWslLimitsProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountWslLimits: FC<StaffAccountWslLimitsProps> = ({
  staffAccount,
}) => {
  const { canManageAccounts } = useAuth();
  const { setSidePanelContent } = useSidePanel();
  const { wslLimits, wslLimitsError, isGettingWslLimits } =
    useGetStaffAccountWslLimits(staffAccount.account);

  if (wslLimitsError) {
    throw wslLimitsError;
  }

  if (isGettingWslLimits || !wslLimits) {
    return <LoadingState />;
  }

  const openEditForm = () => {
    setSidePanelContent(
      `Edit the WSL limits of ${staffAccount.company}`,
      <EditStaffAccountWslLimitsForm
        staffAccount={staffAccount}
        wslLimits={wslLimits}
      />,
    );
  };

  return (
    <>
      <HeaderActions
        title={
          <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
            WSL limits
          </h2>
        }
        actions={{
          nondestructive: [
            {
              icon: "edit",
              label: "Edit",
              onClick: openEditForm,
              excluded: !canManageAccounts,
            },
          ],
        }}
      />
      <Blocks>
        <Blocks.Item description="The most Windows hosts, WSL instances per host and WSL instance profiles the account can have. An account without limits of its own has the defaults.">
          <InfoGrid>
            {WSL_LIMIT_FIELDS.map(({ name, label }) => (
              <InfoGrid.Item key={name} label={label} value={wslLimits[name]} />
            ))}
          </InfoGrid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default StaffAccountWslLimits;
