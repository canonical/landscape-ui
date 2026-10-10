import Chip from "@/components/layout/Chip";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { TableIcon } from "@/components/ui";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ROUTES } from "@/libs/routes";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { getDuplicateEmails, parseServerDateTime } from "../../helpers";
import type { StaffPeopleResult, StaffPersonResult } from "../../types";
import StaffPeopleListActions from "../StaffPeopleListActions";
import type { StaffPeopleRow } from "./helpers";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./StaffPeopleList.module.scss";

interface StaffPeopleListProps {
  readonly staffPeople: StaffPeopleResult[];
}

// The people API sends UTC timestamps without a zone.
const formatServerDateTime = (value: string): string =>
  parseServerDateTime(value).format(DISPLAY_DATE_TIME_FORMAT);

const DateTime: FC<{ readonly value: string }> = ({ value }) => (
  <span className="font-monospace">{formatServerDateTime(value)}</span>
);

const AccountLink: FC<{
  readonly account: string;
  readonly company: string;
}> = ({ account, company }) => (
  <StaticLink to={ROUTES.superAdmin.account(account)} title={company}>
    {account}
  </StaticLink>
);

const PersonAccounts: FC<{ readonly person: StaffPersonResult }> = ({
  person,
}) => {
  if (!person.accounts.length && !person.pending_invitations.length) {
    return <NoData />;
  }

  return (
    <span className={classes.accounts}>
      {person.accounts.map(({ account, company }) => (
        <AccountLink key={account} account={account} company={company} />
      ))}
      {person.pending_invitations.map(({ account, company, creation_time }) => (
        <span key={`${account}-${creation_time}`}>
          <AccountLink account={account} company={company} />{" "}
          <span
            className="u-text--muted"
            title={`Invited on ${formatServerDateTime(creation_time)}`}
          >
            (invited)
          </span>
        </span>
      ))}
    </span>
  );
};

const StaffPeopleList: FC<StaffPeopleListProps> = ({ staffPeople }) => {
  const duplicateEmails = useMemo(
    () => getDuplicateEmails(staffPeople),
    [staffPeople],
  );

  // `Column<T>` distributes over a union, so the cells narrow on `result.type`.
  const rows = useMemo<StaffPeopleRow[]>(
    () =>
      staffPeople.map((result) => ({
        name: result.name,
        email: result.email,
        result,
      })),
    [staffPeople],
  );

  const columns = useMemo<Column<StaffPeopleRow>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({
          row: {
            original: { result: original },
          },
        }: CellProps<StaffPeopleRow>): ReactNode => (
          <span className={classes.title}>
            {original.name}
            {original.type === "person" &&
              duplicateEmails.has(original.email.toLowerCase()) && (
                <Chip
                  value="Duplicate"
                  title="Another user on this page has the same email"
                />
              )}
            {original.type === "person" && !original.accounts.length && (
              <Chip value="No accounts" />
            )}
          </span>
        ),
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        id: "status",
        Header: "Status",
        Cell: ({
          row: {
            original: { result: original },
          },
        }: CellProps<StaffPeopleRow>): ReactNode => {
          if (original.type === "invitation") {
            return (
              <TableIcon icon="email">
                <span>
                  Invited <DateTime value={original.creation_time} />
                </span>
              </TableIcon>
            );
          }

          return original.identity ? (
            <TableIcon icon="security-tick">SSO</TableIcon>
          ) : (
            <TableIcon icon="user" className="u-text--muted">
              No SSO login yet
            </TableIcon>
          );
        },
        // Reserves the icon gutter that `TableIcon` renders into.
        getCellIcon: () => false,
      },
      {
        id: "accounts",
        Header: "Accounts",
        Cell: ({
          row: {
            original: { result: original },
          },
        }: CellProps<StaffPeopleRow>): ReactNode =>
          original.type === "person" ? (
            <PersonAccounts person={original} />
          ) : (
            <AccountLink
              account={original.account}
              company={original.company}
            />
          ),
      },
      {
        id: "last_login_time",
        Header: "Last login",
        Cell: ({
          row: {
            original: { result: original },
          },
        }: CellProps<StaffPeopleRow>): ReactNode =>
          original.type === "person" && original.last_login_time ? (
            <DateTime value={original.last_login_time} />
          ) : (
            <NoData />
          ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: {
            original: { result: original },
          },
        }: CellProps<StaffPeopleRow>): ReactNode => (
          <StaffPeopleListActions result={original} />
        ),
      },
    ],
    [duplicateEmails],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={rows}
      emptyMsg="No users or invitations found according to your search parameters."
      getCellProps={getCellProps}
      getRowProps={getRowProps}
    />
  );
};

export default StaffPeopleList;
