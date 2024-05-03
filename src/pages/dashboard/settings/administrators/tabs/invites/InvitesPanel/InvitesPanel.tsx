import moment from "moment";
import { FC, HTMLProps, useMemo } from "react";
import { Cell, CellProps, Column, TableCellProps } from "react-table";
import { Button, ModularTable } from "@canonical/react-components";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInvitations from "@/hooks/useInvitations";
import useNotify from "@/hooks/useNotify";
import { Invitation } from "@/types/Invitation";

const InvitesPanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { getInvitationsQuery, revokeInvitationQuery, resendInvitationQuery } =
    useInvitations();

  const { data: getInvitationsQueryResult } = getInvitationsQuery();

  const invitations = useMemo(
    () => getInvitationsQueryResult?.data.results ?? [],
    [getInvitationsQueryResult],
  );

  const { mutateAsync: revokeInvitation } = revokeInvitationQuery;
  const { mutateAsync: resendInvitation } = resendInvitationQuery;

  const handleRevokeInvitation = async (invitation: Invitation) => {
    try {
      await revokeInvitation({ id: invitation.id });

      notify.success({
        message: `${invitation.name}’${invitation.name.endsWith("s") ? "" : "s"} invitation has been revoked`,
        title: "You revoked an administrator invite",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRevokeInvitationDialog = (invitation: Invitation) => {
    confirmModal({
      title: `Revoke invitation for ${invitation.name}`,
      body: `This action will prevent ${invitation.name} from joining your Landscape organisation.`,
      buttons: [
        <Button
          key="revoke"
          appearance="negative"
          onClick={() => handleRevokeInvitation(invitation)}
        >
          Revoke invitation
        </Button>,
      ],
    });
  };

  const handleResentInvitation = async (invitation: Invitation) => {
    try {
      await resendInvitation({ id: invitation.id });

      notify.success({
        message: `${invitation.name} will receive a new invitation email`,
        title: "You resent an administrator invite",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleResentInvitationDialog = (invitation: Invitation) => {
    confirmModal({
      title: `Resend invitation for ${invitation.name}`,
      body: `${invitation.name} will receive a new invitation email`,
      buttons: [
        <Button
          key="resend"
          appearance="positive"
          onClick={() => handleResentInvitation(invitation)}
        >
          Resend invitation
        </Button>,
      ],
    });
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
        Header: "Created",
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
            <Button
              dense
              small
              className="u-no-margin--bottom"
              onClick={() => handleRevokeInvitationDialog(row.original)}
            >
              Revoke
            </Button>
            <Button
              dense
              small
              className="u-no-margin--bottom"
              onClick={() => handleResentInvitationDialog(row.original)}
            >
              Resend
            </Button>
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
      cellProps["aria-label"] = "Created";
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
