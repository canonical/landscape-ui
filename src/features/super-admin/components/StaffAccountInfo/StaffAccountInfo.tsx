import Blocks from "@/components/layout/Blocks";
import HeaderActions from "@/components/layout/HeaderActions";
import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useSidePanel from "@/hooks/useSidePanel";
import date from "@/libs/date";
import type { FC } from "react";
import type { StaffAccount } from "../../types";
import { useEnterAccount } from "../../hooks";
import EditStaffAccountForm from "../EditStaffAccountForm";
import { formatSize } from "@/utils/size";

interface StaffAccountInfoProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountInfo: FC<StaffAccountInfoProps> = ({ staffAccount }) => {
  const { canManageAccounts } = useAuth();
  const { setSidePanelContent } = useSidePanel();
  const { enterAccount } = useEnterAccount();

  const openEditForm = () => {
    setSidePanelContent(
      `Edit ${staffAccount.company}`,
      <EditStaffAccountForm staffAccount={staffAccount} />,
    );
  };

  return (
    <>
      <HeaderActions
        title={
          <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
            {staffAccount.company}
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
            {
              icon: "switcher-environments",
              label: "Enter account",
              onClick: () => {
                enterAccount(staffAccount.account);
              },
            },
          ],
        }}
      />
      <Blocks>
        <Blocks.Item title="Status">
          <InfoGrid>
            <InfoGrid.Item
              label="Status"
              value={staffAccount.disabled ? "Disabled" : "Active"}
            />
            {staffAccount.disabled && (
              <InfoGrid.Item
                label="Disabled reason"
                value={staffAccount.disabled_reason}
              />
            )}
            <InfoGrid.Item label="Instances" value={staffAccount.computers} />
            <InfoGrid.Item
              label="Last login"
              value={
                staffAccount.last_login_time &&
                date(staffAccount.last_login_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              }
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Account details">
          <InfoGrid>
            <InfoGrid.Item label="Name" value={staffAccount.account} />
            <InfoGrid.Item label="Title" value={staffAccount.company} />
            <InfoGrid.Item label="Subdomain" value={staffAccount.subdomain} />
            <InfoGrid.Item
              label="Salesforce account key"
              value={staffAccount.salesforce_account_key}
            />
            <InfoGrid.Item
              label="Created"
              value={date(staffAccount.creation_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Limits">
          <InfoGrid>
            <InfoGrid.Item
              label="Administrator limit"
              value={staffAccount.max_people_count}
            />
            <InfoGrid.Item
              label="Attachment size limit"
              value={formatSize(staffAccount.max_attachment_size)}
            />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default StaffAccountInfo;
