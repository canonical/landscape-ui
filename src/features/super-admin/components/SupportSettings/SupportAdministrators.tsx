import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  type Administrator,
  type Invitation,
  useAdministrators,
} from "@/features/administrators";
import date from "@/libs/date";
import { Tabs } from "@canonical/react-components";
import { Badge } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";

const INVITATION_LIFETIME_DAYS = 14;

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
      date(original.creation_time)
        .add(INVITATION_LIFETIME_DAYS, "days")
        .format(DISPLAY_DATE_TIME_FORMAT),
  },
];

type TabId = "administrators" | "invites";

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

  const [tabId, setTabId] = useState<TabId>("administrators");

  const administrators = administratorsData?.data ?? [];
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

  const tabs: { id: TabId; label: React.ReactNode }[] = [
    { id: "administrators", label: "Administrators" },
    {
      id: "invites",
      label: (
        <>
          <span>Invites</span>
          {!!invitationsCount && <Badge value={invitationsCount} />}
        </>
      ),
    },
  ];

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabs.map(({ id, label }) => ({
          id: `tab-link-${id}`,
          label,
          role: "tab",
          "aria-controls": `tab-panel-${id}`,
          active: id === tabId,
          onClick: () => {
            setTabId(id);
          },
        }))}
      />
      <div
        id={`tab-panel-${tabId}`}
        role="tabpanel"
        aria-labelledby={`tab-link-${tabId}`}
        tabIndex={0}
      >
        {tabId === "administrators" && (
          <ResponsiveTable
            columns={ADMINISTRATOR_COLUMNS}
            data={administrators}
            emptyMsg="This account has no administrators."
          />
        )}
        {tabId === "invites" && (
          <ResponsiveTable
            columns={INVITATION_COLUMNS}
            data={invitations}
            emptyMsg="This account has no pending invitations."
          />
        )}
      </div>
    </>
  );
};

export default SupportAdministrators;
