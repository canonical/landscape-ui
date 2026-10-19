import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import {
  getRebootColumn,
  getRemovalColumn,
  hasAssociations,
  type Profile,
  ProfilesHeader,
  ProfileTypes,
  useGetProfileAssociatedCount,
  useOpenProfileSidePanel,
} from "@/features/profiles";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

/** The association count as text: a support session cannot open instances. */
const AssociatedCell: FC<{ readonly profile: Profile }> = ({ profile }) => {
  const { associatedCount } = useGetProfileAssociatedCount(profile);

  if (!hasAssociations(profile)) {
    return "---";
  }

  if (profile.all_computers) {
    return "All instances";
  }

  return pluralize(associatedCount, ["instance"], "exact");
};

interface SupportProfilesListProps {
  readonly type: ProfileTypes;
  readonly profiles: Profile[];
  readonly isPending: boolean;
}

/** The account's profiles of `type`, read-only: a name opens the details. */
const SupportProfilesList: FC<SupportProfilesListProps> = ({
  type,
  profiles,
  isPending,
}) => {
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();
  const openProfileSidePanel = useOpenProfileSidePanel();

  const filteredProfiles = useMemo(
    () =>
      search
        ? profiles.filter(({ title }) =>
            title.toLowerCase().includes(search.toLowerCase()),
          )
        : profiles,
    [profiles, search],
  );

  const columns = useMemo<Column<Profile>[]>(() => {
    const cols: Column<Profile>[] = [
      {
        accessor: "title",
        Header: "Profile name",
        meta: {
          ariaLabel: ({ original: profile }) =>
            `"${profile.title}" profile name`,
        },
        Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              openProfileSidePanel(profile, "view");
            }}
            aria-label={`Open "${profile.title}" profile details`}
          >
            {profile.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        meta: {
          ariaLabel: ({ original: profile }) =>
            `"${profile.title}" profile access group`,
        },
        Cell: ({ row: { original: profile } }: CellProps<Profile>) =>
          getTitleByName(profile.access_group, accessGroupsResponse),
      },
      {
        accessor: "associated",
        Header: "Associated",
        meta: {
          ariaLabel: ({ original: profile }) =>
            `"${profile.title}" profile associated instances`,
        },
        Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
          <AssociatedCell profile={profile} />
        ),
      },
    ];

    if (type === ProfileTypes.reboot) {
      cols.push(getRebootColumn());
    }

    if (type === ProfileTypes.removal) {
      cols.push(getRemovalColumn());
    }

    return cols;
  }, [accessGroupsResponse, openProfileSidePanel, type]);

  if (isPending) {
    return <LoadingState />;
  }

  if (!profiles.length && !search) {
    return <EmptyState title={`This account has no ${type} profiles.`} />;
  }

  return (
    <>
      <ProfilesHeader type={type} />
      <ResponsiveTable
        columns={columns}
        data={filteredProfiles}
        emptyMsg={`No ${type} profiles found according to your search parameters.`}
      />
    </>
  );
};

export default SupportProfilesList;
