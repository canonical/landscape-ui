import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  type Administrator,
  formatInvitationExpiration,
  type Invitation,
  useAdministrators,
} from "@/features/administrators";
import date from "@/libs/date";
import AppTabs from "@/components/AppTabs";
import { Badge } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

const ADMINISTRATOR_COLUMNS: Column<Administrator>[] = [
  { accessor: "name", Header: "Name" },
  { accessor: "email", Header: "Email" },
  {
    accessor: "roles",
    Header: "Roles",
    Cell: ({ row: { original } }: CellProps<Administrator>) =>
      original.roles.join(", "),
  },
];

const INVITATION_COLUMNS: Column<Invitation>[] = [
  { accessor: "name", Header: "Name" },
  { accessor: "email", Header: "Email" },
  {
    accessor: "creation_time",
    Header: "Invited",
    Cell: ({ row: { original } }: CellProps<Invitation>) =>
      date(original.creation_time).format(DISPLAY_DATE_TIME_FORMAT),
  },
  {
    id: "expiration_time",
    Header: "Expires",
    Cell: ({ row: { original } }: CellProps<Invitation>) =>
      formatInvitationExpiration(original),
  },
];

/** The entered account's administrators and pending invitations, read-only. */
const SupportAdministrators: FC = () => {
  const { getAdministratorsQuery, getInvitationsQuery } = useAdministrators();
  const {
    data: administratorsData,
    isPending: isGettingAdministrators,
    error: administratorsError,
  } = getAdministratorsQuery();
  const {
    data: invitationsData,
    isPending: isGettingInvitations,
    error: invitationsError,
  } = getInvitationsQuery();

  const administrators = useMemo(
    () => administratorsData?.data ?? [],
    [administratorsData],
  );
  // The list is one page; the badge counts them all.
  const invitationsCount = invitationsData?.data.count ?? 0;
  const invitations = useMemo(
    () =>
      [...(invitationsData?.data.results ?? [])].sort((a, b) =>
        date(b.creation_time).diff(date(a.creation_time)),
      ),
    [invitationsData],
  );

  const error = administratorsError ?? invitationsError;

  if (error) {
    throw error;
  }

  if (isGettingAdministrators || isGettingInvitations) {
    return <LoadingState />;
  }

  return (
    <AppTabs
      aria-label="Administrator settings"
      items={[
        {
          id: "administrators",
          label: "Administrators",
          panel: (
            <ResponsiveTable
              columns={ADMINISTRATOR_COLUMNS}
              data={administrators}
              emptyMsg="This account has no administrators."
            />
          ),
        },
        {
          id: "invites",
          label: "Invites",
          slot: invitationsCount ? (
            <Badge value={invitationsCount} />
          ) : undefined,
          panel: (
            <ResponsiveTable
              columns={INVITATION_COLUMNS}
              data={invitations}
              emptyMsg="This account has no pending invitations."
            />
          ),
        },
      ]}
    />
  );
};

export default SupportAdministrators;
