import { ALERT_STATUSES, STATUS_FILTERS } from "@/features/instances";
import type { PageParams } from "@/libs/pageParamsManager";
import { hasProperty } from "@/utils/_helpers";
import type { AlertSummary } from "../../types";

export const getAlertStatus = (type: string) => {
  if (hasProperty(ALERT_STATUSES, type)) {
    return ALERT_STATUSES[type];
  }

  return ALERT_STATUSES.Unknown;
};

export const getRouteParams = (alert: AlertSummary): Partial<PageParams> => {
  const alertStatus = getAlertStatus(alert.alert_type);
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
