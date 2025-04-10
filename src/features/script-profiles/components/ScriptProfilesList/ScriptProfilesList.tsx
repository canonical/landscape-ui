import { Button, ModularTable } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import type { ScriptProfile } from "../../types";
import classes from "./ScriptProfilesList.module.scss";

interface ScriptProfilesListProps {
  readonly profiles: ScriptProfile[];
}

const ScriptProfilesList: FC<ScriptProfilesListProps> = ({ profiles }) => {
  const columns = useMemo<Column<ScriptProfile>[]>(
    () => [
      {
        Header: "Name",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin u-no-padding--top"
          >
            {profile.title}
          </Button>
        ),
      },

      {
        Header: "Status",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          profile.archived ? "Archived" : "Active",
      },

      {
        Header: "Associated instances",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          profile.computers.num_associated_computers
            ? `${profile.computers.num_associated_computers} instances`
            : "N/A",
      },

      {
        Header: "Tags",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          profile.tags.join(", "),
      },

      {
        Header: "Trigger",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => {
          switch (profile.trigger.trigger_type) {
            case "event": {
              switch (profile.trigger.event_type) {
                case "post_enrollment": {
                  return "Post enrollment";
                }

                default: {
                  return;
                }
              }
            }

            case "one-time": {
              return "On a date";
            }

            case "recurring": {
              return "Recurring";
            }
          }
        },
      },

      {
        Header: "Last run",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          profile.last_activity,
      },

      {
        className: classes.actions,
        Header: "Actions",
        Cell: () => null,
      },
    ],
    [],
  );

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      emptyMsg="No script profiles found according to your search parameters."
    />
  );
};

export default ScriptProfilesList;
