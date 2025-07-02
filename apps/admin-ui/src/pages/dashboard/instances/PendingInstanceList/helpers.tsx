import moment from "moment/moment";
import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { PendingInstance } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";

export const getCellProps = ({
  column: { id },
  row: { original },
}: Cell<PendingInstance>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (id === "title") {
    cellProps.role = "rowheader";
  } else if (id === "checkbox") {
    cellProps["aria-label"] = `Toggle ${original.title} instance`;
  } else if (id === "hostname") {
    cellProps["aria-label"] = "Hostname";
  } else if (id === "access_group") {
    cellProps["aria-label"] = "Access group";
  } else if (id === "client_tags") {
    cellProps["aria-label"] = "Tags";
  } else if (id === "creation_time") {
    cellProps["aria-label"] = "Creation time";
  }

  return cellProps;
};

export const getAccessGroup = (
  options: SelectOption[],
  accessGroup: string | null,
) => {
  if (!accessGroup) {
    return <NoData />;
  }

  return (
    options.find(({ value }) => value === accessGroup)?.label ?? accessGroup
  );
};

export const getCreationTime = (time: string) => {
  return moment(time)
    .utc()
    .calendar({
      sameElse: `${DISPLAY_DATE_TIME_FORMAT} [UTC]`,
      lastWeek: "[Last] dddd, HH:mm [UTC]",
      sameDay: "[Today], HH:mm [UTC]",
      lastDay: "[Yesterday], HH:mm [UTC]",
    });
};
