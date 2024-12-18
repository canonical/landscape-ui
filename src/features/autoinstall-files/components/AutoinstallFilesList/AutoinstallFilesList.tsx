import { FC, useMemo } from "react";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Button, ModularTable } from "@canonical/react-components";
import { AutoinstallFile } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import { getCellProps } from "./helpers";
import { usePageParams } from "@/hooks/usePageParams";

interface AutoinstallFilesListProps {
  autoinstallFiles: AutoinstallFile[];
}

const PackageProfileList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const handleAutoinstallFileDetailsOpen = (profile: AutoinstallFile) => {
    setSidePanelContent(profile.name, null, "medium");
  };

  const files = useMemo(() => {
    if (!search) {
      return autoinstallFiles;
    }

    return autoinstallFiles.filter((file) => {
      return file.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [autoinstallFiles, search]);

  const columns = useMemo<Column<AutoinstallFile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<AutoinstallFile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handleAutoinstallFileDetailsOpen(original)}
          >
            {original.name}
          </Button>
        ),
      },
    ],
    [files],
  );

  return (
    <ModularTable columns={columns} data={files} getCellProps={getCellProps} />
  );
};

export default PackageProfileList;
