import type { FC } from "react";
import { useMemo } from "react";
import { type APTSource, useGetAPTSources } from "@/features/apt-sources";
import type { RepositoryProfile } from "../../types";
import LoadingState from "@/components/layout/LoadingState";
import type { CellProps, Column } from "react-table";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface RepositoryProfileDetailsAptSourcesTabProps {
  readonly profile: RepositoryProfile;
}

const ViewRepositoryProfileAptSourcesTab: FC<
  RepositoryProfileDetailsAptSourcesTabProps
> = ({ profile }) => {
  const { aptSources, isGettingAPTSources } = useGetAPTSources();
  const profileSources = aptSources.filter((source) =>
    source.profiles.includes(profile.name),
  );

  const columns = useMemo<Column<APTSource>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        id: "name",
        Cell: ({ row: { original: source } }: CellProps<APTSource>) =>
          source.name,
      },
      {
        accessor: "line",
        Header: "Line",
        id: "line",
        className: "long-cell",
        Cell: ({ row: { original: source } }: CellProps<APTSource>) =>
          source.line,
      },
    ],
    [],
  );

  if (isGettingAPTSources) {
    return <LoadingState />;
  }

  return (
    <ResponsiveTable
      columns={columns}
      data={profileSources}
      emptyMsg="No APT sources found for this profile."
      minWidth={320}
    />
  );
};

export default ViewRepositoryProfileAptSourcesTab;
