import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useInvitations from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Invitation } from "@/types/Invitation";
import { ConfirmationButton, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, HTMLProps } from "react";
import { useMemo } from "react";
import type { Cell, CellProps, Column, TableCellProps } from "react-table";

const InvitesPanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { getInvitationsQuery, revokeInvitationQuery, resendInvitationQuery } =
    useInvitations();

  const { data: getInvitationsQueryResult } = getInvitationsQuery();

  const invitations = useMemo(
    () =>
      getInvitationsQueryResult?.data.results.sort((a, b) =>
        moment(b.creation_time).diff(moment(a.creation_time)),
      ) ?? [],
    [getInvitationsQueryResult],
  );

  const { mutateAsync: revokeInvitation, isPending: isRevokingInvitation } =
    revokeInvitationQuery;
  const { mutateAsync: resendInvitation, isPending: isResendingInvitation } =
    resendInvitationQuery;

  const handleRevokeInvitation = async (invitation: Invitation) => {
    try {
      await revokeInvitation({ id: invitation.id });

      notify.success({
        message: `${invitation.name}’${invitation.name.endsWith("s") ? "" : "s"} invitation has been revoked`,
        title: "You revoked an administrator invite",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleResendInvitation = async (invitation: Invitation) => {
    try {
      await resendInvitation({ id: invitation.id });

      notify.success({
        message: `${invitation.name} will receive a new invitation email`,
        title: "You resent an administrator invite",
      });
    } catch (error) {
      debug(error);
    }
  };

  const columns = useMemo<Column<Invitation>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        accessor: "creation_time",
        Header: "Invited",
        Cell: ({ row }: CellProps<Invitation>) =>
          moment(row.original.creation_time).format(DISPLAY_DATE_TIME_FORMAT),
      },
      {
        accessor: "expiration_time",
        Header: "Expires",
        Cell: ({ row }: CellProps<Invitation>) =>
          moment(row.original.creation_time)
            .add(14, "days")
            .format(DISPLAY_DATE_TIME_FORMAT),
      },
      {
        accessor: "actions",
        Cell: ({ row }: CellProps<Invitation>) => (
          <div className="u-align-text--right">
            <ConfirmationButton
              className="u-no-margin--bottom is-small is-dense"
              type="button"
              confirmationModalProps={{
                title: `Revoke invitation for ${row.original.name}`,
                children: (
                  <p>
                    This action will prevent {row.original.name} from joining
                    your Landscape organization.
                  </p>
                ),
                confirmButtonLabel: "Revoke invitation",
                confirmButtonAppearance: "negative",
                confirmButtonDisabled: isRevokingInvitation,
                confirmButtonLoading: isRevokingInvitation,
                onConfirm: async () => handleRevokeInvitation(row.original),
              }}
            >
              Revoke
            </ConfirmationButton>
            <ConfirmationButton
              className="u-no-margin--bottom is-small is-dense"
              type="button"
              confirmationModalProps={{
                title: `Resend invitation for ${row.original.name}`,
                children: (
                  <p>
                    {row.original.name} will receive a new invitation email.
                  </p>
                ),
                confirmButtonLabel: "Resend invitation",
                confirmButtonAppearance: "positive",
                confirmButtonDisabled: isResendingInvitation,
                confirmButtonLoading: isResendingInvitation,
                onConfirm: async () => handleResendInvitation(row.original),
              }}
            >
              Resend
            </ConfirmationButton>
          </div>
        ),
      },
    ],
    [invitations],
  );

  const handleCellProps = (cell: Cell<Invitation>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (cell.column.id === "name") {
      cellProps.role = "rowheader";
    } else if (cell.column.id === "email") {
      cellProps["aria-label"] = "Email";
    } else if (cell.column.id === "creation_time") {
      cellProps["aria-label"] = "Invited";
    } else if (cell.column.id === "expiration_time") {
      cellProps["aria-label"] = "Expires";
    } else if (cell.column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

  return (
    <>
      <p className="u-text--muted p-text--small">
        Unclaimed invitations expire after 14 days.
      </p>
      <ModularTable
        columns={columns}
        data={invitations}
        getCellProps={handleCellProps}
        emptyMsg="You have no unclaimed invitations."
      />
    </>
  );
};

export default InvitesPanel;
