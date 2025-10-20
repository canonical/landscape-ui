import type { PageParams } from "@/libs/pageParamsManager";
import type { AlertSummary } from "../../types";
import { ALERT_STATUSES, STATUS_FILTERS } from "@/features/instances";

export const getRouteParams = (alert: AlertSummary): Partial<PageParams> => {
  const alertStatus =
    ALERT_STATUSES[alert.alert_type] || ALERT_STATUSES.Unknown;

  const isStatusFilter = alert.alert_type in STATUS_FILTERS;
  const isContractExpiryFilter =
    alert.alert_type === "UbuntuProContractExpirationAlert";

  if (isContractExpiryFilter) {
    return { contractExpiryDays: alertStatus.filterValue };
  } else if (isStatusFilter) {
    return { status: alertStatus.filterValue };
  } else {
    return { query: alertStatus.query };
  }
};
