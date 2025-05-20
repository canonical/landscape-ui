import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RebootProfile } from "../../types";
import RebootProfilesListActions from "../RebootProfilesListActions";
import classes from "./RebootProfilesList.module.scss";

const RebootProfileDetails = lazy(
  async () => import("../RebootProfileDetails"),
);

interface RebootProfilesListProps {
  readonly profiles: RebootProfile[];
}

const RebootProfilesList: FC<RebootProfilesListProps> = ({ profiles }) => {
  const { setSidePanelContent } = useSidePanel();
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  const handleRebootProfileDetailsOpen = (profile: RebootProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <RebootProfileDetails
          key={profile.id}
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<RebootProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              handleRebootProfileDetailsOpen(original);
            }}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "access group",
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
          <>
            {accessGroupOptions.find(
              ({ value }) => value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
          <>{original.tags.join(", ") || <NoData />}</>
        ),
      },
      {
        accessor: "associated",
        Header: "associated",
        Cell: ({ row }: CellProps<RebootProfile>) =>
          row.original.num_computers ? (
            <>{row.original.num_computers} instances</>
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "scheduled_reboot",
        Header: "scheduled reboot",
        Cell: ({ row }: CellProps<RebootProfile>) => {
          return (
            <>
              {moment(row.original.next_run).format(DISPLAY_DATE_TIME_FORMAT)}
            </>
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<RebootProfile>) => (
          <RebootProfilesListActions profile={row.original} />
        ),
      },
    ],
    [filteredProfiles, accessGroupOptions.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No profiles found with the search: "${search}"`}
    />
  );
};

export default RebootProfilesList;
