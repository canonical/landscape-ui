import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { Column, CellProps } from "react-table";
import type { SecurityProfile } from "../../types";

interface SecurityProfilesListProps {
  readonly securityProfiles: SecurityProfile[];
}

const SecurityProfilesList: FC<SecurityProfilesListProps> = ({
  securityProfiles,
}) => {
  const columns = useMemo<Column<SecurityProfile>[]>(
    () => [
      {
        accessor: "name",
        Cell: ({ row }: CellProps<SecurityProfile>) => row.original.name,
      },
    ],
    [securityProfiles],
  );

  return (
    <>
      <ModularTable
        emptyMsg="No activities found according to your search parameters."
        columns={columns}
        data={securityProfiles}
      />
    </>
  );
};

export default SecurityProfilesList;
