import Chip from "@/components/layout/Chip";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useOpenAutoinstallFileDetails } from "../../hooks";
import type { AutoinstallFile } from "../../types";
import AutoinstallFilesListActions from "../AutoinstallFilesListActions";
import classes from "./AutoinstallFilesList.module.scss";
import { getCellProps, getRowProps } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFile[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const openAutoinstallFileDetails = useOpenAutoinstallFileDetails();

  const columns = useMemo<Column<AutoinstallFile>[]>(
    () => [
      {
        accessor: "filename",
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFile>): ReactNode => (
          <div className={classes.container}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin u-no-padding--top"
              onClick={() => {
                openAutoinstallFileDetails(original);
              }}
            >
              {`${original.filename}, v${original.version}`}
            </Button>

            {original.is_default && <Chip value="Default" />}
          </div>
        ),
      },
      {
        accessor: "last_modified_at",
        Header: "Last edited",
        Cell: ({
          row: {
            original: { last_modified_at },
          },
        }: CellProps<AutoinstallFile>): ReactNode => (
          <div className="font-monospace">
            {moment(last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </div>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFile>): ReactNode => (
          <AutoinstallFilesListActions autoinstallFile={original} />
        ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={autoinstallFiles}
      emptyMsg="No autoinstall files found according to your search parameters."
      getCellProps={getCellProps}
      getRowProps={getRowProps}
    />
  );
};

export default AutoinstallFilesList;
