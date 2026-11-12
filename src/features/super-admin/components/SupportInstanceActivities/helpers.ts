interface ActivityFilters {
  readonly query: string;
  readonly status: string;
  readonly type: string;
  readonly fromDate: string;
  readonly toDate: string;
}

/** The activities query for the instance `instanceId`, narrowed by `filters`. */
export const getActivitiesQuery = (
  instanceId: number,
  { query, status, type, fromDate, toDate }: ActivityFilters,
): string =>
  [
    `computer:id:${instanceId}`,
    query,
    status && `status:${status}`,
    fromDate && `created-after:${fromDate}`,
    toDate && `created-before:${toDate}`,
    type && `type:${type}`,
  ]
    .filter(Boolean)
    .join(" ");

/** Whether any of `filters` narrows the list. */
export const isFiltering = (filters: ActivityFilters): boolean =>
  Object.values(filters).some(Boolean);
