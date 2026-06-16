export const buildActivityExportQuery = ({
  query,
  selectedActivityIds,
}: {
  query?: string;
  selectedActivityIds?: number[];
}): string => {
  if (selectedActivityIds?.length) {
    return selectedActivityIds.map((id) => `id:${id}`).join(" OR ");
  }
  return query?.trim() ?? "";
};
