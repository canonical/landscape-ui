export const PARAMS = {
  ACCESS_GROUPS: "accessGroups",
  AVAILABILITY_ZONES: "availabilityZones",
  CURRENT_PAGE: "currentPage",
  DAYS: "days",
  DISABLED_COLUMNS: "disabledColumns",
  FROM_DATE: "fromDate",
  GROUP_BY: "groupBy",
  OS: "os",
  PAGE_SIZE: "pageSize",
  SEARCH: "search",
  SORT: "sort",
  SORT_BY: "sortBy",
  STATUS: "status",
  TAB: "tab",
  TAGS: "tags",
  TO_DATE: "toDate",
  TYPE: "type",
} as const;

export const ALLOWED_PAGE_SIZES = [20, 50, 100];

export const ALLOWED_DAY_OPTIONS = [1, 7, 30, 90, 180, 365];
