import React from "react";
import {
  AccountDetail,
  Credential,
  GeneralInfoInterface,
} from "../../../types/UserDetails";
import { ColSize } from "@canonical/react-components";

export function getButtonTitle(credential?: Credential) {
  return credential?.secret_key || credential?.access_key
    ? "Regenerate API credentials"
    : "Generate API credentials";
}

export function getColumnSize(
  accountsLength: number,
  index: number,
  isLargerScreen: boolean,
): ColSize {
  if (accountsLength % 2 !== 0 && index === accountsLength - 1) {
    return 12;
  } else {
    return isLargerScreen ? 6 : 12;
  }
}

export function getGeneralInfoRows(generalInfo: GeneralInfoInterface) {
  return [
    { label: "Email", value: generalInfo.email },
    { label: "Timezone", value: generalInfo.timezone },
    { label: "Identity", value: <code>{generalInfo.identity}</code> },
  ];
}

export function getAccountRows(account: AccountDetail) {
  return [
    { label: "Name", value: account.name },
    { label: "Title", value: account.title },
    {
      label: "Access Key",
      value: <code>{account.credentials?.access_key ?? ""}</code>,
    },
    {
      label: "Secret Key",
      value: <code>{account.credentials?.secret_key ?? ""}</code>,
    },
    { label: "Roles", value: account.roles.join(", ") },
  ];
}

type RowData = {
  label: string;
  value: string | React.JSX.Element;
};

export function buildTableRows(rows: RowData[]) {
  return rows.map((item) => {
    return {
      columns: [
        {
          content: item.label,
          "aria-label": item.label,
          className: "u-no-margin--bottom",
        },
        {
          content: item.value,
          "aria-label": `${item.label} value`,
        },
      ],
    };
  });
}
