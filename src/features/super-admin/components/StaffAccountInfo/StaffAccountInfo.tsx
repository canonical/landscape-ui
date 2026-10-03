import Blocks from "@/components/layout/Blocks";
import HeaderActions from "@/components/layout/HeaderActions";
import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import type { StaffAccount } from "../../types";

// A placeholder: entering an account lands with LNDENG-5100.
const ACTIONS: Action[] = [
  { icon: "switcher-environments", label: "Enter account", disabled: true },
];

interface StaffAccountInfoProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountInfo: FC<StaffAccountInfoProps> = ({ staffAccount }) => (
  <>
    <HeaderActions
      title={
        <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
          {staffAccount.company}
        </h2>
      }
      actions={{ nondestructive: ACTIONS }}
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
            label="Created"
            value={date(staffAccount.creation_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        </InfoGrid>
      </Blocks.Item>
    </Blocks>
  </>
);

export default StaffAccountInfo;
